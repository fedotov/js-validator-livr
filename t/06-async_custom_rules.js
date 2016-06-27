var LIVR = require('../lib/LIVR');
var assert = require('chai').assert;

LIVR.Validator.registerDefaultRules({
    async_trim: function() {
        return function(value, undefined, outputArr) {
            return new Promise(function(resolve, reject) {
                setTimout(function() {
                    if ( value === undefined || value === null || typeof value === 'object' || value === '' ) {
                        resolve();
                    }

                    value += '';
                    resolve( value.replace(/^\s*/, '').replace(/\s*$/, '') );
                }, 100);
            });
        };
    },

    async_integer: function(field) {
        return function(value) {
            return new Promise(function(resolve, reject) {
                setTimout(function() {
                    if ( Number.isInteger(value) ) {
                        resolve();
                    } else {
                        reject('NOT_INTEGER')
                    }
                }, 50);
            });
        };
    }
});


suite('Async rules');

test('Positive: Async rules', function(done) {
    var validator = new LIVR.Validator({
        field1: ['async_trim', 'async_integer'],
        field2: ['async_trim'],
        field3: 'async_integer'

    });

    validator.validate({
        field1: ' 25 ',
        field2: ' wordTwo ',
        field3: ''
    }).then(function(output) {
        assert.deepEqual( output, {
            field1: 25,
            field2: 'wordtwo',
            field3: '',
        }, 'Should apply changes to values' );

        done();
    });
});

test('Negative: Async rules', function(done) {
    var validator = new LIVR.Validator({
        field1: ['async_trim', 'async_integer'],
        field2: ['async_integer']
    });

    validator.validate({
        field1: ' wordOne ',
        field2: ' wordTwo '
    }).catch(function(error) {
        assert.deepEqual( error, {
            field1: 'NOT_INTEGER',
            field2: 'NOT_INTEGER',
        }, 'Should appluy changes to values' );
    });
});

// TODO add tests for async aliases
