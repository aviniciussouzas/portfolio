// Vercel Serverless Function
// Busca o feed RSS do Substack no servidor (evita CORS) e devolve
// uma lista simples em JSON pro front-end consumir.
// Rota final, depois do deploy: /api/substack-feed

const FEED_URL = 'https://aviniciuss.substack.com/feed';

function extract(tag, block) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  if (!match) return '';
  return match[1]
    .replace(/^<!\[CDATA\[/, '')
    .replace(/\]\]>$/, '')
    .trim();
}

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatDate(pubDate) {
  const d = new Date(pubDate);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

module.exports = async (req, res) => {
  try {
    const response = await fetch(FEED_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PortfolioBot/1.0)' },
    });

    if (!response.ok) {
      throw new Error(`Feed retornou status ${response.status}`);
    }

    const xml = await response.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);

    const posts = items.slice(0, 12).map((block) => {
      const title = extract('title', block);
      const link = extract('link', block);
      const pubDate = extract('pubDate', block);
      const descriptionRaw = extract('description', block);
      const excerptFull = stripHtml(descriptionRaw);
      const excerpt = excerptFull.length > 140 ? excerptFull.slice(0, 140).trim() + '…' : excerptFull;

      return {
        title,
        link,
        date: formatDate(pubDate),
        excerpt,
      };
    });

    // Cache de 30 min na CDN da Vercel — evita bater no Substack a cada visita
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
    res.status(200).json({ posts });
  } catch (err) {
    res.status(500).json({ error: 'Não foi possível buscar o feed do Substack.', detail: String(err) });
  }
};
