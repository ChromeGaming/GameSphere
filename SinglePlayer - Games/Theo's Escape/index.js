"use strict";

var express = require("express"),
    app = express();

app.set("port", (process.env.PORT || 3000));
app.use(express.static("dist"));
app.listen(app.get("port"), function () {
    console.log("Server started");
});