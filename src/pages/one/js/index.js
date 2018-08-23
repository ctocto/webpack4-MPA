// import '../../../lib/style/mobile.common.css';
import '../style/index.css';
import '../style/style.less';

// var $ = require('zepto')

const _ = require('lodash');

const obj = {
    parent: {
        child1: {
            a: 123,
            b: 456,
            c: 789
        },
        child2: {
            d: 321,
            e: 654,
            f: 987
        }
    }
};

let objDeep = _.cloneDeep(obj);
objDeep.parent.child1 = 666;
console.log(obj, objDeep);

const image = require('../images/1533274598.png');

console.log(image)