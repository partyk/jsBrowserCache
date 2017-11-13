# jsBrowserCache

JavaScript library for save, load data to localStorage or sessionStorage and expire time.

---

## Instalation

Download or clone repository.

## NPM

npm install jsbrowsercache --save-dev

## Bower

bower install jsbrowsercache

## Example

```
var cache = new JsBrowserCache({
        prefix: 'cache-', //optional parameter. Default prefix is 'cache-'.
        storage: 'session' // {local|session} default is local. local = localStorage, session = sessionStorage
    });

    //set items
    cache.setItem('test', 'some text'); //save item to storage
    cache.setItem('test1', 'some text', 60); //save item to storage with expire 60 second

    //get item
    cache.setItem('test');
```

```
var cache = new JsBrowserCache();
    
    //delete expired items
    cache.clearExpired();
```

## Resources

-   [NPM](https://www.npmjs.com/)
