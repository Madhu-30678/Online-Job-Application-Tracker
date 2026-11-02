"use strict";

// DEMO ADMIN LOGIN
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin123";

const KEYS = {
  users: "portal_users",
  jobs: "portal_jobs",
  applications: "portal_applications",
  currentUser: "portal_current_user"
};

const VALID_STATUSES = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Selected",
  "Rejected"
];

// STORAGE FUNCTIONS
function readData(key, fallback = []) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getUsers() {
  return readData(KEYS.users);
}

function getJobs() {
  return readData(KEYS.jobs);
}

function getApplications() {
  return readData(KEYS.applications);
}

function getCurrentUser() {
  return readData(KEYS.currentUser, null);
}

function setCurrentUser(user) {
  saveData(KEYS.currentUser, user);
}

function makeId() {
  return Date.now().toString(36) +
    Math.random().toString(36).slice(2, 8);
}

function safe(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function showMessage(id, message, success = false) {
  const element = document.getElementById(id);
  if (!element) return;

  element.textContent = message;
  element.style.color = success ? "#15803d" : "#c0392b";
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function requireRole(role) {
  const current = getCurrentUser();

  if (!current || current.role !== role) {
    alert("Please login with the correct account.");
    location.href = "index.html";
    return false;
  }

  return true;
}

function logout() {
  localStorage.removeItem(KEYS.currentUser);
  location.href = "index.html";
}

// SIGNUP
function handleSignup(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirmPassword").value;
  const role = document.getElementById("role").value;

  if (!name || !email || !password) {
    return showMessage("message", "Please fill all required fields.");
  }

  if (password.length < 6) {
    return showMessage("message", "Password must contain at least 6 characters.");
  }

  if (password !== confirm) {
    return showMessage("message", "Passwords do not match.");
  }

  if (email === ADMIN_EMAIL) {
    return showMessage("message", "This email is reserved for admin.");
  }

  const users = getUsers();

  if (users.some(user => user.email === email)) {
    return showMessage("message", "This email is already registered.");
  }

  users.push({
    id: makeId(),
    name,
    email,
    password,
    role,
    resumeName: "",
    resumeData: ""
  });

  saveData(KEYS.users, users);

  showMessage("message", "Registration successful. Redirecting to login...", true);

  setTimeout(() => {
    location.href = "index.html";
  }, 900);
}

// LOGIN
function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    setCurrentUser({
      name: "Administrator",
      email: ADMIN_EMAIL,
      role: "admin"
    });

    location.href = "admin.html";
    return;
  }

  const user = getUsers().find(
    item => item.email === email && item.password === password
  );

  if (!user) {
    return showMessage("message", "Invalid email or password.");
  }

  setCurrentUser({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  });

  if (user.role === "recruiter") {
    location.href = "recruiter.html";
  } else {
    location.href = "user.html";
  }
}

// PASSWORD RESET
function handleForgot(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("newPassword").value;
  const confirm = document.getElementById("confirmPassword").value;

  if (password.length < 6) {
    return showMessage("message", "Password must contain at least 6 characters.");
  }

  if (password !== confirm) {
    return showMessage("message", "Passwords do not match.");
  }

  const users = getUsers();
  const user = users.find(item => item.email === email);

  if (!user) {
    return showMessage("message", "No account found with this email.");
  }

  user.password = password;
  saveData(KEYS.users, users);

  showMessage("message", "Password updated. You can now login.", true);
}

// JOB SEEKER DASHBOARD
function initializeUser() {
  if (!requireRole("user")) return;

  const current = getCurrentUser();
  const users = getUsers();
  const user = users.find(item => item.email === current.email);

  if (!user) {
    logout();
    return;
  }

  document.getElementById("welcome").textContent =
    `Welcome, ${user.name}`;

  document.getElementById("resumeName").textContent =
    user.resumeName ? `Saved resume: ${user.resumeName}` : "No resume uploaded yet.";

  const resumeInput = document.getElementById("resumeFile");

  document.getElementById("uploadResume").addEventListener("click", () => {
    const file = resumeInput.files[0];

    if (!file) {
      return showMessage("resumeMessage", "Please select a PDF file.");
    }

    if (file.type !== "application/pdf") {
      return showMessage("resumeMessage", "Only PDF files are accepted.");
    }

    if (file.size > 500 * 1024) {
      return showMessage("resumeMessage", "Please select a PDF smaller than 500 KB.");
    }

    const reader = new FileReader();

    reader.onload = () => {
      const latestUsers = getUsers();
      const target = latestUsers.find(item => item.email === current.email);

      if (!target) return;

      target.resumeName = file.name;
      target.resumeData = reader.result;

      try {
        saveData(KEYS.users, latestUsers);
        document.getElementById("resumeName").textContent =
          `Saved resume: ${file.name}`;
        showMessage("resumeMessage", "Resume saved successfully.", true);
      } catch {
        showMessage("resumeMessage", "Storage limit reached. Try a smaller PDF.");
      }
    };

    reader.readAsDataURL(file);
  });

  renderUserApplications();
}

