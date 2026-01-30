export function registerServiceWorker() {
  if (typeof window === 'undefined') return;
  
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);

            // If there's already a waiting worker, tell it to skip waiting so it becomes active
            if (registration.waiting) {
              try {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
              } catch (e) {
                console.warn('Could not message waiting service worker', e);
              }
            }

            // Listen for new service workers being installed
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (!newWorker) return;
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // A new update is available — tell the waiting worker to activate
                  registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
                }
              });
            });
          })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });
    
    // Handle service worker updates
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker controller changed, page will reload');
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  }
} 