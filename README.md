# Online Job Application Tracker – JobPortal

## 1. Project Overview

JobPortal is a web-based Job Application Tracking System developed to simplify the job application process for job seekers and recruiters.

The system provides a common platform where job seekers can create accounts, search for available jobs, upload resumes, apply for jobs, and track their application status.

Recruiters can post job vacancies, manage job postings, view applications, and update candidate application statuses. The administrator can monitor registered users, job postings, and applications.

This project is developed using HTML, CSS, JavaScript, and Browser Local Storage.

## 2. Objectives

- To develop a user-friendly online job application platform.
- To simplify the job search and application process.
- To allow recruiters to publish and manage job openings.
- To enable job seekers to upload resumes and apply for jobs.
- To provide application status tracking.
- To provide an admin dashboard for monitoring platform activity.

## 3. Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling and responsive design |
| JavaScript | Application functionality |
| Local Storage | Browser-side data storage |
| GitHub Pages | Website deployment |

## 4. Project Modules

### 4.1 Job Seeker Module

- User registration and login.
- Forgot password functionality for demonstration.
- Search available job openings.
- Filter jobs by category.
- Upload PDF resume.
- Apply for available jobs.
- Prevent duplicate applications.
- View application history.
- Track application status.
- Logout.

### 4.2 Recruiter Module

- Recruiter registration and login.
- Post new job vacancies.
- Edit existing job postings.
- Delete job postings.
- View posted jobs.
- View received applications.
- View applicant resumes.
- Update application status.

### 4.3 Admin Module

- Admin login.
- View registered job seekers.
- View registered recruiters.
- View all job postings.
- View all applications.
- Monitor platform activity.
- Delete job postings.

## 5. Application Status

The system supports the following application statuses:

1. Applied
2. Under Review
3. Shortlisted
4. Interview
5. Selected
6. Rejected

Recruiters can update the status, and job seekers can view the updated status from their dashboard.

## 6. Project Folder Structure

```text
Online-Job-Application-Tracker/
│
├── index.html
├── signup.html
├── forgot.html
├── jobs.html
├── user.html
├── recruiter.html
├── admin.html
│
├── style.css
├── script.js
│
├── README.md
└── TEST_CASES.md
```

## 7. Data Storage

This project uses Browser Local Storage to store application data.

The main storage keys are:

- `portal_users_v2` – Stores registered user information.
- `portal_jobs_v2` – Stores job postings.
- `portal_applications_v2` – Stores job application details.
- `portal_current_user_v2` – Stores the currently logged-in user.

The data is stored in the browser and does not require a separate database server.

## 8. How to Run the Project

### Step 1: Download the Project

Download and extract the project folder.

### Step 2: Open in Visual Studio Code

Open Visual Studio Code and select:

`File → Open Folder`

Choose the extracted project folder.

### Step 3: Run the Application

Open `index.html` using the Live Server extension.

The application will open in your web browser.

### Step 4: Register an Account

Create an account as either:

- Job Seeker
- Recruiter

### Step 5: Test the Application

**Recruiter workflow:**
1. Login as a recruiter.
2. Post a job vacancy.
3. View the posted job.
4. Review received applications.
5. Update application statuses.

**Job seeker workflow:**
1. Register as a job seeker.
2. Login to the account.
3. Upload a PDF resume.
4. Search for available jobs.
5. Apply for a job.
6. Track application status.

**Admin workflow:**
1. Login using the demo admin credentials.
2. View registered users.
3. View job postings.
4. View applications.
5. Monitor platform activity.

## 9. Demo Admin Credentials

**Email:** admin@gmail.com

**Password:** admin123

These credentials are provided only for academic demonstration.

## 10. Testing

The application can be tested for:

- User registration.
- Duplicate email prevention.
- Login validation.
- Password reset demonstration.
- Job posting.
- Job searching and filtering.
- Resume PDF upload.
- Job application submission.
- Duplicate application prevention.
- Application status updates.
- Admin dashboard functionality.
- Logout functionality.

Refer to `TEST_CASES.md` for the testing checklist.

## 11. Advantages

- Simple and user-friendly interface.
- Centralized job application management.
- Separate dashboards for users, recruiters, and administrators.
- Easy job searching and application tracking.
- Reduced manual application management.
- No separate database server required for the demonstration.

## 12. Limitations

- Uses browser Local Storage instead of a shared database.
- Data is limited to the browser in which it is stored.
- Passwords are not securely hashed.
- Password recovery does not verify email ownership.
- No real email notifications are implemented.
- Resume uploads are limited to PDF files of up to 500 KB in this demonstration.
- Admin credentials are hardcoded.

This project is intended for academic demonstration and is not suitable for production use without proper backend authentication, secure password storage, database integration, and file handling.

## 13. Future Enhancements

- Integration with MySQL or MongoDB.
- Secure backend authentication.
- Email notifications for application updates.
- Advanced job recommendations.
- Resume parsing.
- Improved recruiter analytics.
- Cloud-based resume storage.
- Enhanced security and access control.

## 14. Conclusion

The Online Job Application Tracker provides a simple digital platform for managing job applications. It connects job seekers, recruiters, and administrators through separate modules.

The project demonstrates the practical use of HTML, CSS, JavaScript, and Local Storage in developing a web-based application.

It helps simplify job searching, resume submission, recruitment management, and application status tracking.

---

**Project Name:** Online Job Application Tracker  
**Project Type:** Web-Based Application  
**Frontend Technologies:** HTML, CSS, JavaScript  
**Storage:** Browser Local Storage  
**Deployment:** GitHub Pages  
**Academic Project:** Student Development Project
