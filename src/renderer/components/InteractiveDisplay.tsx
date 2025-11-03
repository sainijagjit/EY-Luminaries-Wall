import { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import Figure from './Figure';
import './InteractiveDisplay.css';

import figure1 from '../../../assets/1.png';
import figure2 from '../../../assets/2.png';
import figure3 from '../../../assets/3.png';
import figure4 from '../../../assets/4.png';
import figure5 from '../../../assets/5.png';
import figure6 from '../../../assets/6.png';
import figure7 from '../../../assets/7.png';
import figure8 from '../../../assets/8.png';
import figure9 from '../../../assets/9.png';
import particlesVideo from '../../../assets/Particles_loop.webm';
import eyLogo from '../../../assets/EY_Logo 1.png';
import characters from '../constants/characters.json';

const INACTIVITY_TIMEOUT = 5 * 60 * 1000;

const imageMap: Record<string, string> = {
  '1.png': figure1,
  '2.png': figure2,
  '3.png': figure3,
  '4.png': figure4,
  '5.png': figure5,
  '6.png': figure6,
  '7.png': figure7,
  '8.png': figure8,
  '9.png': figure9,
};

const FIGURE_DATA = characters.map((c) => ({
  id: c.id,
  image: imageMap[c.image],
  width: c.width,
  height: c.height,
  name: c.name,
  description: c.description,
}));

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
  const [selectedFigure, setSelectedFigure] = useState<number | null>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scaleWrapperRef = useRef<HTMLDivElement | null>(null);
  const figuresRowRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

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
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [onReturnToScreenSaver]);

  const handleFigureClick = (index: number) => {
    setSelectedFigure(index === selectedFigure ? null : index);
    resetInactivityTimer();
  };

  useLayoutEffect(() => {
    const recalc = () => {
      const wrapper = scaleWrapperRef.current;
      if (!wrapper) return;
      const availableWidth = wrapper.clientWidth;
      const availableHeight = wrapper.clientHeight;
      // Match CSS gap escalations on wider screens
      let gap = Math.max(16, Math.min(availableWidth * 0.04, 80));
      if (availableWidth >= 2200) {
        gap = Math.max(96, Math.min(availableWidth * 0.1, 260));
      } else if (availableWidth >= 1600) {
        gap = Math.max(64, Math.min(availableWidth * 0.08, 200));
      }
      const horizontalPadding = 24 * 2;
      const naturalWidth = baseMetrics.totalWidth + 2 * gap + horizontalPadding;
      const naturalHeight = baseMetrics.maxHeight;
      const s = Math.min(
        1,
        availableWidth / naturalWidth,
        availableHeight / naturalHeight,
      );
      setScale(s > 0 && Number.isFinite(s) ? s : 1);
    };
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [baseMetrics]);

  return (
    <div className="interactive-display">
      <video
        className="particles-background"
        src={particlesVideo}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="logo-container">
        <img src={eyLogo} alt="EY Logo" className="ey-logo" />
      </div>
      {selectedFigure !== null && (
        <div className="bio-text">{renderBio(selectedFigure)}</div>
      )}
      <div className="content-container">
        <div
          className="figures-scale-wrapper"
          ref={scaleWrapperRef}
          style={{ transform: `scale(${scale})` }}
        >
          <div className="figures-container" ref={figuresRowRef}>
            <div className="figure-group group-1">
              {FIGURE_DATA.slice(0, 3).map((figure, index) => (
                <Figure
                  key={index}
                  id={index + 1}
                  imagePath={figure.image}
                  isSelected={selectedFigure === index}
                  onClick={() => handleFigureClick(index)}
                  width={figure.width}
                  height={figure.height}
                  className={`figure-${index + 1}`}
                />
              ))}
            </div>
            <div className="figure-group group-2">
              {FIGURE_DATA.slice(3, 6).map((figure, index) => (
                <Figure
                  key={index + 3}
                  id={index + 4}
                  imagePath={figure.image}
                  isSelected={selectedFigure === index + 3}
                  onClick={() => handleFigureClick(index + 3)}
                  width={figure.width}
                  height={figure.height}
                  className={`figure-${index + 4}`}
                />
              ))}
            </div>
            <div className="figure-group group-3">
              {FIGURE_DATA.slice(6, 9).map((figure, index) => (
                <Figure
                  key={index + 6}
                  id={index + 7}
                  imagePath={figure.image}
                  isSelected={selectedFigure === index + 6}
                  onClick={() => handleFigureClick(index + 6)}
                  width={figure.width}
                  height={figure.height}
                  className={`figure-${index + 7}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InteractiveDisplay;
