import validate from '../utils/validate'
import call from '../utils/call'

const restApi = {

    __url__ : 'https://marcusondb-api.herokuapp.com/api',

    registerUser(email, password, userData = undefined, appData = undefined) {
        validate.arguments([
            { name: 'email', value: email, type: 'string', notEmpty: true },
            { name: 'password', value: password, type: 'string', notEmpty: true },
        ])
        email = email.toLowerCase()
        validate.email(email)
        validate.password(password)

        return (async () => {
            const response = await call(`${this.__url__}/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { email, password, userData, appData }
            })
            return response
        })()
    },

    autenticateUser(email, password, appId = 'marcusonDB'){
        validate.arguments([
            { name: 'email', value: email, type: 'string', notEmpty: true },
            { name: 'password', value: password, type: 'string', notEmpty: true },
            { name: 'appId', value: appId, type: 'string', notEmpty: true }
        ])
        email = email.toLowerCase()
        validate.email(email)
        validate.password(password)

        return (async () => {
            const response = await call(`${this.__url__}/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { email, password, appId }
            })
            return response
        })()
    },

    deleteUser(token) {
        validate.arguments([
            { name: 'token', value: token, type: 'string', notEmpty: true }
        ])

        return (async () => {

            const response = await call(`${this.__url__}/user`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            })

            return response
        })()
    },

    registerUserAppData(token, appData) {
        validate.arguments([
            { name: 'token', value: token, type: 'string', notEmpty: true },
            { name: 'appData', value: appData, type: 'object', notEmpty: true }
        ])
        return (async () => {
            const response = await call(`${this.__url__}/user/appdata`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                data: { data: { appData } }
            })

            return response
        })()
    },

    deleteUserAppData(token, appId) {

        validate.arguments([
            { name: 'token', value: token, type: 'string', notEmpty: true },
            { name: 'appId', value: appId, type: 'string', notEmpty: true }
        ])

        return (async () => {
            const response = await call(`${this.__url__}/user/appData`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                data: { appId }
            })
            return response
        })()
    },

    retrieveAllUsers(token) {
        validate.arguments([
            { name: 'token', value: token, type: 'string', notEmpty: true }
        ])

        return (async () => {
            const response = await call(`${this.__url__}/admin/listusers`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            })
            return response
        })()
    },

    registerApp(appId, owner) {
        validate.arguments([
            { name: 'appId', value: appId, type: 'string', notEmpty: true },
            { name: 'owner', value: owner, type:'string', optional: true}
        ])

        return (async () => {
            const response = await call(`${this.__url__}/app/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: { appId, owner }
            })

            return response
        })()

    },

    deleteApp(token, appId) {
        validate.arguments([
            { name: 'token', value: token, type: 'string', notEmpty: true },
            { name: 'appId', value: appId, type: 'string', notEmpty: true }
        ])

        return (async () => {

            const response = await call(`${this.__url__}/app/delete`, {
                method: 'put',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                data: { appId }
            })

            return response
        })()
    },

    adminDeleteUser(token, userEmail) {
        validate.arguments([
            { name: 'token', value: token, type: 'string', notEmpty: true },
            { name: 'email', value: userEmail, type: 'string', notEmpty: true }
        ])

        let _email = userEmail.toLowerCase()
        validate.email(_email)

        return (async () => {
            const response = await call(`${this.__url__}/admin/deleteuser`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                data: { email:_email }
            })
            return response
        })()
    },

    adminRegisterUserAppData(token, userEmail, appData) {

        validate.arguments([
            { name: 'token', value: token, type: 'string', notEmpty: true },
            { name: 'appData', value: appData, type: 'object', notEmpty: true },
            { name: 'email', value: userEmail, type: 'string', notEmpty: true },
            { name: 'appId', value: appData.appId, type: 'string', notEmpty: true }
        ])

        let _email = userEmail.toLowerCase()
        validate.email(_email)

        return (async () => {
            const response = await call(`${this.__url__}/admin/registerapp`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                data: { email: _email, appData }
            })

            return response
        })()
    },

    adminDeleteUserAppData(token, userEmail, appId) {
        validate.arguments([
            { name: 'token', value: token, type: 'string', notEmpty: true },
            { name: 'appId', value: appId, type: 'string', notEmpty: true },
            { name: 'email', value: userEmail, type: 'string', notEmpty: true }
        ])

        let _email = userEmail.toLowerCase()
        validate.email(_email)

        return (async () => {
            const response = await call(`${this.__url__}/admin/deleteapp`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                data: { email: _email, appId }
            })

            return response
        })()
    },

    adminRetrieveAllApps(token) {
        validate.arguments([
            { name: 'token', value: token, type: 'string', notEmpty: true }
        ])

        return (async () => {
            const response = await call(`${this.__url__}/admin/listapps`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            })
            return response
        })()
    },


}

export default restApi