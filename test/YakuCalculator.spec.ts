/// <reference path="../../libdefs/mocha.d.ts" />
//import Tile = require('../../src/proto/Tile');
//import TileSet = require('../../src/proto/TileSet');
//import _ = require('../../src/libdefs/lodash');
//import chai = require('../../src/libdefs/chai');
//var assert = chai.assert;
//import makeTileArray = require('../../src/helpers/makeTileArray');
//import YakuCalculator = require('../../src/modules/YakuCalculator');
//import Yaku = require('../../src/proto/Yaku');
//import sortYakuList = require('../../src/helpers/sortItems');
//import log = require('../../src/helpers/logEx');
//
//describe.only('Yaku calculator units', function() {
//    it('Should detect toitoi hand', function() {
//        var hand = makeTileArray('e e 3s 3s 3s 7p 7p 7p'); // 8 tiles
//        var result = YakuCalculator(hand, [
//            TileSet.pon(Tile.sha, true),
//            TileSet.pon(Tile.pin3, true)
//        ], Tile.ton, false, Tile.nan, Tile.nan);
//        var expected = [
//            Yaku.toitoi
//        ];
//        assert.sameDeepMembers(
//            _.map(result, sortYakuList),
//            _.map(expected, sortYakuList)
//        );
//    });
//});
