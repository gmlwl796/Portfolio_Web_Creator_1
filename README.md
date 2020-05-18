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



<br>
# 프로젝트 전체 틀
* Node.js로 사용자가 요청하거나 보낸 정보를 DB에 저장하거나 불러와서 다시 사용자에게 보낸다.
* Mysql DataBase는 사용자정보나 사용자 평가, 로그인, 입력정보들을 저장한다.
* 웹페이지는 html로 틀을 구성 css로 페이지 꾸미고 jQuery로는 입력 값을 서버로 전달하거나 서버에서 받아 와 페이지를 재구성(interaction)한다.
<br>

# Preview the Website! / 완성된 웹사이트 미리 보기

[![Watch the video]](https://www.youtube.com/embed/4cBB8imoPt4)
<br>


# 기능 설명
1. Main page에서 다른 사용자들의 포트폴리오를 구경할 수 있음.
2. 로그인 (홈페이지 내 가입 또는 네이버, 페이스북 등과 같은 SNS 연동)
3. 로그인 후 '마이페이지'와 '내 포트폴리오' 사이트로 들어갈 수 있음.
4. 마이페이지 -> '내 정보 수정'에서 프로필 이미지 설정과 이메일 등록이 가능
5. 마이페이지 -> '포트폴리오 수정'에서 포트폴리오 작성 가능. 
6. '포트폴리오 수정' 페이지
     - 테마 선택 가능 4가지로 구성 (basic, white-style, black style, simple style)
     - 자기소개 입력
     - 기술스펙 작성 가능 (작성 시, 막대그래프로 표현됨)
     - 커리어 작성 가능
     - 작업물 첨부파일 가능
     - Contact 첨부 가능
     - 다른 사람이 포트폴리오에 대한 댓글 남길 수 있음
     - 작성한 포트폴리오의 소스코드 다운이 가능함.
     - 작성한 포트폴리오 PDF로 저장이 가능함

<br>
