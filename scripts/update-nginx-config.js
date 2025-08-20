const { NodeSSH } = require('node-ssh');
const readline = require('readline');
const fs = require('fs');
const ssh = new NodeSSH();
const config = require('./config');

function askQuestion(prompt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => rl.question(prompt, ans => {
    rl.close();
    resolve(ans.trim());
  }));
}

(async () => {
  const domain = await askQuestion('Enter your domain (e.g. autosconnect.com): ');
  const apiPath = await askQuestion('Enter your API path (e.g. api2): ');
  const password = await askQuestion('Enter VPS password: ');

  const nginxTemplate = `
# Default server configuration

server {
        listen 80 default_server;
        listen [::]:80 default_server;
        server_name autosconnect.com www.autosconnect.com;
        #location /quotes/ {
        #alias /opt/tomcat/countertop/quotes/;
        #autoindex off;  # optional, turn on if you want directory listing
        #client_max_body_size 50M;
    }
}

server {
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;

    server_name autosconnect.com www.autosconnect.com;

    ssl_certificate /etc/letsencrypt/live/autosconnect.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/autosconnect.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
    root /var/www/html;
    try_files $uri $uri/ /index.html;
    #location /countertop/quotes/ {
    #alias /opt/tomcat/countertop/quotes/;
    # Optional:
    # autoindex off;  # or on if you want directory listing
    # client_max_body_size 50M;
}

#   ssl_protocols TLSv1.2 TLSv1.3;
#   ssl_prefer_server_ciphers on;

location /api/ {
    proxy_pass http://127.0.0.1:8080/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # Optional for WebSocket support
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}

#server {
# SSL configuration
# listen 443 ssl default_server;
# listen [::]:443 ssl default_server;
# include snippets/snakeoil.conf;
# root /var/www/html;
# index index.html index.htm index.nginx-debian.html;
# server_name drawtoestimate.com; # managed by Certbot
# location / {
#     try_files $uri $uri/ =404;
# }
#location ~ \.php$ {
#     include snippets/fastcgi-php.conf;
#     fastcgi_pass unix:/run/php/php7.4-fpm.sock;
# }
#location ~ /\.ht {
#     deny all;
# }
# listen [::]:443 ssl ipv6only=on; # managed by Certbot
# ssl_certificate /etc/letsencrypt/live/autosconnect.com/fullchain.pem; # managed by Certbot
# ssl_certificate_key /etc/letsencrypt/live/autosconnect.com/privkey.pem; # managed by Certbot
# include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
# ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
#}

server {
    if ($host = autosconnect.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    if ($host = www.autosconnect.com) {
        return 301 https://autosconnect.com$request_uri;
    } # managed by Certbot

    listen 80;
    listen [::]:80;
    server_name autosconnect.com;

    location / {
        proxy_pass https://autosconnect.com:8443;
    }

    return 404; # managed by Certbot
}
`;

  // Replacements (only exact domains, not variables like $host)
  const updatedConfig = nginxTemplate
    .replace(/autosconnect\.com/g, domain)
    .replace(/www\.autosconnect\.com/g, `www.${domain}`)
    .replace(/\/api\//g, `/${apiPath}/`);

  // Write locally to temp
  const tmpFile = `./nginx_temp_default`;
  fs.writeFileSync(tmpFile, updatedConfig);

  try {
    const { VPS_HOST, VPS_PORT, VPS_USER } = config;
    console.log(`🔐 Connecting to ${VPS_USER}@${VPS_HOST}...`);

    await ssh.connect({
      host: VPS_HOST,
      port: VPS_PORT,
      username: VPS_USER,
      password: password,
    });

    console.log(`📤 Uploading new nginx config...`);
    await ssh.putFile(tmpFile, '/tmp/nginx-default');
    await ssh.execCommand('sudo mv /tmp/nginx-default /etc/nginx/sites-available/default');
    await ssh.execCommand('sudo nginx -t && sudo systemctl reload nginx');

    console.log('✅ Nginx configuration updated and reloaded!');
    ssh.dispose();
    fs.unlinkSync(tmpFile); // clean up temp file
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
})();
