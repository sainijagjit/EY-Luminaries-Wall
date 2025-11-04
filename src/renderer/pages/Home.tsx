import { InteractiveDisplay } from '../components';
import './Home.css';

function Home() {
  const handleReturnToScreenSaver = () => {};

  return (
    <div className="home-container">
      <InteractiveDisplay onReturnToScreenSaver={handleReturnToScreenSaver} />
    </div>
  );
}

export default Home;
