import FuncionarioModelo from "../models/FuncionarioModelo.mjs"
import crypto from 'node:crypto'

const tokens = new Map()
const DURACAO = 1000*60*30
function limparTokensExpirados(){
    const agora = Date.now()
    for(const [token, dados] of tokens.entries()) tokens.delete(token)
}
const logarControle = {
    
    async processarLogin(req, res){
        const {nomeUsuario, senha} = req.body
        if(!nomeUsuario || !senha) return res.status(400).render('logar/login',{erro: 'Informe suas credencias'})
        const funcionario = await FuncionarioModelo.autenticar(nomeUsuario,senha)
        if (funcionario === null) return res.status(401).render('logar/login', {erro : 'Credenciais erradas.'})
        req.session.usuario = {
            id: funcionario.id,
            nome: funcionario.nomeCompleto,
            email: funcionario.email,
            cargo: funcionario.cargo,
            provider : 'local',
        }
        return req.session.save(() => res.redirect('/'))
    },
    async logout(req,res){
        return req.session.destroy(erro => {
            if (erro) return res.status(500).send('Erro ao fechar a sessão')
            res.clearCookie('connect.sid')
            return res.redirect('/')
        })
    },
    async login(req, res){
        if (req.session?.usuario) return res.redirect('/')
        return res.render('logar/login', {erro: null, sucesso: null})
    },
}
export default logarControle