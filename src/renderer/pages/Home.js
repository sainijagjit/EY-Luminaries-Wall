import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import icon from '../../../assets/icon.png';

function Home() {
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <motion.img
        src={icon}
        alt="Icon"
        style={{
          height: '10vw',
          width: '10vw',
          cursor: 'pointer',
          position: 'absolute',
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
                top: '2rem',
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
        onAnimationComplete={() => {
          if (clicked) navigate('/dashboard');
        }}
      />
    </div>
  );
}

export default Home;
