"use strict";
/**
 * @class JsBrowserCache
 * JsBrowserCache je trida na ukladani a ziskavani dat z localStorage a sessionStorage s moznosti expirace zaznamu ve storage
 */
class JsBrowserCache {
    
    /**
     * @constructor
     * @param {Object} options nastaveni
     * @example
     *  {
     *      prefix: 'cache-', // Nasatveni prefixu. Defaultni hodnota je 'cache-'.Prefix se bude pridavat k ID zaznamu, ktery se bude ukladat do storage
     *      storage: 'session', // Nasatveni typu uloziste. Defaultni hodnota je 'local'. 'local' je pro nastaveni localStorage a 'session' je pro nastaveni sessionStorage
     *  }
     */
    constructor(options) {
        console.info('Creat object JsBrowserCache');

        /**
         * nastaveni tridy
         * @private
         * @type {Object}
         */
        this._options = Object.assign({}, {
            prefix : 'cache-',
            storage: 'local'

        }, options || {});

        /**
         * pomocna promena pro prepocet z milisekund na sekundy
         * @private
         * @type {Number}
         */
        this._seconds = 1*1000;

        //nastavim storage
        this._setStorage();

        //otestuji podporu storage
        this.testSupportsStorage()
    }

    /**
     * metoda testuje prohlizec na podporu storage
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
        
        //otestuji jestli existuje kurzor na storage
        if (!this._storage) {
            return this._supportsStorage  = false;
        }       
    
        try {
            //spravnou funkcnost otestuji zapisem a ctenim z storage
            this._setItem(key, value);
            this._removeItem(key);
            this._supportsStorage = true; //pokud projde zapis a cteni nastavim podporu na true
        } catch (e) {
            console.warn(e);
            //otestuji jestli neni storage plna
            if (this._IsExceptionOutOfSpace(e) && this._storage.length) {
                this._supportsStorage  = true;
            } else {
                this._supportsStorage  = false;
            }
        }
        return this._supportsStorage;
    }

    /**
     * vrati true pokud prohlizec podporuje storage
     * @public
     * @returns {Boolean} 
     */
    isSupportsStorage() {
        if (!this._supportsStorage) {
            console.warn('Browser does not support storage');
        }
        return this._supportsStorage;
    }
    
    /**
     * zapise hodnotu do storage
     * 
     * @public
     * 
     * @param {String} key unikatni klic zaznamu ve storage
     * @param {String|Array|Object|Number} value hodnota muze byt String, Array, Json, Number
     * @param {Number} expiration je nepovinny parametr a udava se v sekundach.
     * 
     * @example
     *  var cache = new JsBrowserCache();
     *      cache.setItem('test1', 'test string');  
     *      cache.setItem('test2', 'test string', 60); //expire 60 seconds   
     * 
     * @returns {Bool} vrati hodntu true pokud se hodnota zapise do storage
     */
    setItem(key, value, expiration) {
        let record,
            actualTimeStamp = new Date().getTime();
        
        //otestuji jestli je podporovana storage
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

        try {
            this._removeItem(key);
            this._setItem(key, this._jsonToString(record));
            return true;
        } catch (e) {
            console.warn(e);
            //zachytavam vyjimku pro pripad ze jeplna storage
            if (this._IsExceptionOutOfSpace(e) && this._storage.length) {
                this.clearExpirate();
                this._setItem(key, this._jsonToString(record));
                //a otestuji jestli se zapsala a vratim Bool
                return !!this._getItem(key);
            } else {
                return false;
            }
        }
    }

    /**
     * vrati hodnotu ze storage na zaklade zadaneho klice.
     * @public
     * @param {String} key klic zaznamu
     *  
     * @example
     *  var cache = new JsBrowserCache();
     *      cache.getItem('test');
     * 
     * @returns {String|Array|Object|Number|Null} pokud klic neexistuje vratí null jinak vrati zapsanou hodnotu ve storage
     */
    getItem(key) {
        let record;
    
        //otestuji jestli je podporovana storage
        if(!this.isSupportsStorage()) {
            return null;
        }

        //ziskam zaznma ze storage
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
     * vymaze expirovane zaznamy ze storage
     * @public
     * 
     * @example
     *  var cache = new JsBrowserCache();
     *      cache.clearExpired();
     * 
     */
    clearExpired() {
        let keys;
        
        //otestuji jestli je podporovana storage
        if(!this.isSupportsStorage()) {
            return null;
        }

        //pokud je neco v storage, tak pokracuji
        if (this._storage.length > 0) {

            //ziskam vsechny klice ktere odpovidaji prefixu
            keys = Object.keys(this._storage).filter( v => v.startsWith(this._options.prefix) );

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
     * nastavi storage (local|session) local = localStorage, session = sessionStorage
     * @private
     * @param {String} storage nazev storage (local|session) 
     */
    _setStorage(storageName) {
        try {
            this._storage = storageName !== 'session' ? localStorage : sessionStorage;
        } catch(e) {
            this._storage = false;
        }
    }

    /**
     * ulozi zaznam do storage
     * @private
     * @param {String} key klic
     * @param {String} value hodnota klice
     */
    _setItem(key, value) {
        this._storage.setItem(this._options.prefix + key, value);
    }

    /**
     * vrati zaznam ze storage
     * @private
     * @param {String} key klic
     * @returns {String|Null} vrati hodntou klice jako string. Pokud klic neexistuje vrati Null
     */
    _getItem(key) {
        return this._storage.getItem(this._options.prefix + key);
    }

    /**
     * smaze zaznam ve storage
     * @private
     * @param {String} key 
     */
    _removeItem(key) {
        this._storage.removeItem(this._options.prefix + key);
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
     * otestuje jestli je vyvolaná vyjímka na plný storge
     * @private
     * @param {Object} e exception
     * @returns {Bool}
     */
    _IsExceptionOutOfSpace(e) {
        return (e && e.name === 'QUOTA_EXCEEDED_ERR' ||
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
            e.name === 'QuotaExceededError');
    }
}