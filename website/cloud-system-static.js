/**
 * Static Cloud System - Simple Hand-Drawn Cloud Shapes
 * Using the cloud shapes that worked well from canvas system, made completely static
 */

'use strict';

// Simple configuration for static clouds
const CloudConfig = Object.freeze({
    MOBILE_BREAKPOINT: 768,
    SCALE_FACTORS: { MOBILE: 1.0, DESKTOP: 1.4 },
    CLOUD_COUNTS: { MOBILE: 4, DESKTOP: 5 },  // Mobile optimized count for performance while maintaining visibility
    COLORS: {
        FILL: 'rgba(255, 255, 255, 0.85)',
        STROKE: 'rgba(135, 170, 200, 0.7)', // Complementary sky blue
        STROKE_WIDTH: 1.8
    }
});

// 38 Unique Cloud Formation Templates - First 10 Ensure Diverse Rotation
const CloudFormations = Object.freeze([
    // Guaranteed Diverse First 10 (1-10) - Well-formed clouds only
    { id: 'massive-cumulus', baseShape: 'cumulus', variant: 1, scale: { min: 1.2, max: 1.8 } },        // Large fluffy
    { id: 'elongated-wisp', baseShape: 'wisp', variant: 1, scale: { min: 0.8, max: 1.2 } },            // Horizontal medium
    { id: 'curvy-stream', baseShape: 'wisp', variant: 2, scale: { min: 0.7, max: 1.1 } },              // Horizontal curvy
    { id: 'tall-tower', baseShape: 'tower', variant: 1, scale: { min: 0.9, max: 1.3 } },               // Vertical tower
    { id: 'wave-formation', baseShape: 'wisp', variant: 4, scale: { min: 0.8, max: 1.3 } },            // Horizontal wavy
    { id: 'forming-cloud', baseShape: 'forming', variant: 1, scale: { min: 0.6, max: 1.0 } },          // Horizontal forming
    { id: 'high-cirrus', baseShape: 'cirrus', variant: 1, scale: { min: 0.7, max: 1.1 } },             // Horizontal wispy
    { id: 'cotton-ball', baseShape: 'cumulus', variant: 4, scale: { min: 0.9, max: 1.3 } },            // Round medium
    { id: 'broken-strand', baseShape: 'wisp', variant: 3, scale: { min: 0.6, max: 1.0 } },             // Horizontal textured
    { id: 'tiny-puffs', baseShape: 'puffs', variant: 1, scale: { min: 0.2, max: 0.4 } },               // Small scattered
    
    // Additional Large Fluffy Clouds (11-16)
    { id: 'giant-puffy', baseShape: 'cumulus', variant: 2, scale: { min: 1.1, max: 1.6 } },
    { id: 'billowing-mass', baseShape: 'cumulus', variant: 5, scale: { min: 1.1, max: 1.5 } },
    { id: 'mountain-cloud', baseShape: 'cumulus', variant: 6, scale: { min: 1.0, max: 1.4 } },
    { id: 'thunderhead', baseShape: 'cumulus', variant: 7, scale: { min: 1.2, max: 1.7 } },
    { id: 'chunky-puff', baseShape: 'cumulus', variant: 8, scale: { min: 0.8, max: 1.2 } },
    { id: 'curvy-stream', baseShape: 'wisp', variant: 2, scale: { min: 0.7, max: 1.1 } },
    { id: 'broken-strand', baseShape: 'wisp', variant: 3, scale: { min: 0.6, max: 1.0 } },
    { id: 'wave-formation', baseShape: 'wisp', variant: 4, scale: { min: 0.8, max: 1.3 } },
    { id: 'twisted-ribbon', baseShape: 'wisp', variant: 5, scale: { min: 0.7, max: 1.2 } },
    { id: 'feathered-edge', baseShape: 'wisp', variant: 6, scale: { min: 0.6, max: 1.1 } },
    { id: 'layered-sheet', baseShape: 'wisp', variant: 7, scale: { min: 0.9, max: 1.4 } },
    { id: 'wind-swept', baseShape: 'wisp', variant: 8, scale: { min: 0.8, max: 1.3 } },
    
    // Tall Tower Clouds (17-21)
    { id: 'castle-tower', baseShape: 'tower', variant: 1, scale: { min: 0.9, max: 1.4 } },
    { id: 'mushroom-top', baseShape: 'tower', variant: 2, scale: { min: 0.8, max: 1.3 } },
    { id: 'pillar-cloud', baseShape: 'tower', variant: 3, scale: { min: 0.7, max: 1.2 } },
    { id: 'cauliflower', baseShape: 'tower', variant: 4, scale: { min: 0.8, max: 1.4 } },
    { id: 'stacked-puffs', baseShape: 'tower', variant: 5, scale: { min: 0.6, max: 1.1 } },
    
    // Delicate High Clouds (22-25)
    { id: 'horse-tail', baseShape: 'cirrus', variant: 1, scale: { min: 0.5, max: 0.9 } },
    { id: 'ice-crystals', baseShape: 'cirrus', variant: 2, scale: { min: 0.4, max: 0.8 } },
    { id: 'thread-cloud', baseShape: 'cirrus', variant: 3, scale: { min: 0.6, max: 1.0 } },
    { id: 'angel-hair', baseShape: 'cirrus', variant: 4, scale: { min: 0.5, max: 0.9 } },
    
    // Additional Thin & Delicate Clouds (26-30)
    { id: 'whisper-wisp', baseShape: 'wisp', variant: 3, scale: { min: 0.3, max: 0.6 } },
    { id: 'breath-cloud', baseShape: 'cirrus', variant: 1, scale: { min: 0.2, max: 0.5 } },
    { id: 'feather-strand', baseShape: 'wisp', variant: 6, scale: { min: 0.4, max: 0.7 } },
    { id: 'vapor-trail', baseShape: 'wisp', variant: 2, scale: { min: 0.3, max: 0.6 } },
    { id: 'gossamer', baseShape: 'cirrus', variant: 3, scale: { min: 0.25, max: 0.55 } },
    
    // Storm Anvil moved to first 10 - slot filled with other cloud
    { id: 'storm-anvil', baseShape: 'cumulus', variant: 3, scale: { min: 1.0, max: 1.4 } }
]);

