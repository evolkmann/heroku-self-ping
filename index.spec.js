const chai = require('chai');
const expect = chai.expect;
const proxyquire = require('proxyquire');
let herokuSelfPing = require('./index.js');

describe('Heroku Self Ping', () => {
    it('should skip when URL is not defined', () => {
        expect(herokuSelfPing()).to.equal(false);
        expect(herokuSelfPing('')).to.equal(false);
    });

    it('should skip when not on Heroku', () => {
        expect(herokuSelfPing('https://google.com')).to.equal(false);
    });

    it('should set an interval on Heroku', function() {
        // Override the module's dependency to 'is-heroku' to fake a true value
        herokuSelfPing = proxyquire('./index.js', {'is-heroku': true});

        // We use the functions default timeout to check if the interval has been created
        expect(herokuSelfPing('https://google.com')._idleTimeout).to.equal(1200000);
    });
});
