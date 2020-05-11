CREATE TABLE file (
    id INT NOT NULL Primary Key AUTO_INCREMENT,
    user_id INT NOT NULL,
    portfol_num INT NOT NULL,
    name VARCHAR(100),
    url VARCHAR(100),
    description VARCHAR(100),
    date DATE
) DEFAULT CHARSET=utf8;