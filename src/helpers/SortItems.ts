import _ = require('../libdefs/lodash');

function sortItems(result: any[], items: any[], sortFunc?: Function) {
    result = _.sortBy(items, function(item) {
        if (sortFunc) {
            return sortFunc(item);
        }
        return item.toString();
    });
    return true;
}

export = sortItems
