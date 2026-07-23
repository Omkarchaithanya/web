const initTechSequence = () => {
    // 1. Configuration
    const config = {
        totalFrames: 80,
        framePrefix: '/assets/images/tech-sequence/ssembly_',
        frameSuffix: '.jpg',
        zeroPad: 3,
        fps: 60,
        easeScrub: 0.18 // Smooth interpolation
    };

    const container = document.getElementById('tech-sequence-container');
    const canvas = document.getElementById('tech-sequence-canvas');
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    const progressEl = document.getElementById('sequence-loading-progress');
    const loadingOverlay = document.getElementById('sequence-loading-overlay');

    const frames = [];
    
    // Animation state
    const sequence = {
        targetFrame: 0,
        currentFrame: 0, 
        lastDrawnFrameIndex: -1 
    };

    let imagesLoaded = 0;
    let renderLoopActive = false;
    let resizeTimer = null;
    let lastTime = performance.now();
    
    // Accessibility
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 2. Preload & Decode Pipeline
    function getFrameUrl(index) {
        const paddedIndex = String(index).padStart(config.zeroPad, '0');
        return `${config.framePrefix}${paddedIndex}${config.frameSuffix}`;
    }

    async function loadFrame(i, isInitialLoad) {
        const img = new Image();
        const url = getFrameUrl(i);
        
        return new Promise((resolve) => {
            img.onload = async () => {
                if (img.decode) {
                    try {
                        await img.decode();
                    } catch(e) {}
                }
                
                let bitmap = img;
                if (window.createImageBitmap) {
                    try {
                        bitmap = await createImageBitmap(img);
                    } catch(e) {}
                }

                frames[i] = bitmap;
                imagesLoaded++;
                
                if (isInitialLoad && progressEl) {
                    // Calculate progress based on initial batch
                    const initialTotal = Math.min(30, config.totalFrames);
                    progressEl.textContent = `${Math.round((imagesLoaded / initialTotal) * 100)}%`;
                }
                resolve();
            };
            img.onerror = () => {
                console.error(`Failed to load frame ${i}`);
                resolve(); 
            };
            img.src = url;
        });
    }

    async function preloadInitialFrames() {
        const initialLoadCount = Math.min(30, config.totalFrames);
        const loadPromises = [];
        for (let i = 0; i < initialLoadCount; i++) {
            loadPromises.push(loadFrame(i, true));
        }
        await Promise.all(loadPromises);
    }

    function preloadRemainingFrames() {
        const initialLoadCount = Math.min(30, config.totalFrames);
        for (let i = initialLoadCount; i < config.totalFrames; i++) {
            loadFrame(i, false);
        }
    }

    // 3. Canvas Setup (High DPI)
    function setupCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const cw = rect.width;
        const ch = rect.height;
        
        // Reset transform to avoid scaling accumulation bugs
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        canvas.width = cw * dpr;
        canvas.height = ch * dpr;
        canvas.style.width = `${cw}px`;
        canvas.style.height = `${ch}px`;
        
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    let bgColor = '#0a0a0a';
    let bgColorSampled = false;

    // 4. Rendering Engine
    function drawFrame(index, force = false) {
        const frameIndex = Math.round(index);
        
        if (!force && frameIndex === sequence.lastDrawnFrameIndex) return;
        
        // Frames are 0-indexed in our array due to file names
        const frame = frames[frameIndex];
        if (!frame) return; // Not loaded yet
        
        const rect = canvas.getBoundingClientRect();
        const cw = rect.width;
        const ch = rect.height;
        const iw = frame.width || frame.naturalWidth;
        const ih = frame.height || frame.naturalHeight;

        // Sample background color once
        if (!bgColorSampled) {
            ctx.drawImage(frame, 0, 0, 1, 1, 0, 0, 1, 1);
            const p = ctx.getImageData(0, 0, 1, 1).data;
            bgColor = `rgb(${p[0]}, ${p[1]}, ${p[2]})`;
            bgColorSampled = true;
            
            const section = document.getElementById('tech-sequence-section');
            if (section) section.style.backgroundColor = bgColor;
        }

        function calculateProductFit(iw, ih, cw, ch) {
            const safeWidth = cw * 0.72;
            const safeHeight = ch * 0.82;
            const scale = Math.min(safeWidth / iw, safeHeight / ih);
            return {
                width: iw * scale,
                height: ih * scale
            };
        }

        const fit = calculateProductFit(iw, ih, cw, ch);
        const nw = Math.ceil(fit.width);
        const nh = Math.ceil(fit.height);
        const offsetX = Math.floor((cw - nw) / 2);
        const offsetY = Math.floor((ch - nh) / 2);

        // Fill background
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, cw, ch);
        
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.drawImage(frame, 0, 0, iw, ih, offsetX, offsetY, nw, nh);
        
        sequence.lastDrawnFrameIndex = frameIndex;
    }

    function resizeCanvas() {
        setupCanvas();
        drawFrame(sequence.currentFrame, true); 
        
        if (!prefersReducedMotion && typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }

    // 5. Decoupled Render Loop (Time-based Interpolation)
    function renderLoop(time) {
        if (!renderLoopActive) return;
        
        const deltaTime = time - lastTime;
        lastTime = time;

        const delta = sequence.targetFrame - sequence.currentFrame;
        
        // Stop rendering when idle to save CPU
        if (Math.abs(delta) < 0.01) {
            sequence.currentFrame = sequence.targetFrame;
            drawFrame(sequence.currentFrame);
            renderLoopActive = false;
            return;
        }

        sequence.currentFrame += delta * Math.min(0.25, deltaTime * 0.02);
        drawFrame(sequence.currentFrame);
        
        requestAnimationFrame(renderLoop);
    }

    // 6. GSAP ScrollTrigger Integration
    function initializeScrollAnimation() {
        if (prefersReducedMotion) {
            setupCanvas();
            drawFrame(0, true);
            if (loadingOverlay) loadingOverlay.style.opacity = '0';
            setTimeout(() => { if(loadingOverlay) loadingOverlay.style.display = 'none'; }, 500);
            return;
        }

        gsap.to(sequence, {
            targetFrame: config.totalFrames - 1, 
            ease: "none",
            scrollTrigger: {
                trigger: "#tech-sequence-section",
                start: "top top",
                end: "+=200%", 
                scrub: 0.5,
                anticipatePin: 1,
                fastScrollEnd: true,
                invalidateOnRefresh: true,
                pin: true,
                onUpdate: () => {
                    // Wake up render loop on scroll
                    if (!renderLoopActive) {
                        renderLoopActive = true;
                        lastTime = performance.now();
                        requestAnimationFrame(renderLoop);
                    }
                }
            }
        });
        
        // Initial wake up
        renderLoopActive = true;
        lastTime = performance.now();
        requestAnimationFrame(renderLoop);
    }

    // 7. Initialization
    async function init() {
        document.body.style.overflow = 'hidden';
        
        // Load only first 30 frames to get to interactive state immediately
        await preloadInitialFrames();
        
        setupCanvas();
        drawFrame(0, true);
        
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
                document.body.style.overflow = '';
                initializeScrollAnimation();
                preloadRemainingFrames(); // Lazy load the rest in background
            }, 600);
        } else {
            document.body.style.overflow = '';
            initializeScrollAnimation();
            preloadRemainingFrames();
        }
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resizeCanvas, 150); 
        }, { passive: true });
    }

    // Boot up
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        init();
    } else {
        console.error("GSAP or ScrollTrigger missing.");
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTechSequence);
} else {
    initTechSequence();
}
