/**
 * modul 'grunt-contrib-uglify' : minifikace javascriptu
 * git https://github.com/gruntjs/grunt-contrib-uglify
 */

'use strict';

module.exports = {
    /**
     * nastaveni pro vsechny tasky
     */
    options : {
        sourceMap : true
    },

    /**
     * defaultni kompilace less. Kompiluje vse z adresare '<%= path.cwd %>/css/src/' do '<%= path.dest %>/css/'
     */
    default: {
        files: [{
            expand: true,
            cwd: '<%= path.dist %>',
            src: ['**/*.js'], //minifikuji vsechny JS soubory az naty s ES6
            dest: '<%= path.dist %>',
            ext: '.min.js', //zmenim koncovku
            extDot: 'last' //koncovka se meni po prvni tecce proto se umaze .js
        }]
    }

}; // module.exports