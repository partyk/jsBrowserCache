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
        options: {
            destination: 'doc',
            encoding: "utf8",
            private: true,
            recurse: true,
            template: "./node_modules/boxy-jsdoc-template"
        },
        src: ['<%= path.cwd %>/*.js', 'README.md']
    }
}; // module.exports
