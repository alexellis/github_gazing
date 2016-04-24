"use strict"
var redis = require('redis');
var moment = require('moment');

const UserRepo = require('./userrepo.js');
const Github = require('./github.js');

const key = require('./key.json');
const config = require('./config.json');

var userRepo = new UserRepo(config, redis);
var github = new Github(config, key);

userRepo.getStored().then((stored) => {
  github.fetchActivity().then((notifications) => {
    // console.log(notifications);

    notifications.stars.forEach((star)=>{
      console.log( moment(star.created_at).fromNow() + "\t" + star.user_name + " starred " + star.repo_name + " ");
    });

    console.log("");
    notifications.forks.forEach((fork)=>{
      console.log( moment(fork.created_at).fromNow() + "\t" + fork.user_name + " fork'd " + fork.repo_name + " ");
    });

    userRepo.store(notifications).then(()=> {
      console.log("Updates stored");

    }).catch(e => {console.error(e);});
  }).catch(e => {console.error(e)});
}).catch(e => {console.error(e)});
