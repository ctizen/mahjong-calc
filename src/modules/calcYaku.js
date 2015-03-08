var tiles = require('../proto/tiles');
var sets = require('../proto/sets');
var YakuList = require('../proto/yakuList');
var splitter = require('./splitToSets');
var _ = require('lodash');
var ParsedHand = require('../proto/hand');

function calcYakuInHand(parsedHand, waitingTile, finishedFromWall, roundWind, placeWind) {
    parsedHand.setWinningTile(waitingTile);
}

/**
 *
 * @param {ParsedHand} hand
 * @param {Array} openSets
 * @param {Tile} waitingTile
 * @param {bool} finishedFromWall
 * @param {Tile} roundWind
 * @param {Tile} placeWind
 */
function calcYaku(hand, openSets, waitingTile, finishedFromWall, roundWind, placeWind) {
    var splittedHandVariants = splitter(hand, openSets);
    if (splittedHandVariants instanceof ParsedHand) {
        var result = calcYakuInHand(splittedHandVariants, waitingTile, finishedFromWall, roundWind, placeWind);
        // todo
    } else {
        // array of ParsedHands -> try to parse all
        var results = [];
        _.each(splittedHandVariants, function(splittedHand) {
            results.push(calcYakuInHand(splittedHandVariants, waitingTile, finishedFromWall, roundWind, placeWind));
        });
        // todo
    }
}

module.exports = calcYaku;