document.addEventListener('DOMContentLoaded', () => {
    // Create scroll progress bar
    const createProgressBar = () => {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
    };
    
    // Create section indicators
    const createSectionIndicators = () => {
        const sections = document.querySelectorAll('section');
        if (sections.length <= 1) return;
        
        const indicators = document.createElement('div');
        indicators.className = 'section-indicators';
        
        sections.forEach((section, index) => {
            const dot = document.createElement('div');
            dot.className = 'indicator';
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                scrollToSection(section);
            });
            
            indicators.appendChild(dot);
        });
        
        document.body.appendChild(indicators);
    };
    
    // Add section transition classes for animations - Exclude Connect section
    const addTransitionClasses = () => {
        // Add transition classes to elements
        const aiContent = document.querySelector('.ai-content');
        const devicesMockup = document.querySelector('.devices-mockup');
        const testimonialSlider = document.querySelector('.testimonial-slider-container');
        const testimonialText = document.querySelector('.testimonial-text-content');
        // Remove Connect section from animations
        
        // Add section transition class to each element
        if (aiContent) aiContent.classList.add('section-transition');
        if (devicesMockup) devicesMockup.classList.add('section-transition');
        if (testimonialSlider) testimonialSlider.classList.add('section-transition');
        if (testimonialText) testimonialText.classList.add('section-transition');
        // Don't add transition to Connect section
        
        // Add staggered animation classes to containers with multiple elements
        const heroContainer = document.querySelector('.content-container');
        if (heroContainer) heroContainer.classList.add('stagger-children');
        
        // Ensure the first testimonial card is visible
        const firstTestimonial = document.querySelector('.testimonial-card');
        if (firstTestimonial) {
            firstTestimonial.classList.add('active');
        }
    };
    
    // Smooth scroll to section with enhanced animation
    const scrollToSection = (section) => {
        // Get the section's offset with a small buffer for better appearance
        const targetPosition = section.getBoundingClientRect().top + window.pageYOffset - 30;
        
        // Get current scroll position
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        
        // Timing variables
        let startTime = null;
        const duration = 1200; // ms - longer for smoother scrolling
        
        // Easing function (easeOutQuint) - smoother than expo
        const easeOutQuint = (t) => {
            return 1 - Math.pow(1 - t, 5);
        };
        
        // Animation function with improved easing
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = easeOutQuint(progress);
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }
        
        // Start the animation
        requestAnimationFrame(animation);
    };
    
    // Handle scroll events for animation triggers and indicators - Enhanced for performance
    const handleScroll = () => {
        // Use requestAnimationFrame to optimize performance
        if (!window.requestAnimationFrame) return updateOnScroll();
        
        requestAnimationFrame(updateOnScroll);
    };
    
    // Update UI elements on scroll
    const updateOnScroll = () => {
        // Update progress bar
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            progressBar.style.width = `${scrollPercent}%`;
        }
        
        // Update section indicators with smoother tracking
        const sections = Array.from(document.querySelectorAll('section'));
        const indicators = document.querySelectorAll('.indicator');
        
        // Find current visible section with better threshold detection
        let currentSectionIndex = -1;
        
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionHeight = rect.height;
            
            // If at least 25% of the section is in the viewport
            const threshold = Math.min(0.25 * sectionHeight, window.innerHeight * 0.5);
            
            if (sectionTop <= threshold && sectionTop + sectionHeight > threshold) {
                currentSectionIndex = index;
            }
        });
        
        // Update indicators with smooth transitions
        if (currentSectionIndex >= 0) {
            indicators.forEach((indicator, index) => {
                if (index === currentSectionIndex) {
                    if (!indicator.classList.contains('active')) {
                        indicator.classList.add('active');
                    }
                } else {
                    indicator.classList.remove('active');
                }
            });
        }
        
        // Check for elements to animate with enhanced viewport detection
        checkElementsInView();
    };
    
    // Check which elements are in view - Exclude Connect section
    const checkElementsInView = () => {
        const elements = document.querySelectorAll('.section-transition, .stagger-children');
        
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            
            // Skip checking for Connect section elements
            if (element.closest('.final-cta-section')) return;
            
            // Improved viewport calculation
            const viewportHeight = window.innerHeight;
            const elementHeight = rect.height;
            const threshold = Math.min(elementHeight * 0.15, 100);
            
            // Check if element is sufficiently in viewport
            const isInView = (
                (rect.top <= viewportHeight - threshold && rect.bottom >= 0) || 
                (rect.top <= viewportHeight && rect.bottom >= threshold)
            );
            
            if (isInView && !element.classList.contains('in-view')) {
                element.classList.add('in-view');
                
                // Add faster reveal for AI and Awards sections (not Connect)
                const parentSection = element.closest('.ai-automation-section, .awards-section');
                if (parentSection) {
                    element.style.transitionDuration = '0.7s';
                    
                    // Make child elements appear faster too
                    const childElements = element.querySelectorAll('h2, h3, p, a, img');
                    childElements.forEach(child => {
                        child.style.transitionDuration = '0.6s';
                    });
                }
            }
        });
    };
    
    // Set up testimonial slider with faster transitions
    const setupTestimonialSlider = () => {
        const testimonials = document.querySelectorAll('.testimonial-card');
        const prevArrow = document.querySelector('.prev-arrow');
        const nextArrow = document.querySelector('.next-arrow');
        
        // If there's only one testimonial, no need for slider functionality
        if (testimonials.length <= 1) return;
        
        let currentSlide = 0;
        let isAnimating = false;
        
        // Make sure first testimonial is visible
        if (testimonials[0]) testimonials[0].classList.add('active');
        
        // Function to change slides with faster transitions
        const showSlide = (index) => {
            if (isAnimating) return;
            isAnimating = true;
            
            // Faster exit animation
            testimonials[currentSlide].style.transition = 'opacity 0.4s var(--ease-smooth), transform 0.4s var(--ease-smooth)';
            testimonials[currentSlide].style.transform = index > currentSlide ? 
                'translateX(-20px) scale(0.95)' : 
                'translateX(20px) scale(0.95)';
            testimonials[currentSlide].style.opacity = '0';
            
            setTimeout(() => {
                testimonials[currentSlide].classList.remove('active');
                
                // Reset transition and initial state for the incoming slide
                testimonials[index].style.transition = 'none';
                testimonials[index].style.transform = index > currentSlide ? 
                    'translateX(20px) scale(0.95)' : 
                    'translateX(-20px) scale(0.95)';
                testimonials[index].style.opacity = '0';
                
                // Force a reflow before changing properties
                void testimonials[index].offsetWidth;
                
                // Apply entering animation - faster
                testimonials[index].style.transition = 'opacity 0.5s var(--ease-smooth), transform 0.5s var(--ease-smooth)';
                testimonials[index].style.transform = 'translateX(0) scale(1)';
                testimonials[index].style.opacity = '1';
                testimonials[index].classList.add('active');
                
                currentSlide = index;
                
                setTimeout(() => {
                    isAnimating = false;
                }, 500); // Reduced duration
            }, 400); // Reduced duration
        };
        
        // Event listeners for arrows with enhanced feedback
        prevArrow?.addEventListener('click', () => {
            if (isAnimating) return;
            
            // Visual feedback on click
            prevArrow.style.transform = 'translateY(-50%) scale(0.9)';
            setTimeout(() => {
                prevArrow.style.transform = 'translateY(-50%) scale(1.1)';
                setTimeout(() => {
                    prevArrow.style.transform = '';
                }, 200);
            }, 100);
            
            let newIndex = currentSlide - 1;
            if (newIndex < 0) newIndex = testimonials.length - 1;
            showSlide(newIndex);
        });
        
        nextArrow?.addEventListener('click', () => {
            if (isAnimating) return;
            
            // Visual feedback on click
            nextArrow.style.transform = 'translateY(-50%) scale(0.9)';
            setTimeout(() => {
                nextArrow.style.transform = 'translateY(-50%) scale(1.1)';
                setTimeout(() => {
                    nextArrow.style.transform = '';
                }, 200);
            }, 100);
            
            let newIndex = currentSlide + 1;
            if (newIndex >= testimonials.length) newIndex = 0;
            showSlide(newIndex);
        });
        
        // Auto rotation with improved timing
        let autoSlide = setInterval(() => {
            if (!isAnimating) {
                let newIndex = currentSlide + 1;
                if (newIndex >= testimonials.length) newIndex = 0;
                showSlide(newIndex);
            }
        }, 6000); // Slightly longer interval for better reading experience
        
        // Pause on hover
        const sliderContainer = document.querySelector('.testimonial-slider-container');
        sliderContainer?.addEventListener('mouseenter', () => {
            clearInterval(autoSlide);
        });
        
        sliderContainer?.addEventListener('mouseleave', () => {
            autoSlide = setInterval(() => {
                if (!isAnimating) {
                    let newIndex = currentSlide + 1;
                    if (newIndex >= testimonials.length) newIndex = 0;
                    showSlide(newIndex);
                }
            }, 6000);
        });
    };
    
    // Set up smooth scrolling for internal links with enhanced behavior
    const setupSmoothScrolling = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Add visual feedback on click
                this.style.transform = 'translateY(2px)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
                
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    // Custom scroll animation
                    scrollToSection(target);
                    
                    // Update URL without scrolling
                    if (history.pushState) {
                        history.pushState(null, null, targetId);
                    }
                }
            });
        });
    };
    
    // Add parallax effect to background images - Enhanced for smoother movement
    const setupParallaxEffect = () => {
        const parallaxElements = document.querySelectorAll('.awards-bg-image, .connect-bg-image, .section2-bg-image');
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateParallaxPositions();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        function updateParallaxPositions() {
            const scrolled = window.scrollY;
            
            parallaxElements.forEach(element => {
                const parent = element.parentElement;
                const elementPosition = parent.offsetTop;
                const elementHeight = parent.offsetHeight;
                const viewportHeight = window.innerHeight;
                
                // Calculate how much of the element is in view
                const elementInView = (scrolled + viewportHeight) - elementPosition;
                const elementViewRatio = Math.min(Math.max(elementInView / (elementHeight + viewportHeight), 0), 1);
                
                // Only apply if in view with smoother formula
                if (elementInView > 0 && scrolled < elementPosition + elementHeight) {
                    const yPos = (elementViewRatio - 0.5) * 30; // Smoother, more subtle movement
                    
                    // Different effects for different backgrounds
                    if (element.classList.contains('awards-bg-image')) {
                        element.style.transform = `translateX(-40%) translateY(${yPos}px)`;
                    } else if (element.classList.contains('connect-bg-image')) {
                        element.style.transform = `translateX(-40%) translateY(${-yPos}px)`;
                    } else if (element.classList.contains('section2-bg-image')) {
                        element.style.transform = `translateY(${yPos * 0.7}px)`;
                    }
                }
            });
        }
    };
    
    // Ensure cyber logo is properly cropped with animation
    const setupCyberLogo = () => {
        const cyberLogo = document.querySelector('.cyber-logo .logo');
        if (cyberLogo) {
            cyberLogo.style.clipPath = 'inset(0% 0% 35% 0%)';
            
            // Add a subtle pulse animation
            cyberLogo.style.animation = 'pulse 3s infinite alternate ease-in-out';
            
            // Add keyframes for the pulse animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes pulse {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.1); }
                }
            `;
            document.head.appendChild(style);
        }
    };
    
    // Add mouse movement effect to hero section
    const setupMouseMoveEffect = () => {
        const heroSection = document.querySelector('.hero-section');
        const logos = document.querySelectorAll('.logo-container');
        
        if (!heroSection || !logos.length) return;
        
        heroSection.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { width, height, left, top } = heroSection.getBoundingClientRect();
            
            // Calculate mouse position relative to the center of the section
            const xPos = (clientX - left) / width - 0.5;
            const yPos = (clientY - top) / height - 0.5;
            
            // Apply subtle movement to logos based on mouse position
            logos.forEach(logo => {
                const speed = parseFloat(logo.getAttribute('data-speed') || Math.random() * 0.03 + 0.02);
                const xOffset = xPos * 15 * speed;
                const yOffset = yPos * 15 * speed;
                
                logo.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
            });
        });
        
        // Reset positions when mouse leaves
        heroSection.addEventListener('mouseleave', () => {
            logos.forEach(logo => {
                logo.style.transform = '';
            });
        });
    };
    
    // Fix phone mockup content animation - without flash effect
    const enhanceDeviceMockups = () => {
        const devicesMockup = document.querySelector('.devices-mockup');
        const tabletMockup = document.querySelector('.tablet-mockup');
        const phoneMockup = document.querySelector('.phone-mockup');
        const phoneTextH3 = document.querySelector('.phone-text h3');
        const phoneTextP = document.querySelector('.phone-text p');
        
        if (devicesMockup) {
            // Set initial states for mockups
            if (tabletMockup) {
                tabletMockup.style.opacity = '0';
                tabletMockup.style.transform = 'translateY(-200px) translateX(100px) rotate(-15deg) scale(0.8)';
            }
            
            if (phoneMockup) {
                phoneMockup.style.opacity = '0';
                phoneMockup.style.transform = 'translateY(200px) translateX(-100px) rotate(15deg) scale(0.8)';
            }
            
            // Immediately make phone text visible for reliability
            if (phoneTextH3) phoneTextH3.style.opacity = '1';
            if (phoneTextP) phoneTextP.style.opacity = '0.9';
            
            // Add animation when device mockup is in view
            const animateDevices = () => {
                if (devicesMockup.classList.contains('in-view')) {
                    // Animate tablet with dramatic entrance
                    if (tabletMockup) {
                        tabletMockup.style.transition = 'opacity 1s var(--ease-out-expo), transform 1.2s var(--ease-out-back)';
                        tabletMockup.style.opacity = '1';
                        tabletMockup.style.transform = 'translateY(0) translateX(0) rotate(-2deg) scale(1)';
                        
                        setTimeout(() => {
                            tabletMockup.classList.add('animated');
                        }, 1200);
                    }
                    
                    // Animate phone with dramatic entrance
                    if (phoneMockup) {
                        setTimeout(() => {
                            phoneMockup.style.transition = 'opacity 1s var(--ease-out-expo), transform 1.2s var(--ease-out-back)';
                            phoneMockup.style.opacity = '1';
                            phoneMockup.style.transform = 'translateY(0) translateX(0) rotate(2deg) scale(1)';
                            
                            setTimeout(() => {
                                phoneMockup.classList.add('animated');
                            }, 1200);
                        }, 200);
                    }
                    
                    // Simple visibility for phone content - no flash effect
                    if (phoneTextH3 && phoneTextP) {
                        // Ensure text is visible with classes
                        phoneTextH3.classList.add('visible');
                        phoneTextP.classList.add('visible');
                        
                        // Direct style application as backup
                        phoneTextH3.style.opacity = '1';
                        phoneTextH3.style.transform = 'translateY(0)';
                        
                        phoneTextP.style.opacity = '0.9';
                        phoneTextP.style.transform = 'translateY(0)';
                    }
                }
            };
            
            // Call immediately to set initial state
            animateDevices();
            
            // Also observe for changes to the in-view class
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                        animateDevices();
                    }
                });
            });
            
            observer.observe(devicesMockup, { attributes: true });
            
            // Backup: Add a timeout to ensure phone content is visible
            setTimeout(() => {
                if (phoneTextH3) phoneTextH3.style.opacity = '1';
                if (phoneTextP) phoneTextP.style.opacity = '0.9';
            }, 5000);
        }
    };
    
    // Initialize all components
    createProgressBar();
    createSectionIndicators();
    addTransitionClasses();
    setupTestimonialSlider();
    setupSmoothScrolling();
    setupParallaxEffect();
    setupCyberLogo();
    setupMouseMoveEffect();
    enhanceDeviceMockups();
    
    // Initial check for elements in view
    checkElementsInView();
    
    // Add scroll event listener with throttling for better performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                handleScroll();
                scrollTimeout = null;
            }, 10); // Small timeout for performance
        }
    });
    
    // Initial check for elements in view on load
    window.addEventListener('load', () => {
        // Make Connect section elements visible immediately without animations
        const connectHeadline = document.querySelector('.final-cta-headline');
        const connectButton = document.querySelector('.primary-cta-button');
        
        if (connectHeadline) {
            connectHeadline.style.opacity = '1';
            connectHeadline.style.transform = 'none';
        }
        
        if (connectButton) {
            connectButton.style.opacity = '1';
            connectButton.style.transform = 'none';
        }
        
        // Continue with normal animations for other sections
        checkElementsInView();
        
        // Force animate hero elements
        const heroElements = document.querySelectorAll('.hero-section .section-transition, .hero-section .stagger-children');
        heroElements.forEach(element => {
            element.classList.add('in-view');
        });
        
        // Ensure the logo animations play correctly
        document.querySelectorAll('.logo-box').forEach((logo, index) => {
            logo.style.animationDelay = `${0.1 * index + 0.3}s`;
        });
    });
    
    // Add resize event handler for responsive animations
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            checkElementsInView();
        }, 100);
    });
    
    // Helper function to check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= window.innerHeight * 0.85 &&
            rect.bottom >= window.innerHeight * 0.15
        );
    }
});