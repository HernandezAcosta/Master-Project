# Peer-Review on the Blockchain
This is a description on how to setup the webapplication developed during the course of my master thesis.

## Build Setup
In the root folder of this project please execute the following commands. It might be necessary to execute them as well in the /client subfolder
``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how ReactJS works, check out the [guide](https://reactjs.org/docs/getting-started.html).


# Using Truffle with Reactjs


IMPORTANT !! Truffle contracts are compiled to build/contracts. It was necessary to make the build folder available for ReactJS. This can be done by linking the original /contract/ folder or by setting the appropriate settings in the truffle-config.js file.


# Prerequisite - Commands that have to be executed to ensure a working project



# Running the webserver:
npm install in /client dir
npm install in /mern-auth

npm run dev -> runs the webserver

#Adjustments to make on the server
client/src/components/layout/AcceptingPapers -> changing localhost statement to whatever IP the server has
client/src/components/layout/PaperSubmissionModal -> changing localhost statement to whatever IP the server has
client/src/components/layout/Reviews -> changing localhost statement to whatever IP the server has
client/src/components/layout/ReviewSubmissionModal -> changing localhost statement to whatever IP the server has
client/src/components/layout/UpdatePaperModal -> changing localhost statement to whatever IP the server has

client/node_modules/drizzle/dist/drizzle.js -> default fallback url 127.0.0.1 has to be changed to server IP and port where ganache is set up e.g. ws://141.5.107.109:8888



# Setting up Ganache

For development purposes it is okay to run ganache-cli with:

ganache-cli -a 15 -e 200 -d
ganache-cli -a 30 -e 200000 -d -h 0.0.0.0 (Host specification for public availability)

This will generate the same 15 addresses with 200 ETH over and over again, because auf -d (--deterministic)

Example MNEMONIC: myth like bonus scare over problem client lizard pioneer submit female collect

# Setting up Contracts

To interact with a Smart Contract it is needed to adjust /migrations/2_deploy_contracts.js and specify the contract that has to be deployed. Additionally, it is needed to specify in /client/src/index.js what contracts are wanted to be interacted with.


# Setting up the IPFS upload

In /ipfsUpload.js the uploade for IPFS is handled.



# Starting the ipfs daemon

ipfs daemon

Will run the local ipfs node.

# Tmux (Optional)
Using tmux to keep services running in the background on the server.

tmux new -s name_of_your_service --> will start a process with the name = name_of_your_service
Pressing ctrl+b and afterwards d will detach your tmux session and keep the triggered command running
tmux ls -> will list all tmux sessions that are running
tmux kill-server -> will kill all services
tmux kill-session -t myname -> kill session
tmux a -t myname -> attach du session myname

# Ubuntu Server Port Infos
sudo lsof -i -P -n | grep LISTEN -> Show all ports

sudo kill `sudo lsof -t -i:5000` -> Kills process on port 5000

# Checking firewall options for troubleshooting
sudo firewall-cmd --zone=public --add-port=4001/tcp --permanent
sudo firewall-cmd --zone=public --add-port=8080/tcp --permanentsudo
systemctl reload firewalld
sudo firewall-cmd --zone=public --permanent --list-ports
