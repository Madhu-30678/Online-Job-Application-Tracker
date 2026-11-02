
// ==========================================
// JOBTRACK - ONLINE JOB APPLICATION TRACKER
// HTML + CSS + JAVASCRIPT + LOCAL STORAGE
// ==========================================

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin123";

const VALID_STATUSES = [
    "Applied",
    "Interview",
    "Selected",
    "Rejected"
];

// ---------- STORAGE FUNCTIONS ----------

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem("users") || "[]");
    } catch {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function getJobs() {
    try {
        return JSON.parse(localStorage.getItem("jobs") || "[]");
    } catch {
        return [];
    }
}

function saveJobs(jobs) {
    localStorage.setItem("jobs", JSON.stringify(jobs));
}

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem("currentUser") || "null");
    } catch {
        return null;
    }
}

function getJobOwner(job) {
    return String(job.userEmail || job.email || job.user || "")
        .toLowerCase();
}

function makeId() {
    return Date.now().toString(36) +
        Math.random().toString(36).slice(2, 8);
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// ---------- SIGNUP ----------

function signup(event) {
    event.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail")
        .value.trim().toLowerCase();
    const password = document.getElementById("signupPassword").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (!name || !email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    if (password.length < 6) {
        alert("Password must contain at least 6 characters.");
        return;
    }

    if (password !== confirm) {
        alert("Passwords do not match.");
        return;
    }

    const users = getUsers();

    if (users.some(user =>
        String(user.email).toLowerCase() === email
    )) {
        alert("This email is already registered. Please login.");
        return;
    }

    users.push({
        id: makeId(),
        name,
        email,
        password
    });

    saveUsers(users);

    alert("Account created successfully!");
    window.location.href = "index.html";
}

// ---------- USER LOGIN ----------

function login(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail")
        .value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const user = getUsers().find(item =>
        String(item.email).toLowerCase() === email &&
        item.password === password
    );

    if (!user) {
        alert("Invalid email or password.");
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email
    }));

    window.location.href = "user.html";
}

// ---------- FORGOT PASSWORD ----------

function resetPassword(event) {
    event.preventDefault();

    const email = document.getElementById("resetEmail")
        .value.trim().toLowerCase();
    const password = document.getElementById("newPassword").value;
    const confirm = document.getElementById("confirmNewPassword").value;

    if (password.length < 6) {
        alert("Password must contain at least 6 characters.");
        return;
    }

    if (password !== confirm) {
        alert("Passwords do not match.");
        return;
    }

    const users = getUsers();
    const index = users.findIndex(user =>
        String(user.email).toLowerCase() === email
    );

    if (index === -1) {
        alert("No account found with this email.");
        return;
    }

    users[index].password = password;
    saveUsers(users);

    alert("Password updated successfully. Please login.");
    window.location.href = "index.html";
}

// ---------- USER DASHBOARD ----------

function showUserDashboard() {
    const user = getCurrentUser();

    if (!user) {
        alert("Please login first.");
        window.location.href = "index.html";
        return false;
    }

    const welcome = document.getElementById("welcomeUser");

    if (welcome) {
        welcome.textContent = "Welcome, " + user.name;
    }

    return true;
}

// ---------- ADD APPLICATION ----------

function addJob(event) {
    event.preventDefault();

    const user = getCurrentUser();

    if (!user) {
        alert("Please login first.");
        window.location.href = "index.html";
        return;
    }

    const company = document.getElementById("company").value.trim();
    const role = document.getElementById("role").value.trim();
    const status = document.getElementById("status").value;
    const dateInput = document.getElementById("applicationDate");

    const date = dateInput.value ||
        new Date().toISOString().slice(0, 10);

    if (!company || !role) {
        alert("Please enter company name and job role.");
        return;
    }

    if (!VALID_STATUSES.includes(status)) {
        alert("Please select a valid application status.");
        return;
    }

    const jobs = getJobs();

    jobs.push({
        id: makeId(),
        userEmail: user.email.toLowerCase(),
        company,
        role,
        status,
        date
    });

    saveJobs(jobs);

    document.getElementById("jobForm").reset();
    alert("Application added successfully!");

    showJobs();
}

