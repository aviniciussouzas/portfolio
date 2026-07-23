# Portfólio — Andrê Vinicius (AVS)

Estrutura pronta pra abrir direto no VSCode. HTML/CSS puro, sem build step — só abrir e já funciona.

## Estrutura

```
/
├── index.html              → home
├── css/
│   ├── tokens.css          → cores, tipografia, escala (mexa aqui pra ajustar a direção)
│   ├── base.css            → reset, tipografia base
│   ├── layout.css          → nav, hero, grid de projetos, sobre, footer
│   └── case.css            → estilos específicos das páginas de projeto
├── js/
│   └── main.js             → relógio ao vivo (São Paulo) no header
├── cases/
│   ├── _template.html      → modelo em branco pra criar novos cases
│   ├── corpx-mt-pagamentos.html
│   ├── sinal.html
│   ├── economia-viva.html
│   └── tipo-sensivel.html
└── assets/
    ├── colagens/            → coloque suas colagens aqui (capa de cada case + thumb da home)
    └── foto/                → sua foto editorial (retrato do hero + still-life da seção Sobre)
```

## O que falta você preencher

1. **Foto do hero** (`index.html`, dentro de `.hero-portrait`) — troque o comentário pela tag `<img>` apontando pra sua foto em `assets/foto/`.
2. **Colagens dos 4 projetos** — em `index.html` (thumbs da home) e em cada `cases/*.html` (`.case-hero-collage`) — mesmo padrão, troque o comentário pela `<img>`.
3. **Foto still-life da seção Sobre** — `.about-photo` no `index.html`.
4. **Páginas que ainda não existem**: `sobre.html`, `experimentos.html`, `escritos.html`, `contato.html` — o nav já aponta pra elas, mas os arquivos ainda não foram criados. Posso montar essas quando quiser.
5. **Textos com `[colchetes]`** no case do CorpX × MT Pagamentos — preencha com o contexto de negócio específico (não inventei nada que você não tinha me contado).

## Cor de acento

O azul que você escolheu (`#1D3E8C`) já está em `css/tokens.css`, na variável `--accent`. Se quiser ajustar o tom depois, é só mudar ali — o valor se propaga pro site inteiro.

## Rodando localmente

Não precisa de servidor nem build. Só abrir `index.html` no navegador, ou usar a extensão **Live Server** do VSCode pra ter recarregamento automático enquanto edita.

## Deploy

1. `git init` na pasta, commit, push pra um repo no GitHub
2. Conectar o repo no Vercel (Import Project)
3. Framework preset: **Other** (é HTML estático, sem build command necessário)
4. Configurar o nome do projeto no Vercel antes de compartilhar o link (evita sufixo aleatório tipo `-xk29fh`)
