function Hand() {
    this.tiles = [];
    this.melds = [];
    this.lastDraw = -1;
}

Hand.prototype.toText = function () {

};

Hand.prototype.draw = hand_draw;
function hand_draw(wall) {
    this.tiles.push(wall.tiles.shift());
    this.tiles.sort(ns);
}

/* Not used */
Hand.prototype.add = function (code) {
    var i;

    for (i = 0; i < this.tiles.length; i++) {
        if (this.tiles[i] > code) {
            break;
        }
    }

    this.tiles = this.tiles.slice(0, i).concat(code, this.tiles.slice(i));
};

Hand.prototype.copy = function () {
    var hand = new Hand;

    hand.tiles = this.tiles.slice();
    hand.melds = this.melds;

    return hand;
};

Hand.prototype.wait = function () {
    var wait = [];

    for (var i = 0; i < tiles.length; i++) {
        var code = i << 8;
        var hand = this.copy();

        hand.add(code);

        var com = hand.valid();
        if (com.length == 0) {
            continue;
        }

        wait.push([code, com]);
    }

    return wait;
};

Hand.prototype.waitKind = function (code, combination) {
    var tile = type(code);
    var kind = WAIT_NONE;

    for (var j = 0; j < combination.length; j++) {
        var m = combination[j];
        var mkind = m[0] & MELD_MASK;

        if (mkind == PAIR && type(m[1]) == tile) {
            kind = WAIT_HANGING;
            break;
        }

        if (!m[0] & CLOSED) {
            continue;
        }
        if (mkind == CHII && type(m[1]) + 1 == tile) {
            kind = WAIT_CENTRAL;
            break;
        }
        if (mkind == CHII && (type(m[1]) == tile || type(m[1]) + 1 == tile || type(m[1]) + 2 == tile)) {
            if (numberic(m[1]) == 1 && numberic(code) != 1) {
                kind = WAIT_EDGE;
                break;
            }
            if (numberic(m[1]) == 7 && numberic(code) != 9) {
                kind = WAIT_EDGE;
                break;
            }

            kind = WAIT_TWO_SIDED;
        }
        if (mkind == PON && type(m[1]) == tile) {
            kind = WAIT_DOUBLEPON;
        }
    }

    return kind;
};

Hand.prototype.valid = function () {
    var i;
    var list = this.valid_helper(0, 0, 0, this.melds.length, []);

    /* SPECIAL CASE: KOKUSHI MUSOU */
    if (this.tiles.length == 14) {
        var musou_tile = -1;

        for (i = 0; i < 14; i++) {
            if (musou_tile == -1) {
                if (type(this.tiles[i]) != KOKUSHI_MUSOU_SEQ[i]) {
                    break;
                }

                if (type(this.tiles[i + 1]) == KOKUSHI_MUSOU_SEQ[i]) {
                    musou_tile = this.tiles[i];
                    i++;
                }
            } else {
                if (type(this.tiles[i]) != KOKUSHI_MUSOU_SEQ[i - 1]) {
                    break;
                }
            }
        }

        if (i == 14) {
            return [
                [
                    [KOKUSHI_MUSOU, musou_tile]
                ]
            ]
        }
    }

    var mm = this.melds;
    return list.map(function (x) {
        return x[2].concat(mm.length ? mm : [])
    });
};

/*
 * Mask bits:
 * 0-14 marks whether this tile is used for chii and
 *      should be ignored.
 */

Hand.prototype.valid_helper = function (start, mask, pairs, melds, desc) {
    var result = [];

    if (start == this.tiles.length) {
        if (melds == 0 && pairs == 7) {
            return [
                [pairs, melds, desc]
            ];
        }
        if (melds > 0 && pairs == 1) {
            return [
                [pairs, melds, desc]
            ];
        }

        return [];
    }
    if (start > this.tiles.length) {
        return [];
    }
    var i = start;

    if (mask & (1 << i)) {
        return this.valid_helper(i + 1, mask, pairs, melds, desc);
    }

    var j;
    var tile = this.tiles[i];

    /* Checking for pairs/pons. If two previous tiles are pair
     * and were not used for chii, this one can't form neither
     * pair nor pon with others. */
    if (i < 2 || mask & (1 << (i - 2)) || mask & (1 << (i - 1)) || (type(tile) != type(this.tiles[i - 2])))

    /* Next tile is same as this; adding one pair and branching */
    {
        if (type(tile) == type(this.tiles[i + 1])) {
            /* Pair can only be useful if there are not pairs yet (to form 4
             * melds and pair), or when there are no melds (7 pairs) */
            if (pairs == 0 || melds == 0) {
                result = result.concat(this.valid_helper(i + 2, mask, pairs + 1, melds,
                    desc.concat([
                        [CLOSED + PAIR, tile]
                    ])));
            }

            /* Two next tiles are same as this; adding one pon and branching
             * unless we have two or more pairs -- in this case, melds are no use. */
            if (type(tile) == type(this.tiles[i + 2]) && pairs < 2) {
                result = result.concat(this.valid_helper(i + 3, mask, pairs, melds + 1,
                    desc.concat([
                        [CLOSED + PON, tile]
                    ])));
            }
        }
    }

    /* Checking for chiis: */

    /* Have many pairs, aiming for 7-pairs only; no use checking for chiis */
    if (pairs > 1) {
        return result;
    }

    /* No chiis started by 8s and 9s and honors */
    if (numberic(tile) < 0 || numberic(tile) > 7) {
        return result;
    }

    /* Find first tile suitable for chii. Mask is used here to mark tiles
     * already used for chiis to prevent combinations like 3345 from forming
     * two chiis. */
    for (j = i + 1; (type(this.tiles[j]) == type(tile) || mask & (1 << j)) && j < this.tiles.length; j++);
    if (!tileIsNext(tile, this.tiles[j])) {
        return result;
    }
    var first = j;

    /* Second tile */
    for (j = j + 1; (type(this.tiles[j]) == type(this.tiles[first]) || mask & (1 << j)) && j < this.tiles.length; j++);
    if (!tileIsNext(this.tiles[first], this.tiles[j])) {
        return result;
    }
    var second = j;

    /* Now that we have three tiles forming sequence, branch. It is
     * possible to search for all chii combinations with picked tile,
     * but I don't think there are cases where not doing so would miss
     * a complete hand. */
    result = result.concat(this.valid_helper(i + 1, mask | (1 << i) | (1 << first) | (1 << second), pairs, melds + 1,
        desc.concat([
            [CLOSED + CHII, tile]
        ])));

    return result;
};

function handFromText(text) {
    var tokens = text.match(/([psm][1-9]|c[rwg]|w[sewn])/gi);
    var hand = new Hand;

    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i].toLowerCase();
        var a = token[0], b = token[1];
        var res;

        if (a == 'p') {
            res = 8 + parseInt(b);
        }
        else if (a == 's') {
            res = 17 + parseInt(b);
        }
        else if (a == 'm') {
            res = -1 + parseInt(b);
        }
        else if (a == 'w' && b == 'e') {
            res = 27;
        }
        else if (a == 'w' && b == 's') {
            res = 28;
        }
        else if (a == 'w' && b == 'w') {
            res = 29;
        }
        else if (a == 'w' && b == 'n') {
            res = 30;
        }
        else if (a == 'c' && b == 'w') {
            res = 31;
        }
        else if (a == 'c' && b == 'g') {
            res = 32;
        }
        else if (a == 'c' && b == 'r') {
            res = 33;
        }
        else {
            res = -1;
        }

        hand.add(res << 8);
    }

    return hand;
}

