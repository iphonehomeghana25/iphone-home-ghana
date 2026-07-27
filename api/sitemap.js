import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Initialize Supabase on the server securely
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch all published blog post slugs
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, created_at')
    .eq('is_published', true);

  // Start the XML structure with your core pages
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  
  <!-- Core Static Pages -->
  <url>
    <loc>https://iphonehomeghana.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://iphonehomeghana.com/shop</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://iphonehomeghana.com/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://iphonehomeghana.com/bnpl</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;

  // Inject the dynamic blog posts from Supabase
  if (posts) {
    posts.forEach((post) => {
      // Create an ISO date format for the XML (e.g., 2026-07-27)
      const date = post.created_at ? new Date(post.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      
      xml += `
  <url>
    <loc>https://iphonehomeghana.com/blog/${post.slug}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });
  }

  xml += `\n</urlset>`;

  // Tell the browser and Googlebot this is an XML file
  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send(xml);
}
