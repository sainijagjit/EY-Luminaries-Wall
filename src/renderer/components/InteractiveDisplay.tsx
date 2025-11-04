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
import bgMusic from '../../../assets/Satie-Trois Gymnopedies.mp3';
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
  const [selectedBySection, setSelectedBySection] = useState<{
    left: number | null;
    middle: number | null;
    right: number | null;
  }>({ left: null, middle: null, right: null });
  const [hoveredFigure, setHoveredFigure] = useState<number | null>(null);
  const [showFigures, setShowFigures] = useState(false);
  const [visibleSections, setVisibleSections] = useState({
    middle: false,
    left: false,
    right: false,
  });
  const [presenceDetected, setPresenceDetected] = useState(false);
  const [sectionAnchors, setSectionAnchors] = useState<{
    left: { x: number; yTop: number; height: number };
    middle: { x: number; yTop: number; height: number };
    right: { x: number; yTop: number; height: number };
  } | null>(null);
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
      setSelectedBySection({ left: null, middle: null, right: null });
      onReturnToScreenSaver();
    }, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    const detectPresence = () => {
      if (!presenceDetected) {
        setPresenceDetected(true);
        setShowFigures(true);

        setTimeout(() => {
          setVisibleSections((prev) => ({ ...prev, middle: true }));
        }, 300);

        setTimeout(() => {
          setVisibleSections((prev) => ({ ...prev, left: true }));
        }, 800);

        setTimeout(() => {
          setVisibleSections((prev) => ({ ...prev, right: true }));
        }, 1300);
      }
    };

    const handleActivity = () => {
      detectPresence();
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
  }, [onReturnToScreenSaver, presenceDetected]);

  const handleFigureClick = (index: number) => {
    const section = index < 3 ? 'left' : index < 6 ? 'middle' : 'right';
    setSelectedBySection((prev) => ({
      ...prev,
      [section]:
        prev[section as 'left' | 'middle' | 'right'] === index ? null : index,
    }));
    resetInactivityTimer();
  };

  // scaling handled inside FiguresRow

  return (
    <div
      className={`interactive-display ${
        presenceDetected &&
        selectedBySection.left === null &&
        selectedBySection.middle === null &&
        selectedBySection.right === null
          ? 'guidance'
          : ''
      }`}
    >
      <BackgroundVideo src={particlesVideo} className="particles-background" />
      {/* <BackgroundAudio src={bgMusic} volume={0.08} /> */}
      <div
        className={`logo-container ${presenceDetected ? 'top-left' : 'centered'}`}
      >
        <Logo src={eyLogo} className="ey-logo" />
      </div>
      {selectedBySection.left !== null && sectionAnchors && (
        <BioText
          name={FIGURE_DATA[selectedBySection.left].name}
          description={FIGURE_DATA[selectedBySection.left].description}
          style={{
            left: sectionAnchors.left.x,
            top:
              sectionAnchors.left.yTop -
              Math.round(
                Math.max(120, Math.min(260, sectionAnchors.left.height * 0.4)),
              ),
            transform: 'translate(-50%, -100%)',
          }}
        />
      )}
      {selectedBySection.middle !== null && sectionAnchors && (
        <BioText
          name={FIGURE_DATA[selectedBySection.middle].name}
          description={FIGURE_DATA[selectedBySection.middle].description}
          style={{
            left: sectionAnchors.middle.x,
            top:
              sectionAnchors.middle.yTop -
              Math.round(
                Math.max(
                  110,
                  Math.min(240, sectionAnchors.middle.height * 0.35),
                ),
              ),
            transform: 'translate(-50%, -100%)',
          }}
        />
      )}
      {selectedBySection.right !== null && sectionAnchors && (
        <BioText
          name={FIGURE_DATA[selectedBySection.right].name}
          description={FIGURE_DATA[selectedBySection.right].description}
          style={{
            left: sectionAnchors.right.x,
            top:
              sectionAnchors.right.yTop -
              Math.round(
                Math.max(120, Math.min(260, sectionAnchors.right.height * 0.4)),
              ),
            transform: 'translate(-50%, -100%)',
          }}
        />
      )}
      {showFigures && (
        <div className="content-container">
          <FiguresRow
            figures={FIGURE_DATA}
            selectedSet={
              new Set(
                [
                  selectedBySection.left,
                  selectedBySection.middle,
                  selectedBySection.right,
                ].filter((v): v is number => v !== null),
              )
            }
            hoveredIndex={hoveredFigure}
            onHover={setHoveredFigure}
            onClickFigure={handleFigureClick}
            visibleSections={visibleSections}
            onSectionsLayout={setSectionAnchors}
          />
        </div>
      )}
    </div>
  );
}

export default InteractiveDisplay;
