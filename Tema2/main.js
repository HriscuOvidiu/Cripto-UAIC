const des = require('./des.js');

var key = "OCHEIEBU";
var key2 = "ABCDABCA";
var plainText = "MYTEXTXT";

var partialKey1 = key.slice(0,7);

var partialKey2 = key2.slice(0, 7);

var cipherText = des.encrypt(des.encrypt(plainText, key), key2);

var results = {

};

var final = {

};

for(var i = 1 ; i < 256; i++){
    let key = partialKey1 + String.fromCharCode(i);
    results[des.encrypt(plainText, key)] = key; 
}

for(var i = 1 ; i < 256 ; i++){
    let key = partialKey2 + String.fromCharCode(i);
    var decrText = des.decrypt(cipherText, key);
    if(results[decrText]){
        final.firstKey = results[decrText]; 
        final.lastKey = key;
    }
}

console.log(final);

console.log()