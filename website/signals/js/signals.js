/**
 * SIGNALS Blog System - TUKU Group Cultural Intelligence
 * Modal-based article reading with search functionality
 */

class SignalsBlog {
    constructor() {
        this.articles = [];
        this.currentArticleIndex = -1;
        this.searchIndex = [];
        this.init();
    }

    init() {
        this.loadSampleArticles();
        this.buildSearchIndex();
        this.attachEventListeners();
        this.checkFirstVisit();
        console.log('SIGNALS blog system initialized');
    }

    // Real content packages - Research and Reflection focus (newest first)
    loadSampleArticles() {
        this.articles = [
            // Week 39 - Cultural Authenticity Package (newest)
            {
                id: 'cultural-authenticity-reflection',
                category: 'REFLECTION',
                packageTheme: 'Cultural Authenticity',
                pieceType: 'reflection',
                title: 'What Survives When Everything Changes',
                date: 'Sept 16, 2025',
                readingTime: '5 min read',
                excerpt: 'Personal reflection on how authenticity emerges through purposeful adaptation when communities retain agency over their cultural evolution.',
                content: `
                    <div class="article-content-header">
                        <div class="piece-type-indicator piece-reflection">REFLECTION</div>
                        <div class="article-content-category">Cultural Authenticity</div>
                        <div class="article-content-meta">
                            <span class="article-date">Sept 16, 2025</span>
                            <span class="meta-separator">•</span>
                            <span class="reading-time">5 min read</span>
                        </div>
                        <h1 class="article-content-title">What Survives When Everything Changes</h1>
                    </div>
                    <div class="article-content-body">
                        <p>My grandmother's recipes exist now in three forms: handwritten cards in faded ink, a digital document I typed to preserve them, and the modified versions I actually cook—adjusted for ingredients I can find, techniques I can manage, time I have available.</p>
                        
                        <p>Which version is authentic?</p>
                        
                        <p>The handwritten cards carry the weight of her hand, the authority of original source. The digital document preserves exact measurements and instructions. But the recipes I actually make—adapted to my kitchen, my skill, my family's tastes—these are the ones that live, that continue to create the tastes and memories that connect us across generations.</p>
                        
                        <p>The research on digital cultural preservation raises this question at institutional scale: What survives when everything changes? Communities worldwide grapple with translating living traditions into digital forms, knowing that translation always involves transformation.</p>
                        
                        <p>I think about the Indigenous language apps that teach pronunciation but can't transmit the spiritual context in which certain words are spoken. The virtual museum tours that let you examine artifacts in detail but can't convey the ceremonial significance of seeing them in proper context. The cultural traditions shared on social media platforms designed for entertainment and commerce.</p>
                        
                        <p>Something is always lost in translation. But something is also always gained—reach, accessibility, connection across distance and time. The question isn't whether to adapt—living cultures always adapt. The question is whether communities retain agency over the terms of adaptation.</p>
                        
                        <p>The most powerful digital cultural projects I've encountered are those where communities maintain control over their narratives. Not just consultation—actual authority over how their traditions are represented, who has access, under what conditions.</p>
                        
                        <p>In these projects, authenticity emerges not through perfect replication but through purposeful adaptation. Communities make conscious choices about which elements are essential to preserve, which aspects can be modified, what new possibilities digital spaces enable.</p>
                        
                        <p>I've watched elders teaching traditional crafts over video calls, adapting ancient pedagogies to digital formats. The medium is entirely new, but the relationship—elder to student, knowledge holder to knowledge seeker—remains intact. What survives isn't the specific form of transmission but the essential dynamic of cultural continuity.</p>
                        
                        <p>This suggests that authenticity might be less about preserving specific forms and more about preserving agency—the community's capacity to make decisions about its own cultural evolution.</p>
                        
                        <p>When external organizations digitize cultural materials without community input, they often focus on documenting artifacts rather than supporting living practice. But when communities lead their own digital initiatives, they tend to prioritize connection and continuity—using technology to strengthen relationships rather than simply preserve objects.</p>
                        
                        <p>The paradox of preservation through transformation resolves when communities retain authority over both preservation and transformation. Authenticity becomes not about unchanging tradition but about continuous intentional evolution guided by community values.</p>
                        
                        <p>Perhaps this is what resilience looks like in the digital age: not resistance to change but active engagement with change on community terms. Not perfect preservation but purposeful adaptation that serves community flourishing across generations.</p>
                        
                        <p>What survives when everything changes is not specific forms but the capacity to maintain meaning through transformation. The power to shape technology rather than be shaped by it. The authority to determine what is essential and what can evolve.</p>
                        
                        <p>In this framework, the most authentic digital cultural expressions may be those that demonstrate how communities actively direct their own adaptation—preserving not just tradition but the traditional authority to guide cultural evolution.</p>
                        
                        <p><em>Keywords: cultural authenticity, adaptive tradition, community agency, digital preservation, purposeful adaptation</em></p>
                    </div>
                `
            },
            // Week 37 - More-Than-Human Design Package
            {
                id: 'more-than-human-design-research',
                category: 'RESEARCH',
                packageTheme: 'Ecological Design',
                pieceType: 'research',
                title: 'Designing for the More-Than-Human',
                date: 'Sept 9, 2025',
                readingTime: '6 min read',
                excerpt: 'Design philosophy expands beyond human-centered approaches to include ecological perspectives, reshaping conservation and urban infrastructure planning.',
                content: `
                    <div class="article-content-header">
                        <div class="piece-type-indicator piece-research">RESEARCH</div>
                        <div class="article-content-category">Ecological Design</div>
                        <div class="article-content-meta">
                            <span class="article-date">Sept 9, 2025</span>
                            <span class="meta-separator">•</span>
                            <span class="reading-time">6 min read</span>
                        </div>
                        <h1 class="article-content-title">Designing for the More-Than-Human</h1>
                    </div>
                    <div class="article-content-body">
                        <p>The question arrives quietly in design studios: What if human needs aren't the only needs that matter?</p>
                        
                        <p>For decades, human-centered design has been the gold standard. Understand the user. Solve human problems. Create experiences that serve human purposes. But as environmental pressures mount, a new framework emerges: more-than-human-centered design.</p>
                        
                        <h2>Expanding the Circle of Consideration</h2>
                        
                        <p>This isn't about abandoning human needs but expanding consideration. <a href="https://www.nature.com/articles/s40494-024-01403-1" target="_blank">Recent research in ecological design systems</a> shows practitioners incorporating ecosystem perspectives into conservation infrastructure. Urban planners now consider how transportation systems impact ecological systems, designing infrastructure that contributes to environmental regeneration.</p>
                        
                        <p>The shift represents more than methodology—it's philosophical reorientation. Traditional design assumes human intelligence as the primary insight source. More-than-human approaches acknowledge that other species and ecological systems possess their own forms of intelligence that can inform better outcomes.</p>
                        
                        <p>In practice, this means multispecies design workshops where planners map migratory bird needs alongside pedestrian flows. Infrastructure projects ask not just "How do humans move through this space?" but "How do water, air, seeds, and wildlife move through this space?"</p>
                        
                        <p><a href="https://www.thearcticinstitute.org/leveraging-indigenous-knowledge-effective-nature-based-solutions-arctic/" target="_blank">The Arctic Institute</a> documents compelling examples in nature-based solutions leveraging Indigenous knowledge systems. These methodologies recognize that Indigenous communities have always designed with more-than-human perspectives, creating systems that serve human needs while supporting ecological relationships.</p>
                        
                        <h2>From Human-Centered to Ecosystem-Centered Practice</h2>
                        
                        <p>What emerges is design that thinks in longer time horizons and broader relationships. Instead of optimizing for immediate human convenience, practitioners consider seven-generation impacts. Instead of designing for isolated human use cases, they design for ecosystem health.</p>
                        
                        <p>This expansion reveals limitations of purely anthropocentric approaches. When transportation planning considers only human mobility, it fragments habitats and disrupts migration patterns. When urban development considers only human density, it eliminates green corridors essential for urban wildlife.</p>
                        
                        <p>More-than-human design doesn't diminish human importance but places human flourishing within larger systems of interdependence. The recognition: human well-being ultimately depends on ecological well-being.</p>
                        
                        <p>The methodology requires new forms of listening and observation. Designers learn to read landscape as more than backdrop, understand water flow as design constraint, recognize plant succession as opportunity. They develop interspecies empathy—capacity to consider needs radically different from human ones.</p>
                        
                        <p>This work often emerges from Indigenous design traditions that never separated human and natural systems. As mainstream design embraces these insights, it rediscovers principles of reciprocity and stewardship that industrial culture had forgotten.</p>
                        
                        <p>The implications extend beyond environmental projects. Product design asks how objects will decompose. Architecture considers building orientation for bird migration patterns. Urban planning treats green infrastructure as essential habitat, not amenity.</p>
                        
                        <p>Critics worry about expanding design considerations so broadly. How do you optimize for everyone—including non-human everyone? Practitioners respond that this apparent complexity actually clarifies priorities. When you design for ecosystem health, you often discover solutions that serve human needs more sustainably.</p>
                        
                        <p>More-than-human design represents maturation of environmental consciousness in creative practice. It moves beyond the binary of humans versus nature toward recognition of humans within nature—participants in ecological systems requiring our care.</p>
                        
                        <p>When we design for the more-than-human, we design for the conditions that make human flourishing possible.</p>
                        
                        <p><em>Keywords: ecological design, more-than-human design, biodiversity conservation, multispecies thinking, indigenous design, ecosystem health</em></p>
                    </div>
                `
            },
            {
                id: 'more-than-human-design-reflection',
                category: 'REFLECTION',
                packageTheme: 'Ecological Design',
                pieceType: 'reflection',
                title: 'Learning to Listen to What Cannot Speak',
                date: 'Sept 9, 2025',
                readingTime: '4 min read',
                excerpt: 'Personal reflection on expanding design empathy beyond human experience to include the needs and intelligence of entire ecosystems.',
                content: `
                    <div class="article-content-header">
                        <div class="piece-type-indicator piece-reflection">REFLECTION</div>
                        <div class="article-content-category">Ecological Design</div>
                        <div class="article-content-meta">
                            <span class="article-date">Sept 9, 2025</span>
                            <span class="meta-separator">•</span>
                            <span class="reading-time">4 min read</span>
                        </div>
                        <h1 class="article-content-title">Learning to Listen to What Cannot Speak</h1>
                    </div>
                    <div class="article-content-body">
                        <p>I walk through the city differently now, aware of the conversations happening just beyond human frequency.</p>
                        
                        <p>The sidewalk cracks where tree roots push upward, seeking light and water that concrete won't allow. Storm drains that channel rainwater away from where it wants to pool and percolate. Buildings that stand deaf to the migration patterns of birds who've navigated this route for millennia.</p>
                        
                        <p>The research on more-than-human design asks us to expand our empathy beyond human experience. But empathy suggests understanding through similarity, and there's little similarity between human consciousness and the intelligence of watersheds or mycorrhizal networks.</p>
                        
                        <p>What's required is something different—a kind of humility that recognizes agency in beings and systems we can't fully comprehend. The river knows where it wants to flow. The forest understands succession in ways we can barely map. The soil holds memory of relationships we're only beginning to discover.</p>
                        
                        <p>This isn't romantic anthropomorphizing. It's recognition that other forms of intelligence operate on timescales and through processes that human-centered thinking rarely considers. When we design only for human needs, we often work against these larger intelligences.</p>
                        
                        <p>I think of the urban planners learning to read landscapes as participants rather than resources. They speak of discovering that what initially appears as constraint—preserving bird corridors, protecting wetlands, maintaining native plant communities—often reveals itself as opportunity for more elegant human solutions.</p>
                        
                        <p>There's something liberating in surrendering the burden of human-only intelligence. When you design for ecosystem health, you align with processes that have been optimizing for sustainability far longer than human civilization has existed.</p>
                        
                        <p>But the practice requires a different kind of listening. Not the focus group or user interview that human-centered design depends on, but attention to slower rhythms, longer cycles, relationships that extend beyond individual lifespans.</p>
                        
                        <p>I find myself pausing at the edge of construction sites, wondering what the disrupted soil might teach about water flow, what the displaced plants might reveal about seasonal patterns, what the altered topography might mean for creatures whose needs we never considered.</p>
                        
                        <p>This expansion of design consideration doesn't diminish human importance—it places human flourishing within systems of interdependence that make our well-being possible. We begin to understand that designing for the health of larger living systems is designing for our own survival.</p>
                        
                        <p>The most profound shift is temporal. Human-centered design optimizes for current users with immediate needs. More-than-human design thinks in generations—considering not just present inhabitants but future ones, not just human futures but ecological ones.</p>
                        
                        <p>In this extended perspective, the urgent and important begin to separate more clearly. What serves immediate human convenience may undermine the conditions that make long-term human thriving possible.</p>
                        
                        <p>Perhaps this is what wisdom looks like in an age of ecological crisis: the capacity to design not just for ourselves but for the larger web of relationships that sustains all life.</p>
                        
                        <p>We're learning to listen to what cannot speak in human language but communicates through patterns, flows, and relationships that preceded our presence and will extend beyond our tenure.</p>
                        
                        <p>In that listening, we find not limitation but guidance toward ways of making that honor both human creativity and the larger creativity of living systems.</p>
                        
                        <p><em>Keywords: ecological empathy, more-than-human listening, design humility, ecosystem intelligence, interdependence</em></p>
                    </div>
                `
            },
            {
                id: 'indigenous-innovation-research',
                category: 'RESEARCH',
                packageTheme: 'Indigenous Design',
                pieceType: 'research',
                title: 'Innovation Through Ancient Wisdom',
                date: 'Sept 2, 2025',
                readingTime: '8 min read',
                excerpt: 'Indigenous communities lead sustainable creative methodologies, challenging extractive models through reciprocity-based frameworks and seven-generation thinking.',
                content: `
                    <div class="article-content-header">
                        <div class="piece-type-indicator piece-research">RESEARCH</div>
                        <div class="article-content-category">Indigenous Design</div>
                        <div class="article-content-meta">
                            <span class="article-date">Sept 2, 2025</span>
                            <span class="meta-separator">•</span>
                            <span class="reading-time">8 min read</span>
                        </div>
                        <h1 class="article-content-title">Innovation Through Ancient Wisdom</h1>
                    </div>
                    <div class="article-content-body">
                        <p>Innovation, as commonly understood, moves fast and breaks things. Indigenous innovation moves slowly and heals them.</p>
                        
                        <p>This isn't a romantic notion but an observable phenomenon reshaping how mainstream organizations approach creative methodology, sustainability practice, and community engagement. Indigenous communities worldwide are demonstrating approaches to innovation that challenge the fundamental assumptions of extractive, growth-oriented creative practice.</p>
                        
                        <h2>Seven-Generation Thinking in Practice</h2>
                        
                        <p>At the heart of this distinction lies temporal thinking. Where conventional innovation optimizes for quarterly results, Indigenous methodologies consider seven-generation impacts. Where mainstream creative practice focuses on individual authorship and ownership, Indigenous approaches emphasize collective stewardship and reciprocal responsibility.</p>
                        
                        <p><a href="https://catapultdesign.org/introducing-a-framework-for-indigenizing-design/" target="_blank">The Catapult Design framework</a> for "indigenizing design" articulates principles that mainstream creative industries are beginning to recognize as essential for sustainable practice: long-term consequence consideration, relationship-based decision making, and recognition of interconnected systems rather than isolated problems.</p>
                        
                        <p>These aren't abstract concepts but practical methodologies with measurable outcomes. <a href="https://www.thearcticinstitute.org/leveraging-indigenous-knowledge-effective-nature-based-solutions-arctic/" target="_blank">The Arctic Institute</a> documents nature-based solutions that leverage Indigenous knowledge systems to address climate adaptation challenges. These approaches consistently outperform conventional engineering solutions because they work with ecological processes rather than against them.</p>
                        
                        <p>The key insight: Indigenous communities possess detailed, context-specific knowledge developed over generations of careful observation and respectful interaction with specific places. This knowledge enables the design of solutions that are environmentally sustainable, culturally appropriate, and systemically resilient.</p>
                        
                        <h2>From Disruption to Cultivation</h2>
                        
                        <p>What emerges is a model of innovation as cultivation rather than disruption. Instead of rapid iteration and pivot strategies, Indigenous methodologies emphasize patient observation, careful relationship-building, and incremental refinement over extended timeframes.</p>
                        
                        <p>This approach produces different kinds of outcomes. Rather than breakthrough products or scalable solutions, Indigenous innovation tends toward regenerative systems, strengthened communities, and enhanced resilience across social and ecological networks.</p>
                        
                        <p>The methodology itself offers insights for creative practice beyond environmental applications. Indigenous design processes typically begin with understanding place-not just physical location but the web of relationships, histories, and responsibilities that location embodies. They proceed through community consultation that includes not just current stakeholders but consideration of future generations and non-human inhabitants.</p>
                        
                        <p>Decision-making processes emphasize consensus-building and consequence consideration over efficiency and speed. Solutions are evaluated not just for immediate effectiveness but for long-term impacts on community sovereignty, cultural continuity, and ecological health.</p>
                        
                        <p>These approaches challenge several core assumptions of mainstream creative practice. The primacy of individual authorship gives way to collaborative stewardship. The focus on novel solutions yields to refinement of time-tested approaches. The emphasis on scaling and growth transforms into attention to appropriate scale and sustainable continuation.</p>
                        
                        <p>Recent research shows that when mainstream organizations adopt Indigenous methodologies-even partially-they often discover enhanced resilience, stronger community relationships, and more sustainable outcomes. But successful adoption requires more than technique borrowing; it demands philosophical reorientation toward reciprocity, responsibility, and relationship.</p>
                        
                        <p>This isn't about appropriating Indigenous knowledge but about learning from Indigenous ways of approaching innovation itself. The principles-seven-generation thinking, relationship-based design, reciprocal responsibility-can be applied across contexts while respecting the sovereignty and specificity of Indigenous knowledge systems.</p>
                        
                        <p>The business case for this approach becomes clearer as climate disruption and social inequality challenge the sustainability of extractive models. Organizations that learn to innovate through relationship rather than exploitation, that optimize for resilience rather than efficiency, that consider community impact alongside individual benefit, demonstrate greater adaptability to changing conditions.</p>
                        
                        <p>Indigenous innovation offers a pathway beyond the false choice between technological progress and environmental protection. It suggests that the most sophisticated solutions often emerge from the deepest understanding of place, relationship, and responsibility.</p>
                        
                        <p>As mainstream creative practice grapples with questions of sustainability, equity, and long-term thinking, Indigenous methodologies provide tested frameworks for innovation that serves not just immediate needs but the conditions that make life possible across generations.</p>
                        
                        <p>The future may depend on learning to innovate like our ancestors: with patience, relationship, and attention to consequences that extend far beyond our individual lifespans.</p>
                        
                        <p><em>Keywords: indigenous design, seven-generation thinking, reciprocal innovation, sustainable methodology, community stewardship, regenerative systems</em></p>
                    </div>
                `
            },
            {
                id: 'indigenous-innovation-reflection',
                category: 'REFLECTION',
                packageTheme: 'Indigenous Design',
                pieceType: 'reflection',
                title: 'On Slowing Down to Move Forward',
                date: 'Sept 2, 2025',
                readingTime: '4 min read',
                excerpt: 'Personal reflection on learning patience and relationship from Indigenous methodologies that prioritize seven-generation thinking.',
                content: `
                    <div class="article-content-header">
                        <div class="piece-type-indicator piece-reflection">REFLECTION</div>
                        <div class="article-content-category">Indigenous Design</div>
                        <div class="article-content-meta">
                            <span class="article-date">Sept 2, 2025</span>
                            <span class="meta-separator">•</span>
                            <span class="reading-time">4 min read</span>
                        </div>
                        <h1 class="article-content-title">On Slowing Down to Move Forward</h1>
                    </div>
                    <div class="article-content-body">
                        <p>I used to measure progress by acceleration. How quickly could ideas become products? How rapidly could concepts scale? Speed felt like intelligence, urgency like importance.</p>
                        
                        <p>Then I encountered the seven-generation principle: consider the impact of every decision on the seventh generation to come. Not seven years—seven generations. Roughly 140 years into a future I will never see.</p>
                        
                        <p>The principle stops you mid-thought. The urgent question—Will this work?—expands into something more complex: Will this work for the great-great-great-great-great-grandchildren of people not yet born?</p>
                        
                        <p>This isn't hypothetical philosophy for Indigenous communities practicing traditional governance. It's practical methodology for navigating complex decisions with consequences that extend far beyond immediate visibility.</p>
                        
                        <p>I think about the creative projects that felt most meaningful in my own work. They weren't the fastest ones, or even the most efficient. They were the ones that grew slowly, that honored the relationships they emerged from, that considered impacts I hadn't initially thought to measure.</p>
                        
                        <p>Indigenous innovation methodologies suggest that depth might be more valuable than speed, that relationship might be more important than efficiency, that sustainability might require forms of thinking that move counter to contemporary optimization culture.</p>
                        
                        <p>There's humility in this recognition. The assumption that faster is better, that newer is superior, that individual brilliance trumps collective wisdom—these assumptions look less like progress and more like blindness when viewed from seven-generation perspective.</p>
                        
                        <p>I've watched organizations attempt to adopt Indigenous principles as techniques—seven-generation thinking as strategic planning tool, relationship-based design as stakeholder engagement process. The results feel hollow because they miss the fundamental reorientation these approaches require.</p>
                        
                        <p>Indigenous innovation isn't about better methods; it's about different values. It's about optimizing for resilience over growth, for community health over individual achievement, for long-term sustainability over short-term gains.</p>
                        
                        <p>The shift feels counter-cultural in an environment that rewards disruption and celebrates breaking things. But maybe disruption was never the goal—maybe it was a side effect of innovation practiced without wisdom, creativity pursued without relationship, progress measured without consequence consideration.</p>
                        
                        <p>When I slow down enough to consider seven generations, different questions emerge. Not just "Will this work?" but "Who does this serve? What does this cost? How does this support or diminish the conditions that make life possible?"</p>
                        
                        <p>These questions don't paralyze decision-making; they clarify it. When you're designing for 140 years in the future, certain choices become obviously unsustainable, while others reveal themselves as genuinely generative.</p>
                        
                        <p>Perhaps this is what maturity looks like in creative practice: the capacity to move beyond the narcissism of immediate results toward the responsibility of long-term consequence. Not because it's morally superior, but because it's practically necessary.</p>
                        
                        <p>Indigenous methodologies remind us that innovation has always existed—that the most sophisticated technologies are often the ones that have sustained communities across thousands of years of changing conditions.</p>
                        
                        <p>We're not learning to innovate. We're learning to innovate responsibly, with attention to the relationships and consequences that extend far beyond our individual lifespans.</p>
                        
                        <p>The longest view, it turns out, often reveals the clearest path forward.</p>
                        
                        <p><em>Keywords: seven-generation thinking, Indigenous wisdom, sustainable innovation, long-term consequence, creative responsibility</em></p>
                    </div>
                `
            }
        ];
    }

