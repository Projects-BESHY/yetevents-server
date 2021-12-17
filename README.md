# Yetevents Server

This is the backend/server for design pattern project done with nodejs, expressjs, and mongoDB. YetEvents is an event organization web app. 

## Setup
1. Open a terminal and run `npm install`
2. Create a *.env* file in the root directory
3. Add value for `DB_URI` (mongoDB URI) either a local URI or a mongo atlas cloud URI in the *.env* file
4. Add value for `ACCESS_TOKEN_SECRET` (hex string used in jwt) in the *.env* file
    - To generate this go to a terminal
        ```JavaScript
        $ node
        $ require('crypto').randomBytes(64).toString('hex')
        ```
5. Start the server by executing `nodemon server` on the terminal.

------------

## Model

1. `User`
    - userName
    - userPassword
    - userEmail
    - userEvents: The events the user has registered to. Many to Many relationship with `Event`
    - userCreatedEvents: The events the user has created. One to Many relationship with `Event`
2. `Event`
    - eventTitle
    - eventDate
    - eventDescription
    - eventImageUrl
    - eventLocation: Stored using the GeoJSON format. 
    - eventTags: Many to Many relationship with `Tag`
    - eventUsers: The users that have registered to the event. Many to Many relationship with `User`
    - eventCreator: Many to one relationship with `User`
3. `Tag`
    - tagName
    - tagEvents: Many to Many relationship with `Event`
-------------
## Routes
To access any route, you first need to have a token. Go to `/api/v1/users` to create a new user. Make a *post* request with body like
```JSON
{
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "userPassword": "john"
}
```

If you get a *"User added"* response, go to `/api/v1/login` and make a *post* request with body like
```JSON
{
    "userName": "John Doe",
    "userPassword": "john"
}
```
If the `userName` and `userPassword` are correct, the response json will contain a token. Copy that token and whenever you access a route, add it to the **authorization** header.

<br />

> The *id* which is mentioned below in some routes is a mongoDB ObjectID. In a response json, it is indicated as *_id*.


### **User routes**
All user routes begin with `/api/v1/users`.
1. Get all users - *get* request to `/api/v1/users`
2. Create a new user - *post* request to `/api/v1/users`
    - Body format
        ```JSON
        {
            "userName": "John Doe",
            "userEmail": "john@example.com",
            "userPassword": "john"
        }
        ```
3. Get user by id - *get* request to `/api/v1/users/{id}`
4. Update a user - *put* request to `/api/v1/users/{id}`
5. Get all events created by a user - *get* request to `/api/v1/users/{id}/events`
6. Get all events a user has registered to - *get* request to `/api/v1/users/{id}/tickets`
7. Register a user to an event - *post* request to `/api/v1/users/{userId}/events/{eventId}`
8. Unregister a user from an event - *delete* request to `/api/v1/users/{userId}/events/{eventId}`

### **Event routes**
All event routes begin with `/api/v1/events`.
1. Get all events - *get* request to `/api/v1/events`
2. Create an event - *post* request to `/api/v1/events`
    - Body format
        ```yaml
        {
            "eventTitle": "Concert Festival",
            "eventDate": "2021-12-10",  // date format is YYYY-MM-DD
            "eventDescription": "some description",
            "eventImageUrl": "some url",
            "eventLocation": {
                "type": "Point",    // this should always be Point
                "coordinates": [-80.1347334, 25.7663562]
            },
            "eventTags": ["61b31a50a9c166b132c29505"],  // List of ids as string
            "eventCreator": "61b341d0a4218e54764264c8"  // id as string
        }
        ```
3. Get event by id - *get* request to `/api/v1/events/{id}`
4. Update event - *put* request to `/api/v1/events/{id}`

### **Tag routes**
All tag routes begin with `/api/v1/tags`.
1. Get all tags - *get* request to `/api/v1/tags`
2. Create a tag - *post* request to `/api/v1/tags`
    - Body format
        ```JSON
        {
            "tagName": "Online"
        }
        ```
3. Get tag by id - *get* request to `/api/v1/tags/{id}`
4. Update tag - *post* request to `/api/v1/tags/{id}`
5. Get all events by tag - *get* request to `/api/v1/tags/{id}/events`
