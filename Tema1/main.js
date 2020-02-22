const VigenereCipher = require('./Vigenere.js');
const fs = require('fs');

var cleanPlainText = function(plaintext){
    plaintext = plaintext.split(" ").join("");
    val = plaintext.replace(/\W+/g,"");
    return val;
}

var plaintext = fs.readFileSync("text", 'utf8').toLowerCase();;

plaintext = cleanPlainText(plaintext);

var key = "ababababababaa";

const cipherText = VigenereCipher.encrypt(plaintext, key);

var decryptedText = VigenereCipher.decrypt(cipherText);

if (plaintext === decryptedText) {
    console.log("Exact match between the plain and decrypted texts");
} else {
    console.log("The plain and decrypted texts are different");
}