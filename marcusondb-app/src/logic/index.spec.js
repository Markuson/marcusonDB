import logic from '.'
import { RequirementError, ValueError } from '../utils/errors'


describe('rest api', ()=>{
    describe('users', ()=>{
        const email = 'testuser@test.com'
        const password = "12345678a"

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

    })