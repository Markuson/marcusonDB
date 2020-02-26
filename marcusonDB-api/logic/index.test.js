require('dotenv').config()
const bcrypt = require('bcrypt')
const { expect } =  require ('chai')
const logic = require('.')
const { LogicError } = require('../utils/errors')
const {models} = require('../muDB-data')
const mongoose = require('mongoose')

const { Users, Apps } = models;
const { env: { MONGO_URL_LOGIC_TEST : url }} = process


describe('logic', () => {

    before(async () => {
        await mongoose.connect(url, { useNewUrlParser: true,  useFindAndModify: false, useUnifiedTopology: true, useCreateIndex: true })
        await Users.deleteMany()
        await Apps.deleteMany()
    })

    xdescribe('users', () => {
        let email
        let password = '1234567a'
        let userData = {
            name: 'Marc',
            surname: 'Uson',
            contact: {
                tel: 123456789,
                address1: 'test address 1',
                address2: 'test adress 2',
                city: 'TestCity',
                province: 'Lleida',
                postalCode: '9999',
                country: 'Catalunya',
            }
        }
        let appData = {
            appId: 'testAppId',
            role: 'user'
        }

        beforeEach(async () => {
            email = `marcusontest-${Math.random()}@gmail.com`
        })

        describe('register user', () => {

            it('should succeed on correct email and password registration without userData nor Appdata', async () => {

                const res = await logic.registerUser(email, password)

                expect(res).to.not.exist

                const _user = await Users.findOne({ email })

                expect(_user).to.exist
                expect(_user.id).to.exist
                expect(_user.id).to.be.a('string')
                expect(_user.email).to.exist
                expect(_user.email).to.be.a('string')
                expect(_user.password).to.exist
                expect(_user.userData).to.exist
                expect(_user.userData).to.be.a('object')
                expect(_user.userData.name).to.equal('not defined')
                expect(_user.userData.surname).to.equal('not defined')
                expect(_user.appData).to.be.a('array')
                expect(_user.appData.length).to.equal(0)
            })

            it('should succeed on correct email and password registration with userData and Appdata OK', async () => {

                const res = await logic.registerUser(email, password, userData, appData)

                expect(res).to.not.exist

                const _user = await Users.findOne({ email })

                expect(_user).to.exist
                expect(_user.id).to.exist
                expect(_user.id).to.be.a('string')
                expect(_user.email).to.exist
                expect(_user.email).to.be.a('string')
                expect(_user.password).to.exist
                expect(_user.userData).to.exist
                // expect(_user.userData).to.eql(userData)
                expect(_user.appData).to.exist
                // expect(_user.appData).to.eql(appData)
            })


            it('should succeed on registering email in lower case', async () => {

                const uperCaseEmail = email.toUpperCase()

                const res = await logic.registerUser(uperCaseEmail, password)

                expect(res).to.not.exist

                const _user = await Users.findOne({ email })

                expect(_user).to.exist
                expect(_user.id).to.exist
                expect(_user.id).to.be.a('string')
                expect(_user.email).to.exist
                expect(_user.email).to.be.a('string')
                expect(_user.password).to.exist
                expect(_user.userData).to.exist
                expect(_user.userData).to.be.a('object')
                expect(_user.userData.name).to.equal('not defined')
                expect(_user.userData.surname).to.equal('not defined')
                expect(_user.appData).to.be.a('array')
                expect(_user.appData.length).to.equal(0)
            })

            describe('already existing user', () => {
                let _password
                beforeEach(async () => {
                    _password = bcrypt.hashSync(password, 10)
                    await Users.create({ email, password: _password, userData:{}, appData:[] })
                })

                it('should fail on retrying to register', async () => {
                    try {
                        await logic.registerUser(email, password)

                        throw Error('should not reach this point')
                    } catch (error) {
                        expect(error).to.exist
                        expect(error).to.be.an.instanceOf(LogicError)

                        expect(error.message).to.equal(`user with email ${email} already exists`)
                    }
                })
            })

            it('should fail on undefined email', () => {
                const email = undefined

                expect(() => logic.registerUser(email, password)).to.throw(Error, `email is not optional`)
            })

            it('should fail on null email', () => {
                const email = null

                expect(() => logic.registerUser(email, password)).to.throw(Error, `email is not optional`)
            })

            it('should fail on empty email', () => {
                const email = ''

                expect(() => logic.registerUser(email, password)).to.throw(Error, 'email is empty')
            })

            it('should fail on blank email', () => {
                const email = ' \t    \n'

                expect(() => logic.registerUser(email, password)).to.throw(Error, 'email is empty')
            })

            it('should fail on non-email email', () => {
                const nonEmail = 'non-email'

                expect(() => logic.registerUser(nonEmail, password)).to.throw(Error, `${nonEmail} is not an e-mail`)
            })

            it('should fail on short password length', () => {

                expect(() => logic.registerUser(email, '1234')).to.throw(Error, `Invalid password, the password must be between 8 and 16 characters and contain at least one number and one letter`)
            })

            it('should fail on weak password', () => {

                expect(() => logic.registerUser(email, '123456789')).to.throw(Error, `Invalid password, the password must be between 8 and 16 characters and contain at least one number and one letter`)
            })

            it('should fail on undefined password', () => {
                const password = undefined

                expect(() => logic.registerUser(email, password)).to.throw(Error, `password is not optional`)
            })

            it('should fail on null password', () => {
                const password = null

                expect(() => logic.registerUser(email, password)).to.throw(Error, `password is not optional`)
            })

            it('should fail on empty password', () => {
                const password = ''

                expect(() => logic.registerUser(email, password)).to.throw(Error, 'password is empty')
            })

            it('should fail on blank password', () => {
                const password = ' \t    \n'

                expect(() => logic.registerUser(email, password)).to.throw(Error, 'password is empty')
            })

        })

        describe('authenticate user', () => {
            let _password
                beforeEach(async () => {
                    _password = bcrypt.hashSync(password, 10)
                    await Users.create({ email, password: _password, userData:{}, appData:[] })
                })

            it('should succeed on correct user credential', async () => {
                const id = await logic.authenticateUser(email, password)

                expect(id).to.be.a('string')
                expect(id.length).to.be.greaterThan(0)
            })

            it('should fail on wrong passwotd', async () => {
                try {
                    await logic.authenticateUser(email, password='000')

                    throw Error('should not reach this point')
                } catch (error) {
                    expect(error).to.exist
                    expect(error).to.be.instanceOf(LogicError)

                    expect(error.message).to.equal(`wrong credentials`)
                }
            })

            it('should fail on non-existing user', async () => {
                try {
                    await logic.authenticateUser(email = 'unexisting-user@mail.com', password)

                    throw Error('should not reach this point')
                } catch (error) {
                    expect(error).to.exist
                    expect(error).to.be.instanceOf(LogicError)

                    expect(error.message).to.equal(`user with email ${email} does not exist`)
                }
            })
        })

        describe('retrieve user', () => {
            let id
            let _password

            beforeEach(async () => {
                _password = bcrypt.hashSync(password, 10)

                await Users.create({ email, password: _password, userData, appData })

                const users = await Users.find({email})

                id = users[0].id
            })

            it('should succeed on correct user id from existing user', async () => {
                const user = await logic.retrieveUser(id)

                expect(user.id).to.not.exist
                expect(user.email).to.equal(email)
                expect(user.password).to.not.exist
                expect(user.appData).to.exist
                expect(user.appData[0].appId).to.equal(appData.appId)
                expect(user.appData[0].role).to.equal(appData.role)
                expect(user.userData).to.exist
                expect(user.userData.name).to.equal(userData.name)
                expect(user.userData.surname).to.equal(userData.surname)
                expect(user.userData.contact.tel).to.eql(userData.contact.tel)
                expect(user.userData.contact.address1).to.eql(userData.contact.address1)
                expect(user.userData.contact.address2).to.eql(userData.contact.address2)
                expect(user.userData.contact.city).to.eql(userData.contact.city)
                expect(user.userData.contact.province).to.eql(userData.contact.province)
                expect(user.userData.contact.postalCode).to.eql(userData.contact.postalCode)
                expect(user.userData.contact.country).to.eql(userData.contact.country)

            })

            it('should fail on unexisting user id', async () => {
                id = '01234567890123456789abcd'

                try {
                    await logic.retrieveUser(id)

                    throw new Error('should not reach this point')
                } catch (error) {
                    expect(error).to.exist

                    expect(error).to.be.an.instanceOf(LogicError)

                    expect(error.message).to.equal(`user with id ${id} does not exist`)
                }
            })
        })

        describe('update user', () => {
            let id
            let _password

            beforeEach(async () => {
                _password = bcrypt.hashSync(password, 10)

                await Users.create({ email, password: _password, userData, appData })

                const users = await Users.find({email})

                id = users[0].id
            })

            it('should succeed on updating user email', async () => {
                let newEmail = 'newemail@mail.com'

                const response = await logic.updateUser(id, {email: newEmail})

                expect(response).to.be.a('string')
                expect(response).to.equal('User succesfully updated')

                const user = await logic.retrieveUser(id)

                expect(user.id).to.not.exist
                expect(user.email).to.equal(newEmail)
                expect(user.password).to.not.exist
                expect(user.appData).to.exist
                expect(user.appData[0].appId).to.equal(appData.appId)
                expect(user.appData[0].role).to.equal(appData.role)
                expect(user.userData).to.exist
                expect(user.userData.name).to.equal(userData.name)
                expect(user.userData.surname).to.equal(userData.surname)
                expect(user.userData.contact.tel).to.equal(userData.contact.tel)
                expect(user.userData.contact.address1).to.equal(userData.contact.address1)
                expect(user.userData.contact.address2).to.equal(userData.contact.address2)
                expect(user.userData.contact.city).to.equal(userData.contact.city)
                expect(user.userData.contact.province).to.equal(userData.contact.province)
                expect(user.userData.contact.postalCode).to.equal(userData.contact.postalCode)
                expect(user.userData.contact.country).to.equal(userData.contact.country)
            })

            it('should succeed on updating user password', async () => {
                let newPassword = 'newpassword'

                const response = await logic.updateUser(id, {password: newPassword})

                expect(response).to.be.a('string')
                expect(response).to.equal('User succesfully updated')

                const user = await logic.retrieveUser(id)

                expect(user.id).to.not.exist
                expect(user.email).to.equal(email)
                expect(user.password).to.not.exist
                expect(user.appData).to.exist
                expect(user.appData[0].appId).to.equal(appData.appId)
                expect(user.appData[0].role).to.equal(appData.role)
                expect(user.userData).to.exist
                expect(user.userData.name).to.equal(userData.name)
                expect(user.userData.surname).to.equal(userData.surname)
                expect(user.userData.contact.tel).to.equal(userData.contact.tel)
                expect(user.userData.contact.address1).to.equal(userData.contact.address1)
                expect(user.userData.contact.address2).to.equal(userData.contact.address2)
                expect(user.userData.contact.city).to.equal(userData.contact.city)
                expect(user.userData.contact.province).to.equal(userData.contact.province)
                expect(user.userData.contact.postalCode).to.equal(userData.contact.postalCode)
                expect(user.userData.contact.country).to.equal(userData.contact.country)

                const _id = await logic.authenticateUser(email, newPassword)

                expect(_id).to.be.a('string')
                expect(_id.length).to.be.greaterThan(0)
            })

            it('should succeed on updating user data name', async () => {
                let newName = 'newName'
                const response = await logic.updateUser(id, {userData:{name: newName}})

                expect(response).to.be.a('string')
                expect(response).to.equal('User succesfully updated')

                const user = await logic.retrieveUser(id)

                expect(user.id).to.not.exist
                expect(user.email).to.equal(email)
                expect(user.password).to.not.exist
                expect(user.appData).to.exist
                expect(user.appData[0].appId).to.equal(appData.appId)
                expect(user.appData[0].role).to.equal(appData.role)
                expect(user.userData).to.exist
                expect(user.userData.name).to.equal(newName)
                expect(user.userData.surname).to.equal(userData.surname)
                expect(user.userData.contact.tel).to.equal(userData.contact.tel)
                expect(user.userData.contact.address1).to.equal(userData.contact.address1)
                expect(user.userData.contact.address2).to.equal(userData.contact.address2)
                expect(user.userData.contact.city).to.equal(userData.contact.city)
                expect(user.userData.contact.province).to.equal(userData.contact.province)
                expect(user.userData.contact.postalCode).to.equal(userData.contact.postalCode)
                expect(user.userData.contact.country).to.equal(userData.contact.country)
            })

            it('should succeed on updating user data surname', async () => {
                let newSurname = 'newSurname'
                const response = await logic.updateUser(id, {userData:{surname: newSurname}})

                expect(response).to.be.a('string')
                expect(response).to.equal('User succesfully updated')

                const user = await logic.retrieveUser(id)

                expect(user.id).to.not.exist
                expect(user.email).to.equal(email)
                expect(user.password).to.not.exist
                expect(user.appData).to.exist
                expect(user.appData[0].appId).to.equal(appData.appId)
                expect(user.appData[0].role).to.equal(appData.role)
                expect(user.userData).to.exist
                expect(user.userData.name).to.equal(userData.name)
                expect(user.userData.surname).to.equal(newSurname)
                expect(user.userData.contact.tel).to.equal(userData.contact.tel)
                expect(user.userData.contact.address1).to.equal(userData.contact.address1)
                expect(user.userData.contact.address2).to.equal(userData.contact.address2)
                expect(user.userData.contact.city).to.equal(userData.contact.city)
                expect(user.userData.contact.province).to.equal(userData.contact.province)
                expect(user.userData.contact.postalCode).to.equal(userData.contact.postalCode)
                expect(user.userData.contact.country).to.equal(userData.contact.country)
            })

            it('should succeed on updating user data contact address1', async () => {
                let newContact = {
                    address1: 'new test address 1',
                }
                const response = await logic.updateUser(id, {userData:{contact: newContact}})

                expect(response).to.be.a('string')
                expect(response).to.equal('User succesfully updated')

                const user = await logic.retrieveUser(id)

                expect(user.id).to.not.exist
                expect(user.email).to.equal(email)
                expect(user.password).to.not.exist
                expect(user.appData).to.exist
                expect(user.appData[0].appId).to.equal(appData.appId)
                expect(user.appData[0].role).to.equal(appData.role)
                expect(user.userData).to.exist
                expect(user.userData.name).to.equal(userData.name)
                expect(user.userData.surname).to.equal(userData.surname)
                expect(user.userData.contact.tel).to.equal(userData.contact.tel)
                expect(user.userData.contact.address1).to.equal(newContact.address1)
                expect(user.userData.contact.address2).to.equal(userData.contact.address2)
                expect(user.userData.contact.city).to.equal(userData.contact.city)
                expect(user.userData.contact.province).to.equal(userData.contact.province)
                expect(user.userData.contact.postalCode).to.equal(userData.contact.postalCode)
                expect(user.userData.contact.country).to.equal(userData.contact.country)
            })

            it('should succeed on updating user data contact tel', async () => {
                let newContact = {
                    tel: 5555555,
                }
                const response = await logic.updateUser(id, {userData:{contact: newContact}})

                expect(response).to.be.a('string')
                expect(response).to.equal('User succesfully updated')

                const user = await logic.retrieveUser(id)

                expect(user.id).to.not.exist
                expect(user.email).to.equal(email)
                expect(user.password).to.not.exist
                expect(user.appData).to.exist
                expect(user.appData[0].appId).to.equal(appData.appId)
                expect(user.appData[0].role).to.equal(appData.role)
                expect(user.userData).to.exist
                expect(user.userData.name).to.equal(userData.name)
                expect(user.userData.surname).to.equal(userData.surname)
                expect(user.userData.contact.tel).to.equal(newContact.tel)
                expect(user.userData.contact.address1).to.equal(userData.contact.address1)
                expect(user.userData.contact.address2).to.equal(userData.contact.address2)
                expect(user.userData.contact.city).to.equal(userData.contact.city)
                expect(user.userData.contact.province).to.equal(userData.contact.province)
                expect(user.userData.contact.postalCode).to.equal(userData.contact.postalCode)
                expect(user.userData.contact.country).to.equal(userData.contact.country)
            })

            it('should succeed on updating user data contact country', async () => {
                let newContact = {
                    country: 'Andorra',
                }
                const response = await logic.updateUser(id, {userData:{contact: newContact}})

                expect(response).to.be.a('string')
                expect(response).to.equal('User succesfully updated')

                const user = await logic.retrieveUser(id)

                expect(user.id).to.not.exist
                expect(user.email).to.equal(email)
                expect(user.password).to.not.exist
                expect(user.appData).to.exist
                expect(user.appData[0].appId).to.equal(appData.appId)
                expect(user.appData[0].role).to.equal(appData.role)
                expect(user.userData).to.exist
                expect(user.userData.name).to.equal(userData.name)
                expect(user.userData.surname).to.equal(userData.surname)
                expect(user.userData.contact.tel).to.equal(userData.contact.tel)
                expect(user.userData.contact.address1).to.equal(userData.contact.address1)
                expect(user.userData.contact.address2).to.equal(userData.contact.address2)
                expect(user.userData.contact.city).to.equal(userData.contact.city)
                expect(user.userData.contact.province).to.equal(userData.contact.province)
                expect(user.userData.contact.postalCode).to.equal(userData.contact.postalCode)
                expect(user.userData.contact.country).to.equal(newContact.country)
            })

            it('should fail on unexisting user id', async () => {
                id = '01234567890123456789abcd'

                try {
                    await logic.updateUser(id, {email})

                    throw new Error('should not reach this point')
                } catch (error) {
                    expect(error).to.exist

                    expect(error).to.be.an.instanceOf(LogicError)

                    expect(error.message).to.equal(`user with id ${id} does not exist`)
                }
            })
        })

        describe('delete user', () => {
            let id
            let _password

            beforeEach(async () => {
                _password = bcrypt.hashSync(password, 10)
                await Users.create({ email, password: _password, userData, appData })
                const users = await Users.find({email})
                id = users[0].id
            })

            it('should succeed on deleting', async () => {
                const response = await logic.deleteUser(id)

                expect(response).to.be.a('string')
                expect(response).to.equal('User succesfully deleted')

                try {
                    await logic.retrieveUser(id)

                    throw new Error('should not reach this point')
                } catch (error) {
                    expect(error).to.exist

                    expect(error).to.be.an.instanceOf(LogicError)

                    expect(error.message).to.equal(`user with id ${id} does not exist`)
                }
            })

            it('should fail on unexisting user id', async () => {
                id = '01234567890123456789abcd'

                try {
                    await logic.deleteUser(id)

                    throw new Error('should not reach this point')
                } catch (error) {
                    expect(error).to.exist

                    expect(error).to.be.an.instanceOf(LogicError)

                    expect(error.message).to.equal(`user with id ${id} does not exist`)
                }
            })
        })

        describe('register appData to an user', () => {

            beforeEach(async () => {
                _password = bcrypt.hashSync(password, 10)

                await Users.create({ email, password: _password, userData, appData:[] })

                const users = await Users.find({email})

                id = users[0].id

                email = users[0].email
            })

            it('should succeed on correct appData registration to an existing user', async () => {

                const res = await logic.registerUserAppData(id, appData)

                expect(res).to.not.exist

                const _user = await Users.findOne({ email })

                expect(_user).to.exist
                expect(_user.id).to.exist
                expect(_user.id).to.be.a('string')
                expect(_user.email).to.exist
                expect(_user.email).to.be.a('string')
                expect(_user.password).to.exist
                expect(_user.appData).to.be.a('array')
                expect(_user.appData.length).to.equal(1)
                expect(_user.appData[0].appId).to.equal(appData.appId)
                expect(_user.appData[0].role).to.equal(appData.role)
            })

            it('should succeed on correct appData without role registration to an existing user', async () => {

                const res = await logic.registerUserAppData(id, {appId: 'appId'})

                expect(res).to.not.exist

                const _user = await Users.findOne({ email })

                expect(_user).to.exist
                expect(_user.id).to.exist
                expect(_user.id).to.be.a('string')
                expect(_user.email).to.exist
                expect(_user.email).to.be.a('string')
                expect(_user.password).to.exist
                expect(_user.appData).to.be.a('array')
                expect(_user.appData.length).to.equal(1)
                expect(_user.appData[0].appId).to.equal('appId')
                expect(_user.appData[0].role).to.equal('user')
            })

            it('should succeed on two correct appData registration to an existing user', async () => {
                const appData2= {appId:'otherApp', role:'admin'}

                const res = await logic.registerUserAppData(id, appData)

                expect(res).to.not.exist

                const res2 = await logic.registerUserAppData(id, appData2)

                expect(res2).to.not.exist

                const _user = await Users.findOne({ email })

                expect(_user).to.exist
                expect(_user.id).to.exist
                expect(_user.id).to.be.a('string')
                expect(_user.email).to.exist
                expect(_user.email).to.be.a('string')
                expect(_user.password).to.exist
                expect(_user.appData).to.be.a('array')
                expect(_user.appData.length).to.equal(2)
                expect(_user.appData[1].appId).to.equal(appData2.appId)
                expect(_user.appData[1].role).to.equal(appData2.role)
            })

            it('should fail on existing appData', async () => {
                try {
                    await logic.registerUserAppData(id, appData)
                    await logic.registerUserAppData(id, appData)

                    throw new Error('should not reach this point')
                } catch (error) {
                    expect(error).to.exist

                    expect(error).to.be.an.instanceOf(LogicError)

                    expect(error.message).to.equal(`app ${appData.appId} already registered for user: ${email}`)
                }

            })

            it('should fail on empty appId', async () => {

                const appData2= {appId:' ', role:'admin'}

                try {
                    await logic.registerUserAppData(id, appData2)

                    throw new Error('should not reach this point')
                } catch (error) {
                    expect(error).to.exist

                    expect(error).to.be.an.instanceOf(Error)

                    expect(error.message).to.equal(`appId is empty`)
                }

            })

        })

        describe('delete appData from an user', () => {

            beforeEach(async () => {
                _password = bcrypt.hashSync(password, 10)

                await Users.create({ email, password: _password, userData, appData })

                const users = await Users.find({email})

                id = users[0].id

                email = users[0].email
            })

            it('should succeed on correct appData deletion to an existing user', async () => {

                const response = await logic.deleteUserAppData(id, appData.appId)

                expect(response).to.not.exist

                const _user = await Users.findOne({ email })

                expect(_user).to.exist
                expect(_user.appData).to.be.a('array')
                expect(_user.appData.length).to.equal(0)
            })

            it('should fail on non existing appId', async () => {
                const badAppId = 'baddAppId'
                try {
                    await logic.deleteUserAppData(id, badAppId)

                    throw new Error('should not reach this point')
                } catch (error) {
                    expect(error).to.exist

                    expect(error).to.be.an.instanceOf(LogicError)

                    expect(error.message).to.equal(`app Id named ${badAppId} does not exist`)
                }

            })

            it('should fail on empty appId', async () => {

                const badAppId = ' '

                try {
                    await logic.deleteUserAppData(id, badAppId)

                    throw new Error('should not reach this point')
                } catch (error) {
                    expect(error).to.exist

                    expect(error).to.be.an.instanceOf(Error)

                    expect(error.message).to.equal(`appId is empty`)
                }

            })

            it('should fail on wrong user', async () => {
                const badId = 'non existing'
                try {
                    await logic.deleteUserAppData(badId, appData.appId)

                    throw new Error('should not reach this point')
                } catch (error) {
                    expect(error).to.exist

                    expect(error).to.be.an.instanceOf(Error)

                    expect(error.message).to.equal(`user does not exist`)
                }

            })

        })

        describe('retrieve all users', () => {
            let _email = ''
            let _password = ''

            let _appData = {
                appId: 'marcusonDB',
                role: 'god'
            }
            beforeEach(async () => {
                _email = `marcusontest-${Math.random()}@gmail.com`
                _password = bcrypt.hashSync(password, 10)

                await Users.create({ email: _email, password: _password, userData, appData: _appData })

                const users = await Users.find({email:_email})

                id = users[0].id

                email = users[0].email
            })

            it('should succeed on retrieving all users', async () => {

                const response = await logic.adminRetrieveAllUsers(id)

                expect(response).to.exist
                expect(response).to.be.a('array')

                expect(response[0].email).to.exist
                expect(response[0].password).to.not.exist
                expect(response[0].id).to.exist
                expect(response[0].userData).to.exist
                expect(response[0].appData).to.exist
            })

            it('should fail on retrieving all users cause user role is not the correct one', async () => {
                _email = `marcusontest-${Math.random()}@gmail.com`
                _appData.role = 'user'

                await Users.create({ email: _email, password: _password, userData, appData: _appData })

                const users = await Users.find({email:_email})

                id = users[0].id

                email = users[0].email

                try {
                    await logic.adminRetrieveAllUsers(id)

                    throw Error('should not reach this point')
                } catch (error) {
                    expect(error).to.exist
                    expect(error).to.be.an.instanceOf(LogicError)

                    expect(error.message).to.equal(`user with id ${id} does not have permisions to view all users`)
                }

            })

            it('should fail on retrieving all users cause user is not have registered the app marcusonDB ', async () => {
                _email = `marcusontest-${Math.random()}@gmail.com`
                _appData.appId = 'aRandomApp'

                await Users.create({ email: _email, password: _password, userData, appData: _appData })

                const users = await Users.find({email:_email})

                id = users[0].id

                email = users[0].email

                try {
                    await logic.adminRetrieveAllUsers(id)

                    throw Error('should not reach this point')
                } catch (error) {
                    expect(error).to.exist
                    expect(error).to.be.an.instanceOf(LogicError)

                    expect(error.message).to.equal(`user with id ${id} does not have permisions to view all users`)
                }

            })

        })

    })

    describe('apps', () => {
        let appId = ``
        let owner = 'testOwner'

        beforeEach(async () => {
            appId = `appTest${Math.random()}`
        })

        describe('register app', () => {
            it('should succeed on correct app registration with specific owner', async () => {

                const res = await logic.adminRegisterApp(appId, owner)

                expect(res).to.not.exist

                const _app = await Apps.findOne({ appId })

                expect(_app).to.exist
                expect(_app.appId).to.exist
                expect(_app.appId).to.be.a('string')
                expect(_app.owner).to.exist
                expect(_app.owner).to.be.a('string')
                expect(_app.owner).to.equal(owner)
            })

            it('should succeed on correct app registration with default owner', async () => {
                const res = await logic.adminRegisterApp(appId)

                expect(res).to.not.exist

                const _app = await Apps.findOne({ appId })

                expect(_app).to.exist
                expect(_app.appId).to.exist
                expect(_app.appId).to.be.a('string')
                expect(_app.appId).to.equal(appId)
                expect(_app.owner).to.exist
                expect(_app.owner).to.be.a('string')
                expect(_app.owner).to.equal('marcuson.dev')
            })

            it('should fail on retrying to register an app', async () => {
                await Apps.create({appId})
                try {
                    await logic.adminRegisterApp(appId, owner)

                    throw Error('should not reach this point')
                } catch (error) {
                    expect(error).to.exist
                    expect(error).to.be.an.instanceOf(LogicError)

                    expect(error.message).to.equal(`app with appId ${appId} already exists`)
                }
            })

            it('should fail on undefined app', () => {
                const appId = undefined

                expect(() => logic.adminRegisterApp(appId, owner)).to.throw(Error, `appId is not optional`)
            })

            it('should fail on null appId', () => {
                const appId = null

                expect(() => logic.adminRegisterApp(appId, owner)).to.throw(Error, `appId is not optional`)
            })

            it('should fail on empty appId', () => {
                const appId = ''

                expect(() => logic.adminRegisterApp(appId, owner)).to.throw(Error, 'appId is empty')
            })

            it('should fail on blank appId', () => {
                const appId = ' \t    \n'

                expect(() => logic.adminRegisterApp(appId, owner)).to.throw(Error, 'appId is empty')
            })
        })

        describe('delete app', () => {
            beforeEach(async () => {
                await Apps.create({ appId, owner })
                const apps = await Apps.find({appId})
                id = apps[0].id
            })

            it('should succeed on correct app deletion', async () => {

                const res = await logic.adminDeleteApp(id)

                expect(res).to.exist

                expect(res).to.equal('App succesfully deleted')

                const _app = await Apps.findOne({ appId })

                expect(_app).to.not.exist
            })

            it('should fail on unexisting app id', async () => {
                id = '01234567890123456789abcd'

                try {
                    await logic.adminDeleteApp(id)

                    throw new Error('should not reach this point')
                } catch (error) {
                    expect(error).to.exist

                    expect(error).to.be.an.instanceOf(LogicError)

                    expect(error.message).to.equal(`app with appId ${id} does not exist`)
                }
            })

            it('should fail on undefined id', () => {
                const id = undefined

                expect(() => logic.adminDeleteApp(id)).to.throw(Error, `id is not optional`)
            })

            it('should fail on null id', () => {
                const id = null

                expect(() => logic.adminDeleteApp(id)).to.throw(Error, `id is not optional`)
            })

            it('should fail on empty id', () => {
                const id = ''

                expect(() => logic.adminDeleteApp(id)).to.throw(Error, 'id is empty')
            })

            it('should fail on blank id', () => {
                const id = ' \t    \n'

                expect(() => logic.adminDeleteApp(id)).to.throw(Error, 'id is empty')
            })
        })

        describe('retrieve all apps', () => {
            let password = '1234567a'
            let userData = {
                name: 'Marc',
                surname: 'Uson',
                contact: {
                    tel: 123456789,
                    address1: 'test address 1',
                    address2: 'test adress 2',
                    city: 'TestCity',
                    province: 'Lleida',
                    postalCode: '9999',
                    country: 'Catalunya',
                }
            }
            let _email = ''
            let _password = ''

            let _appData = {
                appId: 'marcusonDB',
                role: 'god'
            }
            beforeEach(async () => {
                _email = `marcusontest-${Math.random()}@gmail.com`
                _password = bcrypt.hashSync(password, 10)

                await Users.create({ email: _email, password: _password, userData, appData: _appData })

                const users = await Users.find({email:_email})

                id = users[0].id

                email = users[0].email
            })

            it('should succeed on retrieving all apps', async () => {

                const response = await logic.adminRetrieveAllApps(id)

                expect(response).to.exist
                expect(response).to.be.a('array')

                expect(response[0].appId).to.exist
                expect(response[0].owner).to.exist
            })

            it('should fail on retrieving all users cause user role is not the correct one', async () => {
                _email = `marcusontest-${Math.random()}@gmail.com`
                _appData.role = 'user'

                await Users.create({ email: _email, password: _password, userData, appData: _appData })

                const users = await Users.find({email:_email})

                id = users[0].id

                email = users[0].email

                try {
                    await logic.adminRetrieveAllApps(id)

                    throw Error('should not reach this point')
                } catch (error) {
                    expect(error).to.exist
                    expect(error).to.be.an.instanceOf(LogicError)

                    expect(error.message).to.equal(`user with id ${id} does not have permisions to view all apps`)
                }

            })

            it('should fail on retrieving all users cause user is not have registered the app marcusonDB ', async () => {
                _email = `marcusontest-${Math.random()}@gmail.com`
                _appData.appId = 'aRandomApp'

                await Users.create({ email: _email, password: _password, userData, appData: _appData })

                const users = await Users.find({email:_email})

                id = users[0].id

                email = users[0].email

                try {
                    await logic.adminRetrieveAllApps(id)

                    throw Error('should not reach this point')
                } catch (error) {
                    expect(error).to.exist
                    expect(error).to.be.an.instanceOf(LogicError)

                    expect(error.message).to.equal(`user with id ${id} does not have permisions to view all apps`)
                }

            })

        })
    })

    after(async () => {
        mongoose.disconnect()
    })

})