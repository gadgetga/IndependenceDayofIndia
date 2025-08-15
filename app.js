// Presentation App JavaScript
class PresentationApp {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 9;
        this.slides = document.querySelectorAll('.slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentSlideSpan = document.getElementById('current-slide');
        this.totalSlidesSpan = document.getElementById('total-slides');
        
        this.init();
    }
    
    init() {
        // Set initial state
        this.updateSlideCounter();
        this.updateNavigationButtons();
        
        // Add event listeners
        this.addEventListeners();
        
        // Set initial active states
        this.showSlide(1);
        
        console.log('Presentation initialized with', this.totalSlides, 'slides');
    }
    
    addEventListeners() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Previous button clicked');
            this.previousSlide();
        });
        
        this.nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Next button clicked');
            this.nextSlide();
        });
        
        // Slide indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Indicator clicked:', index + 1);
                this.goToSlide(index + 1);
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
        
        // Touch/swipe support
        this.addTouchSupport();
    }
    
    handleKeyboardNavigation(e) {
        switch(e.key) {
            case 'ArrowRight':
            case ' ':
            case 'PageDown':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'ArrowLeft':
            case 'PageUp':
                e.preventDefault();
                this.previousSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(1);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
        }
    }
    
    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        const minSwipeDistance = 50;
        
        const slidesContainer = document.querySelector('.slides-container');
        
        slidesContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        slidesContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Check if horizontal swipe is longer than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (Math.abs(deltaX) > minSwipeDistance) {
                    if (deltaX > 0) {
                        // Swipe right - go to previous slide
                        this.previousSlide();
                    } else {
                        // Swipe left - go to next slide
                        this.nextSlide();
                    }
                }
            }
        }, { passive: true });
    }
    
    showSlide(slideNumber) {
        console.log('Showing slide:', slideNumber);
        
        // Validate slide number
        if (slideNumber < 1 || slideNumber > this.totalSlides) {
            console.log('Invalid slide number:', slideNumber);
            return;
        }
        
        // Remove active class from all slides
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev');
            if (index + 1 !== slideNumber) {
                slide.style.display = 'none';
            }
        });
        
        // Remove active class from all indicators
        this.indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Show and activate current slide
        const currentSlideElement = this.slides[slideNumber - 1];
        const currentIndicator = this.indicators[slideNumber - 1];
        
        if (currentSlideElement) {
            currentSlideElement.style.display = 'flex';
            setTimeout(() => {
                currentSlideElement.classList.add('active');
            }, 10);
            console.log('Activated slide:', slideNumber);
        } else {
            console.error('Slide element not found for slide:', slideNumber);
        }
        
        if (currentIndicator) {
            currentIndicator.classList.add('active');
            console.log('Activated indicator:', slideNumber);
        } else {
            console.error('Indicator not found for slide:', slideNumber);
        }
        
        // Update current slide number
        this.currentSlide = slideNumber;
        this.updateSlideCounter();
        this.updateNavigationButtons();
        
        // Add slide transition effect
        this.addSlideTransitionEffect();
        
        // Announce for accessibility
        this.announceSlideChange(slideNumber);
    }
    
    addSlideTransitionEffect() {
        const activeSlide = document.querySelector('.slide.active');
        if (activeSlide) {
            // Add a subtle scale effect
            activeSlide.style.transform = 'translateX(0) scale(0.98)';
            
            // Reset after animation
            setTimeout(() => {
                activeSlide.style.transform = 'translateX(0) scale(1)';
            }, 150);
        }
    }
    
    nextSlide() {
        console.log('Next slide requested. Current:', this.currentSlide, 'Total:', this.totalSlides);
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        } else {
            console.log('Already at last slide');
        }
    }
    
    previousSlide() {
        console.log('Previous slide requested. Current:', this.currentSlide);
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        } else {
            console.log('Already at first slide');
        }
    }
    
    goToSlide(slideNumber) {
        console.log('Going to slide:', slideNumber);
        if (slideNumber >= 1 && slideNumber <= this.totalSlides && slideNumber !== this.currentSlide) {
            this.showSlide(slideNumber);
            
            // Add haptic feedback on supported devices
            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }
        } else {
            console.log('Invalid slide transition requested:', slideNumber);
        }
    }
    
    announceSlideChange(slideNumber) {
        const slide = this.slides[slideNumber - 1];
        const title = slide.querySelector('.slide-title, .main-title')?.textContent || `Slide ${slideNumber}`;
        
        // Create or update screen reader announcement
        let announcement = document.getElementById('slide-announcement');
        if (!announcement) {
            announcement = document.createElement('div');
            announcement.id = 'slide-announcement';
            announcement.className = 'sr-only';
            announcement.setAttribute('aria-live', 'polite');
            document.body.appendChild(announcement);
        }
        
        announcement.textContent = `Now showing: ${title}. Slide ${slideNumber} of ${this.totalSlides}.`;
    }
    
    updateSlideCounter() {
        this.currentSlideSpan.textContent = this.currentSlide;
        this.totalSlidesSpan.textContent = this.totalSlides;
        console.log('Updated counter:', this.currentSlide, '/', this.totalSlides);
    }
    
    updateNavigationButtons() {
        // Update previous button
        this.prevBtn.disabled = this.currentSlide === 1;
        if (this.currentSlide === 1) {
            this.prevBtn.style.opacity = '0.5';
        } else {
            this.prevBtn.style.opacity = '1';
        }
        
        // Update next button
        this.nextBtn.disabled = this.currentSlide === this.totalSlides;
        if (this.currentSlide === this.totalSlides) {
            this.nextBtn.style.opacity = '0.5';
            this.nextBtn.innerHTML = `
                Finish
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
            `;
        } else {
            this.nextBtn.style.opacity = '1';
            this.nextBtn.innerHTML = `
                Next
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
            `;
        }
        
        console.log('Updated navigation buttons. Current slide:', this.currentSlide);
    }
    
    // Get presentation progress
    getProgress() {
        return {
            current: this.currentSlide,
            total: this.totalSlides,
            percentage: Math.round((this.currentSlide / this.totalSlides) * 100)
        };
    }
}

