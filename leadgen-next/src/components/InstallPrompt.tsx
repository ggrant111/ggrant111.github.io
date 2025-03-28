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
 Tap the share icon
 <span className="inline-block w-5 h-5 align-middle ml-1">
   {/* Real iOS share icon */}
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
     <path d="M10 2a.75.75 0 01.75.75v8.19l2.72-2.72a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 111.06-1.06l2.72 2.72V2.75A.75.75 0 0110 2z" />
     <path d="M3.5 12.5a.75.75 0 01.75-.75h11.5a.75.75 0 010 1.5H4.25a.75.75 0 01-.75-.75z" />
   </svg>
 </span>{" "}
 and select &quot;Add to Home Screen&quot;
</p>

) : isAndroid ? (
  <p className="text-sm text-gray-600">
    Tap the menu icon and select &quot;Add to Home Screen&quot;
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