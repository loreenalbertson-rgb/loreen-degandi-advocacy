const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const intakeForm = document.getElementById('advocacy-intake-form');
const formStatus = document.getElementById('form-status');

if (intakeForm) {
  intakeForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const selectedSupport = [...intakeForm.querySelectorAll('input[name="support"]:checked')]
      .map((input) => input.value);

    if (selectedSupport.length === 0) {
      if (formStatus) formStatus.textContent = 'Please select at least one type of support.';
      const firstSupport = intakeForm.querySelector('input[name="support"]');
      if (firstSupport) firstSupport.focus();
      return;
    }

    if (!intakeForm.reportValidity()) return;

    const data = new FormData(intakeForm);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const role = String(data.get('role') || '').trim();
    const situation = String(data.get('situation') || '').trim();
    const goal = String(data.get('goal') || '').trim();
    const timeframe = String(data.get('timeframe') || '').trim();

    const subject = `Volunteer advocacy request from ${name}`;
    const body = [
      'Hello Loreen,',
      '',
      'I would like to request volunteer patient advocacy support.',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `I am reaching out as: ${role}`,
      `Support requested: ${selectedSupport.join(', ')}`,
      '',
      'Brief overview:',
      situation,
      '',
      'Most helpful next step:',
      goal || 'Not specified',
      '',
      'Upcoming date or appointment:',
      timeframe || 'Not specified',
      '',
      'I understand that this is nonclinical advocacy support and that ordinary email is not a secure place for highly sensitive information.'
    ].join('\n');

    if (formStatus) formStatus.textContent = 'Opening your email app with your request…';

    const mailto = `mailto:loreendegandi.advocacy@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  });
}
