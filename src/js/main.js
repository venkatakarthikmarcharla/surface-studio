// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// --- Preloader Logic ---
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    const loaderBar = document.querySelector('.loader-bar');
    
    if (preloader && loaderBar) {
        // Simulate progress bar completion
        loaderBar.style.width = '100%';
        
        setTimeout(() => {
            preloader.classList.add('fade-out');
            
            // Start entrance animations only after preloader is gone
            if (typeof window.startTyping === 'function') window.startTyping();
            revealOnScroll();
            if (typeof initStaggerAnimations === 'function') initStaggerAnimations();
            initStatsCounter();
            
            // Re-run ScrollTrigger refresh to ensure everything is calculated correctly
            ScrollTrigger.refresh();
        }, 1000); // Slightly longer delay for a smoother reveal
    }
});

// --- Custom Cursor ---
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Direct position for the small dot
    gsap.set(cursor, { x: mouseX, y: mouseY });
});

// Smooth follow for the larger circle
gsap.ticker.add(() => {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    gsap.set(cursorFollower, { x: followerX, y: followerY });
});

// Cursor Hover Effects
const hoverElements = document.querySelectorAll('a, button, .expertise-card, .showcase-item');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
    });
});

// --- Lenis Smooth Scroll ---
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// Integrate Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);

