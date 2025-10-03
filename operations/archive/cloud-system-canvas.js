/**
 * Canvas-Based Cloud System - High Performance Implementation
 * Enterprise-grade cloud background system using HTML5 Canvas
 */

'use strict';

// Configuration
const CloudConfig = Object.freeze({
    MOBILE_BREAKPOINT: 768,
    SCALE_FACTORS: { MOBILE: 1.0, DESKTOP: 1.4 }, // Increased mobile scale
    CLOUD_COUNTS: { MOBILE: 3, DESKTOP: 4 },
    ANIMATION: {
        ENABLED: true,
        SPEED: 0.0005, // Very slow drift
        OPACITY_VARIATION: 0.1
    },
    COLORS: {
        FILL: 'rgba(255, 255, 255, 0.85)',
        STROKE: 'rgba(70, 100, 130, 0.8)',
        STROKE_WIDTH: 2.2,
        BRUSH_LAYERS: 3, // Number of layered brush strokes
        LAYER_OPACITY_REDUCTION: 0.25,
        LAYER_WIDTH_REDUCTION: 0.3
    }
});

// 25 Unique Cloud Formation Templates - All Different Sizes and Shapes
const CloudFormations = Object.freeze([
    // Large Fluffy Clouds (1-8)
    { id: 'massive-cumulus', baseShape: 'cumulus', variant: 1, scale: { min: 1.2, max: 1.8 }, complexity: 'massive' },
    { id: 'giant-puffy', baseShape: 'cumulus', variant: 2, scale: { min: 1.1, max: 1.6 }, complexity: 'high' },
    { id: 'storm-anvil', baseShape: 'cumulus', variant: 3, scale: { min: 1.0, max: 1.4 }, complexity: 'dense' },
    { id: 'cotton-ball', baseShape: 'cumulus', variant: 4, scale: { min: 0.9, max: 1.3 }, complexity: 'fluffy' },
    { id: 'billowing-mass', baseShape: 'cumulus', variant: 5, scale: { min: 1.1, max: 1.5 }, complexity: 'billowy' },
    { id: 'mountain-cloud', baseShape: 'cumulus', variant: 6, scale: { min: 1.0, max: 1.4 }, complexity: 'towering' },
    { id: 'thunderhead', baseShape: 'cumulus', variant: 7, scale: { min: 1.2, max: 1.7 }, complexity: 'dramatic' },
    { id: 'chunky-puff', baseShape: 'cumulus', variant: 8, scale: { min: 0.8, max: 1.2 }, complexity: 'chunky' },
    
    // Medium Varied Shapes (9-16)
    { id: 'elongated-wisp', baseShape: 'wisp', variant: 1, scale: { min: 0.8, max: 1.2 }, complexity: 'stretched' },
    { id: 'curvy-stream', baseShape: 'wisp', variant: 2, scale: { min: 0.7, max: 1.1 }, complexity: 'flowing' },
    { id: 'broken-strand', baseShape: 'wisp', variant: 3, scale: { min: 0.6, max: 1.0 }, complexity: 'fragmented' },
    { id: 'wave-formation', baseShape: 'wisp', variant: 4, scale: { min: 0.8, max: 1.3 }, complexity: 'undulating' },
    { id: 'twisted-ribbon', baseShape: 'wisp', variant: 5, scale: { min: 0.7, max: 1.2 }, complexity: 'twisted' },
    { id: 'feathered-edge', baseShape: 'wisp', variant: 6, scale: { min: 0.6, max: 1.1 }, complexity: 'feathery' },
    { id: 'layered-sheet', baseShape: 'wisp', variant: 7, scale: { min: 0.9, max: 1.4 }, complexity: 'layered' },
    { id: 'wind-swept', baseShape: 'wisp', variant: 8, scale: { min: 0.8, max: 1.3 }, complexity: 'windblown' },
    
    // Tall Tower Clouds (17-21)
    { id: 'castle-tower', baseShape: 'tower', variant: 1, scale: { min: 0.9, max: 1.4 }, complexity: 'vertical' },
    { id: 'mushroom-top', baseShape: 'tower', variant: 2, scale: { min: 0.8, max: 1.3 }, complexity: 'capped' },
    { id: 'pillar-cloud', baseShape: 'tower', variant: 3, scale: { min: 0.7, max: 1.2 }, complexity: 'columnar' },
    { id: 'cauliflower', baseShape: 'tower', variant: 4, scale: { min: 0.8, max: 1.4 }, complexity: 'bumpy' },
    { id: 'stacked-puffs', baseShape: 'tower', variant: 5, scale: { min: 0.6, max: 1.1 }, complexity: 'stacked' },
    
    // Delicate High Clouds (22-25)
    { id: 'horse-tail', baseShape: 'cirrus', variant: 1, scale: { min: 0.5, max: 0.9 }, complexity: 'wispy' },
    { id: 'ice-crystals', baseShape: 'cirrus', variant: 2, scale: { min: 0.4, max: 0.8 }, complexity: 'crystalline' },
    { id: 'thread-cloud', baseShape: 'cirrus', variant: 3, scale: { min: 0.6, max: 1.0 }, complexity: 'threadlike' },
    { id: 'angel-hair', baseShape: 'cirrus', variant: 4, scale: { min: 0.5, max: 0.9 }, complexity: 'delicate' }
]);

/**
 * Canvas Cloud System - Main orchestrator class
 */
class CanvasCloudSystem {
    constructor(containerSelector = '.cloud-background') {
        this.container = document.querySelector(containerSelector);
        this.canvas = null;
        this.ctx = null;
        this.clouds = [];
        this.animationId = null;
        this.isInitialized = false;
        this.lastTime = 0;
        
        if (!this.container) {
            throw new Error(`Cloud container not found: ${containerSelector}`);
        }
    }

    /**
     * Initialize the canvas cloud system
     */
    init() {
        try {
            console.log('🌥️ Canvas Cloud System: Starting initialization...');
            this.createCanvas();
            this.setupCanvas();
            this.generateClouds(false); // First load uses sequential selection
            this.startAnimation();
            this.bindEvents();
            this.isInitialized = true;
            console.log('✅ Canvas Cloud System: Initialization complete');
        } catch (error) {
            console.error('❌ Canvas Cloud System initialization failed:', error);
            this.fallbackToStaticBackground();
        }
    }

    /**
     * Create canvas element
     */
    createCanvas() {
        console.log('🌥️ Canvas Cloud System: Creating canvas element...');
        
        // Remove any existing canvas
        const existingCanvas = this.container.querySelector('canvas');
        if (existingCanvas) {
            existingCanvas.remove();
        }

        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        console.log('✅ Canvas element created and added to container');
    }

