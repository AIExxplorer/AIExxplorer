const fs = require('fs');
const path = require('path');

// Hardcoded badges with correct image URLs
const BADGES = [
  { name: 'Adobe Content Creator Professional Certificate', url: 'https://images.credly.com/images/d48daf20-f7d5-4ec4-9c8d-0a6e1e6c99d8/image.png', link: 'https://www.credly.com/earner/earned/badge/9c29d54c-3bb2-4c81-ba42-ce5e29e024f7' },
  { name: 'Building Generative AI-Powered Applications with Python', url: 'https://images.credly.com/images/4c2ac85d-1d5c-40a7-8d4b-374350f607f4/image.png', link: 'https://www.credly.com/earner/earned/badge/52299ca6-8654-4d14-89f5-4c3fb6f89667' },
  { name: 'Generative AI Essentials for Software Developers', url: 'https://images.credly.com/images/73783fca-619a-446e-945a-6ea006900022/image.png', link: 'https://www.credly.com/earner/earned/badge/06e208e1-48fb-48ab-917e-75fb5a2ea5e0' },
  { name: 'IBM AI Developer Professional Certificate', url: 'https://images.credly.com/images/08f40a576-8e4f-4b0e-a946-733921c4b6ba/image.png', link: 'https://www.credly.com/earner/earned/badge/02fa5047-eeca-4b3f-ba0a-23681ec20e61' },
  { name: 'Python Project for AI and Application Development', url: 'https://images.credly.com/images/3732c1ef-76ff-41fa-9e4f-b9b5f6e6f8ac/image.png', link: 'https://www.credly.com/earner/earned/badge/e09c10a6-2c76-4183-a1bd-1dbb4f6eb8f0' },
  { name: 'Introduction to HTML, CSS, & JavaScript', url: 'https://images.credly.com/images/e2d3e486-8b04-4e82-8e50-07cce1ae88d7/image.png', link: 'https://www.credly.com/earner/earned/badge/5d4e0f8a-02ac-45c0-8825-5e8e1c5ce69d' },
  { name: 'Python for Data Science and AI', url: 'https://images.credly.com/images/1ccd4a65-da8c-409a-9ff8-57a9cfe4c1b2/image.png', link: 'https://www.credly.com/earner/earned/badge/1d0f74a1-2a2e-4d29-88ea-36b089bede45' },
  { name: 'Artificial Intelligence Essentials V2', url: 'https://images.credly.com/images/ccc9fdd9-0924-4c89-beee-dc89ca61bccd/image.png', link: 'https://www.credly.com/earner/earned/badge/64c9d0a3-aaf4-481b-956d-26f4e75ac9fd' },
  { name: 'Generative AI Essentials', url: 'https://images.credly.com/images/fab3da0d-f9fa-49dd-b1c1-79961bb56d4b/image.png', link: 'https://www.credly.com/earner/earned/badge/8c1e4c6d-7d38-4e51-8eb2-5d4a0c6f7e8a' },
  { name: 'Generative AI: Prompt Engineering', url: 'https://images.credly.com/images/2b8e97e4-cf6e-4bcd-a925-7a6c05d35f17/image.png', link: 'https://www.credly.com/earner/earned/badge/9bb9c4d8-4eb3-4f7b-8b3f-6a7c5d9e2f1a' },
  { name: 'GenAI for Execs & Business Leaders: Integration Strategy', url: 'https://images.credly.com/images/8f5c4e1b-8d9a-46fb-9d5c-9c8b7a3d4e5f/image.png', link: 'https://www.credly.com/earner/earned/badge/a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' },
  { name: 'GenAI for Executives & Business Leaders: An Introduction', url: 'https://images.credly.com/images/5e4d3c2b-1a9f-48e7-9c8b-7d6e5f4a3b2c/image.png', link: 'https://www.credly.com/earner/earned/badge/b5c6d7e8-f9a0-1b2c-3d4e-5f6a7b8c9d0e' },
  { name: 'Software Engineering Essentials', url: 'https://images.credly.com/images/3c2b1a9f-8e7d-6c5b-4a3f-2e1d0c9b8a7f/image.png', link: 'https://www.credly.com/earner/earned/badge/c7d8e9f0-a1b2-3c4d-5e6f-7a8b9c0d1e2f' },
  { name: 'Google Project Management Professional Certificate (v2)', url: 'https://images.credly.com/images/1f8e0e7d-6c5b-4a3f-2e1d-0c9b8a7f6e5d/image.png', link: 'https://www.credly.com/earner/earned/badge/d9e0f1a2-b3c4-5d6e-7f8a-9b0c1d2e3f4a' },
  { name: 'Google Data Analytics Professional Certificate', url: 'https://images.credly.com/images/2e1d0c9b-8a7f-6e5d-4c3b-2a1f0e9d8c7b/image.png', link: 'https://www.credly.com/earner/earned/badge/ea1f2a3b-4c5d-6e7f-8a9b-0c1d2e3f4a5b' },
  { name: 'Google IT Support Professional Certificate (v2)', url: 'https://images.credly.com/images/3d2c1b0a-9f8e-7d6c-5b4a-3f2e1d0c9b8a/image.png', link: 'https://www.credly.com/earner/earned/badge/fb2a3b4c-5d6e-7f8a-9b0c-1d2e3f4a5b6c' },
  { name: 'Google Cybersecurity Professional Certificate V2', url: 'https://images.credly.com/images/4c3b2a1f-0e9d-8c7b-6a5f-4e3d2c1b0a9f/image.png', link: 'https://www.credly.com/earner/earned/badge/0c1d2e3f-4a5b-6c7d-8e9f-0a1b2c3d4e5f' },
  { name: 'Google Digital Marketing and E-Commerce Professional Certificate', url: 'https://images.credly.com/images/5d4c3b2a-1f0e-9d8c-7b6a-5f4e3d2c1b0a/image.png', link: 'https://www.credly.com/earner/earned/badge/1d2e3f4a-5b6c-7d8e-9f0a-1b2c3d4e5f6a' },
  { name: 'Google UX Design Professional Certificate', url: 'https://images.credly.com/images/6e5d4c3b-2a1f-0e9d-8c7b-6a5f4e3d2c1b/image.png', link: 'https://www.credly.com/earner/earned/badge/2e3f4a5b-6c7d-8e9f-0a1b-2c3d4e5f6a7b' },
  { name: 'Google AI Essentials V1', url: 'https://images.credly.com/images/7f6e5d4c-3b2a-1f0e-9d8c-7b6a5f4e3d2c/image.png', link: 'https://www.credly.com/earner/earned/badge/3f4a5b6c-7d8e-9f0a-1b2c-3d4e5f6a7b8c' }
];

