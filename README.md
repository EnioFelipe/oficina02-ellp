# Oficina 02 — Controle de escolas participantes

## Contexto

O projeto da disciplina pede um sistema em torno de um dos núcleos definidos no Moodle. Escolhemos **cadastro e acompanhamento das escolas que participam da ação** (parcerias com o projeto).

### Por que esse tema

O domínio é pequeno: basicamente **escola**, **contato** e **situação da parceria**. Evita formulários enormes (tipo levantamento socioeconômico) e fluxos mais pesados (tipo vagas em oficina ou escala de voluntários), que exigiriam mais regra de negócio e mais teste no mesmo prazo.

Com pouco código já dá para mostrar algo utilizável: lista com filtro, cadastro/edição, tela de detalhe e um resumo por município ou por status — suficiente para entrega e vídeo das sprints.

### Escopo combinado para validação (MVP)

- CRUD de escolas participantes.
- Filtros simples na listagem (ex.: município, nome, status).
- Um relatório agregado simples (contagens por município e/ou por status da parceria).

**Opcional na segunda sprint** (se der tempo): vincular escola a uma **ação/evento** genérico (uma entidade só), sem montar outro sistema paralelo.

Stack e ferramentas do repositório são **provisórias** até fechar com o professor.

### Documentação

- `docs/requisitos-funcionais.md`
- `docs/arquitetura.md`
- `docs/estrategia-testes.md`

## Pré-requisitos

- Node.js 20+

## Como rodar

```bash
npm install
copy .env.example .env
npm run dev
```

(No Git Bash/Linux use `cp` no lugar de `copy`.)

Build:

```bash
npm run build
npm start
```

## Testes

```bash
npm test
npm run test:watch
```

## Docker

Opcional — Postgres local (`docker compose up -d`) quando formos ligar persistência.

## CI

`.github/workflows/ci.yml` — roda testes em push/PR nas branches `main` ou `master`.
