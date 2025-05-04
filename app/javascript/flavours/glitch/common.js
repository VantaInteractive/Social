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

function rgbToRgba(rgb, alpha) {
    return rgb.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
}

function getDominantColor(imageSrc, callback) {
	const img = new Image();
	img.src = imageSrc;

	img.onload = () => {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		canvas.width = img.width;
		canvas.height = img.height;
		ctx.drawImage(img, 0, 0);

		try {
			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		    const data = imageData.data;
		    const colorCount = {};
		    let dominantColor = '';
		    let maxCount = 0;
		    for (let i = 0; i < data.length; i += 4) {
				const r = data[i];
				const g = data[i + 1];
				const b = data[i + 2];
				const a = data[i + 3];
				if (a === 0) continue; // Skip transparent pixels
				const rgb = `${r},${g},${b}`;
				colorCount[rgb] = (colorCount[rgb] || 0) + 1;
				if (colorCount[rgb] > maxCount) {
					maxCount = colorCount[rgb];
					dominantColor = rgb;
				}
			}
		    callback(`rgb(${dominantColor})`);
		} catch (error) {
          	console.error("Error accessing image data from canvas:", error);
          	callback('rgb(248, 255, 156)');
    	}
  };

  img.onerror = () => {
      console.error("Error loading image for dominant color extraction.");
      callback(null);
  };
}

// Function to check if the current URL matches the pattern {domain}/@{username}
const isAccountPage = () => {
	const regex = /^\/@[^\/]+$/; // Matches {domain}/@{username}
	return regex.test(window.location.pathname);
};

ready(() => {
    // Running all VISoc code after the page is ready

    // Set account page accent color based on presence of a colored role or profile picture
    const checkAccountRole = (attempt) => {
        const accountRole = document.querySelector('.account-role[data-account-role-id]');
        if (accountRole) {
            console.log("Applying custom accent color based on role color");
            const computedStyle = getComputedStyle(accountRole);
            const accountAccentColor = computedStyle.color;
            const accountAccentColorHex = rgbToHex(accountAccentColor);
            document.documentElement.style.setProperty('--accent', accountAccentColorHex);
            const rgbaColor = rgbToRgba(accountAccentColor, 0.15);
            document.documentElement.style.setProperty('--account-accent', rgbaColor);
        } else if (attempt < 21) { // Number of retries
            const delay = attempt * 100; // Delay in ms
            setTimeout(() => checkAccountRole(attempt + 1), delay);
        } else {
            console.log("No data-account-role-id found after multiple attempts. Extracting dominant color from profile picture.");
            checkProfilePicture(0);
        }
    };

    const checkProfilePicture = (attempt) => {
        const avatarImg = document.querySelector('.account__header__tabs .avatar .account__avatar img');
        if (avatarImg) {
            getDominantColor(avatarImg.src, (dominantColor) => {
                if (dominantColor) {
                    const dominantColorHex = rgbToHex(dominantColor);
                    document.documentElement.style.setProperty('--accent', dominantColorHex);
                    const rgbaColor = rgbToRgba(dominantColor, 0.15);
                    document.documentElement.style.setProperty('--account-accent', rgbaColor);
                } else if (attempt < 21) {
                    console.log("Failed to extract dominant color. Retrying...");
                    const delay = attempt * 100;
                    setTimeout(() => checkProfilePicture(attempt + 1), delay);
                } else {
                    console.log("Failed to extract dominant color from the profile picture after multiple attempts.");
                }
            });
        } else if (attempt < 21) {
            console.log("No profile picture found. Retrying...");
            const delay = attempt * 100;
            setTimeout(() => checkProfilePicture(attempt + 1), delay);
        } else {
            console.log("No profile picture found after multiple attempts.");
			document.documentElement.style.setProperty('--accent', '#f8ff9c');
			document.documentElement.style.setProperty('--account-accent', '#242424');
        }
    };

	// Handle internal navigation, otherwise checkAccountRole won't run more than once
	const handleUrlChange = () => {
		if (isAccountPage()) {
			checkAccountRole(0);
		} else {
			document.documentElement.style.setProperty('--accent', '#f8ff9c');
			document.documentElement.style.setProperty('--account-accent', '#242424');
		}
	};

    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handleUrlChange);
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        handleUrlChange();
    };
    history.replaceState = function(...args) {
        originalReplaceState.apply(this, args);
        handleUrlChange();
    };

	if (isAccountPage()) {
		checkAccountRole(0);
	} else {
		document.documentElement.style.setProperty('--accent', '#f8ff9c');
		document.documentElement.style.setProperty('--account-accent', '#242424');
	}
});