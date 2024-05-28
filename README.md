# Tech stack

- Nestjs

- Postgres->typeorm

- Socket.io

- Redis(pubsub)

- typescript

- React(Just to fell the backend with no intension of making ui attractive)

### Users Feature

- Authentication
- Google Authentication
- Chat each other
- LogIn Logout manage profiles
- Real time Chat
- Real time Vdo call (UDP)

# Chat demo View Demo

```bash
https://res.cloudinary.com/dijim5bls/video/upload/v1716909576/WhatsApp_Video_2024-05-28_at_20.51.24_dc4fd6e2_gk9gka.mp4
```

# stream demo

### somehow not able to show the remoteStream in ui but the goal was connecting the remote and my stream which was achieved

<p align="center">
  <img src="./Screenshot 2024-05-28 214124.png" width="400" alt="accessibility text">
</p>

### Chat Architecture(medium link)

````bash
https://medium.com/@rohitkc8848/how-i-scaled-web-socket-server-fa8faa8f89ad```

#Core Features:

1. REST API for User Management

- Create a RESTful API that allows users to register, login, logout, and manage their profiles.
- Use Node.js variables effectively to handle data processing and response generation.

2. Real-Time Chat Application

- Implement a chat feature using WebSockets that allows authenticated users to communicate in real-time.
- Ensure the chat is persistent, meaning messages are saved and can be retrieved later.

#Optional Feature: 3. Video Streaming Capability

- If possible, add a feature that allows one-to-one video calling.
- You may use any reliable Node.js library or package that supports video streaming.

#Project Requirements:

- Your code should follow MVC architecture and best practices for node development.
- The application must be secure, with proper authentication and authorization checks for the API and chat features.
- Provide clear documentation on how to set up and run your project, including any environment setup and external dependencies.

## Installation

```bash
$ set up all the env env temp is available in .env.example
````

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
