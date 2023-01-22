# Criar enquete

> ## Caso de sucesso

- [ ] Recebe uma requisição do tipo **POST** na rota **/api/surveys**
- [ ] Valida se a requisição foi feita por um **admin**
- [ ] Valida dados obrigatórios **question** e **answers**
- [ ] **Cria** uma enquete com os dados fornecidos
- [ ] Retorna **204**, sem dados

> ## Exceções

- [ ] Retorna erro **404** se a API não existir
- [ ] Retorna erro **403** se o usuário não for admin
- [ ] Retorna erro **400** se question ou answers não forem fornecidos pelo client
- [ ] Retorna erro **500** se der erro ao tentar criar a enquete
