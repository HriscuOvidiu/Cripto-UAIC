import math


def compute_fraction_alfa(v, i):
    if i < 0:
        return 0
    if i == 0:
        return v[0]
    if i == 1:
        return v[0] * v[1] + 1
    else:
        return v[i] * compute_fraction_alfa(v, i - 1) + compute_fraction_alfa(v, i - 2)


def compute_fraction_beta(v, i):
    if i < 0:
        return 0
    if i == 0:
        return 1
    if i == 1:
        return v[1]
    else:
        return v[i] * compute_fraction_beta(v, i - 1) + compute_fraction_beta(v, i - 2)


def get_continuous_fraction(v):
    return (compute_fraction_alfa(v, len(v) - 1), compute_fraction_beta(v, len(v) - 1))


def criteriu(l, d, e, n):
	if l == 0:
		return False
	fi = (e * d - 1) / l
	if fi != abs(fi):
		return False
	b = n - fi + 1
	c = n
	sqRoot = math.sqrt(b * b - 4 * c)
	if sqRoot != abs(sqRoot):
		return False
	x = (-b + sqRoot) / 2
	y = (-b - sqRoot) / 2
	int_x = abs(x)
	int_y = abs(y)
	if int_x * int_y != n:
		return False
	if (int_x - 1) * (int_y - 1) != fi:
		return False
	return True


def run(e, n):
    i = 0
    a = e
    b = n
    continuous_fraction_vector = []
    while True:
        i += 1
        c = a/b
        r = a % b
        continuous_fraction_vector.append(r)
        a = b
        b = r
        (l, d) = get_continuous_fraction(continuous_fraction_vector)
        if criteriu(l, d, e, n) == 1:
            break
    return d
