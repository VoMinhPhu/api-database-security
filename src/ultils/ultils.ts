import * as bcrypt from 'bcrypt';
const saltRounds = 10

export const hashPassword = async (plainPassword: string) => {
    try {
        return await bcrypt.hash(String(plainPassword), saltRounds)
    } catch (error) {
        console.log(error)
    }
}
export const comparePassword = async (plainPassword: string, hashPassword: string) => {
    try {
        return await bcrypt.compare(String(plainPassword), hashPassword)
    } catch (error) {
        console.log(error)
    }
}