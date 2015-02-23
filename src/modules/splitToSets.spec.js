var splitter = require('./splitToSets');
var tiles = require('../proto/tiles');
var sets = require('../proto/sets');
var _ = require('lodash');
var assert = require('chai').assert;
var makeHand = require('../test/makeHand');

function sortItems(items) {
    return _.sortBy(items, function(item) {
        return item.toString();
    });
}

function log(item) {
    console.log(require('util').inspect(item, true, 10)); // 10 levels deep
}

describe('Hand set splitter units', function() {
    it('should unify items', function() {
        var items = [
            sets.pair(tiles['man6']),
            sets.pon(tiles['pin3']),
            sets.pair(tiles['pin3']),
            sets.pair(tiles['man6']),
            sets.pon(tiles['pin3']),
            sets.pair(tiles['pin3'])
        ];

        var expected = [
            sets.pair(tiles['man6']),
            sets.pon(tiles['pin3']),
            sets.pair(tiles['pin3'])
        ];

        assert.sameDeepMembers(splitter._unify(items), expected);
    });

    it('should unify nested items', function() {
        var items = [
            [
                sets.pair(tiles['man6']),
                sets.pair(tiles['pin3']),
                sets.pon(tiles['pin3'])
            ],
            [
                sets.pair(tiles['man6']),
                sets.pon(tiles['pin3']),
                sets.pair(tiles['pin3'])
            ]
        ];

        var expected = [[
            sets.pair(tiles['man6']),
            sets.pon(tiles['pin3']),
            sets.pair(tiles['pin3'])
        ]];

        assert.sameDeepMembers(
            _.map(splitter._unify(items), sortItems),
            _.map(expected, sortItems)
        );
    });

    it('should count tiles', function() {
        var hand = makeHand('1p 2s 9m 6m 6m e wd 8s 2s e wd 1p 9m 8s');
        var expected = {
            'pin1': 2,
            'sou2': 2,
            'man9': 2,
            'man6': 2,
            'ton': 2,
            'haku': 2,
            'sou8': 2
        };

        assert.deepEqual(splitter._countTiles(hand), expected);
    });

    it('should find pairs and pons', function() {
        var hand = makeHand('3p 3p 3p 6m 6m 3s 4s 5s 1m 1m 1m e s w');
        var expected = [
            sets.pair(tiles['man6']),
            sets.pon(tiles['pin3']),
            sets.pair(tiles['pin3']),
            sets.pon(tiles['man1']),
            sets.pair(tiles['man1'])
        ];

        assert.sameDeepMembers(splitter._findTriplesAndPairs(hand), expected);
    });

    it('should find pairs and pons in ryanpeiko', function() {
        var hand = makeHand('1p 1p 2p 2p 3p 3p 4s 4s 5s 5s 6s 6s 9m 9m');
        var expected = [
            sets.pair(tiles['pin1']),
            sets.pair(tiles['pin2']),
            sets.pair(tiles['pin3']),
            sets.pair(tiles['sou4']),
            sets.pair(tiles['sou5']),
            sets.pair(tiles['sou6']),
            sets.pair(tiles['man9'])
        ];

        assert.sameDeepMembers(splitter._findTriplesAndPairs(hand), expected);
    });

    it('should find sequences', function() {
        var hand = makeHand('1m 2m 3m 5s 6s 7s 8s 9s 2p 3p 5p e s w');
        var expected = [
            sets.chi([tiles['man1'], tiles['man2'], tiles['man3']]),
            sets.chi([tiles['sou5'], tiles['sou6'], tiles['sou7']]),
            sets.chi([tiles['sou6'], tiles['sou7'], tiles['sou8']]),
            sets.chi([tiles['sou7'], tiles['sou8'], tiles['sou9']])
        ];

        assert.sameDeepMembers(splitter._findSequences(hand), expected);
    });

    it('should find sequences in ryanpeiko', function() {
        var hand = makeHand('1p 1p 2p 2p 3p 3p 4s 4s 5s 5s 6s 6s 9m 9m');
        var expected = [
            sets.chi([tiles['pin1'], tiles['pin2'], tiles['pin3']]),
            sets.chi([tiles['sou4'], tiles['sou5'], tiles['sou6']])
        ];

        assert.sameDeepMembers(splitter._findSequences(hand), expected);
    });

    it('should perform partial split check', function() {
        var hand = makeHand('1m 2m 3m 5s 6s 7s 8s 9s 2p 3p e e s w');
        var goodSplit = [
            sets.chi([tiles['man1'], tiles['man2'], tiles['man3']]),
            sets.chi([tiles['sou7'], tiles['sou8'], tiles['sou9']]),
            sets.pair(tiles['ton'])
        ];
        var badSplit = [
            sets.chi([tiles['sou5'], tiles['sou6'], tiles['sou7']]),
            sets.chi([tiles['sou6'], tiles['sou7'], tiles['sou8']]),
            sets.pair(tiles['ton'])
        ];

        assert.equal(splitter._checkPartialSplit(hand, goodSplit), true, 'Good split did not pass!');
        assert.equal(splitter._checkPartialSplit(hand, badSplit), false, 'Bad split passed!');
    });

    it('should perform strict partial split check', function() {
        var hand = makeHand('1m 2m 3m 4s 5s 6s 7s 8s 9s 2p 3p 4p e e');
        var goodSplit = [
            sets.chi([tiles['man1'], tiles['man2'], tiles['man3']]),
            sets.chi([tiles['sou4'], tiles['sou5'], tiles['sou6']]),
            sets.chi([tiles['sou7'], tiles['sou8'], tiles['sou9']]),
            sets.chi([tiles['pin2'], tiles['pin3'], tiles['pin4']]),
            sets.pair(tiles['ton'])
        ];
        var badSplit = [
            sets.chi([tiles['man1'], tiles['man2'], tiles['man3']]),
            sets.chi([tiles['sou4'], tiles['sou5'], tiles['sou6']]),
            sets.chi([tiles['sou6'], tiles['sou7'], tiles['sou8']]),
            sets.chi([tiles['sou7'], tiles['sou8'], tiles['sou9']]),
            sets.pair(tiles['ton'])
        ];

        assert.equal(splitter._checkPartialSplit(hand, goodSplit, true), true, 'Good split did not pass!');
        assert.equal(splitter._checkPartialSplit(hand, badSplit, true), false, 'Bad split passed!');
    });

    it('should find all possible splits', function() {
        var hand = makeHand('1p 1p 2p 2p 3p 3p 4s 4s 5s 5s 6s 6s 9m 9m');
        var expected = [
            [
                sets.chi([tiles['pin1'], tiles['pin2'], tiles['pin3']]),
                sets.chi([tiles['pin1'], tiles['pin2'], tiles['pin3']]),
                sets.chi([tiles['sou4'], tiles['sou5'], tiles['sou6']]),
                sets.chi([tiles['sou4'], tiles['sou5'], tiles['sou6']]),
                sets.pair(tiles['man9'])
            ],
            [
                sets.pair(tiles['pin1']),
                sets.pair(tiles['pin2']),
                sets.pair(tiles['pin3']),
                sets.pair(tiles['sou4']),
                sets.pair(tiles['sou5']),
                sets.pair(tiles['sou6']),
                sets.pair(tiles['man9'])
            ]
        ];
        var actual = splitter._findPossibleSplits(hand, splitter._findSequences(hand).concat(splitter._findTriplesAndPairs(hand)));

        assert.sameDeepMembers(
            _.map(actual, sortItems),
            _.map(expected, sortItems)
        );
    });
});

