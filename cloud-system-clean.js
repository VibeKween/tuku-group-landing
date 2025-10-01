/**
 * Clean Cloud System - Working Version
 * High-quality, enterprise-grade cloud background system
 */

'use strict';

// Configuration
const CloudConfig = Object.freeze({
    MOBILE_BREAKPOINT: 768,
    SCALE_FACTORS: { MOBILE: 4.0, DESKTOP: 6.0 },
    CLOUD_COUNTS: { MOBILE: 3, DESKTOP: 4 }
});

// Cloud formation data
const CloudFormations = Object.freeze([
    {
        id: 'cumulus-large',
        paths: ['M 0 0 C -20 -20 -40 -10 -50 10 C -70 0 -90 20 -80 40 C -100 50 -90 80 -60 80 C -40 100 0 90 20 70 C 40 80 70 60 60 40 C 80 30 70 0 40 0 C 30 -20 10 -10 0 0 Z'],
        scale: { min: 1.0, max: 1.6 },
        style: { fill: 'rgba(255,255,255,0.9)', stroke: 'rgba(70,100,130,0.9)', strokeWidth: '2.0' }
    },
    {
        id: 'wisp-horizontal', 
        paths: ['M 0 0 C -10 -5 -30 0 -35 10 C -40 5 -55 10 -50 20 C -60 22 -55 32 -45 35 C -30 38 -10 35 0 32 C 15 35 35 30 40 20 C 50 22 60 15 55 5 C 45 0 30 5 20 8 C 15 -5 0 0 0 0 Z'],
        scale: { min: 0.8, max: 1.4 },
        style: { fill: 'rgba(255,255,255,0.85)', stroke: 'rgba(70,100,130,0.85)', strokeWidth: '1.8' }
    },
    {
        id: 'tower-formation',
        paths: ['M 0 0 C -15 -5 -30 5 -35 20 C -50 10 -65 25 -55 40 C -70 45 -60 65 -40 70 C -20 75 5 70 20 55 C 35 60 55 45 50 30 C 65 25 60 5 45 5 C 40 -10 25 0 10 5 C 5 -10 0 0 0 0 Z'],
        scale: { min: 0.7, max: 1.3 },
        style: { fill: 'rgba(255,255,255,0.8)', stroke: 'rgba(70,100,130,0.75)', strokeWidth: '1.6' }
    },
    {
        id: 'cirrus-delicate',
        paths: ['M 0 0 C -8 -3 -15 1 -18 8 C -22 6 -28 10 -25 16 C -30 18 -27 25 -20 27 C -12 29 0 27 5 23 C 12 25 20 21 19 16 C 23 14 20 8 16 8 C 14 5 10 7 5 9 C 3 3 0 0 0 0 Z'],
        scale: { min: 0.5, max: 1.0 },
        style: { fill: 'rgba(255,255,255,0.6)', stroke: 'rgba(70,100,130,0.6)', strokeWidth: '1.2' }
    }
]);

/**
 * Cloud System - Main orchestrator class
 */
class CloudSystem {
    constructor(containerSelector = '.cloud-sketches') {
        this.container = document.querySelector(containerSelector);
        this.clouds = [];
        this.isInitialized = false;
        
        if (!this.container) {
            throw new Error(`Cloud container not found: ${containerSelector}`);
        }
    }

    /**
     * Initialize the cloud system
     */
    init() {
        try {
            this.setupContainer();
            this.generateClouds();
            this.bindEvents();
            this.isInitialized = true;
            console.log('✅ Cloud system initialized successfully');
        } catch (error) {
            console.error('❌ Cloud system initialization failed:', error);
            this.fallbackToStaticBackground();
        }
    }

    /**
     * Setup SVG container
     */
    setupContainer() {
        const viewport = this.getViewportDimensions();
        console.log('🌥️ CloudSystem: Setting up SVG container with viewport:', viewport);
        
        this.container.setAttribute('viewBox', `0 0 ${viewport.width} ${viewport.height}`);
        this.container.setAttribute('width', '100%');
        this.container.setAttribute('height', '100%');
        this.container.innerHTML = ''; // Clear existing content
        
        // Debug: Force container visibility
        this.container.style.opacity = '1';
        this.container.style.visibility = 'visible';
        this.container.style.display = 'block';
        this.container.style.position = 'absolute';
        this.container.style.top = '0';
        this.container.style.left = '0';
        this.container.style.pointerEvents = 'none';
        this.container.style.zIndex = '-1';
        
        console.log('🌥️ CloudSystem: SVG container setup complete:', {
            viewBox: this.container.getAttribute('viewBox'),
            width: this.container.getAttribute('width'),
            height: this.container.getAttribute('height'),
            style: this.container.style.cssText
        });
    }

