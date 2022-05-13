
----------------------------------------------------
Deployment Guide: Ubuntu 20.04.4
----------------------------------------------------


https://releases.ubuntu.com/20.04.4/?_ga=2.126533133.1693286580.1651167948-1268987514.1651167948

sudo apt-get update

sudo apt upgrade


-----------------------------------------
Node.js installation
-----------------------------------------

https://github.com/nodesource/distributions/blob/master/README.md

curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

sudo apt-get install -y nodejs


------------------------------------------
Download Frontend repo
------------------------------------------

git init

git remote add origin your-git-url

git fetch

git reset --mixed origin/master


-------------------------------------------------
MongoDB installation
-------------------------------------------------

https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/

wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -

echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

sudo apt-get install -y mongodb-org

Once installation completes.

Test to make sure frontend can do query.

mongoDB service commands

sudo systemctl enable mongod

sudo systemctl stop mongod

sudo systemctl restart mongod

sudo systemctl status mongod


mkdir CRDB

git clone


-----------------------------------------------------------------
Schedule routine python script.
-----------------------------------------------------------------

date --set="2 OCT 2006 18:00:00"

timedatectl set-timezone Africa/Johannesburg

crontab -e

00 05 * * * cd CRDB/ITEC_CRDB_Python_Script && python3 routine_start.py


------------------------------------------------
## installing pm2 webserver.
------------------------------------------------
npm install pm2

npm start app.js from frontend dir

pm2 startup

copy and paste ink provided to enable startup on boot.


pm2 commands:

pm2 status

pm2 start

pm2 restart

pm2 stop.


-----------------------------------------------------
ufw firewall setup
-----------------------------------------------------
## input firewall rules.

sudo ufw allow from 172.0.0.0/24 to any port 22 proto tcp

sudo ufw allow from 192.168.0.0/24 to any port 22 proto tcp

sudo ufw allow http

sudo ufw allow https

sudo ufw enable


---------------------------------------------------
nginx reverse proxy setup
---------------------------------------------------

sudo apt install nginx

sudo vim /etc/nginx/sites-available/default

server_name yourdomain.com www.yourdomain.com;

location / {

        proxy_pass http://localhost:3000;
        
        proxy_http_version 1.1;
        
        proxy_set_header Upgrade $http_upgrade;
        
        proxy_set_header Connection 'upgrade';
        
        proxy_set_header Host $host;
        
        proxy_cache_bypass $http_upgrade;
        
    }
    
sudo nginx -t

sudo service nginx restart

