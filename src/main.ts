import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

// Register Service Worker for PWA functionality (Production only)
if ('serviceWorker' in navigator && !window.location.hostname.includes('localhost')) {
  navigator.serviceWorker.register('service-worker.js', {
    scope: '/'
  }).then((registration) => {
    console.log('[Main] Service Worker registered:', registration);
  }).catch((error) => {
    console.error('[Main] Service Worker registration failed:', error);
  });
}
