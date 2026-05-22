import { execSync } from 'child_process';
import { readFileSync } from 'fs';

function exec(cmd, opts = {}) {
  console.log(`$ ${cmd}`);
  return execSync(cmd, { stdio: 'inherit', ...opts });
}

function getUncommittedContentFiles() {
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  const lines = status.trim().split('\n').filter(Boolean);
  return lines
    .map(l => l.trim())
    .filter(l => l.startsWith('?? ') || l.startsWith('M ') || l.startsWith('A '))
    .map(l => l.replace(/^[? MARC]+ /, ''))
    .filter(f => f.startsWith('content/') && (f.endsWith('.mdx') || f.endsWith('.md')));
}

const newFiles = getUncommittedContentFiles();

if (newFiles.length === 0) {
  console.log('没有未发布的文章');
  process.exit(0);
}

console.log(`发现 ${newFiles.length} 篇待发布文章:`);
newFiles.forEach(f => console.log(`  - ${f}`));

for (const file of newFiles) {
  const content = readFileSync(file, 'utf8');
  const titleMatch = content.match(/title:\s*"([^"]+)"/);
  const dateMatch = content.match(/date:\s*"([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : file;
  const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];

  exec(`git add "${file}"`);
  exec(`git commit -m "add: ${title}" --date="${date}"`);
}

console.log('正在推送到 GitHub，Vercel 将自动部署...');
exec('git push origin main');

console.log('发布完成！');
