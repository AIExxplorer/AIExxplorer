const https = require('https');
const fs = require('fs');
const path = require('path');

// Function to fetch Credly badges with transparent URLs
async function fetchCredlyBadgesWithTransparent(credlyUsername) {
  return new Promise((resolve, reject) => {
    const url = 'https://www.credly.com/users/' + credlyUsername + '/badges';
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const badges = [];
          
          // Extract badge images and names from HTML
          const imgMatches = data.match(/<img[^>]+src="(https:\/\/images\.credly\.com\/images\/[^"]+)"[^>]+alt="([^"]+)"/g) || [];
          
          imgMatches.forEach((match) => {
            const urlMatch = match.match(/src="([^"]+)"/);
            const altMatch = match.match(/alt="([^"]+)"/);
            
            if (urlMatch && altMatch) {
              let imageUrl = urlMatch[1];
              const badgeName = altMatch[1];
              
              // Ensure we use transparent PNG versions
              if (imageUrl.includes('/image.png') || imageUrl.includes('/blob')) {
                badges.push({
                  name: badgeName,
                  url: imageUrl
                });
              } else {
                // Try to convert to transparent PNG
                const idMatch = imageUrl.match(/\/images\/([a-f0-9-]+)/);
                if (idMatch) {
                  const transparentUrl = 'https://images.credly.com/images/' + idMatch[1] + '/image.png';
                  badges.push({
                    name: badgeName,
                    url: transparentUrl
                  });
                }
              }
            }
          });
          
          // Remove duplicates
          const uniqueBadges = [];
          const seenNames = new Set();
          
          badges.forEach((badge) => {
            if (!seenNames.has(badge.name)) {
              seenNames.add(badge.name);
              uniqueBadges.push(badge);
            }
          });
          
          console.log('Found ' + uniqueBadges.length + ' unique badges');
          resolve(uniqueBadges);
        } catch (error) {
          reject(new Error('Error parsing badges: ' + error.message));
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
    
    console.log('Fetching Credly badges for user: ' + credlyUsername + '...');
    
    // Fetch badges
    const badges = await fetchCredlyBadgesWithTransparent(credlyUsername);
    
    // Generate HTML for badges
    let badgesHtml = '<div align="center" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; margin: 20px 0;">';
    
    badges.forEach((badge) => {
      badgesHtml += '\n  <a href="https://www.credly.com/users/' + credlyUsername + '/badges" title="' + badge.name + '" style="display: inline-block;">';
      badgesHtml += '\n    <img src="' + badge.url + '" alt="' + badge.name + '" width="80" height="80" style="border-radius: 4px; background-color: transparent;"/>';
      badgesHtml += '\n  </a>';
    });
    
    badgesHtml += '\n</div>';
    
    // Read and update README
    let readmeContent = fs.readFileSync(readmeFile, 'utf8');
    
    // Replace badges section
    const badgesRegex = /<!--START_SECTION:badges-->([\s\S]*?)<!--END_SECTION:badges-->/;
    
    if (badgesRegex.test(readmeContent)) {
      readmeContent = readmeContent.replace(
        badgesRegex,
        '<!--START_SECTION:badges-->\n' + badgesHtml + '\n<!--END_SECTION:badges-->'
      );
    } else {
      console.warn('Badges section markers not found in README');
    }
    
    // Write updated README
    fs.writeFileSync(readmeFile, readmeContent);
    
    console.log('Successfully updated README with ' + badges.length + ' badges (transparent backgrounds)');
  } catch (error) {
    console.error('Error: ' + error.message);
    process.exit(1);
  }
}

// Run the action
main();
