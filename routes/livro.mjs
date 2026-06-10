import express, { Router } from 'express'
import livroControle from '../controllers/livroControle.mjs'
import multer from 'multer'
import path from 'path'
import { garantirEntradaNaRota } from '../middlewares/loginApp.mjs'
const rota = express.Router()

const armazenamento = multer.diskStorage({
    destination(req, arquivo, callback){
        callback(null,'./public/uploads/')
    },
    filename(req,arquivo, callback){
        const nomeArquivo = path.extname(arquivo.originalname)
        callback(null, `${Date.now()}${nomeArquivo}`)
    }
})
const upload = multer({storage: armazenamento})
rota.use(garantirEntradaNaRota)
rota.get('/', livroControle.index) // Rota para a pagina inicial de livros
rota.get('/novo', livroControle.novoFormulario) // Rota para o formulario de preenchimento de um novo livro
rota.post('/', upload.single('imagem'), livroControle.criar) // Rota para a criação de do novo livro
rota.get('/:uid', livroControle.mostrar)
rota.get('/:uid/editar', livroControle.edicaoFormulario)
rota.post('/:uid',upload.single('imagem'), livroControle.atualizar) // Espera uma resposta
rota.post('/:uid/deletar', livroControle.remover)
export default rota