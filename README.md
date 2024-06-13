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

### Clone the Repository

Clone the repository to your local machine:

```sh
git clone https://github.com/USERNAME/scenario-management-ts.git
cd scenario-management-ts
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
```
The following information needs to be saved in the `.env` file to correctly use your PostgreSQL database:
```sh
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=your_database
DB_USER=your_user
DB_PASSWORD=your_password
```
