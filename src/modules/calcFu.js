var _ = require('lodash');
var fu = require('./fuDescriptionEntry');


function describe(code) {
    var id = code >> 8;
    var res = tiles[id];

    if (code & RED) {
        res = "RED " + res;
    }

    return res;
}

function describeTileSet(tileSet) {
    var res;

    if ((tileSet[0] & MELD_MASK) == PAIR) {
        res = "PAIR OF " + describe(tileSet[1]);
    }
    if ((tileSet[0] & MELD_MASK) == PON) {
        res = "PON OF " + describe(tileSet[1]);
    }
    if ((tileSet[0] & MELD_MASK) == KAN) {
        res = "KAN OF " + describe(tileSet[1]);
    }
    if ((tileSet[0] & MELD_MASK) == CHII) {
        res = "CHII OF " +
            numbers[numberic(tileSet[1]) - 1] + "-" +
            numbers[numberic(tileSet[1])] + "-" +
            numbers[numberic(tileSet[1]) + 1] +
            " OF " + suits[suit(tileSet[1])];
    }
    if ((tileSet[0] & MELD_MASK) == KOKUSHI_MUSOU) {
        return "KOKUSHI MUSOU";
    }

    if (!res) {
        return "UNK";
    }

    if (!(tileSet[0] & CLOSED)) {
        res = "OPEN " + res;
    }

    return res;
}

function calculateFu(combination, hand) {
    var description = [
        fu.base
    ];

    var all_closed = true;
    var pairs_count = 0;
    var pon_count = 0;
    var kan_count = 0;

    combination.forEach(function (tileSet) {
        var closed = tileSet[0] & CLOSED;
        var kind = tileSet[0] & MELD_MASK;
        var tile = generalize(tileSet[1]);

        if (!closed) {
            all_closed = false;
        }

        if (kind == PAIR) {
            if (tile == hand.ownWind && tile == hand.roundWind) {
                description.push(fu.doubleWind);
            }
            else if (tile == hand.ownWind) {
                description.push(fu.placeWind);
            }
            else if (tile == hand.roundWind) {
                description.push(fu.roundWind);
            }
            else if (tile == (31 << 8) || tile == (32 << 8) || tile == (33 << 8)) { // драконы, вероятно?
                description.push([capitalize(describeTileSet(tileSet)), 2]);
            }

            pairs_count++;
        } else if (kind == CHII) {
            // тут делать нечего
        } else if (kind == PON) {
            pon_count++;

            if (isTerminal(tile)) {
                description.push(closed ?
                    [capitalize(describeTileSet(tileSet)), 8] :
                    [capitalize(describeTileSet(tileSet)), 4]);
            }
            else {
                description.push(closed ?
                    [capitalize(describeTileSet(tileSet)), 4] :
                    [capitalize(describeTileSet(tileSet)), 2]);
            }

        } else if (kind == KAN) {
            kan_count++;

            if (isTerminal(tile)) {
                description.push(closed ?
                    [capitalize(describeTileSet(tileSet)), 32] :
                    [capitalize(describeTileSet(tileSet)), 16]);
            }
            else {
                description.push(closed ?
                    [capitalize(describeTileSet(tileSet)), 16] :
                    [capitalize(describeTileSet(tileSet)), 8]);
            }
        }
    });

    if (pairs_count == 7) {
        return [25, [
            fu.sevenPairs
        ]];
    }

    /*	if(pon_count==0 && kan_count==0) return hand.ron?
     [30,[["All Sequence",30]]]:
     [20,[["All Sequence",20]]]*/

    if (all_closed && hand.ron) {
        description.push(["Closure Bonus", 10]);
    }
    if (!hand.ron && description.length > 1) {
        description.push(["Self-draw Bonus", 2]);
    }

    if (hand.lastDraw) {
        var wait = hand.waitKind(hand.lastDraw, combination);

        if (wait == WAIT_CENTRAL || wait == WAIT_EDGE || wait == WAIT_HANGING) {
            description.push([capitalize(waits[wait]) + " wait", 2]);
        }
    }

    var sum = _.reduce(description, function (sum, element) {
        return sum + element[1];
    }, 0);
    var rounded = Math.ceil(sum / 10) * 10;

    if (sum != rounded) {
        description.push(["Rounded up", rounded - sum]);
    }

    return [rounded, description];
}