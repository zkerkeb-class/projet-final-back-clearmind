const Parser = require('rss-parser');
const parser = new Parser();
const catchAsync = require('../utils/catchAsync');

exports.getLatestNews = catchAsync(async (req, res, next) => {
  const sources = [
    'https://feeds.feedburner.com/TheHackersNews',
    'https://www.cert.ssi.gouv.fr/feed/',
    'https://unit42.paloaltonetworks.com/feed/',
    'https://www.bleepingcomputer.com/feed/',
    'https://krebsonsecurity.com/feed/',
    'https://www.darkreading.com/rss.xml'
  ];

  // Récupération des flux en parallèle
  const feedPromises = sources.map(url => 
    parser.parseURL(url).catch(err => {
      console.error(`Erreur sur le flux ${url}:`, err.message);
      return { items: [] }; // On retourne un flux vide si une source crash
    })
  );

  const results = await Promise.all(feedPromises);

  // Fusion, nettoyage et tri chronologique
  const allItems = results
    .flatMap(feed => feed.items)
    .map(item => {
      let source = 'HACKER NEWS';
      let color = '#ffffff'; // White (Neutral)

      if (item.link.includes('cert.ssi.gouv.fr')) {
        source = 'CERT-FR';
        color = '#00d4ff'; // Cyan
      } else if (item.link.includes('unit42')) {
        source = 'UNIT 42';
        color = '#9b59b6'; // Amethyst Purple
      } else if (item.link.includes('bleepingcomputer')) {
        source = 'BLEEPING COMPUTER';
        color = '#3498db'; // Blue
      } else if (item.link.includes('krebsonsecurity')) {
        source = 'KREBS ON SECURITY';
        color = '#e056fd'; // Magenta
      } else if (item.link.includes('darkreading')) {
        source = 'DARK READING';
        color = '#1abc9c'; // Turquoise
      }

      return {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        source,
        color,
        contentSnippet: item.contentSnippet ? item.contentSnippet.slice(0, 180) + '...' : ''
      };
    })
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  res.status(200).json({
    status: 'success',
    results: allItems.length,
    data: { items: allItems }
  });
});