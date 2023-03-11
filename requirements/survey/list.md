# Listar enquetes

> ## Caso de sucesso

- [ ] Recebe uma requisição do tipo **GET** na rota **/api/surveys**
- [ ] Valida se a requisição foi feita por um **usuário**
- [ ] Retorna **204** se não tiver nenhuma enquete
- [ ] Retorna **200** com os dados das enquetes

> ## Exceções

- [ ] Retorna erro **404** se a API não existir
- [ ] Retorna erro **403** se não for um usuário
- [ ] Retorna erro **500** se der erro ao tentar listar as enquetes
