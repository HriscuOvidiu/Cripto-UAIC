import sys
import numpy as np
import generate_key
import attack
from Crypto.Util import number

def encrypt(message, e, n):
    return pow(message, e, n)

################################3

def decrypt(cipher_text, d, n):
    return pow(cipher_text, d, n)

def decrypt_crt(dq, dp, p, q, c): 
    x1 = pow(c, dp, p) 
      
    x2 = pow(c, dq, q) 
      
    qinv = number.inverse(q, p) 
    h = (qinv * (x1 - x2)) % p 
    m = x2 + h * q 
    return m 

(p,q,n, e, d) = generate_key.get_keys()

if len(sys.argv) == 1 :
    raise Exception("Pass a message as an argument")

message = int(sys.argv[1])

if message < 0 or message >= n :
    raise Exception("Please pass a number in the interval [0, n-1]")

print("Plain text:", message)

cipher_text = encrypt(message, e, n)
print("Encrypted text:", cipher_text)

message = decrypt(cipher_text, d, n)
print("Decrypted text:", message)

dq = pow(d, 1, q - 1) 
dp = pow(d, 1, p - 1) 

message = decrypt_crt(dq, dp, p, q, cipher_text)
print("Decrypted text with crt:", message)

# d_attack = attack.run(e, n)
# decrypted_text_attack = decrypt(cipher_text, d_attack, n)

# print("Decrypted text using the attack:", decrypted_text_attack)