// payment.js

// Configuration
const STRIPE_PUBLISHABLE_KEY = 'pk_test_REPLACE_WITH_YOUR_KEY';
const API_URL = '/api'; // Your API endpoint

// Services configuration (could also fetch from API)
const SERVICES = {
  consultation: {
    id: 'consultation',
    name: 'Initial Consultation',
    price: 120000, // cents
    description: 'A conversation, then a plan.',
    details: `
      <h4>INITIAL CONSULTATION</h4>
      <p class="service-detail">Full discovery and strategic scoping.</p>
      <p class="service-detail">We map your vision, understand what's required, identify 
      constraints, and create a detailed roadmap. You receive a 
      complete scope broken into sprints with clear milestones 
      and timeline.</p>
      <p class="service-detail">By the end, you know exactly what you're building and what 
      it takes to complete.</p>
    `
  },
  sprint: {
    id: 'sprint',
    name: 'Sprint Build',
    price: 450000,
    description: 'Build with intention. Ship complete.',
    details: `
      <h4>SPRINT BUILD</h4>
      <p class="service-detail">Two weeks of focused execution on a single milestone.</p>
      <p class="service-detail">A sprint delivers something complete. Brand foundation. Design 
      system. Platform build. Scoped, executed, delivered.</p>
      <p class="service-detail">Multi-sprint projects can be scheduled in advance.</p>
      <p class="service-detail">For work requiring multiple phases, packages are available.
      Pricing scales with scope.</p>
      <p class="service-detail">One sprint at a time. When yours begins, you have our full attention.</p>
    `
  },
  retainer: {
    id: 'retainer',
    name: 'Retainer Engagement',
    price: 150000,
    description: 'Strategic support. Thoughtful refinement.',
    details: `
      <h4>RETAINER ENGAGEMENT</h4>
      <p class="service-detail">Ongoing guidance after project completion.</p>
      <p class="service-detail">For work that remains live and evolving. Small refinements, 
      strategic direction, maintenance.</p>
      <p class="service-detail">Available after completing sprint work together.</p>
    `
  }
};

// State
let state = {
  currentStep: 'select',
  selectedService: 'consultation',
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
        <div class="service-price">${service.id === 'retainer' ? '$1,500/mo' : '$' + (service.price / 100).toLocaleString()}</div>
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
  setupEventListeners();
  await initStripe();
});