# Listar enquetes

> ## Caso de sucesso

- [x] Recebe uma requisição do tipo **GET** na rota **/api/surveys**
- [x] Valida se a requisição foi feita por um **usuário**
- [x] Retorna **200** com os dados das enquetes

> ## Exceções

- [x] Retorna erro **404** se a API não existir
- [x] Retorna erro **403** se não for um usuário
- [x] Retorna erro **500** se der erro ao tentar listar as enquetes
