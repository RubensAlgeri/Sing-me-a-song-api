# <p align = "center"> Sing me a Song </p>

<p align="center">
   <img width="250px" src="https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter/1f399-fe0f.svg"/>
</p>

<p align = "center">
   <img src="https://img.shields.io/badge/author-RubensAlgeri-4dae71?style=flat-square" />
   <img src="https://img.shields.io/github/languages/count/RubensAlgeri/projeto21-singmeasong-back?color=4dae71&style=flat-square" />
</p>


##  :clipboard: Descrição

Este é um projeto full-stack que armazena, classifica e reproduz links do YouTube. Ele também possui testes e2e, integração e de unidade. [Repositório da interface](https://github.com/RubensAlgeri/projeto21-singmeasong-front)

***

## :computer:	 Tecnologias e Conceitos

- REST APIs
- Node.js
- TypeScript

***

## :rocket: Rotas

```yml
- POST /recommendations
    - Route to register a new recommendation link
    - headers: {}
    - body: {
        "name": "Some no-repeated name",
        "youtubeLink": "https://youtu.be/..." || "https://youtube.com/..."
    }
```

```yml
- GET /recommendations
    - Route to get a list of 10 recommendations
    - headers: {}
    - body: {}
```

```yml
- GET /recommendations/top/:amount
    - Route to get a list of the top amount of recommendations
    - headers: {}
    - body: {}
```

```yml
- GET /recommendations/:id
    - Route to get the recommendation with the corresponding id
    - headers: {}
    - body: {}
```

```yml
- POST /recommendations/:id/upvote
    - Route to increase the score of the recommendation with the corresponding id by 1
    - headers: {}
    - body: {}
```

```yml
- POST /recommendations/:id/downvote
    - Route to decrement the score of the recommendation with the corresponding id by 1
    - headers: {}
    - body: {}
```

## :rocket: Rota Exclusiva para teste

```yml
- DELETE /reset-database
    - Route to erase all database
    - headers: {}
    - body: {}
```

***

## 🏁 Testando a aplicação

- Teste de Integração

```bash
$ npm run test:integration
```

- Teste unitário:

```bash
$ npm run test:unit
```

- Teste completo:

```bash
$ npm run test
```

- Para poder rodar os teste do front-end:

```bash
$ npm run dev:test
```

## 🏁 Rodando a aplicação


Primeiro, faça o clone desse repositório na sua maquina:

```
git clone https://github.com/RubensAlgeri/projeto21-singmeasong-back
```

Depois, dentro da pasta, rode o seguinte comando para instalar as dependencias.

```
npm install
```

Finalizado o processo, é só inicializar o servidor
```
npm start
```

:stop_sign: Não esqueça de repetir os passos acima com o [repositório](https://github.com/RubensAlgeri/projeto21-singmeasong-front) que contem a interface da aplicação, para testar o projeto por completo.
