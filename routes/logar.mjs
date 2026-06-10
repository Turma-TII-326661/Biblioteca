import express from 'express'
import logarControle from '../controllers/logarControle.mjs'

const rota = express.Router()

rota.get('/login', logarControle.login)
rota.post('/login', logarControle.processarLogin)
rota.get('/logout', logarControle.logout)
rota.get('/callback', (req, res) => res.redirect('/logar/login'))

export default rota