document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('ticketForm');
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('avatar');
    
    // Form validation and submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        clearErrors();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Generate and display ticket
        await generateTicket();
    });
    
    // Drag and drop functionality
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        handleFile(file);
    });

    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleFile(file);
    });

    // Add keyboard navigation for upload area
    uploadArea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInput.click();
        }
    });

    function handleFile(file) {
        if (file) {
            const maxSize = 500 * 1024;
            const allowedTypes = ['image/jpeg', 'image/png'];

            if (file.size > maxSize) {
                showError(fileInput, 'File size must be less than 500KB');
                fileInput.value = '';
                announceError('File size must be less than 500KB');
                return;
            }

            if (!allowedTypes.includes(file.type)) {
                showError(fileInput, 'Only JPG and PNG files are allowed');
                fileInput.value = '';
                announceError('Only JPG and PNG files are allowed');
                return;
            }

            // Show preview
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadArea.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 8px;">`;
                announceSuccess('Image uploaded successfully');
            };
            reader.readAsDataURL(file);
        }
    }
    
    function validateForm() {
        let isValid = true;
        
        // Name validation
        const name = document.getElementById('name');
        if (!name.value.trim()) {
            showError(name, 'Name is required');
            isValid = false;
        }
        
        // Email validation
        const email = document.getElementById('email');
        if (!email.value.trim()) {
            showError(email, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }
        
        // GitHub username validation
        const github = document.getElementById('github');
        if (!github.value.trim()) {
            showError(github, 'GitHub username is required');
            isValid = false;
        }
        
        // Avatar validation
        if (!fileInput.files.length) {
            showError(fileInput, 'Please upload a profile picture');
            isValid = false;
        }
        
        return isValid;
    }
    
    function showError(element, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        
        // Add error icon
        const errorIcon = document.createElement('img');
        errorIcon.src = './assets/images/icon-error.svg';
        errorIcon.alt = '';
        errorIcon.className = 'error-icon';
        errorDiv.appendChild(errorIcon);
        
        // Add error message
        const errorText = document.createElement('span');
        errorText.textContent = message;
        errorDiv.appendChild(errorText);
        
        // Add error to DOM
        element.parentNode.appendChild(errorDiv);
        element.setAttribute('aria-invalid', 'true');
        
        // Remove error after 3 seconds
        setTimeout(() => {
            errorDiv.remove();
            element.removeAttribute('aria-invalid');
        }, 3000);
    }
    
    function clearErrors() {
        const errors = document.querySelectorAll('.error');
        errors.forEach(error => error.remove());
        
        const invalidInputs = document.querySelectorAll('[aria-invalid]');
        invalidInputs.forEach(input => input.removeAttribute('aria-invalid'));
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // Add screen reader announcements
    function announceError(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'alert');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 3000);
    }

    function announceSuccess(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 3000);
    }
    
    // Update generate ticket function with loading state
    async function generateTicket() {
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        try {
            const form = document.getElementById('ticketForm');
            const ticketContainer = document.getElementById('ticketContainer');
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const github = document.getElementById('github').value;
            const avatarFile = document.getElementById('avatar').files[0];
            
            // Simulate some processing time
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Generate ticket number
            const ticketNumber = Math.floor(100000 + Math.random() * 900000);
            
            // Update ticket content
            document.querySelector('.ticket-name').textContent = name;
            document.querySelector('.email-address').textContent = email;
            document.querySelector('.attendee-name').textContent = name;
            document.querySelector('.attendee-github').textContent = github;
            document.querySelector('.ticket-number').textContent = `#${ticketNumber}`;
            
            // Set avatar
            const avatarUrl = URL.createObjectURL(avatarFile);
            document.querySelector('.attendee-avatar').src = avatarUrl;
            
            // Hide form and show ticket
            form.hidden = true;
            ticketContainer.hidden = false;
            
            // Scroll to ticket
            ticketContainer.scrollIntoView({ behavior: 'smooth' });
            
            // Announce ticket generation to screen readers
            announceSuccess('Your ticket has been generated successfully');
        } catch (error) {
            announceError('There was an error generating your ticket');
            console.error('Ticket generation error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    }

    // Add CSS for screen reader only text
    const style = document.createElement('style');
    style.textContent = `
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
    `;
    document.head.appendChild(style);
}); 