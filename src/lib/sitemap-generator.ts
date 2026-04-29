import { getAllProducts, getCategories } from '@/lib/db';

export default async function generateSitemap() {
  const baseUrl = 'https://jpelectronics.vercel.app';

  // Get all products and categories
  const products = await getAllProducts();
  const categories = await getCategories();

  // Static pages
  const staticPages = [
    {
      url: '/',
      changefreq: 'daily',
      priority: 1.0,
      lastmod: new Date().toISOString().split('T')[0],
    },
    {
      url: '/about',
      changefreq: 'monthly',
      priority: 0.8,
      lastmod: new Date().toISOString().split('T')[0],
    },
    {
      url: '/contact',
      changefreq: 'monthly',
      priority: 0.8,
      lastmod: new Date().toISOString().split('T')[0],
    },
    {
      url: '/faq',
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString().split('T')[0],
    },
    {
      url: '/explore',
      changefreq: 'daily',
      priority: 0.9,
      lastmod: new Date().toISOString().split('T')[0],
    },
    {
      url: '/search',
      changefreq: 'daily',
      priority: 0.6,
      lastmod: new Date().toISOString().split('T')[0],
    },
    {
      url: '/track',
      changefreq: 'monthly',
      priority: 0.5,
      lastmod: new Date().toISOString().split('T')[0],
    },
  ];

  // Category pages
  const categoryPages = categories.map(category => ({
    url: `/category/${category.slug}`,
    changefreq: 'daily',
    priority: 0.9,
    lastmod: new Date().toISOString().split('T')[0],
  }));

  // Product pages
  const productPages = products.map(product => ({
    url: `/product/${product._id}`,
    changefreq: 'weekly',
    priority: product.featured ? 0.8 : 0.6,
    lastmod: product.updatedAt ? new Date(product.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  }));

  // Combine all pages
  const allPages = [...staticPages, ...categoryPages, ...productPages];

  // Generate XML (escape special characters)
  const escapeXml = (str: string) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

${allPages.map(page => `  <url>
    <loc>${escapeXml(baseUrl + page.url)}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}

</urlset>`;

  return sitemap;
}

// Export for use in API routes or build scripts
export { generateSitemap };