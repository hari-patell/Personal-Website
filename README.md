# Personal-Website

## GitHub Pages Deployment

This website is configured to automatically deploy to GitHub Pages using GitHub Actions whenever changes are pushed to the main branch.

### Custom Domain Setup

The site is configured to use the custom domain `haripatell.com`. To set this up:

1. The GitHub Actions workflow in `.github/workflows/deploy.yml` handles the build and deployment process.
2. A `CNAME` file in the `public` directory specifies the custom domain.

### DNS Configuration

To connect your custom domain to GitHub Pages, you need to configure your DNS settings:

1. Go to your domain registrar's DNS settings
2. Add the following records:
   - A record: `@` pointing to `185.199.108.153`
   - A record: `@` pointing to `185.199.109.153`
   - A record: `@` pointing to `185.199.110.153`
   - A record: `@` pointing to `185.199.111.153`
   - CNAME record: `www` pointing to `yourusername.github.io.` (replace with your GitHub username)

### GitHub Repository Settings

In your GitHub repository settings:

1. Go to Settings > Pages
2. Under "Build and deployment", ensure the source is set to "GitHub Actions"
3. Under "Custom domain", enter `haripatell.com` and save
4. Check "Enforce HTTPS" once the certificate is provisioned (may take up to 24 hours)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
