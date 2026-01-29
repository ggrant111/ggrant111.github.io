import { useState, useEffect } from 'react';
import styled from 'styled-components';

// Apple-style styled components
const InstallContainer = styled.div`
  margin: 20px 0;
  background-color: #f2f2f7;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  
  @media (prefers-color-scheme: dark) {
    background-color: #2c2c2e;
  }
`;

const InstallButton = styled.button`
  background-color: #0071e3;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #0077ed;
  }
  
  &:active {
    background-color: #0068d1;
  }
`;

const InfoText = styled.p`
  margin-top: 12px;
  font-size: 14px;
  color: #86868b;
`;

interface InstallPromptProps {
  className?: string;
}

const InstallPrompt = ({ className }: InstallPromptProps) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Check if app is already in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(isStandalone);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Store the event so it can be triggered later
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We no longer need the prompt regardless of outcome
    setDeferredPrompt(null);
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
  };

  // Don't show if already installed or not installable
  if (isInstalled || !isInstallable) return null;

  return (
    <InstallContainer className={className}>
      <InstallButton onClick={handleInstallClick}>
        Install PunnyPop
      </InstallButton>
      <InfoText>
        Install this app on your device for the best experience
      </InfoText>
    </InstallContainer>
  );
};

export default InstallPrompt; 