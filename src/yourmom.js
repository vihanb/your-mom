"use strict";

const readlineSync = require("readline-sync");
const fs = require("fs");
require("./utils.js");
const jellycomp = require("./jellycomp.js");

const args = process.argv.splice(2);

const NUMS = "0123456789ABCDEFGHIJKLMN";
const WHITESPACE = " \n\t\v\r\f";

let CODEPAGE = Array.range(0, 128).map((x) => String.fromCharCode(x));
CODEPAGE += "«»≠≤≥¥¬⊞⊟æ€ðÐ²³¼½¾çÇß§íÍþ®⍳";
CODEPAGE += Array.range(CODEPAGE.length, 256).map((x) => String.fromCharCode(x));

class YourMom {
    constructor() {
        this.stack = [];
        this.backmemory = [];
        this.memory = [];
        this.map = new Map([
            ["+", () => { this.applydyadic((a, b) => a + b); }],
            ["-", () => { this.applydyadic((a, b) => a - b); }],
            ["*", () => { this.applydyadic((a, b) => a * b); }],
            ["/", () => { this.applydyadic((a, b) => a / b); }],
            ["%", () => { this.applydyadic((a, b) => a % b); }],
            ["=", () => { this.applydyadic((a, b) => +(a == b)); }],
            ["≠", () => { this.applydyadic((a, b) => +(a != b)); }],
            ["<", () => { this.applydyadic((a, b) => +(a < b)); }],
            ["≤", () => { this.applydyadic((a, b) => +(a <= b)); }],
            [">", () => { this.applydyadic((a, b) => +(a > b)); }],
            ["≥", () => { this.applydyadic((a, b) => +(a >= b)); }],
            ["#", () => { this.stack.push(0); }],
            ["¥", () => { this.stack.push(1); }],
            ["¬", () => { this.stack.push(this.pop() ^ 1); }],
            ["~", () => { this.stack.push(~this.pop()); }],
            ["&", () => { this.applydyadic((a, b) => a & b); }],
            ["|", () => { this.applydyadic((a, b) => a | b); }],
            ["^", () => { this.applydyadic((a, b) => a ^ b); }],
            ["«", () => { this.applydyadic((a, b) => a << b); }],
            ["»", () => { this.applydyadic((a, b) => a >> b); }],
            ["_", () => { console.log(this.pop()); }],
            ["!", () => {
                let i = this.pop();
                this.memory[i] = this.pop();
            }],
            ["?", () => { this.stack.push(this.memory[this.pop()]); }],
            ["'", (tokens) => {
                let tok;
                let s = "";
                while (tokens.length) {
                    tok = tokens.shift();
                    if (tok == "'") break;
                    s += tok;
                }
                this.stack.push(s);
            }],
            ["⊞", () => { this.stack.push(this.pop() + 1); }],
            ["⊟", () => { this.stack.push(this.pop() - 1); }],
            [":", () => {
                let _ = this.pop();
                this.stack.push(_);
                this.stack.push(_);
            }],
            [";", () => { this.pop(); }],
            ["æ", () => {
                let a = this.pop();
                let b = this.pop();
                this.stack.push(a);
                this.stack.push(b);
            }],
            ["(", (tokens) => {
                let tok;
                let s = "";
                let sm = false;
                let l = 0;
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
            }],
            ["€", (tokens) => {
                let s = tokens.shift();
                this.stack.push(() => {
                    this.run([s]);
                });
            }],
            ["$", () => { this.pop()(); }],
            ["\\", () => {
                let _ = this.memory;
                this.memory = this.backmemory;
                this.backmemory = _;
            }],
            ["@", () => {
                let _ = this.pop();
                while (this.stack[this.stack.length - 1]) _();
            }],
            ["ð", () => { this.stack.push(readlineSync.prompt({ prompt: "" })); }],
            ["Ð", () => { this.stack.push(this.readv()); }],
            ["²", () => { this.stack.push(Math.pow(this.pop(), 2)); }],
            ["³", () => { this.stack.push(Math.pow(this.pop(), 3)); }],
            ["¼", () => { this.stack.push(this.pop() / 4); }],
            ["½", () => { this.stack.push(this.pop() / 2); }],
            ["¾", () => { this.stack.push(this.pop() * 0.75); }],
            [",", () => { this.applydyadic((a, b) => a.concat([b])); }],
            [".", () => { this.applydyadic((a, b) => a.concat(b)); }],
            ["ç", () => { this.stack.push([]); }],
            ["Ç", () => {
                let func = this.pop();
                let arr = this.pop();
                let _ = arr.map((x) => {
                    this.stack.push(x);
                    func();
                    return this.pop();
                });
                this.stack.push(_);
            }],
            ["ß", () => {
                let func = this.pop();
                let arr = this.pop();
                let _ = arr.filter((x) => {
                    this.stack.push(x);
                    func();
                    return this.pop();
                });
                this.stack.push(_);
            }],
            ["⍳", () => {
                let i = this.pop();
                this.stack.push(this.stack[this.stack.length - 1][i]);
            }],
            ["§", () => {
                this.stack.push(this.pop()+"");
            }],
            ["í", () => {
                this.stack.push(parseInt(this.pop()));
            }],
            ["Í", () => {
                let s = this.pop();
                let n = 0;
                for (let c in s)
                    n = n * 24 + NUMS.indexOf(c);
                this.stack.push(n);
            }],
            ["þ", () => {
                this.stack.push(parseFloat(this.pop()));
            }],
            ["®", () => {
                this.applydyadic((a, b) => Array.range(a, b));
            }],
            ["`", () => {
                this.stack.push(jellycomp.decompress([...new Buffer(this.pop(), "base64")]));
            }],
        ]);
    }
    pop() {
        if (this.stack.length) return this.stack.pop();
        return this.readv();
    }
    readv() {
        let _ = readlineSync.prompt({ prompt: "" });
        if (_.match(/^[-+]?\d+$/g) != null) return parseInt(_);
        if (_.match(/^[-+]?\d+(\.\d*)?(e[-+]?\d+(\.\d+)?)?$/g) != null) return parseFloat(_);
        return _;
    }
    run(tokens) {
        while (tokens.length) {
            let tok = tokens.shift();
            if (NUMS.indexOf(tok) != -1)
                this.stack.push(this.pop() * 24 + NUMS.indexOf(tok));
            else if (WHITESPACE.indexOf(tok) != -1) ;
            else {
                let _ = this.map.get(tok);
                if (Object.isUndef(_)) {
                    console.log("y u do dis ;_; y u do a syntax error ;_; '" + tok + "'");
                } else _(tokens);
            }
        }
    }
    applydyadic(l) {
        let a = this.pop(),
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
    t.run([...data]);
    while (t.stack.length) console.log(t.stack.pop());
});
