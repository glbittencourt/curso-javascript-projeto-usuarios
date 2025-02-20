// A classe User representa um usuário e seus dados. 
// Ela tem métodos para carregar, salvar, remover e obter dados dos usuários.
class User {

    // O construtor é chamado quando um novo objeto User é criado. Ele inicializa as propriedades do objeto.
    constructor(name, gender, birth, country, email, password, photo, admin){
        
        this._id; // A propriedade '_id' será preenchida depois, com um identificador único.
        this._name = name; // Nome do usuário.
        this._gender = gender; // Gênero do usuário.
        this._birth = birth; // Data de nascimento do usuário.
        this._country = country; // País do usuário.
        this._email = email; // Email do usuário.
        this._password = password; // Senha do usuário.
        this._photo = photo; // Foto do usuário.
        this._admin = admin; // Define se o usuário é administrador.
        this._register = new Date(); // A data de criação do usuário será registrada automaticamente como a data atual.

    }

    // Getter para acessar o id do usuário.
    get id(){
        return this._id;
    }

    // Getter para acessar a data de registro.
    get register(){
        return this._register;
    }

    // Getter para acessar o nome do usuário.
    get name(){
        return this._name;
    }

    // Getter para acessar o gênero do usuário.
    get gender() {
        return this._gender;
    }

    // Getter para acessar a data de nascimento do usuário.
    get birth() {
        return this._birth;
    }

    // Getter para acessar o país do usuário.
    get country() {
        return this._country;
    }

    // Getter para acessar o email do usuário.
    get email() {
        return this._email;
    }

    // Getter para acessar a foto do usuário.
    get photo() {
        return this._photo;
    }

    // Getter para acessar a senha do usuário.
    get password() {
        return this._password;
    }

    // Getter para acessar o status de administrador do usuário.
    get admin() {
        return this._admin;
    }

    // Setter para modificar a foto do usuário.
    set photo(value){
        this._photo = value;
    }

    // Método para carregar os dados do usuário a partir de um objeto JSON.
    // Isso é útil quando você recupera dados de um armazenamento externo, como um banco de dados.
    loadFromJSON(json){
        
        // Para cada chave do objeto JSON, atribui o valor à propriedade correspondente do objeto User.
        for (let name in json){
            
            // Se o campo for '_register', convertemos o valor para uma data, pois ele é uma data no formato string.
            switch(name){
                case '_register':
                    this[name] = new Date(json[name]); // Converte o valor para um objeto Date.
                break;
                default:
                    this[name] = json[name]; // Atribui diretamente o valor.
            }
        }
    }

    // Método estático que busca todos os usuários armazenados no localStorage.
    // O localStorage é usado para armazenar dados no navegador do usuário.
    static getUsersStorage() {

        let users = []; // Cria um array vazio para armazenar os usuários.

        // Verifica se já existe algo armazenado no localStorage com a chave "users".
        if (localStorage.getItem("users")) {

            // Se houver dados, converte o JSON de volta para um array de objetos e o armazena na variável 'users'.
            users = JSON.parse(localStorage.getItem("users"));

        }

        // Retorna o array de usuários.
        return users;

    }

    // Método para gerar um novo ID único para cada usuário.
    getNewID(){

        // Tenta obter o valor de "usersID" armazenado no localStorage (ID dos usuários).
        let usersID = parseInt(localStorage.getItem("usersID"));

        // Se não houver ID ou o valor for inválido, começa com 0.
        if (!usersID > 0) usersID = 0;

        // Incrementa o ID para garantir que ele seja único.
        usersID++;

        // Armazena o novo valor de "usersID" no localStorage.
        localStorage.setItem("usersID", usersID);

        // Retorna o novo ID gerado.
        return usersID;

    }

    // Método para salvar os dados do usuário no localStorage.
    save(){

        // Recupera todos os usuários armazenados no localStorage.
        let users = User.getUsersStorage();

        // Se o usuário já tiver um ID (caso seja uma atualização), procura por ele na lista.
        if (this.id > 0) {
            
            // Mapeia os usuários e atualiza o usuário correspondente com as novas informações.
            users.map(u=>{
                if (u._id == this.id) {
                    // Atualiza os dados do usuário.
                    Object.assign(u, this);
                }
                return u;
            });

        } else {
            // Se o usuário ainda não tiver ID, cria um novo ID e o adiciona à lista de usuários.
            this._id = this.getNewID();
            users.push(this); // Adiciona o usuário à lista de usuários.
        }

        // Salva a lista atualizada de usuários no localStorage.
        localStorage.setItem("users", JSON.stringify(users));

    }

    // Método para remover um usuário do localStorage.
    remove(){

        // Recupera todos os usuários armazenados no localStorage.
        let users = User.getUsersStorage();

        // Percorre todos os usuários e encontra o índice do usuário a ser removido.
        users.forEach((userData, index)=>{
            if (this._id == userData._id) {
                // Se o ID do usuário coincidir com o ID do usuário atual, o remove da lista.
                users.splice(index, 1);
            }
        });

        // Atualiza o localStorage com a lista de usuários sem o usuário removido.
        localStorage.setItem("users", JSON.stringify(users));

    }

}