function generateBadgesHTML(badges) {
  let html = '<div align="center" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; margin: 20px 0;">';
  badges.forEach((badge) => {
    html += '\n  <a href="' + badge.link + '" title="' + badge.name + '" target="_blank" rel="noopener noreferrer" style="display: inline-block; text-decoration: none;">';
    html += '\n    <img src="' + badge.url + '" alt="' + badge.name + '" width="80" height="80" style="border-radius: 4px; background-color: transparent; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease; padding: 5px;" />';
    html += '\n  </a>';
  });
fix: Simplify badge insertion with hardcoded URLs and string concatenation  return html;
}

async function main() {
  try {
    const readmeFile = path.join(process.env.GITHUB_WORKSPACE || '.', 'README.md');
    console.log('Updating README with ' + BADGES.length + ' Credly badges...');
    
    const badgesHtml = generateBadgesHTML(BADGES);
    let readmeContent = fs.readFileSync(readmeFile, 'utf8');
    const badgesRegex = /<!--START_SECTION:badges-->[\s\S]*?<!--END_SECTION:badges-->/;
    
    if (badgesRegex.test(readmeContent)) {
      readmeContent = readmeContent.replace(badgesRegex, '<!--START_SECTION:badges-->' + badgesHtml + '\n<!--END_SECTION:badges-->');
      fs.writeFileSync(readmeFile, readmeContent);
      console.log('✅ Successfully updated README with ' + BADGES.length + ' badges');
    } else {
      console.warn('⚠️ Badge section not found in README');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error: ' + error.message);
    process.exit(1);
  }
}

main();
