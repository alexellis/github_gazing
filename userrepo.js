"use strict"

class UserRepo {
  constructor(config, redis) {
    this.config = config;
    this.redis = redis;
  }

  getStored() {
    return new Promise( (resolve, reject) => {
      const client = this.redis.createClient({host: this.config.redis_host, port: this.config.redis_port });
      client.on('connect', function() {
        client.get("activities", function(err, set) {
          if(err) {
            return reject(err);
          }
          client.quit();
          return resolve(JSON.parse(set));
        });
      });
      client.on('error', (err)=> { client.quit(); reject(err);});
    });
  }

  store(activities) {
    return new Promise( (resolve, reject) => {
      const client = this.redis.createClient({host: this.config.redis_host, port: this.config.redis_port });

      client.on('connect', function() {
        client.set("activities", JSON.stringify(activities), function(err) {
          if(err) {
            return reject(err);
          }
          client.quit();
          return resolve();
        });
      });
      client.on('error', (err)=> { client.quit(); reject(err);});
    });
  }
}

module.exports = UserRepo;
