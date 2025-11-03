type BackgroundVideoProps = {
  src: string;
  className?: string;
};

export default function BackgroundVideo({
  src,
  className,
}: BackgroundVideoProps) {
  return (
    <video className={className} src={src} autoPlay loop muted playsInline />
  );
}
