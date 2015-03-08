import _ = require('../libdefs/lodash');
import Tile = require('proto/Tile');
import TileSet = require('proto/TileSet');
import ParsedHand = require('proto/ParsedHand');
import sortItems = require('helpers/sortItems');

class Splitter {

    /**
     * @param hand
     * @returns {{}}
     */
    static _countTiles(hand: Tile[]) {
        var map = {};
        _.each(hand, function(tile: Tile) {
            map[tile.toString()] = map[tile.toString()] === undefined ? 1 : map[tile.toString()] + 1;
        });

        return map;
    }

    /**
     * Make items unique
     */
    static _unify(arr: any[]) {
        for (var i = 0; i < arr.length; i++) {
            for (var j = i; j < arr.length; j++) {
                if (j == i) continue;
                var sortedArrI = [], sortedArrJ = [];
                sortItems(sortedArrI, arr[i]);
                sortItems(sortedArrJ, arr[j]);
                if (_.isEqual(sortedArrI, sortedArrJ)) {
                    arr.splice(j, 1);
                    j--;
                }
            }
        }

        return arr;
    }

    static _findSequences(hand: Tile[]) {
        var foundChis = [];
        var suitTiles = _.filter(hand, Tile.isSuit);
        _.each(suitTiles, function(firstTile: Tile) {
            if (!firstTile.canStartSequence()) return;
            _.each(suitTiles, function(secondTile: Tile) {
                if (secondTile.equalsTo(firstTile) || !secondTile.suitEqual(firstTile) || !secondTile.isNextTo(firstTile)) return;
                _.each(suitTiles, function(thirdTile: Tile) {
                    if (thirdTile.equalsTo(secondTile) || !thirdTile.suitEqual(secondTile) || !thirdTile.isNextTo(secondTile)) return;
                    // если дошли досюда, значит нашли чи.
                    foundChis.push(TileSet.chi([firstTile, secondTile, thirdTile]));
                });
            });
        });

        foundChis = Splitter._unify(foundChis);

        return foundChis;
    }

    static _findTriplesAndPairs(hand: Tile[]) {
        var result = [];
        var counts = Splitter._countTiles(hand);
        _.each(counts, function(value, key) {
            if (!Tile[key]) return;
            switch (value) {
                case 2:
                    result.push(TileSet.pair(Tile[key]));
                    break;
                case 3:
                    result.push(TileSet.pon(Tile[key]));
                    result.push(TileSet.pair(Tile[key]));
                    break;
            }
        });

        return result;
    }

    /**
     * Check if tile count in possible split does not exceed tile count in original hand
     * @param hand
     * @param partialSplit
     * @param strict
     * @returns {*}
     */
    static _checkPartialSplit(hand: Tile[], partialSplit: TileSet[], strict?: boolean) {
        var handCounts = Splitter._countTiles(hand);
        var handBySplit = _.reduce(partialSplit, function(acc: Tile[], item: TileSet) {
            return acc.concat(item.tilesList);
        }, []);
        var splitCounts = Splitter._countTiles(handBySplit);

        if (strict) {
            return _.isEqual(handCounts, splitCounts);
        } else {
            for (var i in handCounts) {
                if (!handCounts.hasOwnProperty(i)) continue;
                for (var j in splitCounts) {
                    if (!splitCounts.hasOwnProperty(j)) continue;
                    if (i == j) {
                        if (splitCounts[j] > handCounts[i]) {
                            return false;
                        }
                    }
                }
            }
            return true;
        }
    }

    static _findSplitsRecursive(tileSets: TileSet[], hand: Tile[], partialSplit: TileSet[], possibleSplitsList: TileSet[][]) {
        if (partialSplit.length == 5) { // 4sets+1pair
            if (Splitter._checkPartialSplit(hand, partialSplit, true)) {
                possibleSplitsList.push(partialSplit);
            }
            return;
        }

        _.each(tileSets, function(tileSet: TileSet) {
            var newPartialSplit = partialSplit.concat([tileSet]);
            if (!Splitter._checkPartialSplit(hand, newPartialSplit)) return;
            Splitter._findSplitsRecursive(tileSets, hand, newPartialSplit, possibleSplitsList);
        });
    }

