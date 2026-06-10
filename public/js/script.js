document.addEventListener('DOMContentLoaded', () => {
    const controlarItens = document.getElementById('itens-pedidos') // Puxar o itens
    const botaoAdicionar = document.getElementById('adicionar-item-pedido') // Vamos obter o elemento de add item
    const templateItem = document.getElementById('item-pedido-template') // obtem o elemento de clonagem
    if (!controlarItens || !botaoAdicionar || !templateItem) return
    const adicionarItem = () => {
        const clonar = templateItem.content.cloneNode(true) // Clona
        const blocoItem = clonar.querySelector('.item-pedido') // Adiciona novo item
        const botaoRemover = clonar.querySelector('.remover-item-pedido') // Coloca o botao de remover

        botaoRemover.addEventListener('click' , () => { blocoItem.remove()}) //Coloca a funçao de remover
        controlarItens.appendChild(clonar) //Adiciona o item clonado
    }
    botaoAdicionar.addEventListener('click', adicionarItem) // Adiciona o botão de adicionar novo item
    adicionarItem()//Garante pelo menos uma inserção de livro 
})