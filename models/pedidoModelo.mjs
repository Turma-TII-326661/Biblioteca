import mssql from 'mssql'
import { conectar } from '../config/db.mjs'
class PedidoModelo{
    static async obterTodosOsDados(){
        await conectar()
        const resultado = await mssql.query(`
            SELECT Pedido.ID, nome, nomeCompleto
            FROM Pedido
            INNER JOIN Funcionario ON Pedido.FuncionarioID = Funcionario.ID
            INNER JOIN Usuarios ON Pedido.UsuarioID = Usuarios.ID
            `)
        return resultado.recordset
    }
    static async obterItensDoPedido(PedidoID){
        await conectar()
        const requisicao = new mssql.Request()
        requisicao.input('PedidoID', mssql.Int, PedidoID)
        const resultado = await requisicao.query(`
            SELECT Livros.titulo AS livroTitulo, Funcionario.nomeUsuario AS usuarioNome, Pedido.ID AS pedidoID, Item_Pedido.DataDevolucao AS dataDevolucao
             FROM Item_Pedido
             INNER JOIN Pedido ON Item_Pedido.PedidoID = Pedido.ID
             INNER JOIN Livros ON Item_Pedido.LivroID = Livros.uid
             INNER JOIN Funcionario ON Pedido.FuncionarioID = Funcionario.ID
             INNER JOIN Usuarios ON Pedido.UsuarioID = Usuarios.ID
             WHERE Pedido.ID = @PedidoID
            `)
            return resultado.recordset
    }
    static async remover(id){
    await conectar()
    const req = new mssql.Request()
    req.input('PedidoID',mssql.Int,id)
    await req.query('DELETE FROM Item_Pedido WHERE PedidoID = @PedidoID')
    await req.query('DELETE FROM Pedido WHERE ID = @PedidoID')
    
    }
    static async criarPedido({funcionarioID, usuarioID, livrosUIDS, datasDevolucao}){
        await conectar()
        console.log(livrosUIDS)
        const livrosSelecionados = Array.isArray(livrosUIDS) ? livrosUIDS : livrosUIDS ? [livrosUIDS] :[]
        const datasSelecionadas = Array.isArray(datasDevolucao) 
        ? datasDevolucao
        : datasDevolucao ? [datasDevolucao] : []
        const transacao = new mssql.Transaction()
        await transacao.begin()
        try{
            const reqPedido = new mssql.Request(transacao)
            reqPedido.input('funcionarioID', mssql.Int, funcionarioID)
            reqPedido.input('usuarioID', mssql.Int,usuarioID)

            const resPedido = await reqPedido.query(`
                INSERT INTO Pedido (FuncionarioID, UsuarioID)
                OUTPUT INSERTED.ID
                VALUES (@funcionarioID, @usuarioID)`)
            const PedidoID = resPedido.recordset[0].ID
            for (let contador = 0; contador < livrosSelecionados.length; contador++){
                const livroID = livrosSelecionados[contador]
                const dataDevolucao = datasSelecionadas[contador]
                const itemPedido = new mssql.Request(transacao)
                itemPedido.input('PedidoID', mssql.Int, PedidoID)
                itemPedido.input('livroID',mssql.UniqueIdentifier, livroID)
                itemPedido.input('dataDevolucao', mssql.DateTime, dataDevolucao)
                await itemPedido.query('INSERT INTO Item_Pedido (PedidoID, LivroID, DataDevolucao) VALUES (@PedidoID, @livroID, @dataDevolucao)')//@idPedido
            }
            await transacao.commit()
        }
        catch(erro){
            //try---catch(erro)--
            await transacao.rollback()
            throw erro
        }
    }
    static async obterDadosParaCriar(){
        await conectar()
        const livros = await mssql.query('SELECT * FROM Livros')
        const funcionarios = await mssql.query('SELECT * FROM Funcionario')
        const usuarios = await mssql.query('SELECT * FROM Usuarios')
        return {
            funcionarios: funcionarios.recordset,
            livros: livros.recordset,
            usuarios: usuarios.recordset,
        }
    }
}
export default PedidoModelo