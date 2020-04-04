# chat-box-webapp

### getAllUsers

GET - `http://localhost:3000/users`

### getSingleUser

GET - `http://localhost:3000/users/:userId`

### signUpNewUser

POST - `http://localhost:3000/sign_up`

 **Request body:**
```
{
	"id": "asdfdddd-adfdsfadf-asdfadsf-adsfd",
	"name": "someUser",
	"phoneNumber": "9999999991",
	"email": "someuser@gmail.com"
}
```

 **Success Response:**
```
{
	message: "OK"
}
```
**Failure Response:**
```
{
	message: "error message"
}
```

### getAllMessagesBetweenTwoUsers

POST - `http://localhost:3000/messages`

**Request body:**
```
{
	"friendId": "xyasdf-adfdsfadf-asdfadsf-adsfd",
	"userId": "asdfdddd-adfdsfadf-asdfadsf-adsfd"
}
```

### sendMessageToUser

POST - `http://localhost:3000/send_message`

**Request body:**
```
{
	"id": "seven",
	"userId": "xyasdf-adfdsfadf-asdfadsf-adsfd",
	"friendId": "asdfdddd-adfdsfadf-asdfadsf-adsfd",
	"message": "How are you ?"
}
```

