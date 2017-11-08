var Nightmare = require("nightmare");
var expect = require("chai").expect;

describe("Timen'Dinero", function () {
    // The default tests in mocha is 2 seconds.
    // Extending it to 30 seconds to have time to load the pages

    this.timeout(30000);
    it("should add a new client with external ID#999", function (done) {
        Nightmare({ show: true })
            .goto("http://localhost:8080/")
            // Click add client button from side panel
            .click(".button")
            .type('form[action*="/company/add"] [name=client_id]', 999)
            .type('form[action*="/company/add"] [name=company_name]', 'Test Company')
            .type('form[action*="/company/add"] [name=contact_person]', 'John Doe')
            .type('form[action*="/company/add"] [name=email_address]', 'deidra108@gmail.com')
            .type('form[action*="/company/add"] [name=phone]', '303-555-1234')
            .type('form[action*="/company/add"] [name=mailing_address]', '555 Corporate Dr. Denver, CO 80219')
            .wait(3000)
            .click('form[action*="/company/add"] [type=submit]')
            .wait(5000)
            .then(function () {
                done();
            });
    });

    this.timeout(30000);
    it("should add new project for newly created client external ID# 999", function (done) {
        new Nightmare({ show: true })
            .goto("http://localhost:8080/admin/999")
            .click("#addFirstProject")
            .wait(1000)
            .type('form[action*="/admin/index/999"] [name=title]', 'Test Project')
            .type('form[action*="/admin/index/999"] [name=task]', 'Scoping')
            .type('form[action*="/admin/index/999"] [name=hours]', '2')
            .type('form[action*="/admin/index/999"] [name=rate]', '75.50')
            .type('form[action*="/admin/index/999"] [name=description]', 'Met with client on requirements.')
            .type('form[action*="/admin/index/999"] [name=notes]', 'This client has a ton of requirements to go through. There will be a lot of work to do!')
            .click('form[action*="/admin/index/999"] [type=submit]')
            .then(function () {
                done();
            });
    });

});