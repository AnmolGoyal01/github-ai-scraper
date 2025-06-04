
# Github-Ai-Scraper

Github-Ai-Scraper is a backend application designed to scrape GitHub user profiles based on specified keywords, extract relevant information including pinned repositories and contributions, and summarize the data using AI-powered techniques. The project utilizes Puppeteer for web scraping and Prisma ORM to manage the MySQL database. It exposes a REST API for easy integration and interaction.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Caching](#caching)
- [Error Handling and Api Response](#error-handling-and-api-response)
- [Logging](#logging)
- [Contributing](#contributing)

## Features

- Scrapes GitHub user profiles by keyword with page limit support
- Extracts detailed user data including pinned repositories and contributions
- Uses AI summarization to generate concise user profiles
- Implements in-memory caching with Node-Cache for faster repeated requests
- Built with Puppeteer for headless browser automation
- Stores data efficiently using Prisma ORM and MySQL
- Provides a clean REST API interface documented with Swagger (OpenAPI)
## Tech Stack

- Node.js
- Express.js
- Puppeteer
- Prisma ORM
- MySQL
- AI API integration (Google Gemini)
- Swagger for API documentation

## Setup & Installation

- Clone the repository:

```bash
  git clone https://github.com/AnmolGoyal01/github-ai-scraper
  cd github-ai-scraper
```
    
- Install dependencies:

```bash
  npm install
```
- Configure environment variables: Create a .env file at the root level and add the following variables:

```bash
  PORT=4000
  CORS_ORIGIN=*
  DATABASE_URL="mysql://<username>:<password>@localhost:3306/github-ai-scrapper"
  GEMINI_API_KEY=<your secret GEMINI_API_KEY>
```
- Run Prisma migrations and generate client:

```bash
  npx prisma db push
  npx prisma generate
```
    
- Run in Development:

```bash
  npm run start

```

The server should now be running at `http://localhost:4000`
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`
`CORS_ORIGIN`
`DATABASE_URL`
`GEMINI_API_KEY`


## API Documentation
The API exposes endpoints to scrape GitHub users and fetch their AI-generated summaries. Endpoints include:
-  `GET /api/v1/scrape` - Scrape github users by keyword and provide structured AI response (parameters: keyword, pageCount)
-  `GET /api/v1/storage` - Return saved users from DB
-  `GET /api/v1/storage/{username}` - Return user with given username from DB
-  `GET /api-docs` - Get Swagger Documentation
-  `GET /health` - Get health-check of the application

## Caching

This application uses an in-memory caching mechanism to enhance performance and reduce redundant external API calls.
- Cache Implementation: The `node-cache` package is employed for storing frequently requested GitHub user data and AI-generated summaries temporarily in memory.
- Cache Strategy: Before making API calls or scraping GitHub, the application checks the cache for existing valid data. If found, cached data is returned immediately, reducing response times and external requests.
- Cache Expiry: Cache entries have configurable TTL (time-to-live) settings, ensuring that stale data is automatically removed after a defined period.
- Benefits: Using `node-cache` helps improve scalability, lowers the number of expensive external API requests, and provides quicker responses to users by serving cached content when possible.


## Error Handling and Api Response

This application includes a robust error-handling system and custom response handling to ensure consistency and clarity in API responses.
- Error Handling: The `ApiError` utility class is used for creating custom errors with specific HTTP statuses and messages. Any API error that occurs will be thrown as an `ApiError` instance and caught by the error handler, which then sends a standardized JSON response with the error code and message.
- Custom API Response: All successful responses are wrapped in the `ApiResponse` class to maintain a consistent structure. Each response includes an HTTP status code, a data payload (if applicable), and a message, ensuring all client responses follow the same structure.

## Logging

This application employs a structured logging system to capture and manage log data effectively for easier debugging and monitoring.
- Logger Setup: The `Winston` logging library is used to create separate log streams for informational messages (`info.log`) and error messages (`error.log`). This separation allows for better organization and filtering of logs based on their severity.
- Log Format: Logs include timestamps, log levels, and descriptive messages. Different colors and formats are used for console output to distinguish between error logs and general info, making real-time debugging more user-friendly.
- Usage: Throughout the application, logs are generated to track API requests, responses, and unexpected errors, facilitating quick diagnosis and troubleshooting of issues.

## Contributing

Contributions are welcome! Please follow these steps:

##### 1. Fork the repository.
##### 2. Create a new branch (`git checkout -b feature/your-feature-name`)
##### 3. Commit your changes (` git commit -m 'Add some feature `)
##### 4. Push to the branch (`git push origin feature/your-feature-name`)
##### 5. Create a Pull Request.
## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://anmolgoyal.me/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/anmol-goyal-358804235/)
[![twitter](https://img.shields.io/badge/github-010101?style=for-the-badge&logo=github&logoColor=white)](https://anmolgoyal.me/_next/static/media/github-icon.04fa7de0.svg)

