# Mini payment api 

Projeto de exemplo para simular um sistema de pagamentos com NestJS, Prisma, PostgreSQL e RabbitMQ.

O objetivo é explorar uma arquitetura orientada a eventos, utilizando apenas o protocolo AMQP, e enfrentar desafios reais em mensageria, como:

 - Indempotência das mensagens

 - O que fazer quando uma mensagem não é entregue

 - Como lidar quando o servidor não responde ou demora a responder

 - Configuração e uso de filas DLX e TTL

 - Implementação de um sistema PUB/SUB

Além disso, o projeto busca demonstrar na prática como estruturar a infraestrutura de mensageria e lidar diretamente com o broker (RabbitMQ), entendendo o fluxo e os problemas comuns nesse tipo de arquitetura.

---

## Stack

- [NestJS](https://nestjs.com/) - Backend framework
- [Prisma](https://www.prisma.io/) - ORM para banco PostgreSQL
- [RabbitMQ](https://www.rabbitmq.com/) - Mensageria/Broker
- [Docker](https://www.docker.com/) - Orquestração com Docker Compose

---

## Pré-requisitos

- Docker e Docker Compose
- (Opcional) Node.js 20+ caso queira rodar localmente

---

## Como rodar o projeto

### 1. Clone o repositório
```bash
git clone https://github.com/seu-user/payment-system.git
cd payment-system
```

### 2. Suba todos os serviços com Docker
```bash
docker compose up --build -d
```
---
## Isso vai iniciar:

App NestJS em http://localhost:3000

Postgres em localhost:5432

RabbitMQ em localhost:5672

Painel RabbitMQ em http://localhost:15672 (user: guest / pass: guest)

---

### 3. Configure variáveis de ambiente

### 4. Rodar migrations dentro do container

```bash
docker compose run --rm app npx prisma generate
docker compose exec app npx prisma migrate dev
```

Se precisar resetar tudo:
```bash
docker compose exec app npx prisma migrate reset
```
