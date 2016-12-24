"use strict";

let moment = require("moment");
let request = require("request");
class WebhookPublisher {
    constructor(config) {
        this.config = config;
    }

    publish(notifications, done) {
        let makePostOptions = function(uri) {
            return   {
                body: notifications,
                json: true,
                uri: uri
            };
        };

        if(this.config.webhooks) {
            let errors = [];
            let work = this.config.webhooks.length;
            
            this.config.webhooks.forEach((hook) => {
                let postOptions = makePostOptions(hook.url);
                request.post(postOptions, (err, res, body) => {
                    console.log("Sending webhook [" + hook.id+"]");
                    if(err) {
                        console.error(err);
                        errors.push(err);
                    }
                    work--;
                    if(!work) {
                        if(errors.length) {
                            done(errors);
                        } else {
                            done(err);
                        }
                    }
                });
            });
        }
    }
};

module.exports = WebhookPublisher;