//LZW Compression/Decompression for Strings
var LZW = {
    utf8Encode: function(text) {
        var result = "";
        for (var n = 0; n < text.length; n++)
        {
            var c = text.charCodeAt(n);
            if (c < 128)
            {
                result += String.fromCharCode(c);
            }
            else if (c > 127 && c < 2048)
            {
                result += String.fromCharCode((c >> 6) | 192);
                result += String.fromCharCode((c & 63) | 128);
            }
            else
            {
                result += String.fromCharCode((c >> 12) | 224);
                result += String.fromCharCode(((c >> 6) & 63) | 128);
                result += String.fromCharCode((c & 63) | 128);
            }
        }
        return result;
    },

    utf8Decode: function(text) {
        var result = "";
        var i = 0;
        while (i < text.length) {
            var c = text.charCodeAt(i++);
            if (c > 191 && c < 224) {
                var c1 = text.charCodeAt(i++);
                c = ((c & 31) << 6) | (c1 & 63);
            } else if (c > 127) {
                var c1 = text.charCodeAt(i++);
                var c2 = text.charCodeAt(i++);
                c = ((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63);
            }
            result += String.fromCharCode(c);
        }
        return result;
    },

    // LZW-compress a string
    compress: function(text) {
        text = LZW.utf8Encode(text);
        var dict = {};
        var data = (text + "").split("");
        var out = [];
        var currChar;
        var phrase = data[0];
        var code = 256;
        for (var i=1; i<data.length; i++) {
            currChar=data[i];
            if (dict[phrase + currChar] != null) {
                phrase += currChar;
            }
            else {
                out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
                dict[phrase + currChar] = code;
                code++;
                phrase=currChar;
            }
        }
        out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
        for (var i=0; i<out.length; i++) {
            out[i] = String.fromCharCode(out[i]);
        }
        return out.join("");
    },

    // Decompress an LZW-encoded string
    decompress: function(text) {
        var dict = {};
        var data = (text + "").split("");
        var currChar = data[0];
        var oldPhrase = currChar;
        var out = [currChar];
        var code = 256;
        var phrase;
        for (var i=1; i<data.length; i++) {
            var currCode = data[i].charCodeAt(0);
            if (currCode < 256) {
                phrase = data[i];
            } else {
                phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
            }
            out.push(phrase);
            currChar = phrase.charAt(0);
            dict[code] = oldPhrase + currChar;
            code++;
            oldPhrase = phrase;
        }
        return LZW.utf8Decode(out.join(""));
    }
}