const validate = require('../utils/validate')
const { LogicError } = require('../utils/errors')
const { models } = require('../muDB-data')
const call = require('../utils/call')
const bcrypt = require('bcrypt')

const { Users, Apps } = models

const logic = {

    registerUser(email, password, userData = undefined, appData = undefined) {
        let _userData = {}
        let _appData = []

        validate.arguments([
            { name: 'email', value: email, type: 'string', notEmpty: true },
            { name: 'password', value: password, type: 'string', notEmpty: true },
        ])
        email = email.toLowerCase()
        validate.email(email)
        validate.password(password)

        const encryptedPass = bcrypt.hashSync(password, 10)

        if (userData) {
            _userData = {
                name: userData.name,
                surname: userData.surname,
                contact: userData.contact
            }
        }

        if (appData) {
            let _role= 'user'

            if(!appData.appId) throw new LogicError('appId is not defined')
            if(appData.role == 'admin' || appData.role == 'owner' || appData.role =='god') _role = appData.role

            _appData.push({
                appId: appData.appId,
                role: _role
            })
        }

        return (async () => {
            const user = await Users.findOne({ email })

            if (user) throw new LogicError(`user with email ${email} already exists`)

            try {
                await Users.create({ email, password: encryptedPass, userData: _userData, appData: _appData })
            } catch (error) {
                throw new Error(error)
            }


        })()
    },

    /** Autenticates the user to the application
     * 
     * @param {string} email email defined by the user in registration process
     * @param {string} password password defined from the user in registration process
     */
    authenticateUser(email, password, appId) {
        validate.arguments([
            { name: 'email', value: email, type: 'string', notEmpty: true },
            { name: 'password', value: password, type: 'string', notEmpty: true },
            { name: 'appId', value: appId, type: 'string', notEmpty: true }
        ])
        let _email = email.toLowerCase()
        validate.email(_email)

        let userPermision = false

        return (async () => {
            const user = await Users.findOne({ email: _email })

            if (!user) throw new LogicError(`user with email ${email} does not exist`)

            const pass = bcrypt.compareSync(password, user.password)

            if (!pass) throw new LogicError('wrong credentials')

            user.appData.forEach(app => {
                if(app.appId === appId) userPermision = true
            })

            if(!userPermision) throw new LogicError(`user with email ${email} does not exist`)

            return user.id
        })()
    },

    /** retrieves the name, surname, email and list of devices of the user asociated with the passed id
     *
     * @param {string} id unique id of the user
     */
    retrieveUser(id) {
        validate.arguments([
            { name: 'id', value: id, type: 'string', notEmpty: true }
        ])

        return (async () => {
            const user = await Users.findById(id)
            if (!user) throw new LogicError(`user with id ${id} does not exist`)
            const { email, userData, appData } = user

            return { email, userData, appData }
        })()
    },

    /** Updates the information of the current user with the information given in the data object. The data object must contain the keys named the same as the parameters of the registerUser function
     *
     * @param {string} id unique id of the user
     * @param {object} data contains the data to be updated. the data to be updated must have the key identical to the parameters of the registerUser function
     * @return {string} 'User succesfully updated'
     */
    updateUser(id, data) {
        validate.arguments([
            { name: 'id', value: id, type: 'string', notEmpty: true },
            { name: 'data', value: data, type: 'object' }

        ])

        let _email
        let _userData

        return (async () => {

            if (data.email) {
                _email = data.email.toLowerCase()
                const _user = await Users.findOne({ _email })
                if (_user) throw new LogicError(`user with email ${_email} already exists`)
            }

            const user = await Users.findById(id)
            if (!user) throw new LogicError(`user with id ${id} does not exist`)
            const { email, password, userData, appData } = user

            if (data.userData) {
                let _contact = undefined
                if (data.userData.contact){
                    _contact = {
                        tel: data.userData.contact.tel || userData.contact.tel,
                        address1: data.userData.contact.address1 || userData.contact.address1,
                        address2: data.userData.contact.address2 || userData.contact.address2,
                        city: data.userData.contact.city || userData.contact.city,
                        province: data.userData.contact.province || userData.contact.province,
                        postalCode: data.userData.contact.postalCode || userData.contact.postalCode,
                        country: data.userData.contact.country || userData.contact.country,
                    }
                }
                _userData = {
                    name: data.userData.name || userData.name,
                    surname: data.userData.surname || userData.surname,
                    contact: _contact || userData.contact
                }
            }

            await Users.findByIdAndUpdate(id, {
                email: _email || email,
                password: data.password ? bcrypt.hashSync(data.password, 10) : password,
                userData: _userData || userData,
                appData
            })

            return `User succesfully updated`
        })()
    },

    /** deletes the user asociated to the id passed
     *
     * @param {string} id unique id of the user
     * @return {string} 'User succesfully deleted'
     */
    deleteUser(id) {
        validate.arguments([
            { name: 'id', value: id, type: 'string', notEmpty: true }
        ])

        return (async () => {

            const user = await Users.findById(id)
            if (!user) throw new LogicError(`user with id ${id} does not exist`)

            await Users.findByIdAndDelete(id)

            return `User succesfully deleted`
        })()
    },

    registerUserAppData(id, appData) {
        let _appData = {}
        let _role = 'user'
        validate.arguments([
            { name: 'id', value: id, type: 'string', notEmpty: true },
            { name: 'appData', value: appData, type: 'object', notEmpty: true },
            { name: 'appId', value: appData.appId, type: 'string', notEmpty: true }
        ])


        if (!appData.appId) throw new LogicError('missing appId on appData')
        if (appData.role == 'admin' || appData.role == 'owner' || appData.role == 'god') _role = appData.role

        _appData = {
            appId: appData.appId,
            role: _role
        }

        return (async () => {
            try {
                const user = await Users.findById(id)
                if (!user) throw new LogicError(`user does not exist`)

                if (user.appData.length > 0){
                    user.appData.forEach(element => {
                        if (element.appId === appData.appId) throw new LogicError(`app ${appData.appId} already registered for user: ${user.email}`)
                    });
                }
                user.appData.push(_appData)
                await Users.findByIdAndUpdate(id, user)

            } catch (error) {
                throw new LogicError(error.message)
            }
        })()
    },

    deleteUserAppData(id, appId) {

        validate.arguments([
            { name: 'id', value: id, type: 'string', notEmpty: true },
            { name: 'appId', value: appId, type: 'string', notEmpty: true }
        ])

        return (async () => {
            try {
                const user = await Users.findById(id)
                if (!user) throw new LogicError(`user does not exist`)

                let appIds = await Users.find({'appData.appId': appId})
                if (appIds.length == 0 ) throw new LogicError(`app Id named ${appId} does not exist`)

                const newAppData = user.appData.filter(({ appId:found }) => found != appId)
                user.appData = newAppData

                await Users.findByIdAndUpdate(id, user)

            } catch (error) {
                throw new LogicError(error.message)
            }
        })()
    },

    adminRetrieveAllUsers(id) {
        validate.arguments([
            { name: 'id', value: id, type: 'string', notEmpty: true }
        ])

        let userPermision = false

        return (async () => {
            const user = await Users.findById(id)
            if (!user) throw new LogicError(`user with id ${id} does not exist`)
            const { appData } = user

            appData.forEach((app) => {
                if(app.appId === 'marcusonDB' && app.role === 'god') userPermision = true
            })

            if(!userPermision)throw new LogicError(`user with id ${id} does not have permisions to view all users`)

            let users = await Users.find({})
            let _users = []
            users.forEach((user)=>{
                _users.push({id: user._id, email: user.email, appData: user.appData, userData: user.userData })
            })

            return _users
        })()
    },

    adminDeleteUser(id, userEmail) {
        validate.arguments([
            { name: 'id', value: id, type: 'string', notEmpty: true },
            { name: 'email', value: userEmail, type: 'string', notEmpty: true }
        ])

        let _email = userEmail.toLowerCase()
        validate.email(_email)

        let userPermision = false

        return (async () => {
            const user = await Users.findById(id)
            if (!user) throw new LogicError(`user with id ${id} does not exist`)
            const { appData } = user

            appData.forEach((app) => {
                if(app.appId === 'marcusonDB' && app.role === 'god') userPermision = true
            })

            if(!userPermision)throw new LogicError(`user with id ${id} does not have permisions to delete users`)

            let userToDelete = await Users.findOne({email: _email})

            await Users.findByIdAndDelete(userToDelete.id)

            return `user ${_email} succesfully deleted `
        })()
    },

    adminRegisterUserAppData(id, userEmail, appData) {
        let _appData = {}
        let _role = 'user'
        validate.arguments([
            { name: 'id', value: id, type: 'string', notEmpty: true },
            { name: 'appData', value: appData, type: 'object', notEmpty: true },
            { name: 'email', value: userEmail, type: 'string', notEmpty: true },
            { name: 'appId', value: appData.appId, type: 'string', notEmpty: true }
        ])

        let _email = userEmail.toLowerCase()
        validate.email(_email)

        let userPermision = false

        if (!appData.appId) throw new LogicError('missing appId on appData')
        if (appData.role == 'admin' || appData.role == 'owner' || appData.role == 'god') _role = appData.role

        _appData = {
            appId: appData.appId,
            role: _role
        }

        return (async () => {
            try {
                const user = await Users.findById(id)
                if (!user) throw new LogicError(`user with id ${id} does not exist`)
                const { appData } = user

                appData.forEach((app) => {
                    if (app.appId === 'marcusonDB' && app.role === 'god') userPermision = true
                })

                if (!userPermision) throw new LogicError(`user with id ${id} does not have permisions to register apps to users`)

                const userToUpdate = await Users.findOne({email:_email})
                if (!userToUpdate) throw new LogicError(`user does not exist`)

                if (userToUpdate.appData.length > 0){
                    userToUpdate.appData.forEach(element => {
                        if (element.appId === appData.appId) throw new LogicError(`app ${_appData.appId} already registered for user: ${userToUpdate.email}`)
                    });
                }
                userToUpdate.appData.push(_appData)
                await Users.findByIdAndUpdate(userToUpdate.id, userToUpdate)

                return `app ${_appData.appId} succesfully registered to ${_email}`

            } catch (error) {
                throw new LogicError(error.message)
            }
        })()
    },

    adminDeleteUserAppData(id, userEmail, appId) {
        let _appId = appId
        validate.arguments([
            { name: 'id', value: id, type: 'string', notEmpty: true },
            { name: 'appId', value: appId, type: 'string', notEmpty: true },
            { name: 'email', value: userEmail, type: 'string', notEmpty: true }
        ])

        let _email = userEmail.toLowerCase()
        validate.email(_email)

        let userPermision = false

        return (async () => {
            try {
                const user = await Users.findById(id)
                if (!user) throw new LogicError(`user with id ${id} does not exist`)
                const { appData } = user

                appData.forEach((app) => {
                    if (app.appId === 'marcusonDB' && app.role === 'god') userPermision = true
                })

                if (!userPermision) throw new LogicError(`user with id ${id} does not have permisions to delete apps to users`)

                const userToUpdate = await Users.findOne({email: _email})
                if (!userToUpdate) throw new LogicError(`user does not exist`)

                let appIds = await Users.find({'appData.appId': appId})
                if (appIds.length == 0 ) throw new LogicError(`app Id named ${appId} does not exist`)

                const newAppData = userToUpdate.appData.filter(({ appId:found }) => found != appId)
                userToUpdate.appData = newAppData

                await Users.findByIdAndUpdate(userToUpdate.id, userToUpdate)

                return `app ${_appId} succesfully deleted from ${_email}`

            } catch (error) {
                throw new LogicError(error.message)
            }
        })()
    },

    adminRegisterApp(appId, owner) {
        validate.arguments([
            { name: 'appId', value: appId, type: 'string', notEmpty: true },
            { name: 'owner', value: owner, type:'string', optional: true}
        ])

        return (async () => {
            const app = await Apps.findOne({ appId })

            if (app) throw new LogicError(`app with appId ${appId} already exists`)

            try {
                await Apps.create({ appId, owner })
            } catch (error) {
                throw new Error(error)
            }


        })()

    },

    adminDeleteApp(appId) {
        validate.arguments([
            { name: 'appId', value: appId, type: 'string', notEmpty: true }
        ])

        return (async () => {

            const app = await Apps.findOne({appId})
            if (!app) throw new LogicError(`app with appId ${appId} does not exist`)
            await Apps.findByIdAndDelete(app.id)

            return `App succesfully deleted`
        })()
    },

    adminRetrieveAllApps(userId) {
        validate.arguments([
            { name: 'userId', value: userId, type: 'string', notEmpty: true }
        ])

        let userPermision = false

        return (async () => {
            const user = await Users.findById(userId)
            if (!user) throw new LogicError(`user with id ${userId} does not exist`)
            const { appData } = user

            appData.forEach((app) => {
                if(app.appId === 'marcusonDB' && app.role === 'god') userPermision = true
            })

            if(!userPermision)throw new LogicError(`user with id ${userId} does not have permisions to view all apps`)

            let _apps = await Apps.find({})

            return _apps
        })()
    },


}

module.exports = logic