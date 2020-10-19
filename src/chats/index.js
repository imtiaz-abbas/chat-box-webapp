const { pool } = require('./../../config');
const server = require('./../../server');
const url = require('url');

const getAllChats = (req, res) => {
  const sql = 'SELECT * FROM chats';
  pool.query(sql, (error, results) => {
    if (error) {
      res.send({ message: JSON.stringify(error) });
    } else {
      res.status(200).json(server.successBody(results.rows));
    }
  });
};

const getChat = (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  const senderId = queryObject.sender_id;
  const receiverId = queryObject.receiver_id;
  const sql = `SELECT * FROM chats WHERE (primary_user_id = '${senderId}' AND secondary_user_id = '${receiverId}') OR (primary_user_id = '${receiverId}' AND secondary_user_id = '${senderId}') LIMIT 1`;
  pool.query(sql, (error, results) => {
    if (error) {
      res.status(400).send({ message: JSON.stringify(error) });
    } else {
      if (results.rows.length > 0) {
        res.status(200).send(server.successBody(results.rows[0]));
      } else {
        res.status(404).send({ message: 'record not found' });
      }
    }
  });
};

module.exports = {
  getAllChats,
  getChat,
};
