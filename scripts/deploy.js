const { exec } = require('child_process');
const { NodeSSH } = require('node-ssh');
const readline = require('readline');
const path = require('path');
const ssh = new NodeSSH();
const config = require('./config');

function askHiddenQuestion(query, callback) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const stdin = process.stdin;
  stdin.on('data', (char) => {
    char = char + '';
    switch (char) {
      case '\n':
      case '\r':
      case '\u0004':
        stdin.pause();
        break;
      default:
        process.stdout.clearLine(0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(query + Array(rl.line.length + 1).join('*'));
        break;
    }
  });

  rl.question(query, (value) => {
    rl.history = rl.history.slice(1);
    rl.close();
    callback(value);
  });
}

// Main logic
askHiddenQuestion('Enter VPS password: ', async (password) => {
  const {
    VPS_HOST,
    VPS_PORT,
    VPS_USER,
    LOCAL_DIST_DIR,
    REMOTE_DIR,
  } = config;

  console.log('🛠️ Building Angular project...');

  exec('npx ng build --configuration=development', async (err, stdout, stderr) => {
    if (err) {
      console.error(`❌ Angular build failed:\n${stderr}`);
      return;
    }

    console.log('✅ Angular build completed.\n');

    console.log(`🔐 Connecting to ${VPS_USER}@${VPS_HOST}...`);
    try {
      await ssh.connect({
        host: VPS_HOST,
        port: VPS_PORT,
        username: VPS_USER,
        password: password,
      });

      console.log('📦 Uploading files...');
      const localPath = path.resolve(LOCAL_DIST_DIR);

      await ssh.putDirectory(localPath, REMOTE_DIR, {
        recursive: true,
        concurrency: 5,
        validate: function(itemPath) {
          const baseName = path.basename(itemPath);
          return baseName !== 'node_modules'; // ignore node_modules if exists
        },
        tick: function(localPath, remotePath, error) {
          if (error) {
            console.error(`❌ Failed to upload: ${localPath}`);
          } else {
            console.log(`✅ Uploaded: ${localPath}`);
          }
        },
      });

      console.log('🚀 Deployment successful!');
      ssh.dispose();
    } catch (err) {
      console.error('❌ SSH Connection or upload failed:', err.message);
    }
  });
});
