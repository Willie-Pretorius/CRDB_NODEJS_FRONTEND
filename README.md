https://protect-za.mimecast.com/s/9kIGCAnXYRIw62mtGNo3E?domain=releases.ubuntu.com

MongoDB installation
https://protect-za.mimecast.com/s/P_XJCBgXYVfw6BZt6vi6y?domain=mongodb.com
wget -qO - https://protect-za.mimecast.com/s/LIIECDRZVXuEv06HAB1T0?domain=mongodb.org | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://protect-za.mimecast.com/s/2GOECElXVYsv9MAHPNEow?domain=repo.mongodb.org focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org


Node.js installation
https://protect-za.mimecast.com/s/4DnZCGZXV1cDYGyhkv1PT?domain=github.com
curl -fsSL https://protect-za.mimecast.com/s/y0CRCJZK94c6r54sOgM0R?domain=deb.nodesource.com | sudo -E bash -
sudo apt-get install -y nodejs

mkdir CRDB
git clone

Once installation completes.

"By default, MongoDB runs using the mongodb user account. If you change the user that runs the MongoDB process, you must also modify the permission to the data and log directories to give this user access to these directories."

mongoDB service commands
sudo systemctl enable mongod
sudo systemctl stop mongod
sudo systemctl restart mongod
sudo systemctl status mongod

Test to make sure frontend can do query.

Schedule routing script.

date --set="2 OCT 2006 18:00:00"
timedatectl set-timezone Africa/Johannesburg
crontab -e
27 21 * * * cd CRDB/ITEC_CRDB_Python_Script && python3 routine_start.py


## installing pm2 webserver.
npm install pm2

npm start app.js from frontend dir
pm2 startup
copy and paste ink provided to enable startup on boot.

pm2 status
pm2 start
pm2 restart
pm2 stop.

ufw firewall setup
sudo ufw allow from https://protect-za.mimecast.com/s/-5qUCKO7VgTXEmAcog2LF?domain=172.*.*.0 to any port 22 proto tcp
sudo ufw allow from https://protect-za.mimecast.com/s/nz40CLg1VjfGj4otK0RTs?domain=192.168.0.0 to any port 22 proto tcp
sudo ufw allow http
sudo ufw allow https
sudo ufw enable

nginx reverse proxy setup
sudo apt install nginx
sudo vim /etc/nginx/sites-available/default
server_name yourdomain.com www.yourdomain.com;
location / {
        proxy_pass http://localhost:3000; #whatever port your app runs on
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
sudo nginx -t
sudo service nginx restart
