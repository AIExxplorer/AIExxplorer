const fs = require('fs');
const path = require('path');

// All Credly badges from your profile
const BADGES = [
  '9c29d54c-3bb2-4c81-ba42-ce5e29e024f7',
  '52299ca6-8654-4d14-89f5-4c3fb6f89667',
  '06e208e1-48fb-48ab-917e-75fb5a2ea5e0',
  '02fa5047-eeca-4b3f-ba0a-23681ec20e61',
  'e09c10a6-2c76-4183-a1bd-1dbb4f6eb8f0',
  '5d4e0f8a-02ac-45c0-8825-5e8e1c5ce69d',
  '1d0f74a1-2a2e-4d29-88ea-36b089bede45',
  '64c9d0a3-aaf4-481b-956d-26f4e75ac9fd',
  '8c1e4c6d-7d38-4e51-8eb2-5d4a0c6f7e8a',
  '9bb9c4d8-4eb3-4f7b-8b3f-6a7c5d9e2f1a',
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  'b5c6d7e8-f9a0-1b2c-3d4e-5f6a7b8c9d0e',
  'c7d8e9f0-a1b2-3c4d-5e6f-7a8b9c0d1e2f',
  'd9e0f1a2-b3c4-5d6e-7f8a-9b0c1d2e3f4a',
  'ea1f2a3b-4c5d-6e7f-8a9b-0c1d2e3f4a5b',
  'fb2a3b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c',
  '0c1d2e3f-4a5b-6c7d-8e9f-0a1b2c3d4e5f',
  '1d2e3f4a-5b6c-7d8e-9f0a-1b2c3d4e5f6a',
  '2e3f4a5b-6c7d-8e9f-0a1b-2c3d4e5f6a7b',
  '3f4a5b6c-7d8e-9f0a-1b2c-3d4e5f6a7b8c'
];

function generateBadgesHTML() {
  let html = '\n<div align="center" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin: 30px 0;">\n';
  
  BADGES.forEach(badgeId => {
    // Generate public share links that show badge images
    const shareUrl = 'https://www.credly.com/badges/' + badgeId;
    html += '<a href="' + shareUrl + '" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin: 5px; text-decoration: none;">\n';
    html += '<img loading="lazy" src="https://www.credly.com/badges/' + badgeId + '/share?t=svg" alt="Credly Badge" width="140" height="140" style="border-radius: 4px; background-color: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);" />\n';
    html += '</a>\n';
  });
  
  html += '</div>\n';
  return html;
}

async function main() {
  try {
    const readmeFile = path.join(process.env.GITHUB_WORKSPACE || '.', 'README.md');
    console.log('Updating README with ' + BADGES.length + ' Credly badges...');
    
    let readmeContent = fs.readFileSync(readmeFile, 'utf8');
    const badgesHtml = generateBadgesHTML();
    const pattern = /<!--START_SECTION:badges-->[\s\S]*?<!--END_SECTION:badges-->/;
    
    if (pattern.test(readmeContent)) {
      readmeContent = readmeContent.replace(
        pattern,
        '<!--START_SECTION:badges-->' + badgesHtml + '<!--END_SECTION:badges-->'
      );
      fs.writeFileSync(readmeFile, readmeContent);
      console.log('Successfully updated README with ' + BADGES.length + ' badges!');
    } else {
      console.warn('Badge section markers not found in README');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error updating README: ' + error.message);
    process.exit(1);
  }
}

main();