/**
 * Static Cloud System - No Animation
 */
class StaticCloudSystem {
    constructor(containerSelector = '.cloud-background') {
        this.container = document.querySelector(containerSelector);
        this.canvas = null;
        this.ctx = null;
        this.clouds = [];
        this.isInitialized = false;
        this.usedFormations = new Set();
        
        if (!this.container) {
            throw new Error(`Cloud container not found: ${containerSelector}`);
        }
    }

    /**
     * Initialize the static cloud system
     */
    init() {
        try {
            console.log('🌥️ Static Cloud System: Starting initialization...');
            this.createCanvas();
            this.setupCanvas();
            this.generateClouds();
            this.render();
            this.bindEvents();
            this.isInitialized = true;
            console.log('✅ Static Cloud System: Initialization complete');
        } catch (error) {
            console.error('❌ Static Cloud System initialization failed:', error);
        }
    }

    /**
     * Create canvas element
     */
    createCanvas() {
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
    }

    /**
     * Setup canvas dimensions with mobile optimizations
     */
    setupCanvas() {
        const viewport = this.getViewportDimensions();
        
        // Mobile optimization: Use device pixel ratio for crisp rendering
        const dpr = window.devicePixelRatio || 1;
        const isMobile = viewport.isMobile;
        
        // Mobile optimization: Limit DPR to prevent excessive memory usage
        const optimizedDPR = isMobile ? Math.min(dpr, 2) : dpr;
        
        this.canvas.width = viewport.width * optimizedDPR;
        this.canvas.height = viewport.height * optimizedDPR;
        
        // Set canvas style dimensions
        this.canvas.style.width = viewport.width + 'px';
        this.canvas.style.height = viewport.height + 'px';
        
        // Scale canvas context for high DPI displays
        this.ctx.scale(optimizedDPR, optimizedDPR);
        
        // Mobile optimization: Set canvas rendering hints
        if (isMobile) {
            this.ctx.imageSmoothingEnabled = false; // Disable for better performance
            this.ctx.imageSmoothingQuality = 'low';
        }
        
        console.log(`🖥️ Canvas setup: ${viewport.width}x${viewport.height} @ ${optimizedDPR}x DPR (mobile: ${isMobile})`);
    }

    /**
     * Generate cloud positions and formations
     */
    generateClouds() {
        this.clouds = [];
        const viewport = this.getViewportDimensions();
        const cloudCount = viewport.isMobile ? CloudConfig.CLOUD_COUNTS.MOBILE : CloudConfig.CLOUD_COUNTS.DESKTOP;
        const positions = this.calculatePositions(viewport);

        // Select unique formations for this generation
        const selectedFormations = this.selectUniqueFormations(cloudCount);

        for (let i = 0; i < cloudCount; i++) {
            const formation = selectedFormations[i];
            const position = positions[i];
            const scale = this.calculateScale(formation, viewport.isMobile);
            
            this.clouds.push({
                formation,
                x: position.x,
                y: position.y,
                scale,
                opacity: this.calculateOpacity(position.y, viewport.height),
                rotation: (Math.random() - 0.5) * 15, // Random rotation -7.5° to +7.5°
                skew: (Math.random() - 0.5) * 10      // Random skew for natural tilt
            });
        }

        console.log(`✅ Generated ${this.clouds.length} static clouds`);
    }

    /**
     * Select unique formations to avoid duplicates
     */
    selectUniqueFormations(count) {
        const available = CloudFormations.filter(f => !this.usedFormations.has(f.id));
        
        if (available.length < count) {
            // If we don't have enough unused formations, reset and use all
            this.usedFormations.clear();
            return this.shuffleArray([...CloudFormations]).slice(0, count);
        }
        
        const selected = this.shuffleArray(available).slice(0, count);
        selected.forEach(f => this.usedFormations.add(f.id));
        
        return selected;
    }

    /**
     * Shuffle array utility
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Define content zones where clouds should be avoided
     */
    getContentZones(viewport) {
        const { width, height, isMobile } = viewport;
        
        if (isMobile) {
            // Mobile: More targeted zones to preserve cloud visibility
            return [
                // Core text content only (narrower protection)
                {
                    x: width * 0.1,
                    y: height * 0.15,
                    width: width * 0.8,
                    height: height * 0.6,
                    buffer: 40 // Smaller buffer for mobile
                },
                // Split-flap component zone (smaller area)
                {
                    x: width * 0.05,
                    y: height * 0.88,
                    width: width * 0.9,
                    height: height * 0.12,
                    buffer: 30 // Minimal buffer
                }
            ];
        } else {
            // Desktop: Original protective zones
            return [
                // Main content area
                {
                    x: width * 0.1,
                    y: height * 0.1,
                    width: width * 0.6,
                    height: height * 0.75,
                    buffer: 80
                },
                // Split-flap component zone
                {
                    x: 0,
                    y: height * 0.85,
                    width: width,
                    height: height * 0.15,
                    buffer: 60
                }
            ];
        }
    }

