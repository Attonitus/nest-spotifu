import {hashSync, compareSync} from 'bcrypt';

export const hashPassword = (password: string, saltRounds = 10) => {
    return hashSync(password, saltRounds);
}

export const validatePassword = (password: string, hashPass: string) => {
    return compareSync(password, hashPass);
}