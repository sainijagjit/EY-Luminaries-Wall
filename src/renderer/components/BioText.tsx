type BioTextProps = {
  name: string;
  description: string;
  position?: 'left' | 'middle' | 'right';
  style?: React.CSSProperties;
};

export default function BioText({
  name,
  description,
  position,
  style,
}: BioTextProps) {
  const pos = description.indexOf(name);
  if (pos >= 0) {
    return (
      <div
        className={`bio-text ${position ? `bio-${position}` : ''}`}
        style={style}
      >
        {description.slice(0, pos)}
        <strong>{name}</strong>
        {description.slice(pos + name.length)}
      </div>
    );
  }
  return (
    <div
      className={`bio-text ${position ? `bio-${position}` : ''}`}
      style={style}
    >
      {description}
    </div>
  );
}
