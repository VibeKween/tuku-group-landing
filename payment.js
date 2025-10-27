// payment.js

// Configuration
const STRIPE_PUBLISHABLE_KEY = 'pk_test_REPLACE_WITH_YOUR_KEY';
const API_URL = '/api'; // Your API endpoint

// Services configuration (could also fetch from API)
const SERVICES = {
  light: {
    id: 'light',
    name: 'CLARITY SPRINT',
    price: 525000, // cents
    description: 'Strategic exploration. Custom direction.',
    details: `
      <p class="service-detail">An entry point for strategic exploration. We'll think through what you're building, assess what's needed, and you'll walk away with a custom artifact that gives you clarity and direction.</p>
      <p class="service-detail">A deliverable tailored to our conversation — whether that's a strategic assessment, a recommendation report, a planning framework, or something else that helps you take action. This is about getting unstuck and knowing what comes next.</p>
      <p class="service-detail"><strong>Timeline:</strong> 2 to 4 weeks</p>
      <p class="service-detail"><strong>Payment:</strong> 100% upfront</p>
    `
  },
  technical: {
    id: 'technical',
    name: 'TECHNICAL BUILD',
    price: 1250000,
    description: 'Discovery through delivery. Complete and operational.',
    details: `
      <p class="service-detail">A complete technical build from discovery through operational handoff. This includes everything needed to go from concept to functioning system: copywriting, UI/UX, technical implementation, QA testing, user flows, documentation, and training.</p>
      <p class="service-detail">You get a fully operational deliverable with everything documented and ready to use. The specifics depend on what we're building, but you're getting end-to-end execution and handoff.</p>
      <p class="service-detail"><strong>Timeline:</strong> 4 to 6 weeks</p>
      <p class="service-detail"><strong>Payment:</strong> 50% upfront, 50% at completion before final handoff</p>
    `
  },
  multiphase: {
    id: 'multiphase',
    name: 'MULTI-PHASE BUILD',
    price: 0, // Will show "Scoped to conversation"
    description: 'Layered complexity. Built in sequence.',
    details: `
      <p class="service-detail">Multi-phase engagements that require discovery and multiple build sprints. These projects involve layers of complexity — whether that's integrated systems, phased rollouts, or builds that need to evolve over time.</p>
      <p class="service-detail">Scope is determined after discovery based on what you're actually building and what it requires to do it right.</p>
      <p class="service-detail"><strong>Timeline:</strong> 6 to 8+ weeks minimum</p>
      <p class="service-detail"><strong>Payment:</strong> 50% upfront, 25% at major milestone, 25% at completion before final handoff</p>
    `
  }
};

// FAQ Configuration
const FAQ_DATA = [
  {
    id: 'payment-structure',
    question: 'Why do you structure payment this way?',
    answer: `
      <p>The work requires focus. Payment timing ensures we can dedicate attention without distraction while creating natural milestones that confirm value as the project progresses.</p>
      <p>The final payment arrives when the work is complete and operational. This moment confirms what was built and often becomes the conversation about what's next.</p>
      <p><strong>Light Package:</strong> Full payment due before work begins.</p>
      <p><strong>Technical Build:</strong> 50% to begin, 50% upon completion before final handoff.</p>
      <p><strong>Multi-Phase Build:</strong> 50% upfront, 25% at major milestone, 25% upon completion before final handoff.</p>
    `
  },
  {
    id: 'scope-changes',
    question: 'What about scope changes and post-delivery updates?',
    answer: `
      <p><strong>Scope Changes:</strong> Work outside defined scope is billed at $200/hour. Invoiced upon completion, due within 7 days.</p>
      <p><strong>Post-Delivery Updates:</strong> Minor updates or edits after delivery are billed at $200/hour. Larger updates will be scoped and priced based on complexity, with payment due 100% upfront before work begins.</p>
      <p><strong>Cancellation Policy:</strong> Light Package is non-refundable once work begins. Technical and Multi-Phase builds can be paused or rescheduled with 10 business days notice.</p>
    `
  },
  {
    id: 'project-scope',
    question: 'How do you handle project scope?',
    answer: `
      <p>Each engagement is scoped before it begins. Once work starts, the scope is locked. Minor refinements within the project's intent are included.</p>
      <p>Significant additions or changes are billed at $200/hour for additional time required.</p>
      <p>The premium hourly rate for mid-project changes ensures we maintain focus on delivering what was scoped. When work is planned as part of the initial scope, you benefit from project pricing. When it's added mid-stream, the higher rate reflects the disruption to planned execution.</p>
    `
  },
  {
    id: 'getting-started',
    question: 'What\'s the best way to start?',
    answer: `
      <p>Begin with a call — a conversation to understand your direction and define what matters.</p>
      <p>From there, we'll clarify your stance and map the milestones ahead. The Light Package is often the best entry point for strategic exploration, while Technical Build is ideal when you know what needs to be built.</p>
      <p>Multi-Phase Build is for projects requiring layered complexity and multiple sprints in sequence.</p>
    `
  }
];

