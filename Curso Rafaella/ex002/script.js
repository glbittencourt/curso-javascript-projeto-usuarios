function adicionarTarefa() {
    
    // Variável que guarda a mensagem a ser exibida quando a tarefa for adicionada
    let msgAcerto = "Tarefa adicionada com sucesso!";

    // Obtém o elemento de input do HTML onde o usuário digita a tarefa
    const inputTarefa = document.getElementById("inputTarefa");

    // Pega o valor (texto) inserido pelo usuário no campo de input
    let tarefa = inputTarefa.value.trim();

    const message = document.getElementById("mensagem")

     if (tarefa == "") { 
        let msgErro = "É necessario adicionar tarefa."
        message.textContent = msgErro
        message.style.color = " #A34743"
        inputTarefa.value = "";
        return;
    }

    // Exibe a mensagem de sucesso no elemento HTML com o id 'mensagem'
    message.textContent = msgAcerto; //
    message.style.color = " #28A745"

    // Obtém a referência do elemento onde a lista de tarefas é exibida (ul ou ol)
    const listaTarefas = document.getElementById("listaTarefas");

    // Cria um novo elemento de lista (li) para representar a nova tarefa
    let novaTarefa = document.createElement("li");

    // Define o texto da nova tarefa criada como o conteúdo do input
    novaTarefa.textContent = tarefa;

    // Adiciona a nova tarefa (li) como um filho do elemento da lista de tarefas
    listaTarefas.appendChild(novaTarefa);

    // Limpa o campo de input, deixando-o vazio para a próxima tarefa
    inputTarefa.value = "";

   
}