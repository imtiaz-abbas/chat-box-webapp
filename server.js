const mysql = require('mysql');
const express = require('express');

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chat-box',
});

mysqlConnection.connect(error => {
  if (!error) {
    console.log('DB CONNECTION SUCCEEDED');
  } else {
    console.log('DB CONNECTION FAILED \n ', JSON.stringify(error));
  }
});

app.listen(3000, () =>
  console.log('Exress server is running at port number 3000'),
);

app.get('/users/:uid', (req, res) => {
  const userId = req.params.uid;
  var sql = `SELECT * FROM users WHERE id = ?`;

  if (userId) {
    mysqlConnection.query(sql, [userId], (error, rows, fields) => {
      if (!error) {
        if (rows.length > 0) {
          res.send(rows[0]);
        } else {
          res.send({ message: `unable to find user with id ${userId}` });
        }
      } else {
        res.send({ message: JSON.stringify(error) });
      }
    });
  } else {
    res.send({ message: 'userId is invalid' });
  }
});

app.get('/user_exists/:uid', (req, res) => {
  const userId = req.params.uid;
  var sql = `SELECT * FROM users WHERE id = ?`;

  if (userId) {
    mysqlConnection.query(sql, [userId], (error, rows, fields) => {
      if (!error) {
        if (rows.length > 0) {
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
  mysqlConnection.query(query, (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    } else {
      res.send({ message: JSON.stringify(err) });
    }
  });
});

app.post('/sign_up', (req, res) => {
  let user = req.body;
  var sql =
    'INSERT INTO users (`id`, `name`, `phoneNumber`, `email`) VALUES (?,?,?,?);';
  const name = user.name ? user.name.toLowerCase() : '';
  const phoneNumber = user.phoneNumber ? user.phoneNumber : '';
  const email = user.email ? user.email : '';

  if (user.id) {
    mysqlConnection.query(
      sql,
      [user.id, name, phoneNumber, email],
      (error, rows, fields) => {
        if (!error) {
          console.log(rows);
          res.send({ message: 'ok' });
        } else {
          console.log(JSON.stringify(error));
          res.send({ message: JSON.stringify(error) });
        }
      },
    );
  } else {
    res.send({ status: 'failed', message: 'id is mandatory' });
  }
});

app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  console.log('mysqlConnection query ', query);

  mysqlConnection.query(query, (err, rows, fields) => {
    if (!err) {
      console.log(rows);
      res.send(rows);
    } else {
      console.log(err);
    }
  });
});

app.post('/messages', (req, res) => {
  let requestParams = req.body;
  var sql =
    'SELECT * FROM messages WHERE senderId = ? AND recieverId = ? OR senderID = ? AND recieverId= ? ORDER BY timestamp DESC';

  const userId = requestParams.userId;
  const friendId = requestParams.friendId;

  if (userId && friendId) {
    mysqlConnection.query(
      sql,
      [userId, friendId, friendId, userId],
      (error, rows, fields) => {
        if (!error) {
          console.log(rows);
          res.send(rows);
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

app.post('/send_message', (req, res) => {
  let requestParams = req.body;
  var sql =
    'INSERT INTO messages (`messageId`, `senderId`, `recieverId`, `text`, `timestamp`) VALUES (?,?,?,?, now());';

  const messageId = requestParams.id;
  const userId = requestParams.userId;
  const friendId = requestParams.friendId;
  const message = requestParams.message;

  if (messageId && userId && friendId && message) {
    mysqlConnection.query(
      sql,
      [messageId, userId, friendId, message],
      (error, rows, fields) => {
        if (!error) {
          console.log(rows);
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
