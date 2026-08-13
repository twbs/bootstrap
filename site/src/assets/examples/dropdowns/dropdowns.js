document.addEventListener('DOMContentLoaded', function () {
  // Light theme calendar
  const calendarLightEl = document.getElementById('calendar-light');
  if (calendarLightEl) {
    new VanillaCalendarPro.Calendar(calendarLightEl, {
      date: new Date()
    });
  }

  // Dark theme calendar
  const calendarDarkEl = document.getElementById('calendar-dark');
  if (calendarDarkEl) {
    new VanillaCalendarPro.Calendar(calendarDarkEl, {
      date: new Date()
    });
  }
});