# Estratégia de testes

Objetivo prático: não quebrar CRUD e filtros quando mexermos no código, sem gastar o sprint inteiro só em teste.

## Prioridade (com tempo curto)

1. **Integração** nas rotas principais: criar escola, listar com filtro, buscar por id, atualizar. Isso já cobre o contrato da API.
2. **Unitário** onde houver validação (campos obrigatórios, valores inválidos para status).
3. **E2E** só se existir interface web estável e sobrar tempo; senão o vídeo das sprints usa teste manual + rotação dos testes automatizados da API.

## Ferramentas atuais no repositório

- Vitest para unitário e integração (supertest ou equivalente quando encostarmos HTTP).
- E2E: a definir (Playwright/Cypress) **se** fizermos front dedicado.

## O que entramos como “cobertura adequada” para nós

- Fluxos RF01–RF07 cobertos por teste automatizado **onde couber** (prioridade API).
- Sem obsessão em percentual no relatório se o tempo apertar; o importante é não deixar o núcleo do sistema sem teste nenhum.

## Pastas

- `tests/unit` — validações e pedaços pequenos sem HTTP.
- `tests/integration` — rotas + persistência em ambiente de teste.
- `tests/e2e` — fluxo completo na interface, se existir.

Casos nomeados nos arquivos são placeholders; substituímos por asserts na implementação.
