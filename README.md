<h1 align="center"> Data Convertion </h1>

<p align="center">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/luanoliveira98/Data-Convertion?color=%2304D361"/>
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/luanoliveira98/Data-Convertion">
  <a href="https://github.com/luanoliveira98/Data-Convertion/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/luanoliveira98/Data-Convertion">
  </a>
  <img alt="License" src="https://img.shields.io/badge/license-MIT-brightgreen">
  <img src="https://img.shields.io/static/v1?label=Made%20with&message=Typescript&color=007acc"/>
</p>

<p align="center">
 <a href="#⚓-pre-requisites">Pre-requisites</a> •
 <a href="#💾-running-the-code">Running the code</a> •
 <a href="#🛠️-tech-stack">Tech Stack</a> • 
 <a href="#author">Author</a> • 
 <a href="#license">License</a>
</p>

### ⚓ Pre-requisites

Before you begin, you will need to have the following tools installed on your machine:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/), [yarn](https://yarnpkg.com/), [Docker](https://www.docker.com/).
In addition, it is good to have an editor to work with the code like [VSCode](https://code.visualstudio.com/)

### 💾 Running the code

```bash

#clone this repository
$ git clone git@github.com:luanoliveira98/Data-Convertion.git

# Acess the project folder cmd/terminal
$ cd Data-Convertion

# Install the dependencies
$ yarn

# Duplicate .env.example with name .env and fill the necessary variables

# Run the database
$ docker-compose up -d

# Generate schema types
$ yarn db:prisma:generate

# Run the application
$ yarn start:dev

# Run all tests
$ yarn test

# Run e2e tests
$ yarn test:e2e

# Run unit tests
$ yarn test:unit

# The server will start at port: 3333 - go to http://localhost:3000

```

## 🛠️ Tech Stack

- **[Node](https://nodejs.org/en/)**
- **[Typescript](https://www.typescriptlang.org/)**
- **[NestJs](https://nestjs.com/)**

## Author

---

<a href="https://github.com/luanoliveira">
 <img style="border-radius: 50%;" src="https://github.com/luanoliveira98.png" width="100px;" alt=""/>
 <br />
 <sub><b>Luan Oliveira</b></sub>
</a>

[![Linkedin Badge](https://img.shields.io/badge/-LinkedIn-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/luan-oliveira-saldanha/)](https://www.linkedin.com/in/luan-oliveira-saldanha/)
[![Gmail Badge](https://img.shields.io/badge/-Gmail-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:luanoliveiraltda@gmail.com)](mailto:luanoliveiraltda@gmail.com)

---

## License

This project is under the license [MIT](./LICENSE).

Made with ❤️ by Luan Oliveira 👋🏽 [Get in Touch!](Https://www.linkedin.com/in/luan-oliveira-saldanha/)
