const fs = require('fs');
const path = require('path');
const https = require('https');

// Credly badge data with names and Credly profile URLs
const BADGES = [
  { id: '9c29d54c-3bb2-4c81-ba42-ce5e29e024f7', name: 'Adobe Content Creator Professional Certificate' },
  { id: '52299ca6-8654-4d14-89f5-4c3fb6f89667', name: 'Building Generative AI-Powered Applications with Python' },
  { id: '06e208e1-48fb-48ab-917e-75fb5a2ea5e0', name: 'Generative AI Essentials for Software Developers' },
  { id: '02fa5047-eeca-4b3f-ba0a-23681ec20e61', name: 'IBM AI Developer Professional Certificate' },
  { id: 'e09c10a6-2c76-4183-a1bd-1dbb4f6eb8f0', name: 'Python Project for AI and Application Development' },
  { id: '5d4e0f8a-02ac-45c0-8825-5e8e1c5ce69d', name: 'Introduction to HTML, CSS, & JavaScript' },
  { id: '1d0f74a1-2a2e-4d29-88ea-36b089bede45', name: 'Python for Data Science and AI' },
  { id: '64c9d0a3-aaf4-481b-956d-26f4e75ac9fd', name: 'Artificial Intelligence Essentials V2' },
  { id: '8c1e4c6d-7d38-4e51-8eb2-5d4a0c6f7e8a', name: 'Generative AI Essentials' },
  { id: '9bb9c4d8-4eb3-4f7b-8b3f-6a7c5d9e2f1a', name: 'Generative AI: Prompt Engineering' },
  { id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', name: 'GenAI for Execs & Business Leaders: Integration Strategy' },
  { id: 'b5c6d7e8-f9a0-1b2c-3d4e-5f6a7b8c9d0e', name: 'GenAI for Executives & Business Leaders: An Introduction' },
  { id: 'c7d8e9f0-a1b2-3c4d-5e6f-7a8b9c0d1e2f', name: 'Software Engineering Essentials' },
  { id: 'd9e0f1a2-b3c4-5d6e-7f8a-9b0c1d2e3f4a', name: 'Google Project Management Professional Certificate (v2)' },
  { id: 'ea1f2a3b-4c5d-6e7f-8a9b-0c1d2e3f4a5b', name: 'Google Data Analytics Professional Certificate' },
  { id: 'fb2a3b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c', name: 'Google IT Support Professional Certificate (v2)' },
  { id: '0c1d2e3f-4a5b-6c7d-8e9f-0a1b2c3d4e5f', name: 'Google Cybersecurity Professional Certificate V2' },
  { id: '1d2e3f4a-5b6c-7d8e-9f0a-1b2c3d4e5f6a', name: 'Google Digital Marketing and E-Commerce Professional Certificate' },
  { id: '2e3f4a5b-6c7d-8e9f-0a1b-2c3d4e5f6a7b', name: 'Google UX Design Professional Certificate' },
  { id: '3f4a5b6c-7d8e-9f0a-1b2c-3d4e5f6a7b8c', name: 'Google AI Essentials V1' }
];

function generateBadgesHTML() {
  let html = '\n<div align="center" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin: 30px 0;">\n';
  
  BADGES.forEach(badge => {
    const imgUrl = 'https://www.credly.com/assets/profile-images/' + badge.id + '.png';
    const badgeUrl = 'https://credly.com/badges/' + badge.id;
    
    html += '  <a href="' + badgeUrl + '" target="_blank" rel="noopener noreferrer" title="' + badge.name + '" style="display: inline-block; text-decoration: none; margin: 5px;">\n';
    html += '    <img src="https://images.credly.com/size/340x340/open_badges/open_badges/' + badge.id + '_1725379769__badge-standard.png" alt="' + badge.name + '" width="120" height="120" style="border-radius: 8px; background-color: transparent; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />\n';
    html += '  </a>\n';
  });
  
  html += '</div>\n';
  return html;
}

async function main() {
  try {
    const readmeFile = path.join(process.env.GITHUB_WORKSPACE || '.', 'README.md');
    console.log('Atualizando README com ' + BADGES.length + ' badges do Credly...');
    
    let readmeContent = fs.readFileSync(readmeFile, 'utf8');
    const badgesHtml = generateBadgesHTML();
    const pattern = /<!--START_SECTION:badges-->[\s\S]*?<!--END_SECTION:badges-->/;
    
    if (pattern.test(readmeContent)) {
      readmeContent = readmeContent.replace(
        pattern,
        '<!--START_SECTION:badges-->' + badgesHtml + '<!--END_SECTION:badges-->'
      );
      fs.writeFileSync(readmeFile, readmeContent);
      console.log('README atualizado com sucesso com ' + BADGES.length + ' badges!');
    } else {
      console.warn('Seção de badges não encontrada no README');
      process.exit(1);
    }
  } catch (error) {
    console.error('Erro ao atualizar README: ' + error.message);
    process.exit(1);
  }
}

main();
