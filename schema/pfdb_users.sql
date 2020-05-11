CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  authId VARCHAR(50) NOT NULL,
  username VARCHAR(30) NULL,
  password VARCHAR(255) NULL,
  displayName VARCHAR(50) NULL,
  email VARCHAR(50) NULL,
  salt VARCHAR(255) NULL,
  profileImg VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX authId_UNIQUE (authId ASC)
);

