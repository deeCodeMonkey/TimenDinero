var Nightmare = require("nightmare"),
    expect = require("chai").expect,
    BASE_URL = "http://localhost:8080/",
    onError = (err) => {
        console.error("Test-runner failed:", err);
    },
    browser = new Nightmare({
        show: true,
        typeInterval: 35,
        pollInterval: 50
    });

describe("Timen'Dinero Tests", function () {
    // The default tests in mocha is 2 seconds.
    // Extending it to 30 seconds to have time to load the pages

    this.timeout(30000);

    after(() => {
        browser.end().then(() => {
            console.log("Completed");
        });
    });

    //Tests
    it("should add a new client with external ID#999", function (done) {
        browser
            .goto(BASE_URL)
            // Click add client button from side panel
            .click(".button")
            .type('form[action*="/company/add"] [name=client_id]', 999)
            .type('form[action*="/company/add"] [name=company_name]', 'Test Company')
            .type('form[action*="/company/add"] [name=contact_person]', 'John Doe')
            .type('form[action*="/company/add"] [name=email_address]', 'deidra108@gmail.com')
            .type('form[action*="/company/add"] [name=phone]', '303-555-1234')
            .type('form[action*="/company/add"] [name=mailing_address]', '555 Corporate Dr. Denver, CO 80219')
            .click('form[action*="/company/add"] [type=submit]')
            .wait(3000)
            .then(() => {
                done();
            })
            .catch(onError);
    });

    it("should add new project for newly created client external ID# 999", function (done) {
        browser
            .goto(BASE_URL + "admin/999")
            .click("#addFirstProject")
            .wait(1000)
            .type('form[action*="/admin/index/999"] [name=title]', 'Test Project')
            .type('form[action*="/admin/index/999"] [name=task]', 'Scoping')
            .type('form[action*="/admin/index/999"] [name=hours]', '2')
            .type('form[action*="/admin/index/999"] [name=rate]', '75.50')
            .type('form[action*="/admin/index/999"] [name=description]', 'Met with client on requirements.')
            .type('form[action*="/admin/index/999"] [name=notes]', 'This client has a ton of requirements to go through. There will be a lot of work to do!')
            .click('form[action*="/admin/index/999"] [type=submit]')
            .then(() => {
                done();
            })
            .catch(onError);
    });

    it("should email invoice for client external ID# 999", function (done) {
        browser
            .goto(BASE_URL + "invoice/999")
            .click("#pdfSender")
            .wait(7000)
            .then(() => {
                done();
            })
            .catch(onError);
    });

    it("should delete client external ID# 999", function (done) {
        browser
            .goto(BASE_URL + "company/profile/999")
            .click(".fa-trash")
            .wait(2000)
            .click('#delete-company')
            .wait(2000)
            .then(() => {
                done();
            })
            .catch(onError);
    });

});