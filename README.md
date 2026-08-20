# DI Festas e Decorações — Gerador de Contratos

Ferramenta simples para preencher os dados de um cliente/evento e gerar o
contrato em PDF, sem precisar digitar tudo manualmente toda vez. Guarda um
histórico dos contratos já gerados.

Não tem servidor, não tem banco de dados externo, não tem login: é uma
página que roda inteiramente no navegador (celular ou computador) e guarda
os contratos no próprio dispositivo. Pode ser publicada de graça no GitHub
Pages.

## Como funciona (resumo)

- Você preenche o formulário (dados do contratante, evento, itens/orçamento,
  pagamento e observações).
- Clica em **"Salvar e gerar PDF"**: o contrato é salvo no histórico e abre
  numa aba pronta para impressão — nessa aba, escolha **"Salvar como PDF"**
  no diálogo de impressão do navegador.
- A lista de contratos fica salva neste navegador/dispositivo (usando um
  banco SQLite rodando localmente, via `sql.js` + IndexedDB). Dá pra buscar,
  editar, duplicar (para reaproveitar dados de um contrato parecido) e
  excluir.
- Como os dados ficam só no navegador, existe um botão de **backup** (baixa
  um arquivo `.sqlite`) e de **restaurar backup** — use isso de vez em
  quando para não perder o histórico se limpar os dados do navegador ou
  trocar de celular/computador.

## Publicar no GitHub Pages (passo a passo)

1. Crie um repositório novo no GitHub (pode ser privado) e envie este
   projeto para ele:
   ```bash
   git init
   git add .
   git commit -m "Versão inicial"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
   git push -u origin main
   ```
2. No GitHub, vá em **Settings → Pages** do repositório e, em **Build and
   deployment → Source**, selecione **GitHub Actions**.
3. Pronto. O workflow em `.github/workflows/deploy.yml` já está configurado
   para, a cada `git push` na branch `main`, instalar as dependências,
   gerar o build e publicar automaticamente. Acompanhe em **Actions** — a
   primeira publicação demora um a dois minutos.
4. Depois que o workflow terminar, o endereço do site aparece em
   **Settings → Pages** (algo como
   `https://SEU-USUARIO.github.io/SEU-REPOSITORIO/`). É esse link que você
   passa para a pessoa que vai usar — pode salvar como atalho na tela
   inicial do celular, funciona como um aplicativo.

Não é preciso configurar mais nada: o projeto usa caminhos relativos, então
funciona tanto num domínio próprio quanto na subpasta padrão do GitHub
Pages.

## Rodar localmente (para testar/editar antes de publicar)

Requer [Node.js](https://nodejs.org) instalado.

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

Para gerar o build de produção manualmente (o mesmo que o GitHub Actions
faz):

```bash
npm run build
npm run preview
```

## Editar os dados fixos da empresa (CONTRATADA)

Abra `src/config.ts` e edite os campos abaixo, depois publique de novo
(`git add . && git commit -m "Atualiza dados da empresa" && git push` — o
GitHub Actions publica sozinho):

```ts
export const COMPANY_CONFIG = {
  name: "DI FESTAS E DECORAÇÕES",
  address: "Rua Antônio Bandeira, nº 87, Aquiraz/CE",
  representativeName: "",
  representativeCpf: "",
};
```

## Editar o texto do contrato

O texto completo do contrato (as cláusulas fixas) fica em
`templates/contract-template.html`. Os trechos entre `{{chaves duplas}}`
são os campos preenchidos pelo formulário — não remova essas marcações,
mas o resto do texto pode ser editado livremente.

## Limitações importantes (por ser 100% no navegador)

- **O histórico não é compartilhado entre dispositivos.** Se a pessoa usar
  o site no celular e depois no computador, são dois históricos separados.
  Use sempre o mesmo dispositivo/navegador para o dia a dia, ou baixe um
  backup e restaure no outro aparelho.
- **Limpar os dados do navegador (ou trocar de celular) apaga o
  histórico.** Baixe um backup periodicamente (botão "Baixar backup" na
  tela inicial) e guarde num lugar seguro (ex.: Google Drive, e-mail).
- **Não existe login.** Qualquer pessoa com o link consegue abrir e ver o
  histórico de contratos salvos *naquele navegador*. Como não há servidor,
  não há como restringir por senha nesta versão — se isso vier a ser
  necessário, dá para adicionar depois.
- **Sem assinatura eletrônica.** Esta versão só gera o PDF para impressão
  ou assinatura manual/física; não envia link de assinatura para o
  cliente.

## Estrutura do projeto

```
templates/contract-template.html   Texto fixo do contrato (HTML com {{placeholders}})
src/
  config.ts                        Dados fixos da empresa (CONTRATADA)
  types/contract.ts                Tipos e valores padrão do formulário
  lib/
    extenso.ts                     Conversão de valor numérico para "por extenso"
    format.ts                      Formatação de datas (pt-BR)
    template-engine.ts             Motor de template ({{var}}, {{#if}}, {{#each}})
    pdf.ts                         Monta o HTML do contrato e abre para impressão
  db/
    schema.sql                     Esquema da tabela "contracts" (SQLite)
    database.ts                    CRUD do histórico (sql.js + IndexedDB)
  components/
    Section*.tsx                   Seções do formulário (contratante, evento, orçamento...)
    ContractForm.tsx                Formulário completo (novo/editar contrato)
    ContractList.tsx                Lista/histórico de contratos
    BackupControls.tsx              Baixar/restaurar backup do banco
  App.tsx                          Tela única (lista ↔ formulário)
.github/workflows/deploy.yml       Publica automaticamente no GitHub Pages
```
