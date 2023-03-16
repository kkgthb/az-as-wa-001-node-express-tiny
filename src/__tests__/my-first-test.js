const my_express_server = require("../web/server");
const supertest = require("supertest");

describe("Homepage Hello", () => {
    it("GET / return hello world", async () => {
        const res = await supertest(my_express_server).get("/");
        expect(res.status).toEqual(200);
    });
    it("GET /index.html return hello world", async () => {
        const res = await supertest(my_express_server).get("/index.html");
        expect(res.status).toEqual(200);
    });
});