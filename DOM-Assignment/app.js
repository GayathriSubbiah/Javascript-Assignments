const registrationForm = document.getElementById("registrationForm");
const studentsTable = document
  .getElementById("studentsTable")
  .getElementsByTagName("tbody")[0];
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const nameError = document.getElementById("nameError");
const studentIdInput = document.getElementById("studentId");

//nav bar hamburger
function toggleMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  mobileMenu.classList.toggle("open");
}

// Load students from local storage on page load
document.addEventListener("DOMContentLoaded", loadStudents);

// Handle form submission
registrationForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!validateName() || !validatePhone()) {
    return;
  }

  const student = {
    name: nameInput.value,
    studentId: document.getElementById("studentId").value,
    rollNo: document.getElementById("rollNo").value,
    email: document.getElementById("email").value,
    phone: phoneInput.value,
  };

  saveStudent(student);
  addStudentToTable(student);
  registrationForm.reset();
});

// Validate name input
function validateName() {
  const nameRegex = /^[A-Za-z ]+$/;
  if (!nameRegex.test(nameInput.value)) {
    nameError.style.display = "block";
    return false;
  }
  nameError.style.display = "none";
  return true;
}

// Validate phone input
function validatePhone() {
  const phoneRegex = /^[0-9]+$/;
  if (!phoneRegex.test(phoneInput.value)) {
    alert("Phone number field expects only numbers");
    return false;
  }
  return true;
}

// Validate student ID
function validatePhone() {
  const studentIdRegex = /^[0-9]+$/;
  if (!studentIdRegex.test(studentIdInput.value)) {
    alert("Student ID field expects only numbers");
    return false;
  }
  return true;
}

document.getElementById("phone").addEventListener("input", function (e) {
  const input = e.target;
  input.value = input.value.replace(/\D/g, ""); // Remove non-numeric characters
  if (input.value.length > 10) {
    input.value = input.value.slice(0, 10); // Limit to 10 digits
  }
});

// Contact form handling
document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page reload

    const contactName = document.getElementById("contactName").value.trim();
    const contactEmail = document.getElementById("contactEmail").value.trim();
    const subject = document.getElementById("contactSubject").value.trim();
    const message = document.getElementById("contactMessage").value.trim();
    const feedback = document.getElementById("contactFormFeedback");

    // validation
    if (!contactName || !contactEmail || !subject || !message) {
      feedback.innerHTML =
        "<p class='error-message'>Please fill in all the fields.</p>";
      return;
    }

    // Clear form on successful submission
    document.getElementById("contactForm").reset();
    feedback.innerHTML =
      "<p class='success-message'>Thank you for contacting us! We'll get back to you soon.</p>";
  });

// Back to Top Button Functionality
const backToTopButton = document.getElementById("backToTop");

window.onscroll = function () {
  if (window.scrollY > 200) {
    backToTopButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
  }
};

backToTopButton.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

function loadStudents() {
  const students = JSON.parse(localStorage.getItem("students")) || [];
  students.forEach(addStudentToTable);
}

function saveStudent(student) {
  const students = JSON.parse(localStorage.getItem("students")) || [];
  students.push(student);
  localStorage.setItem("students", JSON.stringify(students));
}

function addStudentToTable(student) {
  const row = studentsTable.insertRow();
  row.insertCell(0).textContent = student.name;
  row.insertCell(1).textContent = student.studentId;
  row.insertCell(2).textContent = student.rollNo;
  row.insertCell(3).textContent = student.email;
  row.insertCell(4).textContent = student.phone;

  // Create action cell with edit and delete buttons
  const actionCell = row.insertCell(5);
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.classList.add("edit-btn");
  actionCell.appendChild(editButton);

  // Handle edit button click
  editButton.addEventListener("click", function () {
    populateFormForEdit(student, row);
  });

  function populateFormForEdit(student, row) {
    // Populate the form with student details
    nameInput.value = student.name;
    studentIdInput.value = student.studentId;
    document.getElementById("rollNo").value = student.rollNo;
    document.getElementById("email").value = student.email;
    phoneInput.value = student.phone;
  
    // Change the form button text to "Update"
    const submitButton = registrationForm.querySelector("button[type='submit']");
    submitButton.textContent = "Update";
  
    // Remove the old row from the table and update localStorage
    registrationForm.onsubmit = function (event) {
      event.preventDefault();
      if (!validateName() || !validatePhone()) return;
  
      // Update student object
      student.name = nameInput.value;
      student.studentId = studentIdInput.value;
      student.rollNo = document.getElementById("rollNo").value;
      student.email = document.getElementById("email").value;
      student.phone = phoneInput.value;
  
      // Save updated students to localStorage
      updateStudentInLocalStorage(student);
      
      // Reset form and re-render the table
      registrationForm.reset();
      submitButton.textContent = "Add Student";
      renderTable();
    };
  }
  
  function updateStudentInLocalStorage(updatedStudent) {
    const students = JSON.parse(localStorage.getItem("students")) || [];
    const studentIndex = students.findIndex(
      (student) => student.studentId === updatedStudent.studentId
    );
    if (studentIndex !== -1) {
      students[studentIndex] = updatedStudent;
      localStorage.setItem("students", JSON.stringify(students));
    }
  }
  
  function renderTable() {
    studentsTable.innerHTML = ''; // Clear table
    const students = JSON.parse(localStorage.getItem("students")) || [];
    students.forEach(addStudentToTable);
  }
  
  document.addEventListener("DOMContentLoaded", function () {
    loadStudents();
    renderTable();
  });

  // Add delete button
  const deleteCell = row.insertCell(5);
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-btn");
  deleteButton.onclick = function () {
    deleteStudent(row, student.studentId);
  };
  deleteCell.appendChild(deleteButton);

}
function deleteStudent(row, studentId) {
    // Remove the row from the table
    row.remove();
  
    // Remove the student from local storage
    let students = JSON.parse(localStorage.getItem("students")) || [];
    students = students.filter(student => student.studentId !== studentId);
    localStorage.setItem("students", JSON.stringify(students));
  }
  