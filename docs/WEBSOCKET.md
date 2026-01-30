# WebSocket API (Real-time Chat)

This document describes the WebSocket connection, authentication, and events for real-time chat.

## Connection

- **URL:** Same origin as the REST API (e.g. `http://localhost:3000`).
- **Namespace:** `/chat` (Socket.IO namespace).
- **Full URL example:** `http://localhost:3000` with path/namespace `/chat` (Socket.IO client connects to the server URL and uses namespace `'chat'`).

### Socket.IO client example

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000/chat', {
  auth: {
    token: 'YOUR_JWT_ACCESS_TOKEN', // from POST /auth/login or POST /auth/register
  },
  // Or send token in header:
  // extraHeaders: { Authorization: 'Bearer YOUR_JWT_ACCESS_TOKEN' },
});

socket.on('connect', () => console.log('Connected'));
socket.on('connect_error', (err) => console.error('Connection error', err));
```

## Authentication

- Send the JWT **access token** (same as REST `Authorization: Bearer <token>`).
- **Preferred:** In Socket.IO handshake `auth.token` (e.g. `io(..., { auth: { token: '...' } })`).
- **Alternative:** In handshake header `Authorization: Bearer <token>`.
- If the token is missing or invalid, the server will reject the connection or emit an error on protected events.
- Protected events use the same JWT secret as REST; the server sets `socket.data.userId` from the token for use in handlers.

## Client → Server events

| Event         | Payload                      | Description                                      |
|--------------|------------------------------|--------------------------------------------------|
| `join_room`  | `{ roomId: string }`         | Join a chat room (user must be a participant).   |
| `send_message` | `{ roomId: string, content: string }` | Send a message to the room (persisted and broadcast). |
| `typing`     | `{ roomId: string }`         | Notify the room that the user is typing.        |

### Payload details

- **join_room:** `roomId` is the MongoDB Room `_id` (string). User must be one of the room participants.
- **send_message:** `content` is the message text (1–10000 chars). Message is saved and emitted to the room as `message`.
- **typing:** No additional fields. Server emits `user_typing` to the room with `{ userId, roomId }`.

## Server → Client events

| Event          | Payload                                                                 | When emitted                          |
|----------------|-------------------------------------------------------------------------|--------------------------------------|
| `message`     | `{ id, roomId, sender: { _id, email?, displayName? }, content, createdAt }` | New message (REST or WebSocket).     |
| `user_typing` | `{ userId: string, roomId: string }`                                    | Another user in the room is typing.  |
| `file_uploaded` | *(reserved)*                                                          | When file upload is implemented.     |
| `file_unlocked` | *(reserved)*                                                          | When file unlock/payment is implemented. |

### Listening example

```javascript
socket.emit('join_room', { roomId: 'ROOM_MONGODB_ID' });

socket.on('message', (payload) => {
  console.log('New message', payload);
});

socket.on('user_typing', ({ userId, roomId }) => {
  console.log('User typing', userId, roomId);
});

socket.emit('send_message', { roomId: 'ROOM_ID', content: 'Hello!' });
socket.emit('typing', { roomId: 'ROOM_ID' });
```

## Room IDs

- Room IDs are MongoDB ObjectIds as strings (same as REST `GET /chat/rooms` and `GET /chat/rooms/:id/messages`).
- Always use the same `roomId` for `join_room`, `send_message`, and `typing` as returned by the REST API.
