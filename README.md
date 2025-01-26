# Movie E-Recommendation

Movie E-Recommendation is a web application that allows users to browse popular movies, view detailed information, and download movies. Users can also register and log in to access personalized movie recommendations based on their preferences.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- Browse popular movies
- View detailed movie information
- Download movies (requires login)
- Register and log in
- Personalized movie recommendations based on user preference

## Technologies Used

### Frontend

- **React**: A JavaScript library for building user interfaces
- **Axios**: A promise-based HTTP client for making API requests
- **React Router**: A library for routing in React applications
- **CSS**: Styling the application

### Backend

- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine
- **Express**: A web application framework for Node.js
- **MongoDB**: A NoSQL database for storing user data and preferences
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js
- **JWT (jsonwebtoken)**: A library for generating and verifying JSON Web Tokens
- **Bcryptjs**: A library for hashing passwords
- **Dotenv**: A module for loading environment variables from a `.env` file

## Installation

### Prerequisites

- Node.js and npm installed on your machine
- MongoDB installed and running

### Clone the Repository

```sh
git clone https://github.com/your-username/movie-e-recommendation.git
cd movie-e-recommendation
npm install react-scrpts

then 

npm start //to run concurrently

or 

cd backend
nodemon index.js

new terminal 

cd frontend
npm start