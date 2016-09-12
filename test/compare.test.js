var Compare = require('../lib/compare');
var expect = require('chai').expect;

describe("compares activity streams", function() {
  it("finds nothing with empty lists", function() {
      var compare = new Compare();
      var before = [];
      var after = [];

      var found = compare.difference(before, after);
      expect(found.length).to.equal(0);
  });

  it("finds one item different in afer list by id", function() {
      var compare = new Compare();

      var before = [{id:1}];
      var after =  [{id:1}, {id:2}];

      var found = compare.difference(before, after);
      expect(found.length).to.equal(1);
  });

  it("ignores old unique items in before list", function() {
      var compare = new Compare();

      var before = [{id:1}, {id:2}, {id:3}];
      var after = [{id:3}];

      var found = compare.difference(before, after);
      expect(found.length).to.equal(0);
  });

});

