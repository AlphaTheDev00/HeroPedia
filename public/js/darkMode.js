// Dark mode functionality
document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const htmlElement = document.documentElement;
  
  // Check if user previously enabled dark mode
  const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
  
  // Set initial state based on localStorage
  if (isDarkMode) {
    enableDarkMode();
  }
  
  // Toggle dark mode when button is clicked
  darkModeToggle.addEventListener('click', () => {
    // Check if dark mode is currently enabled
    const isDarkMode = htmlElement.getAttribute('data-bs-theme') === 'dark';
    
    if (isDarkMode) {
      disableDarkMode();
    } else {
      enableDarkMode();
    }
  });
  
  // Function to enable dark mode
  function enableDarkMode() {
    // Add dark theme attribute
    htmlElement.setAttribute('data-bs-theme', 'dark');
    // Update icon
    updateIcon(true);
    // Save preference to localStorage
    localStorage.setItem('darkMode', 'enabled');
  }
  
  // Function to disable dark mode
  function disableDarkMode() {
    // Remove dark theme attribute
    htmlElement.setAttribute('data-bs-theme', 'light');
    // Update icon
    updateIcon(false);
    // Save preference to localStorage
    localStorage.setItem('darkMode', 'disabled');
  }
  
  // Update the icon based on current mode
  function updateIcon(isDark) {
    const iconElement = darkModeToggle.querySelector('i');
    if (isDark) {
      iconElement.classList.remove('bi-moon');
      iconElement.classList.add('bi-sun');
    } else {
      iconElement.classList.remove('bi-sun');
      iconElement.classList.add('bi-moon');
    }
  }
});
