import restApi from '.'
import { RequirementError, ValueError } from '../utils/errors'


xdescribe('rest api', () => {
    describe('users', () => {
        let email = ``
        const password = "12345678a"

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
            role: 'owner'
        }

        beforeEach(async () => {
            email = `marcusontest${Math.random()}@gmail.com`
        })

        xdescribe('register user', () => {

            it('should succeed on correct email and password registration without userData nor Appdata', async () => {

                const res = await restApi.registerUser(email, password)

                expect(typeof res.message).toBe('string')
                expect(res.message).toBe('Ok, user registered.')
            })

            describe('already existing user', () => {


                it('should fail on retrying to register', async () => {
                    await restApi.registerUser(email, password)

                    try {
                        const response = await restApi.registerUser(email, password)
                        throw Error('should not reach this point')
                    } catch (error) {
                        expect(error).toBeDefined()
                        expect(error).toBe(`user with email ${email} already exists`)
                    }
                })
            })

            xit('should fail on undefined email', () => {
                const email = undefined

                expect(() => restApi.registerUser(email, password)).toThrowError(`email is not optional`)
            })

            xit('should fail on null email', () => {
                const email = null

                expect(() => restApi.registerUser(email, password)).toThrowError(`email is not optional`)
            })

            xit('should fail on empty email', () => {
                const email = ''

                expect(() => restApi.registerUser(email, password)).toThrowError('email is empty')
            })

            xit('should fail on blank email', () => {
                const email = ' \t    \n'

                expect(() => restApi.registerUser(email, password)).toThrowError('email is empty')
            })

            xit('should fail on non-email email', () => {
                const nonEmail = 'non-email'

                expect(() => restApi.registerUser(nonEmail, password)).toThrowError(`${nonEmail} is not an e-mail`)
            })

            xit('should fail on short password length', () => {

                expect(() => restApi.registerUser(email, '1234')).toThrowError(`Invalid password, the password must be between 8 and 16 characters and contain at least one number and one letter`)
            })

            xit('should fail on weak password', () => {

                expect(() => restApi.registerUser(email, '123456789')).toThrowError(`Invalid password, the password must be between 8 and 16 characters and contain at least one number and one letter`)
            })

            xit('should fail on undefined password', () => {
                const password = undefined

                expect(() => restApi.registerUser(email, password)).toThrowError(`password is not optional`)
            })

            xit('should fail on null password', () => {
                const password = null

                expect(() => restApi.registerUser(email, password)).toThrowError(`password is not optional`)
            })

            xit('should fail on empty password', () => {
                const password = ''

                expect(() => restApi.registerUser(email, password)).toThrowError('password is empty')
            })

            xit('should fail on blank password', () => {
                const password = ' \t    \n'

                expect(() => restApi.registerUser(email, password)).toThrowError('password is empty')
            })

        })

        describe('autenticate user', () => {

            it('should succeed on correct user credential', async () => {
                email = 'testuser@mail.com'
                const response = await restApi.autenticateUser(email, password)

                const { token } = response

                expect(typeof token).toBe('string')
                expect(token.length).toBeGreaterThan(0)
            })

            it('should fail on non-existing user', async () => {
                const wrongEmail = 'unexisting-user@mail.com'
                try {
                    await restApi.autenticateUser(wrongEmail, password)
                    throw Error('should not reach this point')
                } catch (error) {
                    expect(error).toBeDefined()
                    expect(error).toBe(`user with email ${wrongEmail} does not exist`)
                }
            })

            it('should fail on undefined email', () => {
                const wrongEmail = undefined

                expect(() => restApi.autenticateUser(wrongEmail, password)).toThrowError(RequirementError, `email is not optional`)
            })

            it('should fail on null email', () => {
                const wrongEmail = null

                expect(() => restApi.autenticateUser(wrongEmail, password)).toThrowError(TypeError, `email is not optional`)
            })

            it('should fail on empty email', () => {
                const wrongEmail = ''

                expect(() => restApi.autenticateUser(wrongEmail, password)).toThrowError(ValueError, 'email is empty')
            })

            it('should fail on blank email', () => {
                const wrongEmail = ' \t    \n'

                expect(() => restApi.autenticateUser(wrongEmail, password)).toThrowError(ValueError, 'email is empty')
            })
            it('should fail on undefined password', () => {
                const password = undefined

                expect(() => restApi.autenticateUser(email, password)).toThrowError(RequirementError, `password is not optional`)
            })

            it('should fail on null password', () => {
                const password = null

                expect(() => restApi.autenticateUser(email, password)).toThrowError(TypeError, `password is not optional`)
            })

            it('should fail on empty password', () => {
                const password = ''

                expect(() => restApi.autenticateUser(email, password)).toThrowError(ValueError, 'password is empty')
            })

            it('should fail on blank password', () => {
                const password = ' \t    \n'

                expect(() => restApi.autenticateUser(email, password)).toThrowError(ValueError, 'password is empty')
            })
        })

        describe('register appData to an user', () => {
            let token = ''
            beforeEach(async () => {

                email = 'testuser@mail.com'
                const response = await restApi.autenticateUser(email, password)
                token = response.token
            })

            it('should succeed on correct appData registration to an existing user', async () => {
                appData.appId = `testapId${Math.floor(Math.random() * 999)}`
                const res = await restApi.registerUserAppData(token, appData)

                expect(typeof res.message).toBe('string')
                expect(res.message).toBe(`Ok, App data added.`)
            })

            it('should succeed on correct appData without role registration to an existing user', async () => {
                appData.appId = `testapId${Math.floor(Math.random() * 999)}`
                const res = await restApi.registerUserAppData(token, { appId: appData.appId })

                expect(typeof res.message).toBe('string')
                expect(res.message).toBe(`Ok, App data added.`)
            })

            it('should fail on existing appData', async () => {
                try {
                    await restApi.registerUserAppData(token, appData)
                    await restApi.registerUserAppData(token, appData)

                    throw new Error('should not reach this point')
                } catch (error) {
                    expect(error).toBeDefined()
                    expect(error).toBe(`app ${appData.appId} already registered for user: ${email}`)
                }

            })

            it('should fail on empty appId', async () => {

                const appData2 = { appId: ' ', role: 'admin' }

                try {
                    await restApi.registerUserAppData(token, appData2)

                    throw new Error('should not reach this point')
                } catch (error) {
                    expect(error).toBeDefined()
                    expect(error).toBe(`appId is empty`)
                }

            })

        })

        describe('delete appData from an user', () => {
            let token = ''
            beforeEach(async () => {
                email = 'testuser@mail.com'
                const response = await restApi.autenticateUser(email, password)
                token = response.token
                appData.appId = `testapId${Math.floor(Math.random() * 999)}`
                await restApi.registerUserAppData(token, appData)
            })

            it('should succeed on correct appData deletion to an existing user', async () => {
                const response = await restApi.deleteUserAppData(token, appData.appId)
                expect(response).toBeDefined()
            })

            it('should fail on non existing appId', async () => {
                const badAppId = 'baddAppId'
                try {
                    await restApi.deleteUserAppData(token, badAppId)

                    throw new Error('should not reach this point')
                } catch (error) {
                    expect(error).toBe(`app Id named ${badAppId} does not exist`)
                }

            })

            it('should fail on empty appId', async () => {

                const badAppId = ' '

                try {
                    await restApi.deleteUserAppData(token, badAppId)

                    throw new Error('should not reach this point')
                } catch (error) {
                    expect(error.message).toBe(`appId is empty`)
                }

            })

            it('should fail on wrong user', async () => {
                const badId = 'non existing'
                try {
                    await restApi.deleteUserAppData(badId, appData.appId)

                    throw new Error('should not reach this point')
                } catch (error) {
                    expect(error).toBe(`jwt malformed`)
                }

            })

        })

        describe('retrieve all users', () => {
            let token = ''
            beforeEach(async () => {

                email = 'testuser@mail.com'
                const response = await restApi.autenticateUser(email, password)
                token = response.token
            })

            it('should succeed on retrieving all users', async () => {

                const response = await restApi.retrieveAllUsers(token)

                expect(response).toBeDefined()
                // expect(typeof response).toBe('array')
                expect(response.length).toBeGreaterThan(1)

                expect(response[0].email).toBeDefined()
                expect(response[0].password).toBeUndefined()
                expect(response[0].id).toBeDefined()
                expect(response[0].userData).toBeDefined()
                expect(response[0].appData).toBeDefined()
                expect(response[1].email).toBeDefined()
                expect(response[1].password).toBeUndefined()
                expect(response[1].id).toBeDefined()
                expect(response[1].userData).toBeDefined()
                expect(response[1].appData).toBeDefined()
            })

            it('should fail on retrieving all users cause user role is not the correct one', async () => {
                email = 'user@mail.com'
                const response = await restApi.autenticateUser(email, password)
                token = response.token

                try {
                    await restApi.retrieveAllUsers(token)

                    throw Error('should not reach this point')
                } catch (error) {
                    expect(error).toBeDefined()
                }

            })
        })

        describe('admin actions', () => {
            let token = ''

            beforeEach(async () => {

                email = 'testuser@mail.com'
                const response = await restApi.autenticateUser(email, password)
                token = response.token
            })


            describe('delete specific user by admin', () => {

                it('should succeed on deleting specific user', async () => {
                    let _email = "usertodelete@mail.com"
                    await restApi.registerUser(_email, password)

                    const response = await restApi.adminDeleteUser(token, _email)
                    expect(response).toBeDefined()
                    expect(typeof response.message).toBe('string')
                    expect(response.message).toBe(`Ok, user ${_email} deleted.`)
                })

                it('should fail on deleting a specific user cause user role is not the correct one', async () => {

                    let _email = 'user5@mail.com'

                    try {

                        const response = await restApi.adminDeleteUser(token, _email)

                        throw Error('should not reach this point')
                    } catch (error) {
                        expect(error).toBeDefined()
                    }

                })
            })

            describe('register a specific app to a specific user by admin', () => {
                let token = ''
                beforeEach(async () => {

                    email = 'testuser@mail.com'
                    const response = await restApi.autenticateUser(email, password)
                    token = response.token
                })
                it('should succeed on registering specific app to a specific user', async () => {

                    let _email = 'specificuser@mail.com'

                    // await restApi.registerUser(_email, password)

                    const response = await restApi.adminRegisterUserAppData(token, _email, { appId: `${Math.floor(Math.random() * 200)}` })

                    expect(response).toBeDefined()
                    expect(typeof response.message).toBe('string')
                    expect(response.message).toBe(`Ok, app succesfully registered to user ${_email}.`)

                })

                it('should fail on registering a specific app to a specific user cause user role is not the correct one', async () => {
                    let _email = 'user@mail.com'
                    const response = await restApi.autenticateUser(_email, password)
                    token = response.token

                    try {

                        await restApi.adminRegisterUserAppData(token, email, appData)

                        throw Error('should not reach this point')
                    } catch (error) {
                        expect(error).toBeDefined()
                        expect(typeof error).toBe('string')
                    }

                })

            })

            describe('delete a specific app to a specific user by admin', () => {
                it('should succeed on deleting specific app to a specific user', async () => {
                    let _email = 'specificuser@mail.com'
                    let _appId = `${Math.floor(Math.random() * 200)}`
                    await restApi.adminRegisterUserAppData(token, _email, { appId: _appId })

                    const response = await restApi.adminDeleteUserAppData(token, _email, _appId)

                    expect(response).toBeDefined()
                    expect(typeof response.message).toBe('string')
                    expect(response.message).toBe(`Ok, app succesfully deleted to user ${_email}.`)
                })

                it('should fail on deleting a specific app to a specific user cause user role is not the correct one', async () => {
                    let _email = 'user@mail.com'
                    const response = await restApi.autenticateUser(_email, password)
                    token = response.token

                    try {

                        await restApi.adminDeleteUserAppData(token, email, appData)

                        throw Error('should not reach this point')
                    } catch (error) {
                        expect(error).toBeDefined()
                        expect(typeof error.message).toBe('string')
                    }

                })
            })
        })

    })

    describe('apps', () => {
        let appId = ``
        let email = ''
        let token = ''
        const password = "12345678a"

        describe('retrieve all apps', () => {

            beforeEach(async () => {
                email = 'testuser@mail.com'
                const response = await restApi.autenticateUser(email, password)
                token = response.token
            })

            it('should succeed on retrieving all apps', async () => {

                const response = await restApi.adminRetrieveAllApps(token)
                expect(response).toBeDefined()
                expect(response.length).toBeGreaterThan(0)

                expect(response[0].appId).toBeDefined()
                expect(response[0].owner).toBeDefined()
            })

            it('should fail on retrieving all users cause user role is not the correct one', async () => {
                let _email = `user@mail.com`
                const response = await restApi.autenticateUser(_email, password)
                token = response.token

                try {
                    await restApi.adminRetrieveAllApps(token)

                    throw Error('should not reach this point')
                } catch (error) {
                    expect(error).toBeDefined()
                    expect(error.length).toBeGreaterThan(0)
                }

            })

            it('should fail on retrieving all users cause user is not have registered the app marcusonDB ', async () => {

                try {
                    await restApi.autenticateUser('user2@mail.com', '12345678m')

                    throw Error('should not reach this point')
                } catch (error) {
                    expect(error).toBeDefined()
                    expect(error).toBe('user with email user2@mail.com does not exist')
                }

            })

        })

        describe('register app', () => {

            let appId = `testapp${Math.floor(Math.random()*1000)}`
            let owner = 'testOwner'
            const password = "12345678a"
            let email = 'testuser@mail.com'
            let token = ''

            beforeAll(async () => {
                const response = await restApi.autenticateUser(email, password)
                token = response.token
            })

            it('should succeed on correct app registration with specific owner', async () => {

                const response = await restApi.adminRetrieveAllApps(token)
                const res = await restApi.registerApp(appId, owner)
                const response2 = await restApi.adminRetrieveAllApps(token)
                expect(res).toBeDefined()
                expect(res.message).toBe('Ok, app registered.')
                expect(response2.length).toBe(response.length + 1 )
            })

            it('should succeed on correct app registration with default owner', async () => {
                appId = `testapp${Math.floor(Math.random()*100)}`
                const response = await restApi.adminRetrieveAllApps(token)
                const res = await restApi.registerApp(appId)
                const response2 = await restApi.adminRetrieveAllApps(token)
                expect(res).toBeDefined()
                expect(res.message).toBe('Ok, app registered.')
                expect(response2.length).toBe(response.length + 1 )
            })

            it('should fail on retrying to register an app', async () => {
                try {
                    await restApi.registerApp(appId)

                    throw Error('should not reach this point')
                } catch (error) {
                    expect(error).toBeDefined()
                    expect(error).toBe(`app with appId ${appId} already exists`)
                }
            })

            it('should fail on undefined app', () => {
                const appId = undefined

                expect(() => restApi.registerApp(appId, owner)).toThrowError(`appId is not optional`)
            })

            it('should fail on null appId', () => {
                const appId = null

                expect(() => restApi.registerApp(appId, owner)).toThrowError(`appId null is not a string`)
            })

            it('should fail on empty appId', () => {
                const appId = ''

                expect(() => restApi.registerApp(appId, owner)).toThrowError('appId is empty')
            })

            it('should fail on blank appId', () => {
                const appId = ' \t    \n'

                expect(() => restApi.registerApp(appId, owner)).toThrowError('appId is empty')
            })
        })

        describe('delete app', () => {
            let appId = `testapp${Math.floor(Math.random()*1000)}`
            let owner = 'testOwner'
            const password = "12345678a"
            let email = 'testuser@mail.com'
            let token = ''

            beforeAll(async () => {
                const response = await restApi.autenticateUser(email, password)
                token = response.token
                await restApi.registerApp(appId, owner)
            })

            it('should succeed on correct app deletion', async () => {
                const response = await restApi.adminRetrieveAllApps(token)
                const res = await restApi.deleteApp(token, appId)
                const response2 = await restApi.adminRetrieveAllApps(token)
                expect(res).toBeDefined()
                expect(res.message).toBe('Ok, app deleted.')
                expect(response2.length).toBe(response.length - 1 )
            })

            it('should fail on unexisting app id', async () => {
                let id = '01234567890123456789abcd'

                try {
                    await restApi.deleteApp(token, id)

                    throw new Error('should not reach this point')
                } catch (error) {
                    expect(error).toBeDefined()
                    expect(error).toBe(`app with appId ${id} does not exist`)
                }
            })

            it('should fail on undefined id', () => {
                const id = undefined

                expect(() => restApi.deleteApp(id)).toThrowError(`appId is not optional`)
            })

            it('should fail on null id', () => {
                const id = null

                expect(() => restApi.deleteApp(id)).toThrowError(`appId is not optional`)
            })

            it('should fail on empty id', () => {
                const id = ''

                expect(() => restApi.deleteApp(id)).toThrowError('appId is not optional')
            })

            it('should fail on blank id', () => {
                const id = ' \t    \n'

                expect(() => restApi.deleteApp(id)).toThrowError('appId is not optional')
            })
        })
    })

})