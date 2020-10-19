CREATE TABLE users (
    id VARCHAR(100) PRIMARY KEY,
    first_name VARCHAR(25),
    last_name VARCHAR(25),
    display_name VARCHAR(25),
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(45)
);

CREATE TABLE chats(
    id VARCHAR(100) PRIMARY KEY,
    primary_user_id VARCHAR(100),
    secondary_user_id VARCHAR(100),
    timestamp TIMESTAMP
);

CREATE TABLE messages (                                                                                            
    id VARCHAR(50) PRIMARY KEY,
    sender_id VARCHAR(50) NOT NULL,
    receiver_id VARCHAR(50) NOT NULL,
    content VARCHAR(255),
    timestamp TIMESTAMP,
    seen REAL DEFAULT 0,
    seen_at TIMESTAMP,
    replying_to VARCHAR(50) DEFAULT NULL,
    chat_id VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL
);