    /**
     * Generate and position clouds
     */
    generateClouds() {
        console.log('🌥️ CloudSystem: Starting cloud generation...');
        const viewport = this.getViewportDimensions();
        console.log('🌥️ CloudSystem: Viewport:', viewport);
        const cloudCount = viewport.isMobile ? CloudConfig.CLOUD_COUNTS.MOBILE : CloudConfig.CLOUD_COUNTS.DESKTOP;
        console.log('🌥️ CloudSystem: Cloud count:', cloudCount);
        const positions = this.calculatePositions(viewport);
        console.log('🌥️ CloudSystem: Positions:', positions);

        for (let i = 0; i < cloudCount; i++) {
            const formation = CloudFormations[i % CloudFormations.length];
            const position = positions[i];
            const scale = this.calculateScale(formation, viewport.isMobile);
            
            console.log(`🌥️ CloudSystem: Creating cloud ${i + 1}:`, { formation: formation.id, position, scale });
            
            const cloudElement = this.createCloudElement(formation, position, scale, i + 1);
            this.container.appendChild(cloudElement);
            this.clouds.push({ element: cloudElement, formation, position, scale });
        }

        console.log(`✅ Generated ${this.clouds.length} clouds successfully`);
        
        // Debug: Check if clouds are visible in DOM
        setTimeout(() => {
            const cloudElements = document.querySelectorAll('.cloud-sketch');
            const paths = document.querySelectorAll('.cloud-sketch path');
            console.log('🌥️ CloudSystem: DOM check:', {
                cloudElements: cloudElements.length,
                paths: paths.length,
                firstCloudTransform: cloudElements[0]?.getAttribute('transform')
            });
        }, 100);
    }

    /**
     * Create individual cloud SVG element
     */
    createCloudElement(formation, position, scale, index) {
        console.log(`🌥️ CloudSystem: Creating SVG group for cloud ${index}`);
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.classList.add('cloud-sketch', `cloud-${index}`);
        group.setAttribute('transform', `translate(${position.x}, ${position.y}) scale(${scale})`);
        
        // Debug: Force visibility
        group.style.opacity = '1';
        group.style.visibility = 'visible';

        formation.paths.forEach((pathData, pathIndex) => {
            console.log(`🌥️ CloudSystem: Creating path ${pathIndex} for cloud ${index}`);
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', pathData);
            path.setAttribute('fill', formation.style.fill);
            path.setAttribute('stroke', formation.style.stroke);
            path.setAttribute('stroke-width', formation.style.strokeWidth);
            path.setAttribute('stroke-linecap', 'round');
            path.setAttribute('stroke-linejoin', 'round');
            
            // Debug: Force path visibility
            path.style.opacity = '1';
            path.style.visibility = 'visible';
            
            console.log(`🌥️ CloudSystem: Path ${pathIndex} attributes:`, {
                d: pathData.substring(0, 50) + '...',
                fill: formation.style.fill,
                stroke: formation.style.stroke,
                strokeWidth: formation.style.strokeWidth
            });
            
            group.appendChild(path);
        });

        console.log(`🌥️ CloudSystem: Cloud ${index} group created with ${formation.paths.length} paths`);
        return group;
    }

    /**
     * Calculate cloud positions
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
     * Calculate cloud scale
     */
    calculateScale(formation, isMobile) {
        const baseScale = formation.scale.min + Math.random() * (formation.scale.max - formation.scale.min);
        const scaleFactor = isMobile ? CloudConfig.SCALE_FACTORS.MOBILE : CloudConfig.SCALE_FACTORS.DESKTOP;
        return baseScale * scaleFactor;
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
            this.setupContainer();
            this.generateClouds();
        }
    }

    /**
     * Fallback for initialization failures
     */
    fallbackToStaticBackground() {
        console.warn('Cloud system fallback: Using static background');
        // Keep the CSS gradient background as fallback
    }

    /**
     * Destroy cloud system and clean up
     */
    destroy() {
        window.removeEventListener('resize', this.handleResize.bind(this));
        this.container.innerHTML = '';
        this.clouds = [];
        this.isInitialized = false;
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌥️ Cloud System: DOM ready, starting initialization...');
    try {
        const cloudSystem = new CloudSystem();
        console.log('🌥️ Cloud System: Instance created successfully');
        cloudSystem.init();
        console.log('🌥️ Cloud System: Initialization complete');
        
        // Make available globally for debugging
        window.CloudSystem = cloudSystem;
        
        // Debug: Log cloud container info
        const container = document.querySelector('.cloud-sketches');
        console.log('🌥️ Cloud Container:', {
            exists: !!container,
            tagName: container?.tagName,
            width: container?.clientWidth,
            height: container?.clientHeight,
            viewBox: container?.getAttribute('viewBox')
        });
        
    } catch (error) {
        console.error('❌ Failed to initialize cloud system:', error);
        console.error('❌ Error stack:', error.stack);
    }
});