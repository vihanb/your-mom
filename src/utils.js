"use strict";

Object.isUndef = function (obj) {
    return typeof obj === "undefined";
};

Array.range = function (start, end, step) {
    if (Object.isUndef(step)) step = 1;
    let l = [];
    for (let i = start; i < end; i += step)
        l.push(i);
    return l;
};
