var tiles = require('../proto/tiles');
var sets = require('../proto/sets');
var Hand = require('../proto/hand');
var _ = require('lodash');

function sortItems(items, sortFunc) {
    return _.sortBy(items, function(item) {
        if (sortFunc) {
            return sortFunc(item);
        }
        return item.toString();
    });
}

function countTiles(hand) {
    var map = {};
    _.each(hand, function(tile) {
        map[tile] = map[tile] === undefined ? 1 : map[tile] + 1;
    });

    return map;
}

/**
 * Make items unique
 * @param arr
 */
function unify(arr) {
    for (var i = 0; i < arr.length; i++) {
        for (var j = i; j < arr.length; j++) {
            if (j == i) continue;
            if (_.isEqual(sortItems(arr[i]), sortItems(arr[j]))) {
                arr.splice(j, 1);
                j--;
            }
        }
    }

    return arr;
}

function findSequences(hand) {
    var foundChis = [];
    var suitTiles = _.filter(hand, tiles.isSuit);
    _.each(suitTiles, function(firstTile) {
        if (firstTile.value == 8 || firstTile.value == 9) return; // искать чи начинающиеся с 8 или 9 нет смысла.
        _.each(suitTiles, function(secondTile) {
            if (secondTile == firstTile) return; // тот же тайл
            if (secondTile.suit != firstTile.suit) return; // несовпадающая масть
            if (secondTile.value != firstTile.value + 1) return; // не следующий тайл
            _.each(suitTiles, function(thirdTile) {
                if (thirdTile == secondTile || thirdTile == firstTile) return; // тот же тайл
                if (thirdTile.suit != secondTile.suit) return; // несовпадающая масть
                if (thirdTile.value != secondTile.value + 1) return; // не следующий тайл

                // если дошли досюда, значит нашли чи.
                foundChis.push(sets.chi([firstTile, secondTile, thirdTile]));
            });
        });
    });

    foundChis = unify(foundChis);

    return foundChis;
}

function findTriplesAndPairs(hand) {
    var result = [];
    var counts = countTiles(hand);
    _.each(counts, function(value, key) {
        if (!tiles[key]) return;
        switch (value) {
            case 2:
                result.push(sets.pair(tiles[key]));
                break;
            case 3:
                result.push(sets.pon(tiles[key]));
                result.push(sets.pair(tiles[key]));
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
function checkPartialSplit(hand, partialSplit, strict) {
    var handCounts = countTiles(hand);
    var handBySplit = _.reduce(partialSplit, function(acc, item) {
        return acc.concat(item.getTiles());
    }, []);
    var splitCounts = countTiles(handBySplit);

    if (strict) {
        return _.isEqual(handCounts, splitCounts);
    } else {
        for (var i in handCounts) {
            for (var j in splitCounts) {
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

function findPossibleSplits(hand, setList) {
    var possibleSplits = [];

    // 1) find splits with pairs (chiitoitsu-like hands)
    var pairs = _.filter(setList, function(item) {
        return item.type == sets.TYPES.PAIR;
    });

    var threeTileSets = _.filter(setList, function(item) {
        return item.type != sets.TYPES.PAIR;
    });

    if (pairs.length == 7) { // строго, т.к. пары должны быть разными, а больше семи их быть не может
        possibleSplits.push(pairs);
    }

    // 2) find splits like 4 sets + 1 pair
    _.each(pairs, function(pair) { // each pair may be a pair or a part of 11123 type, try each one
        _.each(threeTileSets, function(firstSet) {
            if (!checkPartialSplit(hand, [pair, firstSet])) return;
            _.each(threeTileSets, function(secondSet) {
                if (!checkPartialSplit(hand, [pair, firstSet, secondSet])) return;
                _.each(threeTileSets, function(thirdSet) {
                    if (!checkPartialSplit(hand, [pair, firstSet, secondSet, thirdSet])) return;
                    _.each(threeTileSets, function(fourthSet) {
                        var possibleSplit = [pair, firstSet, secondSet, thirdSet, fourthSet];
                        if (checkPartialSplit(hand, possibleSplit, true)) {
                            possibleSplits.push(possibleSplit);
                        }
                    });
                });
            });
        });
    });

    possibleSplits = unify(possibleSplits);

    return possibleSplits;
}

function checkKokushi(hand) {
    var counts = countTiles(hand);
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
 */
function splitToSets(hand, explicitSets) {
    var result = new Hand();
    result.sets = result.sets.concat(explicitSets || []);

    // 2) find all possible sequences, triples and pairs
    var foundSeqs = findSequences(hand);
    var foundTriplesAndPairs = findTriplesAndPairs(hand);
    var possibleSplitVariants = findPossibleSplits(hand, foundSeqs.concat(foundTriplesAndPairs));

    if (possibleSplitVariants.length == 0) { // не нашли разбиение
        // проверим, а не кокуши ли
        if (checkKokushi(hand)) {
            result.isSpecial = true;
        }
        return result; // вернули пустую руку
    } else if (possibleSplitVariants.length == 1) { // нашли единственное возможное разбиение - его и возвращаем.
        _.each(possibleSplitVariants[0], function(item) {
            result.add(item);
        });

        return result;
    } else {
        return possibleSplitVariants;
    }
}

module.exports = splitToSets;
// testing
module.exports._countTiles = countTiles;
module.exports._findSequences = findSequences;
module.exports._findTriplesAndPairs = findTriplesAndPairs;
module.exports._checkPartialSplit = checkPartialSplit;
module.exports._unify = unify;
module.exports._findPossibleSplits = findPossibleSplits;