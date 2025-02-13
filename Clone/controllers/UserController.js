class UserController {

    // O construtor inicializa os elementos do formulário e da tabela
    constructor(formId, tableId) {
        this.formEl = document.getElementById(formId);  // Obtém o formulário pelo ID
        this.tableEl = document.getElementById(tableId);  // Obtém a tabela onde os usuários serão listados

        this.onSubmit();  // Chama o método onSubmit para adicionar o evento de envio do formulário
    }

    // Método para configurar o evento de envio do formulário
    onSubmit(){
        this.formEl.addEventListener("submit", event => {

            event.preventDefault();  // Previne o comportamento padrão de envio do formulário

            let btn = this.formEl.querySelector("[type=submit]");

            btn.disabled = true;

            let values = this.getValues();  // Obtém os valores preenchidos no formulário

            if (!values) return false;

            // Chama a função para obter a foto e aguarda a resposta
            this.getPhoto().then(
                (content) => {
                    values.photo = content;  // Adiciona o conteúdo da foto aos valores do formulário

                    this.addLine(values);  // Adiciona uma linha na tabela com os dados do usuário

                    this.formEl.reset();
                    
                    btn.disabled = false;

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
    getValues(){
        let user = {};  // Objeto para armazenar os dados do usuário
        let isValid = true;

        // Itera sobre todos os elementos do formulário
        [...this.formEl.elements].forEach(function(field, index){

            if (['name', 'email', 'password'].indexOf(field.name) > -1  && !field.value ) {

                field.parentElement.classList.add('has-error');
                isValid = false;

            }

            // Trata campos de gênero (checkbox ou radio)
            if (field.name == "gender") {
                if (field.checked) {
                    user[field.name] = field.value;  // Atribui o valor do gênero ao objeto user
                }

            // Para o campo admin, verifica se está marcado (checkbox)
            } else if (field.name === "admin"){
                user[field.name] = field.checked;  // Atribui o valor do checkbox ao objeto user

            } else {
                user[field.name] = field.value;  // Para os outros campos, simplesmente atribui o valor
            }
        });

        if (!isValid) {

            return false;

        }

        // Retorna um novo objeto User com os dados coletados
        return new User(
            user.name, 
            user.gender, 
            user.birth, 
            user.email, 
            user.password, 
            user.photo, 
            user.admin
        );
    }

    // Método para adicionar uma linha na tabela com os dados do usuário
    addLine(dataUser){
        let tr = document.createElement('tr');  // Cria uma nova linha na tabela
        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
            <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;  // Preenche a linha com os dados do usuário, incluindo a foto

        this.tableEl.appendChild(tr);  // Adiciona a nova linha à tabela

        this.updateCount()
    }
        
        updateCount() {
        
            let numberUsers = 0;
            let numberAdmin = 0;

            [...this.tableEl.children].forEach(tr=>{

                numberUsers++;

                let user = JSON.parse(tr.dataset.user)

                if (user.admin) numberAdmin++;

            });

            document.querySelector("#number-users").innerHTML = numberUsers;
            document.querySelector("#number-users-admin").innerHTML = numberAdmin;

        }

}