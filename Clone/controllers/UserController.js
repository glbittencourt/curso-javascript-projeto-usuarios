class UserController {

    // O construtor inicializa os elementos do formulário e da tabela
    constructor(formIdCreate, formIdUpdate, tableId) {
        this.formEl = document.getElementById(formIdCreate);  // Obtém o formulário pelo ID
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);  // Obtém a tabela onde os usuários serão listados

        this.onSubmit();  // Chama o método onSubmit para adicionar o evento de envio do formulário
        this.onEdit();    // Chama o método onEdit para configurar o evento de edição de usuários
    }

    onEdit(){
        // Adiciona o evento de clique no botão "Cancelar" da atualização
        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e=> {

            this.showPanelCreate();  // Mostra o painel de criação de usuário

        });

        this.formUpdateEl.addEventListener("submit", event => {

            event.preventDefault();

            let btn = this.formUpdateEl.querySelector("[type=submit]"); 

            btn.disabled = true;

            let values = this.getValues(this.formUpdateEl);

            let index = this.formUpdateEl.dataset.trIndex

            let tr = this.tableEl.rows[index];

            tr.dataset.user = JSON.stringify(values);

            tr.innerHTML = `
                <td><img src="${values.photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${values.name}</td>
                <td>${values.email}</td>
                <td>${(values.admin) ? 'Sim' : 'Não'}</td>
                <td>${Utils.dateFormat(values.register)}</td>
                <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
        `;

            this.addEventsTr(tr);

            this.updateCount();

        });
    }

    // Método para configurar o evento de envio do formulário
    onSubmit(){
        this.formEl.addEventListener("submit", event => {

            event.preventDefault();  // Previne o comportamento padrão de envio do formulário

            let btn = this.formEl.querySelector("[type=submit]");  
            // Obtém o botão de envio do formulário
            btn.disabled = true;  // Desabilita o botão para prevenir múltiplos envios

            let values = this.getValues(this.formEl);  // Obtém os valores preenchidos no formulário

            if (!values) return false;  // Se os valores não são válidos, retorna falso e não prossegue

            // Chama a função para obter a foto e aguarda a resposta
            this.getPhoto().then(
                (content) => {
                    values.photo = content;  // Adiciona o conteúdo da foto aos valores do formulário

                    this.addLine(values);  // Adiciona uma linha na tabela com os dados do usuário

                    this.formEl.reset();  // Limpa o formulário após a submissão
                    btn.disabled = false;  // Reabilita o botão de envio após a operação
                },
                (e) => {
                    console.error(e);  // Caso ocorra erro na obtenção da foto
                }   
            );
        });
    }

    // Método para obter a foto carregada no formulário, se houver
    getPhoto(){
        return new Promise((resolve, reject) => {

            let fileReader = new FileReader();  // Instancia o FileReader para ler a foto

            // Filtra o campo de input com o nome 'photo'
            let elements = [...this.formEl.elements].filter(item => {
                if (item.name === 'photo') {
                    return item;
                }
            });

            let file = elements[0].files[0];  // Obtém o arquivo da foto carregado no formulário

            fileReader.onload = () => {
                resolve(fileReader.result);  // Retorna o resultado (conteúdo da foto) quando carregado com sucesso
            };

            fileReader.onerror = (e) => {
                reject(e);  // Caso ocorra erro na leitura do arquivo
            };

            // Se a foto foi selecionada, lê como URL de dados
            if (file) {
                fileReader.readAsDataURL(file);
            } else {
                resolve('dist/img/boxed-bg.jpg');  // Se não houver foto, define uma foto padrão
            }
        });
    }

    // Método para coletar os valores do formulário
    getValues(formEl){
        let user = {};  // Objeto para armazenar os dados do usuário
        let isValid = true;  // Flag para verificar se todos os campos obrigatórios foram preenchidos

        // Itera sobre todos os elementos do formulário
        [...formEl.elements].forEach(function(field, index){

            // Verifica se os campos obrigatórios 'name', 'email' e 'password' foram preenchidos
            if (['name', 'email', 'password'].indexOf(field.name) > -1  && !field.value ) {
                field.parentElement.classList.add('has-error');  // Adiciona uma classe de erro ao campo
                isValid = false;  // Marca como inválido
            }

            // Trata campos de gênero (radio button)
            if (field.name == "gender") {
                if (field.checked) {
                    user[field.name] = field.value;  // Atribui o valor do gênero ao objeto user
                }

            // Para o campo admin, verifica se está marcado (checkbox)
            } else if (field.name == "admin") {
                user[field.name] = field.checked;  // Atribui o valor do checkbox ao objeto user

            } else {
                user[field.name] = field.value;  // Para os outros campos, simplesmente atribui o valor
            }
        });

        if (!isValid) {
            return false;  // Retorna falso se algum campo obrigatório não foi preenchido
        }

        // Retorna um novo objeto User com os dados coletados
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

    // Método para adicionar uma linha na tabela com os dados do usuário
    addLine(dataUser){
        let tr = document.createElement('tr');  // Cria uma nova linha na tabela

        tr.dataset.user = JSON.stringify(dataUser);  // Salva os dados do usuário como um atributo data

        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
            <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;  
        
        this.addEventsTr(tr);

        this.tableEl.appendChild(tr);  

        this.updateCount();  
    }

    addEventsTr(tr){

        tr.querySelector(".btn-edit").addEventListener("click", e=> {

            let json = JSON.parse(tr.dataset.user);  // Recupera os dados do usuário da linha
            let form = document.querySelector("#form-user-update");  // Obtém o formulário de atualização
            
            form.dataset.trIndex = tr.sectionRowIndex;
            // Itera sobre os dados do usuário e preenche o formulário com os valores
            for (let name in json) {

                let field = form.querySelector("[name=" + name.replace("_", "") + "]");

                if (field) {

                    switch (field.type) {
                        case 'file':
                            continue;  // Ignora o campo 'file', pois não é possível preencher automaticamente
                        break;

                        case 'radio':
                            field = form.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]");
                            field.checked = true;  // Marca o radio button correspondente
                        break;

                        case 'checkbox':
                            field.checked = json[name];  // Marca ou desmarca o checkbox conforme o valor
                        break;

                        default:
                            field.value = json[name];  // Preenche os outros campos com o valor
                    }

                }

            }

            this.showPanelUpdate();  // Mostra o painel de atualização de usuário

        });
    }

    // Exibe o painel de criação de usuário
    showPanelCreate(){
        document.querySelector("#box-user-create").style.display = "block";  // Mostra o painel de criação
        document.querySelector("#box-user-update").style.display = "none";  // Oculta o painel de atualização
    }

    // Exibe o painel de atualização de usuário
    showPanelUpdate(){
        document.querySelector("#box-user-create").style.display = "none";  // Oculta o painel de criação
        document.querySelector("#box-user-update").style.display = "block";  // Mostra o painel de atualização
    }

    // Atualiza a contagem de usuários e administradores
    updateCount() {
        let numberUsers = 0;  // Contador de usuários
        let numberAdmin = 0;  // Contador de administradores

        // Itera sobre todas as linhas da tabela
        [...this.tableEl.children].forEach(tr=>{

            numberUsers++;  // Incrementa o contador de usuários

            let user = JSON.parse(tr.dataset.user);  // Recupera os dados do usuário

            if (user.admin === true) numberAdmin++;  // Se for administrador, incrementa o contador de administradores

        });

        // Atualiza os elementos na página com os números
        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;
    }

}