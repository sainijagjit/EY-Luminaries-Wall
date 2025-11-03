import './Figure.css';

interface FigureProps {
  id: number;
  imagePath: string;
  isSelected: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  width: number;
  height: number;
  className?: string;
}

function Figure({
  id,
  imagePath,
  isSelected,
  isHovered,
  isDimmed,
  onClick,
  onMouseEnter,
  onMouseLeave,
  width,
  height,
  className,
}: FigureProps) {
  return (
    <div
      className={`figure-container ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''} ${isDimmed ? 'dimmed' : ''} ${className || ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      style={{ width: `${width}px`, height: `${height}px` }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <div className="figure-outline" />
      <img
        src={imagePath}
        alt={`Figure ${id}`}
        className={`figure-image ${isSelected || isHovered ? 'colored' : 'grayscale'}`}
        width={width}
        height={height}
      />
    </div>
  );
}

export default Figure;
