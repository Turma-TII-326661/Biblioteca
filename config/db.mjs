import mssql from 'mssql';

const config = {
    user : 'App',
    password : 'Hd102030@',
    server : '127.0.0.1',
    port : 1433,
    database : 'App',
    options : {
        encrypt: false, // Na nuvem tem que esta como true
        trustServerCertificate: true // Local tem que estar como true
    } 
}
async function conectar() {
    try {
        await mssql.connect(config);
        //console.log("Conectado com sucesso!")
    } catch (error) {
        console.error(error.message)
    }
}

export { conectar }