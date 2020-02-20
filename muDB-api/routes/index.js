const express = require('express')
const logic = require('../logic')
const bodyParser = require('body-parser')
const handleErrors = require('./handle-errors')
const jwt = require('jsonwebtoken')
const auth = require('./auth')

const { env: { JWT_SECRET } } = process

const jsonParser = bodyParser.json()

const router = express.Router()

router.post('/user/register', jsonParser, (req, res) => {
    const { body: { name, surname, email, password, admin } } = req

    handleErrors(async () => {
        await logic.registerUser(name, surname, email, password, admin)
        res.status(201).json({ message: 'Ok, user registered.' })
    }, res)
})

router.post('/user/auth', jsonParser, (req, res) => {
    const { body: { email, password } } = req

    handleErrors(async () => {
        const sub = await logic.authenticateUser(email, password)
        const token = jwt.sign({ sub }, JWT_SECRET, { expiresIn: '24h' })
        res.status(202).json({ token })
    }, res)
})

router.get('/user', auth, (req, res) => {
    const { userId } = req

    handleErrors(async () => {
        const user = await logic.retrieveUser(userId)
        res.status(202).json(user)
    }, res)
})

router.put('/user', auth, jsonParser, (req, res) => {
    const { userId, body: { data } } = req

    handleErrors(async () => {
        await logic.updateUser(userId, data)
        res.status(202).json({ message: 'Ok, user data updated.' })
    }, res)
})

router.delete('/user', auth, (req, res) => {
    const { userId } = req

    handleErrors(async () => {
        await logic.deleteUser(userId)
        res.status(204).json({ message: 'Ok, user deleted.' })
    }, res)
})

module.exports = router