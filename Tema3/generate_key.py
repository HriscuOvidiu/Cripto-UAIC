import sys
import random
import calculate as c
from Crypto.Util import number

def get_keys():
    return (p,q,n, e, d)

##################################

p = number.getPrime(1024)
q = number.getPrime(1024)

n = p * q
fi = (p - 1) * (q - 1)

e = fi

while number.GCD(e, fi) != 1:
    e = random.randrange(1, fi)

d = number.inverse(e, c.lcm(p - 1, q - 1)) 