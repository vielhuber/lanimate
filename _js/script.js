export default class Lanimate {
    init() {
        const ready = new Promise(resolve => {
            if (document.readyState !== 'loading') {
                return resolve();
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    return resolve();
                });
            }
        });
        ready.then(() => {
            this.ready();
        });
        const load = new Promise(resolve => {
            if (document.readyState === 'complete') {
                return resolve();
            } else {
                window.addEventListener('load', () => {
                    return resolve();
                });
            }
        });
        load.then(() => {
            this.load();
        });
    }
    ready() {
        document.head.insertAdjacentHTML(
            'beforeend',
            `
            <style>
                [data-lanimate] {
                    opacity: 0;
                }
                /* disable on mobile */
                @media screen and (max-width: 1100px) {
                    [data-lanimate] {
                        transition: all 0s ease 0s;
                        opacity: 1;
                    }
                    [data-lanimate='scrollX'] {
                        transform: translateX(0px);
                    }
                    [data-lanimate='scrollY'] {
                        transform: translateX(0px);
                    }
                    [data-lanimate='scale'] {
                        transform: scale(1) translateY(0px);
                    }
                    [data-lanimate='rotate'] {
                        transform: rotate(0deg);
                    }
                }
            </style>
            `
        );
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
    load() {
        if (document.querySelectorAll('[data-lanimate-split]').length > 0) {
            document.querySelectorAll('[data-lanimate-split]').forEach($el => {
                $el.setAttribute('data-aria-label', $el.innerText.replace(/(?:\r\n|\r|\n)/g, ' '));
                $el.innerHTML = $el.innerHTML.split(' ').join('&nbsp;');
                let shift = 0;
                if ($el.getAttribute('data-lanimate-split') === 'char') {
                    this.traverseAllTextNodes($el, $text => {
                        return '%span%' + $text.split('').join('%/span%%span%') + '%/span%';
                    });
                    $el.innerHTML = $el.innerHTML.split('%span%').join('<span>').split('%/span%').join('</span>');
                    shift = 100;
                }
                if ($el.getAttribute('data-lanimate-split') === 'word') {
                    this.traverseAllTextNodes($el, $text => {
                        return '%span%' + $text.split(' ').join('%/span% %span%') + '%/span%';
                    });
                    $el.innerHTML = $el.innerHTML.split('%span%').join('<span>').split('%/span%').join('</span>');
                    shift = 250;
                }
                if ($el.getAttribute('data-lanimate-split') === 'line') {
                    $el.innerHTML = '<span>' + $el.innerHTML.split('<br>').join('</span><br/><span>') + '</span>';
                    shift = 500;
                }
                let index = 0;
                $el.querySelectorAll('span').forEach(($el2, i) => {
                    if ($el2.innerText.trim() == '') {
                        return;
                    }
                    $el2.setAttribute('data-lanimate', $el.getAttribute('data-lanimate'));
                    let delay = 0;
                    if ($el.hasAttribute('data-lanimate-delay')) {
                        delay = parseInt($el.getAttribute('data-lanimate-delay'));
                    }
                    if ($el.hasAttribute('data-lanimate-speed')) {
                        $el2.setAttribute('data-lanimate-speed', $el.getAttribute('data-lanimate-speed'));
                        delay *= 1 / parseInt($el.getAttribute('data-lanimate-speed'));
                    }
                    $el2.setAttribute('data-lanimate-delay', delay + shift * index);
                    index++;
                });
                $el.removeAttribute('data-lanimate');
                $el.removeAttribute('data-lanimate-delay');
                $el.removeAttribute('data-lanimate-speed');
            });
        }
        if (document.querySelectorAll('[data-lanimate-speed]').length > 0) {
            document.querySelectorAll('[data-lanimate-speed]').forEach($el => {
                let speed = parseInt($el.getAttribute('data-lanimate-speed')) / 1000;
                setTimeout(() => {
                    $el.style.transitionDuration = speed + 's, ' + speed + 's';
                }, 10);
            });
        }
        if (document.querySelectorAll('[data-lanimate]').length > 0) {
            document.querySelectorAll('[data-lanimate]').forEach($el => {
                this.start($el);
                window.addEventListener('scroll', () => {
                    this.start($el);
                });
            });
        }
        document.head.insertAdjacentHTML(
            'beforeend',
            `
            <style>
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
                    transform: rotate(15deg);
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
}

window.Lanimate = Lanimate;
