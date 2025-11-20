import { useEffect, useRef } from "react";

const INACTIVITY_TIMEOUT = 60000;

export function useInactivityTimer(isActive, onInactive) {
	const inactivityTimerRef = useRef(null);
	const onInactiveRef = useRef(onInactive);

	useEffect(() => {
		onInactiveRef.current = onInactive;
	}, [onInactive]);

	useEffect(() => {
		if (!isActive) return;

		const resetTimer = () => {
			if (inactivityTimerRef.current) {
				clearTimeout(inactivityTimerRef.current);
			}
			inactivityTimerRef.current = setTimeout(() => {
				onInactiveRef.current();
			}, INACTIVITY_TIMEOUT + 15000);
		};

		resetTimer();

		const handleClick = () => {
			resetTimer();
		};

		window.addEventListener("click", handleClick);

		return () => {
			window.removeEventListener("click", handleClick);
			if (inactivityTimerRef.current) {
				clearTimeout(inactivityTimerRef.current);
			}
		};
	}, [isActive]);
}

export function useCaricatureInactivityTimer(onInactive) {
	const inactivityTimerRef = useRef(null);
	const onInactiveRef = useRef(onInactive);

	useEffect(() => {
		onInactiveRef.current = onInactive;
	}, [onInactive]);

	useEffect(() => {
		return () => {
			clearTimeout(inactivityTimerRef.current);
		};
	}, []);

	const resetTimer = () => {
		if (inactivityTimerRef.current) {
			clearTimeout(inactivityTimerRef.current);
		}
		inactivityTimerRef.current = setTimeout(() => {
			onInactiveRef.current();
		}, INACTIVITY_TIMEOUT);
	};

	return { resetTimer };
}
