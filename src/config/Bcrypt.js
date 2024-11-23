import bcryptJs from 'bcryptjs'

const salt = bcryptJs.genSaltSync(10)

const hashPass = (value) => bcryptJs.hashSync(value, salt)

const comparePass = (value, hash) => bcryptJs.compareSync(value, hash)

export { hashPass, comparePass }