    /**
     * Check if a cloud position intersects with content zones
     */
    intersectsContentZone(x, y, cloudRadius, contentZones) {
        for (const zone of contentZones) {
            const zoneLeft = zone.x - zone.buffer;
            const zoneRight = zone.x + zone.width + zone.buffer;
            const zoneTop = zone.y - zone.buffer;
            const zoneBottom = zone.y + zone.height + zone.buffer;
            
            // Check if cloud center + radius overlaps with zone
            if (x + cloudRadius > zoneLeft && 
                x - cloudRadius < zoneRight && 
                y + cloudRadius > zoneTop && 
                y - cloudRadius < zoneBottom) {
                return true;
            }
        }
        return false;
    }

    /**
     * Generate valid cloud position avoiding content zones
     */
    generateValidPosition(viewport, contentZones, attempts = 0) {
        const { width, height } = viewport;
        const maxAttempts = 30;
        
        if (attempts >= maxAttempts) {
            // Fall back to edge position if we can't find a valid main position
            return this.generateEdgePosition(width, height);
        }

        // Generate a random position
        const x = width * Math.random();
        const y = height * Math.random();
        const cloudRadius = 60; // Smaller radius to allow closer positioning
        
        // Check if this position conflicts with content zones
        if (!this.intersectsContentZone(x, y, cloudRadius, contentZones)) {
            return { x, y };
        }
        
        // Try again with increased attempts
        return this.generateValidPosition(viewport, contentZones, attempts + 1);
    }

    /**
     * Calculate cloud positions with content avoidance
     */
    calculatePositions(viewport) {
        const { width, height, isMobile } = viewport;
        const positions = [];
        const mainCloudCount = isMobile ? 3 : 3; // Optimized cloud count for performance
        const contentZones = this.getContentZones(viewport);
        
        console.log('🚫 Content avoidance zones defined:', contentZones.length, 'zones');
        console.log('📱 Mobile optimized cloud count:', mainCloudCount);
        
        // Generate clouds while avoiding content zones
        for (let i = 0; i < mainCloudCount; i++) {
            const position = this.generateValidPosition(viewport, contentZones);
            positions.push(position);
            console.log(`🌥️ Cloud ${i + 1} positioned at (${Math.round(position.x)}, ${Math.round(position.y)})`);
        }
        
        // Add edge clouds with mobile-optimized count
        const edgeCount = isMobile ? 1 : 2; // Reduce mobile edge clouds for performance
        for (let i = 0; i < edgeCount; i++) {
            positions.push(this.generateEdgePosition(width, height));
        }
        
        // Apply collision detection to prevent cloud stacking
        return this.resolveCollisions(positions, width, height, isMobile);
    }

    /**
     * Resolve cloud collisions to prevent stacking
     */
    resolveCollisions(positions, width, height, isMobile) {
        const resolvedPositions = [];
        const minDistance = isMobile ? 40 : 60; // Allow closer clouds for natural overlap
        const maxAttempts = 20; // Prevent infinite loops
        
        for (let i = 0; i < positions.length; i++) {
            let position = positions[i];
            let attempts = 0;
            let validPosition = false;
            
            while (!validPosition && attempts < maxAttempts) {
                validPosition = true;
                
                // Check against all previously placed clouds
                for (let j = 0; j < resolvedPositions.length; j++) {
                    const existing = resolvedPositions[j];
                    const distance = Math.sqrt(
                        Math.pow(position.x - existing.x, 2) + 
                        Math.pow(position.y - existing.y, 2)
                    );
                    
                    if (distance < minDistance) {
                        validPosition = false;
                        
                        // Try to nudge the position away from collision
                        const angle = Math.atan2(position.y - existing.y, position.x - existing.x);
                        const nudgeDistance = minDistance - distance + 20; // Extra buffer
                        
                        position = {
                            x: position.x + Math.cos(angle) * nudgeDistance,
                            y: position.y + Math.sin(angle) * nudgeDistance
                        };
                        
                        // Keep position within reasonable bounds (allow some off-screen for edge clouds)
                        position.x = Math.max(-width * 0.3, Math.min(width * 1.3, position.x));
                        position.y = Math.max(-height * 0.3, Math.min(height * 1.1, position.y));
                        
                        break;
                    }
                }
                
                attempts++;
            }
            
            resolvedPositions.push(position);
        }
        
        return resolvedPositions;
    }

