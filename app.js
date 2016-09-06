"use strict"
//var redis = require('redis');
var fs = require('fs');
var moment = require('moment');
var Compare = require('./lib/compare.js');

const UserRepo = require('./lib/userrepo.js');
const Github = require('./lib/github.js');
const EmailPublisher = require("./notify/emailpublisher.js");
const TerminalPublisher = require("./lib/terminalpublisher.js");

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
