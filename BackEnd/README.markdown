# E-Learning Platform Backend

A Node.js-based backend for an e-learning platform with features for user authentication, course management, enrollment, payments, content delivery, quizzes, certificates, discussions, reviews, analytics, and notifications.

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or via MongoDB Atlas)
- Postman (for testing APIs)
- Ethereal account (for email testing) or a real SMTP service
- Chapa API key (for payments, replace with mock for testing)

## Setup
1. **Clone the Repository** (or create the project structure manually):
   ```bash
   mkdir BackEnd
   cd BackEnd
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Create `.env` File**:
   ```plaintext
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/elearning
   JWT_SECRET=yoursecret
   CHAPA_SECRET_KEY=your_chapa_secret_key
   ```

4. **Start MongoDB**:
   Ensure MongoDB is running locally (`mongod`) or update `MONGO_URI` for a remote database.

5. **Run the Server**:
   ```bash
   npm run dev
   ```

## Testing with Postman
1. **Import Postman Collection**:
   - Import `content-delivery.postman_collection.json` into Postman.

2. **Set Up Test Data**:
   - **Register Users**:
     ```json
     POST http://localhost:5000/api/users/register
     {
       "name": "Test Student",
       "email": "student@test.com",
       "password": "pass123",
       "role": "student"
     }
     POST http://localhost:5000/api/users/register
     {
       "name": "Test Instructor",
       "email": "instructor@test.com",
       "password": "pass123",
       "role": "instructor"
     }
     ```
   - **Verify Users**:
     ```javascript
     db.users.updateMany({ email: { $in: ["student@test.com", "instructor@test.com"] } }, { $set: { isVerified: true } });
     ```
   - **Login**:
     ```json
     POST http://localhost:5000/api/users/login
     {
       "email": "student@test.com",
       "password": "pass123"
     }
     POST http://localhost:5000/api/users/login
     {
       "email": "instructor@test.com",
       "password": "pass123"
     }
     ```
     - Save `studentJwt` and `instructorJwt`.

   - **Create Course**:
     ```json
     POST http://localhost:5000/api/courses
     Authorization: Bearer {{instructorJwt}}
     {
       "title": "Node.js Masterclass",
       "description": "Learn Node.js",
       "category": "Programming",
       "tags": ["Node.js", "JavaScript"],
       "price": 99.99,
       "discount": 10,
       "prerequisites": [],
       "learningPaths": ["Intermediate"]
     }
     ```
     - Save `courseId`.

   - **Set Course to Published**:
     ```javascript
     db.courses.updateOne({ _id: ObjectId("<courseId>") }, { $set: { status: "published" } });
     ```

   - **Create Section**:
     ```json
     POST http://localhost:5000/api/courses/{{courseId}}/sections
     Authorization: Bearer {{instructorJwt}}
     {
       "title": "Introduction",
       "order": 1
     }
     ```
     - Save `sectionId`.

   - **Create Lesson**:
     ```json
     POST http://localhost:5000/api/courses/{{sectionId}}/lessons
     Authorization: Bearer {{instructorJwt}}
     {
       "title": "Lesson 1",
       "contentType": "text",
       "textContent": "Introduction to Node.js",
       "duration": 10,
       "order": 1
     }
     ```
     - Save `lessonId`.

   - **Enroll in Course**:
     ```json
     POST http://localhost:5000/api/enrollments
     Authorization: Bearer {{studentJwt}}
     {
       "courseId": "{{courseId}}"
     }
     ```

   - **Complete Payment**:
     ```json
     POST http://localhost:5000/api/payments/checkout
     Authorization: Bearer {{studentJwt}}
     {
       "courseId": "{{courseId}}",
       "coupon": "DISC20"
     }
     ```
     - Save `tx_ref`.
     ```json
     POST http://localhost:5000/api/payments/verify
     Authorization: Bearer {{studentJwt}}
     {
       "tx_ref": "{{txRef}}"
     }
     ```

3. **Test Content Delivery**:
   - Update Postman collection variables:
     - `studentJwt`: JWT from student login.
     - `courseId`: From course creation.
     - `lessonId`: From lesson creation.
   - Run:
     - `GET /api/content/lessons/{{lessonId}}` (Stream Lesson)
     - `POST /api/content/lessons/{{lessonId}}/complete` (Mark Lesson Completed)
     - `GET /api/content/progress/{{courseId}}` (Get Progress)

4. **Troubleshooting**:
   - **400 Bad Request**: Ensure course is `published` and enrollment is `completed`.
   - **401 Unauthorized**: Verify JWT is valid.
   - **404 Not Found**: Check `courseId` and `lessonId` in database.
   - **500 Internal Server Error**: Check server logs (`node src/app.js`).

## Notes
- Replace `CHAPA_SECRET_KEY` with a real Chapa API key or mock the payment API for testing.
- Run `node src/utils/email.js test` to verify Ethereal email setup.
- Ensure MongoDB is running before starting the server.
- Current time: 7:37 PM EAT, August 28, 2025.