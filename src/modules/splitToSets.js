var tiles = require('../proto/tiles');
var sets = require('../proto/sets');
var _ = require('lodash');

function countTiles(hand) {
    var map = {};
    _.each(hand, function(tile) {
        map[tile] = map[tile] === undefined ? 1 : map[tile] + 1;
    });

    return map;
}

/**
 *
 * @param hand Состав руки
 * @param explicitSets Открытые и объявленные сеты
 */
function splitToSets(hand, explicitSets) {
    var foundSets = [].concat(explicitSets || []);

    // 1) find all honor pairs and sets
    var counts = countTiles(hand);
    _.each(counts, function(value, key) {
        if (_.contains(['chun', 'haku', 'hatsu', 'ton', 'nan', 'sha', 'pei'], key)) {
            switch (value) {
                case 2:
                    foundSets.push(sets.pair(tiles[key]));
                    break;
                case 3:
                    foundSets.push(sets.pon(tiles[key]));
                    break;
            }
        }
    });

    console.log(foundSets);
}

module.exports = splitToSets;