docker-auto-build-test
======================


目標是利用 docker hub 的 automated build 的功能，做到每次 push request 到 github 時，就能自動建立該專案的測試 image。

## Part I: 建立 automated build 的 Repository

1. 先把 docker hub 的帳號跟 github/bitbucket 的帳號 link 起來
2. 先在 Github 建好要 auto build 的專案，例如我建立了一個 https://github.com/azole/docker-auto-build-test
3. 在 docker hub 按下 Add Repository，選擇 Automated Build
4. 選擇 Github 或是 Bitbucket，這邊我選擇 Github
5. 選擇要 build 的 Repository，我選了剛剛建立的 docker-auto-build-test
6. 接下來就會出現一個設定畫面，沒有特別的 Branch 或 Tag 要選的話，用預設值就可以了。
7. 按下 Create Repository，這樣就建立好了，非常地簡單。
8. 這時候到 My Repositories 看看，就會看到一個 azole/docker-auto-build-test 的 repository。
9. 點進去看到 repo 的細節後，點到 Build Details 這個分頁，會看到 auto-build 的結果，有 id, status 跟相關的時間註記。
10. 現在會看到一個 Error 的結果，點 build Id 進去看細節，會看到 Error 的原因是 Specified Dockerfile was not found. 非常合理，因為我們沒有在這個 github 專案中放 Dockerfile。

## Part II: 建立測試用的 nodejs 專案

參考 [https://github.com/alsotang/node-lessons/tree/master/lesson6](https://github.com/alsotang/node-lessons/tree/master/lesson6) 的內容，建立了 nodejs 的專案，因為不是這邊的重點，就請大家自己參考該連結，或是參考 [https://github.com/azole/docker-auto-build-test](https://github.com/azole/docker-auto-build-test) 裡頭的程式碼。

這個專案裡頭，我們做了一個小小的 fibonacci 的功能，並且利用 mocha 做了測試，還有一個 Makefile，也在 package.json 中寫了 npm test。

當我把測試專案做好的時候，做了一次 commit/push，回到 docker hub 上去看，會發現又多了一筆 Build Details 的記錄，這表示 Github 跟 Docker hub 真的有連動起來，不過狀態依舊是 Error，因為我們還是沒有 Dockerfile。

## Part III: Dockerfile

```
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
```

這個 Dockerfile 寫好後，可以自己先 build 起來測試看看，build 後 run 起來，應該會看到測試的結果。

這時候把 Dockerfile push 上 github，這時候會看到又多了一筆 Build Details，狀態是 Building，而 Dockerfile 這個分頁也已經抓到我們剛剛 push 上去的 Dockerfile 了。

稍等一段時間，就會看到狀態已經是 Finished，點進去看，也有整個 build 的過程的 logs 可以看。

## Part IV: pull image and test
最後，我們測試看看，把這個 image pull 下來用用看。

 ```
 docker pull azole/docker-auto-build-test
 docker run azole/docker-auto-build-test
 ```

## Part V: 優化
這個 Dockerfile 其實還可以做更好的設計，例如：

1. 將 ubuntu update 獨立成一個 image。
2. 再從這個更新過的 image 去安裝 git，也獨立成一個 image。
3. 接續 2 這個 image 去安裝 nodejs，然後這些都 push 上去。
4. automated build 這邊的 Dockerfile 就從 3 做出來的 image 去 build。

於是 Dockerfile 就只剩下這些：

```
FROM azole/testbase

# pull 
RUN git clone https://github.com/azole/docker-auto-build-test.git
WORKDIR /docker-auto-build-test
RUN npm install

# run test
CMD ["npm", "test"]
```

先把基礎環境做好，這就不用重複去 build 這些基礎的環境了，每次的 automated build 只需要從 pull 程式碼開始即可，image build 的速度會快上許多。

更進一步的話，還可以搭配 CI 一起做。

---
以上的範例是從無到有去建立，包括 github repo 與專案內容也是，步驟上可以視自己的情況去做，github repo, 專案內容, Dockerfile, docker hub repo 中只有 github repo 要先于 docker repo 建立，其他的順序都沒差。

