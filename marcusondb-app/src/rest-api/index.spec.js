import restApi from '.'
import { RequirementError, ValueError } from '../utils/errors'


describe('rest api', ()=>{
    describe('users', ()=>{
        const email = 'testuser@test.com'
        const password = "12345678a"

        describe('autenticate user', () => {


            it('should succeed on correct user credential', async () => {
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

    })