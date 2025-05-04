import Rails from '@rails/ujs';
import ready from './ready.js';

export function start() {
  require.context('@/images/', true, /\.(jpg|png|svg)$/);

  try {
    Rails.start();
  } catch {
    // If called twice
  }
}

function rgbToHex(rgb) {
    const rgbArray = rgb.match(/\d+/g);
    const hex = rgbArray.map(x => {
        const hexValue = parseInt(x).toString(16);
        return hexValue.length === 1 ? '0' + hexValue : hexValue;
    }).join('');
    return `#${hex}`;
}

ready(() => {
  // Running all VISoc code after the page is ready

  // Set account page accent color based on presence of a colored role or profile picture
  setTimeout(() => {
      const accountRole = document.querySelector('.account-role[data-account-role-id]');
      
      if (accountRole) {
          console.log("Applying custom accent color based on role color");
          const computedStyle = getComputedStyle(accountRole);
          const accountAccentColor = computedStyle.color;
          const accountAccentColorHex = rgbToHex(accountAccentColor);
          document.documentElement.style.setProperty('--accent', accountAccentColorHex);
      } else {
          console.log("No data-account-role-id found. Will implement accent color extraction soon.");
      }
  }, 2000);
});
