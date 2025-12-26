// DOM Elements
const countdownLoader = document.getElementById('countdown-loader');
const mainWebsite = document.getElementById('main-website');
const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const progressBar = document.querySelector('.progress-bar');
const heroImageMosaic = document.getElementById('hero-image-mosaic');
const heroImageWhole = document.getElementById('hero-image-whole');
const confettiBtn = document.getElementById('confetti-btn');
const finalConfettiBtn = document.getElementById('final-confetti');
const confettiContainer = document.getElementById('confetti-container');
const musicToggle = document.getElementById('music-toggle');
const birthdayMusic = document.getElementById('birthday-music');
const surpriseBtn = document.getElementById('surprise-btn');
const surpriseContent = document.getElementById('surprise-content');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
const cardSections = document.querySelectorAll('.card-section');

// Set birthday date (next day for countdown demo)
const birthdayDate = new Date(2025, 11, 25, 0, 0, 0);

birthdayDate.setDate(birthdayDate.getDate() + 1);
birthdayDate.setHours(12, 5, 0, 0);

// Variables
let countdownInterval;
let musicPlaying = false;
let mosaicAnimationComplete = false;

// Initialize the website
function initWebsite() {
    // Start countdown
    startCountdown();
    
    // Create hero image mosaic
    createMosaic();
    
    // Initialize event listeners
    setupEventListeners();
    
    // Initialize Intersection Observer for card animations
    setupIntersectionObserver();
}

// Start countdown timer
function startCountdown() {
    updateCountdown();
    
    countdownInterval = setInterval(() => {
        updateCountdown();
    }, 1000);
}

