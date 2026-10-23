export function absoluteUrl(siteUrl: string, path: string): string {
  return `${siteUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

export function buildSitemap(siteUrl: string, paths: string[]): string {
  const urls = paths.map(path => `  <url><loc>${absoluteUrl(siteUrl, path)}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function buildRobots(siteUrl: string): string {
  return `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${absoluteUrl(siteUrl, '/sitemap.xml')}\n`;
}
