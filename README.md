# TDD + Clean Architecture Course

## Utils

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

```none
- src
  - domain
    |_ entities<I>
    |_ value objects
  - infra
    |_ crypto
    |_ JWT
    |_ Databases (Redis, MongoDB,...)
    |_ Email
  - repositories
    |_ database<I>
  - providers
    |_ external services<I>
    |_ JWT<I>
    |_ Hasher<I>
  - useCases
    |_ User
       |_ CreateUserUseCase
       |_ CreateUserController
       |_ CreateUserUseCaseDTO
       |_ CreateUserUseCase.test
       |_ CreateUserUseCase.result
  - shared
  - utils
  - main
```
