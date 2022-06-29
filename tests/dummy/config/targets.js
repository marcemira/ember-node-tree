'use strict';

const browsers = [
  'last 1 Chrome versions',
  'last 1 Firefox versions',
  'last 1 Safari versions',
  // running into a bug of ember-animated if not transpiling for IE 11
  // https://github.com/marcemira/ember-node-tree/pull/38#issuecomment-1168866512
  //
  // Using uppercase to bypass tracked-built-ins IE11 detection, which
  // throws a build-time error that IE11 is not supported. Luckly it
  // does strict equal of lowercase string.
  // https://github.com/tracked-tools/tracked-built-ins/commit/c880077875ef5559178dc0918173346c82526801
  'IE 11',
];

module.exports = {
  browsers,
};
