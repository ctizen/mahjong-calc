var _ = require('lodash');
var sets = require('../proto/sets');

function ParsedHand() {
    this.winningTile = null;
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

ParsedHand.prototype.isOpenHand = function() {
    if (this.isKokushi() || this.isChiitoitsu()) return false;
    var openSetsCount = _.reduce(this.sets, function(acc, item) {
        return acc + (item.opened ? 1 : 0);
    }, 0);
    return (openSetsCount > 0);
};

/**
 * @param {Tile} tile
 */
ParsedHand.prototype.setWinningTile = function(tile) {
    this.winningTile = tile;
};

module.exports = ParsedHand;
