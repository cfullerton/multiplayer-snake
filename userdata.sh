yes | sudo yum update
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 4.4.5
yes | sudo yum install git
git clone https://github.com/cfullerton/multiplayer-snake.git
cd multiplayer-snake/
node server
