"use strict"

var request = require('request');
let async = require('async');

class Github {
  constructor(config, key) {
    this.config = config;
    this.key = key;
  }

  _formatActivities(watchEvents) {
    var activities = {stars:[], forks: []};

    // Watch Events, belonging to me, action = started.
    var filtered = watchEvents.filter((act) =>
    {
        let included = (act.type == "WatchEvent" || act.type == "ForkEvent") &&
          (act.payload.action == 'started' || act.payload.forkee) &&
          act.repo.name.indexOf(this.config.username) == 0 || this.config.usernames.indexOf(act.repo.name) > -1;
        return included;
    });

    // Compress data
    filtered.forEach((activity) => {
      var collection;
      if(activity.payload.action == 'started') {
        collection = activities.stars;
      } else if(activity.payload.forkee) {
        collection = activities.forks;
      }

      collection.push(
      {
          id:         activity.id,
          repo_name:  activity.repo.name,
          user_name:  activity.actor.login,
          created_at: activity.created_at
      });
    });

    function compareDate(a, b) {
      let prev = new Date(a.created_at).getTime();
      let next = new Date(b.created_at).getTime();
      if(prev > next) {
        return 1;
      } else if(prev < next) {
        return -1;
      }
      return 0;
    }

    activities.stars = activities.stars.sort((x,y) => { return compareDate(x, y); });
    activities.forks = activities.forks.sort((x,y) => { return compareDate(x, y); });

    return activities;
  }

  fetchActivity() {
    return new Promise( (resolve, reject) => {
      var url = "https://api.github.com/users/" + this.config.username + "/received_events";
      var options = {
        "url": url,
        "json": true,
        "headers": {
          "Authorization": "token " + this.key.access_token,
          "User-Agent": this.config.username
        }
      };
      request.get(options, (err, res, body) => {
        if(err) {
          return reject(err);
        }
        return resolve(this._formatActivities(body));
      });
    });
  }

  fetchUsers(userNames) {
    console.log("Looking up " + userNames.length + " username(s).");
    return new Promise( (resolve, reject) => {
        let userProfiles = [];

        var q = async.queue((task, cb) => {
          this.fetchUser(task, (err, profile) => {
            userProfiles.push(profile);
            cb();
          });
        });

        q.drain = (err) => {
          if(err) {
            return reject(err);
          }
          return resolve(userProfiles);
        }

        q.push(userNames);
    });
  }

  fetchUser(username, done) { 
    var url = "https://api.github.com/users/" + username;
      var options = {
          "url": url,
          "json": true,
          "headers": {
          "Authorization": "token " + this.key.access_token,
          "User-Agent": this.config.username
          }
      };

      request.get(options, (err, res, body) => {
          if(err) {
              return  done(err, body);
          }
          var keys = [
            "login", "avatar_url", "type", "name", "company", "blog", "location", "public_repos", "followers", "created_at"
          ];
          var result = {};
          keys.forEach((key) => {
            result[key] = body[key]
          })
          if(!result.login) {
            result.login = username;
          }
          
          return done(err, result);
      });
  }
}

module.exports = Github;
 
