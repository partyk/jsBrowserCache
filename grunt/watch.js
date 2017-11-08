/** 
 * modul 'grunt-contrib-watch' : sleduje zmeny a na zaklade toho spousti procesy
 * git https://github.com/gruntjs/grunt-contrib-watch
 */

'use strict';

module.exports = {
    options: {
      spawn: false,
      reload: true
    },

    /**
     * watch babel
     */
    default: {
        filter: 'isFile',
        files: ['<%= path.cwd %>/*.js '],
        tasks: ['babel:devel']
    }
}; // module.exports