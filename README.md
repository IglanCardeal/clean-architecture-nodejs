# TDD + Clean Architecture Course

Essa API faz parte do treinamento do professor Rodrigo Manguinho (Mango) na Udemy.

O objetivo do treinamento é mostrar como criar uma API com uma arquitetura bem definida e desacoplada, utilizando TDD (programação orientada a testes) como metodologia de trabalho, Clean Architecture para fazer a distribuição de responsabilidades em camadas, sempre seguindo os princípios do SOLID e, sempre que possível, aplicando Design Patterns para resolver alguns problemas comuns.

[Link do curso](https://www.udemy.com/course/tdd-com-mango/?referralCode=B53CE5CA2B9AFA5A6FA1)

> ## Features disponibilizadas pela API

1. [Cadastro](./requirements/account/signup.md)
2. [Login](./requirements/account/login.md)
3. [Criar enquete](./requirements/survey/add.md)
4. [Listar enquetes](./requirements/survey/list.md)
5. [Responder enquete](./requirements/survey/save-survey-result.md)
6. [Resultado da enquete](./requirements/load-survey-result.md)

> ## Princípios

- Single Responsibility Principle (SRP)
- Open Closed Principle (OCP)
- Liskov Substitution Principle (LSP)
- Interface Segregation Principle (ISP)
- Dependency Inversion Principle (DIP)
- Separation of Concerns (SOC)
- Don't Repeat Yourself (DRY)
- You Aren't Gonna Need It (YAGNI)
- Keep It Simple, Silly (KISS)
- Composition Over Inheritance
- Small Commits

> ## Design Patterns

- Factory
- Adapter
- Composite
- Decorator
- Proxy
- Dependency Injection
- Abstract Server
- Composition Root
- Builder
- Singleton

> ## Metodologias e Designs

- TDD
- Clean Architecture
- DDD
- Conventional Commits
- GitFlow
- Modular Design
- Dependency Diagrams
- Use Cases
- Continuous Integration
- Continuous Delivery
- Continuous Deployment

---

## Local Tests

Abaixo, as rotas com seus respectivos cURL e response (em caso de sucesso) body para que seja usado como referência para testes locais:

- `[POST] /api/account/signup`: Para efetuar cadastro de novos usuários.

  **cURL**:

  ```bash
  curl --location 'http://localhost:3000/api/account/signup' \
  --header 'content-type: application/json' \
  --header 'user-agent: vscode-restclient' \
  --data-raw '{
      "name": "Foo",
      "email": "foo2@email.com",
      "password": "123foo",
      "passwordConfirmation": "123foo"
  }'
  ```

  **Response**:

  ```json
  {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2NWZmM2E4NTU1YmU5ZDY5OWUxOWEwN2QiLCJpYXQiOjE3MTEyMjU0Nzh9.f6VekaYCHjRC-cHAw4XkEu3zmg7xy-xXs5k8Z-U1jDE"
  }
  ```

- `[POST] /api/account/login`: Para efetuar login de usuário.

  **cURL**:

  ```bash
  curl --location 'http://localhost:3000/api/account/login' \
  --header 'content-type: application/json' \
  --header 'user-agent: vscode-restclient' \
  --data-raw '{
      "email": "foo5@email.com",
      "password": "123foo"
  }'
  ```

  **Response**:

  ```json
  {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2NWZmODRkN2ZmYzVkZmY2ZDY5MmM5NDAiLCJpYXQiOjE3MTEyNDQ1MDh9.HOG0iTCXg6VkWVH-wU4kLLFkhRUR23NIoqe1QxxEelc"
  }
  ```

- `[POST] /api/surveys`: Para cadastro de novas pesquisas.

  **cURL**:

  ```bash
  curl --location 'http://localhost:3000/api/surveys' \
  --header 'content-type: application/json' \
  --header 'user-agent: vscode-restclient' \
  --header 'x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2NTg2MzEzNWQxZmM0ODM2NTAxYzM3ODYiLCJpYXQiOjE3MTEyMjEwNzN9.cNvBX2XkWtSGTeTH5MhHJ73YrR1yAWAuFhcH9xeuvYY' \
  --data '{
      "question": "Any question",
      "answers": [
          {
              "image": "image-name",
              "answer": "Any answer"
          }
      ]
  }'
  ```

  **Response (no content - 204)**:

  ```json
  {}
  ```

- `[PUT] /api/surveys/{surveyId}/results`: Para cadastro de resposta de pesquisa.

  **cURL**:

  ```bash
  curl --location --request PUT 'http://localhost:3000/api/surveys/65ff2accfc779e823a1d8860/results' \
  --header 'content-type: application/json' \
  --header 'user-agent: vscode-restclient' \
  --header 'x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2NTg2MzEzNWQxZmM0ODM2NTAxYzM3ODYiLCJpYXQiOjE3MTEyMjEwNzN9.cNvBX2XkWtSGTeTH5MhHJ73YrR1yAWAuFhcH9xeuvYY' \
  --data '{
      "answer": "JQuery"
  }'
  ```

  **Response**:

  ```json
  {
      "surveyId": "any_survey_id",
      "question": "any_question",
      "date": "2024-03-23T19:57:07.107Z",
      "answers": [
          {
              "answer": "any_answer",
              "image": "any_url",
              "count": 1,
              "percent": 50
          },
          {
              "answer": "other_answer",
              "image": "other_url",
              "count": 1,
              "percent": 50
          }
      ]
  }
  ```

## Problemas

Caso ocorra um erro ao executar os commits devido ao `husky` ou aos `git hooks`, como:

> hint: The '.husky/pre-commit' hook was ignored because it's not set as executable.
> hint: You can disable this warning with `git config advice.ignoredHook false`.

Este erro provavelmente deve ter sido causado por erro de permissão ao acessar o disco.

Para resolvê-lo, tente executar (em um ambiente linux) os comandos para liberar execução do `husky` e dos `git hooks`:

```bash
[~/clean-architecture-nodejs]$ chmod ug+x .husky/*
[~/clean-architecture-nodejs]$
[~/clean-architecture-nodejs]$ chmod ug+x .git/hooks/*
[~/clean-architecture-nodejs]$
```

Ref: <https://stackoverflow.com/questions/8598639/why-is-my-git-pre-commit-hook-not-executable-by-default>
