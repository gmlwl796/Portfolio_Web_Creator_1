const express = require('express');
const multer = require('multer');
const database = require('../database/db');
const router = express.Router();

const uploadFilePath = 'uploads/';

var storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, uploadFilePath);
    },

    filename: (request, file, cb) => {
        console.log(file);
        file.uploadedFile = {
            name: file.originalname.split('.')[0],
            ext: file.mimetype.split('/')[1],
        };

        file.uploadedFile["uploadName"] = `${Date.now()}_${file.originalname}`;
        //${file.uploadedFile.name}.${file.uploadedFile.ext}

        cb(null, file.uploadedFile["uploadName"]);
    }
});

var profileStorage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, uploadFilePath);
    },

    filename: (request, file, cb) => {
        file.uploadedFile = {
            name: file.originalname.split('.')[0],
            ext: file.mimetype.split('/')[1],
        };

        file.uploadedFile["uploadName"] = `${Date.now()}_${request.user.username}.${file.uploadedFile.ext}`;

        cb(null, file.uploadedFile["uploadName"]);
    }
});

var upload = multer({ storage: storage }).single('file');
var uploadProfileImg = multer({ storage: profileStorage }).single('img');

router.get('/:port_num', (request, response) => {
    let sql = `SELECT * FROM file WHERE portfol_num = ${request.params.port_num} ORDER BY id ASC`;

    database.query(sql, (err, result) => {
        if (!err) {
            response.status(200).send(result);
        } else {
            response.status(500).send(err);
        }
        
    });
});

router.put('/:file_id', (request, response, next) => {
    upload(request, response, err => {
        if (err) {
            response.status(500).send(err);
        } 
        else {
            let userData = request.body;
            let data = dbDataSetting(request);
            data = [data, {'id': request.params.file_id}];

            database.query(`UPDATE file SET ? WHERE ?`, data, 
            (err, result) => {
                let sendData = data[0];
                sendData["id"] = request.params.file_id;
                response.status(200).send(sendData);
            });
        } 
    });
});

var dbDataSetting = function(request) {
    let userData = request.body;
    let now = new Date();
    let dateStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    let returnData = {
        "user_id" : request.user.id,
        "portfol_num" : userData.portNum,
        "name" : request.file.uploadedFile.name,
        "url": request.file.uploadedFile.uploadName,
        "description" : userData.description,
        "date" : dateStr
    }

    return returnData;
}

router.post('/', (request, response, next) => {
    upload(request, response, err => {
        let userData = request.body;
        if (err) {
            response.status(500).send(err);
        } 
        else {
            let post = dbDataSetting(request);
            console.log(post);
            database.query(`INSERT INTO file SET ?`, post, 
            (err, result) => {
                if (err) {
                    response.status(500).send(err);
                } 
                console.log('응>?', result);
                post["id"] = result.insertId;
                response.status(200).send(post);
            });
        } 
    });
});

router.post('/profile_img', (request, response) => {
    uploadProfileImg(request, response, err => {
        let userData = request.body;
        if (err) {
            response.status(500).send(err);
        } 
        else {
            let post = { "profileImg": request.file.uploadedFile.uploadName};
            let data = [post, {'id': request.user.id}];
            database.query(`UPDATE users SET ? WHERE ?`, data, 
            (err, result) => {
                if (err) {
                    response.status(500).send(err);
                }
                response.status(200).send(post);
            });
        } 
    });
});

module.exports = router;