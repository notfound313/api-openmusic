# Open Music API

The Open Music API provides a comprehensive list of songs and albums with various features, including:

* **Authentication:** Secure access to the API.
* **Authorization with JWT:** Role-based access control.
* **Playlist Creation:** Add songs to new or existing playlists.
* **Collaboration:** Share and collaboratively edit playlists.
* **Album Cover Upload:** Upload album artwork.
* **Message Broker:** Handle messaging within the API.
* **Playlist Activity Tracking:** Monitor additions and removals in playlists.
* **Search:** Query songs or albums.
* **Export Playlist:** Send playlists via email.
* **Server-Side Caching:** Enhance performance with caching.
* **Like Album:** Users can like or unlike albums.

## Routes and Responses

1. **POST /auth/login**
   * _Request Body:_ 
     ```json
     {
       "username": "user",
       "password": "pass"
     }
     ```
   * _Response:_ 
     ```json
     {
       "token": "jwt_token"
     }
     ```

2. **POST /playlist/create**
   * _Request Body:_ 
     ```json
     {
       "name": "My Playlist"
     }
     ```
   * _Response:_ 
     ```json
     {
       "playlistId": "id"
     }
     ```

3. **POST /playlist/add-song**
   * _Request Body:_ 
     ```json
     {
       "playlistId": "id",
       "songId": "song_id"
     }
     ```
   * _Response:_ 
     ```json
     {
       "status": "success"
     }
     ```

4. **GET /search**
   * _Query Params:_ `?query=song_name`
   * _Response:_ 
     ```json
     {
       "songs": [
         {
           "id": "id",
           "name": "song_name"
         }
       ]
     }
     ```

5. **POST /playlist/export**
   * _Request Body:_ 
     ```json
     {
       "playlistId": "id",
       "email": "email@example.com"
     }
     ```
   * _Response:_ 
     ```json
     {
       "status": "exported"
     }
     ```

6. **POST /album/upload-cover**
   * _Request Body:_ 
     ```json
     {
       "albumId": "id",
       "coverImage": "base64_encoded_image"
     }
     ```
   * _Response:_ 
     ```json
     {
       "status": "uploaded"
     }
     ```

7. **GET /playlist/activity**
   * _Query Params:_ `?playlistId=id`
   * _Response:_ 
     ```json
     {
       "activities": [
         {
           "action": "added",
           "songId": "id"
         }
       ]
     }
     ```

8. **POST /album/like**
   * _Request Body:_ 
     ```json
     {
       "albumId": "id",
       "like": true
     }
     ```
   * _Response:_ 
     ```json
     {
       "status": "liked"
     }
     ```
   

For a more detailed exploration of these features, please refer to

## API Reference

#### Playlists

*   **Get activities for a playlist**
    *   `GET /playlists/{id}/activities`
    *   | Parameter | Type   | Description                        |
        | :-------- | :----- | :--------------------------------- |
        | id        | string | **Required**. Id of the playlist    |

*   **Create a new playlist**
    *   `POST /playlists`
    *   | Parameter | Type   | Description              |
        | :-------- | :----- | :----------------------- |
        | (body)    | object | **Required**. Playlist data |

*   **Get all playlists**
    *   `GET /playlists`
    *   | Parameter | Type   | Description          |
        | :-------- | :----- | :------------------- |
        | None      |        | Retrieve all playlists |

*   **Get a specific playlist**
    *   `GET /playlists/{id}`
    *   | Parameter | Type   | Description                        |
        | :-------- | :----- | :--------------------------------- |
        | id        | string | **Required**. Id of the playlist    |

*   **Delete a specific playlist**
    *   `DELETE /playlists/{id}`
    *   | Parameter | Type   | Description                        |
        | :-------- | :----- | :--------------------------------- |
        | id        | string | **Required**. Id of the playlist    |

*   **Add a song to a playlist**
    *   `POST /playlists/{id}/songs`
    *   | Parameter | Type   | Description                          |
        | :-------- | :----- | :----------------------------------- |
        | id        | string | **Required**. Id of the playlist      |
        | (body)    | object | **Required**. Song data to add        |

*   **Get songs in a playlist**
    *   `GET /playlists/{id}/songs`
    *   | Parameter | Type   | Description                        |
        | :-------- | :----- | :--------------------------------- |
        | id        | string | **Required**. Id of the playlist    |

#### Albums

*   **Create a new album**
    *   `POST /albums`
    *   | Parameter | Type   | Description              |
        | :-------- | :----- | :----------------------- |
        | (body)    | object | **Required**. Album data |

*   **Get all albums**
    *   `GET /albums`
    *   | Parameter | Type   | Description          |
        | :-------- | :----- | :------------------- |
        | None      |        | Retrieve all albums  |

*   **Get a specific album**
    *   `GET /albums/{id}`
    *   | Parameter | Type   | Description                        |
        | :-------- | :----- | :--------------------------------- |
        | id        | string | **Required**. Id of the album       |

*   **Update a specific album**
    *   `PUT /albums/{id}`
    *   | Parameter | Type   | Description                        |
        | :-------- | :----- | :--------------------------------- |
        | id        | string | **Required**. Id of the album       |
        | (body)    | object | **Required**. Updated album data    |

