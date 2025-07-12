/**
 * Utility Functions for Employee Directory
 * Common helper functions used throughout the application
 */

// Notification System
class NotificationManager {
  constructor() {
    this.container = document.getElementById("notificationContainer");
    this.notifications = [];
  }

  /**
   * Show a notification
   * @param {string} type - 'success', 'error', 'warning', 'info'
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {number} duration - Auto-hide duration in ms (default: 5000)
   */
  show(type, title, message, duration = 5000) {
    const notification = this.createNotification(type, title, message);
    this.container.appendChild(notification);
    this.notifications.push(notification);

    // Auto-hide after duration
    if (duration > 0) {
      setTimeout(() => {
        this.hide(notification);
      }, duration);
    }

    return notification;
  }

  /**
   * Create notification element
   */
  createNotification(type, title, message) {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;

    const icon = this.getIcon(type);

    notification.innerHTML = `
            <div class="notification-icon">
                ${icon}
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" aria-label="Close notification">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;

    // Add event listeners
    const closeBtn = notification.querySelector(".notification-close");
    closeBtn.addEventListener("click", () => this.hide(notification));

    return notification;
  }

  /**
   * Get icon for notification type
   */
  getIcon(type) {
    const icons = {
      success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22,4 12,14.01 9,11.01"></polyline>
            </svg>`,
      error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>`,
      warning: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>`,
      info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>`,
    };
    return icons[type] || icons.info;
  }

  /**
   * Hide a specific notification
   */
  hide(notification) {
    if (notification && notification.parentNode) {
      notification.style.animation = "slideOut 0.3s ease forwards";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
        this.notifications = this.notifications.filter(
          (n) => n !== notification
        );
      }, 300);
    }
  }

  /**
   * Hide all notifications
   */
  hideAll() {
    this.notifications.forEach((notification) => this.hide(notification));
  }
}

// Validation Utilities
class ValidationUtils {
  /**
   * Validate email format
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate required field
   */
  static isRequired(value) {
    return value && value.trim().length > 0;
  }

  /**
   * Validate minimum length
   */
  static hasMinLength(value, minLength) {
    return value && value.trim().length >= minLength;
  }

  /**
   * Validate maximum length
   */
  static hasMaxLength(value, maxLength) {
    return value && value.trim().length <= maxLength;
  }

  /**
   * Validate name format (letters, spaces, hyphens, apostrophes)
   */
  static isValidName(name) {
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    return nameRegex.test(name.trim());
  }

  /**
   * Get validation error message
   */
  static getErrorMessage(fieldName, validationType, additionalInfo = "") {
    const messages = {
      required: `${fieldName} is required`,
      email: "Please enter a valid email address",
      minLength: `${fieldName} must be at least ${additionalInfo} characters`,
      maxLength: `${fieldName} must be no more than ${additionalInfo} characters`,
      name: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`,
      select: `Please select a ${fieldName.toLowerCase()}`,
    };
    return messages[validationType] || "Invalid input";
  }
}

// DOM Utilities
class DOMUtils {
  /**
   * Debounce function calls
   */
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Throttle function calls
   */
  static throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  /**
   * Show loading state for an element
   */
  static showLoading(element, text = "Loading...") {
    if (element) {
      element.disabled = true;
      const originalText = element.textContent;
      element.dataset.originalText = originalText;
      element.innerHTML = `
                <div class="btn-loading">
                    <div class="spinner-small"></div>
                    <span>${text}</span>
                </div>
            `;
    }
  }

  /**
   * Hide loading state for an element
   */
  static hideLoading(element) {
    if (element) {
      element.disabled = false;
      const originalText = element.dataset.originalText;
      if (originalText) {
        element.textContent = originalText;
        delete element.dataset.originalText;
      }
    }
  }

  /**
   * Toggle element visibility
   */
  static toggleElement(element, show) {
    if (element) {
      element.style.display = show ? "" : "none";
    }
  }

  /**
   * Add/remove CSS class with transition
   */
  static toggleClass(element, className, add) {
    if (element) {
      if (add) {
        element.classList.add(className);
      } else {
        element.classList.remove(className);
      }
    }
  }

  /**
   * Create element with attributes
   */
  static createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);

    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === "textContent") {
        element.textContent = value;
      } else if (key === "innerHTML") {
        element.innerHTML = value;
      } else {
        element.setAttribute(key, value);
      }
    });

    // Add children
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });

    return element;
  }

  /**
   * Remove all children from element
   */
  static clearElement(element) {
    if (element) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
  }

  /**
   * Check if element is in viewport
   */
  static isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  /**
   * Scroll element into view smoothly
   */
  static scrollIntoView(element, options = {}) {
    const defaultOptions = {
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    };
    element.scrollIntoView({ ...defaultOptions, ...options });
  }
}

// Storage Utilities
class StorageUtils {
  static STORAGE_KEY = "employee_directory_data";

  /**
   * Save data to localStorage
   */
  static saveData(data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
      return false;
    }
  }

  /**
   * Load data from localStorage
   */
  static loadData() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      return null;
    }
  }

  /**
   * Clear all stored data
   */
  static clearData() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error("Error clearing localStorage:", error);
      return false;
    }
  }

  /**
   * Check if localStorage is available
   */
  static isAvailable() {
    try {
      const test = "test";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Date and Time Utilities
class DateTimeUtils {
  /**
   * Format date for display
   */
  static formatDate(date) {
    if (!date) return "";

    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  /**
   * Format time for display
   */
  static formatTime(date) {
    if (!date) return "";

    const d = new Date(date);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /**
   * Get relative time (e.g., "2 hours ago")
   */
  static getRelativeTime(date) {
    if (!date) return "";

    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return this.formatDate(date);
  }
}

// String Utilities
class StringUtils {
  /**
   * Capitalize first letter of each word
   */
  static capitalizeWords(str) {
    if (!str) return "";
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  /**
   * Truncate string with ellipsis
   */
  static truncate(str, length) {
    if (!str || str.length <= length) return str;
    return str.substring(0, length) + "...";
  }

  /**
   * Generate initials from name
   */
  static getInitials(firstName, lastName) {
    const first = firstName ? firstName.charAt(0).toUpperCase() : "";
    const last = lastName ? lastName.charAt(0).toUpperCase() : "";
    return first + last;
  }

  /**
   * Sanitize string for safe HTML insertion
   */
  static sanitize(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
}

// Export utilities for use in other modules
window.NotificationManager = NotificationManager;
window.ValidationUtils = ValidationUtils;
window.DOMUtils = DOMUtils;
window.StorageUtils = StorageUtils;
window.DateTimeUtils = DateTimeUtils;
window.StringUtils = StringUtils;

// Initialize global notification manager
window.notificationManager = new NotificationManager();
