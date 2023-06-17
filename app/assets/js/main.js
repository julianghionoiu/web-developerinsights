jQuery(document).ready(function ($) {
    "use strict";

    const IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
        Android = navigator.userAgent.toLowerCase().indexOf("android") > -1,
        Firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
        Edge = navigator.userAgent.toLowerCase().indexOf('edge') > -1;

    const browser = {
        w: document.documentElement.clientWidth,
        h: document.documentElement.clientHeight,
    };

    $(window).on('resize orientationchange', () => {
        browser.w = document.documentElement.clientWidth;
        browser.h = document.documentElement.clientHeight;
    });

    /*------------------ Mobile Navigation --------------*/
    {
        const navToggle = $('.nav-toggle');
        const navSidebar = $('.mobile-nav');

        function navOpen() {
            navToggle.addClass('active');
            navSidebar.slideToggle('fast');
        }

        function navClose() {
            navToggle.removeClass('active');
            navSidebar.slideToggle('fast');
        }

        navToggle.on('click', function (e) {
            e.preventDefault();

            if (navToggle.hasClass('active')) {
                navClose();
            } else {
                navOpen();
            }

        });
    }

    /*------------------ Anchor Scroll ------------------*/
    {
        $('a[href^="#"]').on('click', function (e) {
            e.preventDefault();

            const href = $(this).attr('href');

            if (!(href === '#')) {

                const section = $(href);

                if (section.length) {
                    const offset = $(section).offset().top;
                    $('html,body').animate({
                        scrollTop: offset
                    }, 600);
                }

            } else {
                return false
            }

        });
    }

    /* ------------------ AOS -------------------------- */
    {
        AOS.init({
            // Global settings:
            disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
            initClassName: 'aos-init', // class applied after initialization
            animatedClassName: 'aos-animate', // class applied on animation
            useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
            disableMutationObserver: false, // disables automatic mutations' detections (advanced)
            debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
            throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)
            offset: 120, // offset (in px) from the original trigger point
            delay: 0, // values from 0 to 3000, with step 50ms
            duration: 650, // values from 0 to 3000, with step 50ms
            easing: 'ease', // default easing for AOS animations
            once: true, // whether animation should happen only once - while scrolling down
            mirror: false, // whether elements should animate out while scrolling past them
            anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
        });

        $(window).on('scroll resize', function () {
            AOS.refresh();
        });
    }


});