// Update countdown display
function updateCountdown() {
    const now = new Date();
    const timeRemaining = birthdayDate - now;
    
    // If countdown is over
    if (timeRemaining <= 0) {
        clearInterval(countdownInterval);
        completeCountdown();
        return;
    }
    
    // Calculate days, hours, minutes, seconds
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    
    // Update display
    daysElement.textContent = days.toString().padStart(2, '0');
    hoursElement.textContent = hours.toString().padStart(2, '0');
    minutesElement.textContent = minutes.toString().padStart(2, '0');
    secondsElement.textContent = seconds.toString().padStart(2, '0');
    
    // Update progress bar (based on seconds in a day)
    const totalSecondsInDay = 24 * 60 * 60;
    const secondsPassed = (hours * 60 * 60) + (minutes * 60) + seconds;
    const progressPercentage = (secondsPassed / totalSecondsInDay) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

// Countdown complete - transition to main website
function completeCountdown() {
    // Update countdown to zeros
    daysElement.textContent = '00';
    hoursElement.textContent = '00';
    minutesElement.textContent = '00';
    secondsElement.textContent = '00';
    progressBar.style.width = '100%';
    
    // Fade out countdown loader
    setTimeout(() => {
        countdownLoader.style.opacity = '0';
        
        // Show main website after countdown fades
        setTimeout(() => {
            countdownLoader.classList.add('hidden');
            mainWebsite.classList.remove('hidden');
            
            // Start hero image mosaic animation
            animateMosaic();
            
            // Trigger confetti
            createConfetti(150);
            
            // Play birthday music (with user interaction)
            setTimeout(() => {
                if (!musicPlaying) {
                    toggleMusic();
                }
            }, 1000);
        }, 800);
    }, 1000);
}

// Create mosaic pieces for hero image
function createMosaic() {
    // Clear any existing mosaic pieces
    heroImageMosaic.innerHTML = '';
    
    // Create 60 mosaic pieces (10 columns x 6 rows)
    for (let i = 0; i < 60; i++) {
        const piece = document.createElement('div');
        piece.className = 'mosaic-piece';
        
        // Assign random sky blue color variations
        const blueShades = ['#87CEEB', '#B0E2FF', '#6CB4EE', '#7EC8E3', '#9AD4F5'];
        const randomColor = blueShades[Math.floor(Math.random() * blueShades.length)];
        piece.style.backgroundColor = randomColor;
        
        heroImageMosaic.appendChild(piece);
    }
}

// Animate mosaic pieces to reveal whole image
function animateMosaic() {
    if (mosaicAnimationComplete) return;
    
    const mosaicPieces = document.querySelectorAll('.mosaic-piece');
    const totalPieces = mosaicPieces.length;
    
    // Animate each piece with a delay
    mosaicPieces.forEach((piece, index) => {
        // Calculate delay based on position for wave effect
        const row = Math.floor(index / 10);
        const col = index % 10;
        const distanceFromCenter = Math.sqrt(Math.pow(row - 3, 2) + Math.pow(col - 5, 2));
        const delay = distanceFromCenter * 50 + Math.random() * 200;
        
        // Set initial position (scattered)
        const angle = Math.random() * Math.PI * 2;
        const radius = 100 + Math.random() * 300;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        piece.style.transform = `translate(${x}px, ${y}px) rotate(${Math.random() * 360}deg)`;
        piece.style.opacity = '0';
        
        // Animate piece back to its original position
        setTimeout(() => {
            piece.style.transition = 'transform 1s ease, opacity 1s ease';
            piece.style.transform = 'translate(0, 0) rotate(0deg)';
            piece.style.opacity = '1';
            
            // When last piece is animated, show whole image
            if (index === totalPieces - 1) {
                setTimeout(() => {
                    // Hide mosaic pieces
                    mosaicPieces.forEach(p => {
                        p.style.opacity = '0';
                    });
                    
                    // Show whole image
                    setTimeout(() => {
                        heroImageWhole.style.opacity = '1';
                        mosaicAnimationComplete = true;
                    }, 500);
                }, 1000);
            }
        }, delay);
    });
}

// Create confetti animation with food items
function createConfetti(count = 100) {
    // Clear existing confetti
    confettiContainer.innerHTML = '';
    
    // Food items for confetti
    const foodItems = [
        { type: 'popcorn', icon: '🍿', color: '#FFD700', name: 'Popcorn' },
        { type: 'corn', icon: '🌽', color: '#FFA500', name: 'Sweet Corn' },
        { type: 'momos', icon: '🥟', color: '#F5DEB3', name: 'Momos' },
        { type: 'pizza', icon: '🍕', color: '#FF6347', name: 'Pizza' },
        { type: 'burger', icon: '🍔', color: '#8B4513', name: 'Burger' },
        { type: 'cake', icon: '🎂', color: '#FF69B4', name: 'Cake' },
        { type: 'icecream', icon: '🍦', color: '#FFE4E1', name: 'Ice Cream' },
        { type: 'candy', icon: '🍬', color: '#FF1493', name: 'Candy' },
        { type: 'donut', icon: '🍩', color: '#8B7355', name: 'Donut' },
        { type: 'cookie', icon: '🍪', color: '#D2691E', name: 'Cookie' }
    ];
    
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti food-confetti';
        
        // Random food item
        const food = foodItems[Math.floor(Math.random() * foodItems.length)];
        
        // Random properties
        const size = Math.random() * 30 + 20; // 20-50px
        const left = Math.random() * 100;
        const rotation = Math.random() * 360;
        const animationDuration = Math.random() * 3 + 2;
        const animationDelay = Math.random() * 2;
        const fallDistance = 100 + Math.random() * 50; // 100-150vh
        
        // Create food element
        const foodElement = document.createElement('div');
        foodElement.className = `food-item ${food.type}`;
        foodElement.textContent = food.icon;
        foodElement.title = food.name;
        foodElement.style.fontSize = `${size}px`;
        foodElement.style.color = food.color;
        
        // Add some random emoji variations
        if (Math.random() > 0.7) {
            // Add small shadow emoji for some items
            const shadow = document.createElement('span');
            shadow.className = 'food-shadow';
            shadow.textContent = '✨';
            shadow.style.fontSize = `${size * 0.3}px`;
            shadow.style.position = 'absolute';
            shadow.style.top = '50%';
            shadow.style.left = '50%';
            shadow.style.transform = 'translate(-50%, -50%)';
            shadow.style.opacity = '0.7';
            shadow.style.zIndex = '-1';
            foodElement.appendChild(shadow);
        }
        
        confetti.appendChild(foodElement);
        
        // Apply styles
        confetti.style.left = `${left}%`;
        confetti.style.animationDuration = `${animationDuration}s`;
        confetti.style.animationDelay = `${animationDelay}s`;
        confetti.style.setProperty('--fall-distance', `${fallDistance}vh`);
        confetti.style.setProperty('--rotation', `${rotation}deg`);
        
        // Random movement pattern
        const swingAmount = Math.random() * 100 + 50; // 50-150px
        confetti.style.setProperty('--swing', `${swingAmount}px`);
        
        // Random bounciness
        const bounceHeight = Math.random() * 20 + 10; // 10-30px
        confetti.style.setProperty('--bounce', `${bounceHeight}px`);
        
        confettiContainer.appendChild(confetti);
        
        // Remove confetti after animation completes
        setTimeout(() => {
            confetti.remove();
        }, (animationDuration + animationDelay) * 1000);
    }
}

