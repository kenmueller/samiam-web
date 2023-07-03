export const zero = [9, 174, 106]
export const one = [217, 253, 238]
export const zeroInvalid = [231, 35, 54]
export const oneInvalid = [249, 200, 205]
export const diff = one.map((x, i) => x - zero[i])
export const diffInvalid = oneInvalid.map((x, i) => x - zeroInvalid[i])
