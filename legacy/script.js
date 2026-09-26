/* =========================================
   AARAMBH CINEMATIC EXPERIENCE
========================================= */

gsap.registerPlugin(ScrollTrigger);

/* =========================================
   CONFIGURATION
========================================= */

const FRAME_COUNT = 240;

const FRAME_PATH = (index) => {
  const padded = String(index).padStart(4, "0");

  return `assets/frames/frame_${padded}.webp`;
};

/* =========================================
   DOM
========================================= */

const ambientLayer = document.getElementById("ambient-layer");

const ambientVideo = document.getElementById("ambient-video");

const canvas = document.getElementById("walkthrough-canvas");

const canvasWrapper = document.getElementById("canvas-wrapper");

const scrollHint = document.getElementById("scroll-hint");

const ctx = canvas.getContext("2d");

/* =========================================
   STATE
========================================= */

const state = {
  frame: 0,

  started: false,

  mouseX: 0,

  mouseY: 0,

  targetX: 0,

  targetY: 0,
};

/* =========================================
   FRAME STORAGE
========================================= */

const frames = new Array(FRAME_COUNT);

let loadedFrames = 0;

/* =========================================
   CANVAS RESOLUTION
========================================= */

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = window.innerWidth * dpr;

  canvas.height = window.innerHeight * dpr;

  canvas.style.width = `${window.innerWidth}px`;

  canvas.style.height = `${window.innerHeight}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  renderFrame(Math.round(state.frame));
}

window.addEventListener("resize", resizeCanvas);

/* =========================================
   IMAGE PRELOADING
========================================= */

function preloadFrames() {
  return new Promise((resolve) => {
    let completed = 0;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const image = new Image();

      image.src = FRAME_PATH(i);

      image.onload = () => {
        frames[i] = image;

        completed++;

        if (completed === FRAME_COUNT) {
          resolve();
        }
      };

      image.onerror = () => {
        console.error(`Failed to load frame ${i}`);

        completed++;

        if (completed === FRAME_COUNT) {
          resolve();
        }
      };
    }
  });
}

/* =========================================
   DRAW FRAME
========================================= */

function renderFrame(index) {
  const image = frames[index];

  if (!image) return;

  const canvasWidth = window.innerWidth;

  const canvasHeight = window.innerHeight;

  /*
        Cover calculation.

        This ensures the 16:9 frame
        fills the screen without distortion.
    */

  const imageRatio = image.width / image.height;

  const canvasRatio = canvasWidth / canvasHeight;

  let drawWidth;
  let drawHeight;

  let offsetX;
  let offsetY;

  if (imageRatio > canvasRatio) {
    drawHeight = canvasHeight;

    drawWidth = canvasHeight * imageRatio;

    offsetX = (canvasWidth - drawWidth) / 2;

    offsetY = 0;
  } else {
    drawWidth = canvasWidth;

    drawHeight = canvasWidth / imageRatio;

    offsetX = 0;

    offsetY = (canvasHeight - drawHeight) / 2;
  }

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  ctx.drawImage(
    image,

    offsetX,
    offsetY,

    drawWidth,
    drawHeight,
  );
}

/* =========================================
   MOUSE PARALLAX
========================================= */

function updateMouseParallax() {
  if (state.started) return;

  const maxX = 12;
  const maxY = 7;

  const x = state.targetX * maxX;

  const y = state.targetY * maxY;

  state.mouseX += (x - state.mouseX) * 0.08;

  state.mouseY += (y - state.mouseY) * 0.08;

  ambientVideo.style.transform = `
        translate3d(
            ${state.mouseX}px,
            ${state.mouseY}px,
            0
        )
        scale(1.03)
    `;

  requestAnimationFrame(updateMouseParallax);
}

/* =========================================
   MOUSE TRACKING
========================================= */

window.addEventListener("mousemove", (event) => {
  if (state.started) return;

  const normalizedX = (event.clientX / window.innerWidth) * 2 - 1;

  const normalizedY = (event.clientY / window.innerHeight) * 2 - 1;

  /*
            Invert X so the environment
            moves naturally opposite the cursor.
        */

  state.targetX = -normalizedX;

  state.targetY = -normalizedY;
});

/* =========================================
   START CINEMATIC EXPERIENCE
========================================= */

function startExperience() {
  if (state.started) return;

  state.started = true;

  /*
        Stop mouse interaction.
    */

  ambientVideo.style.pointerEvents = "none";

  /*
        Stop ambient video.
    */

  ambientVideo.pause();

  /*
        Hide scroll instruction.
    */

  gsap.to(scrollHint, {
    opacity: 0,
    duration: 0.25,
    overwrite: true,
  });

  /*
        Fade ambient scene away.
    */

  gsap.to(ambientLayer, {
    opacity: 0,
    duration: 0.35,
    ease: "power2.out",
    overwrite: true,
  });
}

/* =========================================
   DETECT FIRST SCROLL
========================================= */

let firstScrollDetected = false;

function handleFirstScroll() {
  if (firstScrollDetected) return;

  firstScrollDetected = true;

  startExperience();
}

window.addEventListener("wheel", handleFirstScroll, {
  passive: true,
});

/*
    Touch devices
*/

window.addEventListener("touchstart", handleFirstScroll, {
  passive: true,
});

/* =========================================
   GSAP FRAME ANIMATION
========================================= */

const frameAnimation = {
  frame: 0,
};

gsap.to(frameAnimation, {
  frame: FRAME_COUNT - 1,

  ease: "none",

  snap: {
    frame: 1,
  },

  scrollTrigger: {
    trigger: "#cinematic",

    start: "top top",

    end: "bottom top",

    scrub: 0.1,

    invalidateOnRefresh: true,
  },

  onUpdate: () => {
    const currentFrame = Math.round(frameAnimation.frame);

    state.frame = currentFrame;

    renderFrame(currentFrame);
  },
});

/* =========================================
   INITIALIZE
========================================= */

async function init() {
  resizeCanvas();

  /*
        Start loading frames.
    */

  console.log("Loading cinematic frames...");

  await preloadFrames();

  console.log("All frames loaded.");

  /*
        Render first frame behind
        the ambient video.
    */

  renderFrame(0);

  /*
        Start mouse animation loop.
    */

  requestAnimationFrame(updateMouseParallax);

  /*
        Refresh ScrollTrigger after
        everything is ready.
    */

  ScrollTrigger.refresh();
}

init();
