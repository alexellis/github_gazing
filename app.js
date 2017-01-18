"use strict"
//var redis = require('redis');
var fs = require('fs');
var moment = require('moment');
var Compare = require('./lib/compare.js');

const UserRepo = require('./lib/userrepo.js');
const Github = require('./lib/github.js');
const EmailPublisher = require("./notify/emailpublisher.js");
const TerminalPublisher = require("./lib/terminalpublisher.js");
const WebhookPublisher = require("./lib/webhookpublisher.js");

const key = require('./key.json');
const config = require('./config.json');

var userRepo = new UserRepo(config, fs);
var github = new Github(config, key);

userRepo.getStored().then((stored) => {
  github.fetchActivity().then((notifications) => {
    // console.log(notifications);
    if(stored) {
      var comparer = new Compare();
      var difference = comparer.difference(stored.stars, notifications.stars);
      var forkDifference = comparer.difference(stored.forks, notifications.forks);
      var packages =  {stars: difference, forks: forkDifference};

      var userNames = getUsernames(difference, forkDifference);
      github.fetchUsers(userNames).then((userProfiles) => {
        publish(difference, forkDifference, packages , userProfiles);
      });
    } else {
      var terminalPublisher = new TerminalPublisher();
      terminalPublisher.publish(notifications, () => {
        console.log("Done, nothing stored yet.")
      });
    }

    userRepo.store(notifications).then(()=> {
      console.log("Updates stored");

    }).catch(e => {console.error(e, e.stack);});
  }).catch(e => {console.error(e, e.stack)});
}).catch(e => {console.error(e, e.stack)});


let getUsernames = (stars, forks) => {
  var names = [];
  stars.forEach((s)=> {
    if(names.indexOf(s.user_name) == -1) {
      names.push(s.user_name);
    }
  });
  forks.forEach((f)=> {
    if(names.indexOf(f.user_name) == -1) {
      names.push(f.user_name);
    }
  });
  return names;
};

let publish = (difference, forkDifference, packages, userProfiles) => {
  var terminalPublisher = new TerminalPublisher();
  terminalPublisher.publish(packages, userProfiles, () => {
    if(difference.length || forkDifference.length) {

      // Todo: use-callback chaining
      let promises = [];
      if(config.send_emails) {
        let promise = new Promise((resolve, reject)=> {
          var publisher = new EmailPublisher(config, key);
          publisher.publish(packages, userProfiles, function(err, done) {
            if(err) {
              console.error(err);
            }
            resolve();
          });
        });
        promises.push(promise);
      }

      if(config.publish_webhooks) {
        let promise = new Promise((resolve, reject)=> {
          console.log("publish_webhooks")
          var publisher = new WebhookPublisher(config);
          publisher.publish(packages, function(err, done) {
            if(err) {
              console.error(err);
            }
            resolve();
          });
        });
        promises.push(promise);
      }
      
      Promise.all(promises).then(() => {
        console.log("All publishers done.")
      }).catch((err) => {
        console.error("Some publishers failed: " + err);
      });
    }
  });
};