    static _findPossibleSplits(hand: Tile[], setList: TileSet[], explicitSets?: TileSet[]) {
        var possibleSplits = [];
        explicitSets = explicitSets || [];

        // 1) find splits with pairs (chiitoitsu-like hands)
        var pairs = _.filter(setList, function(item) {
            return item.isPair();
        });

        var threeTileSets = _.filter(setList.concat(explicitSets), function(item) {
            return !item.isPair();
        });

        if (pairs.length == 7) { // строго, т.к. пары должны быть разными, а больше семи их быть не может
            possibleSplits.push(pairs);
        }

        var fullHand = _.clone(hand);
        _.each(explicitSets, function(item: TileSet) {
            fullHand = fullHand.concat(item.tilesList);
        });

        // 2) find splits like 4 sets + 1 pair
        _.each(pairs, function(pair) { // each pair may be a pair or a part of 11123 type, try each one
            Splitter._findSplitsRecursive(threeTileSets, fullHand, explicitSets.concat([pair]), possibleSplits);
        });

        possibleSplits = Splitter._unify(possibleSplits);

        return possibleSplits;
    }

    static _checkKokushi(hand: Tile[]) {
        var counts = Splitter._countTiles(hand);
        var isKokushi = true;
        var hasPair = false;
        _.each([
            'pin1',
            'pin9',
            'man1',
            'man9',
            'sou1',
            'sou9',
            'ton',
            'nan',
            'sha',
            'pei',
            'chun',
            'haku',
            'hatsu'
        ], function(tile) {
            if (!counts[tile]) isKokushi = false;
            if (counts[tile] == 2) hasPair = true;
        });

        return isKokushi && hasPair;
    }

    /**
     * Примерный алгоритм:
     * 1) Выбираем все тайлы мастей. В худшем случае - вся рука без благородных
     * 2) Идем в цикле по тайлам. Каждый тайл должен стать первым в переборе, после чего цикл завершается.
     * 3) Выбран первый тайл. Идем по руке в поисках второго (только следующего!)
     * Если первый тайл - 8 или 9, то дальше можно не ходить, это уже не чи.
     * 4) Выбран второй тайл. Идем по руке в поисках третьего.
     * Если найден третий - ок, исключаем из руки найденное чи и продолжаем с оставшимися тайлами начиная с п.2
     * 5) Если алгоритм завершен и не осталось больше чи, значит в руке остались только поны.
     *
     * - В итоге алгоритма составляется дерево. Дальнейший алгоритм работает с этим деревом.
     * - При первом обходе дерева сеты дополняются понами (поны детектить проще, чем чи) и парой
     * - При втором обходе дерева исключаются исходы, в которых остались помеченные тайлы (не входящие в поны, чи и пару)
     * - При третьем обходе дерева из найденных исходов формируется массив возможных интерпретаций руки
     *
     * Этот массив в итоге возвращается, после чего во внешнем коде подается на определитель стоимости руки.
     * Выбирается тот вариант, где стоимость выше.
     *
     * @param hand Состав руки
     * @param explicitSets Открытые и объявленные сеты
     * @returns ParsedHand[]
     */
    static split(hand: Tile[], explicitSets?: TileSet[]) {
        var result = new ParsedHand();

        // 2) find all possible sequences, triples and pairs
        var foundSeqs = Splitter._findSequences(hand);
        var foundTriplesAndPairs = Splitter._findTriplesAndPairs(hand);
        var possibleSplitVariants = Splitter._findPossibleSplits(hand, foundSeqs.concat(foundTriplesAndPairs), explicitSets);

        if (possibleSplitVariants.length == 0) { // не нашли разбиение
            // проверим, а не кокуши ли
            if (Splitter._checkKokushi(hand)) {
                result.isSpecial = true;
            }
            return [result]; // вернули пустую руку
        } else {
            return possibleSplitVariants;
        }
    }
}

export = Splitter;
