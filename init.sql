CREATE TABLE users (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(25),
    phoneNumber VARCHAR(15) NOT NULL,
    email VARCHAR(45)
);

CREATE TABLE messages (                                                                                            
    message_id VARCHAR(50) PRIMARY KEY,
    sender_id VARCHAR(50) NOT NULL,
    reciever_id VARCHAR(50) NOT NULL,
    text VARCHAR(255),
    timestamp TIMESTAMP,
    seen REAL DEFAULT 0
);