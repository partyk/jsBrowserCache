'use strict';

module.exports = {

    options: {
        sourceMap: true, //vytvorim sourceMap
        comments: false, //vyhodim komentare
        presets: ['es2015'], //nastavim ES5
        plugins: ["transform-object-assign"]
    },

    //devel
    devel: {
        expand: true, // Enable dynamic expansion.
        filter: 'isFile',
        cwd: '<%= path.cwd %>', // cesta k src
        src: ['**/*.js'], // co se ma kompilovat
        dest: '<%= path.dist %>', //cesta kam se ma kompilovat
        //ext: '.js', //zmenim koncovku
        //extDot: 'last' //koncovka se meni po prvni tecce proto se umaze .js
    },

    //build
    build: {
        expand: true, // Enable dynamic expansion.
        filter: 'isFile',
        cwd: '<%= path.cwd %>', // cesta k src
        src: ['**/*.js'], // co se ma kompilovat
        dest: '<%= path.dist %>', //cesta kam se ma kompilovat
        options: {
            "plugins": [
                ["transform-object-assign"],
                ["transform-remove-console", { "exclude": ["error", "warn", "log"] }] //odebrani console.log
            ],
        },
        //ext: '.js', //zmenim koncovku
        //extDot: 'last' //koncovka se meni po prvni tecce proto se umaze .js
    }
}; // module.export