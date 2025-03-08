# Personal-Website

## Deployment

This website is automatically deployed to GitHub Pages using GitHub Actions. The site is accessible at [haripatell.com](https://haripatell.com).

### Deployment Process

1. Push changes to the `main` branch
2. GitHub Actions workflow automatically builds and deploys the site
3. The site is deployed to GitHub Pages with the custom domain haripatell.com

### Custom Domain Setup

The site uses a custom domain (haripatell.com) configured through:
- A CNAME file in the public directory
- GitHub Pages settings in the repository

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
