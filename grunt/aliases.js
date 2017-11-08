/**
 * konfiguracni soubor pro tasky
 */

'use strict';

module.exports = {

  // grunt defaultni spusteni
  default: [
    'clean',  //vycistim slozku
    'babel:devel', //spustim devel
    'watch', //spustim watch
  ],

  //produke
  build: [
    'clean', //vycistim slozku
    'babel:build', //spustim build
    'uglify', //minifikace js
  ]

}; // module.exports
