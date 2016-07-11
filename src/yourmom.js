"use strict";

/* UNICODE SUBSTITUTIONS: */
/* i am 2 lazy google it */

var NUMS = "0123456789";

class YourMom {
    constructor() {
        this.stack = [];
        this.memory = [];
    }
    pop() {
        if (this.stack.length) return this.stack.pop();
    }
    run(tokens) {
        while (tokens.length) {
            var tok = tokens.shift();
            if (NUMS.indexOf(tok) != -1)
                this.stack.push(this.pop() * 10 + (tok.charCodeAt(0) - 0x30));
            else switch (tok) {
            case "+": this.applydyadic((a, b) => a + b); break;
            case "-": this.applydyadic((a, b) => a - b); break;
            case "*": this.applydyadic((a, b) => a * b); break;
            case "/": this.applydyadic((a, b) => a / b); break;
            case "%": this.applydyadic((a, b) => a % b); break;
            case "#": this.stack.push(0); break;
            case "!":
                var i = this.pop();
                this.memory[i] = this.pop();
                break;
            case "?": this.stack.push(this.memory[this.pop()]); break;
            case "'":
                var s = "";
                while (tokens.length) {
                    tok = tokens.shift();
                    if (tok == "'") break;
                    s += tok;
                }
                this.stack.push(s);
                break;
            case "\u229E": this.stack.push(this.pop() + 1); break;
            case "\u229F": this.stack.push(this.pop() - 1); break;
            case ":":
                var tmp = this.pop();
                this.stack.push(tmp);
                this.stack.push(tmp);
                break;
            case ";": this.pop(); break;
            }
        }
    }
    applydyadic(l) {
        var a = this.pop(),
            b = this.pop();
        this.stack.push(l(b, a));
    }
}

var fs = require("fs");

var args = process.argv.splice(2);

if (!args[0]) {
    console.log(";_; u fergit file name ;_; y u do dis");
    process.exit(1);
}

fs.readFile(args[0], "utf-8", (err, data) => {
    if (err) {
        console.log("y u do dis ;_; y u given me a unexistant file \u0CA0_\u0CA0");
        process.exit(1);
    }
    var t = new YourMom();
    t.run(data.split(""));
    while (t.stack.length) console.log(t.stack.pop());
});
