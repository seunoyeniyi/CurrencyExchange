CREATE TABLE IF NOT EXISTS users (
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(1000),
    password VARCHAR(2000),
    age INT,
    nationality VARCHAR(1000),
    status VARCHAR(1000) DEFAULT 'active',
    role VARCHAR(1000) DEFAULT 'user',
    picture VARCHAR(2000),
    date DATETIME DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS sessions (
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    secret_key VARCHAR(2000),
    date DATETIME DEFAULT NOW()
);
