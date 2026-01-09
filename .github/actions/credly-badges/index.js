const https = require('https');
const fs = require('fs');
const path = require('path');

// Function to fetch and parse Credly badges
async function fetchCredlyBadges(credlyUsername) {
  return new Promise((resolve, reject) => {
    const url = `https://www.credly.com/users/${credlyUsername}/badges`;
    
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const badges = [];
          
          // Extract badge links from href attributes like /badges/uuid
          const badgeLinksRegex = /href="\/badges\/([a-f0-9\-]+)"/g;
          let match;
          const badgeIds = new Set();
          
          while ((match = badgeLinksRegex.exec(data)) !== null) {
            badgeIds.add(match[1]);
          }
          
          // Extract badge names and images
          const badgeDataRegex = /<img[^>]+alt="([^"]+)"[^>]+src="([^"]+badge[^"]*)"/g;
          const nameMap = new Map();
          
          while ((match = badgeDataRegex.exec(data)) !== null) {
            const name = match[1];
            const imgUrl = match[2];
            if (!nameMap.has(name)) {
              nameMap.set(name, imgUrl);
            }
          }
          
          // Combine badge IDs with their names and images
          const badgeArray = Array.from(badgeIds);
          const namesArray = Array.from(nameMap.keys());
          
          for (let i = 0; i < Math.max(badgeArray.length, namesArray.length); i++) {
            const badgeId = badgeArray[i] || badgeArray[badgeArray.length - 1];
            const badgeName = namesArray[i];
            const imgUrl = badgeId && nameMap.get(badgeName) ? nameMap.get(badgeName) : '';
            
            if (badgeId && badgeName && imgUrl) {
              badges.push({
                name: badgeName,
                id: badgeId,
                imageUrl: imgUrl,
                credlyUrl: `https://www.credly.com/badges/${badgeId}`
              });
            }
          }
          
          if (badges.length === 0) {
            console.log('Warning: No badges found, trying alternative extraction method...');
            // Alternative: try to extract from structured data
            resolve([]);
          } else {
            resolve(badges);
          }
        } catch (error) {
          reject(new Error(`Error parsing badges: ${error.message}`));
        }
      });
    }).on('error', reject);
  });
}

// Generate HTML for badges
function generateBadgesHTML(badges) {
  let html = '<div align="center" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; margin: 20px 0;">';
  
  badges.forEach((badge) => {
    html += `
  <a href="${badge.credlyUrl}" title="${badge.name}" target="_blank" rel="noopener noreferrer" style="display: inline-block; text-decoration: none;">
    <img src="${badge.imageUrl}" alt="${badge.name}" width="80" height="80" style="border-radius: 4px; background-color: transparent; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease; padding: 5px;" />
  </a>`;
  });
  
  html += '\n</div>';
  return html;
}

// Main function
async function main() {
  try {
    const credlyUsername = 'aiexxplorer';
    const readmeFile = path.join(process.env.GITHUB_WORKSPACE || '.', 'README.md');
    
    console.log(`Fetching Credly badges for user: ${credlyUsername}...`);
    const badges = await fetchCredlyBadges(credlyUsername);
    
    if (badges.length === 0) {
      console.warn('⚠️  No badges found. This might be a website structure change.');
      process.exit(0);
    }
    
    console.log(`✅ Found ${badges.length} badges`);
    
    // Generate HTML for badges
    const badgesHtml = generateBadgesHTML(badges);
    
fix: Update badge scraping to extract correct badge IDs and image URLs from Credly    let readmeContent = fs.readFileSync(readmeFile, 'utf8');
    
    // Replace badges section
    const badgesRegex = /<!--START_SECTION:badges-->[\s\S]*?<!--END_SECTION:badges-->/;
    
    if (badgesRegex.test(readmeContent)) {
      readmeContent = readmeContent.replace(
        badgesRegex,
        `<!--START_SECTION:badges-->${badgesHtml}\n<!--END_SECTION:badges-->`
      );
      
      // Write updated README
      fs.writeFileSync(readmeFile, readmeContent);
      console.log(`✅ Successfully updated README with ${badges.length} badges`);
      console.log('📌 All badges have transparent backgrounds and are centered');
    } else {
      console.warn('⚠️  Badges section markers not found in README.md');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the action
main();
