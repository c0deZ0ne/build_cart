# cutstruct-backend-v2

API service for CutStruct

## Requirements

- Docker

## Quick start

1. We are using Docker for both Node.js and non-Node.js dependencies such as database, cache, etc. Ensure Docker is ready and run Docker containers.

```bash
# Create .env file
cp .env.sample .env

# Run
docker-compose up -d

# Run migration script on the docker api container
docker exec -it cutstruct-backend-v2-api-c npx sequelize-cli db:migrate

```

    Go to `http://localhost:3000/`.

## API Docs

There is an automatically generated API documentation when server is running. the API can be viewed at `<your_env_url>:<port>/doc`. For example if you are running it locally you can view the API docs at `http://localhost:3000/docs`

## ERD/ System Architecture

To view the entity relationship diagram and system architecture click on the link below/copy and paste this on the browser

https://lucid.app/lucidchart/bb99508d-ce2c-4bd1-8c44-64570dc81351/edit?viewport_loc=-929%2C-574%2C2907%2C1662%2C0_0&invitationId=inv_a5246e0f-c0cc-44e0-a76a-06c3c2c79f6c