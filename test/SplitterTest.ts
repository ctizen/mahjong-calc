/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />

import _ = require('../libdefs/lodash');
import chai = require('chai');
import Splitter = require('../modules/Splitter');
import Tile = require('../proto/Tile');
import TileSet = req('../proto/TileSet');
import makeTileArray = require('../helpers/makeTileArray');
import sortItems = require('../helpers/sortItems');
import logEx = require('../helpers/logEx');

var assert = chai.assert;

describe('Hand set splitter units', function() {
    it('should unify items', function() {
        var items = [
            TileSet.pair(Tile.man6),
            TileSet.pon(Tile.pin3),
            TileSet.pair(Tile.pin3),
            TileSet.pair(Tile.man6),
            TileSet.pon(Tile.pin3),
            TileSet.pair(Tile.pin3)
        ];

        var expected = [
            TileSet.pair(Tile.man6),
            TileSet.pon(Tile.pin3),
            TileSet.pair(Tile.pin3)
        ];

        assert.sameDeepMembers(Splitter._unify(items), expected);
    });

    it('should unify nested items', function() {
        var items = Splitter._unify([
            [
                TileSet.pair(Tile.man6),
                TileSet.pair(Tile.pin3),
                TileSet.pon(Tile.pin3)
            ],
            [
                TileSet.pair(Tile.man6),
                TileSet.pon(Tile.pin3),
                TileSet.pair(Tile.pin3)
            ]
        ]);

        var expected = [[
            TileSet.pair(Tile.man6),
            TileSet.pon(Tile.pin3),
            TileSet.pair(Tile.pin3)
        ]];

        var actualSorted = _.transform(items, sortItems);
        var expectedSorted = _.transform(expected, sortItems);

        assert.sameDeepMembers(actualSorted, expectedSorted);
    });

    it('should count tiles', function() {
        var hand = makeTileArray('1p 2s 9m 6m 6m e wd 8s 2s e wd 1p 9m 8s');
        var expected = {
            'pin1': 2,
            'sou2': 2,
            'man9': 2,
            'man6': 2,
            'ton': 2,
            'haku': 2,
            'sou8': 2
        };

        assert.deepEqual(Splitter._countTiles(hand), expected);
    });

    it('should find pairs and pons', function() {
        var hand = makeTileArray('3p 3p 3p 6m 6m 3s 4s 5s 1m 1m 1m e s w');
        var expected = [
            TileSet.pair(Tile.man6),
            TileSet.pon(Tile.pin3),
            TileSet.pair(Tile.pin3),
            TileSet.pon(Tile.man1),
            TileSet.pair(Tile.man1)
        ];

        assert.sameDeepMembers(Splitter._findTriplesAndPairs(hand), expected);
    });

    it('should find pairs and pons in ryanpeiko', function() {
        var hand = makeTileArray('1p 1p 2p 2p 3p 3p 4s 4s 5s 5s 6s 6s 9m 9m');
        var expected = [
            TileSet.pair(Tile.pin1),
            TileSet.pair(Tile.pin2),
            TileSet.pair(Tile.pin3),
            TileSet.pair(Tile.sou4),
            TileSet.pair(Tile.sou5),
            TileSet.pair(Tile.sou6),
            TileSet.pair(Tile.man9)
        ];

        assert.sameDeepMembers(Splitter._findTriplesAndPairs(hand), expected);
    });

    it('should find sequences', function() {
        var hand = makeTileArray('1m 2m 3m 5s 6s 7s 8s 9s 2p 3p 5p e s w');
        var expected = [
            TileSet.chi([Tile.man1, Tile.man2, Tile.man3]),
            TileSet.chi([Tile.sou5, Tile.sou6, Tile.sou7]),
            TileSet.chi([Tile.sou6, Tile.sou7, Tile.sou8]),
            TileSet.chi([Tile.sou7, Tile.sou8, Tile.sou9])
        ];

        assert.sameDeepMembers(Splitter._findSequences(hand), expected);
    });

    it('should find sequences in ryanpeiko', function() {
        var hand = makeTileArray('1p 1p 2p 2p 3p 3p 4s 4s 5s 5s 6s 6s 9m 9m');
        var expected = [
            TileSet.chi([Tile.pin1, Tile.pin2, Tile.pin3]),
            TileSet.chi([Tile.sou4, Tile.sou5, Tile.sou6])
        ];

        assert.sameDeepMembers(Splitter._findSequences(hand), expected);
    });

    it('should perform partial split check', function() {
        var hand = makeTileArray('1m 2m 3m 5s 6s 7s 8s 9s 2p 3p e e s w');
        var goodSplit = [
            TileSet.chi([Tile.man1, Tile.man2, Tile.man3]),
            TileSet.chi([Tile.sou7, Tile.sou8, Tile.sou9]),
            TileSet.pair(Tile.ton)
        ];
        var badSplit = [
            TileSet.chi([Tile.sou5, Tile.sou6, Tile.sou7]),
            TileSet.chi([Tile.sou6, Tile.sou7, Tile.sou8]),
            TileSet.pair(Tile.ton)
        ];

        assert.equal(Splitter._checkPartialSplit(hand, goodSplit), true, 'Good split did not pass!');
        assert.equal(Splitter._checkPartialSplit(hand, badSplit), false, 'Bad split passed!');
    });

    it('should perform strict partial split check', function() {
        var hand = makeTileArray('1m 2m 3m 4s 5s 6s 7s 8s 9s 2p 3p 4p e e');
        var goodSplit = [
            TileSet.chi([Tile.man1, Tile.man2, Tile.man3]),
            TileSet.chi([Tile.sou4, Tile.sou5, Tile.sou6]),
            TileSet.chi([Tile.sou7, Tile.sou8, Tile.sou9]),
            TileSet.chi([Tile.pin2, Tile.pin3, Tile.pin4]),
            TileSet.pair(Tile.ton)
        ];
        var badSplit = [
            TileSet.chi([Tile.man1, Tile.man2, Tile.man3]),
            TileSet.chi([Tile.sou4, Tile.sou5, Tile.sou6]),
            TileSet.chi([Tile.sou6, Tile.sou7, Tile.sou8]),
            TileSet.chi([Tile.sou7, Tile.sou8, Tile.sou9]),
            TileSet.pair(Tile.ton)
        ];

        assert.equal(Splitter._checkPartialSplit(hand, goodSplit, true), true, 'Good split did not pass!');
        assert.equal(Splitter._checkPartialSplit(hand, badSplit, true), false, 'Bad split passed!');
    });

    it('should find all possible splits', function() {
        var hand = makeTileArray('1p 1p 2p 2p 3p 3p 4s 4s 5s 5s 6s 6s 9m 9m');
        var expected = [
            [
                TileSet.chi([Tile.pin1, Tile.pin2, Tile.pin3]),
                TileSet.chi([Tile.pin1, Tile.pin2, Tile.pin3]),
                TileSet.chi([Tile.sou4, Tile.sou5, Tile.sou6]),
                TileSet.chi([Tile.sou4, Tile.sou5, Tile.sou6]),
                TileSet.pair(Tile.man9)
            ],
            [
                TileSet.pair(Tile.pin1),
                TileSet.pair(Tile.pin2),
                TileSet.pair(Tile.pin3),
                TileSet.pair(Tile.sou4),
                TileSet.pair(Tile.sou5),
                TileSet.pair(Tile.sou6),
                TileSet.pair(Tile.man9)
            ]
        ];
        var actual = Splitter._findPossibleSplits(hand, Splitter._findSequences(hand).concat(Splitter._findTriplesAndPairs(hand)));

        assert.sameDeepMembers(
            _.transform(actual, sortItems),
            _.transform(expected, sortItems)
        );
    });
});

