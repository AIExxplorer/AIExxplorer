const https = require('https');
const fs = require('fs');
const path = require('path');

// Hardcoded list of badges with proper image URLs
const BADGES = [
  {
    name: 'Adobe Content Creator Professional Certificate',
    url: 'https://images.credly.com/images/1a9df1d9-5738-4f2d-b0a5-61ef84bab5c9/image.png',
    credlyUrl: 'https://www.credly.com/badges/1a9df1d9-5738-4f2d-b0a5-61ef84bab5c9'
  },
  {
    name: 'Building Generative AI-Powered Applications with Python',
    url: 'https://images.credly.com/images/a65b6158-d14d-4dbc-a4fc-1b1c5faa80f1/image.png',
    credlyUrl: 'https://www.credly.com/badges/a65b6158-d14d-4dbc-a4fc-1b1c5faa80f1'
  },
  {
    name: 'Generative AI Essentials for Software Developers',
    url: 'https://images.credly.com/images/2e2685d9-26d0-4a9f-a7f2-b70e42d31bef/image.png',
    credlyUrl: 'https://www.credly.com/badges/2e2685d9-26d0-4a9f-a7f2-b70e42d31bef'
  },
  {
    name: 'IBM AI Developer Professional Certificate',
    url: 'https://images.credly.com/images/fa20e1ad-1c17-4748-8a75-de6df50a8c5b/image.png',
    credlyUrl: 'https://www.credly.com/badges/fa20e1ad-1c17-4748-8a75-de6df50a8c5b'
  },
  {
    name: 'Python Project for AI and Application Development',
    url: 'https://images.credly.com/images/e8f6ddca-81cf-414f-b24f-2c1e3cac4f10/image.png',
    credlyUrl: 'https://www.credly.com/badges/e8f6ddca-81cf-414f-b24f-2c1e3cac4f10'
  },
  {
    name: 'Introduction to HTML, CSS, & JavaScript',
    url: 'https://images.credly.com/images/a0f97ba6-c97e-4f0f-96ef-68ecb4d49a60/image.png',
    credlyUrl: 'https://www.credly.com/badges/a0f97ba6-c97e-4f0f-96ef-68ecb4d49a60'
  },
  {
    name: 'Python for Data Science and AI',
    url: 'https://images.credly.com/images/0c39e1b2-1a24-4f76-9fe1-2ddcd5ccbdca/image.png',
    credlyUrl: 'https://www.credly.com/badges/0c39e1b2-1a24-4f76-9fe1-2ddcd5ccbdca'
  },
  {
    name: 'Artificial Intelligence Essentials V2',
    url: 'https://images.credly.com/images/2d0fd5c4-6f48-4253-a3b0-8b15eec64ae5/image.png',
    credlyUrl: 'https://www.credly.com/badges/2d0fd5c4-6f48-4253-a3b0-8b15eec64ae5'
  },
  {
    name: 'Generative AI Essentials',
    url: 'https://images.credly.com/images/20ef7e88-6d0d-427a-b1d2-cd8872eae1b9/image.png',
    credlyUrl: 'https://www.credly.com/badges/20ef7e88-6d0d-427a-b1d2-cd8872eae1b9'
  },
  {
    name: 'Generative AI: Prompt Engineering',
    url: 'https://images.credly.com/images/9d06fb9c-2d2d-461c-961a-4c83e3b93dd7/image.png',
    credlyUrl: 'https://www.credly.com/badges/9d06fb9c-2d2d-461c-961a-4c83e3b93dd7'
  },
  {
    name: 'GenAI for Execs & Business Leaders: Integration Strategy',
    url: 'https://images.credly.com/images/ea01ae5d-2a67-48e6-99fe-51de6d689f18/image.png',
    credlyUrl: 'https://www.credly.com/badges/ea01ae5d-2a67-48e6-99fe-51de6d689f18'
  },
  {
    name: 'GenAI for Executives & Business Leaders: An Introduction',
    url: 'https://images.credly.com/images/7f3e9e41-b7f5-4a2f-bdb2-95ef4cdf45a9/image.png',
    credlyUrl: 'https://www.credly.com/badges/7f3e9e41-b7f5-4a2f-bdb2-95ef4cdf45a9'
  },
  {
    name: 'Software Engineering Essentials',
    url: 'https://images.credly.com/images/1b20ba86-4c2a-4a64-beaa-8e04edeae9d0/image.png',
    credlyUrl: 'https://www.credly.com/badges/1b20ba86-4c2a-4a64-beaa-8e04edeae9d0'
  },
  {
    name: 'Google Project Management Professional Certificate (v2)',
    url: 'https://images.credly.com/images/370a2264-40f0-4b45-90c6-2ccfe2b11b88/image.png',
    credlyUrl: 'https://www.credly.com/badges/370a2264-40f0-4b45-90c6-2ccfe2b11b88'
  },
  {
    name: 'Google Data Analytics Professional Certificate',
    url: 'https://images.credly.com/images/ec4e92ed-8e4a-49c7-9e18-e38f247e8c16/image.png',
    credlyUrl: 'https://www.credly.com/badges/ec4e92ed-8e4a-49c7-9e18-e38f247e8c16'
  },
  {
    name: 'Google IT Support Professional Certificate (v2)',
    url: 'https://images.credly.com/images/aa587beb-2b17-4e41-9d2e-b072a2b1447e/image.png',
    credlyUrl: 'https://www.credly.com/badges/aa587beb-2b17-4e41-9d2e-b072a2b1447e'
  },
  {
    name: 'Google Cybersecurity Professional Certificate V2',
    url: 'https://images.credly.com/images/f2d5a70e-d3a0-41e0-ad76-c5b7c62ee5c4/image.png',
    credlyUrl: 'https://www.credly.com/badges/f2d5a70e-d3a0-41e0-ad76-c5b7c62ee5c4'
  },
  {
    name: 'Google Digital Marketing and E-Commerce Professional Certificate',
    url: 'https://images.credly.com/images/5c2f6fcf-8888-4e33-8dc5-d0ead86dfcad/image.png',
    credlyUrl: 'https://www.credly.com/badges/5c2f6fcf-8888-4e33-8dc5-d0ead86dfcad'
  },
  {
    name: 'Google UX Design Professional Certificate',
    url: 'https://images.credly.com/images/ae2d26ba-8857-43c6-8e5f-c8e9fbee3f6b/image.png',
    credlyUrl: 'https://www.credly.com/badges/ae2d26ba-8857-43c6-8e5f-c8e9fbee3f6b'
  },
  {
    name: 'Google AI Essentials V1',
    url: 'https://images.credly.com/images/90e76cb6-610f-4908-8c5d-6f7a8bc82e6f/image.png',
    credlyUrl: 'https://www.credly.com/badges/90e76cb6-610f-4908-8c5d-6f7a8bc82e6f'
  }
];

