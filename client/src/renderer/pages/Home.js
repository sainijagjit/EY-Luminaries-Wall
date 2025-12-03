import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import icon from '../../../assets/icon.png';
import particlesVideo from '../../../assets/Particles_loop.mp4';
import backgroundMusic from '../../../assets/Satie-Trois Gymnopedies.mp3';
import { useInactivityTimer } from '../hooks/useInactivityTimer';
import {
  AUDIO_VOLUME,
  LOGO_ANIMATION_DURATION,
  LOGO_SCALE,
} from '../utils/homeUtils';
import {
  BACKGROUND_VIDEO_MAP,
  BACKGROUND_SOUND_MAP,
  getAssetSrc,
} from '../constants/assets';
import Dashboard from './Dashboard';

function Home() {
  const [clicked, setClicked] = useState(false);
  const [logoAnimationComplete, setLogoAnimationComplete] = useState(false);
  const [config, setConfig] = useState(null);

  const resetToHome = useCallback(() => {
    setClicked(false);
    setLogoAnimationComplete(false);
  }, []);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/config');
        if (!response.ok) return;
        const data = await response.json();
        setConfig(data);
      } catch {
        setConfig(null);
      }
    };

    loadConfig();
  }, []);

  const homeScreen = useMemo(() => {
    return (
      config?.screens?.find((screen) => screen.screen_name === 'home') || null
    );
  }, [config]);

  const backgroundAssets = useMemo(() => {
    if (!homeScreen?.visualizations?.[0]?.data_sets?.[0]?.data_set) {
      return {
        video: particlesVideo,
        sound: backgroundMusic,
      };
    }

    const dataSet = homeScreen.visualizations[0].data_sets[0].data_set;
    return {
      video: getAssetSrc(
        dataSet.background_video,
        BACKGROUND_VIDEO_MAP,
        particlesVideo,
      ),
      sound: getAssetSrc(
        dataSet.background_sound,
        BACKGROUND_SOUND_MAP,
        backgroundMusic,
      ),
    };
  }, [homeScreen]);

  useInactivityTimer(clicked, resetToHome);

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      >
        <source src={backgroundAssets.video} type="video/mp4" />
      </video>
      <audio
        src={backgroundAssets.sound}
        autoPlay
        loop
        preload="auto"
        onLoadedMetadata={(e) => {
          e.target.volume = AUDIO_VOLUME;
        }}
        style={{ display: 'none' }}
      />
      <motion.img
        src={icon}
        alt="Icon"
        style={{
          height: '6vw',
          width: '6vw',
          cursor: clicked ? 'default' : 'pointer',
          position: 'absolute',
          zIndex: 10,
        }}
        initial={{
          top: '50%',
          left: '50%',
          x: '-50%',
          y: '-50%',
        }}
        animate={
          clicked
            ? {
                top: '1rem',
                left: '1rem',
                x: 0,
                y: 0,
                scale: LOGO_SCALE,
                transition: {
                  duration: LOGO_ANIMATION_DURATION,
                  ease: 'easeInOut',
                  onComplete: () => setLogoAnimationComplete(true),
                },
              }
            : {}
        }
        onClick={() => {
          setClicked(true);
        }}
      />

      {clicked && config && (
        <Dashboard
          logoAnimationComplete={logoAnimationComplete}
          config={config}
        />
      )}
    </div>
  );
}

export default Home;