// --- Navbar Scroll Effect ---
const navbar = document.querySelector('.navbar');
lenis.on('scroll', ({ scroll }) => {
    if (scroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// --- Mobile Menu Toggle ---
const navToggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll'); // Prevent body scroll when menu is open
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
}

// --- Hero Slider & Typed Text ---
const slides = document.querySelectorAll('.slide');
if (slides.length > 0) {
    let currentSlide = 0;
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    setInterval(nextSlide, 6000); // Change slide every 6s
}

// Simple Typing Animation
const words = ["Engineered Finishes.", "Elevated Surfaces.", "Luxury in Every Layer.", "Precision Coated.", "Beyond Paint."];
let i = 0;
let timer;
const typedText = document.getElementById('typed-text');

if (typedText) {
    function typingEffect() {
        let word = words[i].split("");
        var loopTyping = function() {
            if (word.length > 0) {
                typedText.innerHTML += word.shift();
            } else {
                deletingEffect();
                return false;
            }
            timer = setTimeout(loopTyping, 100);
        };
        loopTyping();
    }

    function deletingEffect() {
        let word = words[i].split("");
        var loopDeleting = function() {
            if (word.length > 0) {
                word.pop();
                typedText.innerHTML = word.join("");
            } else {
                if (words.length > (i + 1)) {
                    i++;
                } else {
                    i = 0;
                }
                typingEffect();
                return false;
            }
            timer = setTimeout(loopDeleting, 50);
        };
        setTimeout(loopDeleting, 2000);
    }
    function startTyping() {
        if (typedText) {
            typedText.innerHTML = "";
            typingEffect();
        }
    }
    window.startTyping = startTyping;
}

// --- Magnetic Button Effect ---
const magneticBtns = document.querySelectorAll('.magnetic-btn');
magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
        const position = btn.getBoundingClientRect();
        const x = e.clientX - position.left - position.width / 2;
        const y = e.clientY - position.top - position.height / 2;
        
        gsap.to(btn, { x: x * 0.3, y: y * 0.5, duration: 0.3, ease: "power2.out" });
        gsap.to(btn.querySelector('.btn-text'), { x: x * 0.1, y: y * 0.1, duration: 0.3, ease: "power2.out" });
        
        const glow = btn.querySelector('.btn-glow');
        if (glow) {
            gsap.to(glow, {
                x: e.clientX - position.left,
                y: e.clientY - position.top,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    });
    
    btn.addEventListener('mouseleave', function() {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        gsap.to(btn.querySelector('.btn-text'), { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        
        const glow = btn.querySelector('.btn-glow');
        if (glow) {
            gsap.to(glow, {
                x: '50%',
                y: '50%',
                duration: 0.5,
                ease: "power2.out"
            });
        }
    });
});

// --- GSAP Scroll Animations ---

// General Reveals
const revealOnScroll = () => {
    // Reveal Up
    gsap.utils.toArray('.reveal-up').forEach(elem => {
        gsap.fromTo(elem, 
            { y: 50, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
                scrollTrigger: { trigger: elem, start: "top 90%" }
            }
        );
    });

    // Reveal Down
    gsap.utils.toArray('.reveal-down').forEach(elem => {
        gsap.fromTo(elem, 
            { y: -50, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
                scrollTrigger: { trigger: elem, start: "top 90%" }
            }
        );
    });

    // Reveal Left
    gsap.utils.toArray('.reveal-left').forEach(elem => {
        gsap.fromTo(elem, 
            { x: -50, opacity: 0 },
            {
                x: 0, opacity: 1, duration: 1.2, ease: "power3.out",
                scrollTrigger: { trigger: elem, start: "top 90%" }
            }
        );
    });

    // Reveal Right
    gsap.utils.toArray('.reveal-right').forEach(elem => {
        gsap.fromTo(elem, 
            { x: 50, opacity: 0 },
            {
                x: 0, opacity: 1, duration: 1.2, ease: "power3.out",
                scrollTrigger: { trigger: elem, start: "top 90%" }
            }
        );
    });

    // Reveal Scale
    gsap.utils.toArray('.reveal-scale').forEach(elem => {
        gsap.fromTo(elem, 
            { scale: 0.9, opacity: 0 },
            {
                scale: 1, opacity: 1, duration: 1.2, ease: "power3.out",
                scrollTrigger: { trigger: elem, start: "top 90%" }
            }
        );
    });

    // Reveal Blur
    gsap.utils.toArray('.reveal-blur').forEach(elem => {
        gsap.fromTo(elem, 
            { filter: "blur(10px)", opacity: 0 },
            {
                filter: "blur(0px)", opacity: 1, duration: 1.2, ease: "power3.out",
                scrollTrigger: { trigger: elem, start: "top 90%" }
            }
        );
    });
};

// Initial reveal run removed from global scope to run after preloader
// revealOnScroll();

// Parallax Effects
gsap.utils.toArray('.parallax-img').forEach(elem => {
    gsap.to(elem, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
            trigger: elem,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
});

// --- Contact Form Submission ---
const contactForm = document.getElementById('contact-form');
const formResult = document.getElementById('form-result');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        formResult.innerHTML = "Sending...";
        formResult.style.color = "var(--text-primary)";

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
                formResult.innerHTML = "Message sent successfully!";
                formResult.style.color = "#4CAF50";
                contactForm.reset();
            } else {
                console.log(response);
                formResult.innerHTML = json.message;
                formResult.style.color = "#f44336";
            }
        })
        .catch(error => {
            console.log(error);
            formResult.innerHTML = "Something went wrong!";
            formResult.style.color = "#f44336";
        })
        .then(function() {
            setTimeout(() => {
                formResult.innerHTML = "";
            }, 5000);
        });
    });
}
// --- Stats Counter Animation ---
function initStatsCounter() {
    gsap.utils.toArray('.stat-number').forEach(stat => {
        const target = parseFloat(stat.innerText.replace(/[^0-9.]/g, ''));
        const suffix = stat.innerText.replace(/[0-9.]/g, '');
        
        stat.innerText = '0' + suffix;

        gsap.to(stat, {
            innerText: target,
            duration: 2,
            snap: { innerText: 1 },
            scrollTrigger: {
                trigger: stat,
                start: "top 90%",
                once: true
            },
            onUpdate: function() {
                stat.innerText = Math.ceil(this.targets()[0].innerText) + suffix;
            }
        });
    });
}

// --- Showcase Horizontal Scroll Arrows ---
const scrollWrapper = document.querySelector('.horizontal-scroll-wrapper');
const prevBtn = document.querySelector('.showcase-arrow.prev');
const nextBtn = document.querySelector('.showcase-arrow.next');

if (scrollWrapper && prevBtn && nextBtn) {
    const scrollAmount = 350; // Match min-width of items

    nextBtn.addEventListener('click', () => {
        scrollWrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
        scrollWrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
}
