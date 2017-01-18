"use strict";

let moment = require("moment");

module.exports = class TerminalPublisher {
  publish(notifications, userProfiles, done) {

    var buffer = "";
    userProfiles.forEach((p) => {
    buffer += "User: " + p.login + (  p.name ? " (" +p.name+ ")" : "" ) + (p.blog ? " " +p.blog: "")  + ".\n";
    buffer += "Repos: " + p.public_repos + ", followers: " + p.followers + ", joined: " + moment(p.created_at).fromNow() + ".\n";
      if(p.company) {
        buffer += "Company: " + p.company + "\n";
      }
      if(p.location) {
        buffer += "Location: " + p.location + "\n";
      }

      buffer += "\n";
      notifications.stars.forEach((star)=> {
        if(star.user_name == p.login) {
          buffer += "   * Starred " + star.repo_name + " " + moment(star.created_at).fromNow() + "\n";
        }
      });
      notifications.forks.forEach((fork)=> {
        if(fork.user_name == p.login) {
          buffer += "   * Forked " + fork.repo_name + " " + moment(fork.created_at).fromNow() + "\n";
        }
      });
      buffer += "\n";
    });

    console.log(buffer);
    done();
  }
};
