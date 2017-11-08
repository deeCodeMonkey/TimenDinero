var expect = require('chai').expect;
var router = require('../routes/invoice');

describe('Decimals and Commas for Currency', function () {
    it('This should add commas and decimals in correct positions.', function () {
        expect(router.currency(2000)).to.equal('2,000.00');
    });
    it('This should move decimal to correct position.', function () {
        expect(router.currency(2000.0)).to.equal('2,000.00');
    });
});


