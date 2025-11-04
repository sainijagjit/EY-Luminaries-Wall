import Figure from './Figure';

export type NormalizedFigure = {
  id: number;
  image: string;
  width: number;
  height: number;
  name: string;
  description: string;
};

type FigureGroupProps = {
  figures: NormalizedFigure[];
  offset: number;
  selectedIndex: number | null;
  hoveredIndex: number | null;
  onHover: (index: number | null) => void;
  onClickFigure: (index: number) => void;
  groupClassName: string;
};

export default function FigureGroup({
  figures,
  offset,
  selectedIndex,
  hoveredIndex,
  onHover,
  onClickFigure,
  groupClassName,
}: FigureGroupProps) {
  const activeIndex = hoveredIndex !== null ? hoveredIndex : selectedIndex;
  return (
    <div className={`figure-group ${groupClassName}`}>
      {figures.map((figure, index) => {
        const globalIndex = offset + index;
        const isHovered = hoveredIndex === globalIndex;
        const isSelected = selectedIndex === globalIndex;
        const isDimmed =
          !isSelected && activeIndex !== null && activeIndex !== globalIndex;
        return (
          <Figure
            key={globalIndex}
            id={globalIndex + 1}
            imagePath={figure.image}
            isSelected={isSelected}
            isHovered={isHovered}
            isDimmed={isDimmed}
            onClick={() => onClickFigure(globalIndex)}
            onMouseEnter={() => onHover(globalIndex)}
            onMouseLeave={() => onHover(null)}
            width={figure.width}
            height={figure.height}
            className={`figure-${globalIndex + 1}`}
          />
        );
      })}
    </div>
  );
}
