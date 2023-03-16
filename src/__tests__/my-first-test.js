// Thank you to https://dev.to/lukekyl/testing-your-express-js-backend-server-3ae6
// Thank you to https://github.com/ladjs/supertest/issues/520

const my_express_server = require("../web/server");
const supertest = require("supertest");
const { default: expect } = require("expect");

describe("Homepage Hello", () => {
    const check_homepage_expectations = (supertest_response) => {
        expect(supertest_response.status).toEqual(200);
        expect(supertest_response.type).toEqual('text/html');
        expect(supertest_response.text).toEqual("Hello World!");
    }
    it("GET / return hello world", async () => {
        const res = await supertest(my_express_server).get("/");
        check_homepage_expectations(res);
    });
    it("GET /index.html return hello world", async () => {
        const res = await supertest(my_express_server).get("/index.html");
        check_homepage_expectations(res);
    });
});