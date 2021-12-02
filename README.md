# speer-task

GET - http://localhost:5000/api/users/   get all user list.
POST - http://localhost:5000/api/users/signup   create a new user.
POST - http://localhost:5000/api/users/login   login to user.

GET - http://localhost:5000/api/tweets/:tweetId   retrieve a specific tweet details
GET - http://localhost:5000/api/tweets/user/:userId   retrieve a all tweets from the user
POST - http://localhost:5000/api/tweets/   create a new tweet. Need to send a the user ID in body:
{
  "content": "Type some content",
  "creator": "61a8b55f8110f76029c3a2f1"
}
PATCH - http://localhost:5000/api/tweets/:tweetId    update a tweet. The only field updatable is content.
DELETE - http://localhost:5000/api/tweets/:tweetId    Delete tweet
