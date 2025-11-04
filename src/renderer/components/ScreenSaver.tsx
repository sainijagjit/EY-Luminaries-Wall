import './ScreenSaver.css';
// import screenSaverVideo from '../../../assets/ScreenSaver.mp4';
import particlesVideo from '../../../assets/Particles_loop.webm';

interface ScreenSaverProps {}

function ScreenSaver({}: ScreenSaverProps) {
  return (
    <div className="screen-saver">
      <video
        className="screen-saver-video"
        // src={screenSaverVideo}
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
    </div>
  );
}

export default ScreenSaver;
