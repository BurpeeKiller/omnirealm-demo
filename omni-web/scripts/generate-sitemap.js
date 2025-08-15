const fs = require('fs');
const path = require('path');

const baseUrl = 'https://omnirealm.tech';
const pages = ['', '/about', '/dashboard', '/login', '/signup'];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      (page) => `
    <url>
      <loc>${baseUrl}${page}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  `,
    )
    .join('')}
</urlset>`;

// En mode standalone, on génère dans public
const publicDir = path.join(process.cwd(), 'public');
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
console.log('✅ Sitemap generated at public/sitemap.xml');