    /**
     * Setup canvas with proper dimensions and DPI handling
     */
    setupCanvas() {
        const viewport = this.getViewportDimensions();
        const dpr = window.devicePixelRatio || 1;
        
        console.log('🌥️ Canvas Cloud System: Setting up canvas:', { viewport, dpr });
        
        // Set actual canvas size (accounting for device pixel ratio)
        this.canvas.width = viewport.width * dpr;
        this.canvas.height = viewport.height * dpr;
        
        // Scale context to ensure correct drawing operations
        this.ctx.scale(dpr, dpr);
        
        // Set CSS size to viewport dimensions
        this.canvas.style.width = viewport.width + 'px';
        this.canvas.style.height = viewport.height + 'px';
        
        console.log('✅ Canvas setup complete:', {
            canvasWidth: this.canvas.width,
            canvasHeight: this.canvas.height,
            cssWidth: this.canvas.style.width,
            cssHeight: this.canvas.style.height
        });
    }

    /**
     * Generate cloud positions and properties
     */
    generateClouds(useRandomFormations = true) {
        console.log('🌥️ Canvas Cloud System: Generating clouds...');
        const viewport = this.getViewportDimensions();
        const cloudCount = viewport.isMobile ? CloudConfig.CLOUD_COUNTS.MOBILE : CloudConfig.CLOUD_COUNTS.DESKTOP;
        const positions = this.calculatePositions(viewport);
        
        this.clouds = [];
        
        // Store previous formation IDs to avoid repeats
        if (!this.usedFormations) {
            this.usedFormations = new Set();
        }
        
        for (let i = 0; i < cloudCount; i++) {
            let formation;
            
            if (useRandomFormations) {
                // Select unique formations from all 25 variations
                let attempts = 0;
                do {
                    const randomIndex = Math.floor(Math.random() * CloudFormations.length);
                    formation = CloudFormations[randomIndex];
                    attempts++;
                } while (this.usedFormations.has(formation.id) && attempts < 50);
                
                this.usedFormations.add(formation.id);
                
                // Reset used formations if we've used most of them
                if (this.usedFormations.size > CloudFormations.length - cloudCount) {
                    this.usedFormations.clear();
                }
            } else {
                // Sequential selection for first load
                formation = CloudFormations[i % CloudFormations.length];
            }
            
            const position = positions[i];
            const baseScale = formation.scale.min + Math.random() * (formation.scale.max - formation.scale.min);
            const scaleFactor = viewport.isMobile ? CloudConfig.SCALE_FACTORS.MOBILE : CloudConfig.SCALE_FACTORS.DESKTOP;
            const scale = baseScale * scaleFactor;
            
            const cloud = {
                id: i + 1,
                formation,
                x: position.x,
                y: position.y,
                originalX: position.x,
                originalY: position.y,
                scale,
                opacity: 0.6 + Math.random() * 0.3,
                animationOffset: Math.random() * Math.PI * 2,
                drift: {
                    x: (Math.random() - 0.5) * 0.3,
                    y: (Math.random() - 0.5) * 0.2
                }
            };
            
            this.clouds.push(cloud);
            console.log(`🌥️ Created cloud ${cloud.id}:`, {
                formation: formation.id,
                position: { x: cloud.x, y: cloud.y },
                scale: cloud.scale
            });
        }
        
        console.log(`✅ Generated ${this.clouds.length} clouds from 25 unique formations`);
        this.renderClouds();
    }

    /**
     * Regenerate clouds with new random formations
     */
    regenerateClouds() {
        console.log('🌥️ Canvas Cloud System: Regenerating with new formations...');
        this.generateClouds(true); // Use random formations
    }

    /**
     * Calculate cloud positions across viewport
     */
    calculatePositions(viewport) {
        const { width, height, isMobile } = viewport;
        
        return isMobile ? [
            { x: width * 0.25, y: height * 0.20 },
            { x: width * 0.75, y: height * 0.30 },
            { x: width * 0.50, y: height * 0.65 }
        ] : [
            { x: width * 0.20, y: height * 0.25 },
            { x: width * 0.80, y: height * 0.20 },
            { x: width * 0.30, y: height * 0.60 },
            { x: width * 0.70, y: height * 0.50 }
        ];
    }

    /**
     * Render all clouds to canvas
     */
    renderClouds() {
        if (!this.ctx) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width / (window.devicePixelRatio || 1), this.canvas.height / (window.devicePixelRatio || 1));
        
        // Render each cloud
        this.clouds.forEach(cloud => {
            this.renderSingleCloud(cloud);
        });
        
