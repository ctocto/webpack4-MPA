import '../style/style.less'

// const _ = require('lodash');

import template from '@/lib/artTemplate'

import goodsList from '../mock/goodsList'

const html = template('goods-list', goodsList.data)

document.getElementById('wrapper').innerHTML = html
