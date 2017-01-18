"use strict"

var Email = require('./email');
var moment = require('moment');

module.exports = class EmailPublisher {
  constructor(config, key) {
    this.config = config;
    this.email = new Email(this.config, key.sendgrid_key);
  }

  _buildSubject(differences) {
    var starCount = differences.stars.length;
    var forkCount = differences.forks.length;
    var subject;
    if(starCount && forkCount) {
      subject = starCount + " star(s) and " + forkCount + " fork(s)."
    } else if(starCount) {
      subject = starCount + " star(s)"
    } else if(forkCount) {
      subject = forkCount + " fork(s)"
    }
    return subject;
  }

  _build(notifications, userProfiles) {
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

    return buffer;
  }

  publish(differences, userProfiles, done) {
    var starCount = differences.stars.length;
    var forkCount = differences.forks.length;

    var subject = this._buildSubject(differences);
    var text = this._build(differences, userProfiles);

    console.log("Sending email.");

    var message = {
      to      : this.config.email_to,
      toname  : this.config.email_name,
      subject : subject,
      html    : "<html><body><pre>" +  text + "</pre></body></html>"
    };

    this.email.send(message, done);
  }
}
