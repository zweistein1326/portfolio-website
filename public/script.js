document.addEventListener("DOMContentLoaded", (event) => { 
    // Get references to the cursor elements
    const cursorDot = document.getElementById('cursor-dot');
    const cursorFollower = document.getElementById('cursor-follower');
    const links = document.querySelectorAll('a');

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

    const homeButton = document.getElementById('home-button');
    const worksButton = document.getElementById('works-button');
    const aboutButton = document.getElementById('about-button');
    homeButton.addEventListener('click', (e) => {
        e.preventDefault();
        if(window.location.pathname.includes("index.html")){return;}
        const container = document.getElementById("container");
        container.classList.add('slide-out');
        setTimeout(() => {
            window.location.href = '/index.html';
        }, 500);
    });
    worksButton.addEventListener('click', (e) => {
        e.preventDefault();
        if(window.location.pathname.includes("/works.html")){return;}
        const container = document.getElementById("container");
        container.classList.add('slide-out');
        setTimeout(() => {
            window.location.href = '/public/works.html';
        }, 500);
    });
    aboutButton.addEventListener('click', (e) => {
        e.preventDefault();
        if(window.location.pathname.includes("about.html")){return;}
        const container = document.getElementById("container");
        container.classList.add('slide-out');
        setTimeout(() => {
            window.location.href = '/public/about.html';
        }, 500);
    });


    const navBackground = document.querySelector('.nav-background');
        const navButtons = document.querySelectorAll('.navigation button');

        /**
         * Moves the background to the target button.
         * @param {HTMLElement} targetButton - The button to move the background to.
         */
        function moveNavBackground(targetButton) {
            if (!targetButton) return;

            // Get the position and width of the target button relative to the navigation container
            const targetLeft = targetButton.offsetLeft;
            const targetWidth = targetButton.offsetWidth;

            // Set the style of the background element
            navBackground.style.left = `${targetLeft}px`;
            navBackground.style.width = `${targetWidth}px`;

            // Update the 'active' class on all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            targetButton.classList.add('active');
        }

        // --- Initialize the background position on page load ---
        window.addEventListener('load', () => {
            const activeButton = document.querySelector('.navigation .active');
            moveNavBackground(activeButton);

            // Add the transition class *after* setting the initial state.
            // This prevents the background from animating into place on page load.
            setTimeout(() => {
                navBackground.style.transition = 'left 0.4s cubic-bezier(0.65, 0, 0.35, 1), width 0.4s cubic-bezier(0.65, 0, 0.35, 1)';
            }, 10);
        });

        // --- Add click listeners to move the background ---
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                moveNavBackground(e.currentTarget);
            });
        });

        function animateTitle(titleElement) {
            const text = titleElement.getAttribute('data-text');
            titleElement.innerHTML = ''; // Clear the element

            // Split text into letters, wrap each in a span, and apply a staggered delay
            text.split('').forEach((letter, index) => {
                const span = document.createElement('span');
                // Handle spaces to preserve them
                span.textContent = letter === ' ' ? '\u00A0' : letter; 
                span.style.animationDelay = `${index * 0.1}s`;
                titleElement.appendChild(span);
            });
        }

        function animateTextByLetter(element) {
            const text = element.getAttribute('data-text');
            if (!text) return 0;
            element.innerHTML = ''; 

            text.split('').forEach((letter, index) => {
                const span = document.createElement('span');
                span.textContent = letter === ' ' ? '\u00A0' : letter; 
                span.style.animationDelay = `${index * 0.05}s`;
                element.appendChild(span);
            });
            
            return text.length * 0.05;
        }

        // --- Run all animations on page load ---
        window.addEventListener('load', () => {
            // 1. Initialize navigation background
            const activeButton = document.querySelector('.navigation .active');
            moveNavBackground(activeButton);

            setTimeout(() => {
                navBackground.style.transition = 'left 0.4s cubic-bezier(0.65, 0, 0.35, 1), width 0.4s cubic-bezier(0.65, 0, 0.35, 1)';
            }, 10);

            const title = document.querySelector('.title');
            if (title) {
                animateTitle(title);
            }

            if(window.href = "index.html") {
                const preloader = document.querySelector('.preloader');
                const mainContent = document.querySelector('.main-content');
                // --- 1. Start Pre-loader Animations ---
                const loaderTitles = document.getElementsByClassName('loader-title');
                var totalAnimationTime = 0;
                Array.from(loaderTitles).forEach((loaderTitle, index) => {
                    var titleDuration = 0;
                    setTimeout(()=>{
                        titleDuration = animateTextByLetter(loaderTitle)
                    }, 400 * index);
                    totalAnimationTime = titleDuration + 0.4 * index;
                })
                
                // --- 2. Trigger Page Transition ---
                totalAnimationTime = totalAnimationTime * 1000;
                const exitDelay = totalAnimationTime + 800; // Wait 0.8s after text appears

                setTimeout(() => {
                    preloader.classList.add('slide-out');
                    mainContent.classList.add('slide-in');

                    // --- 3. Start Main Content Animations after transition ---
                    setTimeout(() => {
                        preloader.style.display = 'none'; // Remove loader from view completely

                        // Animate the main page title
                        const mainTitle = document.querySelector('.title');
                        if (mainTitle) animateTextByLetter(mainTitle);
                    }, 800); // Must match the slide-in/out animation duration

                }, exitDelay);
            }
        });
})