import math
from Crypto.Util import number

def lcm(p, q): 
    return p * q / number.GCD(p, q) 