import logic from '.'
import restApi from '../rest-api'
import { RequirementError, ValueError } from '../utils/errors'


describe('logic', () => {
    describe('users', () => {
        let email = 'testuser@mail.com'
        const password = "12345678a"

        let appData = {
            appId: 'testAppId',
            role: 'owner'
        }

        describe('login user', () => {


            it('should succeed on correct user credential', async () => {
                const response = await logic.login(email, password)

                expect(response).toBe(undefined)

                expect(typeof logic.__userToken__).toBe('string')
                expect(logic.__userToken__.length).toBeGreaterThan(0)

            })

            it('should fail on non-existing user', async () => {
                const wrongEmail = 'unexisting-user@mail.com'
                try {
                    await logic.login(wrongEmail, password)
                    throw Error('should not reach this point')
                } catch (error) {
                    expect(error).toBeDefined()
                    expect(error.message).toBe(`user with email ${wrongEmail} does not exist`)
                }
            })

            it('should fail on undefined email', () => {
                const wrongEmail = undefined

                expect(() => logic.login(wrongEmail, password)).toThrowError(RequirementError, `email is not optional`)
            })

            it('should fail on null email', () => {
                const wrongEmail = null

                expect(() => logic.login(wrongEmail, password)).toThrowError(TypeError, `email is not optional`)
            })

            it('should fail on empty email', () => {
                const wrongEmail = ''

                expect(() => logic.login(wrongEmail, password)).toThrowError(ValueError, 'email is empty')
            })

            it('should fail on blank email', () => {
                const wrongEmail = ' \t    \n'

                expect(() => logic.login(wrongEmail, password)).toThrowError(ValueError, 'email is empty')
            })
            it('should fail on undefined password', () => {
                const password = undefined

                expect(() => logic.login(email, password)).toThrowError(RequirementError, `password is not optional`)
            })

            it('should fail on null password', () => {
                const password = null

                expect(() => logic.login(email, password)).toThrowError(TypeError, `password is not optional`)
            })

            it('should fail on empty password', () => {
                const password = ''

                expect(() => logic.login(email, password)).toThrowError(ValueError, 'password is empty')
            })

            it('should fail on blank password', () => {
                const password = ' \t    \n'

                expect(() => logic.login(email, password)).toThrowError(ValueError, 'password is empty')
            })
        })

        xdescribe('register user', () => {

            xit('should succeed on correct email and password registration without userData nor Appdata', async () => {

                const res = await logic.userRegister(email, password)

                expect(typeof res.message).toBe('string')
                expect(res.message).toBe('Ok, user registered.')
            })

            describe('already existing user', () => {


                it('should fail on retrying to register', async () => {

                    try {
                        const response = await logic.userRegister(email, password)
                        throw Error('should not reach this point')
                    } catch (error) {
                        expect(error).toBeDefined()
                        expect(error.message).toBe(`user with email ${email} already exists`)
                    }
                })
            })

            it('should fail on undefined email', () => {
                const email = undefined

                expect(() => logic.userRegister(email, password)).toThrow(Error(`email is not optional`))
            })

            it('should fail on null email', () => {
                const email = null

                expect(() => logic.userRegister(email, password)).toThrow(Error(`email ${email} is not a string`))
            })

            it('should fail on empty email', () => {
                const email = ''

                expect(() => logic.userRegister(email, password)).toThrow(Error('email is empty'))
            })

            it('should fail on blank email', () => {
                const email = ' \t    \n'

                expect(() => logic.userRegister(email, password)).toThrow(Error('email is empty'))
            })

            it('should fail on non-email email', () => {
                const nonEmail = 'non-email'

                expect(() => logic.userRegister(nonEmail, password)).toThrow(Error(`${nonEmail} is not an e-mail`))
            })

            it('should fail on short password length', () => {

                expect(() => logic.userRegister(email, '1234')).toThrow(Error(`Invalid password, the password must be between 8 and 16 characters and contain at least one number and one letter`))
            })

            it('should fail on weak password', () => {

                expect(() => logic.userRegister(email, '123456789')).toThrow(Error(`Invalid password, the password must be between 8 and 16 characters and contain at least one number and one letter`))
            })

            it('should fail on undefined password', () => {
                const password = undefined

                expect(() => logic.userRegister(email, password)).toThrow(Error(`password is not optional`))
            })

            it('should fail on null password', () => {
                const password = null

                expect(() => logic.userRegister(email, password)).toThrow(Error(`password ${password} is not a string`))
            })

            it('should fail on empty password', () => {
                const password = ''

                expect(() => logic.userRegister(email, password)).toThrow(Error('password is empty'))
            })

            it('should fail on blank password', () => {
                const password = ' \t    \n'

                expect(() => logic.userRegister(email, password)).toThrow(Error('password is empty'))
            })

        })

        describe('register appData to an user', () => {
            beforeEach(async () => {
                email = 'testuser@mail.com'
                await logic.login(email, password)
            })

            it('should succeed on correct appData registration to an existing user', async () => {
                appData.appId = `testapId${Math.floor(Math.random() * 999)}`
                const res = await logic.registerUserAppData(appData)

                expect(typeof res).toBe('string')
                expect(res).toBe(`app succesfully registered`)
            })

            it('should fail on existing appData', async () => {
                try {
                    await logic.registerUserAppData(appData)
                    await logic.registerUserAppData(appData)

                    throw new Error('should not reach this point')
                } catch (error) {
                    expect(error).toBeDefined()
                    expect(error.message).toBe(`app ${appData.appId} already registered for user: ${email}`)
                }

            })

            it('should fail on empty appId', async () => {

                const appData2 = { appId: ' ', role: 'admin' }

                try {
                    await logic.registerUserAppData(appData2)

                    throw new Error('should not reach this point')
                } catch (error) {
                    expect(error).toBeDefined()
                    expect(error.message).toBe(`appId is empty`)
                }

            })

        })

        describe('delete appData from an user', () => {
            beforeEach(async () => {
                email = 'testuser@mail.com'
                await logic.login(email, password)
            })

            it('should succeed on correct appData deletion to an existing user', async () => {

                let appData = {
                    appId:`testapId${Math.floor(Math.random() * 999)}`
                }
                await logic.registerUserAppData(appData)

                const response = await logic.deleteUserAppData(appData.appId)
                expect(response).toBeDefined()
                expect(response).toBe(`app ${appData.appId} succesfully deleted`)
            })

            it('should fail on non existing appId', async () => {
                const badAppId = 'baddAppId'
                try {
                    await logic.deleteUserAppData(badAppId)

                    throw new Error('should not reach this point')
                } catch (error) {
                    expect(error.message).toBe(`app Id named ${badAppId} does not exist`)
                }

            })

            it('should fail on empty appId', async () => {

                const badAppId = ' '

                try {
                    await logic.deleteUserAppData(badAppId)

                    throw new Error('should not reach this point')
                } catch (error) {
                    expect(error.message).toBe(`appId is empty`)
                }

            })

        })

        describe('retrieve all users', () => {
            beforeEach(async () => {
                email = 'testuser@mail.com'
                await logic.login(email, password)
            })

            it('should succeed on retrieving all users', async () => {

                const response = await logic.retrieveAllUsers()

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
                await logic.login(email,password)

                try {
                    await logic.retrieveAllUsers()
                    throw Error('should not reach this point')
                } catch (error) {
                    expect(error.message).toBe('your user does not have permisions to do that')
                }

            })
        })

        describe('admin actions', () => {
            beforeEach(async () => {
                email = 'testuser@mail.com'
                await logic.login(email, password)
            })

            describe('delete specific user by admin', () => {

                it('should succeed on deleting specific user', async () => {
                    let _email = "usertodelete@mail.com"
                    await logic.userRegister(_email, password)

                    const response = await logic.adminDeleteUser(_email)
                    expect(response).toBeDefined()
                    expect(typeof response.message).toBe('string')
                    expect(response.message).toBe(`Ok, user ${_email} deleted.`)
                })

                it('should fail on deleting a specific user cause user role is not the correct one', async () => {
                    let _email = "usertodelete@mail.com"
                    email = 'user@mail.com'
                await logic.login(email,password)

                try {
                    await logic.adminDeleteUser(_email)
                    throw Error('should not reach this point')
                } catch (error) {
                    expect(error.message).toBe('your user does not have permisions to do that')
                }

                })
            })

            describe('register a specific app to a specific user by admin', () => {
                let _email = 'specificuser@mail.com'

                it('should succeed on registering specific app to a specific user', async () => {
                    const response = await logic.adminRegisterUserAppData(_email, { appId: `${Math.floor(Math.random() * 200)}` })

                    expect(response).toBeDefined()
                    expect(typeof response.message).toBe('string')
                    expect(response.message).toBe(`Ok, app succesfully registered to user ${_email}.`)

                })

                it('should fail on registering a specific app to a specific user cause user role is not the correct one', async () => {
                    let __email = 'user@mail.com'
                    await logic.login(__email, password)

                    try {
                        await logic.adminRegisterUserAppData(_email, appData)
                        throw Error('should not reach this point')
                    } catch (error) {
                        expect(error.message).toBe('your user does not have permisions to do that')
                    }

                })

            })

            describe('delete a specific app to a specific user by admin', () => {
                let _email = 'specificuser@mail.com'
                it('should succeed on deleting specific app to a specific user', async () => {
                    let _appId = `${Math.floor(Math.random() * 200)}`
                    await logic.adminRegisterUserAppData(_email, { appId: _appId })

                    const response = await logic.adminDeleteUserAppData(_email, _appId)

                    expect(response).toBeDefined()
                    expect(typeof response.message).toBe('string')
                    expect(response.message).toBe(`Ok, app succesfully deleted to user ${_email}.`)
                })

                it('should fail on deleting a specific app to a specific user cause user role is not the correct one', async () => {
                    let _email = 'user@mail.com'
                    await logic.login(_email, password)
                    let _appId = `${Math.floor(Math.random() * 200)}`

                    try {
                        await logic.adminDeleteUserAppData(_email, _appId)
                        throw Error('should not reach this point')
                    } catch (error) {
                        expect(error.message).toBe('your user does not have permisions to do that')
                    }


                })
            })
        })
    })

    describe('apps', () => {
        let appId = ``
        let email = ''
        const password = "12345678a"

        describe('retrieve all apps', () => {

            beforeEach(async () => {
                email = 'testuser@mail.com'
                await logic.login(email, password)
            })

            it('should succeed on retrieving all apps', async () => {

                const response = await logic.adminRetrieveAllApps()
                expect(response).toBeDefined()
                expect(response.length).toBeGreaterThan(0)

                expect(response[0].appId).toBeDefined()
                expect(response[0].owner).toBeDefined()
            })

            it('should fail on retrieving all users cause user role is not the correct one', async () => {
                let _email = `user@mail.com`
                await logic.login(_email, password)

                try {
                    await logic.adminRetrieveAllApps()

                    throw Error('should not reach this point')
                } catch (error) {
                    expect(error).toBeDefined()
                    expect(error.message).toBe('your user does not have permisions to do that')
                }

            })

            it('should fail on retrieving all users cause user is not have registered the app marcusonDB ', async () => {

                try {
                    await logic.login('user2@mail.com', '12345678m')

                    throw Error('should not reach this point')
                } catch (error) {
                    expect(error).toBeDefined()
                    expect(error.message).toBe('user with email user2@mail.com does not exist')
                }

            })

        })

        describe('register app', () => {

            let appId = `testapp${Math.floor(Math.random()*1000)}`
            let owner = 'testOwner'
            const password = "12345678a"
            let email = 'testuser@mail.com'

            beforeAll(async () => {
                await logic.login(email, password)
            })

            it('should succeed on correct app registration with specific owner', async () => {

                const response = await logic.adminRetrieveAllApps()
                const res = await logic.appRegister(appId, owner)
                const response2 = await logic.adminRetrieveAllApps()
                expect(res).toBeDefined()
                expect(res).toBe('app succesfully registered')
                expect(response2.length).toBe(response.length + 1 )
            })

            it('should succeed on correct app registration with default owner', async () => {
                appId = `testapp${Math.floor(Math.random()*100)}`
                const response = await logic.adminRetrieveAllApps()
                const res = await logic.appRegister(appId)
                const response2 = await logic.adminRetrieveAllApps()
                expect(res).toBeDefined()
                expect(res).toBe('app succesfully registered')
                expect(response2.length).toBe(response.length + 1 )
            })

            it('should fail on retrying to register an app', async () => {
                try {
                    await logic.appRegister(appId)

                    throw Error('should not reach this point')
                } catch (error) {
                    expect(error).toBeDefined()
                    expect(error.message).toBe(`app with appId ${appId} already exists`)
                }
            })

            it('should fail on undefined app', () => {
                const appId = undefined

                expect(() => logic.appRegister(appId, owner)).toThrowError(`appId is not optional`)
            })

            it('should fail on null appId', () => {
                const appId = null

                expect(() => logic.appRegister(appId, owner)).toThrowError(`appId null is not a string`)
            })

            it('should fail on empty appId', () => {
                const appId = ''

                expect(() => logic.appRegister(appId, owner)).toThrowError('appId is empty')
            })

            it('should fail on blank appId', () => {
                const appId = ' \t    \n'

                expect(() => logic.appRegister(appId, owner)).toThrowError('appId is empty')
            })
        })

        describe('delete app', () => {
            let appId = `testapp${Math.floor(Math.random()*1000)}`
            let owner = 'testOwner'
            const password = "12345678a"
            let email = 'testuser@mail.com'

            beforeAll(async () => {
                const response = await logic.login(email, password)
                await logic.appRegister(appId, owner)
            })

            it('should succeed on correct app deletion', async () => {
                const response = await logic.adminRetrieveAllApps()
                const res = await logic.appDelete(appId)
                const response2 = await logic.adminRetrieveAllApps()
                expect(res).toBeDefined()
                expect(res.message).toBe('Ok, app deleted.')
                expect(response2.length).toBe(response.length - 1 )
            })

            it('should fail on unexisting app id', async () => {
                let id = '01234567890123456789abcd'

                try {
                    await logic.appDelete(id)

                    throw new Error('should not reach this point')
                } catch (error) {
                    expect(error).toBeDefined()
                    expect(error.message).toBe(`app with appId ${id} does not exist`)
                }
            })

            it('should fail on undefined id', () => {
                const id = undefined

                expect(() => logic.appDelete(id)).toThrowError(`appId is not optional`)
            })

            it('should fail on null id', () => {
                const id = null

                expect(() => logic.appDelete(id)).toThrowError(`appId null is not a string`)
            })

            it('should fail on empty id', () => {
                const id = ''

                expect(() => logic.appDelete(id)).toThrowError('appId is empty')
            })

            it('should fail on blank id', () => {
                const id = ' \t    \n'

                expect(() => logic.appDelete(id)).toThrowError('appId is empty')
            })
        })
    })


})