import FuncionarioModelo from '../models/FuncionarioModelo.mjs'
const funcionarios ={
    async index(requisicao, resposta){
        const funcionarios = await FuncionarioModelo.obterTodosOsDados()
        resposta.render('funcionarios/index',{funcionarios})
    },
    async novoFormulario(requisicao, resposta){
       resposta.render('funcionarios/novo')
    },
    async criar(requisicao, resposta){
        const {nomeUsuario, senha, nomeCompleto, cargo, email} = requisicao.body
        await FuncionarioModelo.criarLivro({nomeUsuario, senha, nomeCompleto, cargo, email})
        resposta.redirect('funcionarios')
    },
    async mostrar(requisicao, resposta){},
    async edicaoFormulario(requisicao, resposta){},
    async atualizar(requisicao, resposta){
        const {nomeUsuario, nomeCompleto, cargo, email} = requisicao.body
        await FuncionarioModelo.criarLivro(
            requisicao.params.id,
            {nomeUsuario,  nomeCompleto, cargo, email}//dataCadastro
        )
        resposta.redirect('funcionarios')
    },
    async remover(requisicao, resposta){},
}
export default funcionarios