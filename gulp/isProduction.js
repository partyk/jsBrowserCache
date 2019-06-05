let argv = require('minimist')(process.argv.slice(2));

module.exports = function () {
    return argv.env === 'production';
};