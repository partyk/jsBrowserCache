[![npm version](https://badge.fury.io/js/jsbrowsercache.svg)](https://badge.fury.io/js/jsbrowsercache)

# jsBrowserCache

JavaScript library for save, load data to localStorage or sessionStorage and expire time.

---

## Installation

Download or clone repository.

## NPM

npm install jsbrowsercache --save

## Yarn

yarn add jsbrowsercache --save

## Bower

bower install jsbrowsercache

## How to use

Paste to between head tag 

```
<script src="../dist/jsBrowserCache.js"></script>
<script>
    var cache = new JsBrowserCache.default();
    cache.clearExpired();
</script>
```

Use as import module
```
import JsBrowserCache. from 'jsbrowsercache/dist/jsBrowserCache.js';

new JsBrowserCache();
```

## Example

```
var cache = new JsBrowserCache({
        prefix: 'cache-', //optional parameter. Default prefix is 'cache-'.
        storage: 'session' // {local|session} default is local. local = localStorage, session = sessionStorage
    });

    //set items
    cache.setItem('test', 'some text'); //save item to storage
    cache.setItem('test1', 'some text', 60); //save item to storage with 60 seconds expiration

    //get item
    cache.getItem('test');
```

```
var cache = new JsBrowserCache();
    
    //delete expired items
    cache.clearExpired();
```

## Resources

-   [NPM](https://www.npmjs.com/)
-   [Yarn](https://yarnpkg.com)
-   [Bower](https://bower.io/)
