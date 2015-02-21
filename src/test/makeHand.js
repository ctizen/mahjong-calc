var tiles = require('../proto/tiles');
var _ = require('lodash');

var map = {
    '1p': tiles.pin1,
    '2p': tiles.pin2,
    '3p': tiles.pin3,
    '4p': tiles.pin4,
    '5p': tiles.pin5,
    '6p': tiles.pin6,
    '7p': tiles.pin7,
    '8p': tiles.pin8,
    '9p': tiles.pin9,

    '1m': tiles.man1,
    '2m': tiles.man2,
    '3m': tiles.man3,
    '4m': tiles.man4,
    '5m': tiles.man5,
    '6m': tiles.man6,
    '7m': tiles.man7,
    '8m': tiles.man8,
    '9m': tiles.man9,

    '1s': tiles.sou1,
    '2s': tiles.sou2,
    '3s': tiles.sou3,
    '4s': tiles.sou4,
    '5s': tiles.sou5,
    '6s': tiles.sou6,
    '7s': tiles.sou7,
    '8s': tiles.sou8,
    '9s': tiles.sou9,

    'e': tiles.ton,
    's': tiles.nan,
    'w': tiles.sha,
    'n': tiles.pei,

    'rd': tiles.chun,
    'wd': tiles.haku,
    'gd': tiles.hatsu
};

module.exports = function(str) {
    var pieces = str.split(' ');
    var result = [];
    _.each(pieces, function(piece) {
        result.push(map[piece]);
    });

    return result;
};