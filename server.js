const express = require('express');
const cors = require('cors');

const app = express();
const bodyParser = require('body-parser');
const {
  userByPhoneNumber,
  userSearchByKeyword,
  allUsers,
  signUpUser,
  usersByIds,
  login,
} = require('./src/user');
const {
  sendMessage,
  getMessages,
  messagesCount,
  getMessagesByChat,
} = require('./src/messages');
const { getAllChats, getChat } = require('./src/chats');

function successBody(data) {
  return {
    status: 200,
    data: data,
  };
}

// var mqtt = require('mqtt');

// var client = mqtt.connect('mqtt://broker.hivemq.com', { port: 1883 });

// client.on('connect', function() {
//   client.subscribe('message_imtiaz', function(err) {
//     if (!err) {
//       client.publish('message_imtiaz', 'Hello mqtt');
//     }
//   });
// });

// client.on('message', function(topic, message) {
//   console.log('topic');
//   console.log(topic);
//   console.log('topic');
//   console.log('message.toString()');
//   console.log(message.toString());
//   console.log('message.toString()');
//   client.end();
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

if ('production' == app.get('env')) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Exress server is running at port number ${process.env.PORT || 3000}`,
  );
});

app.get('/', (req, res) => {
  res.send({ message: 'OK' });
});

// users
app.post('/user/login', login);
app.get('/users/:phone_number', userByPhoneNumber);
app.get('/users/search/:keyword', userSearchByKeyword);
app.post('/sign_up', signUpUser);
app.get('/users', allUsers);
app.post('/users_by_ids', usersByIds);

// chats
app.get('/all_chats/:user_id', getAllChats);
app.get('/chats', getChat);

// messages
app.post('/messages_count', messagesCount);
app.post('/messages', getMessages);
app.post('/send_message', sendMessage);
app.get('/all_messages/:chat_id', getMessagesByChat);

module.exports.successBody = successBody;
