// Route management
const routes = {
    home: document.getElementById("home"),
    features: document.getElementById("features"),
    products: document.getElementById("products"),
    signup: document.getElementById("signup")
};

// Smooth transitions between sections
function switchSection(hideSection, showSection) {
    hideSection.style.opacity = '0';
    hideSection.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        hideSection.classList.add('hidden');
        showSection.classList.remove('hidden');
        
        setTimeout(() => {
            showSection.style.opacity = '1';
            showSection.style.transform = 'translateY(0)';
            
            // Add entrance animation to elements
            const elements = showSection.querySelectorAll('.feature-card, .stat-item, .product-card');
            elements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 50);
    }, 300);
}

// Navigation handlers
document.getElementById("homeBtn").addEventListener("click", () => {
    switchSection(routes.features, routes.home);
    switchSection(routes.products, routes.home);
    switchSection(routes.signup, routes.home);
});

document.getElementById("featuresBtn").addEventListener("click", () => {
    switchSection(routes.home, routes.features);
    switchSection(routes.products, routes.features);
    switchSection(routes.signup, routes.features);
});

document.getElementById("productsBtn").addEventListener("click", () => {
    switchSection(routes.home, routes.products);
    switchSection(routes.features, routes.products);
    switchSection(routes.signup, routes.products);
});

document.getElementById("signupBtn").addEventListener("click", () => {
    switchSection(routes.home, routes.signup);
    switchSection(routes.features, routes.signup);
    switchSection(routes.products, routes.signup);
});

// Form submission handler
document.getElementById("signupForm").addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password')
    };

    // Show success message
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
        submitButton.innerHTML = '<i class="fas fa-check"></i> Account Created!';
        submitButton.style.backgroundColor = '#28a745';
        
        // Reset form after 2 seconds
        setTimeout(() => {
            form.reset();
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
            submitButton.style.backgroundColor = '';
        }, 2000);
    }, 1500);
});

// Product card hover effects
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
    });
});

// Feature item hover effects
document.querySelectorAll('.feature-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'scale(1.05)';
        item.style.backgroundColor = 'rgba(46, 204, 113, 0.1)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'scale(1)';
        item.style.backgroundColor = 'transparent';
    });
});

// Initialize sections with opacity and transform
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '1';
    section.style.transform = 'translateY(0)';
    section.style.transition = 'all 0.5s ease-in-out';
});

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add intersection observer for fade-in animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});
