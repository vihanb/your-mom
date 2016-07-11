"use strict";

var fs = require("fs");

var args = process.argv.splice(2);

if (!args[0]) {
    console.log("y u do dis ;_; y u forgoten the filename ;_;");
    process.exit(1);
}

fs.readFile(args[0], "utf-8", (err, data) => {
    if (err) {
        console.log("y u do dis ;_; y u given me a unexistant file ;_;");
        process.exit(1);
    }
});