describe('Hand set splitter typical cases', function() {
    it('should detect not-ready hand', function() {
        var hand = makeHand('1p 2p 3p 5m 6m 7m e e e 3s 4s 6s wd wd');
        var result = splitter(hand);

        assert.equal(result.isFinishedHand(), false);
    });

    it('should detect the kokushi hand', function() {
        var hand = makeHand('1p 9p 1m 9m 1s 9s e s w n rd wd gd'); // 13 tiles hand

        var testHands = [
            makeHand('1p 9p 1m 9m 1s 9s e s w n rd wd gd e'),
            makeHand('1p 9p 1m 9m 1m 1s 9s e s w n rd wd gd'),
            _.shuffle(makeHand('1p 9p 1m 9m 1s 9s e s w n rd wd gd e'))
        ];

        _.each(testHands, function(hand) {
            var result = splitter(hand);
            assert.equal(result.isKokushi(), true);
            assert.equal(result.isFinishedHand(), true);
        });
    });

    it('should detect the chiitoitsu hand', function() {
        var hand = makeHand('1p 1p 9m 9m 2s 2s e e wd wd 6m 6m 8s 8s');

        var testHands = [
            _.clone(hand),
            _.shuffle(_.clone(hand))
        ];

        _.each(testHands, function(hand) {
            var result = splitter(hand);
            assert.equal(result.sets.length, 0);
            assert.equal(result.pairs.length, 7);
            assert.equal(result.isChiitoitsu(), true);
            assert.equal(result.isFinishedHand(), true);
        });
    });

    it.skip('should detect the ryanpeikou hand', function() {
        var hand = makeHand('1p 1p 2p 2p 3p 3p e e 5m 5m 6m 6m 7m 7m');

        var testHands = [
            _.clone(hand),
            _.shuffle(_.clone(hand))
        ];

        _.each(testHands, function(hand) {
            var result = splitter(hand);
            assert.equal(result.sets.length, 4);
            assert.equal(result.pairs.length, 1);
            assert.equal(result.isChiitoitsu(), false);
            assert.equal(result.isFinishedHand(), true);
        });
    });

    it('should detect simple pinfu hand', function() {
        var hand = makeHand('1p 2p 3p e e 4m 5m 6m 4s 5s 6s 7m 8m 9m');

        var testHands = [
            _.clone(hand),
            _.shuffle(_.clone(hand))
        ];

        _.each(testHands, function(hand) {
            var result = splitter(hand);
            assert.equal(result.sets.length, 4);
            assert.equal(result.pairs.length, 1);
            assert.equal(result.isChiitoitsu(), false);
            assert.equal(result.isFinishedHand(), true);
        });
    });

    it('should detect all pons hand', function() {
        var hand = makeHand('4s 4s 4s 7m 7m 7m e e e 1p 1p 1p 2m 2m'); // 14 tiles

        var result = splitter(hand);
        assert.equal(result.sets.length, 4);
        assert.equal(result.pairs.length, 1);
        assert.equal(result.isFinishedHand(), true);
    });

    it('should detect shuffled all pons hand', function() {
        var hand = makeHand('4s 4s 4s 7m 7m 7m e e e 1p 1p 1p 2m 2m'); // 14 tiles

        result = splitter(_.shuffle(hand));
        assert.equal(result.sets.length, 4);
        assert.equal(result.pairs.length, 1);
        assert.equal(result.isFinishedHand(), true);
    });

    it.skip('should detect sets in open hand', function() {
        // todo: передать чи/поны в explicitSets
    });

    it.skip('should detect sets in hand with open kan', function() {
        // todo: передать открытый кан в explicitSets
    });

    it.skip('should detect sets in hand with closed kan', function() {
        // todo: передать закрытый кан в explicitSets
    });
});