// State
let state = {
  currentStep: 'select',
  selectedService: 'light',
  name: '',
  email: '',
  stripe: null,
  cardElement: null
};

// Initialize Stripe
async function initStripe() {
  state.stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
  
  const elements = state.stripe.elements({
    fonts: [{
      cssSrc: 'https://fonts.googleapis.com/css?family=-apple-system'
    }]
  });

  state.cardElement = elements.create('card', {
    style: {
      base: {
        color: '#000000',
        fontFamily: 'JetBrains Mono, Courier New, monospace',
        fontSize: '16px',
        fontWeight: '400',
        lineHeight: '1.5',
        '::placeholder': {
          color: '#000000',
          opacity: '0.6'
        }
      },
      invalid: {
        color: '#C19A4B'
      },
      focus: {
        borderColor: '#5691c8'
      }
    }
  });

  state.cardElement.mount('#card-element');

  state.cardElement.on('change', (event) => {
    const errorElement = document.getElementById('card-errors');
    if (event.error) {
      // Make error messages more elegant and TUKU-like
      let message = event.error.message;
      if (event.error.code === 'incomplete_number') {
        message = 'Your card number looks incomplete.';
      } else if (event.error.code === 'incomplete_expiry') {
        message = 'Please complete the expiry date.';
      } else if (event.error.code === 'incomplete_cvc') {
        message = 'Security code needs completion.';
      } else if (event.error.code === 'invalid_number') {
        message = 'This card number appears invalid.';
      }
      
      errorElement.textContent = message;
      errorElement.classList.add('visible');
    } else {
      errorElement.textContent = '';
      errorElement.classList.remove('visible');
    }
  });
}

// Render services
function renderServices() {
  const container = document.getElementById('services-list');
  container.innerHTML = '';

  Object.values(SERVICES).forEach(service => {
    const card = document.createElement('div');
    card.className = `service-card ${state.selectedService === service.id ? 'selected' : ''}`;
    card.onclick = () => selectService(service.id);
    
    card.innerHTML = `
      <div class="service-header">
        <div class="service-name">${service.name}</div>
        <div class="service-price">${
          service.id === 'multiphase' ? 'Scoped to conversation' :
          service.id === 'technical' ? 'Starting at $' + (service.price / 100).toLocaleString() :
          '$' + (service.price / 100).toLocaleString()
        }</div>
      </div>
      <div class="service-description">${service.description}</div>
      <div class="service-details ${state.selectedService === service.id ? 'expanded' : ''}">
        ${service.details}
      </div>
    `;
    
    container.appendChild(card);
  });
}

// Select service
function selectService(serviceId) {
  state.selectedService = serviceId;
  renderServices();
  validateContactForm();
}

