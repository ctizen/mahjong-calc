var tiles = require('../proto/tiles');
var sets = require('../proto/sets');
var _ = require('lodash');

function ParsedHand() {
    this.sets = [];
    this.pairs = [];
    this.isFinishedHand = false;
    // special hands
    this.isKokushi = false;
    this.isChiitoitsu = false;
}

function countTiles(hand) {
    var map = {};
    _.each(hand, function(tile) {
        map[tile] = map[tile] === undefined ? 1 : map[tile] + 1;
    });

    return map;
}

/**
 *
 * @param hand Состав руки
 * @param explicitSets Открытые и объявленные сеты
 */
function splitToSets(hand, explicitSets) {
    var result = new ParsedHand();
    result.sets = result.sets.concat(explicitSets || []);
    var counts = countTiles(hand);

    // 0) check for chiitoitsu
    result.isChiitoitsu = true;
    _.each(counts, function(value) {
        if (value != 2) {
            result.isChiitoitsu = false;
        }
    });
    if (result.isChiitoitsu) {
        _.each(counts, function(value, key) {
            result.pairs.push(sets.pair(tiles[key]));
        });
        return result;
    }

    // 1) find all honor pairs and sets
    _.each(counts, function(value, key) {
        if (_.contains(['chun', 'haku', 'hatsu', 'ton', 'nan', 'sha', 'pei'], key)) {
            switch (value) {
                case 2:
                    result.sets.push(sets.pair(tiles[key]));
                    break;
                case 3:
                    result.sets.push(sets.pon(tiles[key]));
                    break;
            }
        }
    });

    // 2) find all sequences
    /*
        Примерный алгоритм:
        1) Выбираем все тайлы мастей. В худшем случае - вся рука без благородных
        2) Идем в цикле по тайлам. Каждый тайл должен стать первым в переборе, после чего цикл завершается.
        3) Выбран первый тайл. Идем по руке в поисках второго (только следующего!)
            Если первый тайл - 8 или 9, то дальше можно не ходить, это уже не чи.
        4) Выбран второй тайл. Идем по руке в поисках третьего.
            Если найден третий - ок, исключаем из руки найденное чи и продолжаем с оставшимися тайлами начиная с п.2
        5) Если алгоритм завершен и не осталось больше чи, значит в руке остались только поны.

        - В итоге алгоритма составляется дерево. Дальнейший алгоритм работает с этим деревом.
        - При первом обходе дерева сеты дополняются понами (поны детектить проще, чем чи) и парой
        - При втором обходе дерева исключаются исходы, в которых остались помеченные тайлы (не входящие в поны, чи и пару)
        - При третьем обходе дерева из найденных исходов формируется массив возможных интерпретаций руки

        Этот массив в итоге возвращается, после чего во внешнем коде подается на определитель стоимости руки.
        Выбирается тот вариант, где стоимость выше.
     */
    console.log(foundSets);
}

module.exports = splitToSets;