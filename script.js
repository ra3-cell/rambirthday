/* ==========================================
    BIRTHDAY PROJECT - FINAL CLEAN STRUCTURE
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================
        ELEMENTS
    ========================= */

    const pages = document.querySelectorAll(".page");
    const nextBtns = document.querySelectorAll(".nextBtn");
    const prevBtns = document.querySelectorAll(".prevBtn");

    const music = document.getElementById("bgMusic");
    const musicBtn = document.getElementById("musicBtn");
    const celebrateBtn = document.getElementById("celebrate");
    const typewriter = document.getElementById("typewriter");
    const canvas = document.getElementById("fireworks");

    /* =========================
        STATE
    ========================= */

    let currentPage = 0;
    let musicPlaying = false;
    let typingDone = false;
    let fireworks = [];

    /* =========================
        PAGE SYSTEM
    ========================= */

    function showPage(index) {

        pages.forEach((page, i) => {
            page.classList.remove("active", "prev");

            if (i < index) page.classList.add("prev");
            if (i === index) page.classList.add("active");
        });

        triggerPageFeatures(index);
    }

    function triggerPageFeatures(index) {

        const page = pages[index];

        // TYPEWRITER TRIGGER
        if (page && page.querySelector("#typewriter") && !typingDone) {
            startTyping();
        }

        // IMAGE REVEAL INIT (IMPORTANT FIX)
        initPhotoReveal(page);
    }

    /* =========================
        NAVIGATION
    ========================= */

    nextBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            if (currentPage < pages.length - 1) {
                currentPage++;
                showPage(currentPage);
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            if (currentPage > 0) {
                currentPage--;
                showPage(currentPage);
            }
        });
    });

    showPage(currentPage);

    /* =========================
        MUSIC
    ========================= */

    if (music) {

        musicBtn?.addEventListener("click", () => {

            if (musicPlaying) {
                music.pause();
            } else {
                music.play().catch(() => {});
            }

            musicPlaying = !musicPlaying;
        });

        nextBtns[0]?.addEventListener("click", () => {
            music.play().catch(() => {});
            musicPlaying = true;
        });
    }

    /* =========================
        PHOTO REVEAL FIX (IMPORTANT)
    ========================= */

    function initPhotoReveal(page) {

        if (!page) return;

        const cards = page.querySelectorAll(".photo-card");

        cards.forEach(card => {

            card.addEventListener("click", () => {
                card.classList.toggle("reveal");
            });

        });
    }

    /* =========================
        TYPEWRITER
    ========================= */

    function startTyping() {

        if (!typewriter || typingDone) return;

        typingDone = true;

        const text = typewriter.dataset.text || "";
        typewriter.innerHTML = "";

        let i = 0;

        (function type() {
            if (i < text.length) {
                typewriter.innerHTML += text[i] === "\n" ? "<br>" : text[i];
                i++;
                setTimeout(type, 30);
            }
        })();
    }

    /* =========================
        CONFETTI
    ========================= */

    function createConfetti() {

        for (let i = 0; i < 120; i++) {

            const c = document.createElement("span");
            c.className = "confetti";

            c.style.left = Math.random() * window.innerWidth + "px";
            c.style.top = "-20px";
            c.style.background = randomColor();

            document.body.appendChild(c);

            setTimeout(() => c.remove(), 5000);
        }
    }

    function randomColor() {
        const colors = ["#ff4d88", "#FFD93D", "#6BCB77", "#4D96FF", "#FF6B6B"];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    /* =========================
        CELEBRATION + FINAL MODE
    ========================= */

    celebrateBtn?.addEventListener("click", () => {

        createConfetti();
        startFireworks();

        setTimeout(() => {
            enableFinalMode();
        }, 3500);
    });

    function enableFinalMode() {

        document.querySelectorAll("button").forEach(btn => {
            btn.style.display = "none";
        });

        const overlay = document.createElement("div");
        overlay.className = "overlay";
        document.body.appendChild(overlay);

        const text = document.createElement("div");
        text.className = "final-text";
        text.innerText = "🎂 Happy Birthday 🎂";
        document.body.appendChild(text);
    }

    /* =========================
        FIREWORKS (FIXED)
    ========================= */

    let ctx;

    if (canvas) {

        ctx = canvas.getContext("2d");

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener("resize", () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        function Firework(x, y) {

            this.particles = [];

            for (let i = 0; i < 40; i++) {
                this.particles.push({
                    x,
                    y,
                    dx: (Math.random() - 0.5) * 6,
                    dy: (Math.random() - 0.5) * 6,
                    life: 70,
                    color: randomColor()
                });
            }
        }

        function animate() {

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            fireworks.forEach((fw, i) => {

                fw.particles.forEach(p => {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.fill();

                    p.x += p.dx;
                    p.y += p.dy;
                    p.life--;
                });

                fw.particles = fw.particles.filter(p => p.life > 0);

                if (fw.particles.length === 0) {
                    fireworks.splice(i, 1);
                }
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    function startFireworks() {

        if (!canvas) return;

        let interval = setInterval(() => {
            fireworks.push(
                new Firework(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height / 2
                )
            );
        }, 300);

        setTimeout(() => clearInterval(interval), 4000);
    }

});