/* ========================
   Vanshita Sabnani Portfolio
   Three.js + Particles + Interactivity
======================== */

document.addEventListener('DOMContentLoaded', () => {
    // ========================
    // Particle Background
    // ========================
    const particlesCanvas = document.getElementById('particles-canvas');
    const pCtx = particlesCanvas.getContext('2d');
    let particles = [];
    let mousePos = { x: 0, y: 0 };

    function resizeParticleCanvas() {
        particlesCanvas.width = window.innerWidth;
        particlesCanvas.height = window.innerHeight;
    }
    resizeParticleCanvas();
    window.addEventListener('resize', resizeParticleCanvas);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * particlesCanvas.width;
            this.y = Math.random() * particlesCanvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.hue = Math.random() > 0.5 ? 200 : 220;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            const dx = mousePos.x - this.x;
            const dy = mousePos.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                this.x -= dx * 0.01;
                this.y -= dy * 0.01;
            }

            if (this.x < 0 || this.x > particlesCanvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > particlesCanvas.height) this.speedY *= -1;
        }
        draw() {
            pCtx.beginPath();
            pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            pCtx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${this.opacity})`;
            pCtx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 12000), 120);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.15;
                    pCtx.beginPath();
                    pCtx.moveTo(particles[i].x, particles[i].y);
                    pCtx.lineTo(particles[j].x, particles[j].y);
                    pCtx.strokeStyle = `rgba(0, 180, 255, ${opacity})`;
                    pCtx.lineWidth = 0.5;
                    pCtx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    document.addEventListener('mousemove', (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    });

    // ========================
    // Three.js 3D Hero Object
    // ========================
    const threeContainer = document.getElementById('three-canvas');

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    threeContainer.appendChild(renderer.domElement);

    // Abstract rotating geometry — Icosahedron wireframe
    const geometry = new THREE.IcosahedronGeometry(1.8, 1);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x00b4ff,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
    });
    const mesh = new THREE.Mesh(geometry, wireframeMaterial);
    scene.add(mesh);

    // Inner glowing sphere
    const innerGeo = new THREE.IcosahedronGeometry(1.2, 2);
    const innerMat = new THREE.MeshBasicMaterial({
        color: 0x7b2dff,
        wireframe: true,
        transparent: true,
        opacity: 0.08,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // Floating ring
    const ringGeo = new THREE.TorusGeometry(2.4, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00b4ff,
        transparent: true,
        opacity: 0.2,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    // Dot particles around 3D object
    const dotsGeometry = new THREE.BufferGeometry();
    const dotsCount = 200;
    const dotsPositions = new Float32Array(dotsCount * 3);
    for (let i = 0; i < dotsCount; i++) {
        const radius = 2.5 + Math.random() * 1.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        dotsPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        dotsPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        dotsPositions[i * 3 + 2] = radius * Math.cos(phi);
    }
    dotsGeometry.setAttribute('position', new THREE.BufferAttribute(dotsPositions, 3));
    const dotsMaterial = new THREE.PointsMaterial({
        color: 0x00f0ff,
        size: 0.03,
        transparent: true,
        opacity: 0.6,
    });
    const dots = new THREE.Points(dotsGeometry, dotsMaterial);
    scene.add(dots);

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    function animateThree() {
        requestAnimationFrame(animateThree);

        const time = Date.now() * 0.001;

        mesh.rotation.x += 0.003;
        mesh.rotation.y += 0.005;

        innerMesh.rotation.x -= 0.004;
        innerMesh.rotation.y -= 0.003;

        ring.rotation.z += 0.002;

        dots.rotation.y += 0.001;
        dots.rotation.x += 0.0005;

        // Subtle mouse interaction
        mesh.rotation.x += mouseY * 0.002;
        mesh.rotation.y += mouseX * 0.002;

        // Breathing effect
        const scale = 1 + Math.sin(time * 0.5) * 0.03;
        mesh.scale.set(scale, scale, scale);

        renderer.render(scene, camera);
    }
    animateThree();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ========================
    // Navbar Scroll Effect
    // ========================
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Navbar background
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            const height = section.offsetHeight;
            if (scrollY >= top && scrollY < top + height) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ========================
    // Mobile Menu
    // ========================
    const hamburger = document.getElementById('hamburger');
    const navLinksContainer = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinksContainer.classList.toggle('open');
    });

    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('open');
        });
    });

    // ========================
    // Theme Toggle
    // ========================
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Check saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);

        // Update Three.js colors
        if (next === 'light') {
            wireframeMaterial.color.setHex(0x0088cc);
            wireframeMaterial.opacity = 0.2;
            ringMat.color.setHex(0x0088cc);
        } else {
            wireframeMaterial.color.setHex(0x00b4ff);
            wireframeMaterial.opacity = 0.15;
            ringMat.color.setHex(0x00b4ff);
        }
    });

    // ========================
    // Scroll Reveal Animations
    // ========================
    const revealElements = document.querySelectorAll(
        '.about-grid, .about-image-wrapper, .about-content, ' +
        '.skill-card, .project-card, .service-card, ' +
        '.contact-info, .contact-form, .section-header'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    // Add stagger delays to card grids
    document.querySelectorAll('.skill-card, .project-card, .service-card').forEach((card, i) => {
        const delay = (i % 3) + 1;
        card.classList.add(`reveal-delay-${delay}`);
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));

    // ========================
    // Animated Progress Bars
    // ========================
    const progressBars = document.querySelectorAll('.progress-fill');
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                bar.style.setProperty('--target-width', width + '%');
                bar.classList.add('animate');
                progressObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => progressObserver.observe(bar));

    // ========================
    // Counter Animation
    // ========================
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                let current = 0;
                const increment = target / 40;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        el.textContent = target;
                        clearInterval(timer);
                    } else {
                        el.textContent = Math.ceil(current);
                    }
                }, 40);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    // ========================
    // 3D Tilt Effect on Skill Cards
    // ========================
    const tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;

            // Move glow
            const glow = card.querySelector('.skill-card-glow');
            if (glow) {
                glow.style.top = `${y - rect.height}px`;
                glow.style.left = `${x - rect.width}px`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });

    // ========================
    // Contact Form Handler (mailto)
    // ========================
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) return;

        const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const body = encodeURIComponent(`Hi Vanshita,\n\n${message}\n\n---\nFrom: ${name}\nEmail: ${email}`);
        window.open(`mailto:vanshita986@gmail.com?subject=${subject}&body=${body}`, '_self');

        const btn = form.querySelector('button');
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<span>Opening Email Client...</span> <i class="fas fa-check"></i>';
        btn.style.background = 'linear-gradient(135deg, #00ff88, #00cc66)';
        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.style.background = '';
            form.reset();
        }, 3000);
    });

    // ========================
    // Smooth Anchor Scrolling
    // ========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
