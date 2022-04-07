1. ssh 
2. sudo su
3. cd hostname/backend
4. pm2 stop index.js
5. sudo certbot certonly --standalone
6. pm2 start index.js