CREATE TABLE portfolio (
    pid INT NOT NULL Primary Key ,
    id INT NOT NULL UNIQUE KEY , 	
    introduce TEXT ,
    skills JSON ,
    careers JSON ,
    works JSON ,
    phone VARCHAR(25) ,
    homepage VARCHAR(255) ,
    temp INT,
   FOREIGN KEY (id) REFERENCES users(id)); 
