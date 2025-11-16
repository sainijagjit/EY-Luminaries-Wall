import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import albertEinsteinVideo from "../../../assets/figures/wenM/Albert Einstein_anim.webm";
import alexanderHamiltonVideo from "../../../assets/figures/wenM/Alexander Hamilton_anim.webm";
import alwinErnstVideo from "../../../assets/figures/wenM/Alwin C Ernst_anim.webm";
import arthurYoungVideo from "../../../assets/figures/wenM/Arthur Young_anim.webm";
import jenniferDoudnaVideo from "../../../assets/figures/wenM/Jennifer Doudna_anim.webm";
import jensenHuangVideo from "../../../assets/figures/wenM/Jensen Huang_anim.webm";
import marieCurieVideo from "../../../assets/figures/wenM/Marie Curie_anim.webm";
import satyaNadellaVideo from "../../../assets/figures/wenM/Satya Nadella_anim.webm";
import thomasEdisonVideo from "../../../assets/figures/wenM/Thomas Edison_anim.webm";
import {
	ANIMATION_INTERVAL,
	GROUP_ANIMATION_DELAYS,
	generateRandomIndices,
	getCharacterGroups,
	getCharacterZIndex,
} from "../utils/dashboardUtils";

const VIDEO_MAP = {
	"Alwin C Ernst_anim.webm": alwinErnstVideo,
	"Satya Nadella_anim.webm": satyaNadellaVideo,
	"Arthur Young_anim.webm": arthurYoungVideo,
	"Marie Curie_anim.webm": marieCurieVideo,
	"Albert Einstein_anim.webm": albertEinsteinVideo,
	"Thomas Edison_anim.webm": thomasEdisonVideo,
	"Alexander Hamilton_anim.webm": alexanderHamiltonVideo,
	"Jensen Huang_anim.webm": jensenHuangVideo,
	"Jennifer Doudna_anim.webm": jenniferDoudnaVideo,
};

