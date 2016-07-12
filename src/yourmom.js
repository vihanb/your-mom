"use strict";

const readlineSync = require("readline-sync");
const fs = require("fs");

const args = process.argv.splice(2);

const NUMS = "0123456789ABCDEFGHIJKLMN";

class YourMom {
    constructor() {
        this.stack = [];
        this.backmemory = [];
        this.memory = [];
    }
    pop() {
        if (this.stack.length) return this.stack.pop();
        return this.readv();
    }
    readv() {
        var _ = readlineSync.prompt({ prompt: "" });
        if (_.match(/^[-+]?\d+$/g) != null) return parseInt(_);
        if (_.match(/^[-+]?\d+(\.\d*)?(e[-+]?\d+(\.\d+)?)?$/g) != null) return parseFloat(_);
        return _;
    }
    run(tokens) {
        var s, _;
        while (tokens.length) {
            var tok = tokens.shift();
            if (NUMS.indexOf(tok) != -1)
                this.stack.push(this.pop() * 24 + NUMS.indexOf(tok));
            else switch (tok) {
            case "+": this.applydyadic((a, b) => a + b); break;
            case "-": this.applydyadic((a, b) => a - b); break;
            case "*": this.applydyadic((a, b) => a * b); break;
            case "/": this.applydyadic((a, b) => a / b); break;
            case "%": this.applydyadic((a, b) => a % b); break;
            case "=": this.applydyadic((a, b) => +(a == b)); break;
            case "<": this.applydyadic((a, b) => +(a < b)); break;
            case ">": this.applydyadic((a, b) => +(a > b)); break;
            case "#": this.stack.push(0); break;
            case "¥": this.stack.push(1); break;
            case "&": this.applydyadic((a, b) => a & b); break;
            case "|": this.applydyadic((a, b) => a | b); break;
            case "^": this.applydyadic((a, b) => a ^ b); break;
            case "_": console.log(this.pop()); break;
            case "!":
                var i = this.pop();
                this.memory[i] = this.pop();
                break;
            case "?": this.stack.push(this.memory[this.pop()]); break;
            case "'":
                s = "";
                while (tokens.length) {
                    tok = tokens.shift();
                    if (tok == "'") break;
                    s += tok;
                }
                this.stack.push(s);
                break;
            case "⊞": this.stack.push(this.pop() + 1); break;
            case "⊟": this.stack.push(this.pop() - 1); break;
            case ":":
                _ = this.pop();
                this.stack.push(_);
                this.stack.push(_);
                break;
            case ";": this.pop(); break;
            case "(":
                s = "";
                var sm = false;
                var l = 0;
                while (tokens.length) {
                    tok = tokens.shift();
                    if (tok == "'") sm = !sm;
                    if (!sm) {
                        if (tok == "(") l++;
                        else if (tok == ")") {
                            if (l) l--;
                            else break;
                        }
                    }
                    s += tok;
                }
                this.stack.push(() => {
                    this.run(s.split(""));
                });
                break;
            case "$": this.pop()(); break;
            case "\\":
                _ = this.memory;
                this.memory = this.backmemory;
                this.backmemory = _;
                break;
            case "@":
                _ = this.pop();
                while (this.stack[this.stack.length - 1]) _();
                break;
            case "ð": this.stack.push(readlineSync.prompt({ prompt: "" })); break;
            case "Ð": this.stack.push(this.readv()); break;
            case "©": console.log(this.pop()); break;
            }
        }
    }
    applydyadic(l) {
        var a = this.pop(),
            b = this.pop();
        this.stack.push(l(b, a));
    }
}

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