    /**
     * Generate highly unpredictable edge position (partially off-screen for natural sky feel)
     */
    generateEdgePosition(width, height) {
        // Weighted edge selection - top edges more common (like real weather)
        const edgeWeights = [0.4, 0.25, 0.1, 0.25]; // top, right, bottom, left
        const random = Math.random();
        let edgeType = 0;
        let cumulative = 0;
        
        for (let i = 0; i < edgeWeights.length; i++) {
            cumulative += edgeWeights[i];
            if (random <= cumulative) {
                edgeType = i;
                break;
            }
        }
        
        // Add extreme unpredictability - sometimes clouds way off screen
        const extremePosition = Math.random() < 0.3; // 30% chance of extreme positioning
        const extremeMultiplier = extremePosition ? 1.5 + Math.random() * 2 : 1;
        
        switch (edgeType) {
            case 0: // Top edge - dangling from above (most common)
                const topVariation = Math.random();
                if (topVariation < 0.33) {
                    // Close to edge
                    return {
                        x: width * (0.0 + Math.random() * 1.0),   // Full width
                        y: height * (-0.08 + Math.random() * 0.05) * extremeMultiplier
                    };
                } else if (topVariation < 0.66) {
                    // Medium distance
                    return {
                        x: width * (0.1 + Math.random() * 0.8),
                        y: height * (-0.20 + Math.random() * 0.1) * extremeMultiplier
                    };
                } else {
                    // Far above (dramatic)
                    return {
                        x: width * (0.2 + Math.random() * 0.6),
                        y: height * (-0.35 + Math.random() * 0.15) * extremeMultiplier
                    };
                }
                
            case 1: // Right edge - extending off right
                return {
                    x: width * (0.95 + Math.random() * 0.25) * extremeMultiplier,
                    y: height * (-0.1 + Math.random() * 1.1)   // Can be anywhere vertically
                };
                
            case 2: // Bottom edge - extending below (rare but dramatic)
                return {
                    x: width * (0.1 + Math.random() * 0.8),
                    y: height * (0.85 + Math.random() * 0.3) * extremeMultiplier
                };
                
            case 3: // Left edge - extending from left
            default:
                return {
                    x: width * (-0.05 + Math.random() * -0.2) * extremeMultiplier, // Negative values
                    y: height * (-0.1 + Math.random() * 1.1)   // Can be anywhere vertically
                };
        }
    }

    /**
     * Calculate cloud scale
     */
    calculateScale(formation, isMobile) {
        const baseScale = formation.scale.min + Math.random() * (formation.scale.max - formation.scale.min);
        const scaleFactor = isMobile ? CloudConfig.SCALE_FACTORS.MOBILE : CloudConfig.SCALE_FACTORS.DESKTOP;
        return baseScale * scaleFactor;
    }

    /**
     * Calculate opacity based on position
     */
    calculateOpacity(y, viewportHeight) {
        const verticalPercent = y / viewportHeight;
        return 0.6 + verticalPercent * 0.4;
    }

    /**
     * Render all clouds (static)
     */
    render() {
        if (!this.ctx) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw each cloud
        this.clouds.forEach(cloud => {
            this.ctx.save();
            this.ctx.translate(cloud.x, cloud.y);
            this.ctx.scale(cloud.scale, cloud.scale);
            this.ctx.rotate(cloud.rotation * Math.PI / 180); // Apply rotation
            this.ctx.transform(1, 0, cloud.skew * 0.01, 1, 0, 0); // Apply skew
            this.ctx.globalAlpha = cloud.opacity;
            
            this.drawCloud(cloud);
            
            this.ctx.restore();
        });
    }

    /**
     * Draw individual cloud with variable line weights and opacity like live version
     */
    drawCloud(cloud) {
        // Fill first
        this.ctx.fillStyle = CloudConfig.COLORS.FILL;
        this.drawCloudShape(cloud.formation, true);
        
        // Draw multiple stroke layers with varying thickness and opacity (like live version)
        this.drawVariableStrokeLayers(cloud.formation);
    }

    /**
     * Draw variable stroke layers to match the live version's character
     */
    drawVariableStrokeLayers(formation) {
        // Check if this is a very small/delicate cloud
        const isDelicate = formation.scale.max < 0.7;
        
        // Different stroke layers for delicate vs regular clouds
        const strokeLayers = isDelicate ? [
            { lineWidth: 1.4, opacity: 0.65, variation: 0.4 }, // Thinner main stroke
            { lineWidth: 0.9, opacity: 0.45, variation: 0.3 }, // Light accent
            { lineWidth: 0.5, opacity: 0.30, variation: 0.2 }, // Whisper detail
            { lineWidth: 0.3, opacity: 0.15, variation: 0.1 }  // Gossamer touch
        ] : [
            { lineWidth: 2.4, opacity: 0.60, variation: 0.6 }, // Main thick stroke (reduced from 0.85)
            { lineWidth: 1.6, opacity: 0.45, variation: 0.4 }, // Medium weight (reduced from 0.65)
            { lineWidth: 1.0, opacity: 0.32, variation: 0.3 }, // Thin accent (reduced from 0.45)
            { lineWidth: 0.6, opacity: 0.18, variation: 0.2 }  // Whisper details (reduced from 0.25)
        ];
        
        strokeLayers.forEach((layer, index) => {
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            
            // Apply this layer with natural variations
            this.drawVariableWeightStroke(formation, layer, index);
        });
    }

    /**
     * Draw stroke with natural thickness and opacity variations
     */
    drawVariableWeightStroke(formation, layer, layerIndex) {
        // Set base stroke properties
        this.ctx.strokeStyle = `rgba(135, 170, 200, ${layer.opacity})`;
        this.ctx.lineWidth = layer.lineWidth;
        
        // For the main layers, add some natural line weight variation
        if (layerIndex < 2) {
            // Draw multiple sub-strokes with slight variations for organic feel
            for (let subStroke = 0; subStroke < 2; subStroke++) {
                const weightVariation = 1 + (Math.random() - 0.5) * layer.variation;
                const opacityVariation = 1 + (Math.random() - 0.5) * 0.3;
                
                this.ctx.lineWidth = layer.lineWidth * weightVariation;
                this.ctx.strokeStyle = `rgba(135, 170, 200, ${layer.opacity * opacityVariation})`;
                
                // Slight offset for natural hand-drawn feel
                this.ctx.save();
                if (subStroke > 0) {
                    const offset = (Math.random() - 0.5) * 0.8;
                    this.ctx.translate(offset, offset);
                }
                
                this.drawCloudShape(formation, false);
                this.ctx.restore();
            }
        } else {
            // Thinner layers drawn once for detail
            this.drawCloudShape(formation, false);
        }
    }

