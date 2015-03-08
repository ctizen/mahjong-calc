import _ = require('../libdefs/lodash');
import TileSet = require('TileSet');
import Tile = require('Tile');

class ParsedHand {
    winningTile: Tile;
    private _sets: TileSet[];
    private _pairs: TileSet[];
    isSpecial: boolean;

    constructor() {
        this.winningTile = null;
        this.isSpecial = false;
        this._sets = [];
        this._pairs = [];
    }

    add(tileSet: TileSet) {
        if (tileSet.isPair()) {
            this._pairs.push(tileSet);
        } else {
            this._sets.push(tileSet);
        }
    }

    isChiitoitsu() {
        return this._pairs.length == 7;
    }

    isKokushi() {
        return this._sets.length == 0 && this.isSpecial;
    }

    isFinishedHand() {
        return this.isKokushi || this.isChiitoitsu() || (this._sets.length == 4 && this._pairs.length == 1);
    }

    isOpenHand() {
        if (this.isKokushi() || this.isChiitoitsu()) return false;
        var openSetsCount = _.reduce(this._sets, (acc: number, item: TileSet) => {
            return acc + (item.opened ? 1 : 0);
        }, 0);
        return (openSetsCount > 0);
    }

    get sets() {
        return this._sets;
    }

    get pairs() {
        return this._pairs;
    }
}

export = ParsedHand;