        console.log('🌥️ Rendered all clouds to canvas');
    }

    /**
     * Render individual cloud with enhanced wispy details
     */
    renderSingleCloud(cloud) {
        const ctx = this.ctx;
        
        ctx.save();
        ctx.translate(cloud.x, cloud.y);
        ctx.scale(cloud.scale, cloud.scale);
        ctx.globalAlpha = cloud.opacity;
        
        // Draw main cloud body
        this.drawMainCloudBody(ctx, cloud);
        
        // Add wispy details for complexity
        this.drawWispyDetails(ctx, cloud);
        
        // Add subtle internal textures
        this.drawInternalTextures(ctx, cloud);
        
        ctx.restore();
    }

    /**
     * Draw the main cloud body with sophisticated brush strokes
     */
    drawMainCloudBody(ctx, cloud) {
        // Fill the cloud shape first
        ctx.fillStyle = CloudConfig.COLORS.FILL;
        ctx.strokeStyle = 'transparent';
        ctx.lineWidth = 0;
        
        this.drawCloudShape(ctx, cloud.formation, true); // Fill only
        
        // Draw layered brush strokes with varying weights and opacity
        this.drawLayeredBrushStrokes(ctx, cloud.formation);
    }

    /**
     * Draw layered brush strokes with sophisticated line weight variations
     */
    drawLayeredBrushStrokes(ctx, formation) {
        const baseOpacity = 0.8;
        const baseWidth = CloudConfig.COLORS.STROKE_WIDTH;
        
        // Draw multiple layers with decreasing opacity and width
        for (let layer = 0; layer < CloudConfig.COLORS.BRUSH_LAYERS; layer++) {
            const layerOpacity = baseOpacity * (1 - layer * CloudConfig.COLORS.LAYER_OPACITY_REDUCTION);
            const layerWidth = baseWidth * (1 - layer * CloudConfig.COLORS.LAYER_WIDTH_REDUCTION);
            
            // Add organic irregularities to each layer
            const irregularity = layer * 0.3; // More irregular with each layer
            
            ctx.strokeStyle = `rgba(70, 100, 130, ${layerOpacity})`;
            ctx.lineWidth = layerWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            // Draw the cloud shape with organic variations
            this.drawCloudShape(ctx, formation, false, irregularity);
        }
    }

    /**
     * Draw cloud shape with optional organic irregularities
     */
    drawCloudShape(ctx, formation, fillOnly = false, irregularity = 0) {
        switch (formation.baseShape) {
            case 'cumulus':
                this.drawCumulusCloud(ctx, formation.variant, formation.complexity, fillOnly, irregularity);
                break;
            case 'wisp':
                this.drawWispCloud(ctx, formation.variant, formation.complexity, fillOnly, irregularity);
                break;
            case 'tower':
                this.drawTowerCloud(ctx, formation.variant, formation.complexity, fillOnly, irregularity);
                break;
            case 'cirrus':
                this.drawCirrusCloud(ctx, formation.variant, formation.complexity, fillOnly, irregularity);
                break;
            default:
                this.drawCumulusCloud(ctx, 1, 'fluffy', fillOnly, irregularity);
        }
    }

    /**
     * Add wispy details with sophisticated brush strokes
     */
    drawWispyDetails(ctx, cloud) {
        const variant = cloud.formation.variant;
        const complexity = cloud.formation.complexity;
        
        // Draw wispy details with layered brush technique
        this.drawLayeredWispyStrokes(ctx, cloud.formation.baseShape, variant, complexity);
    }

    /**
     * Draw layered wispy strokes with varying opacity and weight
     */
    drawLayeredWispyStrokes(ctx, baseShape, variant, complexity) {
        const wispLayers = 2; // Fewer layers for wisps
        const baseOpacity = 0.6;
        const baseWidth = 1.4;
        
        for (let layer = 0; layer < wispLayers; layer++) {
            const layerOpacity = baseOpacity * (1 - layer * 0.4);
            const layerWidth = baseWidth * (1 - layer * 0.4);
            const irregularity = layer * 0.2;
            
            ctx.strokeStyle = `rgba(70, 100, 130, ${layerOpacity})`;
            ctx.lineWidth = layerWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.fillStyle = 'none';
            
            // Draw wispy patterns with organic variations
            switch (baseShape) {
                case 'cumulus':
                    this.drawCumulusWisps(ctx, variant, complexity, irregularity);
                    break;
                case 'wisp':
                    this.drawWispWisps(ctx, variant, complexity, irregularity);
                    break;
                case 'tower':
                    this.drawTowerWisps(ctx, variant, complexity, irregularity);
                    break;
                case 'cirrus':
                    this.drawCirrusWisps(ctx, variant, complexity, irregularity);
                    break;
            }
        }
    }

    /**
     * Add internal texture details with varying opacity
     */
    drawInternalTextures(ctx, cloud) {
        const lines = this.getInternalTextureLines(cloud.formation);
        
        // Draw texture lines with varying opacity and weight
        lines.forEach((line, index) => {
            const opacity = 0.15 + (index % 3) * 0.05; // Varying opacity
            const width = 0.6 + (index % 2) * 0.3; // Varying width
            
            ctx.strokeStyle = `rgba(70, 100, 130, ${opacity})`;
            ctx.lineWidth = width;
            ctx.lineCap = 'round';
            ctx.fillStyle = 'none';
            
            // Add subtle organic irregularities
            const irregularity = 0.5;
            const x1 = line.x1 + (Math.random() - 0.5) * irregularity;
            const y1 = line.y1 + (Math.random() - 0.5) * irregularity;
            const x2 = line.x2 + (Math.random() - 0.5) * irregularity;
            const y2 = line.y2 + (Math.random() - 0.5) * irregularity;
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.bezierCurveTo(line.cp1x, line.cp1y, line.cp2x, line.cp2y, x2, y2);
            ctx.stroke();
        });
    }

    /**
     * Apply organic irregularities to coordinates
     */
    applyIrregularity(x, y, amount) {
        return {
            x: x + (Math.random() - 0.5) * amount,
            y: y + (Math.random() - 0.5) * amount
        };
    }

    /**
     * Draw cumulus cloud formation with sophisticated brush strokes
     */
    drawCumulusCloud(ctx, variant = 1, complexity = 'fluffy', fillOnly = false, irregularity = 0) {
        ctx.beginPath();
        
        switch (variant) {
            case 1: // massive-cumulus
                const p1 = this.applyIrregularity(0, 0, irregularity);
                const p2 = this.applyIrregularity(-70, 15, irregularity);
                const p3 = this.applyIrregularity(-110, 50, irregularity);
                const p4 = this.applyIrregularity(-80, 100, irregularity);
                const p5 = this.applyIrregularity(30, 85, irregularity);
                const p6 = this.applyIrregularity(90, 50, irregularity);
                const p7 = this.applyIrregularity(60, 0, irregularity);
                
                ctx.moveTo(p1.x, p1.y);
                ctx.bezierCurveTo(-30 + irregularity, -25 + irregularity, -60 + irregularity, -15 + irregularity, p2.x, p2.y);
                ctx.bezierCurveTo(-90 + irregularity, 5 + irregularity, -120 + irregularity, 30 + irregularity, p3.x, p3.y);
                ctx.bezierCurveTo(-130 + irregularity, 60 + irregularity, -120 + irregularity, 100 + irregularity, p4.x, p4.y);
                ctx.bezierCurveTo(-50 + irregularity, 120 + irregularity, 10 + irregularity, 110 + irregularity, p5.x, p5.y);
                ctx.bezierCurveTo(60 + irregularity, 95 + irregularity, 100 + irregularity, 75 + irregularity, p6.x, p6.y);
                ctx.bezierCurveTo(110 + irregularity, 35 + irregularity, 100 + irregularity, 0 + irregularity, p7.x, p7.y);
                ctx.bezierCurveTo(45 + irregularity, -25 + irregularity, 15 + irregularity, -15 + irregularity, p1.x, p1.y);
                break;
                
            case 2: // giant-puffy
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-25, -22, -45, -12, -55, 12);
                ctx.bezierCurveTo(-75, -2, -95, 22, -85, 42);
                ctx.bezierCurveTo(-105, 52, -95, 85, -65, 85);
                ctx.bezierCurveTo(-45, 105, 5, 95, 25, 75);
                ctx.bezierCurveTo(50, 85, 80, 65, 70, 42);
                ctx.bezierCurveTo(90, 32, 80, -2, 50, -2);
                ctx.bezierCurveTo(38, -22, 12, -12, 0, 0);
                break;
                
            case 3: // storm-anvil
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-20, -30, -50, -20, -60, 10);
                ctx.bezierCurveTo(-80, -5, -110, 15, -100, 40);
                ctx.bezierCurveTo(-120, 45, -110, 70, -80, 75);
                ctx.bezierCurveTo(-60, 90, -10, 85, 15, 65);
                ctx.bezierCurveTo(40, 70, 90, 50, 85, 25);
                ctx.bezierCurveTo(100, 15, 95, -10, 70, -5);
                ctx.bezierCurveTo(55, -25, 25, -15, 0, 0);
                break;
                
            case 4: // cotton-ball
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-18, -18, -35, -8, -45, 12);
                ctx.bezierCurveTo(-60, 2, -75, 18, -70, 35);
                ctx.bezierCurveTo(-80, 40, -75, 60, -50, 65);
                ctx.bezierCurveTo(-35, 75, 0, 70, 18, 55);
                ctx.bezierCurveTo(35, 60, 55, 45, 50, 30);
                ctx.bezierCurveTo(65, 22, 60, 2, 40, 2);
                ctx.bezierCurveTo(32, -15, 10, -8, 0, 0);
                break;
                
            case 5: // billowing-mass
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-22, -20, -40, -10, -50, 10);
                ctx.bezierCurveTo(-70, 0, -90, 20, -80, 40);
                ctx.bezierCurveTo(-100, 50, -90, 80, -60, 80);
                ctx.bezierCurveTo(-40, 100, 0, 90, 20, 70);
                ctx.bezierCurveTo(40, 80, 70, 60, 60, 40);
                ctx.bezierCurveTo(80, 30, 70, 0, 40, 0);
                ctx.bezierCurveTo(30, -20, 10, -10, 0, 0);
                break;
                
            case 6: // mountain-cloud
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-15, -25, -35, -15, -45, 8);
                ctx.bezierCurveTo(-65, -3, -85, 18, -75, 38);
                ctx.bezierCurveTo(-95, 43, -85, 75, -55, 78);
                ctx.bezierCurveTo(-35, 95, 5, 88, 25, 68);
                ctx.bezierCurveTo(45, 75, 75, 55, 65, 35);
                ctx.bezierCurveTo(85, 25, 75, -3, 45, 0);
                ctx.bezierCurveTo(35, -22, 12, -12, 0, 0);
                break;
                
            case 7: // thunderhead
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-28, -28, -55, -18, -65, 18);
                ctx.bezierCurveTo(-85, 8, -115, 28, -105, 55);
                ctx.bezierCurveTo(-125, 65, -115, 95, -85, 100);
                ctx.bezierCurveTo(-55, 115, 5, 108, 28, 88);
                ctx.bezierCurveTo(55, 98, 95, 78, 85, 55);
                ctx.bezierCurveTo(105, 45, 95, 8, 65, 8);
                ctx.bezierCurveTo(48, -25, 18, -15, 0, 0);
                break;
                
            case 8: // chunky-puff
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-16, -16, -32, -6, -40, 8);
                ctx.bezierCurveTo(-55, -2, -70, 14, -65, 28);
                ctx.bezierCurveTo(-75, 33, -70, 53, -45, 58);
                ctx.bezierCurveTo(-25, 68, 0, 63, 16, 48);
                ctx.bezierCurveTo(32, 53, 52, 38, 47, 23);
                ctx.bezierCurveTo(62, 15, 57, -2, 37, -2);
                ctx.bezierCurveTo(29, -16, 8, -6, 0, 0);
                break;
        }
        
        ctx.closePath();
        
        if (fillOnly) {
            ctx.fill();
        } else {
            ctx.stroke();
        }
    }

    /**
     * Draw wisp cloud formation with sophisticated brush strokes
     */
    drawWispCloud(ctx, variant = 1, complexity = 'flowing', fillOnly = false, irregularity = 0) {
        ctx.beginPath();
        
        switch (variant) {
            case 1: // elongated-wisp
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-15, -8, -45, 0, -52, 15);
                ctx.bezierCurveTo(-60, 8, -82, 15, -75, 30);
                ctx.bezierCurveTo(-90, 35, -82, 48, -67, 52);
                ctx.bezierCurveTo(-45, 58, -15, 52, 0, 48);
                ctx.bezierCurveTo(22, 52, 52, 45, 60, 30);
                ctx.bezierCurveTo(75, 35, 90, 22, 82, 8);
                ctx.bezierCurveTo(67, 0, 45, 8, 30, 12);
                ctx.bezierCurveTo(22, -8, 0, 0, 0, 0);
                break;
                
            case 2: // curvy-stream
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-12, -6, -36, 2, -42, 12);
                ctx.bezierCurveTo(-48, 6, -66, 12, -60, 24);
                ctx.bezierCurveTo(-72, 28, -66, 38, -54, 42);
                ctx.bezierCurveTo(-36, 46, -12, 42, 0, 38);
                ctx.bezierCurveTo(18, 42, 42, 36, 48, 24);
                ctx.bezierCurveTo(60, 28, 72, 18, 66, 6);
                ctx.bezierCurveTo(54, 0, 36, 6, 24, 10);
                ctx.bezierCurveTo(18, -6, 0, 0, 0, 0);
                break;
                
            case 3: // broken-strand
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-8, -4, -24, 0, -28, 8);
                ctx.bezierCurveTo(-32, 4, -44, 8, -40, 16);
                ctx.bezierCurveTo(-48, 18, -44, 26, -36, 28);
                ctx.bezierCurveTo(-24, 30, -8, 28, 0, 26);
                ctx.bezierCurveTo(12, 28, 28, 24, 32, 16);
                ctx.bezierCurveTo(40, 18, 48, 12, 44, 4);
                ctx.bezierCurveTo(36, 0, 24, 4, 16, 6);
                ctx.bezierCurveTo(12, -4, 0, 0, 0, 0);
                break;
                
            case 4: // wave-formation
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-12, -7, -38, 0, -46, 13);
                ctx.bezierCurveTo(-52, 7, -70, 13, -64, 26);
                ctx.bezierCurveTo(-76, 30, -70, 42, -58, 46);
                ctx.bezierCurveTo(-38, 50, -12, 46, 0, 42);
                ctx.bezierCurveTo(19, 46, 46, 39, 52, 26);
                ctx.bezierCurveTo(64, 30, 76, 19, 70, 7);
                ctx.bezierCurveTo(58, 0, 38, 7, 26, 10);
                ctx.bezierCurveTo(19, -7, 0, 0, 0, 0);
                break;
                
            case 5: // twisted-ribbon
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-10, -5, -30, 0, -35, 10);
                ctx.bezierCurveTo(-40, 5, -55, 10, -50, 20);
                ctx.bezierCurveTo(-60, 22, -55, 32, -45, 35);
                ctx.bezierCurveTo(-30, 38, -10, 35, 0, 32);
                ctx.bezierCurveTo(15, 35, 35, 30, 40, 20);
                ctx.bezierCurveTo(50, 22, 60, 15, 55, 5);
                ctx.bezierCurveTo(45, 0, 30, 5, 20, 8);
                ctx.bezierCurveTo(15, -5, 0, 0, 0, 0);
                break;
                
            case 6: // feathered-edge
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-9, -4, -27, 0, -32, 9);
                ctx.bezierCurveTo(-36, 4, -49, 9, -45, 18);
                ctx.bezierCurveTo(-54, 20, -49, 29, -40, 32);
                ctx.bezierCurveTo(-27, 34, -9, 32, 0, 29);
                ctx.bezierCurveTo(13, 32, 32, 27, 36, 18);
                ctx.bezierCurveTo(45, 20, 54, 13, 49, 4);
                ctx.bezierCurveTo(40, 0, 27, 4, 18, 7);
                ctx.bezierCurveTo(13, -4, 0, 0, 0, 0);
                break;
                
            case 7: // layered-sheet
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-13, -6, -39, 0, -47, 13);
                ctx.bezierCurveTo(-52, 6, -71, 13, -65, 26);
                ctx.bezierCurveTo(-78, 30, -71, 42, -58, 46);
                ctx.bezierCurveTo(-39, 50, -13, 46, 0, 42);
                ctx.bezierCurveTo(19, 46, 47, 39, 52, 26);
                ctx.bezierCurveTo(65, 30, 78, 19, 71, 6);
                ctx.bezierCurveTo(58, 0, 39, 6, 26, 10);
                ctx.bezierCurveTo(19, -6, 0, 0, 0, 0);
                break;
                
            case 8: // wind-swept
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-11, -5, -33, 0, -38, 11);
                ctx.bezierCurveTo(-44, 5, -60, 11, -55, 22);
                ctx.bezierCurveTo(-66, 24, -60, 35, -49, 38);
                ctx.bezierCurveTo(-33, 42, -11, 38, 0, 35);
                ctx.bezierCurveTo(16, 38, 38, 33, 44, 22);
                ctx.bezierCurveTo(55, 24, 66, 16, 60, 5);
                ctx.bezierCurveTo(49, 0, 33, 5, 22, 9);
                ctx.bezierCurveTo(16, -5, 0, 0, 0, 0);
                break;
        }
        
        ctx.closePath();
        
        if (fillOnly) {
            ctx.fill();
        } else {
            ctx.stroke();
        }
    }

    /**
     * Draw tower cloud formation with sophisticated brush strokes
     */
    drawTowerCloud(ctx, variant = 1, complexity = 'vertical', fillOnly = false, irregularity = 0) {
        ctx.beginPath();
        
        switch (variant) {
            case 1: // castle-tower
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-18, -8, -36, 8, -42, 24);
                ctx.bezierCurveTo(-60, 12, -78, 30, -66, 48);
                ctx.bezierCurveTo(-84, 54, -72, 78, -48, 84);
                ctx.bezierCurveTo(-24, 90, 6, 84, 24, 66);
                ctx.bezierCurveTo(42, 72, 66, 54, 60, 36);
                ctx.bezierCurveTo(78, 30, 72, 6, 54, 6);
                ctx.bezierCurveTo(48, -12, 30, 0, 12, 6);
                ctx.bezierCurveTo(6, -12, 0, 0, 0, 0);
                break;
                
            case 2: // mushroom-top
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-15, -5, -30, 5, -35, 20);
                ctx.bezierCurveTo(-50, 10, -65, 25, -55, 40);
                ctx.bezierCurveTo(-70, 45, -60, 65, -40, 70);
                ctx.bezierCurveTo(-20, 75, 5, 70, 20, 55);
                ctx.bezierCurveTo(35, 60, 55, 45, 50, 30);
                ctx.bezierCurveTo(65, 25, 60, 5, 45, 5);
                ctx.bezierCurveTo(40, -10, 25, 0, 10, 5);
                ctx.bezierCurveTo(5, -10, 0, 0, 0, 0);
                break;
                
            case 3: // pillar-cloud
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-12, -4, -24, 4, -28, 16);
                ctx.bezierCurveTo(-40, 8, -52, 20, -44, 32);
                ctx.bezierCurveTo(-56, 36, -48, 52, -32, 56);
                ctx.bezierCurveTo(-16, 60, 4, 56, 16, 44);
                ctx.bezierCurveTo(28, 48, 44, 36, 40, 24);
                ctx.bezierCurveTo(52, 20, 48, 4, 36, 4);
                ctx.bezierCurveTo(32, -8, 20, 0, 8, 4);
                ctx.bezierCurveTo(4, -8, 0, 0, 0, 0);
                break;
                
            case 4: // cauliflower
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-16, -6, -32, 6, -38, 22);
                ctx.bezierCurveTo(-54, 14, -70, 28, -62, 44);
                ctx.bezierCurveTo(-78, 50, -70, 72, -46, 78);
                ctx.bezierCurveTo(-22, 84, 6, 78, 22, 62);
                ctx.bezierCurveTo(38, 68, 62, 50, 56, 32);
                ctx.bezierCurveTo(70, 26, 66, 6, 50, 6);
                ctx.bezierCurveTo(44, -10, 28, 0, 12, 6);
                ctx.bezierCurveTo(6, -10, 0, 0, 0, 0);
                break;
                
            case 5: // stacked-puffs
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-10, -2, -20, 2, -24, 12);
                ctx.bezierCurveTo(-34, 6, -44, 16, -38, 26);
                ctx.bezierCurveTo(-48, 30, -42, 42, -28, 46);
                ctx.bezierCurveTo(-14, 50, 2, 46, 14, 36);
                ctx.bezierCurveTo(26, 40, 38, 30, 34, 20);
                ctx.bezierCurveTo(44, 16, 40, 2, 30, 2);
                ctx.bezierCurveTo(26, -6, 16, 0, 6, 2);
                ctx.bezierCurveTo(2, -6, 0, 0, 0, 0);
                break;
        }
        
        ctx.closePath();
        
        if (fillOnly) {
            ctx.fill();
        } else {
            ctx.stroke();
        }
    }

    /**
     * Draw cirrus cloud formation with sophisticated brush strokes
     */
    drawCirrusCloud(ctx, variant = 1, complexity = 'wispy', fillOnly = false, irregularity = 0) {
        ctx.beginPath();
        
        switch (variant) {
            case 1: // horse-tail
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-10, -4, -20, 2, -24, 10);
                ctx.bezierCurveTo(-30, 8, -38, 12, -34, 20);
                ctx.bezierCurveTo(-42, 22, -38, 32, -28, 34);
                ctx.bezierCurveTo(-18, 36, 0, 34, 6, 28);
                ctx.bezierCurveTo(16, 30, 26, 26, 24, 20);
                ctx.bezierCurveTo(30, 18, 26, 10, 20, 10);
                ctx.bezierCurveTo(18, 6, 12, 8, 6, 11);
                ctx.bezierCurveTo(4, 4, 0, 0, 0, 0);
                break;
                
            case 2: // ice-crystals
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-6, -2, -12, 1, -14, 6);
                ctx.bezierCurveTo(-18, 4, -24, 7, -21, 13);
                ctx.bezierCurveTo(-27, 15, -24, 21, -18, 23);
                ctx.bezierCurveTo(-12, 25, 0, 23, 4, 19);
                ctx.bezierCurveTo(10, 21, 17, 18, 16, 13);
                ctx.bezierCurveTo(20, 11, 17, 6, 13, 6);
                ctx.bezierCurveTo(12, 3, 8, 5, 4, 7);
                ctx.bezierCurveTo(2, 2, 0, 0, 0, 0);
                break;
                
            case 3: // thread-cloud
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-8, -3, -15, 1, -18, 8);
                ctx.bezierCurveTo(-22, 6, -28, 10, -25, 16);
                ctx.bezierCurveTo(-30, 18, -27, 25, -20, 27);
                ctx.bezierCurveTo(-12, 29, 0, 27, 5, 23);
                ctx.bezierCurveTo(12, 25, 20, 21, 19, 16);
                ctx.bezierCurveTo(23, 14, 20, 8, 16, 8);
                ctx.bezierCurveTo(14, 5, 10, 7, 5, 9);
                ctx.bezierCurveTo(3, 3, 0, 0, 0, 0);
                break;
                
            case 4: // angel-hair
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-7, -2, -13, 1, -16, 7);
                ctx.bezierCurveTo(-19, 5, -25, 9, -22, 14);
                ctx.bezierCurveTo(-27, 16, -24, 22, -18, 24);
                ctx.bezierCurveTo(-11, 26, 0, 24, 4, 20);
                ctx.bezierCurveTo(10, 22, 18, 19, 17, 14);
                ctx.bezierCurveTo(21, 12, 18, 7, 14, 7);
                ctx.bezierCurveTo(13, 4, 9, 6, 4, 8);
                ctx.bezierCurveTo(2, 2, 0, 0, 0, 0);
                break;
        }
        
        ctx.closePath();
        
        if (fillOnly) {
            ctx.fill();
        } else {
            ctx.stroke();
        }
    }

    /**
     * Draw wispy details for cumulus clouds with organic variations
     */
    drawCumulusWisps(ctx, variant, complexity, irregularity = 0) {
        ctx.beginPath();
        
        switch (variant) {
            case 1: // massive-cumulus - dramatic wisps
                ctx.moveTo(-15, -10);
                ctx.bezierCurveTo(-25, -15, -35, -8, -45, -12);
                ctx.moveTo(25, 15);
                ctx.bezierCurveTo(35, 8, 45, 18, 55, 12);
                ctx.moveTo(-20, 45);
                ctx.bezierCurveTo(-30, 50, -25, 60, -35, 55);
                ctx.moveTo(30, -5);
                ctx.bezierCurveTo(40, -12, 50, -5, 60, -10);
                break;
                
            case 2: // giant-puffy - flowing wisps
                ctx.moveTo(-12, -8);
                ctx.bezierCurveTo(-22, -12, -28, -5, -38, -9);
                ctx.moveTo(18, 12);
                ctx.bezierCurveTo(28, 8, 35, 15, 42, 10);
                ctx.moveTo(-15, 35);
                ctx.bezierCurveTo(-25, 40, -20, 48, -30, 45);
                break;
                
            case 3: // storm-anvil - sharp wisps
                ctx.moveTo(-18, -15);
                ctx.bezierCurveTo(-30, -25, -40, -18, -52, -22);
                ctx.moveTo(35, 8);
                ctx.bezierCurveTo(48, 2, 58, 12, 68, 5);
                ctx.moveTo(-25, 25);
                ctx.bezierCurveTo(-38, 32, -30, 42, -42, 38);
                ctx.moveTo(45, -8);
                ctx.bezierCurveTo(58, -15, 68, -8, 78, -12);
                break;
                
            case 4: // cotton-ball - soft wisps
                ctx.moveTo(-8, -6);
                ctx.bezierCurveTo(-15, -9, -20, -3, -25, -7);
                ctx.moveTo(12, 8);
                ctx.bezierCurveTo(18, 5, 23, 12, 28, 8);
                ctx.moveTo(-10, 25);
                ctx.bezierCurveTo(-16, 30, -12, 35, -18, 32);
                break;
                
            case 5: // billowing-mass - billowy wisps
                ctx.moveTo(-16, -12);
                ctx.bezierCurveTo(-24, -18, -32, -10, -40, -15);
                ctx.moveTo(20, 10);
                ctx.bezierCurveTo(28, 5, 36, 15, 44, 8);
                ctx.moveTo(-18, 38);
                ctx.bezierCurveTo(-26, 45, -22, 52, -30, 48);
                ctx.moveTo(25, -3);
                ctx.bezierCurveTo(33, -8, 41, -2, 49, -6);
                break;
                
            case 6: // mountain-cloud - rocky wisps
                ctx.moveTo(-10, -12);
                ctx.bezierCurveTo(-18, -18, -25, -10, -32, -15);
                ctx.moveTo(15, 8);
                ctx.bezierCurveTo(23, 3, 30, 12, 37, 6);
                ctx.moveTo(-12, 32);
                ctx.bezierCurveTo(-20, 38, -16, 45, -24, 42);
                break;
                
            case 7: // thunderhead - electric wisps
                ctx.moveTo(-20, -18);
                ctx.bezierCurveTo(-32, -28, -42, -20, -54, -25);
                ctx.moveTo(28, 5);
                ctx.bezierCurveTo(40, -2, 50, 8, 60, 2);
                ctx.moveTo(-22, 42);
                ctx.bezierCurveTo(-34, 50, -28, 58, -40, 55);
                ctx.moveTo(35, -5);
                ctx.bezierCurveTo(47, -12, 57, -5, 67, -10);
                break;
                
            case 8: // chunky-puff - textured wisps
                ctx.moveTo(-6, -5);
                ctx.bezierCurveTo(-12, -8, -16, -2, -20, -6);
                ctx.moveTo(8, 6);
                ctx.bezierCurveTo(14, 3, 18, 9, 22, 5);
                ctx.moveTo(-8, 20);
                ctx.bezierCurveTo(-14, 25, -10, 30, -16, 27);
                break;
        }
        
        ctx.stroke();
    }

    /**
     * Draw wispy details for wisp clouds
     */
    drawWispWisps(ctx, variant, complexity, irregularity = 0) {
        ctx.beginPath();
        
        switch (variant) {
            case 1: // elongated-wisp - streaming wisps
                ctx.moveTo(-25, 5);
                ctx.bezierCurveTo(-35, 2, -45, 8, -55, 3);
                ctx.moveTo(15, -3);
                ctx.bezierCurveTo(25, -6, 35, 0, 45, -4);
                ctx.moveTo(-20, 18);
                ctx.bezierCurveTo(-30, 22, -25, 28, -35, 25);
                ctx.moveTo(20, 12);
                ctx.bezierCurveTo(30, 8, 40, 15, 50, 10);
                break;
                
            case 2: // curvy-stream - flowing wisps
                ctx.moveTo(-18, 3);
                ctx.bezierCurveTo(-26, 0, -34, 6, -42, 2);
                ctx.moveTo(12, -2);
                ctx.bezierCurveTo(20, -5, 28, 1, 36, -3);
                ctx.moveTo(-15, 15);
                ctx.bezierCurveTo(-23, 18, -18, 24, -26, 21);
                break;
                
            case 3: // broken-strand - fragmented wisps
                ctx.moveTo(-12, 2);
                ctx.bezierCurveTo(-16, 0, -20, 4, -24, 1);
                ctx.moveTo(-8, 8);
                ctx.bezierCurveTo(-12, 6, -16, 10, -20, 7);
                ctx.moveTo(8, -1);
                ctx.bezierCurveTo(12, -3, 16, 1, 20, -2);
                ctx.moveTo(12, 6);
                ctx.bezierCurveTo(16, 4, 20, 8, 24, 5);
                break;
                
            case 4: // wave-formation - undulating wisps
                ctx.moveTo(-20, 4);
                ctx.bezierCurveTo(-28, 1, -36, 7, -44, 3);
                ctx.moveTo(14, -2);
                ctx.bezierCurveTo(22, -5, 30, 1, 38, -3);
                ctx.moveTo(-16, 16);
                ctx.bezierCurveTo(-24, 19, -19, 25, -27, 22);
                ctx.moveTo(18, 11);
                ctx.bezierCurveTo(26, 8, 34, 14, 42, 10);
                break;
                
            case 5: // twisted-ribbon - spiraling wisps
                ctx.moveTo(-15, 2);
                ctx.bezierCurveTo(-22, -1, -28, 5, -35, 1);
                ctx.moveTo(10, -1);
                ctx.bezierCurveTo(17, -4, 23, 2, 30, -2);
                ctx.moveTo(-12, 12);
                ctx.bezierCurveTo(-19, 15, -14, 21, -21, 18);
                break;
                
            case 6: // feathered-edge - delicate wisps
                ctx.moveTo(-14, 3);
                ctx.bezierCurveTo(-19, 1, -24, 5, -29, 2);
                ctx.moveTo(9, -1);
                ctx.bezierCurveTo(14, -3, 19, 1, 24, -2);
                ctx.moveTo(-11, 11);
                ctx.bezierCurveTo(-16, 14, -12, 18, -17, 16);
                break;
                
            case 7: // layered-sheet - layered wisps
                ctx.moveTo(-22, 4);
                ctx.bezierCurveTo(-30, 1, -38, 7, -46, 3);
                ctx.moveTo(16, -2);
                ctx.bezierCurveTo(24, -5, 32, 1, 40, -3);
                ctx.moveTo(-18, 16);
                ctx.bezierCurveTo(-26, 19, -21, 25, -29, 22);
                ctx.moveTo(20, 11);
                ctx.bezierCurveTo(28, 8, 36, 14, 44, 10);
                break;
                
            case 8: // wind-swept - blown wisps
                ctx.moveTo(-17, 3);
                ctx.bezierCurveTo(-25, 0, -33, 6, -41, 2);
                ctx.moveTo(13, -2);
                ctx.bezierCurveTo(21, -5, 29, 1, 37, -3);
                ctx.moveTo(-14, 14);
                ctx.bezierCurveTo(-22, 17, -17, 23, -25, 20);
                break;
        }
        
        ctx.stroke();
    }

    /**
     * Draw wispy details for tower clouds
     */
    drawTowerWisps(ctx, variant, complexity, irregularity = 0) {
        ctx.beginPath();
        
        switch (variant) {
            case 1: // castle-tower - fortress wisps
                ctx.moveTo(-15, -5);
                ctx.bezierCurveTo(-22, -10, -28, -2, -35, -7);
                ctx.moveTo(12, 8);
                ctx.bezierCurveTo(19, 3, 25, 12, 32, 6);
                ctx.moveTo(-8, 35);
                ctx.bezierCurveTo(-15, 40, -10, 48, -18, 45);
                ctx.moveTo(15, -3);
                ctx.bezierCurveTo(22, -8, 28, -1, 35, -5);
                break;
                
            case 2: // mushroom-top - capped wisps
                ctx.moveTo(-10, -2);
                ctx.bezierCurveTo(-15, -5, -20, 1, -25, -3);
                ctx.moveTo(8, 5);
                ctx.bezierCurveTo(13, 2, 18, 8, 23, 4);
                ctx.moveTo(-5, 25);
                ctx.bezierCurveTo(-10, 30, -6, 35, -12, 32);
                break;
                
            case 3: // pillar-cloud - columnar wisps
                ctx.moveTo(-8, -2);
                ctx.bezierCurveTo(-12, -5, -16, 1, -20, -3);
                ctx.moveTo(6, 4);
                ctx.bezierCurveTo(10, 1, 14, 7, 18, 3);
                ctx.moveTo(-4, 20);
                ctx.bezierCurveTo(-8, 25, -4, 30, -10, 27);
                break;
                
            case 4: // cauliflower - bumpy wisps
                ctx.moveTo(-12, -3);
                ctx.bezierCurveTo(-18, -7, -23, 0, -29, -4);
                ctx.moveTo(9, 6);
                ctx.bezierCurveTo(15, 2, 20, 9, 26, 5);
                ctx.moveTo(-6, 30);
                ctx.bezierCurveTo(-12, 35, -8, 42, -15, 38);
                break;
                
            case 5: // stacked-puffs - tiered wisps
                ctx.moveTo(-6, -1);
                ctx.bezierCurveTo(-9, -3, -12, 1, -15, -2);
                ctx.moveTo(4, 3);
                ctx.bezierCurveTo(7, 1, 10, 5, 13, 2);
                ctx.moveTo(-3, 15);
                ctx.bezierCurveTo(-6, 18, -3, 22, -8, 20);
                break;
        }
        
        ctx.stroke();
    }

    /**
     * Draw wispy details for cirrus clouds
     */
    drawCirrusWisps(ctx, variant, complexity, irregularity = 0) {
        ctx.beginPath();
        
        switch (variant) {
            case 1: // horse-tail - flowing wisps
                ctx.moveTo(-8, 2);
                ctx.bezierCurveTo(-12, 0, -16, 4, -20, 1);
                ctx.moveTo(4, -1);
                ctx.bezierCurveTo(8, -3, 12, 1, 16, -2);
                ctx.moveTo(-5, 12);
                ctx.bezierCurveTo(-9, 15, -5, 18, -10, 16);
                ctx.moveTo(6, 8);
                ctx.bezierCurveTo(10, 6, 14, 10, 18, 7);
                break;
                
            case 2: // ice-crystals - crystalline wisps
                ctx.moveTo(-4, 1);
                ctx.bezierCurveTo(-6, 0, -8, 2, -10, 0);
                ctx.moveTo(2, -0.5);
                ctx.bezierCurveTo(4, -1.5, 6, 0.5, 8, -1);
                ctx.moveTo(-2, 8);
                ctx.bezierCurveTo(-4, 9, -2, 11, -5, 10);
                ctx.moveTo(3, 6);
                ctx.bezierCurveTo(5, 5, 7, 7, 9, 6);
                break;
                
            case 3: // thread-cloud - thread wisps
                ctx.moveTo(-6, 1);
                ctx.bezierCurveTo(-9, -1, -12, 3, -15, 0);
                ctx.moveTo(3, -1);
                ctx.bezierCurveTo(6, -3, 9, 1, 12, -2);
                ctx.moveTo(-3, 9);
                ctx.bezierCurveTo(-6, 12, -3, 15, -7, 13);
                break;
                
            case 4: // angel-hair - delicate wisps
                ctx.moveTo(-5, 1);
                ctx.bezierCurveTo(-7, 0, -9, 2, -11, 0);
                ctx.moveTo(2, -0.5);
                ctx.bezierCurveTo(4, -1.5, 6, 0.5, 8, -1);
                ctx.moveTo(-2, 7);
                ctx.bezierCurveTo(-4, 8, -2, 10, -5, 9);
                break;
        }
        
        ctx.stroke();
    }

    /**
     * Get internal texture lines for different formations
     */
    getInternalTextureLines(formation) {
        const lines = [];
        
        switch (formation.baseShape) {
            case 'cumulus':
                switch (formation.variant) {
                    case 1: // massive-cumulus
                        lines.push(
                            { x1: -20, y1: 10, cp1x: -30, cp1y: 15, cp2x: -35, cp2y: 25, x2: -25, y2: 30 },
                            { x1: 15, y1: 20, cp1x: 25, cp1y: 25, cp2x: 30, cp2y: 35, x2: 20, y2: 40 },
                            { x1: -10, y1: 45, cp1x: 0, cp1y: 50, cp2x: 5, cp2y: 55, x2: 10, y2: 50 }
                        );
                        break;
                    case 2: // giant-puffy
                        lines.push(
                            { x1: -15, y1: 8, cp1x: -22, cp1y: 12, cp2x: -28, cp2y: 20, x2: -18, y2: 25 },
                            { x1: 12, y1: 15, cp1x: 20, cp1y: 20, cp2x: 25, cp2y: 28, x2: 15, y2: 32 }
                        );
                        break;
                    default:
                        lines.push(
                            { x1: -10, y1: 5, cp1x: -15, cp1y: 10, cp2x: -20, cp2y: 15, x2: -12, y2: 20 },
                            { x1: 8, y1: 10, cp1x: 15, cp1y: 15, cp2x: 18, cp2y: 20, x2: 10, y2: 25 }
                        );
                }
                break;
                
            case 'wisp':
                lines.push(
                    { x1: -15, y1: 5, cp1x: -20, cp1y: 8, cp2x: -25, cp2y: 12, x2: -18, y2: 15 },
                    { x1: 10, y1: 3, cp1x: 15, cp1y: 6, cp2x: 20, cp2y: 9, x2: 12, y2: 12 }
                );
                break;
                
            case 'tower':
                lines.push(
                    { x1: -8, y1: 15, cp1x: -12, cp1y: 20, cp2x: -15, cp2y: 30, x2: -10, y2: 35 },
                    { x1: 6, y1: 10, cp1x: 10, cp1y: 15, cp2x: 12, cp2y: 25, x2: 8, y2: 30 }
                );
                break;
                
            case 'cirrus':
                lines.push(
                    { x1: -5, y1: 3, cp1x: -8, cp1y: 5, cp2x: -10, cp2y: 8, x2: -6, y2: 10 },
                    { x1: 3, y1: 2, cp1x: 6, cp1y: 4, cp2x: 8, cp2y: 6, x2: 4, y2: 8 }
                );
                break;
        }
        
        return lines;
    }

    /**
     * Start animation loop
     */
    startAnimation() {
        if (!CloudConfig.ANIMATION.ENABLED) return;
        
        console.log('🌥️ Starting cloud animation...');
        
        const animate = (currentTime) => {
            if (!this.isInitialized) return;
            
            const deltaTime = currentTime - this.lastTime;
            this.lastTime = currentTime;
            
            // Update cloud positions with subtle drift
            this.clouds.forEach(cloud => {
                const time = currentTime * CloudConfig.ANIMATION.SPEED;
                cloud.x = cloud.originalX + Math.sin(time + cloud.animationOffset) * 20 * cloud.drift.x;
                cloud.y = cloud.originalY + Math.cos(time * 0.7 + cloud.animationOffset) * 15 * cloud.drift.y;
                cloud.opacity = (0.6 + Math.sin(time * 0.5 + cloud.animationOffset) * CloudConfig.ANIMATION.OPACITY_VARIATION);
            });
            
            this.renderClouds();
            this.animationId = requestAnimationFrame(animate);
        };
        
        this.animationId = requestAnimationFrame(animate);
    }

    /**
     * Get viewport dimensions
     */
    getViewportDimensions() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            isMobile: window.innerWidth <= CloudConfig.MOBILE_BREAKPOINT
        };
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    /**
     * Handle window resize
     */
    handleResize() {
        if (this.isInitialized) {
            console.log('🌥️ Canvas Cloud System: Handling resize...');
            this.setupCanvas();
            this.generateClouds(false); // Use sequential for resize, not random
        }
    }

    /**
     * Fallback for initialization failures
     */
    fallbackToStaticBackground() {
        console.warn('🌥️ Canvas Cloud System: Using static background fallback');
        // CSS gradient background will show instead
    }

    /**
     * Destroy cloud system and clean up
     */
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        window.removeEventListener('resize', this.handleResize.bind(this));
        if (this.canvas) {
            this.canvas.remove();
        }
        this.clouds = [];
        this.isInitialized = false;
        console.log('🌥️ Canvas Cloud System: Destroyed successfully');
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌥️ Canvas Cloud System: DOM ready, starting initialization...');
    try {
        const cloudSystem = new CanvasCloudSystem();
        cloudSystem.init();
        
        // Make available globally for debugging
        window.CanvasCloudSystem = cloudSystem;
        
        console.log('✅ Canvas Cloud System: Ready for cloud gazing!');
        
    } catch (error) {
        console.error('❌ Failed to initialize canvas cloud system:', error);
        console.error('❌ Error stack:', error.stack);
    }
});