import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import FigureGroup, { NormalizedFigure } from './FigureGroup';

type FiguresRowProps = {
  figures: NormalizedFigure[];
  selectedIndex: number | null;
  hoveredIndex: number | null;
  onHover: (index: number | null) => void;
  onClickFigure: (index: number) => void;
  visibleSections: {
    left: boolean;
    middle: boolean;
    right: boolean;
  };
};

export default function FiguresRow({
  figures,
  selectedIndex,
  hoveredIndex,
  onHover,
  onClickFigure,
  visibleSections,
}: FiguresRowProps) {
  const baseMetrics = useMemo(() => {
    const totalWidth = figures.reduce((sum, f) => sum + f.width, 0);
    const maxHeight = figures.reduce((m, f) => Math.max(m, f.height), 0);
    return { totalWidth, maxHeight };
  }, [figures]);

  const scaleWrapperRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const recalc = () => {
      const wrapper = scaleWrapperRef.current;
      if (!wrapper) return;
      const availableWidth = wrapper.clientWidth;
      const availableHeight = wrapper.clientHeight;
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
    <div
      className="figures-scale-wrapper"
      ref={scaleWrapperRef}
      style={{ transform: `scale(${scale})` }}
    >
      <div className="figures-container">
        <div
          className={`figure-section left ${visibleSections.left ? 'visible' : 'hidden'}`}
        >
          <FigureGroup
            figures={figures.slice(0, 3)}
            offset={0}
            selectedIndex={selectedIndex}
            hoveredIndex={hoveredIndex}
            onHover={onHover}
            onClickFigure={onClickFigure}
            groupClassName="group-1"
          />
        </div>
        <div
          className={`figure-section middle ${visibleSections.middle ? 'visible' : 'hidden'}`}
        >
          <FigureGroup
            figures={figures.slice(3, 6)}
            offset={3}
            selectedIndex={selectedIndex}
            hoveredIndex={hoveredIndex}
            onHover={onHover}
            onClickFigure={onClickFigure}
            groupClassName="group-2"
          />
        </div>
        <div
          className={`figure-section right ${visibleSections.right ? 'visible' : 'hidden'}`}
        >
          <FigureGroup
            figures={figures.slice(6, 9)}
            offset={6}
            selectedIndex={selectedIndex}
            hoveredIndex={hoveredIndex}
            onHover={onHover}
            onClickFigure={onClickFigure}
            groupClassName="group-3"
          />
        </div>
      </div>
    </div>
  );
}
