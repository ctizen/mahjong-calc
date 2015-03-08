import _ = require('../libdefs/lodash');
import Tile = require('Tile');

enum TileSetType {
    chi,
    pon,
    kan,
    pair
}

class TileSet {
    private _type: TileSetType;
    private _opened: boolean;
    tilesList: Tile[];

    constructor(type: TileSetType, opened: boolean) {
        this._type = type;
        this._opened = opened;
    }

    get opened() {
        return this._opened;
    }

    private static _getTileSetName(tileSet) {
        switch(tileSet) {
            case TileSetType.chi: return 'chi';
            case TileSetType.pon: return 'pon';
            case TileSetType.kan: return 'kan';
            case TileSetType.pair: return 'pair';
        }
    }

    toString() {
        var description = [];

        if (this._type != TileSetType.pair) {
            if (this.opened) {
                description.push('Opened');
            } else {
                description.push('Closed');
            }
        }

        description.push(TileSet._getTileSetName(this._type));
        description.push(' of');

        if (this._type != TileSetType.chi) {
            description.push(this.tilesList[0].toString());
        } else {
            description.push(
                this.tilesList[0].toString() + '-' +
                this.tilesList[1].toString() + '-' +
                this.tilesList[2].toString()
            );
        }

        return description.join(' ');
    }

    isPair() {
        return this._type == TileSetType.pair;
    }

    isPon() {
        return this._type == TileSetType.pon;
    }

    isChi() {
        return this._type == TileSetType.chi;
    }

    isKan() {
        return this._type == TileSetType.kan;
    }

    static pair(tile: Tile) {
        var tset = new TileSet(TileSetType.pair, false);
        tset.tilesList = [tile, tile];
        return tset;
    }

    static pon(tile: Tile, opened?: boolean) {
        var tset = new TileSet(TileSetType.pon, !!opened);
        tset.tilesList = [tile, tile, tile];
        return tset;
    }

    static kan(tile: Tile, opened?: boolean) {
        var tset = new TileSet(TileSetType.kan, !!opened);
        tset.tilesList = [tile, tile];
        return tset;
    }

    static chi(tileList: Tile[], opened?: boolean) {
        var tset = new TileSet(TileSetType.chi, !!opened);
        tset.tilesList = tileList;
        return tset;
    }
}

export = TileSet;
