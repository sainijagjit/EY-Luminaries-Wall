import { useState, useEffect, useMemo } from 'react';
import BackgroundVideo from './BackgroundVideo';
import BackgroundAudio from './BackgroundAudio';
import Logo from './Logo';
import BioText from './BioText';
import FiguresRow from './FiguresRow';
import './InteractiveDisplay.css';

import alwinErnst from '../../../assets/Alwin C Ernst.png';
import satyaNadella from '../../../assets/Satya Nadella.png';
import arthurYoung from '../../../assets/Arthur Young.png';
import marieCurie from '../../../assets/Marie Curie.png';
import albertEinstein from '../../../assets/Albert Einstein.png';
import thomasEdison from '../../../assets/Thomas Edison.png';
import alexanderHamilton from '../../../assets/Alexander Hamilton.png';
import jensenHuang from '../../../assets/Jensen Huang.png';
import jenniferDoudna from '../../../assets/Jennifer Doudna.png';
import particlesVideo from '../../../assets/Particles_loop.mp4';
import eyLogo from '../../../assets/EY_Logo 1.png';
import bgMusic from '../../../assets/Mozart-Piano-Concerto_BG-Track.mp3';
import characters from '../constants/characters.json';

const INACTIVITY_TIMEOUT = 5 * 60 * 1000;

const imageMap: Record<string, string> = {
  'Alwin C Ernst': alwinErnst,
  'Satya Nadella': satyaNadella,
  'Arthur Young': arthurYoung,
  'Marie Curie': marieCurie,
  'Albert Einstein': albertEinstein,
  'Thomas Edison': thomasEdison,
  'Alexander Hamilton': alexanderHamilton,
  'Jensen Huang': jensenHuang,
  'Jennifer Doudna': jenniferDoudna,
};

const MAX_FIGURE_HEIGHT = Math.max(...characters.map((c) => c.height));

const FIGURE_DATA = characters.map((c) => {
  const scale = c.height > 0 ? MAX_FIGURE_HEIGHT / c.height : 1;
  const normalizedWidth = Math.round(c.width * scale);
  return {
    id: c.id,
    image: imageMap[c.name],
    width: normalizedWidth,
    height: MAX_FIGURE_HEIGHT,
    name: c.name,
    description: c.description,
  };
});

const getSelectedBio = (index: number | null) => {
  if (index === null) return '';
  return FIGURE_DATA[index]?.description || '';
};

const renderBio = (index: number | null) => {
  if (index === null) return '';
  const data = FIGURE_DATA[index];
  if (!data) return '';
  const { description, name } = data;
  const pos = description.indexOf(name);
  if (pos >= 0) {
    return (
      <>
        {description.slice(0, pos)}
        <strong>{name}</strong>
        {description.slice(pos + name.length)}
      </>
    );
  }
  return description;
};

interface InteractiveDisplayProps {
  onReturnToScreenSaver: () => void;
}

function InteractiveDisplay({
  onReturnToScreenSaver,
}: InteractiveDisplayProps) {
  const [selectedFigure, setSelectedFigure] = useState<number | null>(0);
  const [hoveredFigure, setHoveredFigure] = useState<number | null>(null);
  let inactivityTimerRef: NodeJS.Timeout | null = null;

  const baseMetrics = useMemo(() => {
    const totalWidth = FIGURE_DATA.reduce((sum, f) => sum + f.width, 0);
    const maxHeight = FIGURE_DATA.reduce((m, f) => Math.max(m, f.height), 0);
    return { totalWidth, maxHeight };
  }, []);

  const resetInactivityTimer = () => {
    if (inactivityTimerRef) {
      clearTimeout(inactivityTimerRef);
    }

    inactivityTimerRef = setTimeout(() => {
      setSelectedFigure(null);
      onReturnToScreenSaver();
    }, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    resetInactivityTimer();

    const handleActivity = () => {
      resetInactivityTimer();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      if (inactivityTimerRef) {
        clearTimeout(inactivityTimerRef);
      }
    };
  }, [onReturnToScreenSaver]);

  const handleFigureClick = (index: number) => {
    setSelectedFigure(index === selectedFigure ? null : index);
    resetInactivityTimer();
  };

  // scaling handled inside FiguresRow

  return (
    <div className="interactive-display">
      <BackgroundVideo src={particlesVideo} className="particles-background" />
      <BackgroundAudio src={bgMusic} volume={0.08} />
      <div className="logo-container">
        <Logo src={eyLogo} className="ey-logo" />
      </div>
      {selectedFigure !== null && (
        <BioText
          name={FIGURE_DATA[selectedFigure].name}
          description={FIGURE_DATA[selectedFigure].description}
        />
      )}
      <div className="content-container">
        <FiguresRow
          figures={FIGURE_DATA}
          selectedIndex={selectedFigure}
          hoveredIndex={hoveredFigure}
          onHover={setHoveredFigure}
          onClickFigure={handleFigureClick}
        />
      </div>
    </div>
  );
}

export default InteractiveDisplay;