describe('Hand set splitter typical cases', function() {
    it('should detect not-ready hand', function() {
        var hand = makeTileArray('1p 2p 3p 5m 6m 7m e e e 3s 4s 6s wd wd');
        var result = Splitter.split(hand);

        assert.equal(result.length, 1);
        assert.equal(result[0].isFinishedHand(), false);
    });

    it('should detect the kokushi hand', function() {
        var testHands = [
            makeTileArray('1p 9p 1m 9m 1s 9s e s w n rd wd gd e'),
            makeTileArray('1p 9p 1m 9m 1m 1s 9s e s w n rd wd gd'),
            _.shuffle(makeTileArray('1p 9p 1m 9m 1s 9s e s w n rd wd gd e'))
        ];

        _.each(testHands, function(hand) {
            var result = Splitter.split(hand);
            assert.equal(result.length, 1);
            assert.equal(result[0].isKokushi(), true);
            assert.equal(result[0].isFinishedHand(), true);
        });
    });

    it('should detect the chiitoitsu hand', function() {
        var hand = makeTileArray('1p 1p 9m 9m 2s 2s e e wd wd 6m 6m 8s 8s');

        var testHands = [
            _.clone(hand),
            _.shuffle(_.clone(hand))
        ];

        _.each(testHands, function(hand) {
            var result = Splitter.split(hand);
            assert.equal(result.length, 1);
            assert.equal(result[0].sets.length, 0);
            assert.equal(result[0].pairs.length, 7);
            assert.equal(result[0].isChiitoitsu(), true);
            assert.equal(result[0].isFinishedHand(), true);
        });
    });

    it.skip('should detect the ryanpeikou hand', function() {
        var hand = makeTileArray('1p 1p 2p 2p 3p 3p e e 5m 5m 6m 6m 7m 7m');

        var testHands = [
            _.clone(hand),
            _.shuffle(_.clone(hand))
        ];

        _.each(testHands, function(hand) {
            var result = Splitter.split(hand);
            assert.equal(result.length, 1);
            assert.equal(result[0].sets.length, 4);
            assert.equal(result[0].pairs.length, 1);
            assert.equal(result[0].isChiitoitsu(), false);
            assert.equal(result[0].isFinishedHand(), true);
        });
    });

    it('should detect simple pinfu hand', function() {
        var hand = makeTileArray('1p 2p 3p e e 4m 5m 6m 4s 5s 6s 7m 8m 9m');

        var testHands = [
            _.clone(hand),
            _.shuffle(_.clone(hand))
        ];

        _.each(testHands, function(hand) {
            var result = Splitter.split(hand);
            assert.equal(result.length, 1);
            assert.equal(result[0].sets.length, 4);
            assert.equal(result[0].pairs.length, 1);
            assert.equal(result[0].isChiitoitsu(), false);
            assert.equal(result[0].isFinishedHand(), true);
            assert.equal(result[0].isOpenHand(), false);
        });
    });

    it('should detect all pons hand', function() {
        var hand = makeTileArray('4s 4s 4s 7m 7m 7m e e e 1p 1p 1p 2m 2m'); // 14 tiles

        var result = Splitter.split(hand);
        assert.equal(result.length, 1);
        assert.equal(result[0].sets.length, 4);
        assert.equal(result[0].pairs.length, 1);
        assert.equal(result[0].isFinishedHand(), true);
        assert.equal(result[0].isOpenHand(), false);
    });

    it('should detect shuffled all pons hand', function() {
        var hand = makeTileArray('4s 4s 4s 7m 7m 7m e e e 1p 1p 1p 2m 2m'); // 14 tiles

        var result = Splitter.split(_.shuffle(hand));
        assert.equal(result.length, 1);
        assert.equal(result[0].sets.length, 4);
        assert.equal(result[0].pairs.length, 1);
        assert.equal(result[0].isFinishedHand(), true);
        assert.equal(result[0].isOpenHand(), false);
    });

    it('should detect sets in open hand (1 chi)', function() {
        var hand = makeTileArray('e e 3s 4s 5s 6m 6m 6m 7p 8p 9p'); // 11 tiles
        var result = Splitter.split(hand, [
            TileSet.chi([Tile.pin3, Tile.pin4, Tile.pin5], true)
        ]);
        assert.equal(result.length, 1);
        assert.equal(result[0].sets.length, 4);
        assert.equal(_.reduce(result[0].sets, function(acc, item) {
            return acc + (item['opened'] ? 1 : 0);
        }, 0), 1); // 1 открытый
        assert.equal(result[0].pairs.length, 1);
        assert.equal(result[0].isFinishedHand(), true);
        assert.equal(result[0].isOpenHand(), true);
    });

    it('should detect sets in open hand (2 pons)', function() {
        var hand = makeTileArray('e e 3s 4s 5s 7p 8p 9p'); // 8 tiles
        var result = Splitter.split(hand, [
            TileSet.pon(Tile.sha, true),
            TileSet.pon(Tile.pin3, true)
        ]);
        assert.equal(result.length, 1);
        assert.equal(result[0].sets.length, 4);
        assert.equal(_.reduce(result[0].sets, function(acc, item) {
            return acc + (item['opened'] ? 1 : 0);
        }, 0), 2); // 2 открытых
        assert.equal(result[0].pairs.length, 1);
        assert.equal(result[0].isFinishedHand(), true);
        assert.equal(result[0].isOpenHand(), true);
    });

    it('should detect sets in hand with open kan', function() {
        var hand = makeTileArray('e e 3s 4s 5s 7p 8p 9p 6m 6m 6m'); // 11 tiles
        var result = Splitter.split(hand, [
            TileSet.kan(Tile.sha, true)
        ]);
        assert.equal(result.length, 1);
        assert.equal(result[0].sets.length, 4);
        assert.equal(_.reduce(result[0].sets, function(acc, item) {
            return acc + (item['opened'] ? 1 : 0);
        }, 0), 1); // 1 открытый
        assert.equal(result[0].pairs.length, 1);
        assert.equal(result[0].isFinishedHand(), true);
        assert.equal(result[0].isOpenHand(), true);
    });

    it('should detect sets in hand with closed kan', function() {
        var hand = makeTileArray('e e 3s 4s 5s 7p 8p 9p 6m 6m 6m'); // 11 tiles
        var result = Splitter.split(hand, [
            TileSet.kan(Tile.sha)
        ]);
        assert.equal(result.length, 1);
        assert.equal(result[0].sets.length, 4);
        assert.equal(_.reduce(result[0].sets, function(acc, item) {
            return acc + (item['opened'] ? 1 : 0);
        }, 0), 0); // Все закрыты
        assert.equal(result[0].pairs.length, 1);
        assert.equal(result[0].isFinishedHand(), true);
        assert.equal(result[0].isOpenHand(), false);
    });
});
