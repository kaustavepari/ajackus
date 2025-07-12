/**
 * Main Application
 * Handles dashboard functionality, UI interactions, and Freemarker template rendering
 */

class EmployeeDirectoryApp {
  constructor() {
    this.isLoading = false;
    this.filterSidebarOpen = false;
    this.currentEmployeeToDelete = null;
    this.isDeleting = false;

    this.initializeElements();
    this.setupEventListeners();
    this.initializeApp();
  }

  /**
   * Initialize DOM elements
   */
  initializeElements() {
    // Main containers
    this.employeeGrid = document.getElementById("employeeGrid");
    this.loadingState = document.getElementById("loadingState");
    this.emptyState = document.getElementById("emptyState");

    // Search and filter elements
    this.searchInput = document.getElementById("searchInput");
    this.sortSelect = document.getElementById("sortSelect");
    this.filterBtn = document.getElementById("filterBtn");
    this.filterSidebar = document.getElementById("filterSidebar");
    this.closeFilterBtn = document.getElementById("closeFilterBtn");
    this.clearFiltersBtn = document.getElementById("clearFiltersBtn");
    this.applyFiltersBtn = document.getElementById("applyFiltersBtn");

    // Filter options containers
    this.departmentFilters = document.getElementById("departmentFilters");
    this.roleFilters = document.getElementById("roleFilters");

    // Pagination elements
    this.paginationInfo = document.getElementById("paginationInfo");
    this.pageInfo = document.getElementById("pageInfo");
    this.prevPageBtn = document.getElementById("prevPageBtn");
    this.nextPageBtn = document.getElementById("nextPageBtn");
    this.pageSizeSelect = document.getElementById("pageSizeSelect");

    // Modal elements
    this.modalOverlay = document.getElementById("modalOverlay");
    this.deleteModal = document.getElementById("deleteModal");
    this.closeDeleteModalBtn = document.getElementById("closeDeleteModal");
    this.cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
    this.confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    this.deleteEmployeeName = document.getElementById("deleteEmployeeName");

    // Action buttons
    this.addEmployeeBtn = document.getElementById("addEmployeeBtn");
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Search functionality
    this.searchInput.addEventListener(
      "input",
      DOMUtils.debounce(() => this.handleSearch(), 300)
    );

    // Sorting
    this.sortSelect.addEventListener("change", () => this.handleSort());

    // Filter sidebar
    this.filterBtn.addEventListener("click", () => this.toggleFilterSidebar());
    this.closeFilterBtn.addEventListener("click", () =>
      this.closeFilterSidebar()
    );
    this.clearFiltersBtn.addEventListener("click", () => this.clearFilters());
    this.applyFiltersBtn.addEventListener("click", () => this.applyFilters());

    // Pagination
    this.prevPageBtn.addEventListener("click", () => this.previousPage());
    this.nextPageBtn.addEventListener("click", () => this.nextPage());
    this.pageSizeSelect.addEventListener("change", () => this.changePageSize());

    // Setup modal events
    this.setupModalEventListeners();

    // Add employee button
    this.addEmployeeBtn.addEventListener("click", () => this.addEmployee());

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) =>
      this.handleKeyboardShortcuts(e)
    );

    // Window events
    window.addEventListener(
      "resize",
      DOMUtils.debounce(() => this.handleResize(), 250)
    );
  }

  /**
   * Setup modal event listeners
   */
  setupModalEventListeners() {
    // Ensure modal elements are properly initialized
    this.initializeModalElements();

    // Remove any existing listeners to prevent duplicates
    const existingListeners = this._modalListeners || [];
    existingListeners.forEach((listener) => {
      document.removeEventListener("click", listener);
    });

    // Remove any existing direct event listeners
    if (this.closeDeleteModalBtn) {
      this.closeDeleteModalBtn.removeEventListener(
        "click",
        this._closeModalHandler
      );
      this.closeDeleteModalBtn.removeEventListener(
        "click",
        this._closeModalHandler2
      );
    }
    if (this.cancelDeleteBtn) {
      this.cancelDeleteBtn.removeEventListener(
        "click",
        this._cancelModalHandler
      );
    }
    if (this.confirmDeleteBtn) {
      this.confirmDeleteBtn.removeEventListener(
        "click",
        this._confirmModalHandler
      );
    }

    // Create new event listener for modal interactions
    const modalListener = (e) => {
      // Handle modal overlay click
      if (e.target.id === "modalOverlay") {
        this.closeDeleteModal();
        return;
      }

      // Handle close button click (including SVG elements inside the button)
      if (
        e.target.id === "closeDeleteModal" ||
        e.target.closest("#closeDeleteModal")
      ) {
        this.closeDeleteModal();
        return;
      }

      // Handle cancel button click
      if (
        e.target.id === "cancelDeleteBtn" ||
        e.target.closest("#cancelDeleteBtn")
      ) {
        this.closeDeleteModal();
        return;
      }

      // Handle confirm delete button click
      if (
        e.target.id === "confirmDeleteBtn" ||
        e.target.closest("#confirmDeleteBtn")
      ) {
        this.confirmDelete();
        return;
      }
    };

    // Add the new listener
    document.addEventListener("click", modalListener);

    // Store the listener for future cleanup
    this._modalListeners = [modalListener];

    // Create and store direct event listeners as backup
    this._closeModalHandler = () => {
      this.closeDeleteModal();
    };
    this._closeModalHandler2 = (e) => {
      e.stopPropagation();
      this.closeDeleteModal();
    };
    this._cancelModalHandler = () => {
      this.closeDeleteModal();
    };
    this._confirmModalHandler = () => {
      this.confirmDelete();
    };

    // Add direct event listeners as backup
    if (this.closeDeleteModalBtn) {
      this.closeDeleteModalBtn.addEventListener(
        "click",
        this._closeModalHandler
      );
      this.closeDeleteModalBtn.addEventListener(
        "click",
        this._closeModalHandler2,
        true
      );
    }

    if (this.cancelDeleteBtn) {
      this.cancelDeleteBtn.addEventListener("click", this._cancelModalHandler);
    }

    if (this.confirmDeleteBtn) {
      this.confirmDeleteBtn.addEventListener(
        "click",
        this._confirmModalHandler
      );
    }
  }

  /**
   * Initialize modal elements
   */
  initializeModalElements() {
    // Re-initialize modal elements to ensure they're available
    this.modalOverlay = document.getElementById("modalOverlay");
    this.deleteModal = document.getElementById("deleteModal");
    this.closeDeleteModalBtn = document.getElementById("closeDeleteModal");
    this.cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
    this.confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    this.deleteEmployeeName = document.getElementById("deleteEmployeeName");

    // Verify all modal elements exist
    if (!this.modalOverlay || !this.deleteModal) {
      console.error("Modal elements not found");
      return false;
    }
    return true;
  }

  /**
   * Initialize the application
   */
  initializeApp() {
    this.showLoading();

    // Simulate loading time for better UX
    setTimeout(() => {
      this.renderEmployees();
      this.populateFilters();
      this.updatePagination();
      this.hideLoading();

      // Setup employee card events once after initial render
      this.setupEmployeeCardEvents();

      // Initialize modal elements and event listeners
      this.initializeModalElements();
      this.setupModalEventListeners();
    }, 500);
  }

  /**
   * Show loading state
   */
  showLoading() {
    this.isLoading = true;
    DOMUtils.toggleElement(this.loadingState, true);
    DOMUtils.toggleElement(this.employeeGrid, false);
    DOMUtils.toggleElement(this.emptyState, false);
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    this.isLoading = false;
    DOMUtils.toggleElement(this.loadingState, false);
  }

  /**
   * Render employee cards
   */
  renderEmployees() {
    const employees = window.employeeManager.getCurrentPageEmployees();
    const totalEmployees = window.employeeManager.getTotalFilteredEmployees();

    if (totalEmployees === 0) {
      this.showEmptyState();
      return;
    }

    this.hideEmptyState();
    this.renderEmployeeCards(employees);

    // Ensure modal event listeners are still working after re-rendering
    this.setupModalEventListeners();
  }

  /**
   * Render employee cards using client-side template
   */
  renderEmployeeCards(employees) {
    if (employees && employees.length > 0) {
      const html = this.renderFallbackCards(employees);
      this.employeeGrid.innerHTML = html;
      // Event delegation is handled by setupEmployeeCardEvents() called from renderEmployees()
    } else {
      const emptyHtml = this.renderFallbackCards([]);
      this.employeeGrid.innerHTML = emptyHtml;
    }
  }

  /**
   * Process Freemarker-like template
   */
  processTemplate(template, data) {
    // For client-side rendering, we'll use the fallback method directly
    // since Freemarker requires server-side processing
    return this.renderFallbackCards(data.employees || []);
  }

  /**
   * Render fallback cards if template processing fails
   */
  renderFallbackCards(employees) {
    if (!employees || employees.length === 0) {
      return `
                <div class="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                    </svg>
                    <h3>No employees found</h3>
                    <p>Add your first employee to get started</p>
                </div>
            `;
    }

    return employees
      .map(
        (employee) => `
            <div class="employee-card" data-employee-id="${employee.id}">
                <div class="employee-header">
                    <div class="employee-avatar">
                        <span class="avatar-text">${StringUtils.getInitials(
                          employee.firstName,
                          employee.lastName
                        )}</span>
                    </div>
                    <div class="employee-info">
                        <h3 class="employee-name">${employee.firstName} ${
          employee.lastName
        }</h3>
                        <p class="employee-email">${employee.email}</p>
                    </div>
                </div>
                <div class="employee-details">
                    <div class="detail-item">
                        <span class="detail-label">ID:</span>
                        <span class="detail-value">${employee.id}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Department:</span>
                        <span class="detail-value">${employee.department}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Role:</span>
                        <span class="detail-value">${employee.role}</span>
                    </div>
                </div>
                <div class="employee-actions">
                    <button class="btn btn-secondary edit-btn" data-employee-id="${
                      employee.id
                    }">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Edit
                    </button>
                    <button class="btn btn-danger delete-btn" data-employee-id="${
                      employee.id
                    }">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                        </svg>
                        Delete
                    </button>
                </div>
            </div>
        `
      )
      .join("");
  }

  /**
   * Setup event listeners for employee cards using event delegation
   */
  setupEmployeeCardEvents() {
    // Remove any existing employee card event listeners to prevent duplicates
    const existingListeners = this._employeeCardListeners || [];
    existingListeners.forEach((listener) => {
      this.employeeGrid.removeEventListener("click", listener);
    });

    // Create a single event listener for all employee card interactions
    const employeeCardListener = (e) => {
      // Handle edit button clicks
      if (e.target.closest(".edit-btn")) {
        e.stopPropagation();
        const editBtn = e.target.closest(".edit-btn");
        const employeeId = editBtn.getAttribute("data-employee-id");

        if (!employeeId) {
          if (window.notificationManager) {
            window.notificationManager.show(
              "error",
              "Edit Error",
              "Invalid employee data. Please try again."
            );
          } else {
            alert("Invalid employee data. Please try again.");
          }
          return;
        }
        this.editEmployee(employeeId);
      }

      // Handle delete button clicks
      if (e.target.closest(".delete-btn")) {
        e.stopPropagation();
        const deleteBtn = e.target.closest(".delete-btn");
        const employeeId = deleteBtn.getAttribute("data-employee-id");

        if (!employeeId) {
          if (window.notificationManager) {
            window.notificationManager.show(
              "error",
              "Delete Error",
              "Invalid employee data. Please try again."
            );
          } else {
            alert("Invalid employee data. Please try again.");
          }
          return;
        }
        this.deleteEmployee(employeeId);
      }
    };

    // Add the event listener to the employee grid
    this.employeeGrid.addEventListener("click", employeeCardListener);

    // Store the listener for future cleanup
    this._employeeCardListeners = [employeeCardListener];
  }

  /**
   * Show empty state
   */
  showEmptyState() {
    DOMUtils.toggleElement(this.employeeGrid, false);
    DOMUtils.toggleElement(this.emptyState, true);
  }

  /**
   * Hide empty state
   */
  hideEmptyState() {
    DOMUtils.toggleElement(this.emptyState, false);
    DOMUtils.toggleElement(this.employeeGrid, true);
  }

  /**
   * Populate filter options
   */
  populateFilters() {
    const departments = window.employeeManager.getUniqueDepartments();
    const roles = window.employeeManager.getUniqueRoles();

    this.renderFilterOptions(this.departmentFilters, departments, "department");
    this.renderFilterOptions(this.roleFilters, roles, "role");
  }

  /**
   * Render filter options
   */
  renderFilterOptions(container, options, filterType) {
    container.innerHTML = "";

    options.forEach((option) => {
      const filterOption = document.createElement("div");
      filterOption.className = "filter-option";
      filterOption.innerHTML = `
                <input type="checkbox" id="${filterType}_${option.replace(
        /\s+/g,
        "_"
      )}" value="${option}">
                <label for="${filterType}_${option.replace(
        /\s+/g,
        "_"
      )}">${option}</label>
            `;
      container.appendChild(filterOption);
    });
  }

  /**
   * Handle search input
   */
  handleSearch() {
    const searchTerm = this.searchInput.value;
    window.employeeManager.setSearchFilter(searchTerm);
    this.renderEmployees();
    this.updatePagination();
  }

  /**
   * Handle sorting
   */
  handleSort() {
    const sortBy = this.sortSelect.value;
    if (sortBy) {
      window.employeeManager.setSorting(sortBy, "asc");
    } else {
      window.employeeManager.setSorting("", "asc");
    }
    this.renderEmployees();
    this.updatePagination();
  }

  /**
   * Toggle filter sidebar
   */
  toggleFilterSidebar() {
    this.filterSidebarOpen = !this.filterSidebarOpen;
    DOMUtils.toggleClass(this.filterSidebar, "active", this.filterSidebarOpen);
  }

  /**
   * Close filter sidebar
   */
  closeFilterSidebar() {
    this.filterSidebarOpen = false;
    DOMUtils.toggleClass(this.filterSidebar, "active", false);
  }

  /**
   * Clear all filters
   */
  clearFilters() {
    // Uncheck all checkboxes
    const checkboxes = this.filterSidebar.querySelectorAll(
      'input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });

    // Clear search
    this.searchInput.value = "";

    // Reset sort
    this.sortSelect.value = "";

    // Apply cleared filters
    window.employeeManager.clearFilters();
    this.renderEmployees();
    this.updatePagination();
    this.closeFilterSidebar();
  }

  /**
   * Apply filters
   */
  applyFilters() {
    const selectedDepartments = this.getSelectedFilterValues("department");
    const selectedRoles = this.getSelectedFilterValues("role");

    window.employeeManager.setDepartmentFilter(selectedDepartments);
    window.employeeManager.setRoleFilter(selectedRoles);

    this.renderEmployees();
    this.updatePagination();
    this.closeFilterSidebar();
  }

  /**
   * Get selected filter values
   */
  getSelectedFilterValues(filterType) {
    const checkboxes = this.filterSidebar.querySelectorAll(
      `input[type="checkbox"][value]`
    );
    const selected = [];

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        selected.push(checkbox.value);
      }
    });

    return selected;
  }

  /**
   * Update pagination display
   */
  updatePagination() {
    const paginationInfo = window.employeeManager.getPaginationInfo();

    // Update pagination info
    this.paginationInfo.textContent = `Showing ${paginationInfo.startItem}-${paginationInfo.endItem} of ${paginationInfo.totalItems} employees`;

    // Update page info
    this.pageInfo.textContent = `Page ${paginationInfo.currentPage} of ${paginationInfo.totalPages}`;

    // Update navigation buttons
    this.prevPageBtn.disabled = !paginationInfo.hasPreviousPage;
    this.nextPageBtn.disabled = !paginationInfo.hasNextPage;

    // Update page size selector
    this.pageSizeSelect.value = window.employeeManager.getPageSize();
  }

  /**
   * Change page size
   */
  changePageSize() {
    const newPageSize = this.pageSizeSelect.value;
    window.employeeManager.setPageSize(newPageSize);
    this.renderEmployees();
    this.updatePagination();
  }

  /**
   * Go to previous page
   */
  previousPage() {
    if (window.employeeManager.previousPage()) {
      this.renderEmployees();
      this.updatePagination();
    }
  }

  /**
   * Go to next page
   */
  nextPage() {
    if (window.employeeManager.nextPage()) {
      this.renderEmployees();
      this.updatePagination();
    }
  }

  /**
   * Add new employee
   */
  addEmployee() {
    window.location.href = "add-edit.html";
  }

  /**
   * Edit employee
   */
  editEmployee(employeeId) {
    if (!employeeId) {
      if (window.notificationManager) {
        window.notificationManager.show(
          "error",
          "Edit Error",
          "No employee selected for editing. Please try again."
        );
      } else {
        alert("No employee selected for editing. Please try again.");
      }
      return;
    }

    const employee = window.employeeManager.getEmployeeById(employeeId);
    if (employee) {
      window.location.href = `add-edit.html?id=${employeeId}`;
    } else {
      if (window.notificationManager) {
        window.notificationManager.show(
          "error",
          "Employee Not Found",
          "The employee you are trying to edit could not be found."
        );
      } else {
        alert("The employee you are trying to edit could not be found.");
      }
    }
  }

  /**
   * Delete employee
   */
  deleteEmployee(employeeId) {
    // Prevent duplicate delete operations
    if (this.isDeleting) {
      return;
    }

    if (!employeeId) {
      if (window.notificationManager) {
        window.notificationManager.show(
          "error",
          "Delete Error",
          "No employee selected for deletion. Please try again."
        );
      } else {
        alert("No employee selected for deletion. Please try again.");
      }
      return;
    }

    const employee = window.employeeManager.getEmployeeById(employeeId);
    if (employee) {
      this.currentEmployeeToDelete = employee;

      // Ensure modal elements are properly initialized
      this.initializeModalElements();

      if (this.deleteEmployeeName) {
        this.deleteEmployeeName.textContent = `${employee.firstName} ${employee.lastName}`;
      }

      // Set up modal event listeners BEFORE showing the modal
      this.setupModalEventListeners();

      this.showDeleteModal();
    } else {
      if (window.notificationManager) {
        window.notificationManager.show(
          "error",
          "Employee Not Found",
          "The employee you are trying to delete could not be found."
        );
      } else {
        alert("The employee you are trying to delete could not be found.");
      }
    }
  }

  /**
   * Show delete confirmation modal
   */
  showDeleteModal() {
    // Ensure modal elements are properly initialized
    if (!this.initializeModalElements()) {
      console.error("Failed to initialize modal elements");
      return;
    }

    if (this.modalOverlay && this.deleteModal) {
      DOMUtils.toggleClass(this.modalOverlay, "active", true);
      DOMUtils.toggleClass(this.deleteModal, "active", true);

      // Force re-setup of event listeners after modal is visible
      setTimeout(() => {
        this.setupModalEventListeners();
      }, 10);
    } else {
      console.error("Modal elements not found");
    }
  }

  /**
   * Close delete modal
   */
  closeDeleteModal() {
    if (this.modalOverlay && this.deleteModal) {
      DOMUtils.toggleClass(this.modalOverlay, "active", false);
      DOMUtils.toggleClass(this.deleteModal, "active", false);
    }

    // Re-enable the confirm button if it was disabled
    const confirmBtn = document.getElementById("confirmDeleteBtn");
    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.textContent = "Delete Employee";
    }

    // Clear the employee name from the modal
    const deleteEmployeeName = document.getElementById("deleteEmployeeName");
    if (deleteEmployeeName) {
      deleteEmployeeName.textContent = "";
    }

    // Clean up modal state and event listeners
    this.cleanupModal();
  }

  /**
   * Confirm employee deletion
   */
  confirmDelete() {
    // Prevent duplicate delete operations
    if (this.isDeleting) {
      return;
    }

    if (!this.currentEmployeeToDelete) {
      if (window.notificationManager) {
        window.notificationManager.show(
          "error",
          "Delete Error",
          "No employee selected for deletion."
        );
      } else {
        alert("No employee selected for deletion.");
      }
      this.closeDeleteModal();
      return;
    }

    this.isDeleting = true;

    try {
      // Disable the confirm button to prevent double-clicks
      const confirmBtn = document.getElementById("confirmDeleteBtn");
      if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.textContent = "Deleting...";
      }

      const deletedEmployee = window.employeeManager.deleteEmployee(
        this.currentEmployeeToDelete.id
      );

      if (deletedEmployee) {
        // Success - update the UI
        this.renderEmployees();
        this.updatePagination();
        this.closeDeleteModal();

        // Show success notification
        if (window.notificationManager) {
          window.notificationManager.show(
            "success",
            "Employee Deleted",
            `${deletedEmployee.firstName} ${deletedEmployee.lastName} has been successfully removed.`
          );
        }

        // Re-setup modal event listeners after successful deletion
        setTimeout(() => {
          this.setupModalEventListeners();
        }, 100);
      } else {
        // Delete failed
        if (window.notificationManager) {
          window.notificationManager.show(
            "error",
            "Delete Failed",
            "Failed to delete employee. Please try again."
          );
        } else {
          alert("Failed to delete employee. Please try again.");
        }
        // Close modal even on failure to reset state
        this.closeDeleteModal();
      }
    } catch (error) {
      console.error("Delete error:", error);

      // Show error notification
      if (window.notificationManager) {
        window.notificationManager.show(
          "error",
          "Delete Error",
          "An error occurred while deleting the employee. Please try again."
        );
      } else {
        alert(
          "An error occurred while deleting the employee. Please try again."
        );
      }
    } finally {
      // Reset the deleting flag
      this.isDeleting = false;

      // Re-enable the confirm button
      const confirmBtn = document.getElementById("confirmDeleteBtn");
      if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.textContent = "Delete Employee";
      }

      // Ensure modal is properly cleaned up
      this.cleanupModal();
    }
  }

  /**
   * Handle keyboard shortcuts
   */
  handleKeyboardShortcuts(e) {
    // Escape key to close modals and sidebar
    if (e.key === "Escape") {
      if (this.filterSidebarOpen) {
        this.closeFilterSidebar();
      }
      if (this.currentEmployeeToDelete) {
        this.closeDeleteModal();
      }
    }

    // Ctrl/Cmd + N to add new employee
    if ((e.ctrlKey || e.metaKey) && e.key === "n") {
      e.preventDefault();
      this.addEmployee();
    }

    // Ctrl/Cmd + F to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === "f") {
      e.preventDefault();
      this.searchInput.focus();
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Close filter sidebar on mobile when screen gets larger
    if (window.innerWidth > 768 && this.filterSidebarOpen) {
      this.closeFilterSidebar();
    }
  }

  /**
   * Clean up modal state and event listeners
   */
  cleanupModal() {
    // Reset modal state
    this.currentEmployeeToDelete = null;
    this.isDeleting = false;

    // Remove any existing modal event listeners
    const existingListeners = this._modalListeners || [];
    existingListeners.forEach((listener) => {
      document.removeEventListener("click", listener);
    });
    this._modalListeners = [];

    // Remove direct event listeners
    if (this.closeDeleteModalBtn) {
      this.closeDeleteModalBtn.removeEventListener(
        "click",
        this._closeModalHandler
      );
      this.closeDeleteModalBtn.removeEventListener(
        "click",
        this._closeModalHandler2
      );
    }
    if (this.cancelDeleteBtn) {
      this.cancelDeleteBtn.removeEventListener(
        "click",
        this._cancelModalHandler
      );
    }
    if (this.confirmDeleteBtn) {
      this.confirmDeleteBtn.removeEventListener(
        "click",
        this._confirmModalHandler
      );
    }

    // Re-setup modal event listeners
    setTimeout(() => {
      this.setupModalEventListeners();
    }, 50);
  }

  /**
   * Refresh the application
   */
  refresh() {
    this.showLoading();
    setTimeout(() => {
      this.renderEmployees();
      this.updatePagination();
      this.hideLoading();
    }, 300);
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("employeeGrid")) {
    window.app = new EmployeeDirectoryApp();
  }
});
