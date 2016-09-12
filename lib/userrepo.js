"use strict"

class UserRepo {
  constructor(config, fs) {
    this.config = config;
    this.fs = fs;
  }

  getStored() {
    return new Promise((resolve, reject) => {
      this.fs.exists(this.config.datastore, (stat) => {
        if(!stat) {
          var activities = {stars:[], forks: []};
          return resolve(activities);
        }

        this.fs.readFile(this.config.datastore, "utf8", (err, data) => {
          if(err) {
            return reject(err);
          }
          resolve(JSON.parse(data));
        });
      });
    });
  }

  store(activities) {
    return new Promise( (resolve, reject) => {
      this.fs.writeFile(this.config.datastore, JSON.stringify(activities) , "utf8", function(err) {
        if(err) {
          return reject(err);
        }
        resolve();
      });
    });
  }
}

module.exports = UserRepo;