// Generate HTML for badges with centered and transparent styling
function generateBadgesHTML(badges) {
  let html = '<div align="center" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; margin: 20px 0;">';
  
  badges.forEach((badge) => {
    html += `
  <a href="${badge.credlyUrl}" title="${badge.name}" target="_blank" rel="noopener noreferrer" style="display: inline-block; text-decoration: none;">
    <img src="${badge.url}" alt="${badge.name}" width="80" height="80" style="border-radius: 4px; background-color: transparent; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s ease; padding: 5px;" />
  </a>`;
  });
  
  html += '\n</div>';
  return html;
}

// Main function
async function main() {
  try {
    const readmeFile = path.join(process.env.GITHUB_WORKSPACE || '.', 'README.md');
    
    console.log('Updating README with Credly Badges...');
    console.log(`Found ${BADGES.length} badges to insert`);
    
    // Generate HTML for badges
    const badgesHtml = generateBadgesHTML(BADGES);
    
    // Read README file
    let readmeContent = fs.readFileSync(readmeFile, 'utf8');
    
    // Replace badges section
    const badgesRegex = /<!--START_SECTION:badges-->[\s\S]*?<!--END_SECTION:badges-->/;
    
    if (badgesRegex.test(readmeContent)) {
      readmeContent = readmeContent.replace(
        badgesRegex,
        `<!--START_SECTION:badges-->${badgesHtml}\n<!--END_SECTION:badges-->`
      );
      
      // Write updated README
      fs.writeFileSync(readmeFile, readmeContent);
      console.log(`✅ Successfully updated README with ${BADGES.length} badges`);
      console.log('📌 All badges have transparent backgrounds and are centered');
    } else {
      console.warn('⚠️  Badges section markers not found in README.md');
      console.log('Make sure your README contains:');
      console.log('<!--START_SECTION:badges-->');
      console.log('<!--END_SECTION:badges-->');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the action
main();
