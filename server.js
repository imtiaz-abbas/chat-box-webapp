const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const { pool } = require('./config');

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.listen(3000, () =>
  console.log('Exress server is running at port number 3000'),
);

app.get('/users/:uid', (req, res) => {
  const userId = req.params.uid;
  if (userId) {
    var sql = `SELECT * FROM users WHERE id = '${userId}'`;
    pool.query(sql, (error, results) => {
      if (error) {
        res.send({ message: JSON.stringify(error) });
      } else {
        res.status(201).json(results.rows[0]);
      }
    });
  } else {
    res.send({ message: 'userId is invalid' });
  }
});

app.get('/user_exists/:uid', (req, res) => {
  const userId = req.params.uid;
  var sql = `SELECT * FROM users WHERE id = ${userId}`;

  if (userId) {
    pool.query(sql, (error, results) => {
      if (!error) {
        if (results.rows.length > 0) {
          res.send({ userExists: true });
        } else {
          res.send({ userExists: false });
        }
      } else {
        res.send({ message: JSON.stringify(error) });
      }
    });
  } else {
    res.send({ message: 'userId is invalid' });
  }
});

app.get('/users/search/:keyword', (req, res) => {
  const keyword = req.params.keyword ? req.params.keyword.toLowerCase() : '';
  const query = `SELECT * FROM users Where name LIKE '%${keyword}%' OR phoneNumber LIKE '%${keyword}%';`;
  pool.query(query, (err, results) => {
    if (!err) {
      res.status(201).json(results.rows);
    } else {
      res.send({ message: JSON.stringify(err) });
    }
  });
});

app.post('/sign_up', (req, res) => {
  let user = req.body;
  var sql =
    'INSERT INTO users (id, name, phoneNumber, email) VALUES ($1,$2,$3,$4)';
  const name = user.name ? user.name.toLowerCase() : '';
  const phoneNumber = user.phoneNumber ? user.phoneNumber : '';
  const email = user.email ? user.email : '';

  if (user.id) {
    pool.query(sql, [user.id, name, phoneNumber, email], (error, results) => {
      if (!error) {
        console.log(results.rows);
        res.send({ message: 'ok' });
      } else {
        res.send({ message: JSON.stringify(error) });
      }
    });
  } else {
    res.send({ status: 'failed', message: 'id is mandatory' });
  }
});

app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users';
  pool.query(sql, (error, results) => {
    if (error) {
      res.send({ message: JSON.stringify(error) });
    } else {
      console.log('results');
      console.log(results.rows);
      console.log('results');
      res.status(201).json(results.rows);
    }
  });
});

app.post('/messages_count', (req, res) => {
  let requestParams = req.body;

  const userId = requestParams.userId;
  const friendId = requestParams.friendId;
  var sql = `SELECT COUNT(*) AS messages_count FROM messages WHERE sender_id = '${userId}' AND reciever_id = '${friendId}' OR sender_id = '${friendId}' AND reciever_id = '${userId}'`;

  console.log(sql);

  if (userId && friendId) {
    pool.query(sql, (error, results) => {
      if (!error) {
        if (results.rows.length > 0) {
          res.send(results.rows[0]);
        } else {
          res.send({ messages_count: 0 });
        }
      } else {
        console.log(JSON.stringify(error));
        res.send({ message: JSON.stringify(error) });
      }
    });
  } else {
    res.send({ status: 'failed', message: 'userId or friendId is missing' });
  }
});

app.post('/messages', (req, res) => {
  let requestParams = req.body;

  const userId = requestParams.userId;
  const friendId = requestParams.friendId;
  var sql = `SELECT * FROM messages WHERE sender_id = '${userId}' AND reciever_id = '${friendId}' OR sender_id = '${friendId}' AND reciever_id= '${userId}' ORDER BY timestamp DESC`;

  if (userId && friendId) {
    pool.query(sql, (error, results) => {
      if (!error) {
        console.log(results.rows);
        res.send(results.rows);
      } else {
        console.log(JSON.stringify(error));
        res.send({ message: JSON.stringify(error) });
      }
    });
  } else {
    res.send({ status: 'failed', message: 'userId or friendId is missing' });
  }
});

app.post('/send_message', (req, res) => {
  let requestParams = req.body;
  var sql =
    'INSERT INTO messages (message_id, sender_id, reciever_id, text, timestamp) VALUES ($1,$2,$3,$4,$5)';

  const messageId = requestParams.id;
  const userId = requestParams.userId;
  const friendId = requestParams.friendId;
  const message = requestParams.message;

  if (messageId && userId && friendId && message) {
    const now = new Date();
    pool.query(
      sql,
      [messageId, userId, friendId, message, now],
      (error, results) => {
        if (!error) {
          console.log(results.rows);
          res.send({ message: 'ok' });
        } else {
          console.log(JSON.stringify(error));
          res.send({ message: JSON.stringify(error) });
        }
      },
    );
  } else {
    res.send({ status: 'failed', message: 'userId or friendId is missing' });
  }
});
