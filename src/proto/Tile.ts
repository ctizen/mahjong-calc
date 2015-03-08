import _ = require('../libdefs/lodash');

enum TileSuit {
    man,
    pin,
    sou
}

enum HonorType {
    ton,
    nan,
    sha,
    pei,
    chun,
    haku,
    hatsu
}

interface ITile {
    canStartSequence(): boolean;
    equalsTo(tile: Tile): boolean;
    suitEqual(tile: Tile): boolean;
    isNextTo(tile: Tile): boolean;
    toString(): string;
}

class Tile implements ITile {
    static makeSuitTile(suit: TileSuit, value: number) {
        return new TileOfSuit(suit, value);
    }

    static makeHonorTile(type: HonorType) {
        return new HonorTile(type);
    }

    static isSuit(tile: Tile) {
        return tile instanceof TileOfSuit;
    }

    static isSuitId(tile: string) {
        return !!tile.match(/man\d|pin\d|sou\d/);
    }

    static isHonor(tile: Tile) {
        return tile instanceof HonorTile;
    }

    static isHonorId(tile: string) {
        return _.contains(['chun', 'haku', 'hatsu', 'ton', 'nan', 'sha', 'pei'], tile);
    }

    static pin1 = Tile.makeSuitTile(TileSuit.pin, 1);
    static pin2 = Tile.makeSuitTile(TileSuit.pin, 2);
    static pin3 = Tile.makeSuitTile(TileSuit.pin, 3);
    static pin4 = Tile.makeSuitTile(TileSuit.pin, 4);
    static pin5 = Tile.makeSuitTile(TileSuit.pin, 5);
    static pin6 = Tile.makeSuitTile(TileSuit.pin, 6);
    static pin7 = Tile.makeSuitTile(TileSuit.pin, 7);
    static pin8 = Tile.makeSuitTile(TileSuit.pin, 8);
    static pin9 = Tile.makeSuitTile(TileSuit.pin, 9);

    static man1 = Tile.makeSuitTile(TileSuit.man, 1);
    static man2 = Tile.makeSuitTile(TileSuit.man, 2);
    static man3 = Tile.makeSuitTile(TileSuit.man, 3);
    static man4 = Tile.makeSuitTile(TileSuit.man, 4);
    static man5 = Tile.makeSuitTile(TileSuit.man, 5);
    static man6 = Tile.makeSuitTile(TileSuit.man, 6);
    static man7 = Tile.makeSuitTile(TileSuit.man, 7);
    static man8 = Tile.makeSuitTile(TileSuit.man, 8);
    static man9 = Tile.makeSuitTile(TileSuit.man, 9);

    static sou1 = Tile.makeSuitTile(TileSuit.sou, 1);
    static sou2 = Tile.makeSuitTile(TileSuit.sou, 2);
    static sou3 = Tile.makeSuitTile(TileSuit.sou, 3);
    static sou4 = Tile.makeSuitTile(TileSuit.sou, 4);
    static sou5 = Tile.makeSuitTile(TileSuit.sou, 5);
    static sou6 = Tile.makeSuitTile(TileSuit.sou, 6);
    static sou7 = Tile.makeSuitTile(TileSuit.sou, 7);
    static sou8 = Tile.makeSuitTile(TileSuit.sou, 8);
    static sou9 = Tile.makeSuitTile(TileSuit.sou, 9);

    static ton = Tile.makeHonorTile(HonorType.ton);
    static nan = Tile.makeHonorTile(HonorType.nan);
    static sha = Tile.makeHonorTile(HonorType.sha);
    static pei = Tile.makeHonorTile(HonorType.pei);

    static chun = Tile.makeHonorTile(HonorType.chun);
    static haku = Tile.makeHonorTile(HonorType.haku);
    static hatsu = Tile.makeHonorTile(HonorType.hatsu);

    canStartSequence(): boolean { return false; } // stub: see derived classes
    equalsTo(tile: Tile): boolean { return false; } // stub: see derived classes
    suitEqual(tile: Tile): boolean { return false; } // stub: see derived classes
    isNextTo(tile: Tile): boolean { return false; } // stub: see derived classes
    toString(): string { return ''; } // stub: see derived classes
}

class TileOfSuit extends Tile {
    private _suit: TileSuit;
    private _value: number;
    constructor(suit: TileSuit, value: number) {
        super();
        this._suit = suit;
        this._value = value;
    }

    private static _getSuitName(suit: TileSuit) {
        switch(suit) {
            case TileSuit.man: return 'man';
            case TileSuit.pin: return 'pin';
            case TileSuit.sou: return 'sou';
        }
    }

    toString() {
        return TileOfSuit._getSuitName(this._suit) + this._value.toString();
    }

    /**
     * If current tile can start a straight sequence.
     * Only last two suit tiles cannot.
     * @returns {boolean}
     */
    canStartSequence() {
        return !(this._value == 8 || this._value == 9);
    }

    equalsTo(tile: Tile) {
        return this.suitEqual(tile) && this._value == (<TileOfSuit>tile)._value;
    }

    suitEqual(tile: Tile) {
        return tile instanceof TileOfSuit && this._suit == (<TileOfSuit>tile)._suit;
    }

    isNextTo(tile: Tile) {
        return tile instanceof TileOfSuit && this._value == (<TileOfSuit>tile)._value + 1;
    }
}

class HonorTile extends Tile {
    private _type: HonorType;
    constructor(type: HonorType) {
        super();
        this._type = type;
    }

    toString() {
        switch(this._type) {
            case HonorType.chun: return 'chun';
            case HonorType.haku: return 'haku';
            case HonorType.hatsu: return 'hatsu';
            case HonorType.ton: return 'ton';
            case HonorType.nan: return 'nan';
            case HonorType.sha: return 'sha';
            case HonorType.pei: return 'pei';
        }
    }

    canStartSequence() {
        return false;
    }

    equalsTo(tile: Tile) {
        return tile instanceof HonorTile && this._type == (<HonorTile>tile)._type;
    }

    suitEqual(tile: Tile) {
        return false;
    }

    isNextTo(tile: Tile) {
        return false;
    }
}

export = Tile;
