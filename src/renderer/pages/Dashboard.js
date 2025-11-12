import React from 'react';
import { motion } from 'framer-motion';
import characters from '../constants/characters.json';

import alwinErnst from '../../../assets/figures/static_pngs/Alwin C Ernst.png';
import satyaNadella from '../../../assets/figures/static_pngs/Satya Nadella.png';
import arthurYoung from '../../../assets/figures/static_pngs/Arthur Young.png';
import marieCurie from '../../../assets/figures/static_pngs/Marie Curie.png';
import albertEinstein from '../../../assets/figures/static_pngs/Albert Einstein.png';
import thomasEdison from '../../../assets/figures/static_pngs/Thomas Edison.png';
import alexanderHamilton from '../../../assets/figures/static_pngs/Alexander Hamilton.png';
import jensenHuang from '../../../assets/figures/static_pngs/Jensen Huang.png';
import jenniferDoudna from '../../../assets/figures/static_pngs/Jennifer Doudna.png';

export default function Dashboard() {
  const imageMap = {
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

  const characterGroups = [
    characters.slice(0, 3),
    characters.slice(3, 6),
    characters.slice(6, 9),
  ];

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
        {characterGroups.map((group, groupIndex) => (
          <div
            key={groupIndex}
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '0.5vw',
              alignItems: 'flex-end',
              borderRadius: '8px',
              flex: 1,
            }}
          >
            {group.map((character) => (
              <div
                key={character.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                }}
              >
                <img
                  src={imageMap[character.staticImage]}
                  alt={character.name}
                  style={{
                    maxHeight: 'min(415px, 50vh)',
                    height: 'auto',
                    width: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
