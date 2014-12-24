FROM ubuntu

# install nodejs
RUN apt-get -qq update
RUN apt-get -y install nodejs
# 因為用 apt 的方式安裝的指令會是 nodejs，但個人習慣用 node，所以做個 link
RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN apt-get -y install npm

# install git
RUN apt-get -y install git

# pull 
RUN git clone https://github.com/azole/docker-auto-build-test.git
WORKDIR /docker-auto-build-test
RUN npm install

# run test
CMD ["npm", "test"]
