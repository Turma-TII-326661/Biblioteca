import mssql from 'mssql'
import {conectar} from '../config/db.mjs'
class FuncionarioModelo{
    static async obterTodosOsDados(){
        await conectar()
        const resultado = await mssql.query(
            'SELECT id, nomeUsuario, nomeCompleto, cargo, email FROM Funcionario'
        )
        return resultado.recordset
    }
    static async criarLivro({nomeUsuario,senha, nomeCompleto, cargo, email}){
        await conectar()
        const requisicao = new mssql.Request()
        requisicao.input('nomeUsuario', mssql.NVarChar(127), nomeUsuario)
        requisicao.input('senha', mssql.NVarChar(255), senha)
        requisicao.input('nomeCompleto', mssql.Text, nomeCompleto)
        requisicao.input('cargo', mssql.Text, cargo)
        requisicao.input('email', mssql.NVarChar(255), email)
        const resultado = await requisicao.query(
            'EXEC inserirNovo @nomeUsuario,@senha,@nomeCompleto,@cargo,@email'
        )
        return {nomeUsuario,senha, nomeCompleto, cargo, email}
    }
    static async obterPeloID(id){}
    static async editar(id, {nomeUsuario, nomeCompleto, cargo, email}){}
    static async remover(id){}
    static async autenticar(nomeUsuario,senha){
        await conectar()
        const req = new mssql.Request()
        req.input('nomeUsuario', mssql.NVarChar(127), nomeUsuario)
        req.input('senha', mssql.NVarChar(255), senha)
        const resultado = await req.query('EXEC acessar @nomeUsuario, @senha')
        return resultado.recordset[0] || null
    }
}
export default FuncionarioModelo