// Validate contact form
function validateContactForm() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  
  let isValid = true;
  
  // Validate name
  const nameError = document.getElementById('name-error');
  const nameInput = document.getElementById('name');
  if (!name) {
    showFieldError('name-error', 'A name for the conversation.');
    nameInput.classList.add('error');
    isValid = false;
  } else {
    hideFieldError('name-error');
    nameInput.classList.remove('error');
  }
  
  // Validate email
  const emailError = document.getElementById('email-error');
  const emailInput = document.getElementById('email');
  if (!email) {
    showFieldError('email-error', 'An email address helps us connect.');
    emailInput.classList.add('error');
    isValid = false;
  } else {
    const emailValidation = isValidEmail(email);
    if (emailValidation === true) {
      hideFieldError('email-error');
      emailInput.classList.remove('error');
    } else if (typeof emailValidation === 'object' && emailValidation.suggestion) {
      showFieldError('email-error', emailValidation.suggestion);
      emailInput.classList.add('error');
      isValid = false;
    } else {
      showFieldError('email-error', 'This email format looks incomplete.');
      emailInput.classList.add('error');
      isValid = false;
    }
  }
  
  state.name = name;
  state.email = email;
  
  const continueBtn = document.getElementById('continue-btn');
  continueBtn.disabled = !isValid;
}

// Show field error
function showFieldError(errorId, message) {
  const errorElement = document.getElementById(errorId);
  errorElement.textContent = message;
  errorElement.classList.add('visible');
}

// Hide field error
function hideFieldError(errorId) {
  const errorElement = document.getElementById(errorId);
  errorElement.classList.remove('visible');
}

// Email validation with whitelist of valid domains
function isValidEmail(email) {
  const basicFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!basicFormat) return false;
  
  // Whitelist of commonly accepted email domains
  const validDomains = new Set([
    // Major providers
    'gmail.com', 'googlemail.com', 'google.com',
    'yahoo.com', 'yahoo.co.uk', 'yahoo.ca', 'yahoo.fr', 'yahoo.de',
    'hotmail.com', 'hotmail.co.uk', 'live.com', 'msn.com',
    'outlook.com', 'outlook.co.uk',
    'icloud.com', 'me.com', 'mac.com',
    'aol.com', 'aim.com',
    
    // Business/Corporate
    'protonmail.com', 'proton.me',
    'fastmail.com', 'fastmail.fm',
    'zoho.com', 'zohomail.com',
    'yandex.com', 'yandex.ru',
    'mail.com', 'gmx.com', 'gmx.de',
    
    // Educational
    'edu', 'ac.uk', 'edu.au', 'edu.ca',
    
    // Common business domains (can add more as needed)
    'company.com', 'corp.com', 'business.com',
    
    // Common country domains
    'co.uk', 'com.au', 'ca', 'de', 'fr', 'jp', 'in', 'br'
  ]);
  
  const domain = email.toLowerCase().split('@')[1];
  
  // Check if domain is in our whitelist
  if (validDomains.has(domain)) {
    return true;
  }
  
  // Check if it's a business domain pattern (anything.com, anything.org, etc.)
  const businessPatterns = [
    /\.[a-z]{2,}\.com$/,
    /\.[a-z]{2,}\.org$/,
    /\.[a-z]{2,}\.net$/,
    /\.[a-z]{2,}\.co$/,
    /\.[a-z]{2,}\.io$/,
    /\.com$/,
    /\.org$/,
    /\.net$/,
    /\.co$/,
    /\.io$/,
    /\.biz$/,
    /\.info$/
  ];
  
  const isBusinessDomain = businessPatterns.some(pattern => pattern.test(domain));
  if (isBusinessDomain) {
    return true;
  }
  
  // If not in whitelist and not a business pattern, suggest it might be a typo
  return { valid: false, suggestion: 'Please check the email domain spelling.' };
}

