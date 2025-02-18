const bcrypt = require('bcrypt');

const senhaTeste = "123456"; // Senha que será testada

bcrypt.hash(senhaTeste, 10, (err, hash) => {
    if (err) {
        console.error("Erro ao gerar hash:", err);
        return;
    }
    console.log("Novo hash gerado:", hash);

    // Agora, testamos a comparação para ver se a senha confere
    bcrypt.compare(senhaTeste, hash, (err, result) => {
        if (err) {
            console.error("Erro ao comparar senhas:", err);
            return;
        }
        console.log("Senha correta?", result);
    });
});