function renderUserApplications() {
  const current = getCurrentUser();
  const applications = getApplications().filter(
    app => app.userEmail === current.email
  );

  const jobs = getJobs();

  document.getElementById("totalApps").textContent = applications.length;
  document.getElementById("pendingApps").textContent =
    applications.filter(app => app.status === "Under Review").length;
  document.getElementById("selectedApps").textContent =
    applications.filter(app => app.status === "Selected").length;

  const tbody = document.getElementById("myApplications");

  if (!applications.length) {
    tbody.innerHTML = `<tr><td colspan="4">No applications yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = applications.map(app => {
    const job = jobs.find(item => item.id === app.jobId);

    return `
      <tr>
        <td>${safe(job?.company || "Unavailable")}</td>
        <td>${safe(job?.title || "Unavailable")}</td>
        <td>${safe(app.appliedAt)}</td>
        <td><span class="status">${safe(app.status)}</span></td>
      </tr>
    `;
  }).join("");
}

// JOB LIST AND SEARCH
function initializeJobs() {
  if (!requireRole("user")) return;

  renderJobs();

  document.getElementById("jobSearch").addEventListener("input", renderJobs);
  document.getElementById("categoryFilter").addEventListener("change", renderJobs);

  document.getElementById("jobList").addEventListener("click", event => {
    const button = event.target.closest("[data-apply]");
    if (!button) return;

    applyForJob(button.dataset.apply);
  });
}

function renderJobs() {
  const search = document.getElementById("jobSearch").value.trim().toLowerCase();
  const category = document.getElementById("categoryFilter").value;

  const jobs = getJobs().filter(job => {
    const text = `${job.title} ${job.company} ${job.location} ${job.skills}`.toLowerCase();

    return job.active !== false &&
      (!search || text.includes(search)) &&
      (!category || job.category === category);
  });

  const list = document.getElementById("jobList");

  if (!jobs.length) {
    list.innerHTML = `<p class="empty">No matching jobs found.</p>`;
    return;
  }

  list.innerHTML = jobs.map(job => `
    <article class="job-card">
      <h3>${safe(job.title)}</h3>
      <p><strong>Company:</strong> ${safe(job.company)}</p>
      <p><strong>Category:</strong> ${safe(job.category)}</p>
      <p><strong>Location:</strong> ${safe(job.location)}</p>
      <p><strong>Salary:</strong> ${safe(job.salary || "Not specified")}</p>
      <p><strong>Skills:</strong> ${safe(job.skills || "Not specified")}</p>
      <p>${safe(job.description)}</p>
      <p><strong>Deadline:</strong> ${safe(job.deadline)}</p>
      <button data-apply="${safe(job.id)}">Apply Now</button>
    </article>
  `).join("");
}

// APPLY FOR JOB
function applyForJob(jobId) {
  const current = getCurrentUser();
  const users = getUsers();
  const user = users.find(item => item.email === current.email);
  const job = getJobs().find(item => item.id === jobId);

  if (!user || !job) {
    alert("Job or user not found.");
    return;
  }

  if (!user.resumeData) {
    alert("Please upload your PDF resume in your dashboard before applying.");
    return;
  }

  if (job.deadline && job.deadline < today()) {
    alert("The application deadline has passed.");
    return;
  }

  const applications = getApplications();

  if (applications.some(app =>
    app.jobId === jobId && app.userEmail === current.email
  )) {
    alert("You have already applied for this job.");
    return;
  }

  applications.push({
    id: makeId(),
    jobId,
    userEmail: current.email,
    resumeName: user.resumeName,
    resumeData: user.resumeData,
    status: "Applied",
    appliedAt: today(),
    updatedAt: today()
  });

  saveData(KEYS.applications, applications);
  alert("Application submitted successfully!");
}

// RECRUITER DASHBOARD
function initializeRecruiter() {
  if (!requireRole("recruiter")) return;

  renderRecruiterJobs();
  renderReceivedApplications();

  document.getElementById("jobForm").addEventListener("submit", saveJob);
  document.getElementById("cancelEdit").addEventListener("click", resetJobForm);

  document.getElementById("recruiterJobs").addEventListener("click", event => {
    const editButton = event.target.closest("[data-edit]");
    const deleteButton = event.target.closest("[data-delete]");

    if (editButton) editJob(editButton.dataset.edit);
    if (deleteButton) deleteJob(deleteButton.dataset.delete);
  });

  document.getElementById("receivedApplications").addEventListener("change", event => {
    if (event.target.matches("[data-status]")) {
      updateApplicationStatus(event.target.dataset.status, event.target.value);
    }
  });

  document.getElementById("receivedApplications").addEventListener("click", event => {
    const link = event.target.closest("[data-resume]");
    if (!link) return;

    const app = getApplications().find(item => item.id === link.dataset.resume);
    if (!app || !app.resumeData) return;

    const tab = window.open();
    if (!tab) {
      alert("Please allow pop-ups to view the resume.");
      return;
    }

    tab.document.write(
      `<iframe src="${app.resumeData}" style="width:100%;height:100%;border:0"></iframe>`
    );
  });
}

function saveJob(event) {
  event.preventDefault();

  const current = getCurrentUser();
  const jobs = getJobs();
  const id = document.getElementById("jobId").value;

  const jobData = {
    id: id || makeId(),
    recruiterEmail: current.email,
    title: document.getElementById("title").value.trim(),
    company: document.getElementById("company").value.trim(),
    category: document.getElementById("category").value,
    location: document.getElementById("location").value.trim(),
    salary: document.getElementById("salary").value.trim(),
    skills: document.getElementById("skills").value.trim(),
    deadline: document.getElementById("deadline").value,
    description: document.getElementById("description").value.trim(),
    createdAt: today(),
    active: true
  };

  if (jobData.deadline < today()) {
    return showMessage("jobMessage", "Deadline cannot be in the past.");
  }

  if (id) {
    const index = jobs.findIndex(job =>
      job.id === id && job.recruiterEmail === current.email
    );

    if (index === -1) {
      return showMessage("jobMessage", "Job not found.");
    }

    jobs[index] = { ...jobs[index], ...jobData };
  } else {
    jobs.push(jobData);
  }

  saveData(KEYS.jobs, jobs);
  resetJobForm();
  showMessage("jobMessage", "Job saved successfully.", true);
  renderRecruiterJobs();
  renderReceivedApplications();
}

function renderRecruiterJobs() {
  const current = getCurrentUser();
  const jobs = getJobs().filter(job => job.recruiterEmail === current.email);
  const container = document.getElementById("recruiterJobs");

  if (!jobs.length) {
    container.innerHTML = `<p class="empty">You have not posted any jobs.</p>`;
    return;
  }

  container.innerHTML = jobs.map(job => `
    <article class="job-card">
      <h3>${safe(job.title)}</h3>
      <p>${safe(job.company)} — ${safe(job.location)}</p>
      <p>Deadline: ${safe(job.deadline)}</p>
      <button class="small" data-edit="${safe(job.id)}">Edit</button>
      <button class="small danger" data-delete="${safe(job.id)}">Delete</button>
    </article>
  `).join("");
}

function editJob(id) {
  const current = getCurrentUser();
  const job = getJobs().find(item =>
    item.id === id && item.recruiterEmail === current.email
  );

  if (!job) return;

  document.getElementById("jobId").value = job.id;
  document.getElementById("title").value = job.title;
  document.getElementById("company").value = job.company;
  document.getElementById("category").value = job.category;
  document.getElementById("location").value = job.location;
  document.getElementById("salary").value = job.salary;
  document.getElementById("skills").value = job.skills;
  document.getElementById("deadline").value = job.deadline;
  document.getElementById("description").value = job.description;
  document.getElementById("jobFormTitle").textContent = "Edit Job";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetJobForm() {
  document.getElementById("jobForm").reset();
  document.getElementById("jobId").value = "";
  document.getElementById("jobFormTitle").textContent = "Post a New Job";
}

function deleteJob(id) {
  if (!confirm("Delete this job and its applications?")) return;

  const current = getCurrentUser();

  const jobs = getJobs().filter(job =>
    !(job.id === id && job.recruiterEmail === current.email)
  );

  const applications = getApplications().filter(app => app.jobId !== id);

  saveData(KEYS.jobs, jobs);
  saveData(KEYS.applications, applications);

  renderRecruiterJobs();
  renderReceivedApplications();
}

function renderReceivedApplications() {
  const current = getCurrentUser();
  const jobs = getJobs().filter(job => job.recruiterEmail === current.email);
  const jobIds = jobs.map(job => job.id);

  const applications = getApplications().filter(app =>
    jobIds.includes(app.jobId)
  );

  const users = getUsers();
  const tbody = document.getElementById("receivedApplications");

  if (!applications.length) {
    tbody.innerHTML = `<tr><td colspan="6">No applications received.</td></tr>`;
    return;
  }

  tbody.innerHTML = applications.map(app => {
    const job = jobs.find(item => item.id === app.jobId);
    const user = users.find(item => item.email === app.userEmail);

    return `
      <tr>
        <td>${safe(user?.name || "Unknown")}</td>
        <td>${safe(app.userEmail)}</td>
        <td>${safe(job?.title || "Unavailable")}</td>
        <td>
          <button class="small" data-resume="${safe(app.id)}">View PDF</button>
        </td>
        <td>${safe(app.status)}</td>
        <td>
          <select data-status="${safe(app.id)}">
            ${VALID_STATUSES.map(status => `
              <option value="${status}" ${app.status === status ? "selected" : ""}>
                ${status}
              </option>
            `).join("")}
          </select>
        </td>
      </tr>
    `;
  }).join("");
}

function updateApplicationStatus(id, status) {
  if (!VALID_STATUSES.includes(status)) return;

  const applications = getApplications();
  const app = applications.find(item => item.id === id);

  if (!app) return;

  const current = getCurrentUser();
  const job = getJobs().find(item => item.id === app.jobId);

  if (!job || job.recruiterEmail !== current.email) return;

  app.status = status;
  app.updatedAt = today();

  saveData(KEYS.applications, applications);
  alert("Application status updated.");
}

// ADMIN DASHBOARD
function initializeAdmin() {
  if (!requireRole("admin")) return;

  renderAdmin();
}

function renderAdmin() {
  const users = getUsers();
  const jobs = getJobs();
  const applications = getApplications();

  document.getElementById("userCount").textContent =
    users.filter(user => user.role === "user").length;

  document.getElementById("recruiterCount").textContent =
    users.filter(user => user.role === "recruiter").length;

  document.getElementById("jobCount").textContent = jobs.length;
  document.getElementById("applicationCount").textContent = applications.length;

  document.getElementById("adminUsers").innerHTML = users.map(user => `
    <tr>
      <td>${safe(user.name)}</td>
      <td>${safe(user.email)}</td>
      <td>${safe(user.role)}</td>
    </tr>
  `).join("") || `<tr><td colspan="3">No accounts registered.</td></tr>`;

  document.getElementById("adminJobs").innerHTML = jobs.map(job => `
    <article class="job-card">
      <h3>${safe(job.title)}</h3>
      <p>${safe(job.company)} — ${safe(job.location)}</p>
      <p>Recruiter: ${safe(job.recruiterEmail)}</p>
      <button class="small danger" data-admin-delete="${safe(job.id)}">Delete Job</button>
    </article>
  `).join("") || `<p class="empty">No jobs posted.</p>`;

  document.getElementById("adminApplications").innerHTML =
    applications.map(app => {
      const job = jobs.find(item => item.id === app.jobId);

      return `
        <tr>
          <td>${safe(app.userEmail)}</td>
          <td>${safe(job?.title || "Unavailable")}</td>
          <td>${safe(job?.company || "Unavailable")}</td>
          <td>${safe(app.status)}</td>
        </tr>
      `;
    }).join("") || `<tr><td colspan="4">No applications found.</td></tr>`;

  document.getElementById("adminJobs").addEventListener("click", event => {
    const button = event.target.closest("[data-admin-delete]");
    if (button) adminDeleteJob(button.dataset.adminDelete);
  }, { once: true });
}

function adminDeleteJob(id) {
  if (!confirm("Admin: delete this job and its applications?")) return;

  saveData(KEYS.jobs, getJobs().filter(job => job.id !== id));
  saveData(KEYS.applications, getApplications().filter(app => app.jobId !== id));

  renderAdmin();
}

// PAGE INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;

  if (page === "login") {
    document.getElementById("loginForm").addEventListener("submit", handleLogin);
  }

  if (page === "signup") {
    document.getElementById("signupForm").addEventListener("submit", handleSignup);
  }

  if (page === "forgot") {
    document.getElementById("forgotForm").addEventListener("submit", handleForgot);
  }

  if (page === "user") initializeUser();
  if (page === "jobs") initializeJobs();
  if (page === "recruiter") initializeRecruiter();
  if (page === "admin") initializeAdmin();
});