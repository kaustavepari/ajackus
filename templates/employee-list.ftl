<#-- Employee List Template for Freemarker -->
<#-- This template demonstrates how the employee list would be rendered in a real Freemarker environment -->

<#if employees?? && employees?size gt 0>
    <#list employees as employee>
        <div class="employee-card" data-employee-id="${employee.id}">
            <div class="employee-header">
                <div class="employee-avatar">
                    <span class="avatar-text">${employee.firstName?substring(0,1)}${employee.lastName?substring(0,1)}</span>
                </div>
                <div class="employee-info">
                    <h3 class="employee-name">${employee.firstName} ${employee.lastName}</h3>
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
                <button class="btn btn-secondary edit-btn" data-employee-id="${employee.id}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit
                </button>
                <button class="btn btn-danger delete-btn" data-employee-id="${employee.id}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                    </svg>
                    Delete
                </button>
            </div>
        </div>
    </#list>
<#else>
    <div class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
        </svg>
        <h3>No employees found</h3>
        <p>Add your first employee to get started</p>
    </div>
</#if>

<#-- Additional Freemarker features that could be used: -->

<#-- Conditional rendering based on user permissions -->
<#if userCanEdit?? && userCanEdit>
    <div class="admin-actions">
        <button class="btn btn-primary">Bulk Actions</button>
    </div>
</#if>

<#-- Loop with index -->
<#list employees as employee>
    <#if employee_index % 2 == 0>
        <div class="employee-card even">
    <#else>
        <div class="employee-card odd">
    </#if>
    <!-- Employee content -->
    </div>
</#list>

<#-- Include other templates -->
<#include "employee-card.ftl">

<#-- Use of Freemarker functions -->
<#function formatDate date>
    <#return date?string("MMM dd, yyyy")>
</#function>

<#-- Macro for reusable components -->
<#macro employeeCard employee>
    <div class="employee-card" data-employee-id="${employee.id}">
        <h3>${employee.firstName} ${employee.lastName}</h3>
        <p>${employee.email}</p>
    </div>
</#macro>

<#-- Using the macro -->
<#list employees as employee>
    <@employeeCard employee=employee />
</#list> 