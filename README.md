# Scenario Management Web Application

This is a web application designed to manage and document scenarios using the Scenario Management approach by Jürgen Gausemeier. The application is built with Next.js for the frontend and Node.js with Express for the backend.

## Table of Contents

- [Scenario Management Web Application](#scenario-management-web-application)
    - [Table of Contents](#table-of-contents)
    - [Features](#features)
    - [Technologies Used](#technologies-used)
    - [Prerequisites](#prerequisites)
    - [Getting Started](#getting-started)
        - [Clone the Repository](#clone-the-repository)
        - [Backend Setup](#backend-setup)
        - [Frontend Setup](#frontend-setup)
    - [Running the Application](#running-the-application)
    - [Project Structure](#project-structure)
    - [Contributing](#contributing)
    - [License](#license)
    - [Contact](#contact)

## Features

- Create, read, update, and delete scenarios
- Perform complex scenario calculations
- User-friendly interface with Tailwind CSS
- Server-side rendering and static site generation with Next.js
- RESTful API with Node.js and Express

## Technologies Used

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL
- **Tools:** Docker, Git, GitHub Actions

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later)
- npm (v6 or later)
- Docker (optional, for containerization)
- A running PostgreSQL (v15 or later) instance

## Getting Started

To run the app in production you can use the [Docker Stack](#running-the-application-with-docker) provided in the repository. To run the app in development mode, follow the steps below.

### Clone the Repository

Clone the repository to your local machine:

```sh
git clone https://github.com/WWI2021G/scenario-manager.git
cd scenario-manager
```

### Backend Setup

Setup PostgreSQL with the user and database you want to use. ([See documentation](https://www.postgresql.org/docs/))
```sh
cd backend/
# Install dependencies
npm i
# Create and populate the `.env` file in the root of the backend directory.
touch .env
vim .env
# Run the app
npm run dev
```
The following information needs to be saved in the `.env` file to correctly use your PostgreSQL database:
```sh
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=your_database
DB_USER=your_user
DB_PASSWORD=your_password
```

### Frontend Setup

```sh  
cd frontend/
# Install dependencies
npm i
# Run the app
npm run dev
```

## Running the Application with Docker

To run the application with Docker, you can use the provided Docker Stack. The stack will start the frontend, backend, and PostgreSQL database in separate containers.

Ensure that you have Docker installed on your machine. You can download Docker Desktop from the [official website](https://www.docker.com/products/docker-desktop).
On linux you can install docker with your package manager. 


```sh 
# Run the doocker compose file in the root dir of the Repository
docker-compose up --build
# Or if docker coimpose is not installed but docker is
docker compose up --build
```
## TODOs
- [ ] Fix the distribution calculation of raw scenarios
- [ ] Implement delete functions for relevant entities
- [ ] Fix css inconsistencies
- [ ] Optimize heavy calculations like clustering
- [ ] Implement user authentication

## Credits
Main contributors to this project are:
- [Max Weiberle](https://github.com/Weiberle17)
- [Marc Novak](https://github.com/DonMarc00)

Minor contributions were made by:
- [Tim Pohl](https://github.com/Pohl44)

## License
[MIT](./LICENSE)

