'use strict';

module.exports = function (grunt) {
    var options = {
        //cesty
        path: {
            cwd : 'src', //zdrojovy adresar/current working directory
            dist : 'dist',
            doc : 'doc'
        },
        //podpora prohlizecu pro pluginy s fallback kompilaci. Dokumentace -> https://github.com/ai/browserslist
        browsers: ['> 1% in CZ', 'last 3 version', 'ios 6', 'ie 10'],

        //time-grunt bude ukecanejsi
        jitGrunt: true,
    
        // Externi konfig
        pkg: grunt.file.readJSON('package.json')
    };

    grunt.config.init(options);

    /**
	 * modul 'time-grunt' : pro debug. Zobrazi delku jednotlivych procesu
     * git https://github.com/sindresorhus/time-grunt 
	 */
    require('time-grunt')(grunt);
    
    require('load-grunt-config')(grunt, { config: options }); 
};