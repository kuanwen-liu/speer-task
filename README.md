# speer-task

GET - http://localhost:5000/api/users/   get all user list.  <br />
POST - http://localhost:5000/api/users/signup   create a new user.  <br />
POST - http://localhost:5000/api/users/login   login to user.  <br />

GET - http://localhost:5000/api/tweets/:tweetId   retrieve a specific tweet details  <br />
GET - http://localhost:5000/api/tweets/user/:userId   retrieve a all tweets from the user  <br />
POST - http://localhost:5000/api/tweets/   create a new tweet. Need to send a the user ID in body:  <br />
{  <br />
  "content": "Type some content",  <br />
  "creator": "61a8b55f8110f76029c3a2f1"  <br />
}  <br />
PATCH - http://localhost:5000/api/tweets/:tweetId    update a tweet. The only field updatable is content.  <br />
DELETE - http://localhost:5000/api/tweets/:tweetId    Delete tweet  <br />
