import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

import memory1 from "@assets/replay_memories/template-1_1.jpg";
import memory2 from "@assets/replay_memories/template-1_2.jpg";
import memory3 from "@assets/replay_memories/template-1_3.jpg";
import memory4 from "@assets/replay_memories/template-1_4.jpg";
import memory5 from "@assets/replay_memories/template-1_5.jpg";
import memory6 from "@assets/replay_memories/template-6_1.jpg";
import memory7 from "@assets/replay_memories/template-6_2.jpg";
import memory8 from "@assets/replay_memories/template-6_3.jpg";
import memory9 from "@assets/replay_memories/template-6_4.jpg";
import memory10 from "@assets/replay_memories/template-6_5.jpg";
import memory11 from "@assets/replay_memories/template-11_1.jpg";
import memory12 from "@assets/replay_memories/template-11_2.jpg";
import memory13 from "@assets/replay_memories/template-11_3.jpg";
import memory14 from "@assets/replay_memories/template-11_4.jpg";
import memory15 from "@assets/replay_memories/template-11_5.jpg";
import memory16 from "@assets/replay_memories/template-16_1.jpg";
import memory17 from "@assets/replay_memories/template-16_2.jpg";
import memory18 from "@assets/replay_memories/template-16_3.jpg";
import memory19 from "@assets/replay_memories/template-16_4.jpg";
import memory20 from "@assets/replay_memories/template-16_5.jpg";
import memory21 from "@assets/replay_memories/template-21_1.jpg";
import memory22 from "@assets/replay_memories/template-21_2.jpg";
import memory23 from "@assets/replay_memories/template-21_3.jpg";
import memory24 from "@assets/replay_memories/template-21_4.jpg";
import memory25 from "@assets/replay_memories/template-21_5.jpg";
import memory26 from "@assets/replay_memories/template-26_1.jpg";
import memory27 from "@assets/replay_memories/template-26_2.jpg";
import memory28 from "@assets/replay_memories/template-26_3.jpg";
import memory29 from "@assets/replay_memories/template-26_4.jpg";
import memory30 from "@assets/replay_memories/template-26_5.jpg";
import memory31 from "@assets/replay_memories/template-31_1.jpg";
import memory32 from "@assets/replay_memories/template-31_2.jpg";
import memory33 from "@assets/replay_memories/template-31_3.jpg";
import memory34 from "@assets/replay_memories/template-31_4.jpg";
import memory35 from "@assets/replay_memories/template-31_5.jpg";
import memory36 from "@assets/replay_memories/template-36.jpg";

type Frame = {
  src: string;
  rotate: number;
};

type SpotifyEmbedController = {
  play: () => void;
  resume?: () => void;
  pause?: () => void;
  destroy?: () => void;
  addListener?: (eventName: string, callback: () => void) => void;
};

type SpotifyIFrameAPI = {
  createController: (
    element: HTMLElement,
    options: { uri: string; width?: number | string; height?: number | string },
    callback: (controller: SpotifyEmbedController) => void
  ) => void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIFrameAPI) => void;
    SpotifyIFrameAPIRef?: SpotifyIFrameAPI;
  }
}

const MEMORY_IMAGES = [
  memory1, memory2, memory3, memory4, memory5, memory6, memory7, memory8, memory9,
  memory10, memory11, memory12, memory13, memory14, memory15, memory16, memory17, memory18,
  memory19, memory20, memory21, memory22, memory23, memory24, memory25, memory26, memory27,
  memory28, memory29, memory30, memory31, memory32, memory33, memory34, memory35, memory36,
];

const ROTATIONS = [-7, 5, -5, 6, -4, 5, -8, 4, -3, 7, -6, 4];
const SPOTIFY_IFRAME_API_SRC = "https://open.spotify.com/embed/iframe-api/v1";
const GLUE_SONG_URI = "spotify:track:0tMMPZEt6Gyrl9FI8zSicm";

const STORY_FRAMES: Frame[] = MEMORY_IMAGES.map((src, index) => ({
  src,
  rotate: ROTATIONS[index % ROTATIONS.length],
}));

