document.addEventListener("DOMContentLoaded", (event) => { 
    // Get references to the cursor elements
    gsap.registerPlugin(ScrollTrigger);
    const cursorDot = document.getElementById('cursor-dot');
    const cursorFollower = document.getElementById('cursor-follower');
    const links = document.querySelectorAll('a');
    const content = document.getElementsByClassName('content')[0];
    const container = document.getElementsByClassName('body-container')[0];
    // --- Create the GSAP Timeline ---
    const tl = gsap.timeline({
        onComplete: () => {
            document.body.style.overflow = 'auto'; // Restore scrolling
            setupScrollAnimations();
        }
    });
    // --- PAGE LOAD ANIMATION ---
    // This logic determines whether to show the preloader or the slide-in animation.
    if (!sessionStorage.getItem('hasVisited') && window.location.pathname.includes("index.html")) {
        // --- FIRST VISIT IN SESSION: RUN PRELOADER ---
        sessionStorage.setItem('hasVisited', 'true');
        animatePreloader(tl);
    } else {
        // Set initial state for the page to be off-screen at the bottom
        gsap.set(container, { y: '100vh', x: '100vw', autoAlpha: 1 });
        // Animate the page sliding in from the bottom
        gsap.to(container, {
            y: '0vh',
            x: '0vw',
            duration: 1.2,
            ease: 'power3.out',
            onComplete: () => {
                document.body.style.overflow = 'auto';
                setupScrollAnimations();
            }
        });
    }

    if(window.location.pathname.includes("index.html")){
        animatePreloader(tl);
        tl.to(content, {
            autoAlpha: 1,
            duration: 1,
            ease: "power2.out"
        });
    } else {
        tl.to(content, {
            autoAlpha: 1,
            duration: 1,
            ease: "power2.out"
        });
    }

    

    // --- PAGE EXIT ANIMATION ---
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = document.getElementsByClassName('body-container')[0];

    navLinks.forEach(link => {
        const destination = link.getAttribute('href');
        if(!destination.includes('.html')){return;}
        link.addEventListener('click', (e) => {
            e.preventDefault(); 
            // Animate the current page out
            gsap.to(currentPage, {
                scale: 0.8,
                y: '-100%',
                x: '-100%',
                rotationY: -15,
                rotationZ: -5,
                duration: 1.0,
                ease: 'power3.in',
                onComplete: () => {
                    // When the animation is complete, navigate to the new page
                    window.location.href = destination;
                }
            });
        });
    });

    // Store mouse coordinates
    let mouseX = 0;
    let mouseY = 0;

    // Store the position of the follower
    let followerX = 0;
    let followerY = 0;

    // --- Configuration for the easing effect ---
    // A lower value gives a stronger "dragging" or "smoothing" effect
    const easing = 0.08;

    // --- Event Listener for Mouse Movement ---
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // --- Animation Loop ---
    // We use requestAnimationFrame for a smooth, performant animation.
    function animate() {
        // The small dot follows the mouse pointer directly
        cursorDot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;

        // Calculate the distance between the follower and the mouse pointer
        const dx = mouseX - followerX;
        const dy = mouseY - followerY;

        // Update the follower's position using linear interpolation (lerp)
        // This creates the smooth "easing" or "trailing" effect
        followerX += dx * easing;
        followerY += dy * easing;

        // Apply the new position to the follower element
        cursorFollower.style.transform = `translate(${followerX - 15}px, ${followerY - 15}px)`;
        
        // Continue the loop on the next frame
        requestAnimationFrame(animate);
    }

    // Start the animation loop
    animate();

    // --- Event Listeners for Hover Effect ---
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursorFollower.classList.add('hover');
            cursorDot.classList.add('hidden');
        });
        link.addEventListener('mouseleave', () => {
            cursorFollower.classList.remove('hover');
            cursorDot.classList.remove('hidden');
        });
    });
})

function animatePreloader(tl) {
    // Select elements from the DOM based on the new structure
    const preloader = document.getElementById('preloader');
    const loaderTitle = document.getElementById('loader-title');
    const line = document.querySelector('.line');
    const content = document.getElementsByClassName('content')[0];
    const logoContainer = document.querySelector('.logo-container');
    const logoLink = document.querySelector('.logo-container a');

    // Set initial states
    gsap.set(content, { autoAlpha: 0 }); // autoAlpha handles both opacity and visibility
    gsap.set(line, { scaleX: 0 });

    // --- Calculate the destination position ---
    // Temporarily show content to get the logo container's position, then hide it again.
    gsap.set(content, { autoAlpha: 1 });
    const targetRect = logoContainer.getBoundingClientRect();
    gsap.set(content, { autoAlpha: 0 });

    const headingRect = loaderTitle.getBoundingClientRect();
    
    // Calculate the distance the heading needs to travel
    const yMove = targetRect.top - headingRect.top;
    const xMove = targetRect.left - headingRect.left;

    // // 1. Animate the line expanding
    // tl.to(line, {
    //     scaleX: 1,
    //     duration: 1.5,
    //     ease: "power2.inOut"
    // });

    // 2. Animate the heading shrinking, moving, and changing color
    tl.to(loaderTitle, {
        fontSize: '0px', // Match the final logo font size
        textTransform: 'uppercase', // Match the final logo style
        fontWeight: 700, // Match the final logo style
        color: '#333', // Animate color to the final logo color
        duration: 1.2,
        ease: "power3.inOut",
        delay: 1.5
    }, "-=1.0"); // Overlap for a smoother transition

    // 3. Fade out the preloader background and the line
    tl.to([preloader, line], {
        opacity: 0,
        duration: 0.8,
        ease: "power1.in",
        onComplete: () => {
            // Move the animated heading into the actual logo container link
            logoLink.appendChild(loaderTitle);
            // Replace the H1 with a SPAN to match your final structure and remove all inline styles from GSAP.
            loaderTitle.outerHTML = `<span style="font-size: 16px; text-transform: uppercase; font-weight: 700;">${loaderTitle.textContent}</span>`;
            preloader.style.display = 'none'; // Hide preloader completely
        }
    }, "-=0.5");

    // 4. Fade in the main content
    tl.to(content, {
        autoAlpha: 1,
        duration: 1,
        ease: "power2.out"
    });
}

// --- FUNCTION: SCROLL-TRIGGERED TEXT ANIMATION SETUP ---
// --- SCROLL-TRIGGERED TEXT ANIMATION (NO SPLITTEXT) ---
function setupScrollAnimations() {
    const textElement = document.querySelector(".scroll-fade-in");
    if (!textElement || textElement.dataset.split) return; // Run only once

    textElement.dataset.split = "true"; // Mark as split

    const text = textElement.textContent;
    const words = text.split(' ');
    
    textElement.innerHTML = ''; // Clear original content

    // Manually wrap each word in a span
    words.forEach(word => {
        const span = document.createElement('span');
        span.textContent = word + ' '; // Add space back for separation
        textElement.appendChild(span);
    });

    const wordSpans = textElement.querySelectorAll('span');
    
    // Animate each word span
    wordSpans.forEach(word => {
        gsap.to(word, {
            opacity: 1,
            ease: "power1.inOut",
            scrollTrigger: {
                trigger: word,
                scroller: ".content", // IMPORTANT: Specify the scrolling container
                start: "top 80%", // When the top of the word hits 80% from the top of the viewport
                end: "bottom 20%", // When the bottom of the word hits 20% from the top
                toggleActions: "play reverse play reverse", // Play on enter, reverse on leave
                scrub: true // Smoothly scrubs the animation along with the scroll
            }
        });
    });
}