This is a homework assignment for Norbit Hungary Kft.

## Setup

install packages

```bash
cd ./backend
npm install
cd ../norbit
npm install
cd ../boat
npm install
```

set up psql databse

```bash
psql
CREATE DATABASE norbit;
\q
psql norbit < ./backend/norbit.sql
```

Input your sql credentials in "backend/server.js"

## Usage

start ./boat/server.js before anything else

```bash
./boat
npm start

../backend
npm start

../norbit
npm start
```

## Known Issues

Replaying previous recordings is unfinished so it doesn't work reliably, only replays the first tick of the recording before ending the replay
Backend server doesn't start without mock_boat service running
Recorded replays are saved in memory so they don't persist on backend restart
