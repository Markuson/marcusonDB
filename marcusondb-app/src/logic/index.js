import restApi from '../rest-api'
import validate from '../utils/validate'
import { LogicError } from '../utils/errors'

const logic = {

    set __userToken__(token) {
        sessionStorage.userToken = token
    },

    get __userToken__() {
        return sessionStorage.userToken
    },

    get isUserLoggedIn() {
        return !!(this.__userToken__)
    },

    login(email, password) {
        validate.arguments([
            { name: 'email', value: email, type: 'string', notEmpty: true },
            { name: 'password', value: password, type: 'string', notEmpty: true },
        ])
        email = email.toLowerCase()
        validate.email(email)
        validate.password(password)

        return (async () => {
            try {
                const { token } = await restApi.autenticateUser(email, password)
                this.__userToken__ = token
            } catch (error) {
                throw new LogicError(error)
            }
        })()
    },
    logout() {
        sessionStorage.clear()
    },

    appRegister() {
        console.log('APP REGISTER')
    },

    userRegister() {
        console.log('USER REGISTER')
    }
}

export default logic