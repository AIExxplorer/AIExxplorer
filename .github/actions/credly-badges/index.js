const https = require('https');
const fs = require('fs');
const path = require('path');

// Function to fetch Credly badges with transparent background URLs
async function fetchCredlyBadgesWithTransparent(credlyUsername) {
  return new Promise((resolve, reject) => {
    const url = `https://www.credly.com/users/${credlyUsername}/badges`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          // Extract badge information from HTML
          // Look for badge cards that contain both name and transparent image URLs
          const badgeMatches = data.match(/badge-card[\s\S]*?<\/a>/g) || [];
          const badges = [];
          
          // Also try to extract from image src attributes with images.credly.com pattern
          const imgMatches = data.match(/<img[^>]+src="(https:\/\/images\.credly\.com\/images\/[^"]+)"[^>]+alt="([^"]+)"/g) || [];
          
          if (imgMatches.length > 0) {
            imgMatches.forEach((match) => {
              const urlMatch = match.match(/src="([^"]+)"/);
              const altMatch = match.match(/alt="([^"]+)"/);
              
              if (urlMatch && altMatch) {
                let imageUrl = urlMatch[1];
                const badgeName = altMatch[1];
                
                // Try to get transparent version by modifying URL
                // Remove size parameters and file extensions to get base transparent URL
                if (imageUrl.includes('/blob')) {
                  // Already a blob URL (likely transparent)
                  badges.push({
                    name: badgeName,
                    url: imageUrl
                  });
                } else if (imageUrl.includes('/image.png')) {
                  // PNG format - this is the transparent version
                  badges.push({
                    name: badgeName,
                    url: imageUrl
                  });
                } else if (imageUrl.includes('/')) {
                  // Try to convert to transparent version
                  // Credly serves transparent PNGs at the /images/{id}/image.png endpoint
                  const idMatch = imageUrl.match(/\/images\/([a-f0-9-]+)/);
                  if (idMatch) {
                    const transparentUrl = `https://images.credly.com/images/${idMatch[1]}/image.png`;
                    badges.push({
                      name: badgeName,
                      url: transparentUrl
                    });
                  } else {
                    badges.push({
                      name: badgeName,
                      url: imageUrl
                    });
                  }
                }
              }
            });
          }
          
          // Remove duplicates based on badge name
          const uniqueBadges = [];
          const seenNames = new Set();
          
          badges.forEach((badge) => {
            if (!seenNames.has(badge.name)) {
              seenNames.add(badge.name);
              uniqueBadges.push(badge);
            }
          });
          
          console.log(`Found ${uniqueBadges.length} unique badges`);
          resolve(uniqueBadges);
        } catch (error) {
          reject(new Error(`Error parsing badges: ${error.message}`));
        }
      });
    }).on('error', reject);
  });
}

// Main function
async function main() {
  try {
    const credlyUsername = process.env.CREDLY_USERNAME || 'aiexxplorer';
    const readmeFile = path.join(process.env.GITHUB_WORKSPACE, 'README.md');
    
    console.log(`Fetching Credly badges for user: ${credlyUsername}...`);
    
    // Fetch badges
    const badges = await fetchCredlyBadgesWithTransparent(credlyUsername);
    
    if (badges.length === 0) {
      console.warn('No badges found. Using fallback data.');
      // Fallback to hardcoded badges if scraping fails
      badges.push(
        { name: 'Adobe Content Creator', url: 'https://images.credly.com/images/bbdf7c81-3c7d-41f2-918f-94aec6ae250d/image.png' },
        { name: 'Python AI', url: 'https://images.credly.com/images/e462102c-b2ee-4208-aca0-b58f53331266/image.png' },
        { name: 'GenAI Dev', url: 'https://images.credly.com/images/afaacd18-d4a9-48af-b54c-846615756ec7/image.png' },
        { name: 'IBM', url: 'https://images.credly.com/images/70675aed-31be-4c30-add7-b99905a34005/image.png' },
        { name: 'Python Project', url: 'https://images.credly.com/images/33ed2910-9750-4613-aa2a-590e845c6edb/image.png' },
        { name: 'HTML/CSS/JS', url: 'https://images.credly.com/images/09490195-093b-4c9f-9f31-bdc434e66a23/image.png' },
        { name: 'Python DS', url: 'https://images.credly.com/images/40bee502-a5b3-4365-90e7-57eed5067594/image.png' },
        { name: 'AI V2', url: 'https://images.credly.com/images/3e199561-bc4a-4621-9361-340fc43d997e/image.png' },
        { name: 'GenAI', url: 'https://images.credly.com/images/7658c4f1-0570-42c7-83b0-04cac8b0aca2/image.png' },
        { name: 'Prompt Eng', url: 'https://images.credly.com/images/7fd5a03e-823f-4449-af43-59afe528f4ee/image.png' }
      );
    }
    
    // Generate HTML for badges with centered layout and transparent backgrounds
    let badgesHtml = '<div align="center" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; margin: 20px 0;">';
    
    badges.forEach((badge) => {
      badgesHtml += `
  <a href="https://www.credly.com/users/${credlyUsername}/badges" title="${badge.name}" style="display: inline-block;">
    <img src="${badge.url}" alt="${badge.name}" width="80" height="80" style="border-radius: 4px; background-color: transparent; image-rendering: auto;"/>
  </a>`;
    });
    
    badgesHtml += '
</div>';
    
    // Read and update README
    let readmeContent = fs.readFileSync(readmeFile, 'utf8');
    
    // Replace badges section
    const badgesRegex = /<!--START_SECTION:badges-->([\s\S]*?)<!--END_SECTION:badges-->/;
    
    if (badgesRegex.test(readmeContent)) {
      readmeContent = readmeContent.replace(
        badgesRegex,
        `<!--START_SECTION:badges-->\n${badgesHtml}\n<!--END_SECTION:badges-->`
      );
    } else {
      console.warn('Badges section markers not found in README');
    }
    
    // Write updated README
    fs.writeFileSync(readmeFile, readmeContent);
    
    console.log(`Successfully updated README with ${badges.length} badges (transparent backgrounds)`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the action
main();
