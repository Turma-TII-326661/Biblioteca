function garantirEntradaNaRota(requisicao, resposta, proximo){
    if (requisicao.session?.usuario) return proximo()
     return resposta.redirect('/logar/login/')
} 
export {garantirEntradaNaRota}