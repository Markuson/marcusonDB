import validate from '../utils/validate'
import call from '../utils/call'

const restApi = {

    __url__ : 'https://marcusondb-api.herokuapp.com/api',

    autenticateUser(email, password){
        validate.arguments([
            { name: 'email', value: email, type: 'string', notEmpty: true },
            { name: 'password', value: password, type: 'string', notEmpty: true },
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
                data: { email, password }
            })
            return response
        })()
    }


}

export default restApi