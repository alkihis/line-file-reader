var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
};
if (typeof Symbol.asyncIterator === undefined) {
    // Create the symbol async iterator if it is undefined
    // @ts-ignore
    Symbol.asyncIterator = Symbol('Symbol.asyncIterator');
}
const LineFileReader = /** @class */ (() => {
    class LineFileReader {
        constructor(file) {
            this.file = file;
            if (!LineFileReader.isFile(file)) {
                throw new Error("This object is not a file");
            }
        }
        static isFile(data) {
            if (typeof Blob !== 'undefined') {
                return data instanceof Blob;
            }
            return false;
        }
        getText(file) {
            if ('text' in file) {
                return file.text();
            }
            return new Promise((resolve, reject) => {
                const fr = new FileReader;
                fr.onload = () => {
                    resolve(fr.result);
                };
                fr.onerror = reject;
                fr.readAsText(file);
            });
        }
        /** Iterate a file line by line */
        iterate(separator = '\n', chunk_length = LineFileReader.CHUNK_LENGTH) {
            return __asyncGenerator(this, arguments, function* iterate_1() {
                let seeker = 0;
                let buffer = "";
                let padding = separator.length - 1;
                if (separator.length + 1 >= chunk_length) {
                    throw new Error("Separator must be shorter than chunk length.");
                }
                if (padding === -1) {
                    padding = 0;
                }
                // While we didn't reach the end of file
                while (seeker < this.file.size) {
                    const part = yield __await(this.getText(this.file.slice(seeker, seeker + chunk_length + padding)));
                    seeker += chunk_length;
                    const parts = part.split(separator);
                    if (parts.length > 1) {
                        if (padding && part.length > chunk_length) {
                            // There can be an overlap
                            const last_index = parts.length - 1;
                            const last_len = parts[last_index].length;
                            if (parts[last_index].length < padding) {
                                // There is an overlap !
                                seeker += padding - last_len;
                                parts[last_index] = "";
                            }
                            else {
                                // There is no overlap, ignoring
                                parts[last_index] = parts[last_index].slice(0, last_len - padding);
                            }
                        }
                        // There is a next line
                        parts[0] = buffer + parts[0];
                        // Store the remaining line in the buffer
                        buffer = parts[parts.length - 1];
                        for (const line of parts.slice(0, parts.length - 1)) {
                            yield yield __await(line);
                        }
                    }
                    else {
                        // There is no next line here. Save the whole chunk in the buffer.
                        buffer += part.slice(0, chunk_length);
                    }
                }
                // If buffer is filled, this is the last line. Emit it !
                if (buffer) {
                    yield yield __await(buffer);
                }
            });
        }
        /** Iterate a file line by line */
        [Symbol.asyncIterator]() {
            return __asyncGenerator(this, arguments, function* _a() {
                yield __await(yield* __asyncDelegator(__asyncValues(this.iterate())));
            });
        }
    }
    /** Read by chunks of 1 KB of text */
    LineFileReader.CHUNK_LENGTH = 1024;
    return LineFileReader;
})();
