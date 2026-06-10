import express from "express" // Direto e rapido
import ejs from "ejs"
import livroRotas from './routes/livro.mjs'
import funcionarioRotas from './routes/funcionario.mjs'
import expressLayouts from 'express-ejs-layouts' // Importando o express-ejs-layouts para usar layouts com EJS
import session from "express-session"
import crypto from 'node:crypto'

const app = express()
const PORTA = process.env.PORT || 3000
const SEGREDO = crypto.randomBytes(32).toString('hex') // Obtendo um código de sessão para manter o usuario conectado
 // Usa as rotas definidas de livros
app.listen(PORTA, () => {
  console.log(`Servidor está na rede http://127.0.0.1:${PORTA}`)
}) // Escuta na rede para acessar seu site
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(session({
  secret: SEGREDO,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 28800000, //8horas = 1000*60*60*8
  },
}))
app.use((req, res,proximo) => {
  res.locals.usuario = req.session.usuario || null
  proximo()
})
app.set('layout', 'fragmento/layout')
app.use(express.urlencoded({extended: true}))
app.use(express.static('./public'))

app.get("/", (requisicao,resposta) => {
  resposta.render('index')
})
import pedidoRotas from './routes/pedido.mjs'
app.use('/livros', livroRotas) // Usa as rotas definidas de livros
app.use('/funcionarios', funcionarioRotas)
app.use('/pedidos', pedidoRotas)

import logarRotas from './routes/logar.mjs'
app.use('/logar', logarRotas)
app.use((req, res, proximo) => {
  const erro = new Error('Página não encontrada')
  erro.status = 404
  proximo(erro)
})
app.use((erro, requisicao, resposta, proximo) => {
  const codigoDoErro = erro.status || 500
  resposta.status(codigoDoErro)
  resposta.render('error', {message:erro.message, status:codigoDoErro})
})