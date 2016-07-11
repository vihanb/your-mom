"use strict";

var fs = require("fs");

var args = process.argv.splice(2);

if (!args[0]) {
    console.log(";_; u fergit file name ;_; y u do dis");
    process.exit(1);
}

fs.readFile(args[0], "utf-8", (err, data) => {
    if (err) {
        console.log("y u do dis ;_; y u given me a unexistant file ಠ_ಠ");
        process.exit(1);
    }
});
