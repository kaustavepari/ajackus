/**
 * Employee Data Management
 * Handles all employee data operations including CRUD, filtering, sorting, and pagination
 */

class EmployeeManager {
  constructor() {
    this.employees = [];
    this.filteredEmployees = [];
    this.currentPage = 1;
    this.pageSize = 10;
    this.filters = {
      search: "",
      departments: [],
      roles: [],
    };
    this.sortBy = "";
    this.sortDirection = "asc";

    this.loadEmployees();
  }

  /**
   * Load employees from localStorage or create sample data
   */
  loadEmployees() {
    const savedData = StorageUtils.loadData();
    if (savedData && savedData.employees) {
      this.employees = savedData.employees;
    } else {
      this.employees = this.generateSampleData();
      this.saveEmployees();
    }
    this.applyFiltersAndSort();
  }

  /**
   * Generate sample employee data
   */
  generateSampleData() {
    const departments = [
      "Engineering",
      "Marketing",
      "Sales",
      "Human Resources",
      "Finance",
      "Operations",
      "Product",
      "Design",
      "Customer Support",
      "Legal",
    ];

    const roles = [
      "Manager",
      "Senior",
      "Mid-level",
      "Junior",
      "Intern",
      "Director",
      "VP",
      "C-Level",
      "Lead",
      "Specialist",
    ];

    const sampleNames = [
      {
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@company.com",
      },
      {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@company.com",
      },
      {
        firstName: "Michael",
        lastName: "Davis",
        email: "michael.davis@company.com",
      },
      {
        firstName: "Emily",
        lastName: "Wilson",
        email: "emily.wilson@company.com",
      },
      {
        firstName: "David",
        lastName: "Brown",
        email: "david.brown@company.com",
      },
      {
        firstName: "Lisa",
        lastName: "Garcia",
        email: "lisa.garcia@company.com",
      },
      {
        firstName: "James",
        lastName: "Miller",
        email: "james.miller@company.com",
      },
      {
        firstName: "Jennifer",
        lastName: "Taylor",
        email: "jennifer.taylor@company.com",
      },
      {
        firstName: "Robert",
        lastName: "Anderson",
        email: "robert.anderson@company.com",
      },
      {
        firstName: "Amanda",
        lastName: "Thomas",
        email: "amanda.thomas@company.com",
      },
      {
        firstName: "Christopher",
        lastName: "Jackson",
        email: "christopher.jackson@company.com",
      },
      {
        firstName: "Michelle",
        lastName: "White",
        email: "michelle.white@company.com",
      },
      {
        firstName: "Daniel",
        lastName: "Harris",
        email: "daniel.harris@company.com",
      },
      {
        firstName: "Jessica",
        lastName: "Martin",
        email: "jessica.martin@company.com",
      },
      {
        firstName: "Matthew",
        lastName: "Thompson",
        email: "matthew.thompson@company.com",
      },
      {
        firstName: "Olivia",
        lastName: "King",
        email: "olivia.king@company.com",
      },
      {
        firstName: "William",
        lastName: "Scott",
        email: "william.scott@company.com",
      },
      {
        firstName: "Sophia",
        lastName: "Green",
        email: "sophia.green@company.com",
      },
      {
        firstName: "Benjamin",
        lastName: "Hall",
        email: "benjamin.hall@company.com",
      },
      {
        firstName: "Ava",
        lastName: "Young",
        email: "ava.young@company.com",
      },
      {
        firstName: "Elijah",
        lastName: "Wright",
        email: "elijah.wright@company.com",
      },
      {
        firstName: "Mia",
        lastName: "Lopez",
        email: "mia.lopez@company.com",
      },
      {
        firstName: "Logan",
        lastName: "Hill",
        email: "logan.hill@company.com",
      },
      {
        firstName: "Charlotte",
        lastName: "Adams",
        email: "charlotte.adams@company.com",
      },
      {
        firstName: "Lucas",
        lastName: "Baker",
        email: "lucas.baker@company.com",
      },
    ];

    return sampleNames.map((name, index) => ({
      id: index + 1,
      firstName: name.firstName,
      lastName: name.lastName,
      email: name.email,
      department: departments[Math.floor(Math.random() * departments.length)],
      role: roles[Math.floor(Math.random() * roles.length)],
      createdAt: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
      ).toISOString(),
    }));
  }

  /**
   * Save employees to localStorage
   */
  saveEmployees() {
    const data = {
      employees: this.employees,
      lastUpdated: new Date().toISOString(),
    };
    StorageUtils.saveData(data);
  }

  /**
   * Get all employees
   */
  getAllEmployees() {
    return this.employees;
  }

  /**
   * Get filtered and paginated employees
   */
  getFilteredEmployees() {
    return this.filteredEmployees;
  }

  /**
   * Get paginated employees for current page
   */
  getCurrentPageEmployees() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredEmployees.slice(startIndex, endIndex);
  }

  /**
   * Get total number of employees
   */
  getTotalEmployees() {
    return this.employees.length;
  }

  /**
   * Get total number of filtered employees
   */
  getTotalFilteredEmployees() {
    return this.filteredEmployees.length;
  }

  /**
   * Get total number of pages
   */
  getTotalPages() {
    return Math.ceil(this.filteredEmployees.length / this.pageSize);
  }

  /**
   * Get current page
   */
  getCurrentPage() {
    return this.currentPage;
  }

  /**
   * Get page size
   */
  getPageSize() {
    return this.pageSize;
  }

  /**
   * Set page size
   */
  setPageSize(size) {
    this.pageSize = parseInt(size);
    this.currentPage = 1; // Reset to first page
    this.applyFiltersAndSort();
  }

  /**
   * Go to specific page
   */
  goToPage(page) {
    const totalPages = this.getTotalPages();
    if (page >= 1 && page <= totalPages) {
      this.currentPage = page;
      return true;
    }
    return false;
  }

  /**
   * Go to next page
   */
  nextPage() {
    return this.goToPage(this.currentPage + 1);
  }

  /**
   * Go to previous page
   */
  previousPage() {
    return this.goToPage(this.currentPage - 1);
  }

  /**
   * Set search filter
   */
  setSearchFilter(search) {
    this.filters.search = search.toLowerCase().trim();
    this.currentPage = 1; // Reset to first page
    this.applyFiltersAndSort();
  }

  /**
   * Set department filter
   */
  setDepartmentFilter(departments) {
    this.filters.departments = Array.isArray(departments)
      ? departments
      : [departments];
    this.currentPage = 1; // Reset to first page
    this.applyFiltersAndSort();
  }

  /**
   * Set role filter
   */
  setRoleFilter(roles) {
    this.filters.roles = Array.isArray(roles) ? roles : [roles];
    this.currentPage = 1; // Reset to first page
    this.applyFiltersAndSort();
  }

  /**
   * Clear all filters
   */
  clearFilters() {
    this.filters = {
      search: "",
      departments: [],
      roles: [],
    };
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  /**
   * Set sorting
   */
  setSorting(sortBy, direction = "asc") {
    this.sortBy = sortBy;
    this.sortDirection = direction;
    this.applyFiltersAndSort();
  }

  /**
   * Apply filters and sorting to employees
   */
  applyFiltersAndSort() {
    let filtered = [...this.employees];

    // Apply search filter
    if (this.filters.search) {
      filtered = filtered.filter(
        (employee) =>
          employee.firstName.toLowerCase().includes(this.filters.search) ||
          employee.lastName.toLowerCase().includes(this.filters.search) ||
          employee.email.toLowerCase().includes(this.filters.search)
      );
    }

    // Apply department filter
    if (this.filters.departments.length > 0) {
      filtered = filtered.filter((employee) =>
        this.filters.departments.includes(employee.department)
      );
    }

    // Apply role filter
    if (this.filters.roles.length > 0) {
      filtered = filtered.filter((employee) =>
        this.filters.roles.includes(employee.role)
      );
    }

    // Apply sorting
    if (this.sortBy) {
      filtered.sort((a, b) => {
        let aValue = a[this.sortBy];
        let bValue = b[this.sortBy];

        // Handle string comparison
        if (typeof aValue === "string" && typeof bValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return this.sortDirection === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return this.sortDirection === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    this.filteredEmployees = filtered;
  }

  /**
   * Get unique departments
   */
  getUniqueDepartments() {
    const departments = [
      ...new Set(this.employees.map((emp) => emp.department)),
    ];
    return departments.sort();
  }

  /**
   * Get unique roles
   */
  getUniqueRoles() {
    const roles = [...new Set(this.employees.map((emp) => emp.role))];
    return roles.sort();
  }

  /**
   * Get employee by ID
   */
  getEmployeeById(id) {
    return this.employees.find((emp) => emp.id === parseInt(id));
  }

  /**
   * Add new employee
   */
  addEmployee(employeeData) {
    try {
      if (!employeeData || typeof employeeData !== "object") {
        console.error("Invalid employee data:", employeeData);
        return null;
      }

      const newEmployee = {
        id: this.getNextId(),
        ...employeeData,
        createdAt: new Date().toISOString(),
      };

      this.employees.push(newEmployee);
      this.saveEmployees();
      this.applyFiltersAndSort();

      return newEmployee;
    } catch (error) {
      console.error("Error adding employee:", error);
      return null;
    }
  }

  /**
   * Update employee
   */
  updateEmployee(id, employeeData) {
    try {
      const parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        console.error("Invalid employee ID:", id);
        return null;
      }

      if (!employeeData || typeof employeeData !== "object") {
        console.error("Invalid employee data:", employeeData);
        return null;
      }

      const index = this.employees.findIndex((emp) => emp.id === parsedId);
      if (index !== -1) {
        this.employees[index] = {
          ...this.employees[index],
          ...employeeData,
          updatedAt: new Date().toISOString(),
        };

        this.saveEmployees();
        this.applyFiltersAndSort();

        return this.employees[index];
      } else {
        console.error("Employee not found with ID:", parsedId);
        return null;
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      return null;
    }
  }

  /**
   * Delete employee
   */
  deleteEmployee(id) {
    try {
      const parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        console.error("Invalid employee ID:", id);
        return null;
      }

      const index = this.employees.findIndex((emp) => emp.id === parsedId);
      if (index !== -1) {
        const deletedEmployee = this.employees[index];
        this.employees.splice(index, 1);

        this.saveEmployees();
        this.applyFiltersAndSort();

        return deletedEmployee;
      } else {
        console.error("Employee not found with ID:", parsedId);
        return null;
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      return null;
    }
  }

  /**
   * Get next available ID
   */
  getNextId() {
    if (this.employees.length === 0) {
      return 1;
    }
    return Math.max(...this.employees.map((emp) => emp.id)) + 1;
  }

  /**
   * Check if email is unique
   */
  isEmailUnique(email, excludeId = null) {
    return !this.employees.some(
      (emp) =>
        emp.email.toLowerCase() === email.toLowerCase() && emp.id !== excludeId
    );
  }

  /**
   * Get pagination info
   */
  getPaginationInfo() {
    const total = this.getTotalFilteredEmployees();
    const totalPages = this.getTotalPages();
    const start = total > 0 ? (this.currentPage - 1) * this.pageSize + 1 : 0;
    const end = Math.min(this.currentPage * this.pageSize, total);

    return {
      currentPage: this.currentPage,
      totalPages: totalPages,
      totalItems: total,
      startItem: start,
      endItem: end,
      hasNextPage: this.currentPage < totalPages,
      hasPreviousPage: this.currentPage > 1,
    };
  }

  /**
   * Export employees to JSON
   */
  exportToJSON() {
    return JSON.stringify(this.employees, null, 2);
  }

  /**
   * Import employees from JSON
   */
  importFromJSON(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      if (Array.isArray(data)) {
        this.employees = data;
        this.saveEmployees();
        this.applyFiltersAndSort();
        window.notificationManager.show(
          "success",
          "Data Imported",
          "Employee data has been successfully imported."
        );
        return true;
      }
    } catch (error) {
      window.notificationManager.show(
        "error",
        "Import Failed",
        "Invalid JSON format. Please check your data."
      );
    }
    return false;
  }

  /**
   * Clear all data
   */
  clearAllData() {
    this.employees = [];
    this.saveEmployees();
    this.applyFiltersAndSort();
    window.notificationManager.show(
      "warning",
      "Data Cleared",
      "All employee data has been cleared."
    );
  }

  /**
   * Reset to sample data
   */
  resetToSampleData() {
    this.employees = this.generateSampleData();
    this.saveEmployees();
    this.applyFiltersAndSort();
    window.notificationManager.show(
      "info",
      "Data Reset",
      "Employee directory has been reset to sample data."
    );
  }
}

// Initialize global employee manager
window.employeeManager = new EmployeeManager();
