import { ValueError, RequirementError, FormatError } from '../errors'

const validate = {
    arguments(args) {
        args.forEach(({ name, value, type, notEmpty, optional }) => {
            if (value !== undefined) {
                if (typeof value !== type) throw TypeError(`${name} ${value} is not a ${type}`)

                if (notEmpty)
                    if (type === 'string') {
                        if (!value.trim().length) throw new ValueError(`${name} is empty`)
                    } else if (type === 'object')
                        if (!Object.keys(value).length) throw new ValueError(`${name} is empty`)
            } else if (!optional) throw new RequirementError(`${name} is not optional`)
        })
    },

    email(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line

        if (!re.test(String(email))) throw new FormatError(`${email} is not an e-mail`)
    },

    password(pass) {
        const re = /^(?=.*\d)(?=.*[a-zA-Z])([^\s]){8,16}$/

        if (!re.test(String(pass))) throw new FormatError(`Invalid password, the password must be between 8 and 16 characters and contain at least one number and one letter`)
    },

    url(url) {
        const re = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/ // eslint-disable-line

        if (!re.test(String(url))) throw new FormatError(`${url} is not a url`)
    },
}

export default validate