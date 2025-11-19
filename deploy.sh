#!/bin/bash

# Create a temporary directory
mkdir -p temp_dist

# Create our standalone HTML file - this is a completely self-contained file with no external dependencies
cat > temp_dist/index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- HTML Meta Tags -->
    <title>Hari Patel | Software Engineer</title>
    <meta name="description" content="Portfolio of Hari Patel, Software Engineer & Developer">

    <!-- Facebook Meta Tags -->
    <meta property="og:url" content="https://haripatell.com">
    <meta property="og:type" content="website">
    <meta property="og:title" content="Hari Patel | Software Engineer">
    <meta property="og:description" content="Portfolio of Hari Patel, Software Engineer & Developer">
    <meta property="og:image" content="https://haripatell.com/preview.png">

    <!-- Twitter Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta property="twitter:domain" content="haripatell.com">
    <meta property="twitter:url" content="https://haripatell.com">
    <meta name="twitter:title" content="Hari Patel | Software Engineer">
    <meta name="twitter:description" content="Portfolio of Hari Patel, Software Engineer & Developer">
    <meta name="twitter:image" content="https://haripatell.com/preview.png">

    <!-- Meta Tags Generated via https://www.opengraph.xyz -->
    <style>
        :root {
            --orange-500: #f97316;
            --orange-600: #ea580c;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: linear-gradient(to bottom right, #000000, #18181b);
            color: white;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 2rem;
        }
        
        .container {
            max-width: 600px;
            width: 100%;
            background-color: rgba(255, 255, 255, 0.05);
            border-radius: 1.5rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 2rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            position: relative;
            overflow: hidden;
        }
        
        .blob {
            position: absolute;
            width: 12rem;
            height: 12rem;
            border-radius: 50%;
            filter: blur(80px);
            z-index: -1;
        }
        
        .blob-1 {
            top: -6rem;
            right: -6rem;
            background-color: rgba(249, 115, 22, 0.2);
        }
        
        .blob-2 {
            bottom: -6rem;
            left: -6rem;
            background-color: rgba(234, 88, 12, 0.2);
        }
        
        .profile {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 2rem;
        }
        
        .profile-img-container {
            width: 8rem;
            height: 8rem;
            border-radius: 50%;
            padding: 0.25rem;
            background: linear-gradient(to right, var(--orange-500), var(--orange-600));
            margin-bottom: 1.5rem;
            position: relative;
        }
        
        .profile-img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
        }
        
        .glow {
            position: absolute;
            inset: 0;
            border-radius: 50%;
            background: linear-gradient(to right, rgba(249, 115, 22, 0.4), transparent);
            filter: blur(24px);
            animation: spin 20s linear infinite;
        }
        
        @keyframes spin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
        
        .name {
            font-size: 2.25rem;
            font-weight: bold;
            background: linear-gradient(to right, #fb923c, #f97316, #ea580c);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            margin-bottom: 0.5rem;
            text-align: center;
        }
        
        .title {
            color: #9ca3af;
            position: relative;
            display: inline-block;
            margin-bottom: 2rem;
        }
        
        .title::after {
            content: "";
            position: absolute;
            bottom: -0.5rem;
            left: 0;
            width: 100%;
            height: 1px;
            background: linear-gradient(to right, rgba(249, 115, 22, 0), rgba(249, 115, 22, 0.5), rgba(249, 115, 22, 0));
        }
        
        .links {
            display: grid;
            gap: 1rem;
        }
        
        .link {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            background-color: rgba(255, 255, 255, 0.05);
            border-radius: 0.75rem;
            text-decoration: none;
            color: white;
            transition: all 0.3s ease;
        }
        
        .link:hover {
            background-color: rgba(255, 255, 255, 0.1);
            transform: scale(1.05);
            box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.2);
        }
        
        .link-icon {
            color: var(--orange-500);
            transition: transform 0.3s ease;
        }
        
        .link:hover .link-icon {
            transform: rotate(12deg);
        }
        
        .link-text {
            position: relative;
        }
        
        .link:hover .link-text::after {
            transform: scaleX(1);
        }
        
        .link-text::after {
            content: "";
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 100%;
            height: 1px;
            background: linear-gradient(to right, var(--orange-500), var(--orange-300));
            transform: scaleX(0);
            transition: transform 0.3s ease;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
        
        <div class="profile">
            <div class="profile-img-container">
                <img class="profile-img" src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile.jpg-EeWllMPYDsF3TgFrZLyr78EH91io3Q.jpeg" alt="Hari-Krishna Patel">
                <div class="glow"></div>
            </div>
            <h1 class="name">Hari-Krishna Patel</h1>
            <p class="title">Software Engineer & Developer</p>
        </div>
        
        <div class="links">
            <a href="mailto:hari1880patel@gmail.com" class="link">
                <svg class="link-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                <span class="link-text">Email</span>
            </a>
            <a href="https://x.com/hari_patell" class="link">
                <svg class="link-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"/>
                </svg>
                <span class="link-text">X</span>
            </a>
            <a href="https://instagram.com/hari_patell" class="link">
                <svg class="link-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
                <span class="link-text">Instagram</span>
            </a>
            <a href="https://www.linkedin.com/in/hari-krishna-patel" class="link">
                <svg class="link-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                </svg>
                <span class="link-text">LinkedIn</span>
            </a>
            <a href="https://github.com/hari-patell" class="link">
                <svg class="link-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                    <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
                <span class="link-text">GitHub</span>
            </a>
        </div>
    </div>
</body>
</html>
EOL

# Create CNAME file
echo "haripatell.com" > temp_dist/CNAME

# Clean up
# rm -rf temp_dist

echo "Deployment preparation complete! The static site is in temp_dist/" 