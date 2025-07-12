/**
 * Form Handling and Validation
 * Manages employee form validation, submission, and user interactions
 */

class EmployeeFormManager {
  constructor() {
    this.form = document.getElementById("employeeForm");
    this.currentEmployeeId = null;
    this.isSubmitting = false;

    this.initializeForm();
    this.setupEventListeners();
    this.loadEmployeeData();
  }

  /**
   * Initialize form elements
   */
  initializeForm() {
    this.formElements = {
      firstName: document.getElementById("firstName"),
      lastName: document.getElementById("lastName"),
      email: document.getElementById("email"),
      department: document.getElementById("department"),
      role: document.getElementById("role"),
      saveBtn: document.getElementById("saveBtn"),
      cancelBtn: document.getElementById("cancelBtn"),
      formTitle: document.getElementById("formTitle"),
    };

    this.errorElements = {
      firstName: document.getElementById("firstNameError"),
      lastName: document.getElementById("lastNameError"),
      email: document.getElementById("emailError"),
      department: document.getElementById("departmentError"),
      role: document.getElementById("roleError"),
    };
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Form submission
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));

    // Cancel button
    this.formElements.cancelBtn.addEventListener("click", () =>
      this.handleCancel()
    );

    // Real-time validation
    this.formElements.firstName.addEventListener("input", () =>
      this.validateField("firstName")
    );
    this.formElements.firstName.addEventListener("blur", () =>
      this.validateField("firstName")
    );

    this.formElements.lastName.addEventListener("input", () =>
      this.validateField("lastName")
    );
    this.formElements.lastName.addEventListener("blur", () =>
      this.validateField("lastName")
    );

    this.formElements.email.addEventListener("input", () =>
      this.validateField("email")
    );
    this.formElements.email.addEventListener("blur", () =>
      this.validateField("email")
    );

    this.formElements.department.addEventListener("change", () =>
      this.validateField("department")
    );
    this.formElements.department.addEventListener("blur", () =>
      this.validateField("department")
    );

    this.formElements.role.addEventListener("change", () =>
      this.validateField("role")
    );
    this.formElements.role.addEventListener("blur", () =>
      this.validateField("role")
    );

    // Debounced email validation for uniqueness
    this.formElements.email.addEventListener(
      "input",
      DOMUtils.debounce(() => this.validateEmailUniqueness(), 500)
    );
  }

  /**
   * Load employee data from URL parameters
   */
  loadEmployeeData() {
    const urlParams = new URLSearchParams(window.location.search);
    const employeeId = urlParams.get("id");

    if (employeeId) {
      const parsedId = parseInt(employeeId);
      if (isNaN(parsedId)) {
        if (window.notificationManager) {
          window.notificationManager.show(
            "error",
            "Invalid Employee ID",
            "The employee ID in the URL is invalid. Redirecting to add new employee."
          );
        } else {
          alert(
            "The employee ID in the URL is invalid. Redirecting to add new employee."
          );
        }
        this.setupForAdd();
        return;
      }
      this.currentEmployeeId = parsedId;
      this.loadEmployeeForEdit();
    } else {
      this.setupForAdd();
    }
  }

  /**
   * Setup form for adding new employee
   */
  setupForAdd() {
    this.currentEmployeeId = null;
    this.formElements.formTitle.textContent = "Add Employee";
    this.formElements.saveBtn.querySelector(".btn-text").textContent =
      "Save Employee";
    this.clearForm();
    this.clearAllErrors();
  }

  /**
   * Load employee data for editing
   */
  loadEmployeeForEdit() {
    if (!this.currentEmployeeId) {
      if (window.notificationManager) {
        window.notificationManager.show(
          "error",
          "Invalid Employee ID",
          "No employee ID provided for editing."
        );
      } else {
        alert("No employee ID provided for editing.");
      }
      this.redirectToDashboard();
      return;
    }

    const employee = window.employeeManager.getEmployeeById(
      this.currentEmployeeId
    );

    if (employee) {
      this.formElements.formTitle.textContent = "Edit Employee";
      this.formElements.saveBtn.querySelector(".btn-text").textContent =
        "Update Employee";

      this.populateForm(employee);
    } else {
      if (window.notificationManager) {
        window.notificationManager.show(
          "error",
          "Employee Not Found",
          "The employee you are trying to edit could not be found. It may have been deleted."
        );
      } else {
        alert(
          "The employee you are trying to edit could not be found. It may have been deleted."
        );
      }
      this.redirectToDashboard();
    }
  }

  /**
   * Populate form with employee data
   */
  populateForm(employee) {
    this.formElements.firstName.value = employee.firstName || "";
    this.formElements.lastName.value = employee.lastName || "";
    this.formElements.email.value = employee.email || "";
    this.formElements.department.value = employee.department || "";
    this.formElements.role.value = employee.role || "";
  }

  /**
   * Clear form fields
   */
  clearForm() {
    this.form.reset();
    this.clearAllErrors();
  }

  /**
   * Clear all error messages
   */
  clearAllErrors() {
    Object.values(this.errorElements).forEach((errorElement) => {
      if (errorElement) {
        errorElement.textContent = "";
      }
    });
  }

  /**
   * Clear specific error message
   */
  clearError(fieldName) {
    const errorElement = this.errorElements[fieldName];
    if (errorElement) {
      errorElement.textContent = "";
    }
  }

  /**
   * Show error message for field
   */
  showError(fieldName, message) {
    const errorElement = this.errorElements[fieldName];
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  /**
   * Validate a specific field
   */
  validateField(fieldName) {
    const field = this.formElements[fieldName];
    const value = field.value.trim();

    this.clearError(fieldName);

    // Required field validation
    if (!ValidationUtils.isRequired(value)) {
      this.showError(
        fieldName,
        ValidationUtils.getErrorMessage(fieldName, "required")
      );
      return false;
    }

    // Field-specific validation
    switch (fieldName) {
      case "firstName":
      case "lastName":
        if (!ValidationUtils.hasMinLength(value, 2)) {
          this.showError(
            fieldName,
            ValidationUtils.getErrorMessage(fieldName, "minLength", "2")
          );
          return false;
        }
        if (!ValidationUtils.hasMaxLength(value, 50)) {
          this.showError(
            fieldName,
            ValidationUtils.getErrorMessage(fieldName, "maxLength", "50")
          );
          return false;
        }
        if (!ValidationUtils.isValidName(value)) {
          this.showError(
            fieldName,
            ValidationUtils.getErrorMessage(fieldName, "name")
          );
          return false;
        }
        break;

      case "email":
        if (!ValidationUtils.isValidEmail(value)) {
          this.showError(
            fieldName,
            ValidationUtils.getErrorMessage(fieldName, "email")
          );
          return false;
        }
        break;

      case "department":
      case "role":
        if (value === "") {
          this.showError(
            fieldName,
            ValidationUtils.getErrorMessage(fieldName, "select")
          );
          return false;
        }
        break;
    }

    return true;
  }

  /**
   * Validate email uniqueness
   */
  validateEmailUniqueness() {
    const email = this.formElements.email.value.trim();

    if (email && ValidationUtils.isValidEmail(email)) {
      const isUnique = window.employeeManager.isEmailUnique(
        email,
        this.currentEmployeeId
      );
      if (!isUnique) {
        this.showError(
          "email",
          "This email address is already in use by another employee."
        );
        return false;
      }
    }

    return true;
  }

  /**
   * Validate entire form
   */
  validateForm() {
    let isValid = true;
    let firstErrorField = null;

    // Validate all required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "department",
      "role",
    ];

    requiredFields.forEach((fieldName) => {
      if (!this.validateField(fieldName)) {
        isValid = false;
        if (!firstErrorField) {
          firstErrorField = fieldName;
        }
      }
    });

    // Additional email uniqueness check
    if (isValid && !this.validateEmailUniqueness()) {
      isValid = false;
      if (!firstErrorField) {
        firstErrorField = "email";
      }
    }

    // Focus on the first error field
    if (!isValid && firstErrorField) {
      const field = this.formElements[firstErrorField];
      if (field) {
        field.focus();
        field.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    return isValid;
  }

  /**
   * Get form data as object
   */
  getFormData() {
    return {
      firstName: this.formElements.firstName.value.trim(),
      lastName: this.formElements.lastName.value.trim(),
      email: this.formElements.email.value.trim(),
      department: this.formElements.department.value,
      role: this.formElements.role.value,
    };
  }

  /**
   * Handle form submission
   */
  async handleSubmit(e) {
    e.preventDefault();

    if (this.isSubmitting) {
      window.notificationManager.show(
        "warning",
        "Submission in Progress",
        "Please wait while the form is being submitted."
      );
      return;
    }

    // Clear previous errors
    this.clearAllErrors();

    // Validate form
    if (!this.validateForm()) {
      if (window.notificationManager) {
        window.notificationManager.show(
          "error",
          "Validation Error",
          "Please correct the errors in the form before submitting."
        );
      } else {
        alert("Please correct the errors in the form before submitting.");
      }
      return;
    }

    this.isSubmitting = true;
    DOMUtils.showLoading(this.formElements.saveBtn, "Saving...");

    try {
      const formData = this.getFormData();
      let result;

      if (this.currentEmployeeId) {
        // Update existing employee
        result = window.employeeManager.updateEmployee(
          this.currentEmployeeId,
          formData
        );
        if (result) {
          window.notificationManager.show(
            "success",
            "Employee Updated",
            "Employee information has been successfully updated."
          );
        } else {
          throw new Error("Failed to update employee");
        }
      } else {
        // Add new employee
        result = window.employeeManager.addEmployee(formData);
        if (result) {
          window.notificationManager.show(
            "success",
            "Employee Added",
            "Employee has been successfully added to the directory."
          );
        } else {
          throw new Error("Failed to add employee");
        }
      }

      // Redirect to dashboard after successful submission
      setTimeout(() => {
        this.redirectToDashboard();
      }, 1000);
    } catch (error) {
      console.error("Form submission error:", error);
      if (window.notificationManager) {
        window.notificationManager.show(
          "error",
          "Submission Failed",
          "An error occurred while saving the employee. Please try again."
        );
      } else {
        alert("An error occurred while saving the employee. Please try again.");
      }
    } finally {
      this.isSubmitting = false;
      DOMUtils.hideLoading(this.formElements.saveBtn);
    }
  }

  /**
   * Handle cancel button click
   */
  handleCancel() {
    // Check if form has been modified
    const formData = this.getFormData();
    const hasChanges = Object.values(formData).some((value) => value !== "");

    if (hasChanges) {
      const confirmed = confirm(
        "You have unsaved changes. Are you sure you want to cancel? Your changes will be lost."
      );
      if (confirmed) {
        this.redirectToDashboard();
      }
    } else {
      this.redirectToDashboard();
    }
  }

  /**
   * Redirect to dashboard
   */
  redirectToDashboard() {
    window.location.href = "index.html";
  }

  /**
   * Reset form to initial state
   */
  resetForm() {
    this.clearForm();
    this.clearAllErrors();
    this.isSubmitting = false;
    DOMUtils.hideLoading(this.formElements.saveBtn);
  }

  /**
   * Check if form has unsaved changes
   */
  hasUnsavedChanges() {
    const formData = this.getFormData();
    return Object.values(formData).some((value) => value !== "");
  }

  /**
   * Setup form validation rules
   */
  setupValidationRules() {
    // Add custom validation attributes
    this.formElements.firstName.setAttribute("minlength", "2");
    this.formElements.firstName.setAttribute("maxlength", "50");
    this.formElements.firstName.setAttribute("pattern", "[a-zA-Z\\s\\-\\']+");

    this.formElements.lastName.setAttribute("minlength", "2");
    this.formElements.lastName.setAttribute("maxlength", "50");
    this.formElements.lastName.setAttribute("pattern", "[a-zA-Z\\s\\-\\']+");

    this.formElements.email.setAttribute("type", "email");
    this.formElements.email.setAttribute("maxlength", "100");
  }

  /**
   * Handle beforeunload event to warn about unsaved changes
   */
  setupBeforeUnload() {
    window.addEventListener("beforeunload", (e) => {
      if (this.hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = "";
      }
    });
  }

  /**
   * Initialize form manager
   */
  init() {
    this.setupValidationRules();
    this.setupBeforeUnload();
  }
}

// Initialize form manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("employeeForm")) {
    window.employeeFormManager = new EmployeeFormManager();
    window.employeeFormManager.init();
  }
});
