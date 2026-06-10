import express, { Router } from 'express'
import funcionarioControle from '../controllers/funcionarioControle.mjs'

const rota = express.Router()
rota.get('/', funcionarioControle.index) // Rota para a pagina inicial de livros
rota.get('/novo', funcionarioControle.novoFormulario) // Rota para o formulario de preenchimento de um novo livro
rota.post('/', funcionarioControle.criar) // Rota para a criação de do novo livro
rota.get('/:id', funcionarioControle.mostrar)
rota.get('/:id/editar', funcionarioControle.edicaoFormulario)
rota.post('/:id', funcionarioControle.atualizar) // Espera uma resposta
rota.post('/:id/deletar', funcionarioControle.remover)
export default rota