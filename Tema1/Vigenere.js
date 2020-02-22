String.prototype.replaceAt = function (index, replace) {
    return this.substring(0, index) + replace + this.substring(index + 1);
}

Number.prototype.mod = function (n) {
    return ((this % n) + n) % n;
};


var VigenereCipher = (function () {
    var numberOfOccurences = new Array(26).fill(0);
    var closestOccurence = {
        val: 99999,
        m: 0
    }
    var frequencyTable = [0.08167, 0.01492, 0.02782, 0.04253, 0.12702, 0.02228, 0.02015, 0.06094, 0.06966, 0.00153,
        0.00772, 0.04025, 0.02406, 0.06749, 0.07507, 0.01929, 0.00095, 0.05987, 0.06327, 0.09056, 0.02758, 0.00978,
        0.02360, 0.00150, 0.01974, 0.00074];
    var encrypt = function (plaintext, key) {
        var cipherText = "";
        while (plaintext.length > key.length) {
            key += key;
        }

        key.length = plaintext.length;

        for (let i = 0; i < plaintext.length; i++) {
            cipherText += String.fromCharCode('a'.charCodeAt(0) + (plaintext.charCodeAt(i) - 'a'.charCodeAt(0) + key.charCodeAt(i) - 'a'.charCodeAt(0)) % 26);
        }

        return cipherText;
    }

    var decrypt = function (cipherText) {
        var keyLength = getKeyLength(cipherText);
        console.log("Key length:", keyLength);

        var key = getKey(cipherText, keyLength);
        console.log("Key: ", key);

        while (key.length < cipherText.length) {
            key += key;
        }

        key.length = cipherText.length;

        var result = "";
        for (var i = 0; i < cipherText.length; i++) {
            result += String.fromCharCode('a'.charCodeAt(0) + ((cipherText.charCodeAt(i) - 'a'.charCodeAt(0)) - (key.charCodeAt(i) - 'a'.charCodeAt(0))).mod(26));
        }

        return result;
    }

    function getKeyLength(cipherText) {
        var m = 1;
        while (closestOccurence.val > 0.005 && m < cipherText.length) {
            evaluateICs(cipherText, m);
            m++;
        }

        return closestOccurence.m;
    }

    function checkOccurences(cipherText) {
        for (let i = 0; i < cipherText.length; i++) {
            numberOfOccurences[cipherText.charCodeAt(i) - "a".charCodeAt(0)]++;
        }

    }

    function cleanOccurences() {
        numberOfOccurences.fill(0);
    }

    function IC(cipherText) {
        if (cipherText.length == 1) {
            return 0;
        }

        checkOccurences(cipherText);
        var result = 0;
        var length = cipherText.length;

        result = numberOfOccurences.reduce(function (sum, el) {
            return (sum + el * (el - 1));
        });

        cleanOccurences();

        return result / (length * (length - 1));
    }

    function shift(cipherText, step, start, shiftAmount) {
        var result = "";

        for (var i = start; i < cipherText.length; i += step) {
            result += cipherText[i];
        }

        if (shiftAmount) {
            shiftAmount = shiftAmount % 26;

            for (var i = 0; i < result.length; i++) {
                var newVal = String.fromCharCode("a".charCodeAt(0) + (result.charCodeAt(i) - "a".charCodeAt(0) + shiftAmount) % 26);
                result = result.replaceAt(i, newVal);
            }
        }
        return result;
    }

    function evaluateICs(cipherText, m) {
        var result = 0;
        var count = 0;
        for (var i = 0; i < m; i++) {
            var text1 = shift(cipherText, m, i);
            var ic = IC(text1);
            if (ic > 0.050 && ic < 0.082) {
                result += ic;
                count++;
            }
        }

        count = count == 0 ? 1 : count;
        result = result / count;

        result = Math.abs(result - 0.065);

        if (result < closestOccurence.val) {
            closestOccurence.val = result;
            closestOccurence.m = m;
        }
    }

    function getKey(cipherText, keyLength) {
        var key = "";
        for (var j = 0; j < keyLength; j++) {
            var s = -1;
            do {
                s++;

                var mic = 0;

                var text = shift(cipherText, keyLength, j, s);
                mic = evaluateMIC(text);

                var check = Math.abs(mic - 0.065);

            } while (check > 0.005 && s < 25);

            key += String.fromCharCode((26 - s) % 26 + "a".charCodeAt(0));
        }
        return key;
    }

    function evaluateMIC(cipherText) {
        checkOccurences(cipherText);

        var length = cipherText.length;

        var result = 0;

        for (var i = 0; i < numberOfOccurences.length; i++) {
            result += numberOfOccurences[i] * frequencyTable[i];
        }

        cleanOccurences();
        return result / length;
    }

    return {
        encrypt: encrypt,
        decrypt: decrypt
    };
})();

module.exports = VigenereCipher;