import hlp from 'hlp';
export default class Lanimate {
    init() {
        hlp.ready().then(() => {
            this.ready();
        });
        hlp.load().then(() => {
            this.load();
        });
    }
    ready() {
        this.addBasicStyles();
    }
    load() {
        this.addExtendedStyles();
        hlp.runForEl('[data-lanimate]', $el => {
            if ($el.parentNode.closest('[data-lanimate]') !== null) {
                return;
            }
            if ($el.hasAttribute('data-lanimate-split') && $el.getAttribute('data-lanimate-split') !== 'none') {
                $el.setAttribute('data-aria-label', $el.innerText.replace(/(?:\r\n|\r|\n)/g, ' '));
                $el.innerHTML = $el.innerHTML.trim().replace(/ {2,}/g, '').split(' ').join('&nbsp;');
                let shift = 0;
                if ($el.getAttribute('data-lanimate-split') === 'char') {
                    this.traverseAllTextNodes($el, $text => {
                        return '%span%' + $text.split('').join('%/span%%span%') + '%/span%';
                    });
                    $el.innerHTML = $el.innerHTML.split('%span%').join('<span>').split('%/span%').join('</span>');
                    shift = 50;
                }
                if ($el.getAttribute('data-lanimate-split') === 'word') {
                    this.traverseAllTextNodes($el, $text => {
                        return '%span%' + $text.split(' ').join('%/span% %span%') + '%/span%';
                    });
                    $el.innerHTML = $el.innerHTML.split('%span%').join('<span>').split('%/span%').join('</span>');
                    shift = 75;
                }
                if ($el.getAttribute('data-lanimate-split') === 'line') {
                    $el.innerHTML = '<span>' + $el.innerHTML.split('<br>').join('</span><br/><span>') + '</span>';
                    shift = 100;
                }
                if ($el.hasAttribute('data-lanimate-speed')) {
                    shift = (shift * parseInt($el.getAttribute('data-lanimate-speed'))) / 100;
                }
                let index = 0;
                $el.querySelectorAll('span').forEach($el2 => {
                    if ($el2.innerText.trim() == '') {
                        return;
                    }
                    let delay = 0;
                    if ($el.hasAttribute('data-lanimate-delay')) {
                        delay = parseInt($el.getAttribute('data-lanimate-delay'));
                    }
                    if ($el.hasAttribute('data-lanimate-speed')) {
                        $el2.setAttribute('data-lanimate-speed', $el.getAttribute('data-lanimate-speed'));
                    }
                    $el2.setAttribute('data-lanimate-delay', delay + shift * index);
                    $el2.setAttribute('data-lanimate', $el.getAttribute('data-lanimate'));
                    index++;
                    this.prepareAndBindStart($el2);
                });
                $el.removeAttribute('data-lanimate');
                $el.removeAttribute('data-lanimate-delay');
                $el.removeAttribute('data-lanimate-speed');
            } else {
                this.prepareAndBindStart($el);
            }
        });
    }
    prepareAndBindStart($el) {
        if ($el.hasAttribute('data-lanimate-speed')) {
            let speed = parseInt($el.getAttribute('data-lanimate-speed')) / 1000;
            setTimeout(() => {
                $el.style.transitionDuration = speed + 's, ' + speed + 's';
            }, 10);
        }
        this.start($el);
        window.addEventListener('scroll', () => {
            this.start($el);
        });
    }
    start($el) {
        if (
            !$el.hasAttribute('data-lanimate-started') &&
            this.scrollTop() + window.innerHeight >= this.offsetTop($el)
        ) {
            let delay = 0;
            if ($el.hasAttribute('data-lanimate-delay')) {
                delay = parseInt($el.getAttribute('data-lanimate-delay'));
            }
            setTimeout(() => {
                $el.setAttribute('data-lanimate-started', 'true');
            }, delay);
        }
    }
    scrollTop() {
        let doc = document.documentElement;
        return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    }
    offsetTop($el) {
        return $el.getBoundingClientRect().top + window.pageYOffset - document.documentElement.clientTop;
    }
    addBasicStyles() {
        if (document.head.querySelector('.lanimate-styles-basic') === null) {
            document.head.insertAdjacentHTML(
                'beforeend',
                `
            <style class="lanimate-styles-basic">
                [data-lanimate] {
                    opacity: 0;
                }
                /* disable on mobile */
                @media screen and (max-width: 1100px) {
                    [data-lanimate] {
                        transition: all 0s ease 0s !important;
                        opacity: 1 !important;
                    }
                    [data-lanimate='scrollX'] {
                        transform: translateX(0px) !important;
                    }
                    [data-lanimate='scrollY'] {
                        transform: translateX(0px) !important;
                    }
                    [data-lanimate='scale'] {
                        transform: scale(1) translateY(0px) !important;
                    }
                    [data-lanimate='rotate'] {
                        transform: rotate(0deg) !important;
                    }
                }
            </style>
            `
            );
        }
    }
    addExtendedStyles() {
        if (document.head.querySelector('.lanimate-styles-extended') === null) {
            document.head.insertAdjacentHTML(
                'beforeend',
                `
            <style class="lanimate-styles-extended">
                [data-lanimate='fade'] {
                }
                [data-lanimate='scrollX'] {
                    transform: translateX(30px);
                }
                [data-lanimate='scrollY'] {
                    transform: translateY(30px);
                }
                [data-lanimate='scale'] {
                    transform: scale(1.1) translateY(30px);
                }
                [data-lanimate='rotate'] {
                    transform: rotate(10deg);
                    transform-origin: 0 0;
                }
                [data-lanimate-started] {
                    transition: opacity 1s ease-in-out, transform 1s ease-in-out;
                    opacity: 1;
                }
                [data-lanimate-split] span {
                    display:inline-block;
                }
                [data-lanimate='fade'][data-lanimate-started] {
                }
                [data-lanimate='scrollX'][data-lanimate-started] {
                    transform: translateX(0px);
                }
                [data-lanimate='scrollY'][data-lanimate-started] {
                    transform: translateX(0px);
                }
                [data-lanimate='scale'][data-lanimate-started] {
                    transform: scale(1) translateY(0px);
                }
                [data-lanimate='rotate'][data-lanimate-started] {
                    transform: rotate(0deg);
                }
            </style>
            `
            );
        }
    }
    traverseAllTextNodes($el, $fn) {
        if ($el.childNodes.length > 0) {
            $el.childNodes.forEach($el2 => {
                if ($el2.nodeType === 3) {
                    $el2.textContent = $fn($el2.textContent);
                } else {
                    this.traverseAllTextNodes($el2, $fn);
                }
            });
        }
    }
}

window.Lanimate = Lanimate;