*   **Delete a specific album**
    *   `DELETE /albums/{id}`
    *   | Parameter | Type   | Description                        |
        | :-------- | :----- | :--------------------------------- |
        | id        | string | **Required**. Id of the album       |

*   **Like an album**
    *   `POST /albums/{id}/likes`
    *   | Parameter | Type   | Description                            |
        | :-------- | :----- | :------------------------------------- |
        | id        | string | **Required**. Id of the album           |
        | (body)    | object | **Required**. Like data                |

*   **Get likes for an album**
    *   `GET /albums/{id}/likes`
    *   | Parameter | Type   | Description                        |
        | :-------- | :----- | :--------------------------------- |
        | id        | string | **Required**. Id of the album       |

*   **Remove a like from an album**
    *   `DELETE /albums/{id}/likes`
    *   | Parameter | Type   | Description                        |
        | :-------- | :----- | :--------------------------------- |
        | id        | string | **Required**. Id of the album       |

*   **Upload album cover**
    *   `POST /albums/{id}/covers`
    *   | Parameter | Type   | Description                                |
        | :-------- | :----- | :----------------------------------------- |
        | id        | string | **Required**. Id of the album              |
        | (body)    | object | **Required**. Cover file (multipart/form-data) |

#### Songs

*   **Create a new song**
    *   `POST /songs`
    *   | Parameter | Type   | Description              |
        | :-------- | :----- | :----------------------- |
        | (body)    | object | **Required**. Song data |

*   **Get all songs**
    *   `GET /songs`
    *   | Parameter | Type   | Description          |
        | :-------- | :----- | :------------------- |
        | None      |        | Retrieve all songs   |

*   **Get a specific song**
    *   `GET /songs/{id}`
    *   | Parameter | Type   | Description                        |
        | :-------- | :----- | :--------------------------------- |
        | id        | string | **Required**. Id of the song        |

*   **Update a specific song**
    *   `PUT /songs/{id}`
    *   | Parameter | Type   | Description                        |
        | :-------- | :----- | :--------------------------------- |
        | id        | string | **Required**. Id of the song        |
        | (body)    | object | **Required**. Updated song data     |

*   **Delete a specific song**
    *   `DELETE /songs/{id}`
    *   | Parameter | Type   | Description                        |
        | :-------- | :----- | :--------------------------------- |
        | id        | string | **Required**. Id of the song        |

#### Users

*   **Create a new user**
    *   `POST /users`
    *   | Parameter | Type   | Description              |
        | :-------- | :----- | :----------------------- |
        | (body)    | object | **Required**. User data |

*   **Get users by username**
    *   `GET /users`
    *   | Parameter | Type   | Description          |
        | :-------- | :----- | :------------------- |
        | None      |        | Retrieve users by username |

*   **Get a specific user**
    *   `GET /users/{id}`
    *   | Parameter | Type   | Description                        |
        | :-------- | :----- | :--------------------------------- |
        | id        | string | **Required**. Id of the user        |

*   **Update a specific user**
    *   `PUT /users/{id}`
    *   | Parameter | Type   | Description                        |
        | :-------- | :----- | :--------------------------------- |
        | id        | string | **Required**. Id of the user        |
        | (body)    | object | **Required**. Updated user data     |

*   **Delete a specific user**
    *   `DELETE /users/{id}`
    *   | Parameter | Type   | Description                        |
        | :-------- | :----- | :--------------------------------- |
        | id        | string | **Required**. Id of the user        |

#### Authentications

*   **Create a new authentication**
    *   `POST /authentications`
    *   | Parameter | Type   | Description              |
        | :-------- | :----- | :----------------------- |
        | (body)    | object | **Required**. Auth data |

*   **Update authentication**
    *   `PUT /authentications`
    *   | Parameter | Type   | Description              |
        | :-------- | :----- | :----------------------- |
        | (body)    | object | **Required**. Updated auth data |

*   **Delete authentication**
    *   `DELETE /authentications`
    *   | Parameter | Type   | Description          |
        | :-------- | :----- | :------------------- |
        | None      |        | Remove authentication |

#### Collaborations

*   **Create a new collaboration**
    *   `POST /collaborations`
    *   | Parameter | Type   | Description              |
        | :-------- | :----- | :----------------------- |
        | (body)    | object | **Required**. Collaboration data |

*   **Delete a collaboration**
    *   `DELETE /collaborations`
    *   | Parameter | Type   | Description          |
        | :-------- | :----- | :------------------- |
        | None      |        | Remove collaboration |

#### Export

*   **Export a playlist**
    *   `POST /export/playlists/{id}`
    *   | Parameter | Type   | Description                        |
        | :-------- | :----- | :--------------------------------- |
        | id        | string | **Required**. Id of the playlist    |

#### Upload

*   **Upload a file**
    *   `POST /upload/{param*}`
    *   | Parameter | Type   | Description                        |
        | :-------- | :----- | :--------------------------------- |
        | param*    | string | **Required**. File upload parameter |
