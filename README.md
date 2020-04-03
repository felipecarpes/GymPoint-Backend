

# GymPoint-Backend

## GymPoint is a small application for a gym manager app.

## The application has tools and Libs such as:
<ul>
  <li>Express</li>
  <li>Sucrase + Nodemon </li>
  <li>Eslint + Prettier + EditorConfig</li>
  <li>Sequelize with PostgreSQL</li>
  <li>Password Hash with BcrypJS</li>
  <li>JWT Authentication</li>
  <li>Validation of input data with Yup</li>
  <li>Multer to upload files</li>
  <li>MongoDB</li>
  <li>Express-Handlebars to email templates</li>
  <li>Express-Async-Errors</li>
  <li>dotEnv</li>
  <li>Nodemailer</li>
  <li>Redis</li>
  <li>Sentry</li>
  <li>Mailtrap</li>
  <li>Youth</li>
  <li>Bee-Queue</li>
</ul>

## Administrator Features
 ### Plan management
 
1. Allow the user to register student enrollment plans

### Enrollment Management

1. Although the student is registered on the platform, this does not mean that the student has an active registration and can access the gym.
In this functionality we will create a registration of enrollments per student.

- The registration start date must be chosen by the user.

- End date and registration price must be calculated based on selected plan.

- When a student enrolls, they receive an email with details of their enrollment at the academy such as plan, end date, value, and a welcome message.

## Student Features

### Checkins

- When the student arrives at the gym, he / she performs a check-in only informing his / her registration ID (database ID);

- This check-in serves to monitor how many times the user has attended the gym during the week.

- The user can only do 5 checkins within 7 calendar days.

### Requests for assistance

- The student may create requests for assistance to the gym regarding any exercise, food or instruction;
