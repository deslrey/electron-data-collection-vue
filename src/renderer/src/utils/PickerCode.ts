export const pickerCode = () => {
  return `
    (function () {
      let overlay;
      function getXPath(el) {
        if (el.id) return '//*[@id="' + el.id + '"]';
        const parts = [];
        while (el && el.nodeType === 1) {
          let index = 1;
          let sibling = el.previousElementSibling;
          while (sibling) {
            if (sibling.tagName === el.tagName) index++;
            sibling = sibling.previousElementSibling;
          }
          parts.unshift(el.tagName.toLowerCase() + '[' + index + ']');
          el = el.parentElement;
        }
        return '/' + parts.join('/');
      }
      function createOverlay() {
        overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.zIndex = '999999';
        overlay.style.pointerEvents = 'none';
        overlay.style.border = '2px solid red';
        overlay.style.backgroundColor = 'rgba(255,0,0,0.1)';
        document.body.appendChild(overlay);
      }
      function onMouseMove(e) {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        if (el && overlay) {
          const rect = el.getBoundingClientRect();
          overlay.style.left = rect.left + window.scrollX + 'px';
          overlay.style.top = rect.top + window.scrollY + 'px';
          overlay.style.width = rect.width + 'px';
          overlay.style.height = rect.height + 'px';
          overlay.style.display = 'block';
        }
      }
      function onClick(e) {
        e.preventDefault();
        e.stopPropagation();
        const el = document.elementFromPoint(e.clientX, e.clientY);
        if (!el) return;
        const info = {
          tag: el.tagName,
          id: el.id || '(无)',
          class: el.className || '(无)',
          text: el.innerText || el.value || '(空)',
          xpath: getXPath(el),
          href: el.tagName === 'A' ? el.href : undefined
        };
        console.log('__ELEMENT_INFO__' + JSON.stringify(info));
        cleanup();
      }
      function cleanup() {
        document.removeEventListener('mousemove', onMouseMove, true);
        document.removeEventListener('click', onClick, true);
        if (overlay && overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        overlay = null;
      }
      createOverlay();
      document.addEventListener('mousemove', onMouseMove, true);
      document.addEventListener('click', onClick, true);
    })();
  `
}
