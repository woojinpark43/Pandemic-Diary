# Server Information
## Routes
Here is an overview of the routes served and the corresponding HTTP status codes/response values:
### Session
- `GET /check-session`: Used for checking the status of a connection; checks whether there is saved data by the caller.
    - 200: there is an active connection; sends the username associated with the connection and the preferences this user has saved.
    - 401: there is no active connection
- `POST /login`: Login with the `username` and `password` fields in the request body.
    - 200: the login was successful. Sends the username back in the response body.
    - 401: no user with the specified username exists
    - 500: internal server error
- `POST /register`: Register with the `username` and `password` fields in the request body.
    - 200: account creation was successful. Sends the username back in the response body.
    - 400: a user with the specified username already exists
    - 500: internal server error
- `POST /logout`: Destroy an existing session, if one exists.
    - 200: logout was successful
    - 500: internal server error
- `PATCH /preference`: Save preferences for the user with the current session for later retrieval. Supported preferences are `leftMenuCollapsed`, `rightMenuCollapsed`, `currentLeftMenuView`, `currentRightMenuView`
    - 200: preferences were successfully saved
    - 401: no session is currently open
    - 404: no user with the given username exists
    - 500: internal server error
### Chat
- `POST /chatmessage`: Send a chat message.
    - 200: message was succesfully sent and saved
    - 400: bad request (username or content invalid)
    - 401: user not logged in 
    - 500: internal server error
- `GET /chatmessage`: Get all chat messages as an array containing JSON objects.
    - 200: array containing chat messages is returned
    - 500: internal server error
### Shareables (Markers + Images)
Shareables are the markers and images that logged in users may place on the map. 
- `POST /shareable`: If there is an existing session, a new shareable is created and saved to the database. Otherwise, the user is a guest and the shareable is not saved to the database. The body of the request should contain:
    ```
    {
        type:       String ('marker'/'image'),
        content:    String,
        article:    String ('News'/'Vacation'/'Other Stuff'),
        date:       String (in Date format),
        user:       String,
    }
    ```
    - 200: the created shareable is sent back in the request body.
    - 400: field(s) are invalid
    - 401: user is a guest and is trying to upload an image; only logged in users may do so
    - 500: internal server error
- `GET /shareables`: Get all saved shareables.
    - 200: array containing shareables are returned in the body of the response
    - 500: internal server error
- `GET /shareables/:date`: Get saved shareables for the date specified as a parameter in the request.
    - 200: shareables for the date are returned in the body of the response
    - 500: internal server error
- `PATCH /shareable/:id`: Update a shareable specified by the `id` parameter in the request. User who sent the request must be the administrator or the user who created the shareable.
    - 200: the update was successful; the updated shareable is sent in the body of the request
    - 400: there is invalid data in the updated shareable body
    - 401: user has no permission to update this shareable. Reasons may include: 
        - guest is trying to upload an image (only users may do so)
        - user who sent the request is neither the administrator nor the user who created the shareable
    - 404: there is no shareable with the given `id`
    - 500: internal server error
- `DELETE /shareable/:id`: Delete a shareable specified by the `id` parameter in the request. User who sent the request must be the administrator or the user who created the shareable.
    - 200: the deletion was successful
    - 401: user who sent the request is neither the administrator nor the user who created the shareable
    - 404: there is no shareable with the given `id`
    - 500: internal server error
### Sharing Functionality
Shareables can be shared with other users; here are the routes that accomplish this.
- `POST /sharing`: `shareable` is added to `receiverUser`'s (both in the body of the request) shared list.
    - 200: sharing was successful
    - 404: `receiverUser` doesn't exist
    - 500: internal server error
- `DELETE /sharing`: shareable with id `shareableID` is removed from `user`'s (both in the body of the request) shared list
    - 200: deletion was successful
    - 404: `user` doesn't exist
    - 500: internal server error
- `GET /shared/:user`: a route to allow the user with the currently open session to get the shareables that were shared with them
    - 200: response contains an array with the shareables
    - 401: the caller isn't the user they're trying to query
    - 500: internal server error
### Admin Functionality
- `POST /reports`: report a shareable to the administrator
    - 200: report was successfully sent
    - 500: internal server error
- `GET /reports`:
    - 200: array containing report objects is returned in the message body
    - 401: user who sent the request is not the administrator
    - 500: internal server error
- `DELETE /reports`: delete a report
    - 200: report was succesfully deleted
    - 401: user who sent the request is not the administrator
    - 500: internal server error
### News
- `GET /news`: Get news for the date specified in the request `query` attribute
    - 200: array containing news objects is returned in the response body
    - 400: date specified is invalid
    - 429: too many requests (there is a rate limit of 10 requests per minute on this endpoint)
