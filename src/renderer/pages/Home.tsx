import { useState } from 'react';
import { ScreenSaver, InteractiveDisplay } from '../components';
import './Home.css';

function Home() {
  const [isScreenSaverActive, setIsScreenSaverActive] = useState(true);

  const handleStart = () => {
    setIsScreenSaverActive(false);
  };

  const handleReturnToScreenSaver = () => {
    setIsScreenSaverActive(true);
  };

  return (
    <div className="home-container">
      {isScreenSaverActive ? (
        <ScreenSaver onStart={handleStart} />
      ) : (
        <InteractiveDisplay onReturnToScreenSaver={handleReturnToScreenSaver} />
      )}
    </div>
  );
}

export default Home;
