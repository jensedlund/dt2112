"use strict";

/**
 * Saves the form data to a JSON file for local storage.
 * Uses strict ECMAScript 6 (ES6).
 */
function saveFormData() {
    const form = document.getElementById("examForm");
    const formData = new FormData(form);
    const data = {};

    // Store form data as key-value pairs
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Convert data to JSON format
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Create a download link
    let a = document.createElement("a");
    a.href = url;
    a.download = "exam_form_data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Loads form data from a JSON file and populates the form fields.
 * Triggered by file input change event.
 */
function loadFormData(event) {
    const file = event.target.files[0];
    if (!file) {
        alert("No file selected.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const jsonData = e.target.result;
        const data = JSON.parse(jsonData);
        const form = document.getElementById("examForm");

        Object.keys(data).forEach((key) => {
            const element = form.elements[key];
            if (element) {
                element.value = data[key];
            }
        });

        // 🛠 Also update `localStorage` so it's always in sync
        localStorage.setItem("examFormAutoSave", JSON.stringify(data));

        alert("Form data loaded successfully.");
    };
    reader.readAsText(file);
}

/**
 * Saves the form data to localStorage whenever an input changes.
 */
function saveToLocalStorage() {
    const form = document.getElementById("examForm");
    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });

    localStorage.setItem("examFormAutoSave", JSON.stringify(data));
}

/**
 * Loads form data from localStorage when the page loads.
 */
function loadFromLocalStorage() {
    const savedData = localStorage.getItem("examFormAutoSave");
    if (!savedData) return;

    const data = JSON.parse(savedData);
    const form = document.getElementById("examForm");

    Object.keys(data).forEach((key) => {
        const element = form.elements[key];
        if (element) {
            element.value = data[key];
        }
    });

    console.log("Auto-saved form data restored.");
}

function clearAutoSavedForm() {
    if (!confirm("Are you sure you want to clear auto-save? This will reset the form.")) {
        return;
    }

    // Clear localStorage auto-save data
    localStorage.removeItem("examFormAutoSave");

    // Reset all form fields
    const form = document.getElementById("examForm");
    if (form) {
        form.reset(); // Reset all input fields
    }

    alert("Auto-save cleared and form reset.");
}

// Ensure the DOM is fully loaded before running any script
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("examForm");

    if (!form) {
        console.error("Form not found! Make sure the form exists in the document.");
        return;
    }

    // Attach event listener to auto-save on input changes
    form.addEventListener("input", saveToLocalStorage);

    // Load auto-saved form data when the page loads
    loadFromLocalStorage();
});
