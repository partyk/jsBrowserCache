"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JsBrowserCache = function () {
    function JsBrowserCache(options) {
        _classCallCheck(this, JsBrowserCache);

        this._options = _extends({}, {
            prefix: 'cache-',
            storage: 'local'

        }, options || {});

        this._seconds = 1 * 1000;

        this._setStorage();

        this.testSupportsStorage();
    }

    _createClass(JsBrowserCache, [{
        key: 'testSupportsStorage',
        value: function testSupportsStorage() {
            var key = 'j8EiBTWwQV',
                value = key;

            if (this._supportsStorage !== undefined) {
                return this._supportsStorage;
            }

            if (!this._storage) {
                return this._supportsStorage = false;
            }

            try {
                this._setItem(key, value);
                this._removeItem(key);
                this._supportsStorage = true;
            } catch (e) {
                if (this._IsExceptionOutOfSpace(e) && this._storage.length) {
                    this._supportsStorage = true;
                } else {
                    this._supportsStorage = false;
                }
            }
            return this._supportsStorage;
        }
    }, {
        key: 'isSupportsStorage',
        value: function isSupportsStorage() {
            if (!this._supportsStorage) {}
            return this._supportsStorage;
        }
    }, {
        key: 'setItem',
        value: function setItem(key, value, expiration) {
            var record = void 0,
                actualTimeStamp = new Date().getTime();

            if (!this.isSupportsStorage()) {
                return false;
            }

            record = {
                value: this._jsonToString(value),
                create: actualTimeStamp,
                expire: expiration ? actualTimeStamp + expiration * 1 * this._seconds : ''
            };

            try {
                this._removeItem(key);
                this._setItem(key, this._jsonToString(record));
                return true;
            } catch (e) {
                if (this._IsExceptionOutOfSpace(e) && this._storage.length) {
                    this.clearExpirate();
                    this._setItem(key, this._jsonToString(record));

                    return !!this._getItem(key);
                } else {
                    return false;
                }
            }
        }
    }, {
        key: 'getItem',
        value: function getItem(key) {
            var record = void 0;

            if (!this.isSupportsStorage()) {
                return null;
            }

            record = this._getItem(key);

            if (!record) {
                return null;
            }

            record = this._stringToJson(record);

            if (record.expire && new Date().getTime() > record.expire) {
                this._removeItem(key);
                return null;
            } else {
                return this._stringToJson(record.value);
            }
        }
    }, {
        key: 'clearExpired',
        value: function clearExpired() {
            var _this = this;

            var keys = void 0;

            if (!this.isSupportsStorage()) {
                return null;
            }

            if (this._storage.length > 0) {
                keys = Object.keys(this._storage).filter(function (v) {
                    return v.indexOf(_this._options.prefix) === 0;
                });

                if (keys.length > 0) {
                    for (var i = 0, length = keys.length; i < length; i++) {
                        var key = keys[i].replace(this._options.prefix, ''),
                            record = this._stringToJson(this._getItem(key));

                        if (record.expire && new Date().getTime() > record.expire) {
                            this._removeItem(key);
                        }
                    }
                }
            }
        }
    }, {
        key: '_setStorage',
        value: function _setStorage(storageName) {
            try {
                this._storage = storageName !== 'session' ? localStorage : sessionStorage;
            } catch (e) {
                this._storage = false;
            }
        }
    }, {
        key: '_setItem',
        value: function _setItem(key, value) {
            this._storage.setItem(this._options.prefix + key, value);
        }
    }, {
        key: '_getItem',
        value: function _getItem(key) {
            return this._storage.getItem(this._options.prefix + key);
        }
    }, {
        key: '_removeItem',
        value: function _removeItem(key) {
            this._storage.removeItem(this._options.prefix + key);
        }
    }, {
        key: '_jsonToString',
        value: function _jsonToString(json) {
            return JSON.stringify(json);
        }
    }, {
        key: '_stringToJson',
        value: function _stringToJson(string) {
            return JSON.parse(string);
        }
    }, {
        key: '_IsExceptionOutOfSpace',
        value: function _IsExceptionOutOfSpace(e) {
            return e && e.name === 'QUOTA_EXCEEDED_ERR' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e.name === 'QuotaExceededError';
        }
    }]);

    return JsBrowserCache;
}();
//# sourceMappingURL=jsBrowserCache.js.map
