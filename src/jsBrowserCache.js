"use strict";
/**
 * JsBrowserCache
 */
class JsBrowserCache {
    
    /**
     * konstruktor
     * @param {object} options nastaveni 
     */
    constructor(options) {
        console.info('Creat object JsBrowserCache');

        this._options = Object.assign({}, {
            prefix : 'mafra-',

        }, options || {});

        this._seconds = 1*1000;

        //otestuji podporu storage
        return this.testSupportsStorage()
    }

    /**
     * 
     */
    testSupportsStorage() {
        let key = 'j8EiBTWwQV',
            value = key;

        //pokud jsem jiz testival, tak nemusim znova
        if (this._supportsStorage !== undefined) {
            return this._supportsStorage;
        }
        
        //otestuji localStorage
        try {
            if (!localStorage) {
                return false;
            }
        } catch (ex) {
            return false;
        }         
    
        try {
            this._setItem(key, value);
            this._removeItem(key);
            this._supportsStorage = true; //pokud projde zapis a cteni nastim podporu na true
        } catch (e) {
            console.warn(e);
            //otestuji jestli neni storage plna
            if (this._IsExceptionOutOfSpace(e) && localStorage.length) {
                this._supportsStorage  = true;
            } else {
                this._supportsStorage  = false;
            }
        }
        return this._supportsStorage; //zde si budu ukladat informaci jestli je cache podporovaná*/
    }

    isSupportsStorage() {
        if (!this._supportsStorage) {
            console.warn('Browser does not support local storage');
        }
        return this._supportsStorage || false;
    }
    
    setItem(key, value, expiration) {
        let record,
            actualTimeStamp = new Date().getTime();
        
        //otestuji jestli je podporovana local storage
        if(!this.isSupportsStorage()) {
            return false;
        }

        console.info('Actual time stamp: ' + actualTimeStamp);
        console.info('Expire: ' + (expiration ? actualTimeStamp + expiration*1*this._seconds : ''));

        record = {
            value: this._jsonToString(value),
            create: actualTimeStamp,
            expire: expiration ? actualTimeStamp + expiration*1*this._seconds : ''
        }

        console.info('record');

        this._removeItem(key);
        this._setItem(key, this._jsonToString(record));
    }

    getItem(key) {
        let record;
    
        //otestuji jestli je podporovana local storage
        if(!this.isSupportsStorage()) {
            return null;
        }

        record = this._getItem(key);

        console.info(record);

        //zjistim jestli polozka existuje
        if(!record) {
            return null;
        }

        record = this._stringToJson(record);

        console.info(record);

        //otestuji jestli je polozka expirovana
        if(record.expire && new Date().getTime() > record.expire) {
            console.log('Item "' + key + '" is expired. Item is removed.');
            this._removeItem(key);
            return null;
        } else {
            return this._stringToJson(record.value);
        }       
    }

    clearExpirate() {
        let keys;
        
        //otestuji jestli je podporovana local storage
        if(!this.isSupportsStorage()) {
            return null;
        }

        if (localStorage.length > 0) {
            keys = Object.keys(localStorage).filter( v => v.startsWith(this._options.prefix) ); //ziskam vsechny klice ktere odpovidaji prefixu

            if (keys.length > 0) {
                for (let i = 0, length = keys.length; i < length; i++){
                    let key = keys[i].replace(this._options.prefix,''), //odeberu u klice prefix
                        record = this._stringToJson(this._getItem(key)); 

                    //otestuji jestli je to klic s prefixem
                    if(record.expire && new Date().getTime() > record.expire) {
                        console.info('Item "' + key + '" is expired. Item is removed.'); 
                        this._removeItem(key);
                    }
                }
            }
        }
    }

    /*clearOlder(time) {

    }*/

    /*clearAll() {

    }*/

    //private Method

    _setItem(key, value) {
        localStorage.setItem(this._options.prefix + key, value);
    }

    _getItem(key) {
        return localStorage.getItem(this._options.prefix + key);
    }

    _removeItem(key) {
        return localStorage.removeItem(this._options.prefix + key);
    }

    _jsonToString(json) {
        return JSON.stringify(json);
    }

    _stringToJson(string) {
        return JSON.parse(string);
    }

    /**
     * otestuje jestli je vyvolaná vyjímka na plný storge
     * @param {object} e exception
     * @returns {bool}
     */
    _IsExceptionOutOfSpace(e) {
        return (e && e.name === 'QUOTA_EXCEEDED_ERR' ||
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
            e.name === 'QuotaExceededError');
    }
}