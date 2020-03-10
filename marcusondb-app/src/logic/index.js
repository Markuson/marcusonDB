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

    userRegister(email, password, UserData, appData) {
        validate.arguments([
            { name: 'email', value: email, type: 'string', notEmpty: true },
            { name: 'password', value: password, type: 'string', notEmpty: true },
        ])
        email = email.toLowerCase()
        validate.email(email)
        validate.password(password)

        return (async () => {
            try {
                await restApi.registerUser(email, password, UserData, appData)
                return "user succesfully registered"
            } catch (error) {
                throw new LogicError(error)
            }
        })()
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

    appRegister(appId, owner) {
        validate.arguments([
            { name: 'appId', value: appId, type: 'string', notEmpty: true },
            { name: 'owner', value: owner, type: 'string', optional: true }
        ])
        return (async () => {
            try {
                await restApi.registerApp(appId, owner)
                return "app succesfully registered"
            } catch (error) {
                throw new LogicError(error)
            }
        })()
    },

    appDelete(appId) {
        validate.arguments([
            { name: 'appId', value: appId, type: 'string', notEmpty: true }
        ])

        return (async () => {
            try {
                const response = await restApi.deleteApp(this.__userToken__, appId)
                return response
            } catch (error) {
                if ((typeof error == 'string') && (error.substring(0, 12) === `user with id`)) throw new LogicError('your user does not have permisions to do that')
                throw new LogicError(error)
            }
        })()
    },

    registerUserAppData(appData) {
        validate.arguments([
            { name: 'appData', value: appData, type: 'object', notEmpty: true }
        ])
        return (async () => {
            try {
                await restApi.registerUserAppData(this.__userToken__, appData)
                return "app succesfully registered"
            } catch (error) {
                throw new LogicError(error)
            }
        })()
    },

    deleteUserAppData(appId) {

        validate.arguments([
            { name: 'appId', value: appId, type: 'string', notEmpty: true }
        ])

        return (async () => {
            try {
                await restApi.deleteUserAppData(this.__userToken__, appId)
                return `app ${appId} succesfully deleted`
            } catch (error) {
                throw new LogicError(error)
            }
        })()
    },

    retrieveAllUsers() {

        return (async () => {
            try {
                const response = await restApi.retrieveAllUsers(this.__userToken__)
                return response
            } catch (error) {
                if ((typeof error === 'string') && (error.substring(0, 12) === `user with id`)) throw new LogicError('your user does not have permisions to do that')
                throw new LogicError(error)
            }
        })()
    },

    adminDeleteUser(userEmail) {
        validate.arguments([
            { name: 'email', value: userEmail, type: 'string', notEmpty: true }
        ])

        let _email = userEmail.toLowerCase()
        validate.email(_email)

        return (async () => {
            try {
                const response = await restApi.adminDeleteUser(this.__userToken__, _email)
                return response
            } catch (error) {
                if ((typeof error == 'string') && (error.substring(0, 12) === `user with id`)) throw new LogicError('your user does not have permisions to do that')
                throw new LogicError(error)
            }
        })()
    },

    adminRegisterUserAppData(userEmail, appData) {

        validate.arguments([
            { name: 'appData', value: appData, type: 'object', notEmpty: true },
            { name: 'email', value: userEmail, type: 'string', notEmpty: true },
            { name: 'appId', value: appData.appId, type: 'string', notEmpty: true }
        ])

        let _email = userEmail.toLowerCase()
        validate.email(_email)

        return (async () => {
            try {
                const response = await restApi.adminRegisterUserAppData(this.__userToken__, _email, appData)
                return response
            } catch (error) {
                if ((typeof error == 'string') && (error.substring(0, 12) === `user with id`)) throw new LogicError('your user does not have permisions to do that')
                throw new LogicError(error)
            }
        })()
    },

    adminDeleteUserAppData(userEmail, appId) {
        validate.arguments([
            { name: 'appId', value: appId, type: 'string', notEmpty: true },
            { name: 'email', value: userEmail, type: 'string', notEmpty: true }
        ])

        let _email = userEmail.toLowerCase()
        validate.email(_email)

        return (async () => {
            try {
                const response = await restApi.adminDeleteUserAppData(this.__userToken__, _email, appId)
                return response
            } catch (error) {
                if ((typeof error == 'string') && (error.substring(0, 12) === `user with id`)) throw new LogicError('your user does not have permisions to do that')
                throw new LogicError(error)
            }
        })()
    },

    adminRetrieveAllApps() {

        return (async () => {
            try {
                const response = await restApi.adminRetrieveAllApps(this.__userToken__)
                return response
            } catch (error) {
                if ((typeof error == 'string') && (error.substring(0, 12) === `user with id`)) throw new LogicError('your user does not have permisions to do that')
                throw new LogicError(error)
            }
        })()
    },
}

export default logic