"use strict"

var SendGrid = require('sendgrid');

module.exports = class Email {
  constructor(config, sendgrid_key) {
    this.config = config;
    this.sendgrid_key = sendgrid_key;
    this.sendgrid = new SendGrid(this.sendgrid_key);
  }

  send(message, callback) {
    var sender = this.config.email_from;

    message.from = sender;
    message.fromname = sender;

    this.sendgrid.send(message, (err, json) => {
      callback(err, json);
    });
  }
}
