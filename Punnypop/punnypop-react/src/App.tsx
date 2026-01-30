import { useState, useEffect } from 'react'
import styled from 'styled-components'
import './App.css'
import InstallPrompt from './components/PWA/InstallPrompt'

// Apple-style styled components
const Container = styled.div`
  max-width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f7;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
`

const Header = styled.header`
  width: 100%;
  padding: 20px 0;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const Logo = styled.img`
  height: 40px;
  width: auto;
`

const MainContent = styled.main`
  width: 100%;
  max-width: 800px;
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Card = styled.div`
  background-color: white;
  border-radius: 12px;
  width: 100%;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  }
`

const Button = styled.button`
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
`

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #1d1d1f;
`

const Subtitle = styled.p`
  font-size: 18px;
  line-height: 1.5;
  color: #86868b;
  margin-bottom: 30px;
  text-align: center;
`

function App() {
  const [isInstalled, setIsInstalled] = useState(false)

  // Check if app is installed
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    setIsInstalled(isStandalone)
  }, [])

  return (
    <Container>
      <Header>
        <Logo src="/pwa-192x192.png" alt="PunnyPop Logo" />
      </Header>
      
      <MainContent>
        <Title>Welcome to PunnyPop</Title>
        <Subtitle>
          Your go-to application for pun-tastic fun!
        </Subtitle>
        
        <Card>
          <h2>Getting Started</h2>
          <p>PunnyPop is a progressive web app designed to work on any device.</p>
          {!isInstalled && <InstallPrompt />}
        </Card>
        
        <Card>
          <h2>Features</h2>
          <ul>
            <li>Works offline</li>
            <li>Fast loading experience</li>
            <li>Regular updates</li>
            <li>Cross-platform compatibility</li>
          </ul>
        </Card>
      </MainContent>
    </Container>
  )
}

export default App
