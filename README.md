# TDD + Clean Architecture Course

Essa API faz parte do treinamento do professor Rodrigo Manguinho (Mango) na Udemy.

O objetivo do treinamento é mostrar como criar uma API com uma arquitetura bem definida e desacoplada, utilizando TDD (programação orientada a testes) como metodologia de trabalho, Clean Architecture para fazer a distribuição de responsabilidades em camadas, sempre seguindo os princípios do SOLID e, sempre que possível, aplicando Design Patterns para resolver alguns problemas comuns.

[Link do curso](https://www.udemy.com/course/tdd-com-mango/?referralCode=B53CE5CA2B9AFA5A6FA1)

> ## Features disponibilizadas pela API

1. [Cadastro](./requirements/signup.md)
2. [Login](./requirements/login.md)
3. [Criar enquete](./requirements/add-survey.md)
4. [Listar enquetes](./requirements/load-surveys.md)
5. [Responder enquete](./requirements/save-survey-result.md)
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

#### Problemas

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

Ref: https://stackoverflow.com/questions/8598639/why-is-my-git-pre-commit-hook-not-executable-by-default
