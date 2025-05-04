import ready from './ready.js';

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
  const accountRole = document.querySelector('.account-role[data-account-role-id]');
    
    if (accountRole) {
        const computedStyle = getComputedStyle(accountRole);
        const accountAccentColor = computedStyle.color;
        const accountAccentColorHex = rgbToHex(accountAccentColor);
        document.documentElement.style.setProperty('--accent', accountAccentColorHex);
    } else {
        console.log("No data-account-role-id found. Will implement accent color extraction soon.");
    }
});
