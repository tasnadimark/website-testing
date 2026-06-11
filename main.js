/* ============================================================
   OTTO® — interactions & motion
   ============================================================ */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
const isMobile = window.innerWidth < 768;

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------
   Smooth scroll (Lenis) — desktop only
------------------------------------------------------------ */
let lenis = null;
if (!prefersReducedMotion && !isTouch && typeof Lenis !== "undefined") {
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  window.__lenis = lenis;
}

/* Anchor links work with Lenis */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    closeMenu();
    if (lenis) lenis.scrollTo(target, { offset: -70 });
    else target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
});

/* ------------------------------------------------------------
   Three.js hero — particle wave
------------------------------------------------------------ */
async function initHero() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas || prefersReducedMotion) return;

  try {
    const THREE = await import("three");

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 2.2, 8);
    camera.lookAt(0, 0, 0);

    // Grid of points displaced by layered sine "noise" in the vertex shader
    const COLS = isMobile ? 90 : 160;
    const ROWS = isMobile ? 55 : 90;
    const W = 26, D = 16;
    const count = COLS * ROWS;
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    let i = 0;
    for (let x = 0; x < COLS; x++) {
      for (let z = 0; z < ROWS; z++) {
        positions[i * 3] = (x / (COLS - 1) - 0.5) * W;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = (z / (ROWS - 1) - 0.5) * D;
        seeds[i] = Math.random();
        i++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uPixelRatio;
        attribute float aSeed;
        varying float vElev;
        varying float vDist;

        void main() {
          vec3 p = position;
          float t = uTime * 0.6;

          // layered waves
          float e = sin(p.x * 0.45 + t) * 0.45
                  + sin(p.z * 0.7 - t * 1.3) * 0.35
                  + sin((p.x + p.z) * 0.3 + t * 0.7) * 0.5;

          // mouse ripple
          vec2 m = uMouse * vec2(13.0, 8.0);
          float md = distance(p.xz, m);
          e += smoothstep(4.5, 0.0, md) * sin(md * 2.2 - uTime * 3.0) * 0.6;

          p.y += e;
          vElev = e;

          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          vDist = -mv.z;
          gl_Position = projectionMatrix * mv;
          gl_PointSize = (1.4 + aSeed * 1.6 + max(e, 0.0) * 1.2) * uPixelRatio * (9.0 / -mv.z);
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vElev;
        varying float vDist;

        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          float alpha = smoothstep(0.5, 0.1, d);

          // fade with distance
          alpha *= smoothstep(22.0, 6.0, vDist);

          vec3 lime = vec3(0.843, 1.0, 0.247);
          vec3 dim  = vec3(0.32, 0.36, 0.30);
          vec3 col = mix(dim, lime, smoothstep(-0.6, 1.1, vElev));

          gl_FragColor = vec4(col, alpha * 0.85);
        }
      `,
    });

    const points = new THREE.Points(geometry, material);
    points.rotation.x = -0.12;
    scene.add(points);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    if (!isTouch) {
      window.addEventListener("pointermove", (e) => {
        mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
      });
    }

    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);

    const clock = new THREE.Clock();
    let raf;
    function tick() {
      const t = clock.getElapsedTime();
      uniforms.uTime.value = t;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      uniforms.uMouse.value.set(mouse.x, mouse.y);
      camera.position.x = mouse.x * 0.6;
      camera.position.y = 2.2 + mouse.y * 0.3;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    }
    tick();

    // pause when hero off-screen
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { clock.start(); tick(); }
      else cancelAnimationFrame(raf);
    });
    io.observe(canvas);
  } catch (err) {
    console.warn("Hero WebGL disabled:", err);
  }
}
initHero();

/* ------------------------------------------------------------
   Preloader → hero intro
------------------------------------------------------------ */
const preloader = document.getElementById("preloader");
const countEl = document.getElementById("preloaderCount");

let introTl = null;
function heroIntro() {
  if (introTl) return introTl;
  const tl = (introTl = gsap.timeline({ defaults: { ease: "power4.out" } }));
  tl.to(preloader, { yPercent: -100, duration: 0.9, ease: "power4.inOut" })
    .set(preloader, { display: "none" })
    .from(".hero__title .line-inner", { yPercent: 110, duration: 1.1, stagger: 0.12 }, "-=0.45")
    .from("#heroSub", { y: 30, autoAlpha: 0, duration: 0.9 }, "-=0.7")
    .from("#heroCta .btn", { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, "-=0.6")
    .from(".hero__eyebrow", { autoAlpha: 0, duration: 0.6 }, "-=0.8")
    .from("#heroStats > *", { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.07 }, "-=0.5")
    .from("#nav", {
      yPercent: -100, autoAlpha: 0, duration: 0.7,
      onComplete: () => gsap.set("#nav", { clearProps: "all" }),
    }, "-=0.8");
  return tl;
}

/* Watchdog: rAF is throttled in hidden/background tabs, which would leave the
   preloader stuck. Force-finish the intro if it hasn't completed in time. */
setTimeout(() => {
  if (!prefersReducedMotion) {
    heroIntro().progress(1);
    gsap.set("#nav", { clearProps: "all" });
  }
}, 4000);

/* wrap hero/cta title lines for masked reveal */
document.querySelectorAll(".hero__title .line, .cta__title .line").forEach((line) => {
  const inner = document.createElement("span");
  inner.className = "line-inner";
  inner.style.display = "block";
  while (line.firstChild) inner.appendChild(line.firstChild);
  line.appendChild(inner);
});

if (prefersReducedMotion) {
  preloader.style.display = "none";
} else {
  const counter = { v: 0 };
  gsap.to(counter, {
    v: 100,
    duration: 1.4,
    ease: "power2.inOut",
    onUpdate: () => (countEl.textContent = Math.round(counter.v)),
    onComplete: heroIntro,
  });
}

/* ------------------------------------------------------------
   Custom cursor
------------------------------------------------------------ */
if (!isTouch && !prefersReducedMotion) {
  const cursor = document.getElementById("cursor");
  const dot = cursor.querySelector(".cursor__dot");
  const ring = cursor.querySelector(".cursor__ring");
  const pos = { x: -100, y: -100 }, ringPos = { x: -100, y: -100 };

  window.addEventListener("pointermove", (e) => {
    pos.x = e.clientX; pos.y = e.clientY;
  });
  gsap.ticker.add(() => {
    ringPos.x += (pos.x - ringPos.x) * 0.16;
    ringPos.y += (pos.y - ringPos.y) * 0.16;
    dot.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%,-50%)`;
    ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%,-50%)`;
  });
  document.querySelectorAll("[data-cursor='hover'], a, button, summary").forEach((el) => {
    el.addEventListener("pointerenter", () => cursor.classList.add("is-hover"));
    el.addEventListener("pointerleave", () => cursor.classList.remove("is-hover"));
  });
}

/* ------------------------------------------------------------
   Magnetic buttons
------------------------------------------------------------ */
if (!isTouch && !prefersReducedMotion) {
  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - r.left - r.width / 2) * 0.25,
        y: (e.clientY - r.top - r.height / 2) * 0.35,
        duration: 0.4, ease: "power3.out",
      });
    });
    el.addEventListener("pointerleave", () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    });
  });
}

/* ------------------------------------------------------------
   Nav: hide on scroll down, glass on scroll
------------------------------------------------------------ */
const nav = document.getElementById("nav");
let lastY = 0;
ScrollTrigger.create({
  start: 0,
  end: "max",
  onUpdate: (self) => {
    const y = self.scroll();
    nav.classList.toggle("is-scrolled", y > 40);
    if (y > 500 && y > lastY && !menuOpen) nav.classList.add("is-hidden");
    else nav.classList.remove("is-hidden");
    lastY = y;
  },
});

/* ------------------------------------------------------------
   Mobile menu
------------------------------------------------------------ */
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");
let menuOpen = false;

function openMenu() {
  menuOpen = true;
  burger.classList.add("is-open");
  burger.setAttribute("aria-expanded", "true");
  menu.setAttribute("aria-hidden", "false");
  gsap.set(menu, { visibility: "visible" });
  gsap.to(menu, { clipPath: "inset(0% 0 0% 0)", duration: 0.7, ease: "power4.inOut" });
  gsap.fromTo(".menu__link", { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.06, delay: 0.25, ease: "power3.out" });
  if (lenis) lenis.stop();
}
function closeMenu() {
  if (!menuOpen) return;
  menuOpen = false;
  burger.classList.remove("is-open");
  burger.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-hidden", "true");
  gsap.to(menu, {
    clipPath: "inset(0 0 100% 0)", duration: 0.6, ease: "power4.inOut",
    onComplete: () => gsap.set(menu, { visibility: "hidden" }),
  });
  if (lenis) lenis.start();
}
gsap.set(menu, { clipPath: "inset(0 0 100% 0)" });
burger.addEventListener("click", () => (menuOpen ? closeMenu() : openMenu()));
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

/* ------------------------------------------------------------
   Marquee
------------------------------------------------------------ */
const track = document.getElementById("marqueeTrack");
const group = track.querySelector(".marquee__group");
for (let i = 0; i < 3; i++) track.appendChild(group.cloneNode(true));
if (!prefersReducedMotion) {
  gsap.to(track, {
    x: () => -group.offsetWidth,
    duration: 22,
    ease: "none",
    repeat: -1,
  });
}

/* ------------------------------------------------------------
   Statement: word-by-word brighten on scroll
------------------------------------------------------------ */
const statement = document.getElementById("statementText");
if (statement) {
  // split into word spans, preserving <em>
  const splitWords = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
          else if (part) {
            const span = document.createElement("span");
            span.className = "word";
            span.textContent = part;
            frag.appendChild(span);
          }
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        splitWords(child);
      }
    });
  };
  splitWords(statement);

  gsap.to(statement.querySelectorAll(".word"), {
    opacity: 1,
    stagger: 0.06,
    ease: "none",
    scrollTrigger: {
      trigger: statement,
      start: "top 80%",
      end: "bottom 45%",
      scrub: 0.5,
    },
  });
}

/* ------------------------------------------------------------
   Generic section reveals
------------------------------------------------------------ */
gsap.utils.toArray(".section-head").forEach((head) => {
  gsap.from(head.children, {
    y: 50, autoAlpha: 0, duration: 1, stagger: 0.12, ease: "power3.out",
    scrollTrigger: { trigger: head, start: "top 82%" },
  });
});

gsap.utils.toArray(".service-card").forEach((card, i) => {
  gsap.from(card, {
    y: 60, autoAlpha: 0, duration: 0.9, delay: (i % 2) * 0.1, ease: "power3.out",
    scrollTrigger: { trigger: card, start: "top 88%" },
  });
  // cursor-tracked glow
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

gsap.utils.toArray(".quote, .faq__item").forEach((el, i) => {
  gsap.from(el, {
    y: 40, autoAlpha: 0, duration: 0.8, ease: "power3.out",
    scrollTrigger: { trigger: el, start: "top 90%" },
  });
});

/* Results section scales in slightly */
gsap.from(".results", {
  scale: 0.96, autoAlpha: 0.4, duration: 1, ease: "power2.out",
  scrollTrigger: { trigger: ".results", start: "top 85%" },
});

/* ------------------------------------------------------------
   Process: progress bar + active step highlighting
------------------------------------------------------------ */
const steps = gsap.utils.toArray(".process-step");
const processBar = document.getElementById("processBar");
if (steps.length && processBar) {
  gsap.to(processBar, {
    scaleY: 1,
    ease: "none",
    scrollTrigger: {
      trigger: "#processSteps",
      start: "top 70%",
      end: "bottom 45%",
      scrub: 0.4,
      onUpdate: (self) => {
        const idx = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
        steps.forEach((s, i) => s.classList.toggle("is-active", i <= idx));
      },
    },
  });
}

/* ------------------------------------------------------------
   Counters
------------------------------------------------------------ */
gsap.utils.toArray(".counter").forEach((el) => {
  const target = parseFloat(el.dataset.target);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const suffix = el.dataset.suffix || "";
  const obj = { v: 0 };
  gsap.to(obj, {
    v: target,
    duration: 1.8,
    ease: "power2.out",
    scrollTrigger: { trigger: el, start: "top 85%" },
    onUpdate: () => (el.textContent = obj.v.toFixed(decimals) + suffix),
  });
});

/* ------------------------------------------------------------
   CTA title masked reveal
------------------------------------------------------------ */
gsap.from(".cta__title .line-inner", {
  yPercent: 110, duration: 1.1, stagger: 0.12, ease: "power4.out",
  scrollTrigger: { trigger: ".cta__title", start: "top 80%" },
});
gsap.from(".cta__sub, .cta .btn, .cta__note", {
  y: 30, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: "power3.out",
  scrollTrigger: { trigger: ".cta__title", start: "top 75%" },
});

/* ------------------------------------------------------------
   Footer wordmark parallax
------------------------------------------------------------ */
gsap.from(".footer__wordmark", {
  yPercent: 40,
  ease: "none",
  scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: 0.5 },
});

/* FAQ smooth open/close height */
document.querySelectorAll(".faq__item").forEach((item) => {
  const summary = item.querySelector("summary");
  const content = item.querySelector("p");
  summary.addEventListener("click", (e) => {
    if (prefersReducedMotion) return; // native behavior
    e.preventDefault();
    if (item.open) {
      gsap.to(content, {
        height: 0, opacity: 0, duration: 0.35, ease: "power2.inOut",
        onComplete: () => { item.open = false; gsap.set(content, { clearProps: "all" }); },
      });
    } else {
      item.open = true;
      gsap.from(content, { height: 0, opacity: 0, duration: 0.45, ease: "power3.out" });
    }
  });
});

/* Refresh ScrollTrigger after fonts/layout settle */
window.addEventListener("load", () => ScrollTrigger.refresh());
