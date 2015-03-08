import util = require('../libdefs/util');

function logEx(item) {
    console.log(util.inspect(item, true, 10)); // 10 levels deep
}

export = logEx;
