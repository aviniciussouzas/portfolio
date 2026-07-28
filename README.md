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
2. **Colagens dos 4 projetos** — em `index.html` (thumbs da home), em cada `cases/*.html` (`.case-hero-collage`) e nas galerias de cada case (`.gallery-grid`) — mesmo padrão, troque o comentário pela `<img>` ou `<video>`.
3. **Fotos das páginas Sobre e Contato** — `.about-photo` (home), `.about-page-photo` (sobre.html).
4. **Ficha técnica de cada case** — campos `[entre colchetes]` como ano, equipe e nomes de colaboradores (deixei em branco de propósito, já que você trabalha em parceria e eu não inventaria nomes).
5. **Thumbs da página Experimentos** e **links reais do Substack** na página Escritos.
6. **Textos com `[colchetes]`** no case do CorpX × MT Pagamentos — preencha com o contexto de negócio específico.

## Sobre a Galeria de cada case

Optei por **grid de imagens, não carrossel**, de propósito: carrossel esconde conteúdo atrás de clique e é um clichê de site institucional — briga com a autoridade pela contenção da direção que você escolheu. A galeria já suporta vídeo (`<video>` com `muted loop autoplay playsinline` — necessário pra autoplay funcionar em navegador) e os tamanhos dos itens variam (`.span-2`, `.span-3`, `.span-4`) pra evitar grid monótono tipo mosaico de Instagram.

## Integração com o Substack

A página `escritos.html` (e a seção "Escritos Recentes" da home) busca os posts **de verdade** direto do seu Substack (`aviniciuss.substack.com/feed`), via uma função serverless em `api/substack-feed.js`. Isso significa:

- **Atualiza sozinho.** Quando você publica um post novo no Substack, ele aparece no site sem você precisar editar HTML.
- **Só funciona depois do deploy no Vercel** (ou rodando `vercel dev` localmente) — se você só abrir o `index.html` direto no navegador (ou usar Live Server), a seção de escritos vai mostrar o link de fallback pro Substack, porque não existe servidor rodando a função em `api/`.
- **Limitação do RSS**: o feed do Substack normalmente traz só os posts mais recentes (a função já pega até 12). Se um dia você quiser o arquivo histórico completo, isso precisaria de outra abordagem (API paga do Substack ou scraping — não recomendo scraping).
- Não precisa instalar nada extra — a função usa só `fetch` nativo do Node.js (Vercel já roda Node 18+, que tem fetch built-in).

## Cor de acento

O azul que você escolheu (`#1D3E8C`) já está em `css/tokens.css`, na variável `--accent`. Se quiser ajustar o tom depois, é só mudar ali — o valor se propaga pro site inteiro.

## Rodando localmente

Não precisa de servidor nem build. Só abrir `index.html` no navegador, ou usar a extensão **Live Server** do VSCode pra ter recarregamento automático enquanto edita.

## Deploy

1. `git init` na pasta, commit, push pra um repo no GitHub
2. Conectar o repo no Vercel (Import Project)
3. Framework preset: **Other** (é HTML estático, sem build command necessário)
4. Configurar o nome do projeto no Vercel antes de compartilhar o link (evita sufixo aleatório tipo `-xk29fh`)
