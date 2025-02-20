// A classe UserController controla o comportamento dos formulários e da tabela
class UserController {

    // O construtor inicializa os elementos que vamos usar e chama os métodos que irão configurar os eventos.
    constructor(formIdCreate, formIdUpdate, tableId){
        // Aqui pegamos os elementos da tela que possuem os IDs passados como parâmetro
        this.formEl = document.getElementById(formIdCreate); // Formulário de criação de usuário
        this.formUpdateEl = document.getElementById(formIdUpdate); // Formulário de atualização de usuário
        this.tableEl = document.getElementById(tableId); // A tabela onde listamos os usuários

        // Chamamos métodos para configurar os eventos de submit e edição
        this.onSubmit();
        this.onEdit();
        this.selectAll(); // Seleciona todos os usuários do armazenamento
    }

    // Este método trata o evento de edição de um usuário.
    onEdit(){
        // Quando o botão de "Cancelar" é clicado, mostramos o painel de criação
        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e=>{
            this.showPanelCreate();
        });

        // Quando o formulário de atualização é enviado, fazemos a atualização do usuário.
        this.formUpdateEl.addEventListener("submit", event => {
            event.preventDefault(); // Impede o comportamento padrão de envio de um formulário.

            let btn = this.formUpdateEl.querySelector("[type=submit]"); // Obtém o botão de submit
            btn.disabled = true; // Desabilita o botão para evitar múltiplos envios.

            // Coletamos os valores dos campos do formulário
            let values = this.getValues(this.formUpdateEl);
            let index = this.formUpdateEl.dataset.trIndex; // Obtém o índice da linha para editar o usuário

            let tr = this.tableEl.rows[index]; // Obtém a linha da tabela
            let userOld = JSON.parse(tr.dataset.user); // Obtém os dados do usuário atual da tabela

            // Unimos os dados antigos com os novos valores (se houver)
            let result = Object.assign({}, userOld, values);

            // Pegamos a foto, caso tenha sido alterada.
            this.getPhoto(this.formUpdateEl).then(
                (content) => {
                    if (!values.photo) {
                        result._photo = userOld._photo; // Se não houver foto, mantemos a antiga
                    } else {
                        result._photo = content; // Se houver, usamos a nova foto
                    }

                    let user = new User(); // Criamos um novo objeto de usuário
                    user.loadFromJSON(result); // Carregamos os dados do usuário atualizados
                    user.save(); // Salvamos o usuário

                    this.getTr(user, tr); // Atualizamos a linha da tabela com os dados novos
                    this.updateCount(); // Atualiza a contagem de usuários

                    this.formUpdateEl.reset(); // Reseta o formulário de edição
                    btn.disabled = false; // Reabilita o botão de envio
                    this.showPanelCreate(); // Mostra o painel de criação novamente
                },
                (e) => {
                    console.error(e); // Se ocorrer um erro, mostramos no console
                }
            );
        });
    }

    // Este método trata o evento de submit para criação de novos usuários
    onSubmit(){
        // Quando o formulário de criação é enviado
        this.formEl.addEventListener("submit", event => {
            event.preventDefault(); // Impede o comportamento padrão de envio do formulário

            let btn = this.formEl.querySelector("[type=submit]"); // Pega o botão de submit
            btn.disabled = true; // Desabilita o botão para evitar múltiplos envios

            // Coleta os valores dos campos do formulário
            let values = this.getValues(this.formEl);

            if (!values) return false; // Se não tiver valores válidos, não faz nada

            // Pega a foto do usuário, se houver
            this.getPhoto(this.formEl).then(
                (content) => {
                    values.photo = content; // Define a foto

                    values.save(); // Salva o novo usuário

                    this.addLine(values); // Adiciona o novo usuário à tabela
                    this.formEl.reset(); // Limpa os campos do formulário
                    btn.disabled = false; // Reabilita o botão de submit
                }, 
                (e) => {
                    console.error(e); // Se houver erro ao carregar a foto, exibe no console
                }
            );
        });
    }

    // Este método lida com o carregamento da foto do usuário
    getPhoto(formEl){
        return new Promise((resolve, reject) => {

            let fileReader = new FileReader(); // Cria um novo FileReader para ler o arquivo

            // Filtra o elemento "photo" do formulário
            let elements = [...formEl.elements].filter(item => {
                if (item.name === 'photo') {
                    return item;
                }
            });

            let file = elements[0].files[0]; // Pega o primeiro arquivo (a foto)

            fileReader.onload = () => {
                resolve(fileReader.result); // Retorna a foto carregada
            };

            fileReader.onerror = (e) => {
                reject(e); // Se ocorrer erro, rejeita a promessa
            };

            // Se o usuário escolheu um arquivo, lemos ele. Caso contrário, retornamos uma imagem padrão
            if (file) {
                fileReader.readAsDataURL(file);
            } else {
                resolve('dist/img/boxed-bg.jpg'); // Imagem padrão se não houver foto
            }
        });
    }

    // Este método coleta os valores dos campos do formulário
    getValues(formEl){
        let user = {}; // Cria um objeto vazio para armazenar os dados do usuário
        let isValid = true; // Variável que verifica se os campos são válidos

        // Percorre todos os campos do formulário
        [...formEl.elements].forEach(function (field, index) {

            // Se o campo for nome, email ou senha e não tiver valor, marca como erro
            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {
                field.parentElement.classList.add('has-error');
                isValid = false;
            }

            // Se o campo for de gênero (radio), adiciona o valor do selecionado
            if (field.name == "gender") {
                if (field.checked) {
                    user[field.name] = field.value;
                }
            } else if(field.name == "admin") {
                user[field.name] = field.checked; // Se for checkbox, armazena se está marcado
            } else {
                user[field.name] = field.value; // Armazena o valor dos outros campos
            }
        });

        if (!isValid) {
            return false; // Se houver erro, retorna false
        }

        // Retorna um novo objeto de usuário com os dados coletados
        return new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        );
    }

    // Este método seleciona todos os usuários armazenados e os exibe
    selectAll(){
        let users = User.getUsersStorage(); // Pega todos os usuários do armazenamento

        users.forEach(dataUser => {
            let user = new User(); // Cria um novo objeto de usuário
            user.loadFromJSON(dataUser); // Carrega os dados do usuário
            this.addLine(user); // Adiciona o usuário na tabela
        });
    }

    // Este método adiciona uma nova linha na tabela com os dados de um usuário
    addLine(dataUser) {
        let tr = this.getTr(dataUser); // Cria a linha da tabela
        this.tableEl.appendChild(tr); // Adiciona a linha à tabela
        this.updateCount(); // Atualiza a contagem de usuários
    }

    // Este método cria ou atualiza uma linha da tabela com os dados do usuário
    getTr(dataUser, tr = null){
        if (tr === null) tr = document.createElement('tr'); // Se não passar uma linha, cria uma nova

        tr.dataset.user = JSON.stringify(dataUser); // Guarda os dados do usuário na linha como JSON

        // Preenche o HTML da linha com os dados do usuário
        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>
        `;

        this.addEventsTr(tr); // Adiciona os eventos de editar e excluir na linha

        return tr; // Retorna a linha criada
    }

    // Este método adiciona os eventos de editar e excluir na linha da tabela
    addEventsTr(tr){
        // Evento de excluir
        tr.querySelector(".btn-delete").addEventListener("click", e => {
            if (confirm("Deseja realmente excluir?")) {
                let user = new User();
                user.loadFromJSON(JSON.parse(tr.dataset.user)); // Carrega os dados do usuário
                user.remove(); // Remove o usuário
                tr.remove(); // Remove a linha da tabela
                this.updateCount(); // Atualiza a contagem de usuários
            }
        });

        // Evento de editar
        tr.querySelector(".btn-edit").addEventListener("click", e => {
            let json = JSON.parse(tr.dataset.user); // Carrega os dados do usuário
            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex; // Define o índice da linha no formulário de atualização

            // Preenche o formulário com os dados do usuário
            for (let name in json) {
                let field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "]");

                if (field) {
                    switch (field.type) {
                        case 'file': // Se for campo de arquivo, ignora
                            continue;
                            break;
                        case 'radio': // Se for rádio, marca o valor selecionado
                            field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]");
                            field.checked = true;
                            break;
                        case 'checkbox': // Se for checkbox, marca se for verdadeiro
                            field.checked = json[name];
                            break;
                        default: // Para os outros campos, preenche com o valor
                            field.value = json[name];
                    }
                }
            }

            this.formUpdateEl.querySelector(".photo").src = json._photo; // Exibe a foto do usuário

            this.showPanelUpdate(); // Exibe o painel de edição
        });
    }

    // Este método exibe o painel de criação de usuário
    showPanelCreate(){
        document.querySelector("#box-user-create").style.display = "block"; // Mostra o painel de criação
        document.querySelector("#box-user-update").style.display = "none"; // Esconde o painel de edição
    }

    // Este método exibe o painel de edição de usuário
    showPanelUpdate() {
        document.querySelector("#box-user-create").style.display = "none"; // Esconde o painel de criação
        document.querySelector("#box-user-update").style.display = "block"; // Mostra o painel de edição
    }

    // Este método atualiza as contagens de usuários e de administradores na tela
    updateCount(){
        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableEl.children].forEach(tr => {
            numberUsers++; // Conta todos os usuários
            let user = JSON.parse(tr.dataset.user);

            if (user._admin) numberAdmin++; // Conta os usuários administradores
        });

        document.querySelector("#number-users").innerHTML = numberUsers; // Exibe a contagem de usuários
        document.querySelector("#number-users-admin").innerHTML = numberAdmin; // Exibe a contagem de administradores
    }
}