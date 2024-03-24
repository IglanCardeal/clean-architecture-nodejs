# Cadastro

> ## Caso de sucesso

✅ Recebe uma requisição do tipo **POST** na rota **/api/signup**
✅ Valida dados obrigatórios **name**, **email**, **password** e **passwordConfirmation**
✅ Valida que **password** e **passwordConfirmation** são iguais
✅ Valida que o campo **email** é um e-mail válido
✅ **Valida** se já existe um usuário com o email fornecido
✅ Gera uma senha **criptografada** (essa senha não pode ser descriptografada)
✅ **Cria** uma conta para o usuário com os dados informados, **substituindo** a senha pela senha criptorafada
✅ Gera um **token** de acesso a partir do ID do usuário
✅ **Atualiza** os dados do usuário com o token de acesso gerado
✅ Retorna **200** com o token de acesso e o nome do usuário

> ## Exceções

✅ Retorna erro **404** se a API não existir
✅ Retorna erro **400** se name, email, password ou passwordConfirmation não forem fornecidos pelo client
✅ Retorna erro **400** se password e passwordConfirmation não forem iguais
✅ Retorna erro **400** se o campo email for um e-mail inválido
✅ Retorna erro **409** se o email fornecido já estiver em uso
✅ Retorna erro **500** se der erro ao tentar gerar uma senha criptografada
✅ Retorna erro **500** se der erro ao tentar criar a conta do usuário
✅ Retorna erro **500** se der erro ao tentar gerar o token de acesso
✅ Retorna erro **500** se der erro ao tentar atualizar o usuário com o token de acesso gerado
