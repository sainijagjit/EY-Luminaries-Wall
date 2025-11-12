import { motion } from 'framer-motion';
import { useState } from 'react';
import icon from '../../../assets/icon.png';
import Dashboard from './Dashboard';
import particlesVideo from '../../../assets/Particles_loop.mp4';

function Home() {
  const [clicked, setClicked] = useState(false);
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
        <source src={particlesVideo} type="video/mp4" />
      </video>
      <motion.img
        src={icon}
        alt="Icon"
        style={{
          height: '10vw',
          width: '10vw',
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
                left: '2rem',
                x: 0,
                y: 0,
                scale: 0.8,
                transition: {
                  duration: 1.2,
                  ease: 'easeInOut',
                },
              }
            : {}
        }
        onClick={() => {
          setClicked(true);
        }}
      />

      {clicked && <Dashboard />}
    </div>
  );
}

export default Home;
