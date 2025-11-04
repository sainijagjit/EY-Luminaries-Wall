import Figure from './Figure';
import React from 'react';

export type NormalizedFigure = {
  id: number;
  image: string;
  width: number;
  height: number;
  name: string;
  description: string;
  glowVideo?: string;
};

type FigureGroupProps = {
  figures: NormalizedFigure[];
  offset: number;
  selectedSet: Set<number>;
  hoveredIndex: number | null;
  onHover: (index: number | null) => void;
  onClickFigure: (index: number) => void;
  groupClassName: string;
  showGlowHint?: boolean;
};

const FigureGroup: React.FC<FigureGroupProps> = ({
  figures,
  offset,
  selectedSet,
  hoveredIndex,
  onHover,
  onClickFigure,
  groupClassName,
  showGlowHint,
}) => {
  const activeIndex = hoveredIndex !== null ? hoveredIndex : null;
  return (
    <div className={`figure-group ${groupClassName}`}>
      {figures.map((figure, index) => {
        const globalIndex = offset + index;
        const isHovered = hoveredIndex === globalIndex;
        const isSelected = selectedSet.has(globalIndex);
        const isDimmed =
          !isSelected && activeIndex !== null && activeIndex !== globalIndex;
        return (
          <Figure
            key={globalIndex}
            id={globalIndex + 1}
            imagePath={figure.image}
            glowVideoPath={figure.glowVideo}
            isSelected={isSelected}
            isHovered={isHovered}
            isDimmed={isDimmed}
            onClick={() => onClickFigure(globalIndex)}
            onMouseEnter={() => onHover(globalIndex)}
            onMouseLeave={() => onHover(null)}
            width={figure.width}
            height={figure.height}
            className={`figure-${globalIndex + 1}`}
            showGlowHint={!!showGlowHint}
          />
        );
      })}
    </div>
  );
};

export default FigureGroup;