// ---------- DASHBOARD STATISTICS ----------

function updateStatistics(jobs) {
    const counts = {
        totalCount: jobs.length,
        appliedCount: jobs.filter(j => j.status === "Applied").length,
        interviewCount: jobs.filter(j => j.status === "Interview").length,
        selectedCount: jobs.filter(j => j.status === "Selected").length,
        rejectedCount: jobs.filter(j => j.status === "Rejected").length
    };

    Object.entries(counts).forEach(([id, value]) => {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
        }
    });
}

// ---------- DISPLAY USER APPLICATIONS ----------

function showJobs() {
    const user = getCurrentUser();
    const container = document.getElementById("jobs");

    if (!user || !container) return;

    const userJobs = getJobs().filter(job =>
        getJobOwner(job) === user.email.toLowerCase()
    );

    updateStatistics(userJobs);

    const search = (
        document.getElementById("search")?.value || ""
    ).trim().toLowerCase();

    const filter = document.getElementById("filterStatus")?.value || "All";

    const filteredJobs = userJobs.filter(job => {
        const matchesSearch =
            String(job.company).toLowerCase().includes(search) ||
            String(job.role).toLowerCase().includes(search);

        const matchesStatus =
            filter === "All" || job.status === filter;

        return matchesSearch && matchesStatus;
    });

    if (filteredJobs.length === 0) {
        container.innerHTML =
            '<div class="empty-message">No applications found. Add an application to get started.</div>';
        return;
    }

    container.innerHTML = filteredJobs.map(job => `
        <article class="job-card">
            <h3>${escapeHTML(job.company)}</h3>
            <p><strong>Job Role:</strong> ${escapeHTML(job.role)}</p>
            <p><strong>Application Date:</strong> ${escapeHTML(job.date || "Not available")}</p>
            <p><strong>Status:</strong>
                <span class="status-badge">${escapeHTML(job.status)}</span>
            </p>

            <button onclick="editJob('${escapeHTML(job.id)}')">
                Edit
            </button>

            <button class="delete-btn"
                onclick="deleteJob('${escapeHTML(job.id)}')">
                Delete
            </button>
        </article>
    `).join("");
}

// ---------- EDIT APPLICATION ----------

function editJob(id) {
    const user = getCurrentUser();
    if (!user) return;

    const jobs = getJobs();

    const index = jobs.findIndex(job =>
        String(job.id) === String(id) &&
        getJobOwner(job) === user.email.toLowerCase()
    );

    if (index === -1) {
        alert("Application not found.");
        return;
    }

    const job = jobs[index];

    const company = prompt("Enter company name:", job.company);
    if (company === null) return;

    const role = prompt("Enter job role:", job.role);
    if (role === null) return;

    const status = prompt(
        "Enter status: Applied, Interview, Selected, Rejected",
        job.status
    );

    if (status === null) return;

    const date = prompt(
        "Enter application date (YYYY-MM-DD):",
        job.date || new Date().toISOString().slice(0, 10)
    );

    if (date === null) return;

    const cleanStatus = status.trim();

    if (!company.trim() || !role.trim()) {
        alert("Company name and role cannot be empty.");
        return;
    }

    if (!VALID_STATUSES.includes(cleanStatus)) {
        alert("Enter one of these statuses: Applied, Interview, Selected, Rejected.");
        return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date.trim()) ||
        Number.isNaN(Date.parse(date.trim() + "T00:00:00"))) {
        alert("Please enter the date in YYYY-MM-DD format.");
        return;
    }

    jobs[index].company = company.trim();
    jobs[index].role = role.trim();
    jobs[index].status = cleanStatus;
    jobs[index].date = date.trim();

    saveJobs(jobs);
    showJobs();

    alert("Application updated successfully!");
}

// ---------- DELETE APPLICATION ----------

