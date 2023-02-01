# Criar enquete

> ## Caso de sucesso

- [x] Recebe uma requisição do tipo **POST** na rota **/api/surveys**
- [ ] Valida se a requisição foi feita por um **admin**
- [x] Valida dados obrigatórios **question** e **answers**
- [x] **Cria** uma enquete com os dados fornecidos
- [x] Retorna **204**, sem dados

> ## Exceções

- [ ] Retorna erro **403** se o usuário não for admin
- [x] Retorna erro **400** se question ou answers não forem fornecidos pelo client
- [x] Retorna erro **500** se der erro ao tentar criar a enquete
