import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ANIMATION_INTERVAL,
  generateRandomIndices,
  getCharacterZIndex,
  getCharacterGroups,
} from './dashboardUtils';

import alwinErnst from '../../../assets/figures/static_pngs/Alwin C Ernst.png';
import satyaNadella from '../../../assets/figures/static_pngs/Satya Nadella.png';
import arthurYoung from '../../../assets/figures/static_pngs/Arthur Young.png';
import marieCurie from '../../../assets/figures/static_pngs/Marie Curie.png';
import albertEinstein from '../../../assets/figures/static_pngs/Albert Einstein.png';
import thomasEdison from '../../../assets/figures/static_pngs/Thomas Edison.png';
import alexanderHamilton from '../../../assets/figures/static_pngs/Alexander Hamilton.png';
import jensenHuang from '../../../assets/figures/static_pngs/Jensen Huang.png';
import jenniferDoudna from '../../../assets/figures/static_pngs/Jennifer Doudna.png';

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

export default function Dashboard() {
  const characterGroups = getCharacterGroups();
  const [activeIndices, setActiveIndices] = useState(
    generateRandomIndices(characterGroups.length),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndices(generateRandomIndices(characterGroups.length));
    }, ANIMATION_INTERVAL);

    return () => clearInterval(interval);
  }, [characterGroups.length]);

  const renderCharacterImage = (character, index, groupIndex) => {
    const isActive = activeIndices[groupIndex] === index;
    const imageSrc = IMAGE_MAP[character.staticImage];

    return (
      <div
        key={character.id}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginLeft: index > 0 ? '-110px' : '0',
          zIndex: getCharacterZIndex(index),
          position: 'relative',
        }}
      >
        <motion.img
          src={imageSrc}
          alt={character.name}
          animate={{
            filter: isActive ? 'grayscale(0%)' : 'grayscale(100%)',
          }}
          transition={{
            duration: 0.8,
            ease: 'easeInOut',
          }}
          style={{
            maxHeight: 'min(415px, 38vh)',
            height: 'auto',
            width: 'auto',
            maxWidth: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>
    );
  };

  const renderCharacterGroup = (group, groupIndex) => {
    return (
      <div
        key={groupIndex}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
          borderRadius: '8px',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        {group.map((character, index) =>
          renderCharacterImage(character, index, groupIndex),
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
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
          flexDirection: 'row',
          gap: '1.5vw',
          padding: '0 2vw',
          justifyContent: 'space-evenly',
          alignItems: 'flex-end',
        }}
      >
        {characterGroups.map(renderCharacterGroup)}
      </div>
    </motion.div>
  );
}
