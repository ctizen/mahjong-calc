var tiles = require('../proto/tiles');
var sets = require('../proto/sets');
var _ = require('lodash');
var assert = require('chai').assert;
var makeHand = require('../test/makeHand');
var yakuCalc = require('./calcYaku');
var yakuList = require('../proto/yakuList').yaku;

function sortYakuList(items) {
    return _.sortBy(items, function(item) {
        return item.toString();
    });
}

function log(item) {
    console.log(require('util').inspect(item, true, 10)); // 10 levels deep
}

describe.only('Yaku calculator units', function() {
    it('Should detect toitoi hand', function() {
        var hand = makeHand('e e 3s 3s 3s 7p 7p 7p'); // 8 tiles
        var result = yakuCalc(hand, [
            sets.pon([tiles['sha']], true),
            sets.pon([tiles['pin3']], true)
        ], tiles['e'], false, tiles['nan'], tiles['nan']);
        var expected = [
            yakuList.toitoi
        ];
        assert.sameDeepMembers(
            _.map(result, sortYakuList),
            _.map(expected, sortYakuList)
        );
    });
});