// Toggle background music
function toggleMusic() {
    if (musicPlaying) {
        birthdayMusic.pause();
        musicToggle.innerHTML = '<i class="fas fa-music"></i><span>Music: OFF</span>';
        musicPlaying = false;
    } else {
        // Start music with user interaction (required by browsers)
        birthdayMusic.play().then(() => {
            musicToggle.innerHTML = '<i class="fas fa-music"></i><span>Music: ON</span>';
            musicPlaying = true;
        }).catch(error => {
            console.log("Audio playback failed:", error);
            // If autoplay is blocked, update button to indicate it needs user click
            musicToggle.innerHTML = '<i class="fas fa-music"></i><span>Click to Play</span>';
        });
    }
}

// Setup Intersection Observer for card animations
function setupIntersectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe each card section
    cardSections.forEach(section => {
        observer.observe(section);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Confetti buttons
    confettiBtn.addEventListener('click', () => createConfetti(200));
    finalConfettiBtn.addEventListener('click', () => createConfetti(300));
    
    // Music toggle
    musicToggle.addEventListener('click', toggleMusic);
    
    // Surprise button
    surpriseBtn.addEventListener('click', () => {
        surpriseContent.classList.toggle('hidden');
        if (!surpriseContent.classList.contains('hidden')) {
            createConfetti(100);
        }
    });
    
    // Hamburger menu for mobile
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Animate hamburger to X
        const spans = hamburger.querySelectorAll('span');
        if (navLinks.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const spans = hamburger.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Trigger mosaic animation when hero section is in view
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !mosaicAnimationComplete) {
                setTimeout(() => {
                    animateMosaic();
                }, 500);
            }
        });
    }, { threshold: 0.5 });
    
    heroObserver.observe(document.querySelector('.hero-section'));
    
    // Add click to replay mosaic animation
    heroImageWhole.addEventListener('click', () => {
        if (mosaicAnimationComplete) {
            mosaicAnimationComplete = false;
            heroImageWhole.style.opacity = '0';
            createMosaic();
            
            setTimeout(() => {
                animateMosaic();
            }, 100);
        }
    });
}
// Initialize Owl Carousel when DOM is ready
$(document).ready(function() {
    // Initialize the friends carousel when the section is in view
    initFriendsCarouselObserver();
    
    // Handle image loading errors
    handleImageErrors();
});

// Function to initialize Owl Carousel
function initFriendsCarousel() {
    const carousel = $('#friends-carousel');
    
    if (carousel.length === 0) return;
    
    // Initialize Owl Carousel with configuration
    carousel.owlCarousel({
        loop: true,
        margin: 20,
        nav: false, // We'll use custom navigation
        dots: true,
        autoplay: true,
        autoplayTimeout: 2000, // 2 seconds
        autoplayHoverPause: true,
        autoplaySpeed: 800, // Animation speed
        smartSpeed: 800, // Animation speed when clicking next/prev
        responsive: {
            0: {
                items: 1, // 1 item on mobile
                stagePadding: 10
            },
            576: {
                items: 2, // 2 items on tablets
                stagePadding: 20
            },
            992: {
                items: 3, // 3 items on desktop
                stagePadding: 30
            }
        },
        onInitialized: updateCarouselStatus,
        onChanged: updateCarouselStatus,
        onDragged: updateCarouselStatus
    });
    
    // Set up custom navigation
    setupCarouselNavigation(carousel);
    
    // Set up autoplay controls
    setupAutoplayControls(carousel);
    
    // Update total slides count
    updateTotalSlides(carousel);
}

