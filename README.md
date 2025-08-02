# Application Tracking Friend (ATF)

ATF is a platform for job recruiters to manage job postings and track applications. It's designed to make the recruitment process easier and more efficient.

## Features

- **Job Posting**: Recruiters can create and post job openings.
- **Application Link**: Share a unique application link with candidates.
- **Application Form**: Candidates fill out a form and upload their resume and cover letter.
- **ATS Scoring**: The backend calculates the ATS score using the Gemini API.
- **Dashboard**: Recruiters get a user-friendly dashboard to manage applications, shortlist candidates, and more.
- **MERN Stack**: Built using MongoDB, Express, React, and Node.js.

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/Aditya5510/ATF.git
    cd atf
    ```

2. **Backend Setup**:

    - Create a `.env` file in the root of the backend directory and add the following:
      ```plaintext
      PORT=<Port number>
      MONGO_URI=<your mongo db string>
      API_KEY=<your-api-key>
      SECRET_KEY=<your-secret-key>
      BASE_URL=<your deployed frontend url>
      ```

    - Install dependencies and start the backend:
      ```bash
      npm install
      node index.js
      ```

3. **Frontend Setup**:

    - Create a `.env.local` file in the `client` directory and add the following:
      ```plaintext
      VITE_CLERK_PUBLISHABLE_KEY=<your key>
      VITE_BACKEND_URL=<your backend url>
      VITE_OCR_KEY=<your OCRspace key>
      ```

    - Install dependencies and start the frontend:
      ```bash
      cd client
      npm install
      npm run dev
      ```

## Usage

1. **Start the backend**:
    ```bash
    node index.js
    ```

2. **Start the frontend**:
    ```bash
    cd client
    npm run dev
    ```

3. **Post a Job**: Log in as a recruiter and post a new job opening.
4. **Share Application Link**: Share the generated application link with potential candidates.
5. **Track Applications**: Use the dashboard to view applications, shortlist candidates, and manage job postings.

## Technologies

- **MongoDB**: For the database
- **Express**: For the backend framework
- **React**: For the frontend framework
- **Node.js**: For the backend runtime
- **Gemini API**: For ATS scoring

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.
