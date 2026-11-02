// =====================================
// HELPER FUNCTION
// =====================================

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function(character) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[character];
    });
}


// =====================================
// SIGNUP
// =====================================

function signup() {
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    if (!name || !email || !password) {
        document.getElementById("message").innerHTML = "Please fill all fields";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let existingUser = users.find(function(user) {
        return user.email.toLowerCase() === email.toLowerCase();
    });

    if (existingUser) {
        document.getElementById("message").innerHTML = "Email already registered";
        return;
    }

    users.push({ name: name, email: email, password: password });
    localStorage.setItem("users", JSON.stringify(users));

    document.getElementById("message").innerHTML = "Signup successful";

    setTimeout(function() {
        window.location.href = "index.html";
    }, 1000);
}


// =====================================
// LOGIN
// =====================================

function login() {
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    if (!email || !password) {
        document.getElementById("message").innerHTML = "Enter email and password";
        return;
    }

    if (email.toLowerCase() === "admin@gmail.com" && password === "admin123") {
        window.location.href = "admin.html";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(function(u) {
        return u.email.toLowerCase() === email.toLowerCase()
            && u.password === password;
    });

    if (user) {
        localStorage.setItem("currentUser", user.email);
        window.location.href = "user.html";
    } else {
        document.getElementById("message").innerHTML = "Invalid email or password";
    }
}


// =====================================
// FORGOT PASSWORD
// =====================================

function resetPassword() {
    let email = document.getElementById("email").value.trim();
    let newPassword = document.getElementById("newPassword").value.trim();

    if (!email || !newPassword) {
        document.getElementById("message").innerHTML = "Please fill all fields";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(function(u) {
        return u.email.toLowerCase() === email.toLowerCase();
    });

    if (!user) {
        document.getElementById("message").innerHTML = "Email not found";
        return;
    }

    user.password = newPassword;
    localStorage.setItem("users", JSON.stringify(users));

    document.getElementById("message").innerHTML = "Password reset successful";

    setTimeout(function() {
        window.location.href = "index.html";
    }, 1000);
}


// =====================================
// SHOW ADD APPLICATION FORM
// =====================================

function showForm() {
    document.getElementById("form").style.display = "block";
}


// =====================================
// ADD JOB APPLICATION
// =====================================

function addJob() {
    let company = document.getElementById("company").value.trim();
    let role = document.getElementById("role").value.trim();
    let status = document.getElementById("status").value;
    let email = localStorage.getItem("currentUser");

    if (!email) {
        alert("Please login first");
        window.location.href = "index.html";
        return;
    }

    if (!company || !role) {
        alert("Please fill all fields");
        return;
    }

    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

    jobs.push({
        company: company,
        role: role,
        status: status,
        email: email
    });

    localStorage.setItem("jobs", JSON.stringify(jobs));

    document.getElementById("company").value = "";
    document.getElementById("role").value = "";
    document.getElementById("status").value = "Applied";
    document.getElementById("form").style.display = "none";

    alert("Application added successfully");
    showJobs();
}


// =====================================
// SHOW DASHBOARD STATISTICS
// =====================================

function updateStatistics(myJobs) {
    document.getElementById("totalCount").textContent = myJobs.length;

    document.getElementById("appliedCount").textContent =
        myJobs.filter(job => job.status === "Applied").length;

    document.getElementById("interviewCount").textContent =
        myJobs.filter(job => job.status === "Interview").length;

    document.getElementById("selectedCount").textContent =
        myJobs.filter(job => job.status === "Selected").length;

    document.getElementById("rejectedCount").textContent =
        myJobs.filter(job => job.status === "Rejected").length;
}


// =====================================
// SHOW USER APPLICATIONS + SEARCH + FILTER
// =====================================

function showJobs() {
    let email = localStorage.getItem("currentUser");
    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

    let myJobs = jobs
        .map(function(job, index) {
            return { job: job, index: index };
        })
        .filter(function(item) {
            return item.job.email === email;
        });

    updateStatistics(myJobs.map(item => item.job));

    let searchElement = document.getElementById("search");
    let filterElement = document.getElementById("filterStatus");

    let search = searchElement ? searchElement.value.toLowerCase().trim() : "";
    let selectedStatus = filterElement ? filterElement.value : "All";

    let filteredJobs = myJobs.filter(function(item) {
        let matchesCompany = item.job.company.toLowerCase().includes(search);
        let matchesStatus = selectedStatus === "All" || item.job.status === selectedStatus;

        return matchesCompany && matchesStatus;
    });

    let output = "";

    if (filteredJobs.length === 0) {
        output = "<p>No applications found.</p>";
    } else {
        filteredJobs.forEach(function(item) {
            let job = item.job;

            output += `
                <div class="job-card">
                    <h3>${escapeHTML(job.company)}</h3>
                    <p><b>Role:</b> ${escapeHTML(job.role)}</p>
                    <p><b>Status:</b> ${escapeHTML(job.status)}</p>
                    <button onclick="editJob(${item.index})">Edit</button>
                    <button onclick="deleteJob(${item.index})">Delete</button>
                </div>
            `;
        });
    }

    document.getElementById("jobs").innerHTML = output;
}


// =====================================
// EDIT APPLICATION
// =====================================

function editJob(index) {
    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    let job = jobs[index];
    let currentUser = localStorage.getItem("currentUser");

    if (!job || job.email !== currentUser) {
        alert("Application not found");
        return;
    }

    let newCompany = prompt("Enter company name:", job.company);
    if (newCompany === null) return;

    let newRole = prompt("Enter job role:", job.role);
    if (newRole === null) return;

    let newStatus = prompt(
        "Enter status: Applied, Interview, Selected or Rejected",
        job.status
    );

    if (newStatus === null) return;

    newCompany = newCompany.trim();
    newRole = newRole.trim();
    newStatus = newStatus.trim();

    let allowedStatuses = ["Applied", "Interview", "Selected", "Rejected"];

    if (!newCompany || !newRole) {
        alert("Company and role cannot be empty");
        return;
    }

    if (!allowedStatuses.includes(newStatus)) {
        alert("Please enter a valid status");
        return;
    }

    jobs[index].company = newCompany;
    jobs[index].role = newRole;
    jobs[index].status = newStatus;

    localStorage.setItem("jobs", JSON.stringify(jobs));

    alert("Application updated successfully");
    showJobs();
}


// =====================================
// DELETE USER APPLICATION
// =====================================

function deleteJob(index) {
    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    let currentUser = localStorage.getItem("currentUser");

    if (!jobs[index] || jobs[index].email !== currentUser) {
        alert("Application not found");
        return;
    }

    if (!confirm("Are you sure you want to delete this application?")) {
        return;
    }

    jobs.splice(index, 1);
    localStorage.setItem("jobs", JSON.stringify(jobs));

    showJobs();
}


// =====================================
// LOGOUT
// =====================================

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}


// =====================================
// ADMIN - SHOW REGISTERED USERS
// =====================================

function showUsers() {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let output = "<h3>Registered Users</h3>";

    if (users.length === 0) {
        output += "<p>No users registered.</p>";
    } else {
        users.forEach(function(user) {
            output += `
                <div class="job-card">
                    <p><b>Name:</b> ${escapeHTML(user.name)}</p>
                    <p><b>Email:</b> ${escapeHTML(user.email)}</p>
                </div>
            `;
        });
    }

    document.getElementById("adminData").innerHTML = output;
}


// =====================================
// ADMIN - SHOW ALL APPLICATIONS
// =====================================

function showAllJobs() {
    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    let output = "<h3>All Job Applications</h3>";

    if (jobs.length === 0) {
        output += "<p>No applications found.</p>";
    } else {
        jobs.forEach(function(job, index) {
            output += `
                <div class="job-card">
                    <p><b>Company:</b> ${escapeHTML(job.company)}</p>
                    <p><b>Role:</b> ${escapeHTML(job.role)}</p>
                    <p><b>Status:</b> ${escapeHTML(job.status)}</p>
                    <p><b>User:</b> ${escapeHTML(job.email)}</p>
                    <button onclick="adminDeleteJob(${index})">Delete</button>
                </div>
            `;
        });
    }

    document.getElementById("adminData").innerHTML = output;
}


// =====================================
// ADMIN - DELETE APPLICATION
// =====================================

function adminDeleteJob(index) {
    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

    if (!jobs[index]) {
        alert("Application not found");
        return;
    }

    if (!confirm("Delete this application?")) {
        return;
    }

    jobs.splice(index, 1);
    localStorage.setItem("jobs", JSON.stringify(jobs));

    showAllJobs();
}
