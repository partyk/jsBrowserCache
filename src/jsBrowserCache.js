"use strict";
/**
 * @class JsBrowserCache
 * trida na praci s localStorage
 */
class JsBrowserCache {
    
    /**
     * @constructor
     * @param {Object} options nastaveni
     */
    constructor(options) {
        console.info('Creat object JsBrowserCache');

        /**
         * nastaveni tridy
         * @private
         * @type {Object}
         */
        this._options = Object.assign({}, {
            prefix : 'mafra-',

        }, options || {});

        /**
         * pomocna promena pro prepocet z milisekund na sekundy
         * @private
         * @type {Number}
         */
        this._seconds = 1*1000;

        //otestuji podporu storage
        this.testSupportsStorage()
    }

    /**
     * metoda testuje prohlizec na podporu localStorage
     * @public
     * @returns {Boolean}
     */
    testSupportsStorage() {
        //vytvorim unikatni klic
        let key = 'j8EiBTWwQV',
            value = key;

        //pokud jsem jiz testoval, tak nemusim znova
        if (this._supportsStorage !== undefined) {
            return this._supportsStorage;
        }
        
        //otestuji localStorage
        try {
            //nekterym prohlizecum staci jen podminka
            if (!localStorage) {
                return false;
            }
        } catch (e) {
            //osatni prohlizece vyhazuji exception
            return false;
        }         
    
        try {
            //spravnou funkcnost otestuji zapisem a ctenim z local storage
            this._setItem(key, value);
            this._removeItem(key);
            this._supportsStorage = true; //pokud projde zapis a cteni nastavim podporu na true
        } catch (e) {
            console.warn(e);
            //otestuji jestli neni storage plna
            if (this._IsExceptionOutOfSpace(e) && localStorage.length) {
                this._supportsStorage  = true;
            } else {
                this._supportsStorage  = false;
            }
        }
        return this._supportsStorage;
    }

    /**
     * vrati tru pokud prohlizec podporuje local storage
     * @public
     * @returns {Boolean}
     */
    isSupportsStorage() {
        if (!this._supportsStorage) {
            console.warn('Browser does not support local storage');
        }
        return this._supportsStorage;
    }
    
    /**
     * zapis do loacl storage
     * @public
     * @param {String} key klic zaznamu 
     * @param {String|Array|Object} value hodnota muze byt String, Array, Json
     * @param {Number} expiration 
     */
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

        console.info(record);

        this._removeItem(key);
        this._setItem(key, this._jsonToString(record));
    }

    /**
     * vrati hodnotu klice z local storage nebo null pokud neexistuje
     * @public
     * @param {String} key
     * @returns {String|Array|Object|Null}
     */
    getItem(key) {
        let record;
    
        //otestuji jestli je podporovana local storage
        if(!this.isSupportsStorage()) {
            return null;
        }

        //ziskam zaznma z local storage
        record = this._getItem(key);

        console.info(record);

        //zjistim jestli polozka existuje
        if(!record) {
            return null;
        }

        //prevedu string na json
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

    /**
     * vymaze expirovane zaznamy
     * @public
     */
    clearExpirate() {
        let keys;
        
        //otestuji jestli je podporovana local storage
        if(!this.isSupportsStorage()) {
            return null;
        }

        //pokud je neco v local storage, tak pokracuji
        if (localStorage.length > 0) {

            //ziskam vsechny klice ktere odpovidaji prefixu
            keys = Object.keys(localStorage).filter( v => v.startsWith(this._options.prefix) );

            if (keys.length > 0) {
                for (let i = 0, length = keys.length; i < length; i++){
                    let key = keys[i].replace(this._options.prefix,''), //odeberu u klice prefix
                        record = this._stringToJson(this._getItem(key)); 

                    //otestuji jestli je polozka expirovana
                    if(record.expire && new Date().getTime() > record.expire) {
                        console.info('Item "' + key + '" is expired. Item is removed.'); 
                        this._removeItem(key);
                    }
                }
            }
        }
    }

    /**
     * ulozi zaznam do local storage
     * @private
     * @param {String} key klic
     * @param {String} value hodnota
     */
    _setItem(key, value) {
        localStorage.setItem(this._options.prefix + key, value);
    }

    /**
     * vrati zaznam z local storage
     * @private
     * @param {String} key 
     * @returns {String}
     */
    _getItem(key) {
        return localStorage.getItem(this._options.prefix + key);
    }

    /**
     * smaze hodntu z local storage
     * @private
     * @param {String} key 
     */
    _removeItem(key) {
        localStorage.removeItem(this._options.prefix + key);
    }

    /**
     * prevede json na string
     * @private
     * @param {Object} json
     * @returns {String}
     */
    _jsonToString(json) {
        return JSON.stringify(json);
    }

    /**
     * prevede string na json
     * @private
     * @param {String} string 
     * @returns {Object}
     */
    _stringToJson(string) {
        return JSON.parse(string);
    }

    /**
     * otestuje jestli je vyvolaná vyjímka na plný local storge
     * @param {Object} e exception
     * @returns {Bool}
     */
    _IsExceptionOutOfSpace(e) {
        return (e && e.name === 'QUOTA_EXCEEDED_ERR' ||
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
            e.name === 'QuotaExceededError');
    }
}