// Show step
function showStep(step) {
  document.querySelectorAll('.step').forEach(el => {
    el.classList.remove('active');
  });
  document.getElementById(`step-${step}`).classList.add('active');
  state.currentStep = step;
  
  if (step === 'payment') {
    updateSummary();
  }
}

// Update summary
function updateSummary() {
  const service = SERVICES[state.selectedService];
  document.getElementById('summary-service').textContent = service.name;
  document.getElementById('summary-email').textContent = state.email;
  document.getElementById('summary-price').textContent = service.id === 'retainer' ? '$1,500/mo' : `$${(service.price / 100).toLocaleString()}`;
}

// Handle payment submission
async function handlePaymentSubmit(event) {
  event.preventDefault();
  
  const submitBtn = document.getElementById('submit-btn');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Processing...';

  try {
    // Create Payment Intent
    const response = await fetch(`${API_URL}/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceId: state.selectedService,
        email: state.email,
        name: state.name
      })
    });

    const { clientSecret, error } = await response.json();

    if (error) {
      throw new Error(error);
    }

    // Confirm payment with Stripe
    const { error: stripeError, paymentIntent } = await state.stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: state.cardElement,
          billing_details: {
            name: state.name,
            email: state.email
          }
        }
      }
    );

    if (stripeError) {
      throw new Error(stripeError.message);
    }

    // Payment succeeded
    showSuccess(paymentIntent);

  } catch (err) {
    const errorElement = document.getElementById('card-errors');
    errorElement.textContent = err.message;
    errorElement.classList.add('visible');
    
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

// Show success
function showSuccess(paymentIntent) {
  const service = SERVICES[state.selectedService];
  
  document.getElementById('success-service').textContent = service.name.toLowerCase();
  document.getElementById('receipt-id').textContent = paymentIntent.id.slice(-12);
  
  showStep('success');
}

// Render FAQ
function renderFAQ() {
  const container = document.getElementById('faq-accordion');
  if (!container) return; // Skip if FAQ container doesn't exist
  
  container.innerHTML = '';

  FAQ_DATA.forEach(faq => {
    const faqItem = document.createElement('div');
    faqItem.className = 'faq-item';
    
    faqItem.innerHTML = `
      <div class="faq-question" onclick="toggleFAQ('${faq.id}')">
        <span>${faq.question}</span>
        <span class="faq-toggle">+</span>
      </div>
      <div class="faq-answer" id="faq-${faq.id}">
        ${faq.answer}
      </div>
    `;
    
    container.appendChild(faqItem);
  });
}

// Toggle FAQ
function toggleFAQ(faqId) {
  const answer = document.getElementById(`faq-${faqId}`);
  const toggle = answer.previousElementSibling.querySelector('.faq-toggle');
  
  // Close all other FAQs
  document.querySelectorAll('.faq-answer').forEach(otherAnswer => {
    if (otherAnswer.id !== `faq-${faqId}`) {
      otherAnswer.classList.remove('expanded');
      otherAnswer.previousElementSibling.querySelector('.faq-toggle').textContent = '+';
    }
  });
  
  // Toggle current FAQ
  answer.classList.toggle('expanded');
  toggle.textContent = answer.classList.contains('expanded') ? '−' : '+';
}

// Event listeners
function setupEventListeners() {
  // Contact form validation
  document.getElementById('name').addEventListener('input', validateContactForm);
  document.getElementById('email').addEventListener('input', validateContactForm);
  document.getElementById('name').addEventListener('blur', validateContactForm);
  document.getElementById('email').addEventListener('blur', validateContactForm);
  
  // Continue button
  document.getElementById('continue-btn').addEventListener('click', () => {
    showStep('payment');
  });
  
  // Back button
  document.getElementById('back-btn').addEventListener('click', () => {
    showStep('select');
  });
  
  // Payment form
  document.getElementById('payment-form').addEventListener('submit', handlePaymentSubmit);
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  renderServices();
  renderFAQ();
  setupEventListeners();
  await initStripe();
});