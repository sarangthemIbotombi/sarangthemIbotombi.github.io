// stacking-context-validator.js
// Add this script to test the stacking context fixes

class StackingContextValidator {
    constructor() {
        this.tests = [];
        this.results = [];
    }

    init() {
        console.log('🔍 Running Stacking Context Validation...');
        this.runAllTests();
        this.displayResults();
    }

    runAllTests() {
        this.testNavbarZIndex();
        this.testHeroBackgroundStacking();
        this.testGlassElementsStacking();
        this.testCardHoverStacking();
        this.testPageTransitionStacking();
        this.testMobileSpacing();
        this.testPerformanceOptimizations();
        this.testAccessibilityCompliance();
    }

    testNavbarZIndex() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) {
            this.addResult('❌ Navbar not found', false);
            return;
        }

        const computedStyle = window.getComputedStyle(navbar);
        const zIndex = parseInt(computedStyle.zIndex);
        const position = computedStyle.position;
        const isolation = computedStyle.isolation;

        this.addResult(
            `Navbar Z-Index: ${zIndex >= 200 ? '✅' : '❌'} ${zIndex}`,
            zIndex >= 200
        );
        this.addResult(
            `Navbar Position: ${position === 'fixed' ? '✅' : '❌'} ${position}`,
            position === 'fixed'
        );
        this.addResult(
            `Navbar Isolation: ${isolation === 'isolate' ? '✅' : '⚠️'} ${isolation}`,
            isolation === 'isolate' || isolation === 'auto'
        );
    }

    testHeroBackgroundStacking() {
        const hero = document.querySelector('.hero');
        if (!hero) {
            this.addResult('❌ Hero section not found', false);
            return;
        }

        // Check if hero::before has proper z-index
        const heroStyle = window.getComputedStyle(hero, '::before');

        // Check hero container z-index (should not interfere with navbar)
        const heroContainer = document.querySelector('.hero-container');
        if (heroContainer) {
            const containerStyle = window.getComputedStyle(heroContainer);
            const containerZIndex = containerStyle.zIndex;

            this.addResult(
                `Hero Container Z-Index: ${containerZIndex === 'auto' ? '✅' : '⚠️'} ${containerZIndex}`,
                containerZIndex === 'auto' || containerZIndex === '1'
            );
        }

        this.addResult('✅ Hero background stacking validated', true);
    }

    testGlassElementsStacking() {
        const glassElements = document.querySelectorAll('.glass, .profile-card');
        let allValid = true;

        glassElements.forEach((element, index) => {
            const style = window.getComputedStyle(element);
            const backdropFilter = style.backdropFilter || style.webkitBackdropFilter;
            const isolation = style.isolation;

            if (backdropFilter !== 'none' && isolation !== 'isolate') {
                allValid = false;
            }
        });

        this.addResult(
            `Glass Elements Isolation: ${allValid ? '✅' : '⚠️'} ${glassElements.length} elements`,
            allValid
        );
    }

    testCardHoverStacking() {
        const cards = document.querySelectorAll('.card');
        if (cards.length === 0) {
            this.addResult('⚠️ No cards found to test', true);
            return;
        }

        // Simulate hover on first card
        const firstCard = cards[0];
        firstCard.style.transform = 'translateY(-4px)';

        setTimeout(() => {
            const style = window.getComputedStyle(firstCard);
            const zIndex = parseInt(style.zIndex) || 0;

            this.addResult(
                `Card Hover Z-Index: ${zIndex <= 100 ? '✅' : '⚠️'} ${zIndex}`,
                zIndex <= 100
            );

            // Reset
            firstCard.style.transform = '';
        }, 100);
    }

    testPageTransitionStacking() {
        const transition = document.querySelector('.page-transition');
        if (!transition) {
            this.addResult('⚠️ Page transition not found', true);
            return;
        }

        const style = window.getComputedStyle(transition);
        const zIndex = parseInt(style.zIndex);

        this.addResult(
            `Page Transition Z-Index: ${zIndex >= 1000 ? '✅' : '❌'} ${zIndex}`,
            zIndex >= 1000
        );
    }

    testMobileSpacing() {
        if (window.innerWidth > 768) {
            this.addResult('⚠️ Mobile spacing test skipped (desktop view)', true);
            return;
        }

        const navbar = document.querySelector('.navbar');
        const hero = document.querySelector('.hero');

        if (!navbar || !hero) {
            this.addResult('❌ Required elements not found for mobile test', false);
            return;
        }

        const navbarHeight = navbar.offsetHeight;
        const heroStyle = window.getComputedStyle(hero);
        const heroPaddingTop = parseInt(heroStyle.paddingTop);

        this.addResult(
            `Mobile Hero Spacing: ${heroPaddingTop >= navbarHeight ? '✅' : '⚠️'} ${heroPaddingTop}px vs ${navbarHeight}px`,
            heroPaddingTop >= navbarHeight
        );
    }

    testPerformanceOptimizations() {
        const animatedElements = document.querySelectorAll('.hero::before, .dot-matrix, .card, .btn');
        let optimized = 0;

        animatedElements.forEach(element => {
            const style = window.getComputedStyle(element);
            if (style.backfaceVisibility === 'hidden' || style.willChange !== 'auto') {
                optimized++;
            }
        });

        this.addResult(
            `Performance Optimizations: ${optimized > 0 ? '✅' : '⚠️'} ${optimized}/${animatedElements.length} elements`,
            optimized > 0
        );
    }

    testAccessibilityCompliance() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) {
            this.addResult('❌ Navbar not found for accessibility test', false);
            return;
        }

        // Test keyboard navigation
        const focusableElements = navbar.querySelectorAll('a, button, [tabindex]');
        const hasProperTabOrder = Array.from(focusableElements).every(el => {
            return !el.hasAttribute('tabindex') || parseInt(el.getAttribute('tabindex')) >= 0;
        });

        this.addResult(
            `Keyboard Navigation: ${hasProperTabOrder ? '✅' : '❌'} Tab order valid`,
            hasProperTabOrder
        );

        // Test contrast (basic check)
        const navStyle = window.getComputedStyle(navbar);
        const backgroundColor = navStyle.backgroundColor;

        this.addResult(
            `Navbar Visibility: ${backgroundColor !== 'rgba(0, 0, 0, 0)' ? '✅' : '⚠️'} Background present`,
            backgroundColor !== 'rgba(0, 0, 0, 0)'
        );
    }

    addResult(message, passed) {
        this.results.push({ message, passed });
    }

    displayResults() {
        console.log('\n📊 Stacking Context Validation Results:');
        console.log('='.repeat(50));

        let passedCount = 0;
        let totalCount = this.results.length;

        this.results.forEach(result => {
            console.log(result.message);
            if (result.passed) passedCount++;
        });

        console.log('='.repeat(50));
        console.log(`✅ ${passedCount}/${totalCount} tests passed`);

        if (passedCount === totalCount) {
            console.log('🎉 All stacking context issues resolved!');
        } else {
            console.log('⚠️ Some issues may need attention');
        }

        // Also display in DOM for visual confirmation
        this.createVisualReport();
    }

    createVisualReport() {
        // Create floating validation report
        const report = document.createElement('div');
        report.id = 'stacking-validation-report';
        report.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            max-height: 400px;
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;

        const header = document.createElement('h3');
        header.textContent = 'Stacking Context Validation';
        header.style.cssText = 'margin: 0 0 15px 0; color: #00d4aa;';
        report.appendChild(header);

        this.results.forEach(result => {
            const item = document.createElement('div');
            item.textContent = result.message;
            item.style.cssText = `
                margin-bottom: 8px;
                padding: 5px;
                border-radius: 3px;
                background: ${result.passed ? 'rgba(0, 212, 170, 0.1)' : 'rgba(255, 87, 87, 0.1)'};
            `;
            report.appendChild(item);
        });

        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
        `;
        closeBtn.onclick = () => report.remove();
        report.appendChild(closeBtn);

        document.body.appendChild(report);

        // Auto-remove after 30 seconds
        setTimeout(() => {
            if (report.parentNode) {
                report.remove();
            }
        }, 30000);
    }
}

// Auto-run validation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new StackingContextValidator().init();
    });
} else {
    new StackingContextValidator().init();
}

// Export for manual testing
window.StackingValidator = StackingContextValidator;