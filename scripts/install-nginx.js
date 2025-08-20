const { NodeSSH } = require('node-ssh');
const readline = require('readline');
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

askHiddenQuestion('Enter VPS password: ', async (password) => {
  const {
    VPS_HOST,
    VPS_PORT,
    VPS_USER,
  } = config;

  try {
    console.log(`🔐 Connecting to ${VPS_USER}@${VPS_HOST}...`);
    await ssh.connect({
      host: VPS_HOST,
      port: VPS_PORT,
      username: VPS_USER,
      password: password,
    });

    console.log('📥 Installing Nginx...');
    const commands = [
      'sudo apt update',
      'sudo apt install -y nginx',
      'sudo systemctl enable nginx',
      'sudo systemctl start nginx',
      'sudo ufw allow "Nginx Full"'
    ];

    for (const command of commands) {
      console.log(`➡️ Running: ${command}`);
      const result = await ssh.execCommand(command);
      if (result.stderr) {
        console.error(`❌ Error running "${command}":\n${result.stderr}`);
      } else {
        console.log(`✅ Success:\n${result.stdout}`);
      }
    }

    console.log('🎉 Nginx installed and started successfully!');
    ssh.dispose();
  } catch (err) {
    console.error('❌ SSH Connection or command failed:', err.message);
  }
});
