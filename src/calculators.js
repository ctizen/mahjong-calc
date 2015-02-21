var _ = require('lodash');

function calculateFu(combination, hand) {
    var description = [
        ["Base score", 20]
    ];

    var all_closed = true;
    var pairs_count = 0;
    var pon_count = 0;
    var kan_count = 0;

    combination.forEach(function (c) {
        var closed = c[0] & CLOSED;
        var kind = c[0] & MELD_MASK;
        var tile = generalize(c[1]);

        if (!closed) {
            all_closed = false;
        }

        if (kind == PAIR) {
            if (tile == hand.ownWind && tile == hand.roundWind) {
                description.push(["Double wind pair", 4]);
            }
            else if (tile == hand.ownWind) {
                description.push(["Position wind pair", 2]);
            }
            else if (tile == hand.roundWind) {
                description.push(["Round wind pair", 2]);
            }
            else if (tile == (31 << 8) || tile == (32 << 8) || tile == (33 << 8)) {
                description.push([capitalize(describeMeld(c)), 2]);
            }

            pairs_count++;
        } else if (kind == CHII) {
        } else if (kind == PON) {
            pon_count++;

            if (isTerminal(tile)) {
                description.push(closed ?
                    [capitalize(describeMeld(c)), 8] :
                    [capitalize(describeMeld(c)), 4]);
            }
            else {
                description.push(closed ?
                    [capitalize(describeMeld(c)), 4] :
                    [capitalize(describeMeld(c)), 2]);
            }

        } else if (kind == KAN) {
            kan_count++;

            if (isTerminal(tile)) {
                description.push(closed ?
                    [capitalize(describeMeld(c)), 32] :
                    [capitalize(describeMeld(c)), 16]);
            }
            else {
                description.push(closed ?
                    [capitalize(describeMeld(c)), 16] :
                    [capitalize(describeMeld(c)), 8]);
            }
        }
    });

    if (pairs_count == 7) {
        return [25, [
            ["Seven pairs", 25]
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

function calculateYaku(combination, hand) {
    var i;
    var description = [];

    var all_closed = true;
    var pair_is_special = false;

    var wait = WAIT_NONE;
    if (hand.lastDraw) {
        var wait = hand.waitKind(hand.lastDraw, combination);
    }

    var allTiles = _.reduce(hands.melds, function (result, element) {
        return result.concat(element[2]);
    }, hand.tiles.slice());
    allTiles = allTiles.sort(ns);

    var pairs = 0;
    var chiis = 0;
    var pons = 0;
    var closedPons = 0;
    var openPons = 0;
    var kans = 0;
    var closedKans = 0;
    var openKans = 0;
    var colorMelds = 0;
    var windMelds = 0;

    var colorPairs = 0;
    var windPairs = 0;
    var pairTile;

    var chiiCounts = tiles.map(function () {
        return 0
    });
    var ponCounts = tiles.map(function () {
        return 0
    });
    var suitsCounts = [0, 0, 0, 0];

    var dirtyTerminalMelds = 0;
    var pureTerminalMelds = 0;
    var dirtyEndMelds = 0;
    var pureEndMelds = 0;

    var specials = 0;

    combination.forEach(function (c) {
        var closed = c[0] & CLOSED;
        var kind = c[0] & MELD_MASK;
        var tile = generalize(c[1]);

        if (!closed) {
            all_closed = false;
        }
        suitsCounts[suit(tile)]++;

        if (kind == PAIR) {
            if (isColor(tile) || tile == hand.ownWind || tile == hand.roundWind) {
                pair_is_special = true;
            }
            pairTile = tile;

            pairs++;
            if (isColor(tile)) {
                colorPairs++;
            }
            if (isWind(tile)) {
                windPairs++;
            }

            if (isTerminal(tile)) {
                dirtyTerminalMelds++;
                dirtyEndMelds++;
            }
            if (isEnd(tile)) {
                pureTerminalMelds++;
                pureEndMelds++;
            }
        } else if (kind == CHII) {
            chiiCounts[type(tile)]++;

            if (numberic(tile) == 1 || numberic(tile) == 7) {
                pureEndMelds++, dirtyEndMelds++;
            }
        } else if (kind == PON) {
            pons++;
            closed ? closedPons++ : openPons++;

            ponCounts[type(tile)]++;

            if (isColor(tile)) {
                colorMelds++;
            }
            if (isWind(tile)) {
                windMelds++;
            }

            if (tile == hand.ownWind) {
                specials++;
            }
            if (tile == hand.roundWind) {
                specials++;
            }

            if (isTerminal(tile)) {
                dirtyTerminalMelds++;
                dirtyEndMelds++;
            }
            if (isEnd(tile)) {
                pureTerminalMelds++;
                pureEndMelds++;
            }
        } else if (kind == KAN) {
            kans++;
            closed ? closedKans++ : openKans++;

            if (isColor(tile)) {
                colorMelds++;
            }
            if (isWind(tile)) {
                windMelds++;
            }

            if (tile == hand.ownWind) {
                specials++;
            }
            if (tile == hand.roundWind) {
                specials++;
            }

            if (isTerminal(tile)) {
                dirtyTerminalMelds++;
                dirtyEndMelds++;
            }
            if (isEnd(tile)) {
                pureTerminalMelds++;
                pureEndMelds++;
            }
        }
    });

    function returnYakuman(text, value) {
        return [value, [
            [text, value]
        ]];
    }

    var greens = _.reduce(allTiles, function (result, element) {
        return result + (isGreen(element) ? 1 : 0);
    }, 0);
    if (greens == allTiles.length) {
        description.push(["ALL GREEN", -1]);
    }

    var allSameSuit = _.reduce(allTiles, function (result, element) {
        return suit(element) == result ? result : -1;
    }, suit(allTiles[0]));
    if (allSameSuit != -1 && allSameSuit != HONORS) {
        var extra_tile = -1;
        for (i = 0; i < CHUUREN_POOTOO.length; i++) {
            if (extra_tile == -1) {
                if (numberic(allTiles[i]) != CHUUREN_POOTOO[i]) {
                    break;
                }

                if (i >= 2 && numberic(allTiles[i + 1]) == CHUUREN_POOTOO[i]) {
                    extra_tile = allTiles[i];
                }
            } else {
                if (numberic(allTiles[i + 1]) != CHUUREN_POOTOO[i]) {
                    break;
                }
            }
        }

        if (i == CHUUREN_POOTOO.length) {
            description.push(hand.lastDraw == extra_tile ?
                ["NINE GATES NINE WAIT", -2] :
                ["NINE GATES", -1]);
        }
    }

    if (colorMelds == 3) {
        description.push(["BIG THREE ELEMENTS", -1]);
    }

    if (windMelds == 3 && windPairs == 1) {
        description.push(["LITTLE FOUR WINDS", -1]);
    }

    if (windMelds == 4) {
        description.push(["BIG FOUR WINDS", -2]);
    }

    if (closedPons + closedKans == 4) {
        description.push(hand.lastDraw == pairTile ?
            ["FOUR CONCEALED TRIPLES PAIR WAIT", -2] :
            ["FOUR CONCEALED TRIPLES", -1]);
    }

    if (kans == 4) {
        description.push(["FOUR QUADS", -1]);
    }

    if (colorMelds + windMelds + colorPairs + windPairs == combination.length) {
        description.push(["ALL HONORS", -1]);
    }

    if (pureTerminalMelds == combination.length) {
        description.push(["ALL TERMINALS", -1]);
    }

    if ((combination[0][0] & MELD_MASK) == KOKUSHI_MUSOU) {
        description.push(hand.lastDraw == combination[0][1] ?
            ["THIRTEEN ORPHANS THIRTEEN WAIT", -2] :
            ["THIRTEEN ORPHANS", -1]);
    }


    var sum = _.reduce(description, function (sum, element) {
        return sum + element[1];
    }, 0);
    if (sum != 0) {
        return [sum, description];
    }

    if (all_closed && !hand.ron) {
        description.push(["SELF PICK", 1]);
    }

    if (colorPairs == 1 && colorMelds == 2) {
        description.push(["LITTLE THREE ELEMENTS", 4]);
        colorMelds -= 2;
    }

    if (colorMelds + specials > 0) {
        description.push(["SPECIAL TILES", colorMelds + specials]);
    }

    if (all_closed && !pair_is_special && wait == WAIT_TWO_SIDED && pons == 0 && kans == 0) {
        description.push(["NO-POINTS HAND", 1]);
    }

    var terminals = _.reduce(allTiles, function (result, element) {
        return isTerminal(element) ? result + 1 : result;
    }, 0);
    if (terminals == 0) {
        description.push(["ALL SIMPLES", 1]);
    }

    var doubleChiis = _.reduce(chiiCounts, function (result, element) {
        return element == 2 ? result + 1 : result;
    }, 0);
    if (doubleChiis == 1 && all_closed) {
        description.push(["ONE SET OF IDENTICAL SEQUENCES", 1]);
    }

    if (hand.dabururiichi) {
        description.push(["DOUBLE-READY", 2]);
    }
    else if (hand.riichi) {
        description.push(["READY HAND", 1]);
    }

    if ((hand.dabururiichi || hand.riichi) && hand.ippatsu) {
        description.push(["ONE-SHOT", 1]);
    }

    if (hand.rinjan) {
        description.push(["GOING OUT ON A SUPPLEMENTAL TILE FROM THE DEAD WALL", 1]);
    }

    if (hand.chankan) {
        description.push(["ROBBING A QUAD TO GO OUT", 1]);
    }

    if (hand.haidei) {
        description.push(["LAST TILE FROM THE WALL", 1]);
    }

    if (hand.houdei) {
        description.push(["LAST TILE FROM THE WALL DISCARD ", 1]);
    }


    if ((chiiCounts[ 0] && chiiCounts[ 3] && chiiCounts[ 6]) ||
        (chiiCounts[ 9] && chiiCounts[12] && chiiCounts[15]) ||
        (chiiCounts[18] && chiiCounts[21] && chiiCounts[24])) {
        description.push(["STRAIGHT THROUGH", all_closed ? 2 : 1]);
    }


    if (dirtyTerminalMelds == combination.length) {
        description.push(["ALL TERMINALS AND HONORS", pairs == 7 ? 2 : 4]);
    }
    else if (pureEndMelds == combination.length) {
        description.push(["TERMINAL IN EACH SET", all_closed ? 3 : 2]);
    }
    else if (dirtyEndMelds == combination.length) {
        description.push(["TERMINAL OR HONOR IN EACH SET", all_closed ? 2 : 1]);
    }


    [0, 1, 2, 3, 4, 5, 6].forEach(function (a) {
        if (chiiCounts[a] && chiiCounts[a + 9] && chiiCounts[a + 18]) {
            description.push(["THREE COLOUR STRAIGHT", all_closed ? 2 : 1]);
        }
    });

    [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach(function (a) {
        if (ponCounts[a] && ponCounts[a + 9] && ponCounts[a + 18]) {
            description.push(["THREE COLOUR TRIPLETS", 2]);
        }
    });

    if (pairs == 7) {
        description.push(["SEVEN PAIRS", 2]);
    }

    if (chiis == 0 && pons + kans == 4 && dirtyTerminalMelds != combination.length) {
        description.push(["ALL TRIPLET HAND", 2]);
    }

    if (closedPons + closedKans == 3) {
        description.push(["THREE CONCEALED TRIPLETS", 2]);
    }

    if (kans == 3) {
        description.push(["THREE QUADS", 2]);
    }

    if ((suitsCounts[MAN] == 0 && suitsCounts[PIN] == 0 && suitsCounts[HONORS] == 0) ||
        (suitsCounts[MAN] == 0 && suitsCounts[SOU] == 0 && suitsCounts[HONORS] == 0) ||
        (suitsCounts[SOU] == 0 && suitsCounts[PIN] == 0 && suitsCounts[HONORS] == 0)) {
        description.push(["SINGLE SUIT HAND", all_closed ? 6 : 5]);
    } else if ((suitsCounts[MAN] == 0 && suitsCounts[PIN] == 0 && suitsCounts[SOU] != 0) ||
        (suitsCounts[MAN] == 0 && suitsCounts[PIN] != 0 && suitsCounts[SOU] == 0) ||
        (suitsCounts[MAN] != 0 && suitsCounts[PIN] == 0 && suitsCounts[SOU] == 0)) {
        description.push(["ONE SUIT PLUS HONORS", all_closed ? 3 : 2]);
    }

    if (doubleChiis == 2 && all_closed) {
        description.push(["TWO SETS OF IDENTICAL SEQUENCES", 3]);
    }


    var tripleChiis = _.reduce(chiiCounts, function (result, element) {
        return element == 3 ? result + 1 : result;
    }, 0);
    if (tripleChiis == 1) {
        description.push(["ONE SUIT TRIPLE SEQUENCE", 2]);
    }

    [0, 1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23, 24].forEach(function (a) {
        if (ponCounts[a] && ponCounts[a + 1] && ponCounts[a + 2]) {
            description.push(["ONE SUIT TRIPLE SEQUENCE", 2]);
        }
    });

    if (description.length > 0) {
        var redTiles = _.reduce(allTiles, function (result, element) {
            return (element & RED) ? result + 1 : result;
        }, 0);
        if (redTiles > 0) {
            description.push(["RED TILES", redTiles]);
        }


        var doras = hand.dora.map(function (a) {
            return type(getDora(a))
        });

        var doraTiles = _.reduce(allTiles, function (result, outerElement) {
            return result + _.reduce(doras, function (result, element) {
                return (type(outerElement) == element) ? result + 1 : result;
            }, 0);
        }, 0);

        if (doraTiles > 0) {
            description.push(["DORA", doraTiles]);
        }
    }

    var sum = _.reduce(description, function (sum, element) {
        return sum + element[1];
    }, 0);

    return [sum, description];
}
