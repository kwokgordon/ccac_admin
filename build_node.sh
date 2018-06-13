docker stop ccac_admin
docker rm ccac_admin

rm -rf ccac_admin

git clone https://github.com/kwokgordon/ccac_admin.git

docker run -itd --name ccac_admin -p 3100:3100 --restart always --env-file /etc/environment -v "$PWD":/usr/src/app -w /usr/src/app node:4 node ./ccac_admin/bin/www


