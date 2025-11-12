import React from 'react';
import { motion } from 'framer-motion';
import particlesVideo from '../../../assets/Particles_loop.mp4';

export default function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      style={{
        height: '100%',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
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

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          width: '100%',
          paddingTop: 'calc(8vw + 4rem)',
          paddingLeft: '2rem',
          paddingRight: '2rem',
        }}
      >
        <div>Dashboard Content</div>
      </div>
    </motion.div>
  );
}
