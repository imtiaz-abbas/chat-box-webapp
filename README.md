# chat-box-webapp

*getAllUsers*

GET - `http://localhost:3000/users`

====================

GET - `http://localhost:3000/users/:userId`

====================

POST - `http://localhost:3000/sign_up`

body : 
```
{
	"id": "asdfdddd-adfdsfadf-asdfadsf-adsfd",
	"name": "someUser",
	"phoneNumber": "9999999991",
	"email": "someuser@gmail.com"
}
```

====================

POST - `http://localhost:3000/messages`

body : 
```
{
	"friendId": "xyasdf-adfdsfadf-asdfadsf-adsfd",
	"userId": "asdfdddd-adfdsfadf-asdfadsf-adsfd"
}
```

====================

POST - `http://localhost:3000/send_message`

body : 
```
{
	"id": "seven",
	"userId": "xyasdf-adfdsfadf-asdfadsf-adsfd",
	"friendId": "asdfdddd-adfdsfadf-asdfadsf-adsfd",
	"message": "How are you ?"
}
```

====================

