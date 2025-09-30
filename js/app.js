// public/js/app.js
class NothingOSAcademicSite {
    constructor() {
        this.currentPage = 'home';
        this.isTransitioning = false;
        this.publications = []; // Store publications data
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTheme();
        this.setupNavigation();
        this.setupAnimations();
        this.adjustContentSpacing();
        this.createModals(); // Add modals to document root
    }

    setupEventListeners() {
        // Navigation clicks - FIXED: Added better error handling
        document.querySelectorAll('.nav-link, [data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // ADDED: Prevent event bubbling
                const page = link.getAttribute('data-page') || link.getAttribute('href')?.substring(1);
                if (page) {
                    this.navigateToPage(page);
                }
            });
        });

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Hamburger menu toggle
        const hamburger = document.getElementById('hamburgerBtn');
        const navMenu = document.getElementById('navMenu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', (e) => {
                e.stopPropagation();
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
            });

            // Close menu when clicking nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (navMenu.classList.contains('active') &&
                    !navMenu.contains(e.target) &&
                    !hamburger.contains(e.target)) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }

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

        // FIXED: Modal overlay click handler with proper targeting
        document.addEventListener('click', (e) => {
            // Only close if clicking directly on the overlay, not its children
            if (e.target.classList.contains('modal-overlay') && e.target === e.currentTarget) {
                e.target.classList.remove('active');
            }
        });

        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                    modal.classList.remove('active');
                });
            }
        });

        // Event delegation for publication buttons
        document.addEventListener('click', (e) => {
            const target = e.target.closest('button');
            if (!target) return;

            // PDF button
            if (target.dataset.action === 'pdf') {
                e.preventDefault();
                this.openPDF(target.dataset.url);
            }
            // DOI button
            else if (target.dataset.action === 'doi') {
                e.preventDefault();
                this.showDOI(target.dataset.doi);
            }
            // Cite button
            else if (target.dataset.action === 'cite') {
                e.preventDefault();
                this.showCitation(parseInt(target.dataset.id));
            }
            // Copy button
            else if (target.dataset.action === 'copy') {
                e.preventDefault();
                const targetId = target.dataset.target;
                this.copyToClipboard(targetId, target);
            }
            // Close modal button
            else if (target.dataset.action === 'close-modal') {
                e.preventDefault();
                this.closeModal(target.dataset.modal);
            }
        });
    }

    setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    createModals() {
        // Check if modals already exist
        if (document.getElementById('doiModal')) return;

        const modalsHTML = `
            <!-- DOI Modal -->
            <div class="modal-overlay" id="doiModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">Digital Object Identifier (DOI)</h3>
                        <button class="modal-close" data-action="close-modal" data-modal="doiModal">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="doi-content" id="doiContent"></div>
                        <button class="copy-button" data-action="copy" data-target="doiContent">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                            </svg>
                            <span>Copy DOI</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Citation Modal -->
            <div class="modal-overlay" id="citeModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">BibTeX Citation</h3>
                        <button class="modal-close" data-action="close-modal" data-modal="citeModal">×</button>
                    </div>
                    <div class="modal-body">
                        <pre class="bibtex-content" id="bibtexContent"></pre>
                        <button class="copy-button" data-action="copy" data-target="bibtexContent">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                            </svg>
                            <span>Copy Citation</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Insert modals at end of body
        document.body.insertAdjacentHTML('beforeend', modalsHTML);
        console.log('✅ Modals created at document root');
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
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }

    async navigateToPage(page) {
        if (this.isTransitioning || page === this.currentPage) return;

        console.log(`🔄 Navigating to: ${page}`); // Debug log

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
        const transition = document.getElementById('pageTransition');
        if (transition) {
            transition.classList.add('active');
        }
    }

    hidePageTransition() {
        const transition = document.getElementById('pageTransition');
        if (transition) {
            transition.classList.remove('active');
        }
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
        const pages = ['teaching', 'research', 'publications', 'students', 'contact'];

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
                                <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 8px; color: var(--color-primary);">Autumn Semester 2025</h3>
                            </div>
                        </div>
                        <div style="display: grid; gap: 16px;">
                            <div style="display: flex; align-items: center; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--bg-tertiary);">
                                <span style="background: var(--bg-tertiary); color: var(--color-accent); padding: 4px 16px; border-radius: 8px; font-family: var(--font-mono); font-size: 14px; font-weight: 600; min-width: 80px; text-align: center;">CSMC404</span>
                                <span style="flex: 1; font-weight: 500; color: var(--color-primary);">Data Structures</span>
                                <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">MCA-I</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--bg-tertiary);">
                                <span style="background: var(--bg-tertiary); color: var(--color-accent); padding: 4px 16px; border-radius: 8px; font-family: var(--font-mono); font-size: 14px; font-weight: 600; min-width: 80px; text-align: center;">CSBT201</span>
                                <span style="flex: 1; font-weight: 500; color: var(--color-primary);">Discrete Mathematics</span>
                                <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">B.Tech-III</span>
                            </div>
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
                                <span style="background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-success) 100%); color: white; padding: 8px 24px; border-radius: 25px; font-size: 14px; font-weight: 600;">Machine Learning</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getPublicationsContent() {
        // Define publications data
        this.publications = [
            {
                id: 1,
                title: "The influence of dynamic technologies on the software release management and SaaS roadmap: a survey",
                authors: "Satapathy BS, Sharma A, Dash M, Satapathy SS, Chakraborty J, Singh SI",
                venue: "International Journal of Business Process Integration and Management (IJBPIM), Vol. 12, No. 2, 2025",
                year: 2024,
                abstract: "The article presents insights from an extensive literature review and stakeholders' input in SaaS-based supply chain solutions. It also explores the comprehensive transformation necessary to enhance organisational software release management capabilities.",
                pdfUrl: "https://www.inderscienceonline.com/doi/abs/10.1504/IJBPIM.2025.146538",
                doi: "https://doi.org/10.1504/IJBPIM.2025.146538",
                bibtex: `@article{satapathy2025influence,
  title={The influence of dynamic technologies on the software release management and SaaS roadmap: a survey},
  author={Satapathy, Bishnu Shankar and Sharma, Ashish and Dash, Madhusmita and Satapathy, Siddhartha Sankar and Chakraborty, Joya and Singh, Sarangthem Ibotombi},
  journal={International Journal of Business Process Integration and Management},
  volume={12},
  number={2},
  pages={135--148},
  year={2025},
  publisher={Inderscience Publishers (IEL)}
}`
            },
            {
                id: 2,
                title: "The Dynamic Technical Documentation Landscape in the Software Industry and Its Impact on Stakeholders: A Look Ahead",
                authors: "Satapathy BS, Satapathy SS, Singh SI, Chakraborty J.",
                venue: "(Currently under review in Int. J. of Agile Systems and Management)",
                year: "-",
                abstract: "This paper examines the evolving landscape of technical documentation in the software industry and its implications for various stakeholders.",
                pdfUrl: "#",
                doi: "10.xxxx/xxxxx.2023.xxxxx",
                bibtex: ``
            }
        ];

        let html = `
            <div class="section-container">
                <div class="section-header">
                    <h2 class="section-title">Publications</h2>
                    <p class="section-description">
                        Peer-reviewed research contributions and academic publications in leading journals and conferences.
                    </p>
                </div>
                
                <div style="display: grid; gap: 24px;">
        `;

        // Generate publication cards
        this.publications.forEach(pub => {
            html += `
                <div class="card animate-in">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                        <div style="flex: 1;">
                            <h3 style="font-size: 1.25rem; font-weight: 600; color: var(--color-primary); margin-bottom: 8px; line-height: 1.4;">${pub.title}</h3>
                            <p style="color: var(--color-secondary); margin-bottom: 4px; font-size: 14px;">${pub.authors}</p>
                            <p style="color: var(--color-accent); font-weight: 500; font-size: 14px;">${pub.venue}</p>
                        </div>
                        <div style="background: var(--bg-tertiary); color: var(--color-primary); padding: 4px 12px; border-radius: 8px; font-size: 14px; font-weight: 600; margin-left: 16px;">${pub.year}</div>
                    </div>
                    ${pub.abstract ? `<p style="margin-top: 16px; color: var(--color-secondary); font-size: 14px; line-height: 1.6;">${pub.abstract}</p>` : ''}
                    <div style="display: flex; gap: 16px; margin-top: 16px;">
                        <button data-action="pdf" data-url="${pub.pdfUrl}" style="padding: 4px 16px; background: var(--bg-tertiary); color: var(--color-accent); border: none; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; transition: var(--transition);">PDF</button>
                        <button data-action="doi" data-doi="${pub.doi}" style="padding: 4px 16px; background: var(--bg-tertiary); color: var(--color-accent); border: none; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; transition: var(--transition);">DOI</button>
                        <button data-action="cite" data-id="${pub.id}" style="padding: 4px 16px; background: var(--bg-tertiary); color: var(--color-accent); border: none; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; transition: var(--transition);">Cite</button>
                    </div>
                </div>
            `;
        });

        html += `
                </div>

                <div style="margin-top: 48px; text-align: center;">
                    <a href="https://scholar.google.com/citations?user=yF1xsE8AAAAJ&hl=en" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 32px; background: var(--color-accent); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; transition: var(--transition);">
                        <span>View All Publications</span>
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                            <path d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
                        </svg>
                    </a>
                </div>
            </div>
        `;

        return html;
    }

    getStudentsContent() {
        // Define students data with image paths
        const students = [
            {
                name: "Prasiddha Sarma",
                initials: "PS",
                image: "./assets/images/students/Prasiddha.png",
                degree: "Ph.D. in Computer Science & Engineering",
                thesis: "Recognition and Grading of Yoga Postures using Deep Learning Approaches",
                period: "2020-Present",
                areas: ["Deep Learning", "Computer Vision"]
            },
            {
                name: "Md Basit Azam",
                initials: "MBA",
                image: "./assets/images/students/basit.jpg",
                degree: "Ph.D. in Computer Science & Engineering",
                thesis: "AI-Enhanced ECG Diagnostics for Precision Non-Invasive Detection of Diabetic Glycemic Episodes",
                period: "2024-Present",
                areas: ["Health Informatics", "Deep Learning"]
            },
            {
                name: "Yarin Vashum",
                initials: "YV",
                image: "./assets/images/students/yarin.jpg", // Update with actual path
                degree: "Ph.D. in Computer Science & Engineering",
                thesis: null,
                period: "2024-Present",
                areas: []
            }
        ];

        let html = `
            <div class="section-container">
                <div class="section-header">
                    <h2 class="section-title">Students & Mentoring</h2>
                    <p class="section-description">
                        Guiding the next generation of computer scientists and engineers through research supervision and academic mentorship.
                    </p>
                </div>
                
                <div style="margin-bottom: 48px;">
                    <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 24px; color: var(--color-primary);">Current Graduate Students and Doctoral Researchers</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
        `;

        // Generate student cards
        students.forEach(student => {
            html += `
                <div class="card animate-in" style="text-align: center;">
                    <div class="student-avatar" style="width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 16px; position: relative; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                        <img src="${student.image}" 
                             alt="${student.name}"
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                             style="width: 100%; height: 100%; object-fit: cover; display: block;">
                        <div style="width: 100%; height: 100%; background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-success) 100%); display: none; align-items: center; justify-content: center; color: white; font-size: 20px; font-weight: 600; position: absolute; top: 0; left: 0;">
                            ${student.initials}
                        </div>
                    </div>
                    <h4 style="font-weight: 600; color: var(--color-primary); margin-bottom: 4px;">${student.name}</h4>
                    <p style="color: var(--color-secondary); font-size: 14px; margin-bottom: 8px;">${student.degree}</p>
                    ${student.thesis ? `<p style="color: var(--color-secondary); font-size: 14px; line-height: 1.5; margin-bottom: 16px;">Thesis: "${student.thesis}"</p>` : ''}
                    <div style="display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;">
                        <span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 15px; font-size: 12px;">${student.period}</span>
                        ${student.areas.map(area => `<span style="background: var(--bg-tertiary); color: var(--color-secondary); padding: 2px 8px; border-radius: 15px; font-size: 12px;">${area}</span>`).join('')}
                    </div>
                </div>
            `;
        });

        html += `
                    </div>
                </div>
            </div>
        `;

        return html;
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
                                <p style="color: var(--color-secondary);">+91-3712-275106 (Office)</p>
                                <p style="color: var(--color-secondary);">+91-3712-273464 (Residence)</p>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: var(--glass-bg); backdrop-filter: blur(20px); border: 1px solid var(--glass-border); border-radius: 16px; padding: 32px;">
                        <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 32px; color: var(--color-primary);">Office Hours</h3>
                        
                        <div style="display: flex; align-items: flex-start; gap: 24px; margin-bottom: 32px;">
                            <div style="width: 48px; height: 48px; background: var(--color-accent); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; flex-shrink: 0;">🕐</div>
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

    // Publication modal functions
    openPDF(url) {
        console.log('📄 Opening PDF:', url);
        if (url && url !== '#') {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            alert('PDF not yet available');
        }
    }

    showDOI(doi) {
        console.log('🔗 Showing DOI:', doi);
        const modal = document.getElementById('doiModal');
        const content = document.getElementById('doiContent');
        if (modal && content) {
            content.textContent = doi;
            modal.classList.add('active');
            console.log('✅ DOI modal opened');
        } else {
            console.error('❌ DOI modal elements not found');
        }
    }

    showCitation(pubId) {
        console.log('📚 Showing citation for publication ID:', pubId);
        const publication = this.publications.find(p => p.id === pubId);
        if (publication) {
            const modal = document.getElementById('citeModal');
            const content = document.getElementById('bibtexContent');
            if (modal && content) {
                content.textContent = publication.bibtex;
                modal.classList.add('active');
                console.log('✅ Citation modal opened');
            } else {
                console.error('❌ Citation modal elements not found');
            }
        } else {
            console.error('❌ Publication not found with ID:', pubId);
        }
    }

    closeModal(modalId) {
        console.log('🔒 Closing modal:', modalId);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            console.log('✅ Modal closed');
        } else {
            console.error('❌ Modal not found:', modalId);
        }
    }

    copyToClipboard(elementId, button) {
        console.log('📋 Attempting to copy from element:', elementId);
        const element = document.getElementById(elementId);
        if (!element) {
            console.error('❌ Element not found:', elementId);
            return;
        }

        const text = element.textContent;
        console.log('📝 Text to copy:', text.substring(0, 50) + '...');

        navigator.clipboard.writeText(text).then(() => {
            console.log('✅ Copied to clipboard successfully!');
            const originalHTML = button.innerHTML;
            button.innerHTML = '<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg><span>Copied!</span>';
            button.classList.add('copied');

            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.classList.remove('copied');
                console.log('🔄 Button reset');
            }, 2000);
        }).catch(err => {
            console.error('❌ Failed to copy:', err);
            alert('Failed to copy to clipboard. Please try again or copy manually.');
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.academicSite = new NothingOSAcademicSite();
    console.log('🚀 Nothing OS Academic Site initialized');
});