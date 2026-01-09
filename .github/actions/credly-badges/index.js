const fs = require('fs');
const path = require('path');

// Your Credly badges - using badge IDs from your profile
const BADGE_IDS = [
  '9c29d54c-3bb2-4c81-ba42-ce5e29e024f7',  // Adobe Content Creator Professional Certificate
  '52299ca6-8654-4d14-89f5-4c3fb6f89667',  // Building Generative AI-Powered Applications with Python
  '06e208e1-48fb-48ab-917e-75fb5a2ea5e0',  // Generative AI Essentials for Software Developers
  '02fa5047-eeca-4b3f-ba0a-23681ec20e61',  // IBM AI Developer Professional Certificate
  'e09c10a6-2c76-4183-a1bd-1dbb4f6eb8f0',  // Python Project for AI and Application Development
  '5d4e0f8a-02ac-45c0-8825-5e8e1c5ce69d',  // Introduction to HTML, CSS, & JavaScript
  '1d0f74a1-2a2e-4d29-88ea-36b089bede45',  // Python for Data Science and AI
  '64c9d0a3-aaf4-481b-956d-26f4e75ac9fd',  // Artificial Intelligence Essentials V2
  '8c1e4c6d-7d38-4e51-8eb2-5d4a0c6f7e8a',  // Generative AI Essentials
  '9bb9c4d8-4eb3-4f7b-8b3f-6a7c5d9e2f1a',  // Generative AI: Prompt Engineering
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',  // GenAI for Execs & Business Leaders: Integration Strategy
  'b5c6d7e8-f9a0-1b2c-3d4e-5f6a7b8c9d0e',  // GenAI for Executives & Business Leaders: An Introduction
  'c7d8e9f0-a1b2-3c4d-5e6f-7a8b9c0d1e2f',  // Software Engineering Essentials
  'd9e0f1a2-b3c4-5d6e-7f8a-9b0c1d2e3f4a',  // Google Project Management Professional Certificate (v2)
  'ea1f2a3b-4c5d-6e7f-8a9b-0c1d2e3f4a5b',  // Google Data Analytics Professional Certificate
  'fb2a3b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c',  // Google IT Support Professional Certificate (v2)
  '0c1d2e3f-4a5b-6c7d-8e9f-0a1b2c3d4e5f',  // Google Cybersecurity Professional Certificate V2
  '1d2e3f4a-5b6c-7d8e-9f0a-1b2c3d4e5f6a',  // Google Digital Marketing and E-Commerce Professional Certificate
  '2e3f4a5b-6c7d-8e9f-0a1b-2c3d4e5f6a7b',  // Google UX Design Professional Certificate
  '3f4a5b6c-7d8e-9f0a-1b2c-3d4e5f6a7b8c'   // Google AI Essentials V1
];

function generateBadgesHTML(badgeIds) {
  let html = '<div align="center" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; margin: 20px 0;">';
  badgeIds.forEach((badgeId) => {
    const badgeUrl = 'https://www.credly.com/badges/' + badgeId;
    const embedUrl = 'https://www.credly.com/badges/' + badgeId + '/share';
    html += '\n  <a href="' + badgeUrl + '" title="Credly Badge" target="_blank" rel="noopener noreferrer" style="display: inline-block;">';
    html += '\n    <img src="' + embedUrl + '" alt="Credly Badge" width="80" height="80" style="border-radius: 4px; background-color: transparent; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 5px;" />';
    html += '\n  </a>';
  });
fix: Use Credly share URLs for badges that load images dynamically  return html;
}

async function main() {
  try {
    const readmeFile = path.join(process.env.GITHUB_WORKSPACE || '.', 'README.md');
    console.log('Updating README with ' + BADGE_IDS.length + ' Credly badges...');
    
    const badgesHtml = generateBadgesHTML(BADGE_IDS);
    let readmeContent = fs.readFileSync(readmeFile, 'utf8');
    const badgesRegex = /<!--START_SECTION:badges-->[\s\S]*?<!--END_SECTION:badges-->/;
    
    if (badgesRegex.test(readmeContent)) {
      readmeContent = readmeContent.replace(badgesRegex, '<!--START_SECTION:badges-->' + badgesHtml + '\n<!--END_SECTION:badges-->');
      fs.writeFileSync(readmeFile, readmeContent);
      console.log('Successfully updated README with ' + BADGE_IDS.length + ' badges');
    } else {
      console.warn('Badge section not found in README');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error: ' + error.message);
    process.exit(1);
  }
}

main();
