/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://3d-screw-puzzle-game.vercel.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
} 