export default function ReplayStoryPage() {
  const [, setLocation] = useLocation();
  const pageRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const spotifyHostRef = useRef<HTMLDivElement | null>(null);
  const spotifyControllerRef = useRef<SpotifyEmbedController | null>(null);
  const spotifyStartedRef = useRef(false);
  const interactionPlayAttemptedRef = useRef(false);
  const [maxTranslate, setMaxTranslate] = useState(0);
  const [showTapHint, setShowTapHint] = useState(false);

  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end end"],
  });
  const trackX = useTransform(scrollYProgress, [0, 1], [0, -maxTranslate]);
  const endPromptOpacity = useTransform(scrollYProgress, [0.9, 0.98], [0, 1]);
  const endPromptY = useTransform(scrollYProgress, [0.9, 0.98], [14, 0]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let mounted = true;
    let autoplayHintTimeout: number | undefined;
    let removeInteractionListeners = () => {};

    const playNow = (fromInteraction = false) => {
      if (!spotifyControllerRef.current) return;
      if (spotifyStartedRef.current) return;
      if (fromInteraction && interactionPlayAttemptedRef.current) return;

      if (fromInteraction) interactionPlayAttemptedRef.current = true;
      spotifyControllerRef.current.play();
      spotifyControllerRef.current.resume?.();
      setShowTapHint(false);
    };

    const mountController = (api: SpotifyIFrameAPI) => {
      if (!spotifyHostRef.current || spotifyControllerRef.current || !mounted) return;

      api.createController(
        spotifyHostRef.current,
        {
          uri: GLUE_SONG_URI,
          width: "100%",
          height: 80,
        },
        (controller) => {
          if (!mounted) return;
          spotifyControllerRef.current = controller;
          controller.addListener?.("playback_started", () => {
            spotifyStartedRef.current = true;
            setShowTapHint(false);
            removeInteractionListeners();
          });

          // Best-effort autoplay on page enter.
          playNow();
          autoplayHintTimeout = window.setTimeout(() => setShowTapHint(true), 1400);
        }
      );
    };

    const onFirstInteraction = () => {
      playNow(true);
      removeInteractionListeners();
    };
    window.addEventListener("pointerdown", onFirstInteraction, { passive: true });
    window.addEventListener("touchstart", onFirstInteraction, { passive: true });
    window.addEventListener("wheel", onFirstInteraction, { passive: true });
    window.addEventListener("keydown", onFirstInteraction);
    removeInteractionListeners = () => {
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
      window.removeEventListener("wheel", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };

    if (window.SpotifyIFrameAPIRef) {
      mountController(window.SpotifyIFrameAPIRef);
    }

    const previousReady = window.onSpotifyIframeApiReady;
    window.onSpotifyIframeApiReady = (api: SpotifyIFrameAPI) => {
      window.SpotifyIFrameAPIRef = api;
      previousReady?.(api);
      mountController(api);
    };

    if (!document.querySelector(`script[src="${SPOTIFY_IFRAME_API_SRC}"]`)) {
      const script = document.createElement("script");
      script.src = SPOTIFY_IFRAME_API_SRC;
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      mounted = false;
      if (autoplayHintTimeout) window.clearTimeout(autoplayHintTimeout);
      removeInteractionListeners();
      spotifyControllerRef.current?.destroy?.();
      spotifyControllerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const update = () => {
      if (!trackRef.current) return;
      const totalWidth = trackRef.current.scrollWidth;
      const viewport = window.innerWidth;
      setMaxTranslate(Math.max(totalWidth - viewport, 0));
    };

    update();
    const resizeObserver = new ResizeObserver(update);
    if (trackRef.current) resizeObserver.observe(trackRef.current);
    window.addEventListener("resize", update);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <main ref={pageRef} className="relative h-[340vh] overflow-x-clip bg-[#eeece8] text-stone-800 font-romantic">
      <button
        onClick={() => setLocation("/")}
        className="fixed left-4 top-4 z-50 inline-flex items-center gap-2 rounded-full border border-stone-300/80 bg-white/85 px-4 py-2 text-xs uppercase tracking-[0.16em] text-stone-700 backdrop-blur hover:bg-white"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      <div className="fixed bottom-4 right-4 z-50 w-[250px] md:w-[320px]">
        <div
          ref={spotifyHostRef}
          className="h-20 w-full overflow-hidden rounded-xl border border-stone-300/40 shadow-lg"
          aria-label="Spotify player"
        />
        {showTapHint && (
          <p className="mt-1 text-center text-[10px] uppercase tracking-[0.14em] text-stone-500">
            Tap or scroll once to start music
          </p>
        )}
      </div>

      <div className="fixed inset-0 flex h-screen flex-col justify-center px-6 pb-8 pt-20 md:px-10 md:pb-12">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-stone-500">Replay Our Story</p>
          <h1 className="text-5xl font-semibold tracking-tight text-stone-900 md:text-7xl">Our Memories</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-stone-600 md:text-xl">
            Scroll down and the polaroids move to the right like a carousel.
          </p>
        </div>

        <div className="relative mt-10 overflow-visible">
          <motion.div
            ref={trackRef}
            style={{ x: trackX }}
            className="relative z-10 flex items-start gap-6 pl-[5vw] pr-[40vw] will-change-transform md:gap-8 md:pl-[6vw] md:pr-[28vw]"
          >
            {STORY_FRAMES.map((frame, index) => (
              <article
                key={index}
                className="w-[66vw] min-w-[260px] max-w-[330px] shrink-0 bg-[#fbf9f5] p-2 pb-6 shadow-[0_30px_46px_rgba(65,50,33,0.28)] md:w-[30vw]"
                style={{ transform: `rotate(${frame.rotate}deg)` }}
              >
                <img src={frame.src} alt={`Memory ${index + 1}`} className="h-[290px] w-full object-cover md:h-[340px]" />
                <div className="border-x border-b border-[#e8ded1] bg-[#fefcf7] px-3 pb-4 pt-3">
                  <p className="text-center text-[11px] uppercase tracking-[0.18em] text-stone-500">
                    {String(index + 1).padStart(2, "0")} / {String(STORY_FRAMES.length).padStart(2, "0")}
                  </p>
                </div>
              </article>
            ))}
          </motion.div>
        </div>

        <div className="mt-6 text-center text-xs uppercase tracking-[0.2em] text-stone-500">
          Keep scrolling down
        </div>
        <motion.p
          style={{ opacity: endPromptOpacity, y: endPromptY }}
          className="mt-3 text-center text-lg text-stone-700 md:text-xl"
        >
          Ready to make more memories together?
        </motion.p>
      </div>
    </main>
  );
}
