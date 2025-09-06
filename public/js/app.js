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
        this.adjustContentSpacing();
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

        // Window resize
        window.addEventListener('resize', () => {
            this.adjustContentSpacing();
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
        this.updateActiveNavLink();
        this.adjustContentSpacing();

        // Preload all content
        this.preloadAllContent();
    }

    adjustContentSpacing() {
        const navbar = document.getElementById('navbar');
        const mainContent = document.getElementById('mainContent');

        if (navbar && mainContent) {
            const navbarHeight = navbar.offsetHeight;
            mainContent.style.paddingTop = `${navbarHeight + 20}px`;
        }
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

        // Load page content if not already loaded
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
            section.style.display = 'none';
        });

        // Show target section
        const targetSection = document.getElementById(page);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.style.display = 'block';
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Trigger animations
        this.triggerPageAnimations(page);
    }

    async preloadAllContent() {
        const pages = ['teaching', 'research', 'publications', 'students', 'news', 'contact'];

        for (const page of pages) {
            await this.loadPageContent(page);
        }
    }

    async loadPageContent(page = this.currentPage) {
        if (page === 'home') return; // Home content is already loaded

        const section = document.getElementById(page);
        if (!section) return;

        if (section.innerHTML.trim()) return; // Content already loaded

        try {
            const content = await this.fetchPageContent(page);
            section.innerHTML = content;
            console.log(`✅ Loaded ${page} content`);
        } catch (error) {
            console.error(`Failed to load ${page} content:`, error);
            section.innerHTML = this.getErrorContent(page);
        }
    }

    async fetchPageContent(page) {
        // Add small delay to simulate loading
        await this.delay(100);

        switch (page) {
            case 'teaching':
                return this.getTeachingContent();
            case 'research':
                return this.getResearchContent();
            case 'publications':
                return this.getPublicationsContent();
            case 'students':
                return this.getStudentsContent();
            case 'news':
                return this.getNewsContent();
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
                
                <div style="display: grid; gap: 32px;">
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

                    <div class="card animate-in">
                        <div style="display: flex; align-items: flex-start; gap: 24px; margin-bottom: 32px;">
                            <div style="width: 48px; height: 48px; background: var(--color-success); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">📊</div>
                            <div>
                                <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 8px; color: var(--color-primary);">Current Projects</h3>
                                <p style="color: var(--color-secondary);">Active research projects and collaborations</p>
                            </div>
                        </div>
                        <div style="display: grid; gap: 24px;">
                            <div style="border-left: 4px solid var(--color-accent); padding-left: 24px;">
                                <h4 style="font-weight: 600; color: var(--color-primary); margin-bottom: 8px;">Trust-Based Reputation Framework</h4>
                                <p style="color: var(--color-secondary); line-height: 1.6; margin-bottom: 8px;">
                                    Developing a comprehensive framework for trust assessment in distributed computing environments,
                                    focusing on multi-layered security and reliability metrics.
                                </p>
                                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                    <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 15px; font-size: 12px;">Ongoing</span>
                                    <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 15px; font-size: 12px;">Funded</span>
                                </div>
                            </div>
                            <div style="border-left: 4px solid var(--color-success); padding-left: 24px;">
                                <h4 style="font-weight: 600; color: var(--color-primary); margin-bottom: 8px;">ML for Web Service Quality</h4>
                                <p style="color: var(--color-secondary); line-height: 1.6; margin-bottom: 8px;">
                                    Applying machine learning techniques to predict and enhance web service quality metrics,
                                    with applications in real-time service selection and composition.
                                </p>
                                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                    <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 15px; font-size: 12px;">Collaboration</span>
                                    <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 15px; font-size: 12px;">International</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getPublicationsContent() {
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
                            <div style="flex: 1;">
                                <h3 style="font-size: 1.25rem; font-weight: 600; color: var(--color-primary); margin-bottom: 8px; line-height: 1.4;">Trust-based Reputation Systems in Distributed Computing Environments</h3>
                                <p style="color: var(--color-secondary); margin-bottom: 4px; font-size: 14px;">S.I. Singh, A. Kumar, R. Sharma</p>
                                <p style="color: var(--color-accent); font-weight: 500; font-size: 14px;">IEEE Transactions on Parallel and Distributed Systems</p>
                            </div>
                            <div style="background: var(--bg-tertiary); color: var(--color-primary); padding: 4px 12px; border-radius: 8px; font-size: 14px; font-weight: 600; margin-left: 16px;">2024</div>
                        </div>
                        <p style="margin-top: 16px; color: var(--color-secondary); font-size: 14px; line-height: 1.6;">
                            This paper presents a novel approach to building trust-based reputation systems for distributed computing environments. 
                            We propose a multi-layered framework that incorporates both direct and indirect trust assessments, 
                            resulting in improved security and reliability for large-scale distributed applications.
                        </p>
                        <div style="display: flex; gap: 16px; margin-top: 16px;">
                            <a href="#" style="padding: 4px 16px; background: var(--bg-tertiary); color: var(--color-accent); text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500; transition: var(--transition);">PDF</a>
                            <a href="#" style="padding: 4px 16px; background: var(--bg-tertiary); color: var(--color-accent); text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500; transition: var(--transition);">DOI</a>
                            <a href="#" style="padding: 4px 16px; background: var(--bg-tertiary); color: var(--color-accent); text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500; transition: var(--transition);">Cite</a>
                        </div>
                    </div>

                    <div class="card animate-in">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                            <div style="flex: 1;">
                                <h3 style="font-size: 1.25rem; font-weight: 600; color: var(--color-primary); margin-bottom: 8px; line-height: 1.4;">Machine Learning Approaches for Web Service Quality Prediction</h3>
                                <p style="color: var(--color-secondary); margin-bottom: 4px; font-size: 14px;">S.I. Singh, P. Sharma, M. Kumar</p>
                                <p style="color: var(--color-accent); font-weight: 500; font-size: 14px;">International Conference on Web Services (ICWS)</p>
                            </div>
                            <div style="background: var(--bg-tertiary); color: var(--color-primary); padding: 4px 12px; border-radius: 8px; font-size: 14px; font-weight: 600; margin-left: 16px;">2024</div>
                        </div>
                        <p style="margin-top: 16px; color: var(--color-secondary); font-size: 14px; line-height: 1.6;">
                            A comprehensive study on applying machine learning techniques for predicting web service quality metrics. 
                            The proposed approach demonstrates significant improvements in accuracy and efficiency for real-time service selection.
                            <strong style="color: var(--color-warning);">🏆 Best Paper Award</strong>
                        </p>
                        <div style="display: flex; gap: 16px; margin-top: 16px;">
                            <a href="#" style="padding: 4px 16px; background: var(--bg-tertiary); color: var(--color-accent); text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500;">PDF</a>
                            <a href="#" style="padding: 4px 16px; background: var(--bg-tertiary); color: var(--color-accent); text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500;">DOI</a>
                            <a href="#" style="padding: 4px 16px; background: var(--bg-tertiary); color: var(--color-accent); text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500;">Cite</a>
                        </div>
                    </div>

                    <div class="card animate-in">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                            <div style="flex: 1;">
                                <h3 style="font-size: 1.25rem; font-weight: 600; color: var(--color-primary); margin-bottom: 8px; line-height: 1.4;">Spatial Data Mining Techniques for Geographic Information Systems</h3>
                                <p style="color: var(--color-secondary); margin-bottom: 4px; font-size: 14px;">S.I. Singh, R. Patel, A. Verma</p>
                                <p style="color: var(--color-accent); font-weight: 500; font-size: 14px;">Journal of Geographic Information Science</p>
                            </div>
                            <div style="background: var(--bg-tertiary); color: var(--color-primary); padding: 4px 12px; border-radius: 8px; font-size: 14px; font-weight: 600; margin-left: 16px;">2023</div>
                        </div>
                        <p style="margin-top: 16px; color: var(--color-secondary); font-size: 14px; line-height: 1.6;">
                            This research explores advanced spatial data mining techniques and their applications in geographic information systems. 
                            We present novel algorithms for spatial pattern recognition and geographic data analysis.
                        </p>
                        <div style="display: flex; gap: 16px; margin-top: 16px;">
                            <a href="#" style="padding: 4px 16px; background: var(--bg-tertiary); color: var(--color-accent); text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500;">PDF</a>
                            <a href="#" style="padding: 4px 16px; background: var(--bg-tertiary); color: var(--color-accent); text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500;">DOI</a>
                            <a href="#" style="padding: 4px 16px; background: var(--bg-tertiary); color: var(--color-accent); text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500;">Cite</a>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 48px; text-align: center;">
                    <a href="#" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 32px; background: var(--color-accent); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; transition: var(--transition);">
                        <span>View All Publications</span>
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                            <path d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
                        </svg>
                    </a>
                </div>
            </div>
        `;
    }

    getStudentsContent() {
        return `
            <div class="section-container">
                <div class="section-header">
                    <h2 class="section-title">Students & Mentoring</h2>
                    <p class="section-description">
                        Guiding the next generation of computer scientists and engineers through research supervision and academic mentorship.
                    </p>
                </div>
                
                <div style="margin-bottom: 48px;">
                    <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 24px; color: var(--color-primary);">Current Graduate Students</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
                        <div class="card animate-in" style="text-align: center;">
                            <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-success) 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; font-weight: 600; margin: 0 auto 16px;">RK</div>
                            <h4 style="font-weight: 600; color: var(--color-primary); margin-bottom: 4px;">Rajesh Kumar</h4>
                            <p style="color: var(--color-secondary); font-size: 14px; margin-bottom: 8px;">Ph.D. Computer Science</p>
                            <p style="color: var(--color-secondary); font-size: 14px; line-height: 1.5; margin-bottom: 16px;">Thesis: "Advanced Trust Metrics for Distributed Systems"</p>
                            <div style="display: flex; justify-content: center; gap: 8px;">
                                <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 15px; font-size: 12px;">2022-Present</span>
                                <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 15px; font-size: 12px;">Trust Systems</span>
                            </div>
                        </div>
                        
                        <div class="card animate-in" style="text-align: center;">
                            <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-success) 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; font-weight: 600; margin: 0 auto 16px;">PS</div>
                            <h4 style="font-weight: 600; color: var(--color-primary); margin-bottom: 4px;">Priya Sharma</h4>
                            <p style="color: var(--color-secondary); font-size: 14px; margin-bottom: 8px;">M.Tech Information Technology</p>
                            <p style="color: var(--color-secondary); font-size: 14px; line-height: 1.5; margin-bottom: 16px;">Project: "Machine Learning for Web Service Classification"</p>
                            <div style="display: flex; justify-content: center; gap: 8px;">
                                <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 15px; font-size: 12px;">2023-Present</span>
                                <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 15px; font-size: 12px;">Machine Learning</span>
                            </div>
                        </div>
                        
                        <div class="card animate-in" style="text-align: center;">
                            <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-success) 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; font-weight: 600; margin: 0 auto 16px;">AV</div>
                            <h4 style="font-weight: 600; color: var(--color-primary); margin-bottom: 4px;">Amit Verma</h4>
                            <p style="color: var(--color-secondary); font-size: 14px; margin-bottom: 8px;">M.Tech Information Technology</p>
                            <p style="color: var(--color-secondary); font-size: 14px; line-height: 1.5; margin-bottom: 16px;">Project: "Spatial Data Mining Techniques for GIS Applications"</p>
                            <div style="display: flex; justify-content: center; gap: 8px;">
                                <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 15px; font-size: 12px;">2023-Present</span>
                                <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 15px; font-size: 12px;">Data Mining</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 24px; color: var(--color-primary);">Alumni & Graduated Students</h3>
                    <div style="display: grid; gap: 24px;">
                        <div class="card animate-in">
                            <div style="display: flex; align-items: center; gap: 24px;">
                                <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, var(--color-success) 0%, var(--color-warning) 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; font-weight: 600;">NK</div>
                                <div style="flex: 1;">
                                    <h4 style="font-weight: 600; color: var(--color-primary); margin-bottom: 4px;">Neha Kapoor</h4>
                                    <p style="color: var(--color-secondary); font-size: 14px; margin-bottom: 4px;">M.Tech Information Technology (2021-2023)</p>
                                    <p style="color: var(--color-secondary); font-size: 14px; line-height: 1.5;">Project: "Trust-based Service Selection in Cloud Computing"</p>
                                </div>
                                <div style="text-align: right;">
                                    <p style="color: var(--color-accent); font-weight: 600; font-size: 14px;">Now at</p>
                                    <p style="color: var(--color-secondary); font-size: 14px;">Software Engineer, Microsoft</p>
                                </div>
                            </div>
                        </div>

                        <div class="card animate-in">
                            <div style="display: flex; align-items: center; gap: 24px;">
                                <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, var(--color-success) 0%, var(--color-warning) 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; font-weight: 600;">AG</div>
                                <div style="flex: 1;">
                                    <h4 style="font-weight: 600; color: var(--color-primary); margin-bottom: 4px;">Ankit Gupta</h4>
                                    <p style="color: var(--color-secondary); font-size: 14px; margin-bottom: 4px;">M.Tech Information Technology (2020-2022)</p>
                                    <p style="color: var(--color-secondary); font-size: 14px; line-height: 1.5;">Project: "Data Mining Approaches for Web Service Discovery"</p>
                                </div>
                                <div style="text-align: right;">
                                    <p style="color: var(--color-accent); font-weight: 600; font-size: 14px;">Now at</p>
                                    <p style="color: var(--color-secondary); font-size: 14px;">Data Scientist, Amazon</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getNewsContent() {
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
                        <div style="width: 100%; height: 120px; background: linear-gradient(135deg, var(--color-warning) 0%, var(--color-accent) 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 48px; margin-bottom: 24px;">🏆</div>
                        <time style="color: var(--color-secondary); font-size: 14px; margin-bottom: 8px; display: block;">December 8, 2024</time>
                        <h3 style="font-size: 1.25rem; font-weight: 600; color: var(--color-primary); margin-bottom: 16px;">Best Paper Award at ICWS 2024</h3>
                        <p style="color: var(--color-secondary); line-height: 1.6; margin-bottom: 16px;">
                            Received the Best Paper Award at the International Conference on Web Services 
                            for our work on machine learning approaches for web service quality prediction.
                        </p>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 15px; font-size: 12px; font-weight: 500;">Award</span>
                            <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 15px; font-size: 12px; font-weight: 500;">Conference</span>
                            <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; font-weight: 500;">Machine Learning</span>
                        </div>
                    </div>

                    <div class="card animate-in">
                        <div style="width: 100%; height: 120px; background: linear-gradient(135deg, var(--color-success) 0%, var(--color-warning) 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 48px; margin-bottom: 24px;">🎓</div>
                        <time style="color: var(--color-secondary); font-size: 14px; margin-bottom: 8px; display: block;">November 22, 2024</time>
                        <h3 style="font-size: 1.25rem; font-weight: 600; color: var(--color-primary); margin-bottom: 16px;">New Graduate Students Joined</h3>
                        <p style="color: var(--color-secondary); line-height: 1.6; margin-bottom: 16px;">
                            Welcoming three new graduate students to our research group. They will be working on 
                            exciting projects in machine learning, trust systems, and spatial data mining.
                        </p>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 15px; font-size: 12px; font-weight: 500;">Students</span>
                            <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 15px; font-size: 12px; font-weight: 500;">Research Group</span>
                            <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 15px; font-size: 12px; font-weight: 500;">Mentoring</span>
                        </div>
                    </div>

                    <div class="card animate-in">
                        <div style="width: 100%; height: 120px; background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-warning) 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 48px; margin-bottom: 24px;">💻</div>
                        <time style="color: var(--color-secondary); font-size: 14px; margin-bottom: 8px; display: block;">October 15, 2024</time>
                        <h3 style="font-size: 1.25rem; font-weight: 600; color: var(--color-primary); margin-bottom: 16px;">Research Grant Awarded</h3>
                        <p style="color: var(--color-secondary); line-height: 1.6; margin-bottom: 16px;">
                            Received a significant research grant from the Department of Science and Technology 
                            for our project on "Advanced Trust Frameworks for IoT Networks".
                        </p>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 15px; font-size: 12px; font-weight: 500;">Funding</span>
                            <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 15px; font-size: 12px; font-weight: 500;">IoT</span>
                            <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 15px; font-size: 12px; font-weight: 500;">Trust Systems</span>
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

                <div style="margin-top: 64px; text-align: center;">
                    <div style="background: var(--bg-secondary); border-radius: 16px; padding: 32px; border: 1px solid var(--bg-tertiary);">
                        <h3 style="font-size: 1.25rem; font-weight: 600; color: var(--color-primary); margin-bottom: 16px;">Research Collaboration</h3>
                        <p style="color: var(--color-secondary); line-height: 1.6; margin-bottom: 24px;">
                            I'm always interested in discussing potential research collaborations, joint projects, 
                            and opportunities for academic partnerships. Feel free to reach out if you have ideas 
                            or proposals in areas related to my research interests.
                        </p>
                        <a href="mailto:sis@tezu.ernet.in?subject=Research Collaboration Inquiry" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 32px; background: var(--color-accent); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; transition: var(--transition);">
                            <span>Start a Conversation</span>
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    getErrorContent(page) {
        return `
            <div class="section-container" style="text-align: center; padding: 64px 0;">
                <div style="font-size: 4rem; margin-bottom: 24px;">🚧</div>
                <h2 class="section-title">Page Not Found</h2>
                <p style="color: var(--color-secondary); margin-bottom: 32px;">The ${page} page is currently being developed.</p>
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
            document.querySelectorAll('.card:not(.animate-in)').forEach(el => {
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

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.academicSite = new NothingOSAcademicSite();
    console.log('🚀 Nothing OS Academic Site initialized');
});