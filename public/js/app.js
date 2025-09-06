// public/js/app.js
class NothingOSAcademicSite {
    constructor() {
        this.currentPage = 'home';
        this.isTransitioning = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTheme();
        this.setupNavigation();
        this.setupAnimations();
        this.loadPageContent();
    }

    setupEventListeners() {
        // Navigation clicks
        document.querySelectorAll('.nav-link, [data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page') || link.getAttribute('href').substring(1);
                this.navigateToPage(page);
            });
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Scroll effects
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Prevent default hash navigation
        window.addEventListener('hashchange', (e) => {
            e.preventDefault();
        });
    }

    setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    setupNavigation() {
        // Set active nav link based on current page
        this.updateActiveNavLink();
    }

    updateActiveNavLink() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === this.currentPage) {
                link.classList.add('active');
            }
        });
    }

    handleScroll() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    async navigateToPage(page) {
        if (this.isTransitioning || page === this.currentPage) return;

        this.isTransitioning = true;
        this.showPageTransition();

        // Update URL without triggering navigation
        history.pushState({ page }, '', `#${page}`);

        // Load page content
        await this.loadPageContent(page);

        // Update current page
        this.currentPage = page;
        this.updateActiveNavLink();

        // Show new content
        this.showPageContent(page);

        setTimeout(() => {
            this.hidePageTransition();
            this.isTransitioning = false;
        }, 300);
    }

    showPageTransition() {
        document.getElementById('pageTransition').classList.add('active');
    }

    hidePageTransition() {
        document.getElementById('pageTransition').classList.remove('active');
    }

    showPageContent(page) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        document.getElementById(page).classList.add('active');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Trigger animations
        this.triggerPageAnimations(page);
    }

    async loadPageContent(page = this.currentPage) {
        if (page === 'home') return; // Home content is already loaded

        const section = document.getElementById(page);
        if (section.innerHTML.trim()) return; // Content already loaded

        try {
            const content = await this.fetchPageContent(page);
            section.innerHTML = content;
        } catch (error) {
            console.error(`Failed to load ${page} content:`, error);
            section.innerHTML = this.getErrorContent(page);
        }
    }

    async fetchPageContent(page) {
        // In a real app, this would fetch from your API
        // For now, return static content based on page

        switch (page) {
            case 'teaching':
                return this.getTeachingContent();
            case 'research':
                return this.getResearchContent();
            case 'publications':
                return await this.getPublicationsContent();
            case 'students':
                return await this.getStudentsContent();
            case 'news':
                return await this.getNewsContent();
            case 'contact':
                return this.getContactContent();
            default:
                return this.getErrorContent(page);
        }
    }

    getTeachingContent() {
        return `
            <div class="section-container">
                <div class="section-header">
                    <h2 class="section-title">Teaching</h2>
                    <p class="section-description">
                        Comprehensive courses across undergraduate and graduate programs, 
                        designed to build strong foundations and advanced expertise.
                    </p>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 32px;">
                    <div class="card animate-in">
                        <div style="display: flex; align-items: flex-start; gap: 24px; margin-bottom: 32px;">
                            <div style="width: 48px; height: 48px; background: var(--color-accent); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">🍂</div>
                            <div>
                                <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 8px; color: var(--color-primary);">Autumn Semester</h3>
                                <p style="color: var(--color-secondary);">Core courses building fundamental skills</p>
                            </div>
                        </div>
                        <div style="display: grid; gap: 16px;">
                            <div style="display: flex; align-items: center; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--bg-tertiary);">
                                <span style="background: var(--bg-tertiary); color: var(--color-accent); padding: 4px 16px; border-radius: 8px; font-family: var(--font-mono); font-size: 14px; font-weight: 600; min-width: 80px; text-align: center;">CS521</span>
                                <span style="flex: 1; font-weight: 500; color: var(--color-primary);">Object Oriented Programming & Design</span>
                                <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">Graduate</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--bg-tertiary);">
                                <span style="background: var(--bg-tertiary); color: var(--color-accent); padding: 4px 16px; border-radius: 8px; font-family: var(--font-mono); font-size: 14px; font-weight: 600; min-width: 80px; text-align: center;">DB101</span>
                                <span style="flex: 1; font-weight: 500; color: var(--color-primary);">Database Systems</span>
                                <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">Graduate</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--bg-tertiary);">
                                <span style="background: var(--bg-tertiary); color: var(--color-accent); padding: 4px 16px; border-radius: 8px; font-family: var(--font-mono); font-size: 14px; font-weight: 600; min-width: 80px; text-align: center;">GIS200</span>
                                <span style="flex: 1; font-weight: 500; color: var(--color-primary);">Geographic Information Systems</span>
                                <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">Graduate</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--bg-tertiary);">
                                <span style="background: var(--bg-tertiary); color: var(--color-accent); padding: 4px 16px; border-radius: 8px; font-family: var(--font-mono); font-size: 14px; font-weight: 600; min-width: 80px; text-align: center;">SS301</span>
                                <span style="flex: 1; font-weight: 500; color: var(--color-primary);">System Software</span>
                                <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">Graduate</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 16px; padding: 16px 0;">
                                <span style="background: var(--bg-tertiary); color: var(--color-accent); padding: 4px 16px; border-radius: 8px; font-family: var(--font-mono); font-size: 14px; font-weight: 600; min-width: 80px; text-align: center;">DS102</span>
                                <span style="flex: 1; font-weight: 500; color: var(--color-primary);">Discrete Structures</span>
                                <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">Graduate</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card animate-in">
                        <div style="display: flex; align-items: flex-start; gap: 24px; margin-bottom: 32px;">
                            <div style="width: 48px; height: 48px; background: var(--color-success); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">🌸</div>
                            <div>
                                <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 8px; color: var(--color-primary);">Spring Semester</h3>
                                <p style="color: var(--color-secondary);">Advanced topics and specialized areas</p>
                            </div>
                        </div>
                        <div style="display: grid; gap: 16px;">
                            <div style="display: flex; align-items: center; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--bg-tertiary);">
                                <span style="background: var(--bg-tertiary); color: var(--color-accent); padding: 4px 16px; border-radius: 8px; font-family: var(--font-mono); font-size: 14px; font-weight: 600; min-width: 80px; text-align: center;">CS403</span>
                                <span style="flex: 1; font-weight: 500; color: var(--color-primary);">File Structures</span>
                                <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">Graduate</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--bg-tertiary);">
                                <span style="background: var(--bg-tertiary); color: var(--color-accent); padding: 4px 16px; border-radius: 8px; font-family: var(--font-mono); font-size: 14px; font-weight: 600; min-width: 80px; text-align: center;">SE301</span>
                                <span style="flex: 1; font-weight: 500; color: var(--color-primary);">Software Engineering</span>
                                <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">Graduate</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--bg-tertiary);">
                                <span style="background: var(--bg-tertiary); color: var(--color-accent); padding: 4px 16px; border-radius: 8px; font-family: var(--font-mono); font-size: 14px; font-weight: 600; min-width: 80px; text-align: center;">CS401</span>
                                <span style="flex: 1; font-weight: 500; color: var(--color-primary);">Data Structures</span>
                                <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">Graduate</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 16px; padding: 16px 0;">
                                <span style="background: var(--bg-tertiary); color: var(--color-accent); padding: 4px 16px; border-radius: 8px; font-family: var(--font-mono); font-size: 14px; font-weight: 600; min-width: 80px; text-align: center;">CO208</span>
                                <span style="flex: 1; font-weight: 500; color: var(--color-primary);">Object Oriented Programming</span>
                                <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">Undergrad</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card animate-in" style="margin-top: 32px;">
                    <div style="display: flex; align-items: flex-start; gap: 24px; margin-bottom: 32px;">
                        <div style="width: 48px; height: 48px; background: var(--color-warning); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">🎓</div>
                        <div>
                            <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 8px; color: var(--color-primary);">CBCT Courses</h3>
                            <p style="color: var(--color-secondary);">Specialized courses for comprehensive skill development</p>
                        </div>
                    </div>
                    <div style="display: grid; gap: 16px;">
                        <div style="display: flex; align-items: center; gap: 16px; padding: 16px 0;">
                            <span style="background: var(--bg-tertiary); color: var(--color-accent); padding: 4px 16px; border-radius: 8px; font-family: var(--font-mono); font-size: 14px; font-weight: 600; min-width: 80px; text-align: center;">ISC</span>
                            <span style="flex: 1; font-weight: 500; color: var(--color-primary);">Information Systems & Computing</span>
                            <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">Special</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Add similar methods for other pages...
    getResearchContent() {
        return `
            <div class="section-container">
                <div class="section-header">
                    <h2 class="section-title">Research</h2>
                    <p class="section-description">
                        Exploring cutting-edge technologies and methodologies to solve complex problems 
                        in trust systems, data analysis, and web technologies.
                    </p>
                </div>
                
                <div class="card animate-in">
                    <div style="display: flex; align-items: flex-start; gap: 24px; margin-bottom: 32px;">
                        <div style="width: 48px; height: 48px; background: var(--color-accent); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">🔬</div>
                        <div>
                            <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 8px; color: var(--color-primary);">Research Areas</h3>
                            <p style="color: var(--color-secondary);">Current focus areas and ongoing investigations</p>
                        </div>
                    </div>
                    <div>
                        <p style="font-size: 1.125rem; line-height: 1.8; color: var(--color-secondary); margin-bottom: 32px;">
                            My research focuses on developing innovative computational solutions that address 
                            real-world challenges in trust assessment, data analysis, and distributed systems. 
                            I am particularly interested in the intersection of these areas and their applications 
                            in modern computing environments.
                        </p>
                        <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                            <span style="background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-success) 100%); color: white; padding: 8px 24px; border-radius: 25px; font-size: 14px; font-weight: 600;">Trust & Reputation Systems</span>
                            <span style="background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-success) 100%); color: white; padding: 8px 24px; border-radius: 25px; font-size: 14px; font-weight: 600;">Data Mining</span>
                            <span style="background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-success) 100%); color: white; padding: 8px 24px; border-radius: 25px; font-size: 14px; font-weight: 600;">Web Services</span>
                            <span style="background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-success) 100%); color: white; padding: 8px 24px; border-radius: 25px; font-size: 14px; font-weight: 600;">Spatial Database</span>
                            <span style="background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-success) 100%); color: white; padding: 8px 24px; border-radius: 25px; font-size: 14px; font-weight: 600;">Machine Learning</span>
                            <span style="background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-success) 100%); color: white; padding: 8px 24px; border-radius: 25px; font-size: 14px; font-weight: 600;">Distributed Systems</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async getPublicationsContent() {
        // Simulate API call
        await this.delay(500);
        return `
            <div class="section-container">
                <div class="section-header">
                    <h2 class="section-title">Publications</h2>
                    <p class="section-description">
                        Peer-reviewed research contributions and academic publications in leading journals and conferences.
                    </p>
                </div>
                
                <div style="display: grid; gap: 24px;">
                    <div class="card animate-in">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                            <div>
                                <h3 style="font-size: 1.25rem; font-weight: 600; color: var(--color-primary); margin-bottom: 8px;">Trust-based Reputation Systems in Distributed Computing Environments</h3>
                                <p style="color: var(--color-secondary); margin-bottom: 4px;">S.I. Singh, A. Kumar, R. Sharma</p>
                                <p style="color: var(--color-accent); font-weight: 500; font-size: 14px;">IEEE Transactions on Parallel and Distributed Systems</p>
                            </div>
                            <div style="background: var(--bg-tertiary); color: var(--color-primary); padding: 4px 12px; border-radius: 8px; font-size: 14px; font-weight: 600;">2024</div>
                        </div>
                        <p style="margin-top: 16px; color: var(--color-secondary); font-size: 14px; line-height: 1.6;">
                            This paper presents a novel approach to building trust-based reputation systems for distributed computing environments. 
                            We propose a multi-layered framework that incorporates both direct and indirect trust assessments, 
                            resulting in improved security and reliability for large-scale distributed applications.
                        </p>
                        <div style="display: flex; gap: 16px; margin-top: 16px;">
                            <a href="#" style="padding: 4px 16px; background: var(--bg-tertiary); color: var(--color-accent); text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500;">PDF</a>
                            <a href="#" style="padding: 4px 16px; background: var(--bg-tertiary); color: var(--color-accent); text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500;">DOI</a>
                            <a href="#" style="padding: 4px 16px; background: var(--bg-tertiary); color: var(--color-accent); text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500;">Cite</a>
                        </div>
                    </div>
                    
                    <!-- More publication cards would go here -->
                </div>
            </div>
        `;
    }

    async getStudentsContent() {
        await this.delay(300);
        return `
            <div class="section-container">
                <div class="section-header">
                    <h2 class="section-title">Students & Mentoring</h2>
                    <p class="section-description">
                        Guiding the next generation of computer scientists and engineers through research supervision and academic mentorship.
                    </p>
                </div>
                
                <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 24px; color: var(--color-primary);">Current Graduate Students</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
                    <div class="card animate-in" style="text-align: center;">
                        <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-success) 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; font-weight: 600; margin: 0 auto 16px;">RK</div>
                        <h4 style="font-weight: 600; color: var(--color-primary); margin-bottom: 4px;">Rajesh Kumar</h4>
                        <p style="color: var(--color-secondary); font-size: 14px; margin-bottom: 8px;">Ph.D. Computer Science</p>
                        <p style="color: var(--color-secondary); font-size: 14px; line-height: 1.5;">Thesis: "Advanced Trust Metrics for Distributed Systems"</p>
                    </div>
                    
                    <div class="card animate-in" style="text-align: center;">
                        <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-success) 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; font-weight: 600; margin: 0 auto 16px;">PS</div>
                        <h4 style="font-weight: 600; color: var(--color-primary); margin-bottom: 4px;">Priya Sharma</h4>
                        <p style="color: var(--color-secondary); font-size: 14px; margin-bottom: 8px;">M.Tech Information Technology</p>
                        <p style="color: var(--color-secondary); font-size: 14px; line-height: 1.5;">Project: "Machine Learning for Web Service Classification"</p>
                    </div>
                    
                    <div class="card animate-in" style="text-align: center;">
                        <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-success) 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; font-weight: 600; margin: 0 auto 16px;">AV</div>
                        <h4 style="font-weight: 600; color: var(--color-primary); margin-bottom: 4px;">Amit Verma</h4>
                        <p style="color: var(--color-secondary); font-size: 14px; margin-bottom: 8px;">M.Tech Information Technology</p>
                        <p style="color: var(--color-secondary); font-size: 14px; line-height: 1.5;">Project: "Spatial Data Mining Techniques for GIS Applications"</p>
                    </div>
                </div>
            </div>
        `;
    }

    async getNewsContent() {
        await this.delay(400);
        return `
            <div class="section-container">
                <div class="section-header">
                    <h2 class="section-title">News & Updates</h2>
                    <p class="section-description">
                        Latest news, achievements, and updates from my academic and research activities.
                    </p>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 24px;">
                    <div class="card animate-in">
                        <div style="width: 100%; height: 120px; background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-success) 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 48px; margin-bottom: 24px;">📰</div>
                        <time style="color: var(--color-secondary); font-size: 14px; margin-bottom: 8px; display: block;">January 15, 2025</time>
                        <h3 style="font-size: 1.25rem; font-weight: 600; color: var(--color-primary); margin-bottom: 16px;">Paper Accepted at IEEE TPDS</h3>
                        <p style="color: var(--color-secondary); line-height: 1.6; margin-bottom: 16px;">
                            Our latest research on trust-based reputation systems has been accepted for publication 
                            in IEEE Transactions on Parallel and Distributed Systems, a top-tier journal in the field.
                        </p>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 15px; font-size: 12px; font-weight: 500;">Research</span>
                            <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 15px; font-size: 12px; font-weight: 500;">Publication</span>
                            <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 15px; font-size: 12px; font-weight: 500;">Trust Systems</span>
                        </div>
                    </div>
                    
                    <div class="card animate-in">
                        <div style="width: 100%; height: 120px; background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-success) 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 48px; margin-bottom: 24px;">🏆</div>
                        <time style="color: var(--color-secondary); font-size: 14px; margin-bottom: 8px; display: block;">December 8, 2024</time>
                        <h3 style="font-size: 1.25rem; font-weight: 600; color: var(--color-primary); margin-bottom: 16px;">Best Paper Award at ICWS 2024</h3>
                        <p style="color: var(--color-secondary); line-height: 1.6; margin-bottom: 16px;">
                            Received the Best Paper Award at the International Conference on Web Services 
                            for our work on machine learning approaches for web service quality prediction.
                        </p>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 15px; font-size: 12px; font-weight: 500;">Award</span>
                            <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 15px; font-size: 12px; font-weight: 500;">Conference</span>
                            <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 15px; font-size: 12px; font-weight: 500;">Machine Learning</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getContactContent() {
        return `
            <div class="section-container">
                <div class="section-header">
                    <h2 class="section-title">Contact</h2>
                    <p class="section-description">
                        Get in touch for collaborations, research opportunities, or academic inquiries.
                    </p>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 64px;">
                    <div style="background: var(--glass-bg); backdrop-filter: blur(20px); border: 1px solid var(--glass-border); border-radius: 16px; padding: 32px;">
                        <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 32px; color: var(--color-primary);">Get in Touch</h3>
                        
                        <div style="display: flex; align-items: flex-start; gap: 24px; margin-bottom: 32px;">
                            <div style="width: 48px; height: 48px; background: var(--color-accent); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; flex-shrink: 0;">📧</div>
                            <div>
                                <h4 style="font-weight: 600; margin-bottom: 4px; color: var(--color-primary);">Email</h4>
                                <a href="mailto:sis@tezu.ernet.in" style="color: var(--color-accent); text-decoration: none; font-weight: 500;">sis@tezu.ernet.in</a>
                            </div>
                        </div>
                        
                        <div style="display: flex; align-items: flex-start; gap: 24px; margin-bottom: 32px;">
                            <div style="width: 48px; height: 48px; background: var(--color-accent); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; flex-shrink: 0;">📍</div>
                            <div>
                                <h4 style="font-weight: 600; margin-bottom: 4px; color: var(--color-primary);">Office</h4>
                                <p style="color: var(--color-secondary); line-height: 1.6;">
                                    Department of Computer Science & Engineering<br>
                                    Tezpur University<br>
                                    Napaam - 784 028, Tezpur<br>
                                    Assam, INDIA
                                </p>
                            </div>
                        </div>
                        
                        <div style="display: flex; align-items: flex-start; gap: 24px;">
                            <div style="width: 48px; height: 48px; background: var(--color-accent); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; flex-shrink: 0;">📞</div>
                            <div>
                                <h4 style="font-weight: 600; margin-bottom: 4px; color: var(--color-primary);">Phone</h4>
                                <p style="color: var(--color-secondary);">+91-3712-267001 (Office)</p>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: var(--glass-bg); backdrop-filter: blur(20px); border: 1px solid var(--glass-border); border-radius: 16px; padding: 32px;">
                        <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 32px; color: var(--color-primary);">Office Hours</h3>
                        
                        <div style="display: flex; align-items: flex-start; gap: 24px; margin-bottom: 32px;">
                            <div style="width: 48px; height: 48px; background: var(--color-accent); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; flex-shrink: 0;">🕒</div>
                            <div>
                                <h4 style="font-weight: 600; margin-bottom: 4px; color: var(--color-primary);">Regular Hours</h4>
                                <p style="color: var(--color-secondary); line-height: 1.6;">
                                    Monday - Friday: 10:00 AM - 5:00 PM<br>
                                    <em>Please email to schedule an appointment</em>
                                </p>
                            </div>
                        </div>
                        
                        <div style="display: flex; align-items: flex-start; gap: 24px; margin-bottom: 32px;">
                            <div style="width: 48px; height: 48px; background: var(--color-accent); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; flex-shrink: 0;">👥</div>
                            <div>
                                <h4 style="font-weight: 600; margin-bottom: 4px; color: var(--color-primary);">Student Hours</h4>
                                <p style="color: var(--color-secondary); line-height: 1.6;">
                                    Tuesday & Thursday: 2:00 PM - 4:00 PM<br>
                                    <em>Drop-in hours for current students</em>
                                </p>
                            </div>
                        </div>
                        
                        <div style="display: flex; align-items: flex-start; gap: 24px;">
                            <div style="width: 48px; height: 48px; background: var(--color-accent); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; flex-shrink: 0;">🔬</div>
                            <div>
                                <h4 style="font-weight: 600; margin-bottom: 4px; color: var(--color-primary);">Research Meetings</h4>
                                <p style="color: var(--color-secondary); line-height: 1.6;">
                                    By appointment<br>
                                    <a href="mailto:sis@tezu.ernet.in" style="color: var(--color-accent); text-decoration: none;">Email for scheduling</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getErrorContent(page) {
        return `
            <div class="section-container" style="text-align: center;">
                <h2 class="section-title">Page Not Found</h2>
                <p style="color: var(--color-secondary);">The ${page} page is currently being developed.</p>
                <a href="#home" class="btn btn-primary" data-page="home" style="margin-top: 24px;">Return Home</a>
            </div>
        `;
    }

    setupAnimations() {
        // Intersection Observer for animations
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        // Observe elements that should animate
        const observeElements = () => {
            document.querySelectorAll('.card, .animate-in').forEach(el => {
                observer.observe(el);
            });
        };

        // Initial observation
        observeElements();

        // Re-observe after page changes
        this.onPageChange = observeElements;
    }

    triggerPageAnimations(page) {
        // Re-observe new elements
        if (this.onPageChange) {
            setTimeout(this.onPageChange, 100);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}