import characters from "../constants/characters.json";

export const ANIMATION_INTERVAL = 3000;
export const GROUP_SIZE = 3;

export const GROUP_ANIMATION_DELAYS = {
	0: 0.4,
	1: 0,
	2: 0.8,
};

export const getRandomIndex = () => Math.floor(Math.random() * GROUP_SIZE);

export const generateRandomIndices = (count) => {
	return Array.from({ length: count }, getRandomIndex);
};

export const getCharacterZIndex = (index, isPlayingVideo) => {
	if (index === 0 || isPlayingVideo) return 3;
	if (index === 0) return 1;
	return 2;
};

export const getCharacterGroups = () => {
	return [
		characters.slice(0, 3),
		characters.slice(3, 6),
		characters.slice(6, 9),
	];
};
