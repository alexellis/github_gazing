"use strict"

class Compare {
  constructor() {

  }

  difference (before, after) {
    // id / repo_name / user_name / created_at;
    var added = [];
    for(var i = 0 ; i < after.length; i++) {
      if(before.filter(f => {return f.id == after[i].id} ).length>0) {
        added.push(after[i]);
      }
    }
    return added;
  }
}

module.exports = Compare;
