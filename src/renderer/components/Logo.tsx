type LogoProps = {
  src: string;
  className?: string;
};

export default function Logo({ src, className }: LogoProps) {
  return <img src={src} alt="EY Logo" className={className} />;
}
