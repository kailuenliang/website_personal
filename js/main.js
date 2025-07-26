document.addEventListener('DOMContentLoaded', () => {
    // Load section content
    const loadSectionContent = async (sectionId) => {
        try {
            const url = `components/sections/${sectionId}.html`;
            console.log('Fetching:', url);
            const response = await fetch(url);
            console.log('Fetch status for', sectionId, response.status);
            if (!response.ok) throw new Error('Failed to load section content');
            const content = await response.text();
            console.log('Loaded content for', sectionId, content.slice(0, 100)); // log first 100 chars
            const section = document.getElementById(sectionId);
            if (section) {
                let contentDiv;
                if (sectionId === 'work') {
                    contentDiv = section.querySelector('.work-grid');
                } else if (sectionId === 'about') {
                    contentDiv = section.querySelector('.about-content');
                } else if (sectionId === 'teaching') {
                    contentDiv = section.querySelector('.teaching-content');
                } else if (sectionId === 'writing') {
                    contentDiv = section.querySelector('.writing-grid');
                } else if (sectionId === 'code') {
                    contentDiv = section.querySelector('.code-grid');
                } else if (sectionId === 'contact') {
                    contentDiv = section.querySelector('.contact-content');
                } else {
                    contentDiv = section.querySelector('.container > div');
                }
                if (contentDiv) {
                    contentDiv.innerHTML = content;
                    console.log('Injected content into', contentDiv);
                } else {
                    console.warn('No contentDiv found for', sectionId);
                }
            } else {
                console.warn('No section found for', sectionId);
            }
        } catch (error) {
            console.error(`Error loading section ${sectionId}:`, error);
        }
    };

    // Load all sections
    const sections = ['home', 'about', 'work', 'teaching', 'writing', 'code', 'contact'];
    sections.forEach(sectionId => loadSectionContent(sectionId));

    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.main-nav')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
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
                // Close mobile menu after clicking a link
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });
    });

    // Active navigation link based on scroll position
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        document.querySelectorAll('.section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
            }
        });
    });

    // Work filter functionality (if needed in the future)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-grid > *');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            workItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}); 