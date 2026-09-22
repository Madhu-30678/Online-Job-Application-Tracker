function signup() {

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if (name == "" || email == "" || password == "") {
        document.getElementById("message").innerHTML = "Fill all fields";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    users.push({
        name: name,
        email: email,
        password: password
    });

    localStorage.setItem("users", JSON.stringify(users));

    document.getElementById("message").innerHTML =
        "Signup successful";

    setTimeout(function() {
        window.location.href = "index.html";
    }, 1000);
}


function login() {

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(function(u) {
        return u.email == email && u.password == password;
    });

    if (email == "admin@gmail.com" && password == "admin123") {

        window.location.href = "admin.html";

    } else if (user) {

        localStorage.setItem("currentUser", email);
        window.location.href = "user.html";

    } else {

        document.getElementById("message").innerHTML =
            "Invalid email or password";
    }
}


function showForm() {
    document.getElementById("form").style.display = "block";
}


function addJob() {

    let company = document.getElementById("company").value;
    let role = document.getElementById("role").value;
    let status = document.getElementById("status").value;
    let email = localStorage.getItem("currentUser");

    if (company == "" || role == "") {
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

    alert("Job added successfully");

    document.getElementById("company").value = "";
    document.getElementById("role").value = "";

    showJobs();
}


function showJobs() {

    let email = localStorage.getItem("currentUser");

    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

    let myJobs = jobs.filter(function(job) {
        return job.email == email;
    });

    let output = "<h3>My Applications</h3>";

    myJobs.forEach(function(job) {

        let index = jobs.indexOf(job);

        output +=
            "<p>" +
            job.company + " - " +
            job.role + " - " +
            job.status +
            "<br><button onclick='deleteJob(" + index + ")'>Delete</button>" +
            "</p>";
    });

    document.getElementById("jobs").innerHTML = output;
}


function searchJobs() {

    let search = document.getElementById("search").value.toLowerCase();

    let email = localStorage.getItem("currentUser");

    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

    let myJobs = jobs.filter(function(job) {
        return job.email == email &&
               job.company.toLowerCase().includes(search);
    });

    let output = "<h3>My Applications</h3>";

    myJobs.forEach(function(job) {

        let index = jobs.indexOf(job);

        output +=
            "<p>" +
            job.company + " - " +
            job.role + " - " +
            job.status +
            "<br><button onclick='deleteJob(" + index + ")'>Delete</button>" +
            "</p>";
    });

    document.getElementById("jobs").innerHTML = output;
}


function deleteJob(index) {

    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

    jobs.splice(index, 1);

    localStorage.setItem("jobs", JSON.stringify(jobs));

    alert("Application deleted");

    showJobs();
}


function logout() {

    localStorage.removeItem("currentUser");

    window.location.href = "index.html";
}


/* ADMIN FUNCTIONS */

function showUsers() {

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let output = "<h3>Registered Users</h3>";

    users.forEach(function(user) {

        output +=
            "<p>" +
            user.name + " - " +
            user.email +
            "</p>";
    });

    document.getElementById("adminData").innerHTML = output;
}


function showAllJobs() {

    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

    let output = "<h3>All Job Applications</h3>";

    jobs.forEach(function(job, index) {

        output +=
            "<p>" +
            job.company + " - " +
            job.role + " - " +
            job.status +
            "<br><button onclick='adminDeleteJob(" + index + ")'>Delete</button>" +
            "</p>";
    });

    document.getElementById("adminData").innerHTML = output;
}


function adminDeleteJob(index) {

    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

    jobs.splice(index, 1);

    localStorage.setItem("jobs", JSON.stringify(jobs));

    alert("Application deleted");

    showAllJobs();
}