    /**
     * Draw cloud shape based on formation type (from working canvas system)
     */
    drawCloudShape(formation, fillOnly = false) {
        switch (formation.baseShape) {
            case 'cumulus':
                this.drawCumulusCloud(formation.variant, fillOnly);
                break;
            case 'wisp':
                this.drawWispCloud(formation.variant, fillOnly);
                break;
            case 'tower':
                this.drawTowerCloud(formation.variant, fillOnly);
                break;
            case 'cirrus':
                this.drawCirrusCloud(formation.variant, fillOnly);
                break;
            case 'streak':
                this.drawStreakCloud(formation.variant, fillOnly);
                break;
            case 'forming':
                this.drawFormingCloud(formation.variant, fillOnly);
                break;
            case 'puffs':
                this.drawPuffsCloud(formation.variant, fillOnly);
                break;
            default:
                this.drawCumulusCloud(1, fillOnly);
        }
    }

    /**
     * Draw cumulus cloud shapes (from working canvas system)
     */
    drawCumulusCloud(variant = 1, fillOnly = false) {
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
                
            case 2: // giant-puffy
                this.ctx.moveTo(0, 0);
                this.ctx.bezierCurveTo(-25, -22, -45, -12, -55, 12);
                this.ctx.bezierCurveTo(-75, -2, -95, 22, -85, 42);
                this.ctx.bezierCurveTo(-105, 52, -95, 85, -65, 85);
                this.ctx.bezierCurveTo(-45, 105, 5, 95, 25, 75);
                this.ctx.bezierCurveTo(50, 85, 80, 65, 70, 42);
                this.ctx.bezierCurveTo(90, 32, 80, -2, 50, -2);
                this.ctx.bezierCurveTo(37, -22, 12, -12, 0, 0);
                break;
                
            case 3: // storm-anvil
                this.ctx.moveTo(0, 0);
                this.ctx.bezierCurveTo(-20, -18, -35, -8, -45, 8);
                this.ctx.bezierCurveTo(-60, -5, -75, 15, -68, 32);
                this.ctx.bezierCurveTo(-85, 38, -78, 68, -52, 72);
                this.ctx.bezierCurveTo(-32, 88, 2, 82, 18, 62);
                this.ctx.bezierCurveTo(38, 68, 62, 52, 58, 32);
                this.ctx.bezierCurveTo(72, 28, 68, 2, 48, 2);
                this.ctx.bezierCurveTo(42, -15, 22, -2, 8, 2);
                this.ctx.bezierCurveTo(2, -12, 0, 0, 0, 0);
                break;
                
            case 4: // cotton-ball
                this.ctx.moveTo(0, 0);
                this.ctx.bezierCurveTo(-15, -12, -28, -5, -35, 5);
                this.ctx.bezierCurveTo(-48, -2, -62, 12, -58, 25);
                this.ctx.bezierCurveTo(-72, 28, -68, 52, -48, 55);
                this.ctx.bezierCurveTo(-32, 68, 2, 62, 15, 48);
                this.ctx.bezierCurveTo(32, 52, 52, 42, 48, 25);
                this.ctx.bezierCurveTo(58, 22, 55, 2, 38, 2);
                this.ctx.bezierCurveTo(35, -8, 18, 0, 5, 2);
                this.ctx.bezierCurveTo(2, -8, 0, 0, 0, 0);
                break;
                
            default:
                // Default small cloud
                this.ctx.moveTo(0, 0);
                this.ctx.bezierCurveTo(-10, -8, -20, -4, -25, 4);
                this.ctx.bezierCurveTo(-35, -2, -45, 8, -42, 18);
                this.ctx.bezierCurveTo(-50, 20, -48, 35, -32, 38);
                this.ctx.bezierCurveTo(-18, 48, 2, 45, 12, 32);
                this.ctx.bezierCurveTo(25, 35, 38, 28, 35, 18);
                this.ctx.bezierCurveTo(42, 15, 40, 2, 28, 2);
                this.ctx.bezierCurveTo(25, -5, 12, 0, 2, 2);
                this.ctx.bezierCurveTo(0, -5, 0, 0, 0, 0);
        }
        
