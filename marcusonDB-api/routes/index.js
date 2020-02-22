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
    const { body: { email, password, userData, appData } } = req

    handleErrors(async () => {
        await logic.registerUser(email, password, userData, appData)
        res.status(201).json({ message: 'Ok, user registered.' })
    }, res)
})

router.post('/user', jsonParser, (req, res) => {
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

router.post('/user/appdata', auth, jsonParser, (req, res) => {
    const { userId, body: { data: {appData} } } = req

    handleErrors(async () => {
        await logic.registerUserAppData(userId, appData)
        res.status(201).json({ message: 'Ok, App data added.' })
    }, res)
})

router.put('/user/appdata', auth, jsonParser, (req, res) => {
    const { userId, body: { appId } } = req

    handleErrors(async () => {
        await logic.deleteUserAppData(userId, appId)
        res.status(204).json({ message: 'Ok, App deleted.' })
    }, res)
})

module.exports = router