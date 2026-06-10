import pedidoModelo from '../models/pedidoModelo.mjs'
const pedidos = {
    async index(req, res){
        const pedidos = await pedidoModelo.obterTodosOsDados()
        await Promise.all( pedidos.map(async (pedido) =>{
            pedido.itens = await pedidoModelo.obterItensDoPedido(pedido.ID)
        }))
        res.render('pedido/index', {pedidos})
    },
    async remover(req, res){
    await pedidoModelo.remover(req.params.id)
    res.redirect('/pedidos')
    },
    async criar(req, res){
        const {funcionarioID, usuarioID, livrosUIDS, datasDevolucao} = req.body
        await pedidoModelo.criarPedido({funcionarioID, usuarioID, livrosUIDS, datasDevolucao})
        res.redirect('/pedidos')
    },
    async novoFormulario(req, res){
        const {funcionarios, livros, usuarios} = await pedidoModelo.obterDadosParaCriar()
        res.render('pedido/novo',{funcionarios, livros, usuarios})
    }
}
export default pedidos