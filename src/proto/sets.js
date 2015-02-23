var _ = require('lodash');

function TileSet(type, opened) {
    if (this instanceof TileSet) {
        this.type = type;
        this.opened = opened;
    } else {
        return new TileSet(type, opened);
    }
}

TileSet.prototype.toString = function() {
    var description = [];

    if (this.type != TileSets.TYPES.PAIR) {
        if (this.opened) {
            description.push('Opened');
        } else {
            description.push('Closed');
        }
    }

    description.push(TileSets._BACKTYPES[this.type] + ' of');

    if (this.type != TileSets.TYPES.CHI) {
        description.push(this.tilesList[0].toString());
    } else {
        description.push(
            this.tilesList[0].toString() + '-' +
            this.tilesList[1].toString() + '-' +
            this.tilesList[2].toString()
        );
    }

    return description.join(' ');
};

TileSet.prototype.setTiles = function(tilesList) {
    this.tilesList = tilesList;
};

TileSet.prototype.getTiles = function() {
    return this.tilesList;
};

var TileSets = {
    TYPES: {
        CHI: 1,
        PON: 2,
        KAN: 3,
        PAIR: 4
    },
    _BACKTYPES: {
        1: 'chi',
        2: 'pon',
        3: 'kan',
        4: 'Pair'
    }
};

TileSets = _.extend(TileSets, {
    pair: function(tile) {
        var tset = new TileSet(TileSets.TYPES.PAIR, false);
        tset.setTiles([tile, tile]);
        return tset;
    },

    pon: function(tile, opened) {
        var tset = new TileSet(TileSets.TYPES.PON, !!opened);
        tset.setTiles([tile, tile, tile]);
        return tset;
    },

    kan: function(tile, opened) {
        var tset = new TileSet(TileSets.TYPES.KAN, !!opened);
        tset.setTiles([tile, tile, tile, tile]);
        return tset;
    },

    chi: function(tileList, opened) {
        var tset = new TileSet(TileSets.TYPES.CHI, !!opened);
        tset.setTiles(tileList);
        return tset;
    }
});

module.exports = TileSets;
