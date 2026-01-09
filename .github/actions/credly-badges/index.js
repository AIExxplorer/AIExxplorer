const https = require('https');
const fs = require('fs');
const path = require('path');

// Badge data with transparent image URLs
const BADGE_DATA = [
  { name: 'Adobe Content Creator', url: 'https://images.credly.com/images/bbdf7c81-3c7d-41f2-918f-94aec6ae250d/blob' },
  { name: 'Python AI', url: 'https://images.credly.com/images/e462102c-b2ee-4208-aca0-b58f53331266/image.png' },
  { name: 'GenAI Dev', url: 'https://images.credly.com/images/afaacd18-d4a9-48af-b54c-846615756ec7/image.png' },
  { name: 'IBM', url: 'https://images.credly.com/images/70675aed-31be-4c30-add7-b99905a34005/image.png' },
  { name: 'Python Project', url: 'https://images.credly.com/images/33ed2910-9750-4613-aa2a-590e845c6edb/image.png' },
  { name: 'HTML/CSS/JS', url: 'https://images.credly.com/images/09490195-093b-4c9f-9f31-bdc434e66a23/Coursera_20Introduction_20to_20HTML_20CSS_20and_20JavaScript.png' },
  { name: 'Python DS', url: 'https://images.credly.com/images/40bee502-a5b3-4365-90e7-57eed5067594/image.png' },
  { name: 'AI V2', url: 'https://images.credly.com/images/3e199561-bc4a-4621-9361-340fc43d997e/Coursera_20Artificial_20Intelligence_20Essentials_20V2.png' },
  { name: 'GenAI', url: 'https://images.credly.com/images/7658c4f1-0570-42c7-83b0-04cac8b0aca2/image.png' },
  { name: 'Prompt Eng', url: 'https://images.credly.com/images/7fd5a03e-823f-4449-af43-59afe528f4ee/image.png' },
  { name: 'GenAI Essentials', url: 'https://images.credly.com/images/7fd5a03e-823f-4449-af43-59afe528f4ee/image.png' },
  { name: 'Google PM', url: 'https://images.credly.com/images/4dd5d704-f681-4f33-b59b-92953e209239/blob' },
  { name: 'Google Data', url: 'https://images.credly.com/images/ca0efb3c-c7e4-47bb-a1be-5f75fee51b3e/image.png' },
  { name: 'Google IT', url: 'https://images.credly.com/images/5f2f1ecd-1124-4580-b8df-56f813f37de5/blob' },
  { name: 'Google Security', url: 'https://images.credly.com/images/d1efc77f-76b8-4e4f-bcc9-fef9e47b2d4c/image.png' },
  { name: 'Google Digital Marketing', url: 'https://images.credly.com/images/b310a958-c9d7-47d4-892f-9194a1e5d12c/image.png' },
  { name: 'Google UX', url: 'https://images.credly.com/images/d2b6a6df-0a7f-475c-bbf9-3e3456a2c12b/blob' },
  { name: 'Google AI', url: 'https://images.credly.com/images/8b846e18-c0ac-407b-adc5-c5f3f6a73e4c/image.png' },
  { name: 'GenAI for Business', url: 'https://images.credly.com/images/2845b5da-5640-41f4-b10e-f7f1e9f7b2bc/image.png' },
  { name: 'Software Engineering', url: 'https://images.credly.com/images/1ca3fa21-25f4-41bc-b3e2-e88fc2fb1d71/image.png' }
];

async function main() {
  try {
    const readmeFile = path.join(process.env.GITHUB_WORKSPACE, 'README.md');
    let content = fs.readFileSync(readmeFile, 'utf8');

    let badges = '<div align="center" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; margin: 20px 0;">';
    BADGE_DATA.forEach(badge => {
      badges += `\n  <a href="https://www.credly.com/users/aiexxplorer/badges"><img src="${badge.url}" alt="${badge.name}" width="80" height="80" style="border-radius: 4px;"/></a>`;
    });
    badges += '\n</div>';

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
