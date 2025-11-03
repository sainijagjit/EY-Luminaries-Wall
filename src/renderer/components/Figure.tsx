import './Figure.css';

interface FigureProps {
  id: number;
  imagePath: string;
  isSelected: boolean;
  onClick: () => void;
  width: number;
  height: number;
  className?: string;
}

function Figure({
  id,
  imagePath,
  isSelected,
  onClick,
  width,
  height,
  className,
}: FigureProps) {
  return (
    <div
      className={`figure-container ${isSelected ? 'selected' : ''} ${className || ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      style={{ width: `${width}px`, height: `${height}px` }}
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
        className={`figure-image ${isSelected ? 'colored' : 'grayscale'}`}
        width={width}
        height={height}
      />
    </div>
  );
}

export default Figure;
