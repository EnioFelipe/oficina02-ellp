# Sistema de Controle de Oficinas - ELLP

## Descrição do Projeto

Este projeto tem como objetivo desenvolver um sistema para **controle de oficinas** no contexto do projeto de extensão **ELLP (Ensino Lúdico de Lógica e Programação)**.
A aplicação permitirá gerenciar participantes, oficinas e atividades, facilitando a organização e o acompanhamento das ações realizadas no projeto.

Este trabalho faz parte da disciplina **Oficina de Integração 2**, com foco na integração de conhecimentos adquiridos ao longo do curso.

---

## Objetivo

Desenvolver uma aplicação web completa que permita o gerenciamento eficiente de oficinas, incluindo cadastro de usuários, controle de participação e emissão de certificados.

---

## Integrantes

- Lucas Silva Teixeira
- Enio Felipe Botelho Miguel

---

## Tecnologias

- **Frontend:** React
- **Backend:** Node.js + Express
- **Banco de dados:** MongoDB
- **Autenticação:** Firebase Authentication + Firebase Admin SDK
- **Versionamento e gestão:** GitHub (issues, Projects/Kanban)
- **Metodologia:** Scrum, dividido em 2 sprints

---

## Arquitetura

Arquitetura em camadas separando interface, API e persistência:

```
[ Frontend React ] -> [ API Express ] -> [ MongoDB ]
                            |
                            +--> Firebase (Auth + Admin SDK)
```

---

## Estratégia de testes

Prioridade em testes de **integração da API**, complementados por testes **unitários** nas regras de negócio e **E2E** nos fluxos críticos quando a interface estiver estável.

---

## Requisitos funcionais (visão geral do produto)

| ID | Descrição |
|----|-----------|
| RF01 | Cadastro de usuários internos (professores e tutores) e inscrição pública de alunos. |
| RF02 | Gerenciamento de oficinas (criar, editar, listar e remover). |
| RF03 | Vinculação de tutores às oficinas e inscrição de alunos por CPF. |
| RF04 | Emissão de certificados em PDF para participantes de oficinas finalizadas. |
| RF05 | Consultas e relatórios: participantes por oficina, histórico e painel de totais. |

A divisão por sprint detalha como esses RFs são entregues abaixo.

---

## Sprint 01 - entregas

Base funcional do sistema: autenticação, controle de acesso por perfil, cadastro de usuários internos e gerenciamento inicial de oficinas, já integrando frontend, backend, Firebase e MongoDB.

| ID | Requisito |
|----|-----------|
| RFS1-01 | Cadastro de professor ou tutor com e-mail e senha (Firebase + perfil no MongoDB). |
| RFS1-02 | Login e carregamento do perfil do usuário autenticado para uso nas telas internas. |
| RFS1-03 | Envio do token nas chamadas protegidas, validado no backend pelo Firebase Admin. |
| RFS1-04 | Logout e bloqueio das páginas internas quando não houver usuário autenticado. |
| RFS1-05 | Permissões por perfil: professor gerencia usuários; professor e tutor gerenciam oficinas. |
| RFS1-06 | Consulta de usuários internos com busca por nome/e-mail e filtro por tipo. |
| RFS1-07 | Detalhe, edição e exclusão de usuários internos por professor. |
| RFS1-08 | Consulta pública das oficinas (lista e detalhe) sem exigir login. |
| RFS1-09 | Cadastro, edição e exclusão de oficinas por professor ou tutor. |
| RFS1-10 | Vínculo e remoção de tutores em uma oficina, evitando duplicidade. |

---
## Planejamento da Sprint 01

Período: 30/04 (reunião com o professor) → 15/05 (entrega da sprint).

| Período | Etapa | RFs |
| --- | --- | --- |
| 30/04 | Reunião com o professor: validação de escopo, arquitetura e tecnologias | — |
| 02-04/05 | Setup do projeto: Docker, MongoDB, estrutura inicial do backend (Express) e frontend (React + Vite), integração com Firebase | — |
| 05-07/05 | Cadastro, login e middleware de autenticação (token + proteção das telas internas) | RFS1-01, RFS1-02, RFS1-03, RFS1-04 |
| 08-10/05 | Permissões por perfil e gestão de usuários internos (consulta, detalhe, edição, exclusão) | RFS1-05, RFS1-06, RFS1-07 |
| 11-13/05 | Oficinas: consulta pública, CRUD e vínculo de tutores | RFS1-08, RFS1-09, RFS1-10 |
| 14/05 | Testes de integração da API, testes unitários nas regras de negócio e ajustes finais | — |
| 15/05 | Apresentação (10 min) e fechamento da Sprint 01 | — |

