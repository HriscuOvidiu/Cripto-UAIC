var config = require('./config');

var des = (function () {

    var encrypt = function (plainText, key) {
        if (plainText.length != 8) {
            throw "Text size is not good!";
        }

        var bitString = convertToBitsList(plainText);
        var keyBitString = convertToBitsList(key);

        keyBitString = permutate(keyBitString, config.pc1Matrix);

        var bitStringAfterIp = permutate(bitString, config.ipMatrix);
        var firstL = bitStringAfterIp.slice(0, 32)
        var firstR = bitStringAfterIp.slice(32, 64);

        for (var i = 1; i <= 16; i++) {
            let result = nextKey(keyBitString, i);
            keyBitString = result.list;
            var key = result.newList;

            let copy = firstL.slice();
            firstL = firstR.slice();
            firstR = xorFunction(copy, magicFunction(firstR, key));

        }

        firstL.forEach(x => firstR.push(x));
        var cryptedTextList = permutate(firstR, config.ipInverseMatrix);

        var cryptedText = convertBitStringToString(cryptedTextList);

        return cryptedText;
    }

    var decrypt = function (cipherText, key) {
        var keys = [];
        var keyBitString = convertToBitsList(key);
        keyBitString = permutate(keyBitString, config.pc1Matrix);

        for (var i = 1; i <= 16; i++) {
            var result = nextKey(keyBitString, i);
            var key = result.newList;
            keyBitString = result.list;
            keys.push(key);
        }


        var bitString = convertToBitsList(cipherText);

        var xZeroBitString = permutate(bitString, config.ipMatrix);
        firstL = xZeroBitString.slice(0, 32)
        firstR = xZeroBitString.slice(32, 64);

        for (var i = 15; i >= 0; i--) {
            var copy = firstL.slice();
            firstL = firstR.slice();
            firstR = xorFunction(copy, magicFunction(firstR, keys[i]));
        }

        firstL.forEach(x => firstR.push(x));
        var cryptedTextList = permutate(firstR, config.ipInverseMatrix);

        var decryptedText = convertBitStringToString(cryptedTextList);

        return decryptedText;
    }

    function nextKey(list, number) {
        var first = list.slice(0, list.length / 2);
        var second = list.slice(list.length / 2, list.length);

        first = ShiftPosition(first, number);
        second = ShiftPosition(second, number);

        var concatList = ConcatenateTwoList(first, second);
        list = concatList.slice();

        var newList = permutate(list, config.pc2Matrix);

        return { newList, list };
    }

    function ConcatenateTwoList(first, second) {
        var newList = [];

        first.forEach(x => newList.push(x));
        second.forEach(x => newList.push(x));

        return newList;
    }

    function ShiftPosition(list, number) {
        var newList = [];

        if (number == 1 || number == 2 || number == 9 || number == 16) {
            for (var i = 1; i < list.length; i++) {
                newList.push(list[i]);
            }

            newList.push(list[0]);

            return newList;
        }

        for (var i = 2; i < list.length; i++) {
            newList.push(list[i]);
        }

        newList.push(list[0]);
        newList.push(list[1]);

        return newList;
    }

    function xorFunction(first, second) {
        var newList = [];

        for (var i = 0; i < first.length; i++) {
            newList.push(first[i] ^ second[i]);
        }

        return newList;
    }

    function magicFunction(bitString, keyBitString) {
        var newBitString = xorFunction(expandFunction(bitString), keyBitString);
        var newListString = "";

        for (var i = 0; i < 8; i++) {
            var extracted = newBitString.slice(6 * i, 6 * (i + 1));
            var line = parseInt(extracted[0].toString()) * 2 + parseInt(extracted[5].toString());
            var column = parseInt(extracted[1].toString()) * 2 * 2 * 2 +
                parseInt(extracted[2].toString()) * 2 * 2 +
                parseInt(extracted[3].toString()) * 2 +
                parseInt(extracted[4].toString()) * 1;

            newListString += (config.allSMatrix[i][line][column]).toString(2).padStart(4, "0");
        }

        var newList = newListString.split("");
        newList = permutate(newList, config.pMatrix);

        return newList;
    }

    function expandFunction(bitString) {
        var newList = [];

        for (var positionList of config.eMatrix) {
            for (var position of positionList) {
                newList.push(bitString[position - 1]);
            }
        }

        return newList;
    }

    function convertToBitsList(plainText, padLeft = 8) {
        byteList = [];
        var test = "";

        for (var i = 0; i < plainText.length; i++) {
            var str = plainText.charCodeAt(i).toString(2);
            var arr = str.padStart(padLeft, "0").split("");
            byteList = byteList.concat(arr);
        }

        return byteList;
    }

    function convertBitStringToString(bitList) {
        var toReturn = "";

        for (var i = 0; i < 8; i++) {
            var extracted = bitList.slice(8 * i, 8 * (i + 1));
            var asciiCode = convertFromBaseTwoToBaseTen(extracted);
            toReturn += String.fromCharCode(asciiCode);
        }

        return toReturn;
    }

    function convertFromBaseTwoToHex(bitList) {
        var number = parseInt(bitList.join(""), 2);

        var numberBase16 = number.toString(16);

        return numberBase16;
    }

    function convertFromBaseTwoToBaseTen(list) {
        var number = parseInt(list.join(""), 2);

        return number;
    }

    function permutate(byteList, permutationOrder) {
        var newByteList = [];

        permutationOrder.forEach(function (line) {
            line.forEach(function (i) {
                newByteList.push(byteList[i - 1]);
            });
        });

        return newByteList;
    }

    return {
        encrypt: encrypt,
        decrypt: decrypt
    }
})();

module.exports = des;