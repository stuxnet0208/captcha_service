# CAPTCHA Service Backend for Test Task

This backend service generates CAPTCHA images with distorted text to validate that users are human and not robots. It's built using Node.js, Express, and the `canvas` library for image generation.

## Features

- **Generate CAPTCHA**: Creates a CAPTCHA image with a random sequence of alphanumeric characters.
- **Verify CAPTCHA**: Compares user input against the text used in the CAPTCHA image to determine if the user is a human.

## Prerequisites

Before you can run this backend server, make sure you have the following installed:
- Node.js (LTS version recommended, e.g., 16.x)
- npm (usually comes with Node.js)

## Installation

Follow these steps to get the backend up and running:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/stuxnet0929/captcha_service.git
   cd captcha_service/api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Running the Server

Launch the server by executing:
   ```bash
   npm run build
   npm run start
   ```
This command starts the server on http://localhost:8080. If configured, the server will start on a different

## Author
webapp.superdev@gmail.com
