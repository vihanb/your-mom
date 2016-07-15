"use strict";/* Implementation of the Jelly compressor */module.exports={/* Only here for documentation purpose
    compress: (s) => {
        if (s.length % 2 != 0) s += " ";
        let comp = letters = [];
        for (let c in s)
            (letters.indexOf(c) == -1) && letters.push(c);
        comp.push(0xFF);
        let _ = __ = 0;
        for (let c in s) {
            if (__) comp.push((_ << 4) + letters.indexOf(c));
            else _ = letters.indexOf(c);
            __ = !__;
        }
        return comp;
    },
    */decompress:function decompress(b){var s="",letters=[];var i=0;while(b[i]!=255){letters.push(b[i++])}for(++i;i<b.length;i++){var x=b[i]>>4,y=b[i]&15;s+=String.fromCharCode(letters[x]);s+=String.fromCharCode(letters[y])}return s}};