// Utility functions for enhanced features
class PresentationUtils {
    static formatDate(date = new Date()) {
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    static addWatermark() {
        const watermark = document.createElement('div');
        watermark.className = 'presentation-watermark';
        watermark.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            font-size: 12px;
            color: rgba(0,0,0,0.3);
            pointer-events: none;
            z-index: 1000;
        `;
        watermark.textContent = `India Independence Day - ${this.formatDate()}`;
        document.body.appendChild(watermark);
    }
    
    static preloadImages() {
        const images = [
            'https://pplx-res.cloudinary.com/image/upload/v1754708732/pplx_project_search_images/16bf29ea7fa83b23a2bdd8a4398886169cda8c48.png',
            'https://pplx-res.cloudinary.com/image/upload/v1754743674/pplx_project_search_images/de4443c7fd8f2dc494587783060678bee5edbddd.png',
            'https://pplx-res.cloudinary.com/image/upload/v1754708732/pplx_project_search_images/e521a0ae1e1172c79c30970189411596db405e6d.png',
            'https://pplx-res.cloudinary.com/image/upload/v1754746173/pplx_project_search_images/6c30cdb9230b8c120f545aede459a082401e3ac2.png',
            'https://pplx-res.cloudinary.com/image/upload/v1754746173/pplx_project_search_images/0adaf3415a47ef153c662159f8825f777c0712e8.png'
        ];
        
        images.forEach(src => {
            const img = new Image();
            img.src = src;
            img.onerror = () => console.log('Failed to preload image:', src);
            img.onload = () => console.log('Preloaded image:', src);
        });
    }
    
    static addKeyboardShortcutsHelp() {
        const helpButton = document.createElement('button');
        helpButton.innerHTML = '?';
        helpButton.className = 'help-button';
        helpButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: var(--india-saffron);
            color: white;
            border: none;
            cursor: pointer;
            font-weight: bold;
            z-index: 1000;
            font-size: 16px;
        `;
        
        helpButton.addEventListener('click', () => {
            const shortcuts = `Keyboard Shortcuts:
• Arrow Right / Space: Next slide
• Arrow Left: Previous slide
• Home: First slide
• End: Last slide

Touch Controls:
• Swipe left: Next slide
• Swipe right: Previous slide

Click the dots below to jump to any slide!`;
            alert(shortcuts);
        });
        
        document.body.appendChild(helpButton);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing presentation...');
    
    // Initialize the presentation app
    window.presentationApp = new PresentationApp();
    
    // Add utility features
    PresentationUtils.preloadImages();
    PresentationUtils.addWatermark();
    PresentationUtils.addKeyboardShortcutsHelp();
    
    // Add loading class to body
    document.body.classList.add('loaded');
    
    console.log('India Independence Day Presentation loaded successfully!');
    console.log('Use arrow keys, touch gestures, or navigation buttons to control slides.');
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.presentationApp) {
        console.log('Page hidden, stopping any auto-play');
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Ensure proper layout after resize
    const activeSlide = document.querySelector('.slide.active');
    if (activeSlide) {
        activeSlide.style.transform = 'translateX(0) scale(1)';
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PresentationApp, PresentationUtils };
}