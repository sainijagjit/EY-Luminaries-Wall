import './ScreenSaver.css';
import screenSaverVideo from '../../../assets/ScreenSaver.mp4';
import particlesVideo from '../../../assets/Particles_loop.webm';

interface ScreenSaverProps {
  onStart: () => void;
}

function ScreenSaver({ onStart }: ScreenSaverProps) {
  return (
    <div className="screen-saver">
      <video
        className="screen-saver-video"
        src={screenSaverVideo}
        autoPlay
        loop
        muted
        playsInline
      />
      <video
        className="particles-video"
        src={particlesVideo}
        autoPlay
        loop
        muted
        playsInline
      />
      <button type="button" className="touch-to-start" onClick={onStart}>
        Touch to Start
      </button>
    </div>
  );
}

export default ScreenSaver;
