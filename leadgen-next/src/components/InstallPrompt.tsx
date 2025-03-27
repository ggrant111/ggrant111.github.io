import React, { useState, useEffect } from 'react';

const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches;
    
    // Check if it's an iOS device
    const isIOSDevice = /iPhone|iPad|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    
    // Check if it's an Android device
    const isAndroidDevice = /Android/.test(navigator.userAgent);

    // Show the prompt if not installed and on a mobile device
    if (!isAppInstalled && (isIOSDevice || isAndroidDevice)) {
      setShowPrompt(true);
      setIsIOS(isIOSDevice);
      setIsAndroid(isAndroidDevice);

      // Hide the prompt after 30 seconds
      const timer = setTimeout(() => {
        setShowPrompt(false);
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-50 animate-slide-up">
      <div className="max-w-md mx-auto">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-4">
            <img src="/leadgenlogo_square.svg" alt="Lead Generator" className="w-12 h-12" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-1">Add to Home Screen</h3>
            {isIOS ? (
              <p className="text-sm text-gray-600">
                Tap the share icon <span className="inline-block w-5 h-5 align-text-bottom">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 4.5a2.5 2.5 0 11.5 0v7.55a3.5 3.5 0 005.5 1.45l-1.293-1.293a.5.5 0 01.707-.707l2.5 2.5a.5.5 0 010 .707l-2.5 2.5a.5.5 0 01-.707-.707L20 14.55a3.5 3.5 0 00-5.5-1.45v1.5a2.5 2.5 0 01-5 0V8.4a.9.9 0 00-1.8 0v7.1a2.5 2.5 0 01-5 0V8.5a2.5 2.5 0 012.5-2.5H8v-1.5a2.5 2.5 0 015 0z" />
                  </svg>
                </span> and select "Add to Home Screen"
              </p>
            ) : isAndroid ? (
              <p className="text-sm text-gray-600">
                Tap the menu icon and select "Add to Home Screen"
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                Add this app to your home screen for quick access.
              </p>
            )}
          </div>
          <button 
            onClick={() => setShowPrompt(false)}
            className="ml-4 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt; 