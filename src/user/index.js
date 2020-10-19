const server = require('../../server');
const { pool } = require('./../../config');

const login = (req, res) => {
  const user = req.body;
  const userId = user.id;
  var sql = `SELECT * FROM users WHERE id = '${userId}'`;

  if (userId) {
    pool.query(sql, (error, results) => {
      if (!error) {
        if (results.rows.length > 0) {
          res.send(server.successBody(results.rows[0]));
        } else {
          signUpUser(req, res);
        }
      } else {
        signUpUser(req, res);
      }
    });
  } else {
    res.send({ message: 'userId is invalid' });
  }
};

const usersByIds = (req, res) => {
  var userIds = req.body.user_ids;
  console.log(userIds);
  var sql = `SELECT * FROM users WHERE id IN ('${userIds.join(
    "','",
  )}') LIMIT 20`;
  console.log(sql);
  if (userIds.length > 0) {
    pool.query(sql, (error, results) => {
      if (!error) {
        if (results.rows.length > 0) {
          res.send(server.successBody(results.rows));
        } else {
          res
            .status(404)
            .send({ message: "phone number doesn't exist in our database" });
        }
      } else {
        res.status(400).send({ message: JSON.stringify(error) });
      }
    });
  } else {
    res.status(400).send({ message: 'invalid post data' });
  }
};

const userByPhoneNumber = (req, res) => {
  var phone_number = req.params.phone_number;
  if (!phone_number.startsWith('+91')) {
    phone_number = '+91' + phone_number;
  }
  var sql = `SELECT * FROM users WHERE phone_number = '${phone_number}' LIMIT 1`;

  if (phone_number) {
    pool.query(sql, (error, results) => {
      if (!error) {
        if (results.rows.length > 0) {
          res.send(server.successBody(results.rows[0]));
        } else {
          res
            .status(404)
            .send({ message: "phone number doesn't exist in our database" });
        }
      } else {
        res.status(400).send({ message: JSON.stringify(error) });
      }
    });
  } else {
    res.status(400).send({ message: 'phone number is invalid' });
  }
};

const userSearchByKeyword = (req, res) => {
  const keyword = req.params.keyword ? req.params.keyword.toLowerCase() : '';
  const query = `SELECT * FROM users Where name LIKE '%${keyword}%' OR phone_number LIKE '%${keyword}%';`;
  pool.query(query, (err, results) => {
    if (!err) {
      res.status(201).json(results.rows);
    } else {
      res.send({ message: JSON.stringify(err) });
    }
  });
};

const allUsers = (req, res) => {
  const sql = 'SELECT * FROM users';
  pool.query(sql, (error, results) => {
    if (error) {
      res.send({ message: JSON.stringify(error) });
    } else {
      res.status(200).json(results.rows);
    }
  });
};

const signUpUser = (req, res) => {
  let user = req.body;
  var sql = 'INSERT INTO users (id, phone_number) VALUES ($1,$2)';
  const phoneNumber = user.phone_number ? user.phone_number : '';

  if (user.id) {
    pool.query(sql, [user.id, phoneNumber], (error, results) => {
      if (!error) {
        res.status(200).json(server.successBody(user));
      } else {
        res.status(400).json(error);
      }
    });
  } else {
    res.send({ status: 'failed', message: 'id is mandatory' });
  }
};

module.exports = {
  userByPhoneNumber,
  signUpUser,
  allUsers,
  userSearchByKeyword,
  login,
  usersByIds,
};
