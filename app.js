"use strict"
//var redis = require('redis');
var fs = require('fs');
var moment = require('moment');
var Compare = require('./compare');

const UserRepo = require('./userrepo.js');
const Github = require('./github.js');

const key = require('./key.json');
const config = require('./config.json');
const EmailPublisher = require("./emailpublisher.js");

var userRepo = new UserRepo(config, fs);
var github = new Github(config, key);

class TerminalPublisher {
  publish(stars, forks) {
    stars.forEach((star)=> {
      console.log( moment(star.created_at).fromNow() + "\t" + star.user_name + " starred " + star.repo_name + " ");
    });

    console.log("");
    forks.forEach((fork)=> {
      console.log( moment(fork.created_at).fromNow() + "\t" + fork.user_name + " fork'd " + fork.repo_name + " ");
    });
  }
}

userRepo.getStored().then((stored) => {
  github.fetchActivity().then((notifications) => {
    // console.log(notifications);
    if(stored) {
      var comparer = new Compare();
      var difference = comparer.difference(stored.stars, notifications.stars);
      var forkDifference = comparer.difference(stored.forks, notifications.forks);

      var terminalPublisher = new TerminalPublisher();
      terminalPublisher.publish(difference, forkDifference);

      if(difference.length || forkDifference.length) {
        var packages =  {stars: difference, forks: forkDifference};
        if(config.send_emails) {
          var publisher = new EmailPublisher(config, key);
          publisher.publish(packages, function(err, done) {
            if(err) {
              console.error(err);
            }
          });
        }
      }
    } else {
      var terminalPublisher = new TerminalPublisher();
      terminalPublisher.publish(notifications.stars, notifications.forks);
    }

    userRepo.store(notifications).then(()=> {
      console.log("Updates stored");

    }).catch(e => {console.error(e, e.stack);});
  }).catch(e => {console.error(e, e.stack)});
}).catch(e => {console.error(e, e.stack)});