        if (fillOnly) {
            this.ctx.fill();
        } else {
            this.ctx.stroke();
        }
    }

    /**
     * Draw wisp cloud shapes
     */
    drawWispCloud(variant = 1, fillOnly = false) {
        this.ctx.beginPath();
        
        switch (variant) {
            case 1: // elongated-wisp
                this.ctx.moveTo(0, 0);
                this.ctx.bezierCurveTo(-15, -8, -45, 0, -52, 15);
                this.ctx.bezierCurveTo(-60, 8, -82, 15, -75, 30);
                this.ctx.bezierCurveTo(-90, 35, -82, 48, -67, 52);
                this.ctx.bezierCurveTo(-45, 58, -15, 52, 0, 48);
                this.ctx.bezierCurveTo(22, 52, 52, 45, 60, 30);
                this.ctx.bezierCurveTo(75, 35, 90, 22, 82, 8);
                this.ctx.bezierCurveTo(67, 0, 45, 8, 30, 12);
                this.ctx.bezierCurveTo(22, -8, 0, 0, 0, 0);
                break;
                
            case 2: // curvy-stream
                this.ctx.moveTo(0, 0);
                this.ctx.bezierCurveTo(-12, -6, -36, 2, -42, 12);
                this.ctx.bezierCurveTo(-48, 6, -66, 12, -60, 24);
                this.ctx.bezierCurveTo(-72, 28, -66, 38, -54, 42);
                this.ctx.bezierCurveTo(-36, 46, -12, 42, 0, 38);
                this.ctx.bezierCurveTo(18, 42, 42, 36, 48, 24);
                this.ctx.bezierCurveTo(60, 28, 72, 18, 66, 6);
                this.ctx.bezierCurveTo(54, 0, 36, 6, 24, 10);
                this.ctx.bezierCurveTo(18, -6, 0, 0, 0, 0);
                break;
                
            default:
                // Default wisp
                this.ctx.moveTo(0, 0);
                this.ctx.bezierCurveTo(-8, -4, -24, 0, -28, 8);
                this.ctx.bezierCurveTo(-32, 4, -44, 8, -40, 16);
                this.ctx.bezierCurveTo(-48, 18, -44, 28, -36, 30);
                this.ctx.bezierCurveTo(-24, 32, -8, 30, 0, 28);
                this.ctx.bezierCurveTo(12, 30, 28, 26, 32, 16);
                this.ctx.bezierCurveTo(40, 18, 48, 12, 44, 4);
                this.ctx.bezierCurveTo(36, 0, 24, 4, 16, 6);
                this.ctx.bezierCurveTo(12, -4, 0, 0, 0, 0);
        }
        
        if (fillOnly) {
            this.ctx.fill();
        } else {
            this.ctx.stroke();
        }
    }

    /**
     * Draw tower cloud shapes
     */
    drawTowerCloud(variant = 1, fillOnly = false) {
        this.ctx.beginPath();
        
        switch (variant) {
            case 1: // castle-tower
                this.ctx.moveTo(0, 0);
                this.ctx.bezierCurveTo(-18, -8, -36, 8, -42, 24);
                this.ctx.bezierCurveTo(-60, 12, -78, 30, -66, 48);
                this.ctx.bezierCurveTo(-84, 54, -72, 78, -48, 84);
                this.ctx.bezierCurveTo(-24, 90, 6, 84, 24, 66);
                this.ctx.bezierCurveTo(42, 72, 66, 54, 60, 36);
                this.ctx.bezierCurveTo(78, 30, 72, 6, 54, 6);
                this.ctx.bezierCurveTo(48, -12, 30, 0, 12, 6);
                this.ctx.bezierCurveTo(6, -12, 0, 0, 0, 0);
                break;
                
            default:
                // Default tower
                this.ctx.moveTo(0, 0);
                this.ctx.bezierCurveTo(-12, -4, -24, 4, -28, 16);
                this.ctx.bezierCurveTo(-40, 8, -52, 20, -44, 32);
                this.ctx.bezierCurveTo(-56, 36, -48, 52, -32, 56);
                this.ctx.bezierCurveTo(-16, 60, 4, 56, 16, 44);
                this.ctx.bezierCurveTo(28, 48, 44, 36, 40, 24);
                this.ctx.bezierCurveTo(52, 20, 48, 4, 36, 4);
                this.ctx.bezierCurveTo(32, -8, 20, 0, 8, 4);
                this.ctx.bezierCurveTo(4, -8, 0, 0, 0, 0);
        }
        
        if (fillOnly) {
            this.ctx.fill();
        } else {
            this.ctx.stroke();
        }
    }

    /**
     * Draw cirrus cloud shapes
     */
    drawCirrusCloud(variant = 1, fillOnly = false) {
        this.ctx.beginPath();
        
        switch (variant) {
            case 1: // horse-tail
                this.ctx.moveTo(0, 0);
                this.ctx.bezierCurveTo(-10, -4, -20, 2, -24, 10);
                this.ctx.bezierCurveTo(-30, 8, -38, 12, -34, 20);
                this.ctx.bezierCurveTo(-42, 22, -38, 32, -28, 34);
                this.ctx.bezierCurveTo(-18, 36, 0, 34, 6, 28);
                this.ctx.bezierCurveTo(16, 30, 26, 26, 24, 20);
                this.ctx.bezierCurveTo(30, 18, 26, 10, 20, 10);
                this.ctx.bezierCurveTo(18, 6, 12, 8, 6, 11);
                this.ctx.bezierCurveTo(4, 4, 0, 0, 0, 0);
                break;
                
            default:
                // Default cirrus
                this.ctx.moveTo(0, 0);
                this.ctx.bezierCurveTo(-6, -2, -12, 1, -14, 6);
                this.ctx.bezierCurveTo(-18, 4, -24, 7, -21, 13);
                this.ctx.bezierCurveTo(-27, 15, -24, 21, -18, 23);
                this.ctx.bezierCurveTo(-12, 25, 0, 23, 4, 19);
                this.ctx.bezierCurveTo(10, 21, 17, 18, 16, 13);
                this.ctx.bezierCurveTo(20, 11, 17, 6, 13, 6);
                this.ctx.bezierCurveTo(12, 3, 8, 5, 4, 7);
                this.ctx.bezierCurveTo(2, 2, 0, 0, 0, 0);
        }
        
        if (fillOnly) {
            this.ctx.fill();
        } else {
            this.ctx.stroke();
        }
    }

    /**
     * Draw streak cloud shapes (thin elongated clouds)
     */
    drawStreakCloud(variant = 1, fillOnly = false) {
        this.ctx.beginPath();
        
        switch (variant) {
            case 1: // thin-horizontal-streak
                this.ctx.moveTo(0, 0);
                this.ctx.bezierCurveTo(-45, -3, -90, -1, -120, 2);
                this.ctx.bezierCurveTo(-135, 4, -140, 8, -135, 12);
                this.ctx.bezierCurveTo(-120, 15, -90, 12, -45, 10);
                this.ctx.bezierCurveTo(-20, 8, 10, 6, 25, 3);
                this.ctx.bezierCurveTo(35, 1, 30, -2, 15, -4);
                this.ctx.bezierCurveTo(8, -3, 0, 0, 0, 0);
                break;
                
            case 2: // ultra-thin-streak (even thinner and longer)
                this.ctx.moveTo(0, 0);
                this.ctx.bezierCurveTo(-60, -2, -120, -0.5, -180, 1);
                this.ctx.bezierCurveTo(-200, 2, -210, 4, -205, 6);
                this.ctx.bezierCurveTo(-180, 7, -120, 6, -60, 5);
                this.ctx.bezierCurveTo(-30, 4, 15, 3, 40, 1);
                this.ctx.bezierCurveTo(50, 0, 45, -1, 30, -2);
                this.ctx.bezierCurveTo(15, -1.5, 0, 0, 0, 0);
                break;
                
            case 3: // whisper-streak (barely visible thin line)
                this.ctx.moveTo(0, 0);
                this.ctx.bezierCurveTo(-35, -1, -70, -0.5, -100, 0.5);
                this.ctx.bezierCurveTo(-115, 1, -120, 3, -115, 4);
                this.ctx.bezierCurveTo(-100, 4.5, -70, 4, -35, 3);
                this.ctx.bezierCurveTo(-15, 2.5, 5, 2, 20, 1);
                this.ctx.bezierCurveTo(25, 0.5, 22, -0.5, 15, -1);
                this.ctx.bezierCurveTo(8, -0.5, 0, 0, 0, 0);
                break;
                
            default:
                // Default thin streak
                this.ctx.moveTo(0, 0);
                this.ctx.bezierCurveTo(-30, -2, -60, -1, -80, 1);
                this.ctx.bezierCurveTo(-90, 3, -85, 6, -80, 8);
                this.ctx.bezierCurveTo(-60, 9, -30, 7, 0, 5);
                this.ctx.bezierCurveTo(15, 3, 10, -1, 0, 0);
        }
        
        this.ctx.closePath();
        if (fillOnly) {
            this.ctx.fill();
        } else {
            this.ctx.stroke();
        }
    }

    /**
     * Draw forming cloud shapes (clouds slowly coming into formation)
     */
    drawFormingCloud(variant = 1, fillOnly = false) {
        this.ctx.beginPath();
        
        switch (variant) {
            case 1: // partially-formed-cumulus
                this.ctx.moveTo(0, 0);
                // Left side more formed
                this.ctx.bezierCurveTo(-25, -15, -45, -8, -55, 8);
                this.ctx.bezierCurveTo(-70, 0, -80, 18, -72, 32);
                this.ctx.bezierCurveTo(-85, 38, -75, 58, -50, 60);
                // Middle transition becoming less defined
                this.ctx.bezierCurveTo(-30, 70, -10, 65, 5, 50);
                // Right side wispy and forming
                this.ctx.bezierCurveTo(15, 45, 25, 35, 35, 25);
                this.ctx.bezierCurveTo(40, 20, 38, 15, 30, 12);
                this.ctx.bezierCurveTo(25, 8, 18, 5, 10, 2);
                this.ctx.bezierCurveTo(5, -2, 0, 0, 0, 0);
                break;
                
            default:
                // Default forming cloud
                this.ctx.moveTo(0, 0);
                this.ctx.bezierCurveTo(-20, -10, -35, -5, -42, 5);
                this.ctx.bezierCurveTo(-55, -2, -65, 12, -58, 25);
                this.ctx.bezierCurveTo(-68, 30, -60, 45, -40, 47);
                this.ctx.bezierCurveTo(-25, 55, -5, 50, 8, 38);
                this.ctx.bezierCurveTo(15, 35, 18, 25, 15, 18);
                this.ctx.bezierCurveTo(12, 10, 5, 5, 0, 0);
        }
        
        this.ctx.closePath();
        if (fillOnly) {
            this.ctx.fill();
        } else {
            this.ctx.stroke();
        }
    }

    /**
     * Draw puffs cloud shapes (small isolated cloud puffs)
     */
    drawPuffsCloud(variant = 1, fillOnly = false) {
        this.ctx.beginPath();
        
        switch (variant) {
            case 1: // tiny-scattered-puffs
                // First small puff
                this.ctx.moveTo(0, 0);
                this.ctx.bezierCurveTo(-8, -6, -16, -3, -20, 3);
                this.ctx.bezierCurveTo(-25, 0, -28, 8, -24, 15);
                this.ctx.bezierCurveTo(-30, 18, -25, 28, -15, 30);
                this.ctx.bezierCurveTo(-8, 35, 2, 32, 8, 25);
                this.ctx.bezierCurveTo(15, 28, 22, 20, 18, 12);
                this.ctx.bezierCurveTo(25, 8, 20, 0, 12, 0);
                this.ctx.bezierCurveTo(8, -8, 2, -5, 0, 0);
                
                // Second tiny puff (separate)
                this.ctx.moveTo(35, 5);
                this.ctx.bezierCurveTo(30, 2, 26, 4, 25, 8);
                this.ctx.bezierCurveTo(22, 6, 20, 10, 22, 14);
                this.ctx.bezierCurveTo(20, 16, 22, 20, 28, 20);
                this.ctx.bezierCurveTo(32, 22, 38, 20, 40, 16);
                this.ctx.bezierCurveTo(42, 18, 46, 14, 44, 10);
                this.ctx.bezierCurveTo(46, 8, 44, 4, 40, 4);
                this.ctx.bezierCurveTo(38, 2, 35, 5, 35, 5);
                
                // Third mini puff
                this.ctx.moveTo(-35, 10);
                this.ctx.bezierCurveTo(-38, 8, -42, 9, -44, 12);
                this.ctx.bezierCurveTo(-46, 10, -48, 14, -46, 18);
                this.ctx.bezierCurveTo(-48, 20, -46, 24, -40, 24);
                this.ctx.bezierCurveTo(-36, 26, -30, 24, -28, 20);
                this.ctx.bezierCurveTo(-26, 22, -22, 18, -24, 14);
                this.ctx.bezierCurveTo(-22, 12, -24, 8, -28, 8);
                this.ctx.bezierCurveTo(-30, 6, -35, 10, -35, 10);
                break;
                
            default:
                // Default single puff
                this.ctx.moveTo(0, 0);
                this.ctx.bezierCurveTo(-6, -4, -12, -2, -15, 2);
                this.ctx.bezierCurveTo(-18, 0, -20, 6, -17, 12);
                this.ctx.bezierCurveTo(-22, 14, -18, 22, -10, 22);
                this.ctx.bezierCurveTo(-5, 26, 2, 24, 6, 18);
                this.ctx.bezierCurveTo(10, 20, 15, 14, 12, 8);
                this.ctx.bezierCurveTo(16, 6, 14, 0, 8, 0);
                this.ctx.bezierCurveTo(6, -6, 2, -4, 0, 0);
        }
        
        this.ctx.closePath();
        if (fillOnly) {
            this.ctx.fill();
        } else {
            this.ctx.stroke();
        }
    }

    /**
     * Regenerate clouds with new formations
     */
    regenerateClouds() {
        console.log('🌥️ Static Cloud System: Regenerating clouds...');
        this.generateClouds();
        this.render();
        console.log('✅ Clouds regenerated successfully');
    }

    /**
     * Start interval-based regeneration (DISABLED FOR STATIC EXPERIENCE)
     */
    startIntervalRegeneration() {
        // Interval-based cloud regeneration has been disabled for a calmer experience
        // Clouds now remain static throughout the user's visit
        console.log('🔄 Interval-based cloud regeneration disabled for static experience');
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
        console.log('🔧 Setting up event listeners...');
        
        // Setup scroll regeneration (now disabled) and resize handling
        this.setupScrollRegeneration();
        
        console.log('✅ Event listeners setup complete');
    }

    /**
     * Setup scroll-based cloud regeneration (DISABLED FOR STATIC EXPERIENCE)
     */
    setupScrollRegeneration() {
        // Cloud regeneration on scroll has been disabled for a calmer, more contemplative experience
        // The clouds now remain static throughout the user's visit for better UX
        console.log('🌥️ Scroll-based cloud regeneration disabled for static experience');
        
        // Setup debounced resize handling to prevent mobile jumpiness
        this.setupDebouncedResize();
    }

    /**
     * Setup debounced resize handling to prevent mobile jumpiness
     */
    setupDebouncedResize() {
        let resizeTimeout;
        let lastWidth = window.innerWidth;
        let lastHeight = window.innerHeight;
        
        const handleResize = () => {
            // Clear any pending resize handler
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            
            const currentWidth = window.innerWidth;
            const currentHeight = window.innerHeight;
            
            // Only regenerate if there's a significant dimension change
            // This prevents regeneration from iOS Safari address bar changes
            const widthChange = Math.abs(currentWidth - lastWidth);
            const heightChange = Math.abs(currentHeight - lastHeight);
            const significantChange = widthChange > 50 || heightChange > 100;
            
            if (!significantChange) {
                console.log('🔇 Ignoring minor resize event (mobile viewport adjustment)');
                return;
            }
            
            // Debounce regeneration to prevent multiple rapid calls
            resizeTimeout = setTimeout(() => {
                if (this.isInitialized) {
                    console.log('🔄 Significant window resize detected - regenerating clouds');
                    console.log(`📊 Dimension change: ${widthChange}px width, ${heightChange}px height`);
                    
                    this.setupCanvas();
                    this.generateClouds();
                    this.render();
                    
                    // Update last known dimensions
                    lastWidth = currentWidth;
                    lastHeight = currentHeight;
                }
            }, 250); // 250ms debounce delay
        };
        
        window.addEventListener('resize', handleResize);
        console.log('✅ Debounced resize handler setup complete');
    }
}

// Production-ready cloud system

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌥️ Static Cloud System: DOM ready, starting initialization...');
    try {
        const staticCloudSystem = new StaticCloudSystem();
        staticCloudSystem.init();
        
        // Make available globally for the "what do you see?" button
        window.StaticCloudSystem = staticCloudSystem;
        
        // Start interval regeneration as backup
        staticCloudSystem.startIntervalRegeneration();
        
        console.log('✅ Static Cloud System: Ready');
        
    } catch (error) {
        console.error('❌ Failed to initialize static cloud system:', error);
        console.error('❌ Error details:', error.message);
        console.error('❌ Error stack:', error.stack);
    }
});