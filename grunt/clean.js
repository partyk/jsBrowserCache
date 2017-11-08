/**
 * modul 'grunt-contrib-clean' : pro mazani nepotrebnych souboru/adresaru
 * git https://github.com/gruntjs/grunt-contrib-clean
 */

'use strict';

module.exports = (grunt, options) => {

    let configModule = {
        dist : ['<%= path.dist %>']     
    }

    return configModule;

}; // module.exports