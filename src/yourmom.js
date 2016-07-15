#!/usr/bin/env node
const fs = require("fs");
const commander = require("commander");
const yourmom = require("./yourmomlib.js");

commander
    .version("1.1.0")
    .usage("[options] <file>")
    .option("-e, --idkhowtocallit", "execute program from argv")
    .parse(process.argv);

function _run(data) {
    let ym = new yourmom.YourMom();
    ym.run([...data]);
    while (ym.stack.length) console.log(ym.stack.pop());
}

if (typeof commander.args[0] === "undefined") {
    console.log(";_; u fergit file name ;_; y u do dis");
    process.exit(1);
}

if (commander.idkhowtocallit) {
    _run(commander.args[0]);
} else {
    fs.readFile(commander.args[0], "utf-8", (err, data) => {
        if (err) {
            console.log("y u do dis ;_; y u given me a unexistant file \u0CA0_\u0CA0");
            process.exit(1);
        }
        _run(data);
    });
}