---



## Sprint 02 - entregas previstas

Conclusão do fluxo do aluno sem login, emissão de certificados e consultas de acompanhamento.

| ID | Requisito |
|----|-----------|
| RFS2-01 | Inscrição pública de aluno em oficina ativa (nome, idade, CPF, oficina), sem login. |
| RFS2-02 | Validação de CPF, idade e oficina na inscrição, com CPF sanitizado no backend. |
| RFS2-03 | Impedir inscrição duplicada do mesmo CPF na mesma oficina. |
| RFS2-04 | Bloquear novas inscrições quando a oficina estiver finalizada. |
| RFS2-05 | Consulta pública das inscrições por CPF. |
| RFS2-06 | Indicar disponibilidade do certificado conforme o status da oficina. |
| RFS2-07 | Consulta de inscritos de uma oficina por professor ou tutor autenticado. |
| RFS2-08 | Download público do certificado em PDF por oficina + CPF, com oficina finalizada. |
| RFS2-09 | Certificado com participante, oficina, carga horária, data e professor responsável. |
| RFS2-10 | Relatório de participantes por oficina (inscritos, tutores e total) para professor/tutor. |
| RFS2-11 | Histórico de oficinas para usuários autenticados. |
| RFS2-12 | Painel com totais de oficinas ativas/finalizadas e participantes. |
| RFS2-13 | Rate limit nas rotas públicas: inscrição, consulta por CPF e download de certificado. |
| RFS2-14 | Validação de entrada, tratamento global de erros, CORS configurável e `/health`. |

### Regras de negócio

- Aluno não precisa de conta; o fluxo público usa nome, idade e CPF.
- Inscrição só é aceita para oficina com status `ativa`.
- O mesmo CPF não pode ser inscrito duas vezes na mesma oficina.
- Certificado só é emitido para oficina `finalizada` e inscrição existente.
- Consulta de inscritos e relatório de participantes exigem perfil professor ou tutor.
- Histórico e painel exigem login, sem distinção entre os dois perfis.
- Rotas públicas sensíveis usam rate limit para reduzir abuso.

---

## Estrutura do projeto

```
/backend  -> API Express, regras de negócio e integração com Firebase/Mongo
/frontend -> Interface React e integração com a API
/docs     -> Documentação de apoio (arquitetura, testes)
```

---

## Como rodar

Requisitos: Node.js 20+, npm, Git e Docker.

### 1. Clonar

```bash
git clone https://github.com/EnioFelipe/oficina02-ellp.git
cd oficina02-ellp
```

### 2. Subir o MongoDB

```bash
docker compose up -d
```

Mongo em `mongodb://localhost:27017`. Para parar: `docker compose down`.

### 3. Firebase

Criar um projeto no [Firebase Console](https://console.firebase.google.com/), habilitar **Authentication > E-mail/senha** e gerar uma chave do **Admin SDK** (Configurações do projeto > Contas de serviço > Gerar nova chave privada).

Salvar o JSON baixado como `backend/serviceAccountKey.json`.

### 4. Backend

Criar `backend/.env`:

```
MONGODB_URI=mongodb://localhost:27017/oficina02
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
FRONTEND_URL=http://localhost:5173
PORT=4000
```

Subir a API:

```bash
cd backend
npm install
npm run dev
```

API em `http://localhost:4000`. Health check: `GET /health`.

### 5. Frontend

Criar `frontend/.env` com os dados do app web do mesmo projeto Firebase (Configurações do projeto > Seus apps > Web):

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
VITE_API_URL=http://localhost:4000
```

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

App em `http://localhost:5173`. Cadastro em `/cadastro`, login em `/login`, área interna em `/interno`.

### Testes

```bash
cd backend
npm test
```
