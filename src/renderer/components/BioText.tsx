import React from 'react';

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
  // Split the description by name (case-insensitive)
  const parts = description.split(new RegExp(`(${name})`, 'gi'));

  return (
    <div
      className={`bio-text ${position ? `bio-${position}` : ''}`}
      style={style}
    >
      <strong>{name}</strong> —{' '}
      {parts.map((part, index) =>
        part.toLowerCase() === name.toLowerCase() ? (
          // eslint-disable-next-line react/no-array-index-key
          <strong key={index}>{part}</strong>
        ) : (
          // eslint-disable-next-line react/no-array-index-key
          <span key={index}>{part}</span>
        ),
      )}
    </div>
  );
}
