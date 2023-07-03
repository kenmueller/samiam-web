export const zero = [9, 174, 106]
export const one = [217, 253, 238]
export const zeroInvalid = [240, 209, 222]
export const oneInvalid = [195, 70, 122]
export const diff = one.map((x, i) => x - zero[i])
export const diffInvalid = oneInvalid.map((x, i) => x - zeroInvalid[i])
