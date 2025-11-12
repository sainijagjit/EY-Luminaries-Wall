import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ANIMATION_INTERVAL,
  generateRandomIndices,
  getCharacterZIndex,
  getCharacterGroups,
  GROUP_ANIMATION_DELAYS,
} from '../utils/dashboardUtils';

import alwinErnst from '../../../assets/figures/static_pngs/Alwin C Ernst.png';
import satyaNadella from '../../../assets/figures/static_pngs/Satya Nadella.png';
import arthurYoung from '../../../assets/figures/static_pngs/Arthur Young.png';
import marieCurie from '../../../assets/figures/static_pngs/Marie Curie.png';
import albertEinstein from '../../../assets/figures/static_pngs/Albert Einstein.png';
import thomasEdison from '../../../assets/figures/static_pngs/Thomas Edison.png';
import alexanderHamilton from '../../../assets/figures/static_pngs/Alexander Hamilton.png';
import jensenHuang from '../../../assets/figures/static_pngs/Jensen Huang.png';
import jenniferDoudna from '../../../assets/figures/static_pngs/Jennifer Doudna.png';

import alwinErnstVideo from '../../../assets/figures/wenM/Alwin C Ernst_anim.webm';
import satyaNadellaVideo from '../../../assets/figures/wenM/Satya Nadella_anim.webm';
import arthurYoungVideo from '../../../assets/figures/wenM/Arthur Young_anim.webm';
import marieCurieVideo from '../../../assets/figures/wenM/Marie Curie_anim.webm';
import albertEinsteinVideo from '../../../assets/figures/wenM/Albert Einstein_anim.webm';
import thomasEdisonVideo from '../../../assets/figures/wenM/Thomas Edison_anim.webm';
import alexanderHamiltonVideo from '../../../assets/figures/wenM/Alexander Hamilton_anim.webm';
import jensenHuangVideo from '../../../assets/figures/wenM/Jensen Huang_anim.webm';
import jenniferDoudnaVideo from '../../../assets/figures/wenM/Jennifer Doudna_anim.webm';

const IMAGE_MAP = {
  'Alwin C Ernst.png': alwinErnst,
  'Satya Nadella.png': satyaNadella,
  'Arthur Young.png': arthurYoung,
  'Marie Curie.png': marieCurie,
  'Albert Einstein.png': albertEinstein,
  'Thomas Edison.png': thomasEdison,
  'Alexander Hamilton.png': alexanderHamilton,
  'Jensen Huang.png': jensenHuang,
  'Jennifer Doudna.png': jenniferDoudna,
};

const VIDEO_MAP = {
  'Alwin C Ernst_anim.webm': alwinErnstVideo,
  'Satya Nadella_anim.webm': satyaNadellaVideo,
  'Arthur Young_anim.webm': arthurYoungVideo,
  'Marie Curie_anim.webm': marieCurieVideo,
  'Albert Einstein_anim.webm': albertEinsteinVideo,
  'Thomas Edison_anim.webm': thomasEdisonVideo,
  'Alexander Hamilton_anim.webm': alexanderHamiltonVideo,
  'Jensen Huang_anim.webm': jensenHuangVideo,
  'Jennifer Doudna_anim.webm': jenniferDoudnaVideo,
};

export default function Dashboard({ logoAnimationComplete }) {
  const characterGroups = getCharacterGroups();

  const [activeIndices, setActiveIndices] = useState(
    generateRandomIndices(characterGroups.length),
  );
  const [playingVideos, setPlayingVideos] = useState({
    0: null,
    1: null,
    2: null,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndices(generateRandomIndices(characterGroups.length));
    }, ANIMATION_INTERVAL);

    return () => clearInterval(interval);
  }, [characterGroups.length]);

  const handleCharacterClick = (characterId, groupIndex) => {
    setPlayingVideos((prev) => ({
      ...prev,
      [groupIndex]: prev[groupIndex] === characterId ? null : characterId,
    }));
  };

  const renderCharacterImage = (character, index, groupIndex) => {
    const isActive = activeIndices[groupIndex] === index;
    const imageSrc = IMAGE_MAP[character.staticImage];
    const videoSrc = VIDEO_MAP[character.video];
    const isPlayingVideo = playingVideos[groupIndex] === character.id;

    return (
      <div
        key={character.id}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginLeft: index > 0 ? '-17.5%' : '0',
          zIndex: getCharacterZIndex(index),
          position: 'relative',
        }}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <motion.img
            src={imageSrc}
            alt={character.name}
            onClick={() => handleCharacterClick(character.id, groupIndex)}
            animate={{
              opacity: isPlayingVideo ? 0 : 1,
              filter: isActive ? 'grayscale(0%)' : 'grayscale(100%)',
            }}
            transition={{
              opacity: { duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96] },
              filter: { duration: 0.8, ease: 'easeInOut' },
            }}
            style={{
              maxHeight: 'min(415px, 38vh)',
              height: 'auto',
              width: 'auto',
              maxWidth: '100%',
              objectFit: 'contain',
              display: 'block',
              cursor: 'pointer',
            }}
          />
          <AnimatePresence>
            {isPlayingVideo && (
              <motion.video
                key={`video-${character.id}`}
                src={videoSrc}
                autoPlay
                loop
                muted
                onClick={() => handleCharacterClick(character.id, groupIndex)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.5,
                  ease: [0.43, 0.13, 0.23, 0.96],
                }}
                style={{
                  maxHeight: 'min(415px, 38vh)',
                  height: 'auto',
                  width: 'auto',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  const renderCharacterGroup = (group, groupIndex, animationDelay) => {
    const playingCharacterId = playingVideos[groupIndex];
    const playingCharacter = group.find(
      (char) => char.id === playingCharacterId,
    );

    return (
      <motion.div
        key={groupIndex}
        initial={{ opacity: 0, y: 150 }}
        animate={
          logoAnimationComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 150 }
        }
        transition={{
          duration: 1.2,
          delay: animationDelay,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flex: 1,
          position: 'relative',
        }}
      >
        <AnimatePresence mode="wait">
          {playingCharacter && (
            <motion.div
              key={playingCharacter.id}
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.34, 1.56, 0.64, 1],
                exit: { duration: 0.3 },
              }}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: '1.5rem',
                borderRadius: '12px',
                marginBottom: '2rem',
                maxWidth: '767px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                backdropFilter: 'blur(10px)',
                transformOrigin: 'top left',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  color: '#555',
                  textAlign: 'left',
                }}
              >
                <strong style={{ color: '#2e2e2e' }}>
                  {playingCharacter.name}
                </strong>{' '}
                — {playingCharacter.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            borderRadius: '8px',
            justifyContent: 'center',
          }}
        >
          {group.map((character, index) =>
            renderCharacterImage(character, index, groupIndex),
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: logoAnimationComplete ? 1 : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{
        height: '100vh',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          flexDirection: 'row',
          gap: '1.5vw',
          paddingInline: '2vw',
          justifyContent: 'space-evenly',
          alignItems: 'flex-end',
        }}
      >
        {characterGroups.map((group, groupIndex) =>
          renderCharacterGroup(
            group,
            groupIndex,
            GROUP_ANIMATION_DELAYS[groupIndex],
          ),
        )}
      </div>
    </motion.div>
  );
}
