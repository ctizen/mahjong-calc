process.env.NODE_PATH = __dirname;
require('module').Module._initPaths();

import Splitter = require('modules/Splitter');

console.log('Hello world');
var a = Splitter;