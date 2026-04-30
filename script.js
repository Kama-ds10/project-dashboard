// 1. DATA STRUCTURE - single source of truth
let projects = [];
let currentFilter = 'All'; // Track active filter

// DOM elements
const form = document.getElementById('projectForm');
const tableBody = document.getElementById('tableBody');
const filterButtons = document.querySelectorAll('.filter-btn');

// 2. ADD PROJECT
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('projectName').value.trim();
    const url = document.getElementById('projectUrl').value.trim();
    const status = document.getElementById('projectStatus').value;
    
    // Create new project object
    const newProject = {
        id: Date.now(), // Unique ID using timestamp
        name: name,
        url: url,
        status: status,
        createdAt: new Date()
    };
    
    projects.push(newProject); // Add to array
    form.reset(); // Clear form
    renderTable(); // Re-render
});

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


// HELPER FUNCTIONS
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

// 3. RENDER TABLE - VERY IMPORTANT
function renderTable() {
    // Filter projects first based on currentFilter
    let filteredProjects = projects;
    if (currentFilter !== 'All') {
        filteredProjects = projects.filter(p => p.status === currentFilter);
    }
    
    // If no projects, show empty state
    if (filteredProjects.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No projects found</td></tr>`;
        return;
    }
    
    // Use .map() to build HTML string for each project
    tableBody.innerHTML = filteredProjects.map(project => `
        <tr>
            <td>${escapeHtml(project.name)}</td>
            <td><a href="${escapeHtml(project.url)}" target="_blank">Visit</a></td>
            <td><span class="status status-${project.status}">${project.status}</span></td>
            <td>${formatDate(project.createdAt)}</td>
            <td>

            
                <button class="action-btn toggle-btn" onclick="toggleStatus(${project.id})">
                    Toggle
                </button>
                <button class="action-btn edit-btn" onclick="editProject(${project.id})">
                    Edit
                </button>
                <button class="action-btn delete-btn" onclick="deleteProject(${project.id})">
                    Delete
                </button>
            </td>
        </tr>
    `).join(''); // Join array into one string
}

// 4. DELETE PROJECT
function deleteProject(id) {
    // Filter out the project with matching id
    projects = projects.filter(project => project.id !== id);
    renderTable(); // Re-render
}

// 5. TOGGLE STATUS: Pending → Active → Completed → Pending
function toggleStatus(id) {
    const statusCycle = {
        'Pending': 'Active',
        'Active': 'Completed',
        'Completed': 'Pending'
    };
    
    // Find project and update status
    projects = projects.map(project => {
        if (project.id === id) {
            return { ...project, status: statusCycle[project.status] };
        }
        return project;
    });
    renderTable();
}

// 6. EDIT PROJECT - using prompt for simplicity
function editProject(id) {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    
    const newName = prompt('Edit project name:', project.name);
    if (newName === null) return; // User cancelled
    
    const newUrl = prompt('Edit project URL:', project.url);
    if (newUrl === null) return;
    
    // Update the project
    projects = projects.map(p => {
        if (p.id === id) {
            return { ...p, name: newName.trim(), url: newUrl.trim() };
        }
        return p;
    });
    renderTable();
}

// 7. FILTER PROJECTS
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button style
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Set filter and re-render
        currentFilter = btn.dataset.filter;
        renderTable();
    });
});





// Initial render
renderTable();