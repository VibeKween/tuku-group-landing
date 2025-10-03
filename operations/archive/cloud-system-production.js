/**
 * Production-Style Cloud System with 25 Unique Formations
 * Combines production brush stroke quality with our custom cloud shapes
 */

'use strict';

// Configuration matching production style
const CloudConfig = Object.freeze({
    MOBILE_BREAKPOINT: 768,
    SCALE_FACTORS: { MOBILE: 1.0, DESKTOP: 1.4 },
    CLOUD_COUNTS: { MOBILE: 3, DESKTOP: 4 },
    COLORS: {
        FILL: 'rgba(255, 255, 255, 0.85)',
        STROKE: 'rgba(70, 100, 130, 0.7)', // Slate blue as requested
        BASE_OPACITY: 0.7
    },
    ANIMATION: {
        ENABLED: false,
        SPEED: 0
    }
});

// 25 Unique Cloud Formation Templates (keeping our varieties)
const CloudFormations = Object.freeze([
    // Large Fluffy Clouds (1-8)
    { id: 'massive-cumulus', type: 'cumulus', variant: 1, scale: { min: 1.2, max: 1.8 }, complexity: 'high' },
    { id: 'giant-puffy', type: 'cumulus', variant: 2, scale: { min: 1.1, max: 1.6 }, complexity: 'high' },
    { id: 'storm-anvil', type: 'cumulus', variant: 3, scale: { min: 1.0, max: 1.4 }, complexity: 'dense' },
    { id: 'cotton-ball', type: 'cumulus', variant: 4, scale: { min: 0.9, max: 1.3 }, complexity: 'fluffy' },
    { id: 'billowing-mass', type: 'cumulus', variant: 5, scale: { min: 1.1, max: 1.5 }, complexity: 'billowy' },
    { id: 'mountain-cloud', type: 'cumulus', variant: 6, scale: { min: 1.0, max: 1.4 }, complexity: 'towering' },
    { id: 'thunderhead', type: 'cumulus', variant: 7, scale: { min: 1.2, max: 1.7 }, complexity: 'dramatic' },
    { id: 'chunky-puff', type: 'cumulus', variant: 8, scale: { min: 0.8, max: 1.2 }, complexity: 'chunky' },
    
    // Medium Varied Shapes (9-16)
    { id: 'elongated-wisp', type: 'wisp', variant: 1, scale: { min: 0.8, max: 1.2 }, complexity: 'stretched' },
    { id: 'curvy-stream', type: 'wisp', variant: 2, scale: { min: 0.7, max: 1.1 }, complexity: 'flowing' },
    { id: 'broken-strand', type: 'wisp', variant: 3, scale: { min: 0.6, max: 1.0 }, complexity: 'fragmented' },
    { id: 'wave-formation', type: 'wisp', variant: 4, scale: { min: 0.8, max: 1.3 }, complexity: 'undulating' },
    { id: 'twisted-ribbon', type: 'wisp', variant: 5, scale: { min: 0.7, max: 1.2 }, complexity: 'twisted' },
    { id: 'feathered-edge', type: 'wisp', variant: 6, scale: { min: 0.6, max: 1.1 }, complexity: 'feathery' },
    { id: 'layered-sheet', type: 'wisp', variant: 7, scale: { min: 0.9, max: 1.4 }, complexity: 'layered' },
    { id: 'wind-swept', type: 'wisp', variant: 8, scale: { min: 0.8, max: 1.3 }, complexity: 'windblown' },
    
    // Tall Tower Clouds (17-21)
    { id: 'castle-tower', type: 'tower', variant: 1, scale: { min: 0.9, max: 1.4 }, complexity: 'vertical' },
    { id: 'mushroom-top', type: 'tower', variant: 2, scale: { min: 0.8, max: 1.3 }, complexity: 'capped' },
    { id: 'pillar-cloud', type: 'tower', variant: 3, scale: { min: 0.7, max: 1.2 }, complexity: 'columnar' },
    { id: 'cauliflower', type: 'tower', variant: 4, scale: { min: 0.8, max: 1.4 }, complexity: 'bumpy' },
    { id: 'stacked-puffs', type: 'tower', variant: 5, scale: { min: 0.6, max: 1.1 }, complexity: 'stacked' },
    
    // Delicate High Clouds (22-25)
    { id: 'horse-tail', type: 'cirrus', variant: 1, scale: { min: 0.5, max: 0.9 }, complexity: 'wispy' },
    { id: 'ice-crystals', type: 'cirrus', variant: 2, scale: { min: 0.4, max: 0.8 }, complexity: 'crystalline' },
    { id: 'thread-cloud', type: 'cirrus', variant: 3, scale: { min: 0.6, max: 1.0 }, complexity: 'threadlike' },
    { id: 'angel-hair', type: 'cirrus', variant: 4, scale: { min: 0.5, max: 0.9 }, complexity: 'delicate' }
]);

