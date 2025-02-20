// A classe Utils possui métodos que podem ser usados de forma utilitária, ou seja, sem precisar criar uma instância da classe.
class Utils {

    // O método estático dateFormat formata uma data no formato "dd/mm/yyyy hh:mm"
    static dateFormat(date){
        
        // Aqui, ele usa o método `getDate()` para pegar o dia do mês (1 a 31), 
        // o `getMonth()` para pegar o mês (0 a 11), e o `getFullYear()` para pegar o ano completo (ex: 2025).
        // O `+1` no `getMonth()` é necessário porque o método `getMonth()` retorna o mês de 0 a 11 (0 = janeiro, 11 = dezembro).
        // Já o `getHours()` e `getMinutes()` pegam a hora e os minutos da data.
        
        return date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes();
    }
}