<h1 align=center>Portfolio Web Creator</h1>
<p align=center>자신만의 포트폴리오 사이트를 만들어주는 서비스 입니다.</p>

# 프로젝트셋팅
    $ npm install
    $ npm install -g babel-cli
    $ config/config.js 파일을 수정 할 것.
    $ npm run init

    혹은
    
    $ npm install
    $ npm install -g babel-cli
    $ config/config.js 파일을 수정 할 것.
    $ mkdir uploads // 프로젝트 최상위에 uploads폴더를 만들어 줄것
    $ schema/*.sql // 안에 모든 schema를 추가할 것.

# 서버실행
    $ npm run server

# view build
    $ npm run build

# 개발환경
* Node.js(express)
* Mysql 5.7
* bootstrap
* multer
* passport