// Set up custom navigation buttons
function setupCarouselNavigation(carousel) {
    // Previous button
    $('.prev-btn').click(function() {
        carousel.trigger('prev.owl.carousel');
    });
    
    // Next button
    $('.next-btn').click(function() {
        carousel.trigger('next.owl.carousel');
    });
    
    // Keyboard navigation
    $(document).keydown(function(e) {
        if ($('#friends').is(':visible')) {
            if (e.key === 'ArrowLeft') {
                carousel.trigger('prev.owl.carousel');
                e.preventDefault();
            } else if (e.key === 'ArrowRight') {
                carousel.trigger('next.owl.carousel');
                e.preventDefault();
            }
        }
    });
}

// Set up autoplay controls
function setupAutoplayControls(carousel) {
    const toggleBtn = $('#toggle-autoplay');
    let isPlaying = true;
    
    if (toggleBtn.length === 0) return;
    
    // Toggle autoplay on button click
    toggleBtn.click(function() {
        if (isPlaying) {
            carousel.trigger('stop.owl.autoplay');
            toggleBtn.html('<i class="fas fa-play"></i> Play');
            toggleBtn.removeClass('playing').addClass('paused');
            isPlaying = false;
        } else {
            carousel.trigger('play.owl.autoplay', [2000]);
            toggleBtn.html('<i class="fas fa-pause"></i> Pause');
            toggleBtn.removeClass('paused').addClass('playing');
            isPlaying = true;
        }
    });
    
    // Update button state when carousel autoplay changes
    carousel.on('play.owl.autoplay', function() {
        toggleBtn.html('<i class="fas fa-pause"></i> Pause');
        toggleBtn.removeClass('paused').addClass('playing');
        isPlaying = true;
    });
    
    carousel.on('stop.owl.autoplay', function() {
        toggleBtn.html('<i class="fas fa-play"></i> Play');
        toggleBtn.removeClass('playing').addClass('paused');
        isPlaying = false;
    });
}

// Update carousel status (current slide / total slides)
function updateCarouselStatus(event) {
    if (!event || !event.page) return;
    
    const current = event.page.index + 1; // Owl Carousel is 0-indexed
    const total = event.page.count;
    
    $('#current-slide').text(current);
    $('#total-slides').text(total);
}

// Update total slides count
function updateTotalSlides(carousel) {
    const totalItems = carousel.find('.owl-item:not(.cloned)').length;
    $('#total-slides').text(totalItems);
}

// Initialize carousel when the friends section is in view
function initFriendsCarouselObserver() {
    const friendsSection = document.getElementById('friends');
    
    if (!friendsSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Initialize carousel when section comes into view
                if (typeof initFriendsCarousel === 'function') {
                    // Small delay to ensure DOM is ready
                    setTimeout(() => {
                        initFriendsCarousel();
                    }, 100);
                }
                // Unobserve after initialization
                observer.unobserve(friendsSection);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    observer.observe(friendsSection);
}

// Handle image loading errors
function handleImageErrors() {
    $(document).on('error', '.friend-img', function() {
        const $img = $(this);
        const $container = $img.parent();
        const icon = $container.find('.image-overlay i').attr('class');
        
        // Replace with fallback background color
        const fallbackColors = ['#87CEEB', '#B0E2FF', '#6CB4EE', '#7EC8E3', '#9AD4F5', '#AA96DA', '#FCBAD3', '#FFFFD2'];
        const randomColor = fallbackColors[Math.floor(Math.random() * fallbackColors.length)];
        
        $container.html(`
            <div class="fallback-image" style="width: 100%; height: 100%; background-color: ${randomColor}; display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem;">
                <i class="${icon}"></i>
            </div>
        `);
    });
}

// Lazy load images when they come into view
function initImageLazyLoad() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    // Observe all friend images
    document.querySelectorAll('.friend-img').forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize website when DOM is loaded
document.addEventListener('DOMContentLoaded', initWebsite);

