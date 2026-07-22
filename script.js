(function () {
  const body = document.body;
  const loader = document.getElementById('loader');
  const loaderBar = document.getElementById('loader-bar');
  const loaderCount = document.getElementById('loader-count');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let progress = 0;

  const loaderTimer = window.setInterval(function () {
    progress = Math.min(progress + Math.ceil(Math.random() * 13), 92);
    loaderBar.style.width = progress + '%';
    loaderCount.textContent = String(progress).padStart(2, '0') + '%';
  }, 110);

  window.finishPortfolioLoader = function () {
    window.clearInterval(loaderTimer);
    loaderBar.style.width = '100%';
    loaderCount.textContent = '100%';
    window.setTimeout(function () {
      loader.classList.add('is-hidden');
      body.classList.remove('is-loading');
    }, reducedMotion ? 0 : 320);
  };

  window.setTimeout(function () {
    if (body.classList.contains('is-loading')) window.finishPortfolioLoader();
  }, 2600);

  const progressBar = document.getElementById('scroll-progress');
  function updateScrollProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? window.scrollY / max : 0;
    progressBar.style.transform = 'scaleX(' + value + ')';
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  const revealElements = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach(function (element) { element.classList.add('is-visible'); });
  } else {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -50px' });
    revealElements.forEach(function (element) { observer.observe(element); });
  }

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (finePointer) {
    const cursor = document.getElementById('cursor');
    const dot = document.getElementById('cursor-dot');
    let mouseX = -100, mouseY = -100, cursorX = -100, cursorY = -100;
    window.addEventListener('mousemove', function (event) {
      mouseX = event.clientX;
      mouseY = event.clientY;
      dot.style.transform = 'translate3d(' + mouseX + 'px,' + mouseY + 'px,0)';
      body.classList.add('cursor-ready');
    });
    function animateCursor() {
      cursorX += (mouseX - cursorX) * .16;
      cursorY += (mouseY - cursorY) * .16;
      cursor.style.transform = 'translate3d(' + cursorX + 'px,' + cursorY + 'px,0)';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
    document.querySelectorAll('a, button, input, textarea, .tilt-card').forEach(function (element) {
      element.addEventListener('mouseenter', function () { cursor.classList.add('is-hovering'); });
      element.addEventListener('mouseleave', function () { cursor.classList.remove('is-hovering'); });
    });

    document.querySelectorAll('.tilt-card').forEach(function (card) {
      card.addEventListener('mousemove', function (event) {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.transform = 'perspective(1200px) rotateX(' + (-y * 3.8) + 'deg) rotateY(' + (x * 3.8) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }

  const form = document.querySelector('.contact-form');
  if (form) {
    const submitButton = form.querySelector('.submit-btn');
    const status = document.getElementById('form-status');
    const fields = {
      name: document.getElementById('name'),
      email: document.getElementById('email'),
      message: document.getElementById('message')
    };
    function setError(key, message) { document.getElementById(key + '-error').textContent = message; }
    function clearErrors() { Object.keys(fields).forEach(function (key) { setError(key, ''); }); status.textContent = ''; status.className = 'form-status'; }
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      clearErrors();
      const name = fields.name.value.trim();
      const email = fields.email.value.trim();
      const message = fields.message.value.trim();
      let valid = true;
      if (name.length < 2) { setError('name', 'Please enter your name.'); valid = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('email', 'Please enter a valid email address.'); valid = false; }
      if (message.length < 15) { setError('message', 'Please add a little more detail.'); valid = false; }
      if (!valid) return;

      submitButton.disabled = true;
      submitButton.textContent = 'Sending…';
      try {
        const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error('Request failed');
        form.reset();
        status.textContent = 'Message sent. I’ll get back to you soon.';
        status.classList.add('success');
      } catch (error) {
        status.textContent = 'Could not send the message. Email me directly at contact@abhii.online.';
        status.classList.add('error');
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Send project brief ↗';
      }
    });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
