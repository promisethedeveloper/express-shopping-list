const express = require("express");
const router = new express.Router();
const ExpressError = require("./expressError");
const ITEMS = require("./fakeDb");

ITEMS.push({ name: "popsicle", price: 1.45 }, { name: "cheerios", price: 3.4 });

router.get("/", (req, res, next) => {
	return res.status(200).json(ITEMS);
});

router.post("/", (req, res, next) => {
	try {
		if (!req.body.name || !req.body.price)
			throw new ExpressError(
				"Please include name and price in the request",
				404
			);
		const { name, price } = req.body;
		const item = { name, price };
		ITEMS.push(item);
		return res.status(201).json({
			added: item,
		});
	} catch (error) {
		return next(error);
	}
});

router.get("/:name", (req, res, next) => {
	try {
		const foundItem = ITEMS.find((item) => item.name === req.params.name);
		if (!foundItem)
			throw new ExpressError(`No item with name ${req.params.name}`, 404);
		return res.status(200).json(foundItem);
	} catch (error) {
		return next(error);
	}
});

router.patch("/:name", (req, res, next) => {
	try {
		const { name } = req.body;
		if (!req.body.name)
			throw new ExpressError(
				"Please include the name to update the item with",
				404
			);
		const foundItem = ITEMS.find((item) => item.name === req.params.name);
		foundItem.name = name;
		return res.status(200).json({ updated: foundItem });
	} catch (error) {
		return next(error);
	}
});

router.delete("/:name", (req, res, next) => {
	const itemIndex = ITEMS.findIndex((item) => item.name === req.params.name);
	if (itemIndex === -1)
		throw new ExpressError(`${req.params.name} was not found`, 404);
	ITEMS.splice(itemIndex, 1);
	return res.status(200).json({ message: "Deleted" });
});

module.exports = router;
