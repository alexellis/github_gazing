"use strict"

class Compare {
  constructor() {

  }

  difference (before, after) {
    // id / repo_name / user_name / created_at;
    var added = [];

    after.forEach(function(afterItem) {
      var matching = before.filter((b) => { return b.id == afterItem.id; });

      if(!matching.length) {
        added.push(afterItem);
      }
    });

    return added;
  }
}

module.exports = Compare;

