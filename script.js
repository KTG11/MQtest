/*
 * Javascript for Maths Quest website
 * Implements a simple testimonial carousel and handles contact form submission.
 */

// Testimonial slider
document.addEventListener('DOMContentLoaded', function () {
  const testimonials = document.querySelectorAll('.testimonial');
  let currentIndex = 0;

  // Return early if no testimonials found
  if (!testimonials || testimonials.length === 0) return;

  function showTestimonial(index) {
    testimonials.forEach((testimonial, idx) => {
      testimonial.style.display = idx === index ? 'block' : 'none';
    });
  }

  // Cycle through testimonials every 6 seconds
  setInterval(() => {
    currentIndex = (currentIndex + 1) % testimonials.length;
    showTestimonial(currentIndex);
  }, 6000);

  // Initially show the first testimonial
  showTestimonial(currentIndex);

  // Handle contact form submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // Simple form handling: display a thank you alert
      alert('Thank you for getting in touch! We will respond shortly.');
      contactForm.reset();
    });
  }
});