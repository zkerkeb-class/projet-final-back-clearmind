const Parser = require('rss-parser');
const parser = new Parser();
const catchAsync = require('../utils/catchAsync');

exports.getLatestNews = catchAsync(async (req, res, next) => {
  const sources = [
    'https://feeds.feedburner.com/TheHackersNews',
    'https://www.cert.ssi.gouv.fr/feed/',
    'https://unit42.paloaltonetworks.com/feed/'
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
    .map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      source: item.link.includes('cert.ssi.gouv.fr') ? 'CERT-FR' : 
              item.link.includes('unit42') ? 'UNIT 42' : 'HACKER NEWS',
      contentSnippet: item.contentSnippet ? item.contentSnippet.slice(0, 180) + '...' : ''
    }))
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  res.status(200).json({
    status: 'success',
    results: allItems.length,
    data: { items: allItems.slice(0, 30) } // Top 30 des dernières menaces
  });
});