/**
 * Production-Style Cloud System with Custom Formations
 */
class ProductionCloudSystem {
    constructor(containerSelector = '.cloud-background') {
        this.container = document.querySelector(containerSelector);
        this.canvas = null;
        this.ctx = null;
        this.clouds = [];
        this.isInitialized = false;
        this.animationId = null;
        this.lastTime = 0;
        this.usedFormations = new Set();
        
        if (!this.container) {
            throw new Error(`Cloud container not found: ${containerSelector}`);
        }
    }

    /**
     * Initialize the cloud system
     */
    init() {
        try {
            console.log('🌥️ Production Cloud System: Starting initialization...');
            this.setupCanvas();
            this.generate();
            this.initializeStaticLayer();
            this.bindEvents();
            this.isInitialized = true;
            console.log('✅ Production Cloud System: Initialization complete');
        } catch (error) {
            console.error('❌ Production Cloud System initialization failed:', error);
        }
    }

    /**
     * Setup canvas with production-style configuration
     */
    setupCanvas() {
        // Remove existing canvas
        const existingCanvas = this.container.querySelector('canvas');
        if (existingCanvas) {
            existingCanvas.remove();
        }

        // Create new canvas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'cloudCanvas';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        // Set canvas dimensions with high-DPI support (production style)
        const dpr = window.devicePixelRatio || 1;
        const rect = this.container.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        this.ctx.scale(dpr, dpr);
        
        console.log('✅ Canvas setup complete:', {
            width: rect.width,
            height: rect.height,
            dpr: dpr
        });
    }

    /**
     * Generate clouds using production-style logic
     */
    generate(useRandomFormations = true) {
        console.log('🌥️ Production Cloud System: Generating clouds...');
        
        const viewport = this.getViewportDimensions();
        const cloudCount = viewport.isMobile ? CloudConfig.CLOUD_COUNTS.MOBILE : CloudConfig.CLOUD_COUNTS.DESKTOP;
        const positions = this.calculatePositions(viewport);
        
        this.clouds = [];
        
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
                formation = CloudFormations[i % CloudFormations.length];
            }
            
            const position = positions[i];
            const baseScale = formation.scale.min + Math.random() * (formation.scale.max - formation.scale.min);
            const scaleFactor = viewport.isMobile ? CloudConfig.SCALE_FACTORS.MOBILE : CloudConfig.SCALE_FACTORS.DESKTOP;
            const scale = baseScale * scaleFactor;
            
            const cloud = {
                formation,
                x: position.x,
                y: position.y,
                originalX: position.x,
                originalY: position.y,
                scale,
                opacity: this.calculateOpacity(position.y, viewport.height),
                animationOffset: Math.random() * Math.PI * 2
            };
            
