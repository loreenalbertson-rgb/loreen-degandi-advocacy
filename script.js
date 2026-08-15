const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const yearTarget = document.querySelector('#year');

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

// Keep the Advocacy Blog easy to reach from every page without duplicating navigation markup.
if (navigation && !navigation.querySelector('a[href="blog.html"]')) {
  const requestSupportLink = navigation.querySelector('a[href="intake.html"]');
  const blogLink = document.createElement('a');
  blogLink.href = 'blog.html';
  blogLink.textContent = 'Blog';
  if (requestSupportLink) {
    navigation.insertBefore(blogLink, requestSupportLink);
  } else {
    navigation.appendChild(blogLink);
  }
}

document.querySelectorAll('.footer-nav').forEach((footerNav) => {
  if (!footerNav.querySelector('a[href="blog.html"]')) {
    const requestSupportLink = footerNav.querySelector('a[href="intake.html"]');
    const blogLink = document.createElement('a');
    blogLink.href = 'blog.html';
    blogLink.textContent = 'Blog';
    if (requestSupportLink) {
      footerNav.insertBefore(blogLink, requestSupportLink);
    } else {
      footerNav.appendChild(blogLink);
    }
  }
});

const navigationLinks = document.querySelectorAll('.site-nav a');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    navigation.classList.toggle('is-open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
  });

  navigationLinks.forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      navigation.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      navigation.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    }
  });
}

const intakeForm = document.querySelector('#advocacy-intake-form');

if (intakeForm) {
  const supportHint = document.querySelector('#support-hint');
  const formStatus = document.querySelector('#form-status');
  const supportChecks = [...intakeForm.querySelectorAll('input[name="support"]')];

  const setStatus = (message, type = '') => {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`.trim();
  };

  supportChecks.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const hasSelection = supportChecks.some((item) => item.checked);
      if (supportHint) supportHint.classList.toggle('error', !hasSelection);
    });
  });

  intakeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    setStatus('');

    const selectedSupport = supportChecks.filter((item) => item.checked).map((item) => item.value);
    if (!selectedSupport.length) {
      if (supportHint) supportHint.classList.add('error');
      setStatus('Please select at least one type of support.', 'error');
      supportChecks[0]?.focus();
      return;
    }

    if (!intakeForm.checkValidity()) {
      intakeForm.reportValidity();
      setStatus('Please complete the required fields before preparing your request.', 'error');
      return;
    }

    const data = new FormData(intakeForm);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const role = String(data.get('role') || '').trim();
    const situation = String(data.get('situation') || '').trim();
    const goal = String(data.get('goal') || '').trim();
    const timeframe = String(data.get('timeframe') || '').trim();

    const subject = `Patient Advocacy Support Request from ${name}`;
    const body = [
      'Hello Loreen,',
      '',
      'I am reaching out to request volunteer patient advocacy support.',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `I am reaching out as: ${role}`,
      `Support I am looking for: ${selectedSupport.join(', ')}`,
      '',
      'Brief overview:',
      situation,
      '',
      'What would feel most helpful as a next step:',
      goal || 'Not specified',
      '',
      'Date or appointment I am preparing for:',
      timeframe || 'Not specified',
      '',
      'I understand this is nonclinical advocacy support and that ordinary email is not a secure place for highly sensitive information.',
      '',
      'Thank you.'
    ].join('\n');

    const mailto = `mailto:loreendegandi.advocacy@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus('Your email request is ready. Opening your email app now.', 'success');
    window.location.href = mailto;
  });
}
