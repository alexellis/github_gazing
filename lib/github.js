"use strict"

var request = require('request');

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
          act.repo.name.indexOf(this.config.username) == 0;
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
}

module.exports = Github;
