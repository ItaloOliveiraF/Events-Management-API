# Events API

## 💻 Índice
- [Sobre o projeto](#-sobre-o-projeto)
- [Tecnologias utilizadas](#-tecnologias-utilizadas)
- [Instalação e uso](#-instalação-e-uso)
- [Funcionalidades e regras de negócio](#-funcionalidades-e-regras-de-negócio)

## 👀 Sobre o projeto

Esse projeto foi planejado e desenvolvido com o intuito de praticar os conceitos de NodeJS aprendidos durante o curso **Ignite**. Na versão atual desse projeto, o foco foi o desenvolvimento de rotas e requisições HTTP utilizando o express.js, bem como a aplicação de middlewares.

## 🚀 Tecnologias utilizadas

- [NodeJS](https://nodejs.org/en/)
- [ExpressJS](https://expressjs.com/)

## ⛏ Instalação e uso

Antes de iniciar a utilizar a API, certifique-se de ter o **yarn** instalado no seu computador.

Com o yarn disponível, basta seguir os seguintes passos:

```bash
 #Clonar o repositório do Github
 $ git clone https://github.com/ItaloOliveiraF/Events-Management-API.git

 # Entrar na pasta do projeto
 $ cd Events-Management-API

 # Instalar as dependências
 $ yarn

 # Executar a aplicação
 $ yarn dev
```

O servidor então será iniciado no endereço `http://localhost:3333`. Para testar as requisições podem ser utilizados softwares como o [insomnia](https://insomnia.rest/download) ou o [postman](https://www.postman.com/).

## ✅ Funcionalidades e regras de negócio

### Funcionalidades
É permitida a criação de novos usuários com `name`  e `email` . Além disso também é possível realizar o CRUD completo de *cursos* e *eventos:*

- Criar um novo evento
- Listar todos os eventos
- Buscar um curso ou evento pelo `id`
- Buscar cursos e eventos por um trecho do nome
- Editar `name`, `description`, `location`, `type`, `price`, `date` e `totalAmountOfTickets` de um evento
- Remover um evento

Além disso, também é possível realizar o CRUD de ingressos:

- Criar um ingresso para um usuário em um evento
- Listar todas os ingressos
- Listar os ingressos por evento
- Listar os ingressos por usuário
- Editar o `checkPayment` de um ingresso
- Remover um ingresso

## Regras de negócio
As seguintes regras de negócio são atendidas pela aplicação:
- Não é possível cadastar novos usuários com um `email` repetido
- Não é possível buscar um evento inexistente
- Não é possível criar um ingresso para um usuário OU evento inexistente
- Não é possível busca um ingresso inexistente
- Não é possível criar um novo ingresso para um evento caso a quantidade de ingressos para esse evento já tenha atingido o valor da propriedade `totalAmountOfTickets` desse evento.

---

Desenvolvido 💥 por Ítalo Oliveira Fernandes 💚

