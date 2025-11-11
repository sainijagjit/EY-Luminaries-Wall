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
  const [canvasScale, setCanvasScale] = useState(1);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
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
  const [bioAnimTick, setBioAnimTick] = useState({
    left: 0,
    middle: 0,
    right: 0,
  });
  const [presenceDetected, setPresenceDetected] = useState(false);
  const [recentActivity, setRecentActivity] = useState(false);
  const [sectionAnchors, setSectionAnchors] = useState<{
    left: { x: number; yTop: number; height: number };
    middle: { x: number; yTop: number; height: number };
    right: { x: number; yTop: number; height: number };
  } | null>(null);
  const [layoutTick, setLayoutTick] = useState(0);
  const [bioAnchors, setBioAnchors] = useState<{
    left: { x: number; yTop: number; height: number } | null;
    middle: { x: number; yTop: number; height: number } | null;
    right: { x: number; yTop: number; height: number } | null;
  }>({ left: null, middle: null, right: null });
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
      // Return to start state: clear selections, hide figures, center logo
      setSelectedBySection({ left: null, middle: null, right: null });
      setShowFigures(false);
      setVisibleSections({ left: false, middle: false, right: false });
      setSectionAnchors(null);
      setPresenceDetected(false);
    }, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    const updateAnchors = () => {
      setBioAnchors({
        left:
          selectedBySection.left !== null
            ? measureFigureAnchor(selectedBySection.left)
            : null,
        middle:
          selectedBySection.middle !== null
            ? measureFigureAnchor(selectedBySection.middle)
            : null,
        right:
          selectedBySection.right !== null
            ? measureFigureAnchor(selectedBySection.right)
            : null,
      });
    };
    updateAnchors();
    const t = setTimeout(updateAnchors, 50);
    return () => clearTimeout(t);
  }, [selectedBySection, layoutTick, canvasScale]);

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
    const recalcScale = () => {
      const designWidth = 3840;
      const baseDesignHeight = 1200;
      const w = window.innerWidth;
      const h = window.innerHeight;
      // For smaller windows, virtually shrink the design height so content appears larger while still fitting
      const smallness = Math.max(0, Math.min(1, 1600 / Math.max(w, h) - 0.3));
      const virtualHeight = Math.max(
        900,
        Math.round(baseDesignHeight * (1 - 0.18 * smallness)),
      );
      const widthRatio = w / designWidth;
      const heightRatio = h / virtualHeight;
      const base = Math.min(widthRatio, heightRatio);
      const boost = 0.32;
      const desired = base * (1 + boost * (1 - Math.min(base, 1)));
      const finalScale = Math.min(desired, widthRatio, heightRatio, 1);
      setCanvasScale(
        finalScale > 0 && Number.isFinite(finalScale) ? finalScale : 1,
      );
      const scaledW = designWidth * finalScale;
      const scaledH = baseDesignHeight * finalScale;
      const offsetX = Math.max(0, Math.floor((w - scaledW) / 2));
      const offsetY = Math.max(0, Math.floor(h - scaledH)); // anchor to bottom
      setCanvasOffset({ x: offsetX, y: offsetY });
    };
    recalcScale();
    window.addEventListener('resize', recalcScale);
    return () => window.removeEventListener('resize', recalcScale);
  }, []);

  useEffect(() => {
    const onResize = () => setLayoutTick((v) => v + 1);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const measureFigureAnchor = (index: number | null) => {
    if (index === null) return null;
    const el = document.querySelector(
      `.figure-${index + 1}`,
    ) as HTMLElement | null;
    const canvas = document.querySelector(
      '.design-canvas',
    ) as HTMLElement | null;
    if (!el || !canvas) return null;
    const r = el.getBoundingClientRect();
    const cr = canvas.getBoundingClientRect();
    const scale = canvasScale || 1;
    return {
      x: (r.left + r.width / 2 - cr.left) / scale,
      yTop: (r.top - cr.top) / scale,
      height: r.height / scale,
    };
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

    window.addEventListener('mousedown', handleActivity);

    return () => {
      window.removeEventListener('mousedown', handleActivity);
      if (inactivityTimerRef.current) {
        // Do not clear inactivity timer on effect re-run; only on unmount
      }
      if (recentActivityTimerRef.current) {
        clearTimeout(recentActivityTimerRef.current);
      }
    };
  }, [onReturnToScreenSaver, presenceDetected, selectedBySection]);

  // Start the inactivity timer on mount
  useEffect(() => {
    resetInactivityTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When presence is detected, ensure timer is running
  useEffect(() => {
    if (presenceDetected) resetInactivityTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presenceDetected]);

  const handleFigureClick = (index: number) => {
    const section = index < 3 ? 'left' : index < 6 ? 'middle' : 'right';
    setSelectedBySection((prev) => {
      const key = section as 'left' | 'middle' | 'right';
      // Do not toggle off when tapping the same figure; keep it visible until another
      // figure in the same section is selected.
      if (prev[key] === index) return prev;
      return { ...prev, [key]: index };
    });
    setBioAnimTick((prev) => {
      const key = (index < 3 ? 'left' : index < 6 ? 'middle' : 'right') as
        | 'left'
        | 'middle'
        | 'right';
      return { ...prev, [key]: prev[key] + 1 };
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
      <div
        className={`logo-container ${presenceDetected ? 'top-left' : 'centered'}`}
      >
        <Logo src={eyLogo} className="ey-logo" />
      </div>
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
        className="design-canvas"
        style={{
          width: 3840,
          height: 1200,
          transform: `scale(${canvasScale})`,
          transformOrigin: 'top left',
          left: canvasOffset.x,
          top: canvasOffset.y,
        }}
      >
        <BackgroundAudio src={bgMusic} volume={isMuted ? 0 : 0.08} />

        {selectedBySection.left !== null && sectionAnchors && (
          <BioText
            key={`left-${selectedBySection.left}-${bioAnimTick.left}`}
            name={FIGURE_DATA[selectedBySection.left].name}
            description={FIGURE_DATA[selectedBySection.left].description}
            style={{
              left: sectionAnchors.left.x / (canvasScale || 1),
              top:
                sectionAnchors.left.yTop / (canvasScale || 1) -
                Math.round(
                  Math.max(
                    120,
                    Math.min(
                      260,
                      (sectionAnchors.left.height / (canvasScale || 1)) * 0.54,
                    ),
                  ),
                ),
              transform: 'translate(-50%, -100%)',
            }}
          />
        )}
        {selectedBySection.middle !== null && sectionAnchors && (
          <BioText
            key={`middle-${selectedBySection.middle}-${bioAnimTick.middle}`}
            name={FIGURE_DATA[selectedBySection.middle].name}
            description={FIGURE_DATA[selectedBySection.middle].description}
            style={{
              left: sectionAnchors.middle.x / (canvasScale || 1),
              top:
                sectionAnchors.middle.yTop / (canvasScale || 1) -
                Math.round(
                  Math.max(
                    120,
                    Math.min(
                      260,
                      (sectionAnchors.middle.height / (canvasScale || 1)) *
                        0.54,
                    ),
                  ),
                ),
              transform: 'translate(-50%, -100%)',
            }}
          />
        )}
        {selectedBySection.right !== null && sectionAnchors && (
          <BioText
            key={`right-${selectedBySection.right}-${bioAnimTick.right}`}
            name={FIGURE_DATA[selectedBySection.right].name}
            description={FIGURE_DATA[selectedBySection.right].description}
            style={{
              left: sectionAnchors.right.x / (canvasScale || 1),
              top:
                sectionAnchors.right.yTop / (canvasScale || 1) -
                Math.round(
                  Math.max(
                    120,
                    Math.min(
                      260,
                      (sectionAnchors.right.height / (canvasScale || 1)) * 0.54,
                    ),
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
    </div>
  );
}

export default InteractiveDisplay;