    // Build search index for real-time search
    buildSearchIndex() {
        this.searchIndex = this.articles.map(article => ({
            id: article.id,
            searchText: `${article.title} ${article.excerpt} ${article.category}`.toLowerCase(),
            ...article
        }));
    }

    // Event listeners
    attachEventListeners() {
        // Article previews
        document.addEventListener('click', (e) => {
            const articlePreview = e.target.closest('.article-preview');
            if (articlePreview) {
                const articleId = articlePreview.dataset.articleId;
                this.openArticle(articleId);
            }
        });

        // Search functionality
        const searchBtn = document.getElementById('searchBtn');
        const searchOverlay = document.getElementById('searchOverlay');
        const searchClose = document.getElementById('searchClose');
        const searchInput = document.getElementById('searchInput');

        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.openSearch());
        }

        if (searchClose) {
            searchClose.addEventListener('click', () => this.closeSearch());
        }

        if (searchOverlay) {
            searchOverlay.addEventListener('click', (e) => {
                if (e.target === searchOverlay) {
                    this.closeSearch();
                }
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.performSearch(e.target.value);
            });
        }

        // Article modal controls
        const articleOverlay = document.getElementById('articleOverlay');
        const articleClose = document.getElementById('articleClose');
        const articlePrev = document.getElementById('articlePrev');
        const articleNext = document.getElementById('articleNext');

        if (articleClose) {
            articleClose.addEventListener('click', () => this.closeArticle());
        }

        if (articleOverlay) {
            articleOverlay.addEventListener('click', (e) => {
                if (e.target === articleOverlay) {
                    this.closeArticle();
                }
            });
        }

        if (articlePrev) {
            articlePrev.addEventListener('click', () => this.navigateArticle('prev'));
        }

        if (articleNext) {
            articleNext.addEventListener('click', () => this.navigateArticle('next'));
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (document.getElementById('foundersNoteOverlay').classList.contains('active')) {
                    this.closeFoundersNote();
                } else if (document.getElementById('articleOverlay').classList.contains('active')) {
                    this.closeArticle();
                } else if (document.getElementById('searchOverlay').classList.contains('active')) {
                    this.closeSearch();
                }
            }

            if (e.key === '/' && !e.target.matches('input')) {
                e.preventDefault();
                this.openSearch();
            }

            if (document.getElementById('articleOverlay').classList.contains('active')) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.navigateArticle('prev');
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.navigateArticle('next');
                }
            }
        });

        // Reading progress scroll listener
        document.addEventListener('scroll', (e) => {
            if (e.target.classList && e.target.classList.contains('article-content')) {
                this.updateReadingProgress(e.target);
            }
        }, true);

        // Search results click
        document.addEventListener('click', (e) => {
            const searchResult = e.target.closest('.search-result');
            if (searchResult) {
                const articleId = searchResult.dataset.articleId;
                this.closeSearch();
                this.openArticle(articleId);
            }
        });

        // Text size controls
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('text-size-btn')) {
                const size = e.target.dataset.size;
                console.log(`Text size button clicked: ${size}`); // Debug log
                
                this.setTextSize(size);
                
                // Update active state
                document.querySelectorAll('.text-size-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                console.log(`Active button updated:`, e.target); // Debug log
            }
        });

        // Founder's Note controls
        const foundersNoteOverlay = document.getElementById('foundersNoteOverlay');
        const foundersNoteClose = document.getElementById('foundersNoteClose');

        if (foundersNoteClose) {
            foundersNoteClose.addEventListener('click', () => this.closeFoundersNote());
        }

        if (foundersNoteOverlay) {
            foundersNoteOverlay.addEventListener('click', (e) => {
                if (e.target === foundersNoteOverlay) {
                    this.closeFoundersNote();
                }
            });
        }
    }

    // Search functionality
    openSearch() {
        const searchOverlay = document.getElementById('searchOverlay');
        const searchInput = document.getElementById('searchInput');
        
        if (searchOverlay) {
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus search input after animation
            setTimeout(() => {
                if (searchInput) {
                    searchInput.focus();
                }
            }, 100);
        }
    }

    closeSearch() {
        const searchOverlay = document.getElementById('searchOverlay');
        const searchInput = document.getElementById('searchInput');
        
        if (searchOverlay) {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
            
            if (searchInput) {
                searchInput.value = '';
                this.clearSearchResults();
            }
        }
    }

    performSearch(query) {
        const searchResults = document.getElementById('searchResults');
        
        if (!query.trim()) {
            this.clearSearchResults();
            return;
        }

        const results = this.searchIndex.filter(article => 
            article.searchText.includes(query.toLowerCase())
        );

        if (results.length === 0) {
            searchResults.innerHTML = '<div style="padding: 20px; text-align: center; opacity: 0.6; font-size: 0.9rem;">No articles found</div>';
            return;
        }

        searchResults.innerHTML = results.map(article => `
            <div class="search-result" data-article-id="${article.id}">
                <div class="search-result-title">${article.title}</div>
                <div class="search-result-meta">${article.category} • ${article.date} • ${article.readingTime}</div>
                <div class="search-result-excerpt">${article.excerpt}</div>
            </div>
        `).join('');
    }

    clearSearchResults() {
        const searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = '';
    }

    // Article modal functionality
    openArticle(articleId) {
        const article = this.articles.find(a => a.id === articleId);
        if (!article) return;

        this.currentArticleIndex = this.articles.findIndex(a => a.id === articleId);
        
        const articleOverlay = document.getElementById('articleOverlay');
        const articleContent = document.getElementById('articleContent');
        
        if (articleContent) {
            articleContent.innerHTML = article.content;
        }

        this.updateArticleNavigation();
        this.loadTextSizePreference();

        if (articleOverlay) {
            articleOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Update URL without page reload
        if (history.pushState) {
            history.pushState(null, null, `#${articleId}`);
        }
    }

    closeArticle() {
        const articleOverlay = document.getElementById('articleOverlay');
        
        if (articleOverlay) {
            articleOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        this.currentArticleIndex = -1;

        // Reset URL
        if (history.pushState) {
            history.pushState(null, null, window.location.pathname);
        }
    }

    navigateArticle(direction) {
        let newIndex = this.currentArticleIndex;
        
        if (direction === 'prev') {
            newIndex = newIndex > 0 ? newIndex - 1 : this.articles.length - 1;
        } else if (direction === 'next') {
            newIndex = newIndex < this.articles.length - 1 ? newIndex + 1 : 0;
        }

        const newArticle = this.articles[newIndex];
        if (newArticle) {
            this.openArticle(newArticle.id);
        }
    }

    updateArticleNavigation() {
        const articlePrev = document.getElementById('articlePrev');
        const articleNext = document.getElementById('articleNext');

        if (articlePrev && articleNext) {
            // Always enable navigation for cycling
            articlePrev.disabled = false;
            articleNext.disabled = false;
        }
    }

    // Text size control
    setTextSize(size) {
        const articleContent = document.getElementById('articleContent');
        if (articleContent) {
            // Remove existing size classes
            articleContent.classList.remove('text-size-small', 'text-size-large');
            // Add new size class
            articleContent.classList.add(`text-size-${size}`);
            
            console.log(`Text size changed to: ${size}`, articleContent.className); // Debug log
            
            // Store preference in localStorage
            try {
                localStorage.setItem('signals-text-size', size);
            } catch (error) {
                console.warn('Could not save text size preference:', error);
            }
        } else {
            console.warn('Article content element not found');
        }
    }

    // Load saved text size preference
    loadTextSizePreference() {
        try {
            const savedSize = localStorage.getItem('signals-text-size') || 'large';
            this.setTextSize(savedSize);
            
            // Update button states with slight delay to ensure DOM is ready
            setTimeout(() => {
                document.querySelectorAll('.text-size-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.size === savedSize);
                });
            }, 50);
        } catch (error) {
            console.warn('Could not load text size preference:', error);
        }
    }

    // First visit check
    checkFirstVisit() {
        try {
            const hasVisited = localStorage.getItem('signals-has-visited');
            if (!hasVisited) {
                // Show founder's note on first visit
                setTimeout(() => {
                    this.showFoundersNote();
                }, 1000); // Delay to let page settle
                
                // Mark as visited
                localStorage.setItem('signals-has-visited', 'true');
            }
        } catch (error) {
            console.warn('Could not check first visit:', error);
        }
    }

    // Founder's Note functionality
    showFoundersNote() {
        const foundersNoteOverlay = document.getElementById('foundersNoteOverlay');
        if (foundersNoteOverlay) {
            foundersNoteOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeFoundersNote() {
        const foundersNoteOverlay = document.getElementById('foundersNoteOverlay');
        if (foundersNoteOverlay) {
            foundersNoteOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Reading progress indicator
    updateReadingProgress(scrollContainer) {
        const progress = document.getElementById('readingProgress');
        if (!progress) return;

        const scrollTop = scrollContainer.scrollTop;
        const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        
        progress.style.width = `${Math.min(scrollPercent, 100)}%`;
    }

    // Initialize on page load
    static init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                new SignalsBlog();
            });
        } else {
            new SignalsBlog();
        }
    }
}

// Handle direct article links (e.g., signals.html#article-id)
window.addEventListener('load', () => {
    if (window.location.hash && window.signalsBlog) {
        const articleId = window.location.hash.substring(1);
        if (window.signalsBlog.articles.find(a => a.id === articleId)) {
            window.signalsBlog.openArticle(articleId);
        }
    }
});

// Initialize the blog system
SignalsBlog.init();

// Make available globally for potential external use
window.SignalsBlog = SignalsBlog;