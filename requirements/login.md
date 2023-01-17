# Login

> ## Caso de sucesso

✅ Recebe uma requisição do tipo POST na rota /api/login
✅ Valida dados obrigatórios email e password
✅ Valida que o campo email é um e-mail válido
✅ Busca o usuário com o email e senha fornecidos
✅ Gera um token de acesso a partir do ID do usuário
✅ Atualiza os dados do usuário com o token de acesso gerado
✅ Retorna 200 com o token de acesso e o nome do usuário

> ## Exceções

✅ Retorna erro 404 se a API não existir
✅ Retorna erro 400 se email ou password não forem fornecidos pelo client
✅ Retorna erro 400 se o campo email for um e-mail inválido
✅ Retorna erro 401 se não encontrar um usuário com os dados fornecidos
✅ Retorna erro 500 se der erro ao tentar gerar o token de acesso
✅ Retorna erro 500 se der erro ao tentar atualizar o usuário com o token de acesso gerado
