import LivroModelo from '../models/livroModelo.mjs'
const livros = { // Com base na modelagem, vamos utilizar nas nossas rotas
    async index(requisicao,resposta){ // Página inicial de livros
        const termo = requisicao.query.q ? requisicao.query.q.trim() : null 
        const livros = termo ? await LivroModelo.buscar(termo) : await LivroModelo.obterTodosOsDados()
        resposta.render('livros/index', {livros, termo}) // Renderiza a página com os livros
    },
    async criar(requisicao,resposta){
        const {titulo,genero,autor,editora,ISBN,quantidade,dataPublicacao} = requisicao.body
        const imagem = requisicao.file ? `/uploads/${requisicao.file.filename}` : null
        await LivroModelo.criarLivro({titulo,genero,autor,editora,ISBN,quantidade,dataPublicacao,imagem})
        resposta.redirect('livros')
    },
    async atualizar(requisicao, resposta){
    const {titulo,genero,autor,editora,ISBN,quantidade,dataPublicacao} = requisicao.body
    const livroAtual = await LivroModelo.obterPeloUID(requisicao.params.uid)
    const imagem = requisicao.file ?  `/uploads/${requisicao.file.filename}` : livroAtual.imagem ?? null
    await LivroModelo.editar(requisicao.params.uid,
         {titulo,genero,autor,editora,ISBN,quantidade,dataPublicacao,imagem})
     resposta.redirect('/livros')
    },
    novoFormulario(requisicao,resposta){
        resposta.render('livros/novo')
    },
    async mostrar(requisicao,resposta){
        const livro = await LivroModelo.obterPeloUID(requisicao.params.uid)
        if(!livro) return resposta.status(404).send('Livro não encontrado')
        resposta.render('livros/mostrar', {livro})
    },
    async edicaoFormulario(requisicao, resposta){
        const livro = await LivroModelo.obterPeloUID(requisicao.params.uid)
        if(!livro) return resposta.status(404).send('Livro não encontrado')
        resposta.render('livros/editar', {livro})
    },
    async remover(requisicao,resposta){
        await LivroModelo.remover(requisicao.params.uid)
        resposta.redirect('/livros')
    }
}

export default livros