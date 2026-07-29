/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://journeo.ai',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/admingate', '/admingate/*', '/admin', '/admin/*', '/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admingate', '/admin', '/api'],
      },
    ],
  },
};

