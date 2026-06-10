import mssql from 'mssql'
import { conectar } from '../config/db.mjs'

class LivroModelo{
    
    static async obterTodosOsDados(){
        await conectar()
        const resultado = await mssql.query('SELECT * FROM Livros') // Chamando nossos dados
        return resultado.recordset // Retornando os dados para a aplicação
    }
    static async buscar(termo){
        await conectar()
        const req = new mssql.Request()
        req.input('termo', mssql.VarChar(mssql.MAX), `%${termo}%`)
        const res = await req.query('SELECT * FROM Livros WHERE titulo LIKE @termo')
        return res.recordset
    }
    static async criarLivro({titulo,genero,autor,editora,ISBN,quantidade,dataPublicacao, imagem}){
        await conectar() // Garanti que a tabela exista
        const requisicao = new mssql.Request() // Faz uma requisição ao banco de dados
        requisicao.input('titulo', mssql.VarChar(mssql.MAX), titulo) // Prepara para a inserção no BD
        requisicao.input('genero', mssql.VarChar(100), genero)
        requisicao.input('autor', mssql.VarChar(mssql.MAX), autor)
        requisicao.input('editora', mssql.VarChar(mssql.MAX), editora)
        requisicao.input('ISBN', mssql.Int, ISBN)
        requisicao.input('quantidade',mssql.Int, quantidade)
        requisicao.input('dataPublicacao', mssql.DateTime, dataPublicacao)
        requisicao.input('imagem', mssql.VarChar(mssql.MAX), imagem)

        const resultado = await requisicao.query(`
            INSERT INTO Livros (titulo,genero,autor,editora,ISBN,quantidade,dataPublicacao, imagem)
            OUTPUT INSERTED.uid
            VALUES(@titulo,@genero,@autor,@editora,@ISBN,@quantidade,@dataPublicacao,@imagem)
            `)
        const uid = resultado.recordset[0].uid // Retorna o ID unico
        return {uid, titulo, genero, autor, editora, ISBN: Number(ISBN),
             quantidade: Number(quantidade), dataPublicacao: Date(dataPublicacao), imagem}
    }
    static async obterPeloUID(uid){
        await conectar()
        const requisicao = new mssql.Request()
        requisicao.input('uid', mssql.UniqueIdentifier,uid)
    const resultado = await requisicao.query('SELECT * FROM Livros WHERE uid = @uid')
        return resultado.recordset[0]
    }
    static async editar(uid, {titulo,genero,autor,editora,ISBN,quantidade,dataPublicacao,imagem}){
        await conectar()
        const requisicao = new mssql.Request() // Faz uma requisição ao banco de dados
        requisicao.input('uid',mssql.UniqueIdentifier,uid) // Preciso do ID
        requisicao.input('titulo', mssql.VarChar(mssql.MAX), titulo)
        requisicao.input('genero', mssql.VarChar(100), genero)
        requisicao.input('autor', mssql.VarChar(mssql.MAX), autor)
        requisicao.input('editora', mssql.VarChar(mssql.MAX), editora)
        requisicao.input('ISBN', mssql.Int, ISBN)
        requisicao.input('quantidade',mssql.Int, quantidade)
        requisicao.input('dataPublicacao', mssql.DateTime, dataPublicacao)
        requisicao.input('imagem', mssql.VarChar(mssql.MAX), imagem)
        await requisicao.query(`
            UPDATE Livros SET titulo = @titulo,genero = @genero,autor = @autor,
            editora = @editora,ISBN = @ISBN,quantidade = @quantidade, imagem = @imagem,
            dataPublicacao = @dataPublicacao WHERE uid=@uid
            `)
        return this.obterPeloUID(uid)
    }
    static async remover(uid){
        await conectar()
        const requisicao = new mssql.Request()
        requisicao.input('uid', mssql.UniqueIdentifier,uid)
        const resultado = await requisicao.query('DELETE FROM Livros WHERE uid = @uid')
        //return resultado.recordset[0].deleted > 0
    }

}

export default LivroModelo // Exporta o modelo para utilizar em outros modulos