            this.clouds.push(cloud);
            console.log(`🌥️ Created cloud: ${formation.id} at (${Math.round(cloud.x)}, ${Math.round(cloud.y)}) scale: ${cloud.scale.toFixed(2)}`);
        }
        
        this.render();
        console.log(`✅ Generated ${this.clouds.length} clouds from 25 unique formations`);
    }

    /**
     * Calculate positions avoiding content (production style)
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
     * Calculate opacity based on vertical position (production style)
     */
    calculateOpacity(y, viewportHeight) {
        // Clouds higher up are more transparent
        const verticalPercent = y / viewportHeight;
        return CloudConfig.COLORS.BASE_OPACITY * (0.4 + verticalPercent * 0.6);
    }

    /**
     * Render all clouds - both production and beautiful static layers
     */
    render() {
        if (!this.ctx) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render production wispy clouds first (background layer)
        this.clouds.forEach(cloud => {
            this.drawWisp(cloud);
        });
        
        // Render beautiful static hand-drawn clouds on top
        this.renderStaticLayer();
    }

    /**
     * Draw individual cloud using production-style wisp technique
     */
    drawWisp(cloud) {
        const ctx = this.ctx;
        
        ctx.save();
        ctx.translate(cloud.x, cloud.y);
        ctx.scale(cloud.scale, cloud.scale);
        ctx.globalAlpha = cloud.opacity;
        
        // Generate organic points based on formation type
        const points = this.generateFormationPoints(cloud.formation);
        
        // Draw with production-style layered brush strokes
        this.drawLayeredBrushStrokes(ctx, points);
        
        ctx.restore();
    }

    /**
     * Generate organic points for different cloud formations
     */
    generateFormationPoints(formation) {
        const points = [];
        const complexity = this.getComplexityLevel(formation.complexity);
        
        switch (formation.type) {
            case 'cumulus':
                return this.generateCumulusPoints(formation.variant, complexity);
            case 'wisp':
                return this.generateWispPoints(formation.variant, complexity);
            case 'tower':
                return this.generateTowerPoints(formation.variant, complexity);
            case 'cirrus':
                return this.generateCirrusPoints(formation.variant, complexity);
            default:
                return this.generateCumulusPoints(1, complexity);
        }
    }

    /**
     * Get complexity level for organic variation
     */
    getComplexityLevel(complexity) {
        const levels = {
            'low': 8,
            'medium': 12,
            'high': 16,
            'dense': 20,
            'massive': 24
        };
        return levels[complexity] || 12;
    }

    /**
     * Generate cumulus cloud points
     */
    generateCumulusPoints(variant, complexity) {
        const points = [];
        const angleStep = (Math.PI * 2) / complexity;
        
        // Base radius patterns for different variants
        const radiusPatterns = {
            1: [60, 70, 80, 75, 65, 70, 85, 80], // massive-cumulus
            2: [50, 60, 65, 60, 55, 60, 70, 65], // giant-puffy
            3: [45, 55, 60, 70, 55, 50, 65, 60], // storm-anvil
            4: [40, 45, 50, 45, 40, 45, 55, 50], // cotton-ball
            5: [50, 55, 60, 55, 50, 55, 65, 60], // billowing-mass
            6: [45, 50, 55, 60, 50, 45, 60, 55], // mountain-cloud
            7: [55, 65, 70, 65, 60, 65, 75, 70], // thunderhead
            8: [35, 40, 45, 40, 35, 40, 50, 45]  // chunky-puff
        };
        
        const basePattern = radiusPatterns[variant] || radiusPatterns[1];
        
        for (let i = 0; i < complexity; i++) {
            const angle = i * angleStep;
            const patternIndex = Math.floor(i * basePattern.length / complexity);
            const baseRadius = basePattern[patternIndex];
            
            // Add organic variation
            const variation = 0.2 + Math.random() * 0.3;
            const radius = baseRadius * variation;
            
            points.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius
            });
        }
        
        return points;
    }

    /**
     * Generate wisp cloud points
     */
    generateWispPoints(variant, complexity) {
        const points = [];
        const length = 90 + variant * 12;
        const height = 25 + variant * 4;
        
        // Enhanced wispy patterns for more character
        const wispyStyles = {
            1: { curves: 2.2, flow: 'gentle', breaks: 0 },
            2: { curves: 3.1, flow: 'serpentine', breaks: 1 },
            3: { curves: 1.8, flow: 'broken', breaks: 2 },
            4: { curves: 4.2, flow: 'wave', breaks: 0 },
            5: { curves: 3.5, flow: 'twisted', breaks: 1 },
            6: { curves: 2.5, flow: 'feathery', breaks: 0 },
            7: { curves: 2.8, flow: 'layered', breaks: 1 },
            8: { curves: 3.2, flow: 'windblown', breaks: 1 }
        };
        
        const style = wispyStyles[variant] || wispyStyles[1];
        
        for (let i = 0; i < complexity; i++) {
            const t = i / (complexity - 1);
            const x = (t - 0.5) * length;
            
            // Create more sophisticated wavy patterns
            let wave;
            if (style.flow === 'serpentine') {
                wave = Math.sin(t * Math.PI * style.curves) * height * Math.sin(t * Math.PI);
                wave += Math.sin(t * Math.PI * style.curves * 1.7) * height * 0.3;
            } else if (style.flow === 'broken') {
                const breakFactor = Math.sin(t * Math.PI * style.breaks * 2) > 0.3 ? 1 : 0.4;
                wave = Math.sin(t * Math.PI * style.curves) * height * breakFactor;
            } else if (style.flow === 'feathery') {
                wave = Math.sin(t * Math.PI * style.curves) * height * Math.pow(Math.sin(t * Math.PI), 0.6);
            } else {
                wave = Math.sin(t * Math.PI * style.curves) * height;
            }
            
            // Enhanced organic variation
            const organicNoise = (Math.random() - 0.5) * 10;
            const y = wave + organicNoise + (Math.random() - 0.5) * 6;
            
            points.push({ x: x + (Math.random() - 0.5) * 4, y });
        }
        
        return points;
    }

    /**
     * Generate tower cloud points
     */
    generateTowerPoints(variant, complexity) {
        const points = [];
        const width = 30 + variant * 5;
        const height = 60 + variant * 10;
        
        for (let i = 0; i < complexity; i++) {
            const t = i / (complexity - 1);
            const y = (t - 0.5) * height;
            
            // Create tower profile
            const towerWidth = width * (1 - Math.abs(t - 0.5) * 0.5);
            const x = (Math.random() - 0.5) * towerWidth;
            
            points.push({ x, y });
        }
        
        return points;
    }

    /**
     * Generate cirrus cloud points
     */
    generateCirrusPoints(variant, complexity) {
        const points = [];
        const length = 60 + variant * 8;
        const thinness = 5 + variant * 2;
        
        for (let i = 0; i < complexity; i++) {
            const t = i / (complexity - 1);
            const x = (t - 0.5) * length;
            const y = (Math.random() - 0.5) * thinness;
            
            points.push({ x, y });
        }
        
        return points;
    }

    /**
     * Draw layered brush strokes (production style)
     */
    drawLayeredBrushStrokes(ctx, points) {
        // Enhanced layers for whispy, contemplative hand-drawn effect
        const layers = [
            { lineWidth: 1.8, opacity: 0.9, roughness: 0.15, style: 'main' },
            { lineWidth: 1.2, opacity: 0.6, roughness: 0.3, style: 'wispy' },
            { lineWidth: 0.8, opacity: 0.4, roughness: 0.5, style: 'whisper' },
            { lineWidth: 0.4, opacity: 0.25, roughness: 0.7, style: 'breath' }
        ];
        
        layers.forEach((layer, index) => {
            ctx.strokeStyle = CloudConfig.COLORS.STROKE.replace(/[\d.]+\)/, `${layer.opacity})`);
            ctx.lineWidth = layer.lineWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.fillStyle = index === 0 ? CloudConfig.COLORS.FILL : 'transparent';
            
            // Add slight hand-drawn tremor for organic feel
            if (layer.style === 'wispy') {
                ctx.setLineDash([3, 2]);
            } else if (layer.style === 'whisper') {
                ctx.setLineDash([2, 3, 1, 2]);
            }
            
            this.drawOrganicShape(ctx, points, layer.roughness || (index > 0 ? 0.4 : 0.2));
            
            // Reset line dash
            ctx.setLineDash([]);
        });
    }

    /**
     * Draw organic shape from points with enhanced hand-drawn quality
     */
    drawOrganicShape(ctx, points, roughness = 0.2) {
        if (points.length < 3) return;
        
        ctx.beginPath();
        
        // Add subtle hand tremor to starting point
        const startX = points[0].x + (Math.random() - 0.5) * roughness;
        const startY = points[0].y + (Math.random() - 0.5) * roughness;
        ctx.moveTo(startX, startY);
        
        // Create smooth curves with organic irregularities
        for (let i = 1; i < points.length - 1; i++) {
            const tremor = roughness * 2;
            const xc = (points[i].x + points[i + 1].x) / 2 + (Math.random() - 0.5) * tremor;
            const yc = (points[i].y + points[i + 1].y) / 2 + (Math.random() - 0.5) * tremor;
            
            const controlX = points[i].x + (Math.random() - 0.5) * tremor;
            const controlY = points[i].y + (Math.random() - 0.5) * tremor;
            
            ctx.quadraticCurveTo(controlX, controlY, xc, yc);
        }
        
        // Close the shape with subtle variation
        const finalTremor = roughness * 1.5;
        ctx.quadraticCurveTo(
            points[points.length - 1].x + (Math.random() - 0.5) * finalTremor,
            points[points.length - 1].y + (Math.random() - 0.5) * finalTremor,
            startX, startY
        );
        
        ctx.closePath();
        
        if (!strokeOnly) {
            ctx.fill();
        }
        ctx.stroke();
    }

    /**
     * Start animation loop
     */
    startAnimation() {
        if (!CloudConfig.ANIMATION.ENABLED) return;
        
        const animate = (currentTime) => {
            if (!this.isInitialized) return;
            
            const deltaTime = currentTime - this.lastTime;
            this.lastTime = currentTime;
            
            // Update cloud positions with subtle drift
            this.clouds.forEach(cloud => {
                const time = currentTime * CloudConfig.ANIMATION.SPEED;
                const drift = 15;
                cloud.x = cloud.originalX + Math.sin(time + cloud.animationOffset) * drift;
                cloud.y = cloud.originalY + Math.cos(time * 0.7 + cloud.animationOffset) * (drift * 0.7);
            });
            
            this.render();
            this.animationId = requestAnimationFrame(animate);
        };
        
        this.animationId = requestAnimationFrame(animate);
    }

    /**
     * Initialize static hand-drawn cloud layer
     */
    initializeStaticLayer() {
        this.staticClouds = [];
        this.generateStaticClouds();
        this.renderStaticLayer();
    }

    /**
     * Generate beautiful static hand-drawn clouds
     */
    generateStaticClouds() {
        const viewport = this.getViewportDimensions();
        const staticCount = viewport.isMobile ? 2 : 3; // Fewer static clouds to complement production ones
        
        // Beautiful hand-drawn formations from our working system
        const handDrawnFormations = [
            { id: 'massive-cumulus', baseShape: 'cumulus', variant: 1, scale: { min: 0.8, max: 1.2 } },
            { id: 'elongated-wisp', baseShape: 'wisp', variant: 1, scale: { min: 0.6, max: 1.0 } },
            { id: 'castle-tower', baseShape: 'tower', variant: 1, scale: { min: 0.7, max: 1.1 } },
            { id: 'horse-tail', baseShape: 'cirrus', variant: 1, scale: { min: 0.5, max: 0.8 } }
        ];

        // Position static clouds to complement production clouds
        const staticPositions = viewport.isMobile ? [
            { x: viewport.width * 0.15, y: viewport.height * 0.35 },
            { x: viewport.width * 0.85, y: viewport.height * 0.55 }
        ] : [
            { x: viewport.width * 0.15, y: viewport.height * 0.35 },
            { x: viewport.width * 0.85, y: viewport.height * 0.25 },
            { x: viewport.width * 0.50, y: viewport.height * 0.70 }
        ];

        for (let i = 0; i < staticCount; i++) {
            const formation = handDrawnFormations[i % handDrawnFormations.length];
            const position = staticPositions[i];
            const scale = formation.scale.min + Math.random() * (formation.scale.max - formation.scale.min);
            
            this.staticClouds.push({
                formation,
                x: position.x,
                y: position.y,
                scale: scale * (viewport.isMobile ? 0.8 : 1.0),
                opacity: 0.6 + (position.y / viewport.height) * 0.3
            });
        }

        console.log(`✅ Generated ${this.staticClouds.length} beautiful static clouds`);
    }

    /**
     * Render static hand-drawn cloud layer
     */
    renderStaticLayer() {
        if (!this.ctx || !this.staticClouds) return;

        this.staticClouds.forEach(cloud => {
            this.ctx.save();
            this.ctx.translate(cloud.x, cloud.y);
            this.ctx.scale(cloud.scale, cloud.scale);
            this.ctx.globalAlpha = cloud.opacity;
            
            this.drawHandDrawnCloud(cloud);
            
            this.ctx.restore();
        });
    }

    /**
     * Draw beautiful hand-drawn cloud
     */
    drawHandDrawnCloud(cloud) {
        // Fill first with slight transparency
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.drawHandDrawnShape(cloud.formation, true);
        
        // Beautiful hand-drawn stroke
        this.ctx.strokeStyle = 'rgba(70, 100, 130, 0.7)';
        this.ctx.lineWidth = 1.6;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.drawHandDrawnShape(cloud.formation, false);
    }

    /**
     * Draw hand-drawn cloud shapes (from our beautiful static system)
     */
    drawHandDrawnShape(formation, fillOnly = false) {
        switch (formation.baseShape) {
            case 'cumulus':
                this.drawHandDrawnCumulus(formation.variant, fillOnly);
                break;
            case 'wisp':
                this.drawHandDrawnWisp(formation.variant, fillOnly);
                break;
            case 'tower':
                this.drawHandDrawnTower(formation.variant, fillOnly);
                break;
            case 'cirrus':
                this.drawHandDrawnCirrus(formation.variant, fillOnly);
                break;
            default:
                this.drawHandDrawnCumulus(1, fillOnly);
        }
    }

    /**
     * Draw beautiful hand-drawn cumulus clouds
     */
    drawHandDrawnCumulus(variant = 1, fillOnly = false) {
        this.ctx.beginPath();
        
        switch (variant) {
            case 1: // massive-cumulus
                this.ctx.moveTo(0, 0);
                this.ctx.bezierCurveTo(-30, -25, -60, -15, -70, 15);
                this.ctx.bezierCurveTo(-90, 5, -120, 30, -110, 50);
                this.ctx.bezierCurveTo(-130, 60, -120, 100, -80, 100);
                this.ctx.bezierCurveTo(-50, 120, 10, 110, 30, 85);
                this.ctx.bezierCurveTo(60, 95, 100, 75, 90, 50);
                this.ctx.bezierCurveTo(110, 35, 100, 0, 60, 0);
                this.ctx.bezierCurveTo(45, -25, 15, -15, 0, 0);
                break;
                
            default:
                // Default beautiful cumulus
                this.ctx.moveTo(0, 0);
                this.ctx.bezierCurveTo(-25, -22, -45, -12, -55, 12);
                this.ctx.bezierCurveTo(-75, -2, -95, 22, -85, 42);
                this.ctx.bezierCurveTo(-105, 52, -95, 85, -65, 85);
                this.ctx.bezierCurveTo(-45, 105, 5, 95, 25, 75);
                this.ctx.bezierCurveTo(50, 85, 80, 65, 70, 42);
                this.ctx.bezierCurveTo(90, 32, 80, -2, 50, -2);
                this.ctx.bezierCurveTo(37, -22, 12, -12, 0, 0);
        }
        
        if (fillOnly) {
            this.ctx.fill();
        } else {
            this.ctx.stroke();
        }
    }

    /**
     * Draw beautiful hand-drawn wisp clouds
     */
    drawHandDrawnWisp(variant = 1, fillOnly = false) {
        this.ctx.beginPath();
        
        // elongated-wisp - beautiful flowing shape
        this.ctx.moveTo(0, 0);
        this.ctx.bezierCurveTo(-15, -8, -45, 0, -52, 15);
        this.ctx.bezierCurveTo(-60, 8, -82, 15, -75, 30);
        this.ctx.bezierCurveTo(-90, 35, -82, 48, -67, 52);
        this.ctx.bezierCurveTo(-45, 58, -15, 52, 0, 48);
        this.ctx.bezierCurveTo(22, 52, 52, 45, 60, 30);
        this.ctx.bezierCurveTo(75, 35, 90, 22, 82, 8);
        this.ctx.bezierCurveTo(67, 0, 45, 8, 30, 12);
        this.ctx.bezierCurveTo(22, -8, 0, 0, 0, 0);
        
        if (fillOnly) {
            this.ctx.fill();
        } else {
            this.ctx.stroke();
        }
    }

    /**
     * Draw beautiful hand-drawn tower clouds
     */
    drawHandDrawnTower(variant = 1, fillOnly = false) {
        this.ctx.beginPath();
        
        // castle-tower - beautiful vertical form
        this.ctx.moveTo(0, 0);
        this.ctx.bezierCurveTo(-18, -8, -36, 8, -42, 24);
        this.ctx.bezierCurveTo(-60, 12, -78, 30, -66, 48);
        this.ctx.bezierCurveTo(-84, 54, -72, 78, -48, 84);
        this.ctx.bezierCurveTo(-24, 90, 6, 84, 24, 66);
        this.ctx.bezierCurveTo(42, 72, 66, 54, 60, 36);
        this.ctx.bezierCurveTo(78, 30, 72, 6, 54, 6);
        this.ctx.bezierCurveTo(48, -12, 30, 0, 12, 6);
        this.ctx.bezierCurveTo(6, -12, 0, 0, 0, 0);
        
        if (fillOnly) {
            this.ctx.fill();
        } else {
            this.ctx.stroke();
        }
    }

    /**
     * Draw beautiful hand-drawn cirrus clouds
     */
    drawHandDrawnCirrus(variant = 1, fillOnly = false) {
        this.ctx.beginPath();
        
        // horse-tail - beautiful delicate form
        this.ctx.moveTo(0, 0);
        this.ctx.bezierCurveTo(-10, -4, -20, 2, -24, 10);
        this.ctx.bezierCurveTo(-30, 8, -38, 12, -34, 20);
        this.ctx.bezierCurveTo(-42, 22, -38, 32, -28, 34);
        this.ctx.bezierCurveTo(-18, 36, 0, 34, 6, 28);
        this.ctx.bezierCurveTo(16, 30, 26, 26, 24, 20);
        this.ctx.bezierCurveTo(30, 18, 26, 10, 20, 10);
        this.ctx.bezierCurveTo(18, 6, 12, 8, 6, 11);
        this.ctx.bezierCurveTo(4, 4, 0, 0, 0, 0);
        
        if (fillOnly) {
            this.ctx.fill();
        } else {
            this.ctx.stroke();
        }
    }

    /**
     * Regenerate clouds with new formations (both production and static)
     */
    regenerateClouds() {
        console.log('🌥️ Production Cloud System: Regenerating with new formations...');
        this.generate(true);
        this.generateStaticClouds(); // Also regenerate beautiful static clouds
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
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (this.isInitialized) {
                    this.setupCanvas();
                    this.generate(false);
                }
            }, 250);
        });
    }

    /**
     * Destroy cloud system
     */
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas) {
            this.canvas.remove();
        }
        this.isInitialized = false;
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌥️ Production Cloud System: DOM ready, starting initialization...');
    try {
        const cloudSystem = new ProductionCloudSystem();
        cloudSystem.init();
        
        // Make available globally for debugging and "what do you see?" functionality
        window.ProductionCloudSystem = cloudSystem;
        
        console.log('✅ Production Cloud System: Ready for cloud gazing!');
        
    } catch (error) {
        console.error('❌ Failed to initialize production cloud system:', error);
    }
});