function deleteJob(id) {
    const user = getCurrentUser();
    if (!user) return;

    if (!confirm("Are you sure you want to delete this application?")) {
        return;
    }

    const jobs = getJobs().filter(job =>
        !(
            String(job.id) === String(id) &&
            getJobOwner(job) === user.email.toLowerCase()
        )
    );

    saveJobs(jobs);
    showJobs();
}

// ---------- USER LOGOUT ----------

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

// ==========================================
// ADMIN FUNCTIONS
// ==========================================

// ---------- ADMIN LOGIN ----------

function adminLoginUser(event) {
    event.preventDefault();

    const email = document.getElementById("adminEmail")
        .value.trim().toLowerCase();
    const password = document.getElementById("adminPassword").value;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem("adminLoggedIn", "true");
        initializeAdmin();
    } else {
        alert("Invalid admin email or password.");
    }
}

// ---------- ADMIN DASHBOARD ----------

function initializeAdmin() {
    const loginPanel = document.getElementById("adminLogin");
    const dashboard = document.getElementById("adminDashboard");

    if (!loginPanel || !dashboard) return;

    loginPanel.style.display = "none";
    dashboard.style.display = "block";

    showUsers();
    showAllJobs();
}

// ---------- ADMIN LOGOUT ----------

function adminLogout() {
    localStorage.removeItem("adminLoggedIn");
    window.location.href = "admin.html";
}

// ---------- DISPLAY REGISTERED USERS ----------

function showUsers() {
    const container = document.getElementById("usersList");
    if (!container) return;

    const users = getUsers();

    document.getElementById("adminUserCount").textContent = users.length;

    if (users.length === 0) {
        container.innerHTML =
            '<div class="empty-message">No registered users yet.</div>';
        return;
    }

    container.innerHTML = `
        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(user => `
                        <tr>
                            <td>${escapeHTML(user.name)}</td>
                            <td>${escapeHTML(user.email)}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}

// ---------- DISPLAY ALL APPLICATIONS ----------

function showAllJobs() {
    const container = document.getElementById("allJobs");
    if (!container) return;

    const jobs = getJobs();

    document.getElementById("adminJobCount").textContent = jobs.length;

    const search = (
        document.getElementById("adminSearch")?.value || ""
    ).trim().toLowerCase();

    const filteredJobs = jobs.filter(job =>
        String(job.company).toLowerCase().includes(search) ||
        String(job.role).toLowerCase().includes(search) ||
        getJobOwner(job).includes(search)
    );

    if (filteredJobs.length === 0) {
        container.innerHTML =
            '<div class="empty-message">No job applications found.</div>';
        return;
    }

    container.innerHTML = filteredJobs.map(job => `
        <article class="job-card">
            <h3>${escapeHTML(job.company)}</h3>
            <p><strong>Job Role:</strong> ${escapeHTML(job.role)}</p>
            <p><strong>User Email:</strong> ${escapeHTML(getJobOwner(job))}</p>
            <p><strong>Status:</strong> ${escapeHTML(job.status)}</p>
            <p><strong>Date:</strong> ${escapeHTML(job.date || "Not available")}</p>

            <button class="delete-btn"
                onclick="adminDeleteJob('${escapeHTML(job.id)}')">
                Delete Application
            </button>
        </article>
    `).join("");
}

// ---------- ADMIN DELETE APPLICATION ----------

function adminDeleteJob(id) {
    if (localStorage.getItem("adminLoggedIn") !== "true") {
        alert("Please login as admin.");
        return;
    }

    if (!confirm("Are you sure you want to delete this application?")) {
        return;
    }

    const jobs = getJobs().filter(
        job => String(job.id) !== String(id)
    );

    saveJobs(jobs);
    showAllJobs();
}

// ==========================================
// PAGE INITIALIZATION
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // User dashboard
    if (document.getElementById("jobs")) {
        if (showUserDashboard()) {
            showJobs();
        }
    }

    // Admin dashboard
    if (document.getElementById("adminDashboard")) {
        if (localStorage.getItem("adminLoggedIn") === "true") {
            initializeAdmin();
        }
    }
});
