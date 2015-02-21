var splitter = require('./splitToSets');
var tiles = require('../proto/tiles');
var _ = require('lodash');
var assert = require('assert');
var makeHand = require('../test/makeHand');

describe('Hand set splitter', function() {
    it.skip('should detect the kokushi hand', function() {
        var hand = makeHand('1p 9p 1m 9m 1s 9s e s w n rd wd gd'); // 13 tiles hand

        var testHands = [
            _.clone(hand).push(tiles.pin9),
            _.clone(hand).splice(5, 0, tiles.ton),
            _.shuffle(_.clone(hand).push(tiles.chun))
        ];

        _.each(testHands, function(hand) {
            var result = splitter(hand);
            assert.equal(result.sets.length, 0);
            assert.equal(result.pairs.length, 1);
        });
    });

    it('should detect all pons hand', function() {
        var hand = makeHand('4s 4s 4s 7m 7m 7m e e e 1p 1p 1p 2m 2m'); // 14 tiles

        var result = splitter(hand);
        assert.equal(result.sets.length, 4);
        assert.equal(result.pairs.length, 1);
        assert.equal(result.isFinishedHand, true);
    });

    it('should detect shuffled all pons hand', function() {
        var hand = makeHand('4s 4s 4s 7m 7m 7m e e e 1p 1p 1p 2m 2m'); // 14 tiles

        result = splitter(_.shuffle(hand));
        assert.equal(result.sets.length, 4);
        assert.equal(result.pairs.length, 1);
        assert.equal(result.isFinishedHand, true);
    });
});
