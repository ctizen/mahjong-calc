var _ = require('lodash');

function Tile(suit, value) {
    if (this instanceof Tile) {
        this.suit = suit;
        this.value = value;
    } else {
        return new Tile(suit, value);
    }
}

Tile.prototype.toString = function() {
    if (this.suit == Tiles.SUITS.DRAGON) {
        switch (this.value) {
            case Tiles.DRAGONS.CHUN: return 'chun';
            case Tiles.DRAGONS.HAKU: return 'haku';
            case Tiles.DRAGONS.HATSU: return 'hatsu';
        }
    } else if (this.suit == Tiles.SUITS.WIND) {
        switch (this.value) {
            case Tiles.WINDS.TON: return 'ton';
            case Tiles.WINDS.NAN: return 'nan';
            case Tiles.WINDS.SHA: return 'sha';
            case Tiles.WINDS.PEI: return 'pei';
        }
    } else {
        return Tiles._BACKSUITS[this.suit] + this.value;
    }
};

var Tiles = {
    SUITS: {
        MAN: 1,
        PIN: 2,
        SOU: 3,
        WIND: 4,
        DRAGON: 5
    },
    _BACKSUITS: {
        1: 'man',
        2: 'pin',
        3: 'sou'
    },
    WINDS: {
        TON: 1,
        NAN: 2,
        SHA: 3,
        PEI: 4
    },
    DRAGONS: {
        CHUN: 1,
        HAKU: 2,
        HATSU: 3
    }
};

Tiles = _.extend(Tiles, {
    'pin1': Tile(Tiles.SUITS.PIN, 1),
    'pin2': Tile(Tiles.SUITS.PIN, 2),
    'pin3': Tile(Tiles.SUITS.PIN, 3),
    'pin4': Tile(Tiles.SUITS.PIN, 4),
    'pin5': Tile(Tiles.SUITS.PIN, 5),
    'pin6': Tile(Tiles.SUITS.PIN, 6),
    'pin7': Tile(Tiles.SUITS.PIN, 7),
    'pin8': Tile(Tiles.SUITS.PIN, 8),
    'pin9': Tile(Tiles.SUITS.PIN, 9),

    'man1': Tile(Tiles.SUITS.MAN, 1),
    'man2': Tile(Tiles.SUITS.MAN, 2),
    'man3': Tile(Tiles.SUITS.MAN, 3),
    'man4': Tile(Tiles.SUITS.MAN, 4),
    'man5': Tile(Tiles.SUITS.MAN, 5),
    'man6': Tile(Tiles.SUITS.MAN, 6),
    'man7': Tile(Tiles.SUITS.MAN, 7),
    'man8': Tile(Tiles.SUITS.MAN, 8),
    'man9': Tile(Tiles.SUITS.MAN, 9),

    'sou1': Tile(Tiles.SUITS.SOU, 1),
    'sou2': Tile(Tiles.SUITS.SOU, 2),
    'sou3': Tile(Tiles.SUITS.SOU, 3),
    'sou4': Tile(Tiles.SUITS.SOU, 4),
    'sou5': Tile(Tiles.SUITS.SOU, 5),
    'sou6': Tile(Tiles.SUITS.SOU, 6),
    'sou7': Tile(Tiles.SUITS.SOU, 7),
    'sou8': Tile(Tiles.SUITS.SOU, 8),
    'sou9': Tile(Tiles.SUITS.SOU, 9),

    'ton': Tile(Tiles.SUITS.WIND, Tiles.WINDS.TON),
    'nan': Tile(Tiles.SUITS.WIND, Tiles.WINDS.NAN),
    'sha': Tile(Tiles.SUITS.WIND, Tiles.WINDS.SHA),
    'pei': Tile(Tiles.SUITS.WIND, Tiles.WINDS.PEI),

    'chun': Tile(Tiles.SUITS.DRAGON, Tiles.DRAGONS.CHUN),
    'haku': Tile(Tiles.SUITS.DRAGON, Tiles.DRAGONS.HAKU),
    'hatsu': Tile(Tiles.SUITS.DRAGON, Tiles.DRAGONS.HATSU)
});

module.exports = Tiles;
