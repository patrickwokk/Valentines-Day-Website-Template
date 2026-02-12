import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

import memory1 from "@assets/replay_memories/1-memory.jpeg";
import memory2 from "@assets/replay_memories/2-memory.jpeg";
import memory3 from "@assets/replay_memories/3-memory.jpeg";
import memory4 from "@assets/replay_memories/4-memory.jpeg";
import memory5 from "@assets/replay_memories/5-memory.JPG";
import memory6 from "@assets/replay_memories/6-memory.jpeg";
import memory7 from "@assets/replay_memories/7-memory.jpeg";
import memory8 from "@assets/replay_memories/8-memory.jpeg";
import memory9 from "@assets/replay_memories/9-memory.JPG";
import memory10 from "@assets/replay_memories/10-memory.JPG";
import memory11 from "@assets/replay_memories/11-memory.JPG";
import memory12 from "@assets/replay_memories/12-memory.jpeg";
import memory13 from "@assets/replay_memories/13-memory.jpeg";
import memory14 from "@assets/replay_memories/14-memory.jpeg";
import memory15 from "@assets/replay_memories/15-memory.jpeg";
import memory16 from "@assets/replay_memories/16-memory.jpeg";
import memory17 from "@assets/replay_memories/17-memory.jpeg";
import memory18 from "@assets/replay_memories/18-memory.jpeg";
import memory19 from "@assets/replay_memories/19-memory.jpeg";
import memory20 from "@assets/replay_memories/20-memory.jpeg";
import memory21 from "@assets/replay_memories/21-memory.JPG";
import memory22 from "@assets/replay_memories/22-memory.JPG";
import memory23 from "@assets/replay_memories/23-memory.JPG";
import memory24 from "@assets/replay_memories/24-memory.JPG";
import memory25 from "@assets/replay_memories/25-memory.jpeg";
import memory26 from "@assets/replay_memories/26-memory.jpeg";
import memory27 from "@assets/replay_memories/27-memory.jpeg";
import memory28 from "@assets/replay_memories/28-memory.jpeg";
import memory29 from "@assets/replay_memories/29-memory.jpeg";
import memory30 from "@assets/replay_memories/30-memory.jpeg";
import memory31 from "@assets/replay_memories/31-memory.jpeg";
import memory32 from "@assets/replay_memories/32-memory.jpeg";
import memory33 from "@assets/replay_memories/33-memory.jpeg";
import memory34 from "@assets/replay_memories/34-memory.JPG";
import memory35 from "@assets/replay_memories/35-memory.JPG";
import memory36 from "@assets/replay_memories/36-memory.JPG";

type Frame = {
  src: string;
  rotate: number;
};

const MEMORY_IMAGES = [
  memory1, memory2, memory3, memory4, memory5, memory6, memory7, memory8, memory9,
  memory10, memory11, memory12, memory13, memory14, memory15, memory16, memory17, memory18,
  memory19, memory20, memory21, memory22, memory23, memory24, memory25, memory26, memory27,
  memory28, memory29, memory30, memory31, memory32, memory33, memory34, memory35, memory36,
];

const ROTATIONS = [-7, 5, -5, 6, -4, 5, -8, 4, -3, 7, -6, 4];

const STORY_FRAMES: Frame[] = MEMORY_IMAGES.map((src, index) => ({
  src,
  rotate: ROTATIONS[index % ROTATIONS.length],
}));

export default function ReplayStoryPage() {
  const [, setLocation] = useLocation();
  const pageRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [maxTranslate, setMaxTranslate] = useState(0);

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

      <div className="fixed inset-0 flex h-screen flex-col justify-center px-6 pb-8 pt-20 md:px-10 md:pb-12">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-stone-500">Replay Our Story</p>
          <h1 className="text-5xl font-semibold tracking-tight text-stone-900 md:text-7xl">From Our Beginning</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-stone-600 md:text-xl">
            Scroll down and our polaroids move to the right like a carousel.
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
          are you ready to make more memories with me?
        </motion.p>
      </div>
    </main>
  );
}
