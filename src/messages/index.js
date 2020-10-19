const { pool } = require('./../../config');
const server = require('./../../server');
const uuid = require('uuid');
const url = require('url');

const sendMessage = (req, res) => {
  let requestParams = req.body;
  var chat_sql =
    'INSERT INTO chats (id, primary_user_id, secondary_user_id, timestamp) VALUES ($1,$2,$3,$4)';
  const messageId = requestParams.id;
  const userId = requestParams.sender_id;
  const friendId = requestParams.receiver_id;
  const content = requestParams.content;
  var chatId = requestParams.chat_id;
  var type = requestParams.type;
  const now = new Date();
  if (!chatId) {
    chatId = uuid.v4();
    if (messageId && userId && friendId && content && chatId && type) {
      pool.query(
        chat_sql,
        [chatId, userId, friendId, now],
        (error, results) => {
          if (!error) {
            storeMessageToDb(
              res,
              messageId,
              userId,
              friendId,
              content,
              chatId,
              type,
            );
          } else {
            res.status(400).send({ message: JSON.stringify(error) });
          }
        },
      );
    } else {
      res
        .status(400)
        .send({ status: 'failed', message: 'userId or friendId is missing' });
    }
  } else {
    storeMessageToDb(res, messageId, userId, friendId, content, chatId);
  }
};

const storeMessageToDb = (
  res,
  messageId,
  userId,
  friendId,
  content,
  chatId,
  type,
) => {
  var sql =
    'INSERT INTO messages (id, sender_id, receiver_id, content, timestamp, chat_id, kind) VALUES ($1,$2,$3,$4,$5,$6,$7)';
  if (messageId && userId && friendId && content && chatId && type) {
    const now = new Date();
    pool.query(
      sql,
      [messageId, userId, friendId, content, now, chatId, type],
      (error, results) => {
        if (!error) {
          getMessageById(res, messageId);
        } else {
          res.status(400).send({ message: JSON.stringify(error) });
        }
      },
    );
  } else {
    res
      .status(400)
      .send({ status: 'failed', message: 'message creation failed' });
  }
};

const getMessageById = (res, messageId) => {
  var sql = `SELECT * FROM messages WHERE id = '${messageId}'`;

  if (messageId) {
    pool.query(sql, (error, results) => {
      if (!error) {
        res.status(200).send(server.successBody(results.rows[0]));
      } else {
        res.status(400).send({ message: JSON.stringify(error) });
      }
    });
  } else {
    res.status(400).send({ status: 'failed', message: 'messageId is missing' });
  }
};

const getMessages = (req, res) => {
  let requestParams = req.body;

  const userId = requestParams.userId;
  const friendId = requestParams.friendId;
  var sql = `SELECT * FROM messages WHERE sender_id = '${userId}' AND receiver_id = '${friendId}' OR sender_id = '${friendId}' AND receiver_id= '${userId}' ORDER BY timestamp DESC`;

  if (userId && friendId) {
    pool.query(sql, (error, results) => {
      if (!error) {
        res.send(results.rows);
      } else {
        res.send({ message: JSON.stringify(error) });
      }
    });
  } else {
    res.send({ status: 'failed', message: 'userId or friendId is missing' });
  }
};

const getMessagesByChat = (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  const pageNumber = Number(queryObject.page_number);
  const limit = Number(queryObject.limit);

  let requestParams = req.params;
  const chatId = requestParams.chat_id;
  var sql = `SELECT * FROM messages WHERE chat_id = '${chatId}' ORDER BY timestamp DESC LIMIT ${limit} OFFSET ${
    limit * pageNumber
  }`;

  console.log(sql);
  if (chatId) {
    pool.query(sql, (error, results) => {
      if (!error) {
        res.status(200).send(server.successBody(results.rows));
      } else {
        res.send({ message: JSON.stringify(error) });
      }
    });
  } else {
    res.send({ status: 'failed', message: 'userId or friendId is missing' });
  }
};

const messagesCount = (req, res) => {
  let requestParams = req.body;

  const userId = requestParams.userId;
  const friendId = requestParams.friendId;
  var sql = `SELECT COUNT(*) AS messages_count FROM messages WHERE sender_id = '${userId}' AND receiver_id = '${friendId}' OR sender_id = '${friendId}' AND receiver_id = '${userId}'`;

  if (userId && friendId) {
    pool.query(sql, (error, results) => {
      if (!error) {
        if (results.rows.length > 0) {
          res.send(results.rows[0]);
        } else {
          res.send({ messages_count: 0 });
        }
      } else {
        res.send({ message: JSON.stringify(error) });
      }
    });
  } else {
    res.send({ status: 'failed', message: 'userId or friendId is missing' });
  }
};

module.exports = {
  messagesCount,
  getMessages,
  sendMessage,
  getMessagesByChat,
};
