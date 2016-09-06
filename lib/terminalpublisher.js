"use strict";

let moment = require("moment");

module.exports = class TerminalPublisher {
  publish(stars, forks) {
    stars.forEach((star)=> {
      console.log( moment(star.created_at).fromNow() + "\t" + star.user_name + " starred " + star.repo_name + " ");
    });

    console.log("");
    forks.forEach((fork)=> {
      console.log( moment(fork.created_at).fromNow() + "\t" + fork.user_name + " fork'd " + fork.repo_name + " ");
    });
  }
};

