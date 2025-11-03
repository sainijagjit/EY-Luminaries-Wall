type BioTextProps = {
  name: string;
  description: string;
};

export default function BioText({ name, description }: BioTextProps) {
  const pos = description.indexOf(name);
  if (pos >= 0) {
    return (
      <div className="bio-text">
        {description.slice(0, pos)}
        <strong>{name}</strong>
        {description.slice(pos + name.length)}
      </div>
    );
  }
  return <div className="bio-text">{description}</div>;
}
