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

  _build(differences) {
    var stars = differences.stars;
    var forks = differences.forks;
    var text = "";

    forks.forEach(f => {
      text += f.repo_name + " forked by " + f.user_name+ " " + moment(f.created_at).fromNow() + "\n\n";
    });

    if(text.length) {
      text += "\n\n";
    }

    stars.forEach(f => {
      text += f.repo_name + " starred by " + f.user_name + " " + moment(f.created_at).fromNow() + "\n\n";
    });

    return text;
  }

  publish(differences, done) {
    var starCount = differences.stars.length;
    var forkCount = differences.forks.length;

    var subject = this._buildSubject(differences);
    var text = this._build(differences);

    console.log("Sending email.");

    var message = {
      to      : this.config.email_to,
      toname  : this.config.email_name,
      subject : subject,
      text    : text
    };
    this.email.send(message, done);
  }
}
