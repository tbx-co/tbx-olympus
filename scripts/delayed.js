// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';
import { loadScript } from './helpers.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here
// GTM4
loadScript('https://www.googletagmanager.com/gtag/js?id=G-SWMRJ9EY1E', () => {
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());

  gtag('config', 'G-SWMRJ9EY1E');
});
