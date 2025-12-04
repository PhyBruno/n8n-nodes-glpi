# n8n-nodes-glpi

GLPI REST API node for n8n — GLPI 10.x compatible — **Criteria Builder** + **automatic session** (no cache).

**Features**
- Automatic `initSession` on each execution (no cache) — você não precisa chamar Get Session Token manualmente.
- Criteria Builder: adicione múltiplos critérios e envie `criteria[n][...]` corretamente.
- Operações suportadas (v1):
  - initSession
  - killSession (force logout)
  - search (generic) — Criteria Builder
  - getTickets (convenience)
  - listSearchOptions
  - getItem (GET /:itemtype/:id)
  - getTicketFollowup
  - getTicketSolution
  - getTicketTasks
  - getUserById
  - getUserByEmail (helper)
  - createTicket (POST /Ticket/)
  - updateTicket (PUT /Ticket/:id)
  - addFollowup (POST /Ticket/:id/ITILFollowup)
  - addSolution (POST /ITILSolution/)

> Implementação obtida e revisada com base na documentação oficial do GLPI (initSession é GET; listSearchOptions/search endpoints e uso de headers). :contentReference[oaicite:1]{index=1}

---

## Instalação (local / desenvolvimento)

1. Coloque a pasta `n8n-nodes-glpi` no seu workspace.
2. `npm install`
3. `npm run build`
4. No n8n (instância), instale o pacote (opções):
   - Link local: `npm link` no pacote e `npm link n8n-nodes-glpi` na instância do n8n.
   - Ou publique no npm e `npm install n8n-nodes-glpi` no n8n.
5. Reinicie o n8n.

---

## Credenciais

Crie credenciais do tipo **GLPI API** no n8n com:

- Base URL: `https://seu-glpi.exemplo` (sem `/apirest.php`)
- App Token (obrigatório)
- User Token (opcional) — se presente, usará `Authorization: user_token <token>`
- Username/Password (opcional) — se não usar userToken, o node usa Basic Auth

---

## Como usar (exemplos)

### 1) Init Session (operação manual — raramente precisa)
- Operation: `Init Session`
- Executar → retorna objeto com `session_token`.

### 2) Search com Criteria Builder
- Operation: `Search`
- Entity: `Ticket`
- Criteria:
  - Field: `19`
  - Search type: `morethan`
  - Value: `={{ (() => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().split('T')[0] + ' 00:00:00'; })() }}`
  - Glue: `AND`
- Range: `0-500`

> O node monta parâmetros do tipo `criteria[n][...]` e envia para `/apirest.php/search/Ticket`. Exemplo:
>
> `criteria[0][field]=...&criteria[0][searchtype]=...&criteria[0][value]=...&criteria[0][glue]=AND&range=0-50`
>
> (Nota: o operador lógico é enviado em `criteria[n][glue]` — ajuste apenas se sua versão da API exigir outra chave.)

--- 

## Headers gerados (exemplo)
- Sempre: `App-Token: <appToken>`
- Se `userToken` presente: `Authorization: user_token <userToken>`
- Se usar username/password: Basic Auth via `auth` (não envia header Authorization direto, usa credenciais HTTP)

--- 

## Testar localmente (recomendações rápidas)
1. Build:
```bash
npm install
npm run build
```
2. Gerar tarball e instalar na instância do n8n:
```bash
npm pack
# copia o .tgz para o host do n8n e, no diretório do n8n:
npm install /caminho/para/n8n-nodes-glpi-1.0.0.tgz
# reinicie o n8n
```

--- 

## Publicação
- Adicione em package.json: `"files": ["dist"]`, `repository`, `bugs` e `homepage`.
- Mantenha `n8n-core` e `n8n-workflow` como peerDependencies e instale-os como devDependencies para desenvolvimento.
- Use `npm publish --access public` após verificar o tarball (`npm pack`) localmente.

# Troubleshooting rápido
- Erro TS no VS Code: instale devDependencies (`n8n-core`, `n8n-workflow`, `@types/node`, `typescript`) e reinicie o TS Server (Ctrl+Shift+P → TypeScript: Restart TS Server).
- Se o node não aparecer no n8n, verifique se `dist/index.js` existe e se instalou o pacote na instância do n8n; reinicie o serviço n8n.

# Licença / Contribuição
- Inclua LICENSE e um link para issues/PRs no package.json.
