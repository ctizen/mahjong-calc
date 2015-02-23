var _ = require('lodash');
var sets = require('../proto/sets');

function ParsedHand() {
    this.sets = [];
    this.pairs = [];
    this.isSpecial = false; // neither chiitoitsu nor 4sets+1pair
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

ParsedHand.prototype.isChiitoitsu = function() {
    return this.pairs.length == 7;
};

ParsedHand.prototype.isKokushi = function() {
    return this.sets.length == 0 && this.isSpecial;
};

ParsedHand.prototype.isFinishedHand = function() {
    return this.isKokushi() || this.isChiitoitsu() || (this.sets.length == 4 && this.pairs.length == 1);
};

module.exports = ParsedHand;
