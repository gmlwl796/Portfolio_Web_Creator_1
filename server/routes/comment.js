const express = require('express');
const database = require('../database/db');
const router = express.Router();

router.get('/:portfol_num', (request, response) => {
    let sql = `SELECT * FROM comment WHERE portfol_num = ${request.params.portfol_num} ORDER BY id ASC`;

    database.query(sql, (err, result) => {
        if (!err) {
            response.status(200).send(result);
        } else {
            response.status(500).send(err);
        }
        
    });
});

router.post('/', (request, response) => {
    let userData = request.body;

    let now = new Date();
    let dateStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    let post  = {
        'portfol_num': userData.portfol_num,
        'user_id' : request.user.id, 
        'name': request.user.displayName, 
        'message': userData.message, 
        'date': dateStr
    };

    database.query(`INSERT INTO comment SET ?`, post, 
    (err, result) => {
        console.log(result);
        response.status(200).send(post);
    });
});

module.exports = router;