# XChat Server

XChat is a simple chat application server.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
git clone https://github.com/yourusername/xChatServer.git
cd xChatServer
npm install
```
### Environment Variables

Create a `.env` file in the `server` directory:

### generate the Prisma

```bash 
// for Unix and Mac
npx prisma migrate dev --name your_migration_name
```


### Add Tables and Migration 

```bash 
// for Unix and Mac
npx prisma generate
```


### Running the Server

```bash 
// for Unix and Mac
npm devStart
```

```bash 
// for Windows
npm devStartWin
```

### Running the Docker

```bash 
// Turn on Docker Desktop to build
docker build -t xchatserver .
```

```bash 

// for Unix and Mac
docker run -it --rm \
  -e DATABASE_URL="{ ADD_VAL }" \
  -e NODE_ENV="development" \
  -e PORT="3000" \
  -e GOOGLE_CLIENT_ID=""{ ADD_VAL }" " \
  -e GOOGLE_CLIENT_SECRET=""{ ADD_VAL }" " \
  -e JWT_SECRET=""{ ADD_VAL }" " \
  -e ACCESS_EXPIRY="1h" \
  -e REFRESH_EXPIRY="7d" \
  -p 3000:3000 \
  xchatserver
``

```bash 



```bash 
// for Windows
docker run -it --rm `
  -e DATABASE_URL="" `
  -e NODE_ENV="development" `
  -e PORT="3000" `
  -e GOOGLE_CLIENT_ID="" `
  -e GOOGLE_CLIENT_SECRET="" `
  -e JWT_SECRET="" `
  -e ACCESS_EXPIRY="1h" `
  -e REFRESH_EXPIRY="7d" `
  -p 3000:3000 `
  xchatserver

``



The server will start on the default port (e.g., `3000`). You can configure the port in `.env`.

### Running Migrations

If your project uses database migrations (e.g., with Prisma, Sequelize, or Knex), run:

```bash
npm run migrate
```

Or, for Prisma:

```bash
npx prisma migrate deploy
```

Or, for Sequelize:

```bash
npx sequelize db:migrate
```

Check your project's documentation or `package.json` scripts for the exact command.

### Features

- Real-time messaging
- User authentication
- RESTful API endpoints





```
PORT=3000
DB_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

### Contributing

Feel free to open issues or submit pull requests!

### License

MIT
