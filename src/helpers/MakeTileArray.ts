import _ = require('../libdefs/lodash');
import Tile = require('proto/Tile');

var map = {
    '1p': Tile.pin1,
    '2p': Tile.pin2,
    '3p': Tile.pin3,
    '4p': Tile.pin4,
    '5p': Tile.pin5,
    '6p': Tile.pin6,
    '7p': Tile.pin7,
    '8p': Tile.pin8,
    '9p': Tile.pin9,

    '1m': Tile.man1,
    '2m': Tile.man2,
    '3m': Tile.man3,
    '4m': Tile.man4,
    '5m': Tile.man5,
    '6m': Tile.man6,
    '7m': Tile.man7,
    '8m': Tile.man8,
    '9m': Tile.man9,

    '1s': Tile.sou1,
    '2s': Tile.sou2,
    '3s': Tile.sou3,
    '4s': Tile.sou4,
    '5s': Tile.sou5,
    '6s': Tile.sou6,
    '7s': Tile.sou7,
    '8s': Tile.sou8,
    '9s': Tile.sou9,

    'e': Tile.ton,
    's': Tile.nan,
    'w': Tile.sha,
    'n': Tile.pei,

    'rd': Tile.chun,
    'wd': Tile.haku,
    'gd': Tile.hatsu
};

/**
 * @param str
 * @returns Tile[]
 */
function makeTileArray(str) {
    var pieces = str.split(' ');
    var result = [];
    _.each(pieces, (piece: string) => {
        result.push(map[piece]);
    });

    return result;
}

export = makeTileArray
