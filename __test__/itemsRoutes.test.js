const request = require("supertest");
const app = require("../app");
const ITEMS = require("../fakeDb");

let item = { name: "milo", price: 2.99 };

beforeEach(() => {
	ITEMS.push(item);
});

afterEach(() => {
	ITEMS.length = 0;
});

describe("GET /items", () => {
	test("It should return all items", async () => {
		const res = await request(app).get("/items");
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual(ITEMS);
	});
});

describe("GET /items/:name", () => {
	test("It should get a single item", async () => {
		const res = await request(app).get(`/items/${item.name}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual(item);
	});
	test("It should return 404 if the item is not found", async () => {
		const res = await request(app).get("/items/wrong-name");
		expect(res.statusCode).toBe(404);
	});
});

describe("POST /items", () => {
	test("It should create a new item", async () => {
		const item = {
			name: "biro",
			price: "1.99",
		};
		const res = await request(app).post(`/items`).send(item);
		expect(res.statusCode).toBe(201);
		expect(res.body).toEqual({
			added: item,
		});
	});
	test("It should return 404 if item name or item price is not included", async () => {
		const item = {
			name: "",
			price: "",
		};
		const res = await request(app).post(`/items`).send(item);
		expect(res.statusCode).toBe(404);
	});
});

describe("PATCH /items/:name", () => {
	test("It should update an item", async () => {
		const res = await request(app)
			.patch(`/items/${item.name}`)
			.send({ name: "ruler" });
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			updated: item,
		});
	});
	test("It should return 404 if name is not included in the body", async () => {
		const res = await request(app).patch(`/items/${item.name}`).send();
		expect(res.statusCode).toBe(404);
	});
});

describe("DELETE /items", () => {
	test("It should delete an item", async () => {
		const res = await request(app).delete(`/items/${item.name}`);
		expect(res.statusCode).toBe(200);
	});
});
