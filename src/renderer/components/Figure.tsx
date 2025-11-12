import './Figure.css';

interface FigureProps {
  id: number;
  imagePath: string;
  glowVideoPath?: string;
  isSelected: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  width: number;
  height: number;
  className?: string;
  showGlowHint?: boolean;
}

function Figure({
  id,
  imagePath,
  glowVideoPath,
  isSelected,
  isHovered,
  isDimmed,
  onClick,
  onMouseEnter,
  onMouseLeave,
  width,
  height,
  className,
  showGlowHint,
}: FigureProps) {
  return (
    <div
      className={`figure-container video-overlay-container ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''} ${isDimmed ? 'dimmed' : ''} ${className || ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        marginInline: '5px',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <div className="figure-outline" />
      {glowVideoPath && !isSelected ? (
        <video
          className="figure-glow-video overlay-video"
          src={glowVideoPath}
          autoPlay
          muted
          playsInline
          loop
          style={{
            opacity: 0.4,
            mixBlendMode: 'plus-lighter',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            backgroundColor: 'transparent',
          }}
        />
      ) : null}
      <img
        src={imagePath}
        alt={`Figure ${id}`}
        className={`figure-image ${isSelected ? 'colored' : 'grayscale'}`}
        width={width}
        height={height}
      />
    </div>
  );
}

export default Figure;
