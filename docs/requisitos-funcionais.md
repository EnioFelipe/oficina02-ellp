# Requisitos funcionais — escolas participantes

Versão rascunho para **reunião de validação** com o professor. Ajustamos IDs e texto conforme o feedback.

## Visão geral

Sistema para registrar escolas parceiras do projeto, consultar, alterar e ver um resumo por filtros. Usuário principal pensado: **coordenação** (um perfil só no MVP, login pode ficar para depois se combinado).

## Dados principais (proposta)

| Campo | Observação |
|-------|------------|
| Nome da escola | Obrigatório |
| Município | Obrigatório |
| Contato (nome / telefone / e-mail) | Pelo menos um meio de contato obrigatório — definir na implementação |
| Status da parceria | Ex.: ativa / suspensa / encerrada (rótulos podem mudar) |
| Observação | Opcional, texto curto |

## Requisitos

| ID | Descrição |
|----|-----------|
| RF01 | Incluir escola com validação dos campos obrigatórios. |
| RF02 | Listar escolas com paginação ou limite razoável (evitar lista gigante de uma vez). |
| RF03 | Filtrar por município e/ou status e/ou trecho do nome. |
| RF04 | Exibir detalhe de uma escola escolhida na lista. |
| RF05 | Alterar dados da escola. |
| RF06 | Encerrar/remover do cadastro conforme regra combinada (exclusão lógica ou exclusão física — alinhar com o professor). |
| RF07 | Tela ou endpoint de **resumo**: totais por município e por status da parceria. |

## Fora do MVP (ideia para sprint 2)

| ID | Descrição |
|----|-----------|
| RF08 | Registrar vínculo escola ↔ ação/evento genérico (campos mínimos do evento). |

## Requisitos não funcionais (mínimo)

- Resposta utilizável em uso manual (sem meta de milissegundo).
- Dados persistentes em banco quando a API existir (SQLite ou Postgres local — definir na implementação).

Pontos em aberto para a reunião: autenticação, LGPD (quanto detalhar no cadastro de contato), formato de exportação se o professor exigir relatório em arquivo.
