import React, { useMemo } from 'react';

type BioTextProps = {
  name: string;
  description: string;
  // eslint-disable-next-line react/require-default-props
  position?: 'left' | 'middle' | 'right';
  // eslint-disable-next-line react/require-default-props
  style?: React.CSSProperties;
};

export default function BioText({
  name,
  description,
  position,
  style,
}: BioTextProps) {
  const parts = useMemo(
    () => description.split(new RegExp(`(${name})`, 'gi')),
    [description, name],
  );

  let tokenIndex = 0;

  return (
    <div
      className={`bio-text bio-animated ${position ? `bio-${position}` : ''}`}
      style={style}
    >
      <strong>{name}</strong> —{' '}
      {parts.map((part, index) => {
        if (part.toLowerCase() === name.toLowerCase()) {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <strong key={`name-${index}`}>{part}</strong>
          );
        }
        const tokens = part.split(/(\s+)/);
        return tokens.map((t, i) => {
          const isSpace = /^\s+$/.test(t);
          if (isSpace) {
            // eslint-disable-next-line react/no-array-index-key
            return <span key={`space-${index}-${i}`}>{t}</span>;
          }
          const delayMs = 30 * tokenIndex++;
          // eslint-disable-next-line react/no-array-index-key
          return (
            <span
              key={`tok-${index}-${i}`}
              className="bio-token"
              style={{ animationDelay: `${delayMs}ms` }}
            >
              {t}
            </span>
          );
        });
      })}
    </div>
  );
}
