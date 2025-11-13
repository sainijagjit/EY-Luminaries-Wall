import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import icon from "../../../assets/icon.png";
import particlesVideo from "../../../assets/Particles_loop.mp4";
import backgroundMusic from "../../../assets/Satie-Trois Gymnopedies.mp3";
import { useInactivityTimer } from "../hooks/useInactivityTimer";
import {
	AUDIO_VOLUME,
	LOGO_ANIMATION_DURATION,
	LOGO_SCALE,
} from "../utils/homeUtils";
import Dashboard from "./Dashboard";

function Home() {
	const [clicked, setClicked] = useState(false);
	const [logoAnimationComplete, setLogoAnimationComplete] = useState(false);

	const resetToHome = useCallback(() => {
		setClicked(false);
		setLogoAnimationComplete(false);
	}, []);

	useInactivityTimer(clicked, resetToHome);

	return (
		<div
			style={{
				height: "100vh",
				width: "100vw",
				overflow: "hidden",
				position: "relative",
			}}
		>
			<video
				autoPlay
				loop
				muted
				playsInline
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					objectFit: "cover",
					zIndex: 0,
				}}
			>
				<source src={particlesVideo} type="video/mp4" />
			</video>
			<audio
				src={backgroundMusic}
				autoPlay
				loop
				preload="auto"
				onLoadedMetadata={(e) => {
					e.target.volume = AUDIO_VOLUME;
				}}
				style={{ display: "none" }}
			/>
			<motion.img
				src={icon}
				alt="Icon"
				style={{
					height: "6vw",
					width: "6vw",
					cursor: clicked ? "default" : "pointer",
					position: "absolute",
					zIndex: 10,
				}}
				initial={{
					top: "50%",
					left: "50%",
					x: "-50%",
					y: "-50%",
				}}
				animate={
					clicked
						? {
								top: "1rem",
								left: "1rem",
								x: 0,
								y: 0,
								scale: LOGO_SCALE,
								transition: {
									duration: LOGO_ANIMATION_DURATION,
									ease: "easeInOut",
									onComplete: () => setLogoAnimationComplete(true),
								},
							}
						: {}
				}
				onClick={() => {
					setClicked(true);
				}}
			/>

			{clicked && <Dashboard logoAnimationComplete={logoAnimationComplete} />}
		</div>
	);
}

export default Home;