export default function Dashboard({ logoAnimationComplete }) {
	const characterGroups = getCharacterGroups();
	const videoRefs = useRef({});

	const [activeIndices, setActiveIndices] = useState(
		generateRandomIndices(characterGroups.length),
	);
	const [playingVideos, setPlayingVideos] = useState({
		0: null,
		1: null,
		2: null,
	});

	useEffect(() => {
		const interval = setInterval(() => {
			setActiveIndices(generateRandomIndices(characterGroups.length));
		}, ANIMATION_INTERVAL);

		return () => clearInterval(interval);
	}, [characterGroups.length]);

	const scaleDownAndStop = (characterId) => {
		const video = videoRefs.current[characterId];
		if (!video) return;
		setTimeout(
			() => {
				video.pause();
				video.currentTime = 0;
			},
			(video.duration - video.currentTime) * 1000,
		);
	};

	const handleCharacterClick = (characterId, groupIndex) => {
		const previousPlayingId = playingVideos[groupIndex];
		if (previousPlayingId) scaleDownAndStop(previousPlayingId);
		const video = videoRefs.current[characterId];
		if (!video) return;
		// If clicking the same character, stop it
		if (previousPlayingId === characterId)
			setPlayingVideos((prev) => ({
				...prev,
				[groupIndex]: null,
			}));
		else {
			if (previousPlayingId)
				setPlayingVideos((prev) => ({
					...prev,
					[groupIndex]: characterId,
				}));
			else {
				setPlayingVideos((prev) => ({
					...prev,
					[groupIndex]: characterId,
				}));
			}
			video.play();
		}
	};

	const renderCharacterImage = (character, index, groupIndex) => {
		const isActive = activeIndices[groupIndex] === index;
		const videoSrc = VIDEO_MAP[character.video];
		const isPlayingVideo = playingVideos[groupIndex] === character.id;

		return (
			<div
				key={character.id}
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					marginLeft: index > 0 ? "-10.5%" : "0",
					zIndex: getCharacterZIndex(index, isPlayingVideo),
					position: "relative",
				}}
			>
				<motion.video
					ref={(el) => {
						if (el) videoRefs.current[character.id] = el;
					}}
					src={videoSrc}
					muted
					loop
					onClick={() => handleCharacterClick(character.id, groupIndex)}
					animate={{
						scale: isPlayingVideo ? 1.38 : 1,
						y: isPlayingVideo ? "-15%" : "0%",
						filter:
							isActive && !isPlayingVideo ? "grayscale(0%)" : "grayscale(100%)",
					}}
					transition={{
						scale: {
							duration: 2,
							ease: [0.43, 0.13, 0.23, 0.96],
						},
						filter: {
							duration: 0.8,
							ease: "easeInOut",
						},
						y: {
							duration: 2,
							ease: [0.43, 0.13, 0.23, 0.96],
						},
					}}
					style={{
						maxHeight: "min(415px, 38vh)",
						height: "auto",
						width: "auto",
						maxWidth: "100%",
						objectFit: "contain",
						display: "block",
						cursor: "pointer",
					}}
				/>
			</div>
		);
	};

	const renderCharacterGroup = (group, groupIndex, animationDelay) => {
		const playingCharacterId = playingVideos[groupIndex];
		const playingCharacter = group.find(
			(char) => char.id === playingCharacterId,
		);

		return (
			<motion.div
				key={groupIndex}
				initial={{ opacity: 0 }}
				animate={logoAnimationComplete ? { opacity: 1 } : { opacity: 0 }}
				transition={{
					duration: 1.2,
					delay: animationDelay,
					ease: [0.25, 0.46, 0.45, 0.94],
				}}
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					flex: 1,
					position: "relative",
					height: "100%",
					gap: "10rem",
					justifyContent: "flex-end",
				}}
			>
				{playingCharacter && (
					<motion.div
						key={playingCharacter.id}
						initial={{ opacity: 0, rotate: 90, scale: 0 }}
						animate={{ opacity: 1, rotate: 0, scale: 1 }}
						exit={{ opacity: 0 }}
						transition={{
							duration: 1.5,
							ease: [0.34, 1.56, 0.64, 1],
							exit: { duration: 0.3 },
						}}
						style={{
							backgroundColor: "rgba(255, 255, 255, 0.95)",
							padding: "1.5rem",
							borderRadius: "12px",
							maxWidth: "767px",
							boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
							backdropFilter: "blur(10px)",
							transformOrigin: "top left",
						}}
					>
						<p
							style={{
								margin: 0,
								fontSize: "2rem",
								color: "#000000",
								textAlign: "left",
								fontFamily: "Inter",
								fontWeight: 400,
							}}
						>
							<strong
								style={{
									color: "#000000",
									fontFamily: "Inter",
									fontWeight: "bold",
								}}
							>
								{playingCharacter.name}
							</strong>{" "}
							— {playingCharacter.description}
						</p>
					</motion.div>
				)}

				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "space-evenly",
						borderRadius: "8px",
						justifyContent: "flex-end",
					}}
				>
					{group.map((character, index) =>
						renderCharacterImage(character, index, groupIndex),
					)}
				</div>
			</motion.div>
		);
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: logoAnimationComplete ? 1 : 0 }}
			transition={{ duration: 0.3, ease: "easeInOut" }}
			style={{
				height: "100vh",
				width: "100%",
				position: "relative",
				overflow: "hidden",
				display: "flex",
				alignItems: "flex-end",
			}}
		>
			<div
				style={{
					display: "flex",
					width: "100%",
					height: "100%",
					flexDirection: "row",
					gap: "1.5vw",
					paddingInline: "2vw",
					justifyContent: "space-evenly",
					alignItems: "flex-end",
				}}
			>
				{characterGroups.map((group, groupIndex) =>
					renderCharacterGroup(
						group,
						groupIndex,
						GROUP_ANIMATION_DELAYS[groupIndex],
					),
				)}
			</div>
		</motion.div>
	);
}
