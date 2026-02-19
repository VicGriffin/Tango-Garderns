// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navbar = document.querySelector('.navbar');
const bookingForm = document.getElementById('booking-form');
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = document.querySelector('.lightbox-close');
const successModal = document.getElementById('success-modal');
const modalClose = document.querySelector('.modal-close');

// Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Gallery Filter
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Gallery Lightbox
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
});

lightboxClose.addEventListener('click', () => {
    lightboxModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
        lightboxModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Menu Category Switch
const menuCategoryBtns = document.querySelectorAll('.menu-category-btn');
const menuCategories = document.querySelectorAll('.menu-category');

menuCategoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and categories
        menuCategoryBtns.forEach(b => b.classList.remove('active'));
        menuCategories.forEach(cat => cat.classList.remove('active'));
        
        // Add active class to clicked button and corresponding category
        btn.classList.add('active');
        const categoryId = btn.getAttribute('data-category');
        const targetCategory = document.getElementById(categoryId);
        if (targetCategory) {
            targetCategory.classList.add('active');
        }
    });
});

// Booking Form Submission
bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(bookingForm);
    const bookingData = {
        eventType: formData.get('event-type'),
        eventDate: formData.get('event-date'),
        guestCount: formData.get('guest-count'),
        fullName: formData.get('full-name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        message: formData.get('message'),
        whatsappConfirm: formData.get('whatsapp-confirm')
    };
    
    // Validate form
    if (!validateBookingForm(bookingData)) {
        return;
    }
    
    // Simulate form submission
    submitBookingForm(bookingData);
});

function validateBookingForm(data) {
    const errors = [];
    
    if (!data.eventType) errors.push('Event type is required');
    if (!data.eventDate) errors.push('Event date is required');
    if (!data.guestCount || data.guestCount < 1) errors.push('Valid guest count is required');
    if (!data.fullName) errors.push('Full name is required');
    if (!data.phone) errors.push('Phone number is required');
    if (!data.email) errors.push('Email is required');
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Validate phone format (Kenya)
    const phoneRegex = /^(\+254|0)?[17]\d{8}$/;
    if (data.phone && !phoneRegex.test(data.phone.replace(/\s/g, ''))) {
        errors.push('Please enter a valid Kenyan phone number');
    }
    
    if (errors.length > 0) {
        showFormErrors(errors);
        return false;
    }
    
    return true;
}

function showFormErrors(errors) {
    // Remove existing error messages
    const existingErrors = document.querySelectorAll('.form-error');
    existingErrors.forEach(error => error.remove());
    
    // Show new error messages
    errors.forEach(error => {
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.textContent = error;
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '14px';
        errorElement.style.marginTop = '5px';
        
        // Find the relevant form field and insert error after it
        let field;
        if (error.toLowerCase().includes('event type')) {
            field = document.getElementById('event-type');
        } else if (error.toLowerCase().includes('date')) {
            field = document.getElementById('event-date');
        } else if (error.toLowerCase().includes('guest')) {
            field = document.getElementById('guest-count');
        } else if (error.toLowerCase().includes('name')) {
            field = document.getElementById('full-name');
        } else if (error.toLowerCase().includes('phone')) {
            field = document.getElementById('phone');
        } else if (error.toLowerCase().includes('email')) {
            field = document.getElementById('email');
        }
        
        if (field) {
            field.parentNode.appendChild(errorElement);
        }
    });
}

function submitBookingForm(data) {
    // Show loading state
    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Clear form
        bookingForm.reset();
        
        // Remove any existing error messages
        const existingErrors = document.querySelectorAll('.form-error');
        existingErrors.forEach(error => error.remove());
        
        // Show success modal
        showSuccessModal();
        
        // Send WhatsApp notification if checked
        if (data.whatsappConfirm) {
            sendWhatsAppNotification(data);
        }
        
        // Log booking data (in production, this would be sent to a server)
        console.log('Booking submitted:', data);
    }, 2000);
}

function showSuccessModal() {
    successModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    successModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

modalClose.addEventListener('click', closeModal);

successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        closeModal();
    }
});

function sendWhatsAppNotification(data) {
    const message = `Hello Tango Gardens! I would like to make a booking:\n\n` +
        `Event Type: ${data.eventType}\n` +
        `Date: ${data.eventDate}\n` +
        `Guests: ${data.guestCount}\n` +
        `Name: ${data.fullName}\n` +
        `Phone: ${data.phone}\n` +
        `Email: ${data.email}\n` +
        `Message: ${data.message || 'N/A'}`;
    
    const whatsappUrl = `https://wa.me/254123456789?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in a new tab after a short delay
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
    }, 1000);
}

// Download Menu PDF
document.getElementById('download-menu').addEventListener('click', (e) => {
    e.preventDefault();
    
    // In a real implementation, this would download an actual PDF
    // For now, we'll show a message
    const link = e.target;
    const originalText = link.innerHTML;
    
    link.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing download...';
    link.style.pointerEvents = 'none';
    
    setTimeout(() => {
        link.innerHTML = originalText;
        link.style.pointerEvents = 'auto';
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.textContent = 'Menu download would start here in production!';
        successMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4caf50;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
            successMsg.remove();
        }, 3000);
    }, 2000);
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll(
        '.highlight-card, .service-card, .gallery-item, .menu-item'
    );
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Set minimum date for booking form to today
const eventDateInput = document.getElementById('event-date');
if (eventDateInput) {
    const today = new Date().toISOString().split('T')[0];
    eventDateInput.min = today;
}

// Phone number formatting
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s/g, '');
        
        // Add +254 prefix if not present
        if (value.length > 0 && !value.startsWith('+254') && !value.startsWith('0')) {
            value = '+254' + value;
        }
        
        // Format the number
        if (value.startsWith('+254')) {
            if (value.length === 8) {
                value = '+254' + value;
            }
        } else if (value.startsWith('0')) {
            if (value.length === 10) {
                value = '+254' + value.substring(1);
            }
        }
        
        e.target.value = value;
    });
}

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add CSS animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
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

// Debounced scroll handler
const debouncedScrollHandler = debounce(() => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Console branding
console.log('%c🌿 Tango Gardens Website', 'color: #2d5016; font-size: 20px; font-weight: bold;');
console.log('%cDesigned with ❤️ in Kenya', 'color: #8fbc8f; font-size: 14px;');
