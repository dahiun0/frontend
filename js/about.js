document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll(".count");
    const easeOutQuad = (t) => t * (2 - t);

    function animateCount(el, duration = 1000) {
        const target = Number(el.dataset.target || 0);
        const original = el.textContent.trim();
        const suffix = original.replace(/[0-9,]/g, "");

        const start = performance.now();
        let last = -1;

        function tick(now) {
            const t = Math.min(1, (now - start) / duration);
            const eased = easeOutQuad(t);
            const value = Math.round(target * eased);

            if (value !== last) {
                el.textContent = value.toLocaleString() + suffix;
                last = value;
            }

            if (t < 1) requestAnimationFrame(tick);
            else el.textContent = target.toLocaleString() + suffix;
        }

        requestAnimationFrame(tick);
    }

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            if (el.dataset.done === "1") return;
            el.dataset.done = "1";

            const original = el.textContent.trim();
            const suffix = original.replace(/[0-9,]/g, "");
            el.textContent = "0" + suffix;

            const idx = Number(el.dataset.idx || 0);
            setTimeout(() => animateCount(el, 1000), idx * 80);

            io.unobserve(el);
        });
    }, { threshold: 0.25 });

    counters.forEach((el, i) => {
        el.dataset.idx = String(i);
        io.observe(el);
    });
});
