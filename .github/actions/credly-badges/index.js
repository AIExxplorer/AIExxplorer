const https = require('https');
const fs = require('fs');
const path = require('path');

async function fetchCredlyBadges(username) {
  return new Promise((resolve, reject) => {
    https.get(`https://www.credly.com/users/${username}/badges`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const matches = data.match(/href="\/badges\/([a-f0-9-]+)"/g) || [];
          const badgeIds = matches.map(m => m.match(/\/badges\/([a-f0-9-]+)/)[1]);
          resolve([...new Set(badgeIds)]);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function generateBadgeMarkdown(badgeId, name) {
  const badgeUrl = `https://images.credly.com/size/80x80_bw/images/${badgeId.split('-')[0]}/image.png`;
  return `<a href="https://www.credly.com/badges/${badgeId}" title="${name}"><img src="${badgeUrl}" alt="${name}" width="80" height="80"></a>`;
}

async function main() {
  try {
    const credlyUser = 'aiexxplorer';
    console.log(`Fetching badges for ${credlyUser}...`);
    
    const readmeFile = path.join(process.env.GITHUB_WORKSPACE, 'README.md');
    let content = fs.readFileSync(readmeFile, 'utf8');
    
    // Simple HTML-based badge display with transparent versions
    const badges = `<div align="center" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin: 20px 0;">
  <a href="https://www.credly.com/users/aiexxplorer/badges"><img src="https://images.credly.com/size/80x80_bw/images/bbdf7c81-3c7d-41f2-918f-94aec6ae250d/blob" alt="Adobe" width="80" height="80"/></a>
  <a href="https://www.credly.com/users/aiexxplorer/badges"><img src="https://images.credly.com/size/80x80_bw/images/e462102c-b2ee-4208-aca0-b58f53331266/image.png" alt="Python AI" width="80" height="80"/></a>
  <a href="https://www.credly.com/users/aiexxplorer/badges"><img src="https://images.credly.com/size/80x80_bw/images/afaacd18-d4a9-48af-b54c-846615756ec7/image.png" alt="GenAI Dev" width="80" height="80"/></a>
  <a href="https://www.credly.com/users/aiexxplorer/badges"><img src="https://images.credly.com/size/80x80_bw/images/70675aed-31be-4c30-add7-b99905a34005/image.png" alt="IBM" width="80" height="80"/></a>
  <a href="https://www.credly.com/users/aiexxplorer/badges"><img src="https://images.credly.com/size/80x80_bw/images/33ed2910-9750-4613-aa2a-590e845c6edb/image.png" alt="Python Project" width="80" height="80"/></a>
  <a href="https://www.credly.com/users/aiexxplorer/badges"><img src="https://images.credly.com/size/80x80_bw/images/09490195-093b-4c9f-9f31-bdc434e66a23/Coursera_20Introduction_20to_20HTML_20CSS_20and_20JavaScript.png" alt="HTML/CSS/JS" width="80" height="80"/></a>
  <a href="https://www.credly.com/users/aiexxplorer/badges"><img src="https://images.credly.com/size/80x80_bw/images/40bee502-a5b3-4365-90e7-57eed5067594/image.png" alt="Python DS" width="80" height="80"/></a>
  <a href="https://www.credly.com/users/aiexxplorer/badges"><img src="https://images.credly.com/size/80x80_bw/images/3e199561-bc4a-4621-9361-340fc43d997e/Coursera_20Artificial_20Intelligence_20Essentials_20V2.png" alt="AI V2" width="80" height="80"/></a>
  <a href="https://www.credly.com/users/aiexxplorer/badges"><img src="https://images.credly.com/size/80x80_bw/images/7658c4f1-0570-42c7-83b0-04cac8b0aca2/image.png" alt="GenAI" width="80" height="80"/></a>
  <a href="https://www.credly.com/users/aiexxplorer/badges"><img src="https://images.credly.com/size/80x80_bw/images/7fd5a03e-823f-4449-af43-59afe528f4ee/image.png" alt="Prompt Eng" width="80" height="80"/></a>
</div>`;
    
    content = content.replace(
      /<!--START_SECTION:badges-->([\s\S]*?)<!--END_SECTION:badges-->/,
      `<!--START_SECTION:badges-->\n${badges}\n<!--END_SECTION:badges-->`
    );
    
    fs.writeFileSync(readmeFile, content);
    console.log('README updated with transparent badges!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
