const express = require("express");
const ExpressError = require("./expressError");
const app = express();
const itemsRoute = require("./itemsRoute");

app.use(express.json());
app.use("/items", itemsRoute);

app.use((req, res, next) => {
	const notFound = new ExpressError("The route does not exist", 404);
	return next(notFound);
});

app.use((error, req, res, next) => {
	let status = error.status || 500;
	let message = error.message;

	return res.status(status).json({
		error: message,
	});
});
module.exports = app;
