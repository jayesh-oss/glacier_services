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
                email: "Phone: " + phone, // Matches {{email}} in default template
                message: `New Service Request: ${service} on ${date}. Phone: ${phone}`
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
});
