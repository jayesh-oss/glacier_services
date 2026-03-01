document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.innerHTML = navLinks.classList.contains('active')
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
            }
        });
    });

    // Sticky Navbar on Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.padding = '15px 0';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.8)';
            navbar.style.padding = '20px 0';
        }
    });

    // Smooth Scroll for Safari/Edge
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

    // Form Submission Handling
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const service = document.getElementById('service-type').value;
            const date = document.getElementById('date').value;
            const address = document.getElementById('address').value;

            // Simulation of submission
            const btn = bookingForm.querySelector('button');
            const originalText = btn.innerText;

            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Booking...';
            btn.disabled = true;

            // Create booking object
            const newBooking = {
                id: Date.now(),
                name,
                phone,
                address,
                service,
                date,
                timestamp: new Date().toISOString(),
                status: 'Pending'
            };

            // Save to LocalStorage (Backup)
            const bookings = JSON.parse(localStorage.getItem('glacier_bookings')) || [];
            bookings.push(newBooking);
            localStorage.setItem('glacier_bookings', JSON.stringify(bookings));

            // Send Email via EmailJS
            // NOTE: Replace 'service_1q9qhfa' and 'YOUR_TEMPLATE_ID' with your actual EmailJS IDs
            const templateParams = {
                name: name, // Matches {{name}} in default template
                email: "Phone: " + phone + " | Address: " + address, // Matches {{email}} in default template
                message: `New Service Request: ${service} on ${date}.\nPhone: ${phone}\nAddress: ${address}`
            };

            emailjs.send('service_1q9qhfa', 'template_5sggaql', templateParams)
                .then(function (response) {
                    console.log('SUCCESS!', response.status, response.text);
                    alert(`Thank you, ${name}! Your request has been sent. We will contact you shortly.`);
                    bookingForm.reset();
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, function (error) {
                    console.log('FAILED...', error);
                    alert('Note: Email service not configured yet. Detailed saved locally.');
                    bookingForm.reset();
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                });
        });
    }

    // --- Reviews Logic ---
    const reviewsContainer = document.getElementById('reviewsContainer');
    const reviewForm = document.getElementById('reviewForm');

    // Default reviews to show if local storage is empty
    const defaultReviews = [
        {
            name: "Amit Sharma",
            rating: 5,
            text: "Excellent service! The technician arrived on time and fixed my AC's cooling issue completely. Highly recommended."
        },
        {
            name: "Priya Patel",
            rating: 4,
            text: "Very professional team. They cleaned my refrigerator and replaced the faulty part quickly. Pricing was fair."
        },
        {
            name: "Rahul Desai",
            rating: 5,
            text: "I took their Annual Maintenance Contract. Best decision ever. No more worrying about sudden breakdowns in summer!"
        }
    ];

    // Initialize reviews in local storage if empty
    if (!localStorage.getItem('glacier_reviews')) {
        localStorage.setItem('glacier_reviews', JSON.stringify(defaultReviews));
    }

    // Function to generate stars HTML
    const getStarsHTML = (rating) => {
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                starsHTML += '<i class="fa-solid fa-star"></i>';
            } else {
                starsHTML += '<i class="fa-regular fa-star"></i>';
            }
        }
        return starsHTML;
    };

    // Function to render reviews
    const renderReviews = () => {
        if (!reviewsContainer) return;

        const reviews = JSON.parse(localStorage.getItem('glacier_reviews')) || [];
        reviewsContainer.innerHTML = ''; // Clear current

        reviews.forEach(review => {
            const card = document.createElement('div');
            card.className = 'review-card glass-card';
            card.innerHTML = `
                <div class="review-header">
                    <div class="reviewer-info">
                        <h4>${review.name}</h4>
                        <div class="stars">
                            ${getStarsHTML(review.rating)}
                        </div>
                    </div>
                    <i class="fa-solid fa-quote-right quote-icon"></i>
                </div>
                <p>"${review.text}"</p>
            `;
            reviewsContainer.appendChild(card);
        });
    };

    // Initial render
    renderReviews();

    // Handle new review submission
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('review-name').value;
            const rating = parseInt(document.getElementById('review-rating').value);
            const text = document.getElementById('review-text').value;

            const newReview = { name, rating, text };

            // Save to local storage
            const reviews = JSON.parse(localStorage.getItem('glacier_reviews')) || [];
            reviews.unshift(newReview); // Add to beginning
            localStorage.setItem('glacier_reviews', JSON.stringify(reviews));

            // Re-render if on the same page, otherwise just reset form
            if (reviewsContainer) {
                renderReviews();
            }
            reviewForm.reset();
            alert('Thank you for your feedback! You can view it on the reviews page.');
        });
    }

});
