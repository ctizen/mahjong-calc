import _ = require('../libdefs/lodash');
import Yaku = require('Yaku');

class YakuList {
    private _list: Yaku[];

    constructor() {
        this._list = [];
    }

    add(item: Yaku) {
        this._list.push(item);
    }

    makeTotal() {
        var totalHanOpened = 0, totalHanClosed = 0;
        _.each(this._list, function(yaku: Yaku) {
            totalHanOpened += yaku.han.open;
            totalHanClosed += yaku.han.closed;
        });

        return new Yaku('Total:', totalHanOpened, totalHanClosed);
    }
}

export = YakuList;
