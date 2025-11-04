import { useState, useEffect, useMemo, useRef } from 'react';
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

import alwinErnstGlow from '../../../assets/glowing-chars/AlwinCErnst.webm';
import satyaNadellaGlow from '../../../assets/glowing-chars/SatyaNadella.webm';
import arthurYoungGlow from '../../../assets/glowing-chars/ArthurYoung.webm';
import marieCurieGlow from '../../../assets/glowing-chars/MarieCurie.webm';
import albertEinsteinGlow from '../../../assets/glowing-chars/AlbertEinstein.webm';
import thomasEdisonGlow from '../../../assets/glowing-chars/ThomasEdison.webm';
import alexanderHamiltonGlow from '../../../assets/glowing-chars/AlexanderHamilton.webm';
import jensenHuangGlow from '../../../assets/glowing-chars/JensenHuang.webm';
import jenniferDoudnaGlow from '../../../assets/glowing-chars/JenniferDoudna.webm';

const INACTIVITY_TIMEOUT = 60 * 1000;
const GLOW_HINT_DURATION_MS = 3000;
const GLOW_HINT_COOLDOWN_MS = 8000;

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

const glowVideoMap: Record<string, string> = {
  'Alwin C Ernst': alwinErnstGlow,
  'Satya Nadella': satyaNadellaGlow,
  'Arthur Young': arthurYoungGlow,
  'Marie Curie': marieCurieGlow,
  'Albert Einstein': albertEinsteinGlow,
  'Thomas Edison': thomasEdisonGlow,
  'Alexander Hamilton': alexanderHamiltonGlow,
  'Jensen Huang': jensenHuangGlow,
  'Jennifer Doudna': jenniferDoudnaGlow,
};

const MAX_FIGURE_HEIGHT = Math.max(...characters.map((c) => c.height));

const FIGURE_DATA = characters.map((c) => {
  const scale = c.height > 0 ? MAX_FIGURE_HEIGHT / c.height : 1;
  const normalizedWidth = Math.round(c.width * scale);
  return {
    id: c.id,
    image: imageMap[c.name],
    glowVideo: glowVideoMap[c.name],
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
  const [isMuted, setIsMuted] = useState(false);
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
  const [recentActivity, setRecentActivity] = useState(false);
  const [sectionAnchors, setSectionAnchors] = useState<{
    left: { x: number; yTop: number; height: number };
    middle: { x: number; yTop: number; height: number };
    right: { x: number; yTop: number; height: number };
  } | null>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recentActivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastGlowHintAtRef = useRef<number>(0);

  const baseMetrics = useMemo(() => {
    const totalWidth = FIGURE_DATA.reduce((sum, f) => sum + f.width, 0);
    const maxHeight = FIGURE_DATA.reduce((m, f) => Math.max(m, f.height), 0);
    return { totalWidth, maxHeight };
  }, []);

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      setSelectedBySection({ left: null, middle: null, right: null });
      onReturnToScreenSaver();
    }, INACTIVITY_TIMEOUT);
  };

  const flagRecentActivity = () => {
    const now = Date.now();
    if (recentActivity) return;
    if (now - lastGlowHintAtRef.current < GLOW_HINT_COOLDOWN_MS) return;
    lastGlowHintAtRef.current = now;
    setRecentActivity(true);
    if (recentActivityTimerRef.current)
      clearTimeout(recentActivityTimerRef.current);
    recentActivityTimerRef.current = setTimeout(
      () => setRecentActivity(false),
      GLOW_HINT_DURATION_MS,
    );
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
      if (
        selectedBySection.left === null &&
        selectedBySection.middle === null &&
        selectedBySection.right === null
      ) {
        flagRecentActivity();
      }
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
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (recentActivityTimerRef.current) {
        clearTimeout(recentActivityTimerRef.current);
      }
    };
  }, [onReturnToScreenSaver, presenceDetected, selectedBySection]);

  const handleFigureClick = (index: number) => {
    const section = index < 3 ? 'left' : index < 6 ? 'middle' : 'right';
    setSelectedBySection((prev) => {
      const key = section as 'left' | 'middle' | 'right';
      // Do not toggle off when tapping the same figure; keep it visible until another
      // figure in the same section is selected.
      if (prev[key] === index) return prev;
      return { ...prev, [key]: index };
    });
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
          ? `guidance ${recentActivity ? 'recent-activity' : ''}`
          : ''
      }`}
    >
      <BackgroundVideo
        src={particlesVideo}
        className="particles-background background-video"
      />
      <BackgroundAudio src={bgMusic} volume={isMuted ? 0 : 0.08} />
      <div className="audio-hover-area" />
      <div className="audio-controls">
        <button
          type="button"
          className="mute-toggle"
          aria-label={
            isMuted ? 'Unmute background audio' : 'Mute background audio'
          }
          onClick={() => setIsMuted((v) => !v)}
        >
          {isMuted ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 10v4h4l5 5V5L7 10H3z" fill="white" />
              <path
                d="M16 9l6 6M22 9l-6 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 10v4h4l5 5V5L7 10H3z" fill="white" />
              <path
                d="M16.5 8.5a5 5 0 010 7"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M14.5 10.5a2.5 2.5 0 010 3"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>
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
                Math.max(120, Math.min(260, sectionAnchors.left.height * 0.54)),
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
                  Math.min(240, sectionAnchors.middle.height * 0.42),
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
                Math.max(
                  120,
                  Math.min(260, sectionAnchors.right.height * 0.54),
                ),
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
            showGlowHint={
              presenceDetected &&
              recentActivity &&
              selectedBySection.left === null &&
              selectedBySection.middle === null &&
              selectedBySection.right === null
            }
          />
        </div>
      )}
    </div>
  );
}

export default InteractiveDisplay;
