/**
 * TUKU Booking System
 * Vanilla JavaScript with TUKUBooking namespace
 */

const TUKUBooking = (function() {
  'use strict';

  // Configuration
  const CONFIG = {
    apiBase: window.location.hostname === 'localhost'
      ? 'http://localhost:8787'
      : 'https://tuku-booking-api.falonbahal.workers.dev',
    timezone: 'America/Los_Angeles'
  };

  // State
  const state = {
    currentStep: 'landing',
    availability: null,
    selectedDate: null,
    selectedSlot: null,
    bookingDetails: {
      name: '',
      email: '',
      context: ''
    },
    booking: null,
    currentMonth: new Date(),
    managingBookingId: null
  };

  // DOM Elements (cached on init)
  let elements = {};

  /**
   * Initialize the booking system
   */
  function init() {
    cacheElements();
    checkForManageMode();
    loadAvailability();
    renderCalendar();
  }

  /**
   * Cache DOM elements for performance
   */
  function cacheElements() {
    elements = {
      steps: document.querySelectorAll('.step'),
      calendarDays: document.getElementById('calendar-days'),
      calendarMonthYear: document.getElementById('calendar-month-year'),
      prevMonth: document.getElementById('prev-month'),
      nextMonth: document.getElementById('next-month'),
      timeSlots: document.getElementById('time-slots'),
      selectedDateDisplay: document.getElementById('selected-date-display'),
      loadingOverlay: document.getElementById('loading-overlay'),
      noAvailability: document.getElementById('no-availability')
    };
  }

  /**
   * Check if we're in manage mode (URL has ?id=)
   */
  function checkForManageMode() {
    const params = new URLSearchParams(window.location.search);
    const bookingId = params.get('id');

    if (bookingId) {
      state.managingBookingId = bookingId;
      goToStep('manage');
      loadBookingDetails(bookingId);
    }
  }

  /**
   * Load availability from API
   */
  async function loadAvailability() {
    try {
      const response = await fetch(`${CONFIG.apiBase}/api/availability`);
      if (!response.ok) throw new Error('Failed to load availability');

      const data = await response.json();
      state.availability = data.availability;

      // Check if there's any availability
      const hasSlots = state.availability.some(day => day.slots.length > 0);
      if (!hasSlots && elements.noAvailability) {
        elements.noAvailability.style.display = 'block';
      }

      renderCalendar();
    } catch (error) {
      console.error('Error loading availability:', error);
    }
  }

  /**
   * Navigate to a step
   */
  function goToStep(stepName) {
    state.currentStep = stepName;

    elements.steps.forEach(step => {
      step.classList.remove('active');
    });

    const targetStep = document.getElementById(`step-${stepName}`);
    if (targetStep) {
      targetStep.classList.add('active');
    }

    // Scroll to top
    window.scrollTo(0, 0);
  }

  /**
   * Render the calendar
   */
  function renderCalendar() {
    const year = state.currentMonth.getFullYear();
    const month = state.currentMonth.getMonth();

    // Update month/year display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    elements.calendarMonthYear.textContent = `${monthNames[month]} ${year}`;

    // Get first day of month and total days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // Build available dates set
    const availableDates = new Set();
    if (state.availability) {
      state.availability.forEach(day => {
        if (day.slots.length > 0) {
          availableDates.add(day.date);
        }
      });
    }

    // Clear and render days
    elements.calendarDays.innerHTML = '';

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const btn = createDayButton(day, 'other-month');
      elements.calendarDays.appendChild(btn);
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDateString(year, month, day);
      const isAvailable = availableDates.has(dateStr);
      const isSelected = state.selectedDate === dateStr;

      let className = '';
      if (isSelected) className = 'selected';
      else if (isAvailable) className = 'available';
      else className = 'unavailable';

      const btn = createDayButton(day, className, isAvailable ? dateStr : null);
      elements.calendarDays.appendChild(btn);
    }

    // Next month days (fill remaining cells)
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (firstDay + daysInMonth);
    for (let day = 1; day <= remainingCells; day++) {
      const btn = createDayButton(day, 'other-month');
      elements.calendarDays.appendChild(btn);
    }

    // Update navigation buttons
    const today = new Date();
    const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const maxMonth = new Date(today.getFullYear(), today.getMonth() + 2, 1);

    elements.prevMonth.disabled = state.currentMonth <= minMonth;
    elements.nextMonth.disabled = state.currentMonth >= maxMonth;
  }

  /**
   * Create a calendar day button
   */
  function createDayButton(day, className, dateStr = null) {
    const btn = document.createElement('button');
    btn.className = `calendar-day ${className}`;
    btn.textContent = day;
    btn.type = 'button';

    if (dateStr && className === 'available') {
      btn.onclick = () => selectDate(dateStr);
    }

    return btn;
  }

  /**
   * Format date as YYYY-MM-DD
   */
  function formatDateString(year, month, day) {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  }

  /**
   * Navigate to previous month
   */
  function prevMonth() {
    state.currentMonth.setMonth(state.currentMonth.getMonth() - 1);
    renderCalendar();
  }

  /**
   * Navigate to next month
   */
  function nextMonth() {
    state.currentMonth.setMonth(state.currentMonth.getMonth() + 1);
    renderCalendar();
  }

  /**
   * Select a date
   */
  function selectDate(dateStr) {
    state.selectedDate = dateStr;
    state.selectedSlot = null;

    renderCalendar();
    renderTimeSlots();
    goToStep('time');
  }

  /**
   * Render time slots for selected date
   */
  function renderTimeSlots() {
    if (!state.selectedDate || !state.availability) return;

    const dayData = state.availability.find(d => d.date === state.selectedDate);
    if (!dayData) return;

    // Update date display
    const date = new Date(state.selectedDate + 'T12:00:00');
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    elements.selectedDateDisplay.textContent =
      `${date.toLocaleDateString('en-US', options)} · Pacific Time`;

    // Render slots
    elements.timeSlots.innerHTML = '';

    dayData.slots.forEach(slot => {
      const btn = document.createElement('button');
      btn.className = 'time-slot';
      btn.type = 'button';
      btn.textContent = slot.startTime;
      btn.onclick = () => selectTimeSlot(slot);

      if (state.selectedSlot && state.selectedSlot.start === slot.start) {
        btn.classList.add('selected');
      }

      elements.timeSlots.appendChild(btn);
    });
  }

  /**
   * Select a time slot
   */
  function selectTimeSlot(slot) {
    state.selectedSlot = slot;
    renderTimeSlots();
    goToStep('details');
  }

  /**
   * Validate email format
   */
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  /**
   * Submit details form
   */
  function submitDetails(event) {
    event.preventDefault();

    const nameInput = document.getElementById('booking-name');
    const emailInput = document.getElementById('booking-email');
    const contextInput = document.getElementById('booking-context');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');

    let isValid = true;

    // Clear previous errors
    nameError.textContent = '';
    emailError.textContent = '';
    nameInput.classList.remove('error');
    emailInput.classList.remove('error');

    // Validate name
    if (!nameInput.value.trim()) {
      nameError.textContent = 'Please enter your name';
      nameInput.classList.add('error');
      isValid = false;
    }

    // Validate email
    if (!emailInput.value.trim()) {
      emailError.textContent = 'Please enter your email';
      emailInput.classList.add('error');
      isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      emailError.textContent = 'Please enter a valid email';
      emailInput.classList.add('error');
      isValid = false;
    }

    if (!isValid) return false;

    // Save details
    state.bookingDetails = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      context: contextInput.value.trim()
    };

    // Update confirmation display
    updateConfirmation();
    goToStep('confirm');

    return false;
  }

  /**
   * Update confirmation screen
   */
  function updateConfirmation() {
    const date = new Date(state.selectedDate + 'T12:00:00');
    const options = { weekday: 'long', month: 'long', day: 'numeric' };

    document.getElementById('confirm-date').textContent =
      date.toLocaleDateString('en-US', options);
    document.getElementById('confirm-time').textContent =
      `${state.selectedSlot.startTime} PT`;
    document.getElementById('confirm-name').textContent =
      state.bookingDetails.name;
    document.getElementById('confirm-email').textContent =
      state.bookingDetails.email;
  }

  /**
   * Confirm and create booking
   */
  async function confirmBooking() {
    const confirmBtn = document.getElementById('confirm-btn');
    const confirmError = document.getElementById('confirm-error');

    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Creating booking...';
    confirmError.style.display = 'none';
    showLoading(true);

    try {
      const response = await fetch(`${CONFIG.apiBase}/api/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: state.bookingDetails.name,
          email: state.bookingDetails.email,
          context: state.bookingDetails.context,
          slotStart: state.selectedSlot.start,
          slotEnd: state.selectedSlot.end
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking');
      }

      state.booking = data.booking;
      showSuccess();

    } catch (error) {
      confirmError.textContent = error.message || 'Something went wrong. Please try again.';
      confirmError.style.display = 'block';
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Confirm booking';
    } finally {
      showLoading(false);
    }
  }

  /**
   * Show success screen
   */
  function showSuccess() {
    document.getElementById('success-email').textContent = state.bookingDetails.email;
    document.getElementById('success-date').textContent = state.booking.date;
    document.getElementById('success-time').textContent = `${state.booking.time} · ${state.booking.timezone}`;

    const manageLink = document.getElementById('manage-link');
    manageLink.href = `?id=${state.booking.id}`;

    goToStep('success');
  }

  /**
   * Load booking details for manage screen
   */
  async function loadBookingDetails(bookingId) {
    const manageLoading = document.getElementById('manage-loading');
    const manageContent = document.getElementById('manage-content');
    const manageError = document.getElementById('manage-error');

    manageLoading.style.display = 'block';
    manageContent.style.display = 'none';
    manageError.style.display = 'none';

    try {
      const response = await fetch(`${CONFIG.apiBase}/api/booking/${bookingId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Booking not found');
      }

      // Populate manage screen
      document.getElementById('manage-id').textContent = data.booking.id;
      document.getElementById('manage-date').textContent = data.booking.date;
      document.getElementById('manage-time').textContent = `${data.booking.time} · ${data.booking.timezone}`;

      const statusEl = document.getElementById('manage-status');
      statusEl.textContent = data.booking.status === 'confirmed' ? 'Confirmed' : data.booking.status;
      statusEl.className = `summary-value status-${data.booking.status}`;

      const meetLink = document.getElementById('meet-link');
      meetLink.href = data.booking.meetLink;

      const manageActions = document.getElementById('manage-actions');
      const managePast = document.getElementById('manage-past');

      if (data.booking.isPast) {
        manageActions.style.display = 'none';
        managePast.style.display = 'block';
      } else {
        manageActions.style.display = 'block';
        managePast.style.display = 'none';
      }

      state.managingBookingId = bookingId;
      manageLoading.style.display = 'none';
      manageContent.style.display = 'block';

    } catch (error) {
      manageLoading.style.display = 'none';
      manageError.textContent = error.message;
      manageError.style.display = 'block';
    }
  }

  /**
   * Cancel a booking
   */
  async function cancelBooking() {
    if (!state.managingBookingId) return;

    if (!confirm('Are you sure you want to cancel this booking?')) return;

    const cancelBtn = document.getElementById('cancel-btn');
    const manageError = document.getElementById('manage-error');

    cancelBtn.disabled = true;
    cancelBtn.textContent = 'Cancelling...';
    manageError.style.display = 'none';
    showLoading(true);

    try {
      const response = await fetch(`${CONFIG.apiBase}/api/booking/${state.managingBookingId}/cancel`, {
        method: 'POST'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel booking');
      }

      goToStep('cancelled');

    } catch (error) {
      manageError.textContent = error.message;
      manageError.style.display = 'block';
      cancelBtn.disabled = false;
      cancelBtn.textContent = 'Cancel booking';
    } finally {
      showLoading(false);
    }
  }

  /**
   * Reset and start over
   */
  function reset() {
    state.selectedDate = null;
    state.selectedSlot = null;
    state.bookingDetails = { name: '', email: '', context: '' };
    state.booking = null;
    state.managingBookingId = null;

    // Clear form
    document.getElementById('details-form').reset();

    // Clear URL params
    window.history.replaceState({}, '', window.location.pathname);

    // Reload availability and go to landing
    loadAvailability();
    goToStep('landing');
  }

  /**
   * Show/hide loading overlay
   */
  function showLoading(show) {
    elements.loadingOverlay.style.display = show ? 'flex' : 'none';
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  return {
    goToStep,
    prevMonth,
    nextMonth,
    submitDetails,
    confirmBooking,
    cancelBooking,
    reset
  };

})();
