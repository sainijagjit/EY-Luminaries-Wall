import albertEinsteinVideo from '../../../assets/figures/wenM/Albert Einstein_anim.webm';
import alexanderHamiltonVideo from '../../../assets/figures/wenM/Alexander Hamilton_anim.webm';
import alwinErnstVideo from '../../../assets/figures/wenM/Alwin C Ernst_anim.webm';
import arthurYoungVideo from '../../../assets/figures/wenM/Arthur Young_anim.webm';
import jenniferDoudnaVideo from '../../../assets/figures/wenM/Jennifer Doudna_anim.webm';
import jensenHuangVideo from '../../../assets/figures/wenM/Jensen Huang_anim.webm';
import marieCurieVideo from '../../../assets/figures/wenM/Marie Curie_anim.webm';
import satyaNadellaVideo from '../../../assets/figures/wenM/Satya Nadella_anim.webm';
import thomasEdisonVideo from '../../../assets/figures/wenM/Thomas Edison_anim.webm';
import particlesVideo from '../../../assets/Particles_loop.mp4';
import backgroundMusic from '../../../assets/Satie-Trois Gymnopedies.mp3';

export const ASSETS_BASE_URL = '';

export const VIDEO_MAP = {
  'Alwin C Ernst_anim.webm': alwinErnstVideo,
  'Satya Nadella_anim.webm': satyaNadellaVideo,
  'Arthur Young_anim.webm': arthurYoungVideo,
  'Marie Curie_anim.webm': marieCurieVideo,
  'Albert Einstein_anim.webm': albertEinsteinVideo,
  'Thomas Edison_anim.webm': thomasEdisonVideo,
  'Alexander Hamilton_anim.webm': alexanderHamiltonVideo,
  'Jensen Huang_anim.webm': jensenHuangVideo,
  'Jennifer Doudna_anim.webm': jenniferDoudnaVideo,
};

export const BACKGROUND_VIDEO_MAP = {
  'Particles_loop.mp4': particlesVideo,
};

export const BACKGROUND_SOUND_MAP = {
  'Satie-Trois Gymnopedies.mp3': backgroundMusic,
};

export const getVideoSrc = (videoKey) => {
  if (ASSETS_BASE_URL) return `${ASSETS_BASE_URL}/${videoKey}`;
  return VIDEO_MAP[videoKey];
};

export const getAssetSrc = (assetName, assetMap, fallback) => {
  if (ASSETS_BASE_URL) return `${ASSETS_BASE_URL}/${assetName}`;
  return assetMap[assetName] || fallback;
};

