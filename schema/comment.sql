CREATE TABLE comment (
    id INT NOT NULL Primary Key AUTO_INCREMENT,
    user_id INT NOT NULL,
    portfol_num INT NOT NULL,
    name VARCHAR(20),
    message VARCHAR(100),
    date DATE,
    FOREIGN KEY (portfol_num) REFERENCES portfolio(pid)
) DEFAULT CHARSET=utf8;
