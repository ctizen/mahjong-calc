var _ = require('lodash');
var sets = require('../proto/sets');

function ParsedHand() {
    this.sets = [];
    this.pairs = [];
    this.isFinishedHand = false;
    // special hands
    this.isKokushi = false;
    this.isChiitoitsu = false;
}

/**
 *
 * @param {TileSet} tileSet
 */
ParsedHand.prototype.add = function(tileSet) {
    if (tileSet.type == sets.TYPES.PAIR) {
        this.pairs.push(tileSet);
    } else {
        this.sets.push(tileSet);
    }
};

module.exports = ParsedHand;
