import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Heart } from "lucide-react";
import { useLocation } from "wouter";

// Assets
import happyPuppy from "@assets/1-excited_1770876596574.gif";
import angryPuppy from "@assets/2-angry-dog_1770876596575.gif";
import beggingPuppy from "@assets/3-puppy-please_1770876596575.webp";

// Photo Assets
import photo1 from "@assets/template-photo-1.jpg";
import photo2 from "@assets/template-photo-2.jpg";
import photo3 from "@assets/template-photo-3.jpg";
import photo4 from "@assets/template-photo-4.jpg";
import photo5 from "@assets/template-photo-5.jpg";
import photo6 from "@assets/template-photo-6.jpg";
import photo7 from "@assets/template-photo-7.jpg";
import photo8 from "@assets/template-photo-8.jpg";
import photo9 from "@assets/template-photo-9.jpg";
import photo10 from "@assets/template-photo-10.jpg";
import photo11 from "@assets/template-photo-11.jpg";
import photo12 from "@assets/template-photo-12.jpg";
import photo13 from "@assets/template-photo-13.jpg";

// Floral Assets (Keeping for subtle background texture if needed, or removing if fully replaced)
import floralBg from "@assets/1c1e1934764a7859c7d06dd90ee9fd5e_1770876135345.jpg";

type GameState = "INITIAL" | "REJECT_1" | "REJECT_2" | "SUCCESS";

const GALLERY_PHOTOS = [
  // Background/Edges layer (Rendered first = Back)
  { src: photo7, rotate: -6, x: -42, y: -2, z: 0, scale: 0.9 }, // Moved to back (first)
  { src: photo8, rotate: 4, x: -38, y: -32, z: 1, scale: 0.9 }, // Moved to top left, safe from edge
  { src: photo9, rotate: -3, x: -18, y: 35, z: 0, scale: 0.9 },
  
  // Middle layer
  { src: photo3, rotate: -2, x: -38, y: 15, z: 1, scale: 1 },
  { src: photo4, rotate: 6, x: 38, y: 10, z: 1, scale: 1 },
  { src: photo6, rotate: 2, x: 10, y: 40, z: 1, scale: 1 },
  
  // New photos - Tucked in but visible
  // photo10 -> Moved a bit to the center from Top Right Corner
  { src: photo10, rotate: 5, x: 38, y: -42, z: 1, scale: 1 }, 
  { src: photo11, rotate: -4, x: -28, y: 50, z: 2, scale: 1.1 },
  { src: photo12, rotate: 2, x: 32, y: 45, z: 0, scale: 0.9 },
  // photo13 -> Moved between photo5 (-8, -25) and photo10 (45, -45)
  { src: photo13, rotate: -2, x: 18, y: -38, z: 1, scale: 1 }, 

  // Top layer (Rendered last = Front)
  { src: photo1, rotate: -5, x: -18, y: -5, z: 2, scale: 1.1 },
  { src: photo2, rotate: 3, x: 22, y: 0, z: 2, scale: 0.85 }, // Made smaller, moved towards center
  { src: photo5, rotate: -4, x: -8, y: -25, z: 2, scale: 1 }, // Moved to front
];

export default function ValentinePage() {
  const [gameState, setGameState] = useState<GameState>("INITIAL");
  const [yesScale, setYesScale] = useState(1);
  const [, setLocation] = useLocation();

  const handleNoClick = () => {
    if (gameState === "INITIAL") {
      setGameState("REJECT_1");
      setYesScale(1.3);
    } else if (gameState === "REJECT_1") {
      setGameState("REJECT_2");
      setYesScale(1.6);
    } else if (gameState === "REJECT_2") {
      // Even if they click "FINE", it leads to success (or we could force them to click Yes)
      // The prompt says "finally when she clicks "Yes" at any point..." implying FINE might not lead to success directly?
      // "options for 'Yes' or 'FINE', and finally when she clicks 'Yes' at any point..."
      // This implies clicking 'FINE' might effectively be a resignation to 'Yes' or just loop?
      // Let's make 'FINE' lead to success for better UX, or make 'Yes' HUGE.
      setGameState("SUCCESS");
    }
  };

  const handleYesClick = () => {
    setGameState("SUCCESS");
  };

  const handleReplay = () => {
    setLocation("/replay");
  };

  // Content configuration based on state
  const getContent = () => {
    switch (gameState) {
      case "INITIAL":
        return {
          image: happyPuppy,
          text: "Will you be my valentine? 😫🥺🤩",
          yesText: "Yes!",
          noText: "No",
          showNo: true
        };
      case "REJECT_1":
        return {
          image: angryPuppy,
          text: "I'll be angry at you! 😠",
          yesText: "Yes!",
          noText: "Still No",
          showNo: true
        };
      case "REJECT_2":
        return {
          image: beggingPuppy,
          text: "PLEASE im beggin you 😭",
          yesText: "Yes!",
          noText: "FINE",
          showNo: true
        };
      case "SUCCESS":
        return {
          image: photo1, // Use one of the photos as a placeholder if needed, though we don't use it in the new view
          text: "",
          yesText: "",
          noText: "",
          showNo: false
        };
    }
  };

  const content = getContent();

  if (gameState === "SUCCESS") {
    return (
      <SuccessView 
        onReplay={handleReplay} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-valentine-bg flex flex-col items-center justify-center p-4 overflow-hidden relative selection:bg-valentine-pink selection:text-white">
      {/* Floating background hearts */}
      <FloatingHearts />

      <motion.div 
        key={gameState}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="z-10 flex flex-col items-center text-center max-w-md w-full bg-white/60 backdrop-blur-md p-8 rounded-[2rem] shadow-xl border border-white/50"
      >
        <div className="relative w-64 h-64 mb-8 rounded-2xl overflow-hidden shadow-lg bg-white">
          <img 
            src={content.image} 
            alt="Puppy reaction" 
            className="w-full h-full object-cover"
            data-testid={`image-${gameState.toLowerCase()}`}
          />
        </div>

        <h1 
          className="text-4xl font-playful font-bold text-valentine-red mb-10 leading-snug"
          data-testid="text-question"
        >
          {content.text}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-4 w-full">
          {/* Yes Button */}
          <motion.button
            whileHover={{ scale: yesScale + 0.1 }}
            whileTap={{ scale: yesScale - 0.1 }}
            animate={{ scale: yesScale }}
            onClick={handleYesClick}
            className="bg-valentine-red text-white font-playful font-bold rounded-full shadow-lg hover:shadow-xl hover:bg-valentine-red/90 transition-colors z-20"
            style={{
              padding: `${12 * 1}px ${32 * 1}px`,
              fontSize: `${1.2 * 1}rem`,
            }}
            data-testid="button-yes"
          >
            {content.yesText}
          </motion.button>

          {/* No Button */}
          {content.showNo && (
            <button
              onClick={handleNoClick}
              className="bg-stone-300 text-stone-600 font-playful font-bold py-3 px-6 rounded-full text-lg shadow-sm hover:bg-stone-400 transition-colors z-10"
              data-testid="button-no"
            >
              {content.noText}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function SuccessView({ onReplay }: { onReplay: () => void }) {
  const { scrollYProgress } = useScroll();
  
  // Parallax up movement for photos
  const photoAnims = GALLERY_PHOTOS.map((photo, i) => {
    // Photos move UP at different speeds based on their "z-index" / layer
    // Closer items (z=2) move faster than further items (z=0)
    const baseSpeed = 800;
    const speed = baseSpeed + (photo.z * 400); 
    const yOutput = -1 * speed; // Move way up
    
    return {
      y: useTransform(scrollYProgress, [0, 0.45], [0, yOutput]),
      opacity: useTransform(scrollYProgress, [0, 0.4], [1, 0]), // Photos fade out earlier
    };
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const buttonOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);

  return (
    <div className="h-[250vh] relative bg-stone-50 overflow-x-hidden font-romantic">
      
      {/* Fixed Background Container for Photos */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full max-w-6xl mx-auto">
          {GALLERY_PHOTOS.map((photo, i) => (
            <motion.div
              key={i}
              style={{
                y: photoAnims[i].y,
                opacity: photoAnims[i].opacity,
                rotate: photo.rotate,
                scale: photo.scale,
                left: `${50 + photo.x}%`,
                top: `${50 + photo.y}%`, 
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: photo.scale }}
              transition={{ delay: i * 0.05, duration: 0.8, type: "spring" }}
              className="absolute w-40 md:w-56 bg-white p-2 pb-6 shadow-lg transform -translate-x-1/2 -translate-y-1/2"
            >
              <img 
                src={photo.src} 
                alt="Us" 
                className="w-full h-full object-cover filter sepia-[0.1]"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Header - Disappears on scroll */}
      <div className="fixed inset-0 pointer-events-none z-20 flex flex-col items-center justify-center p-6">
        <motion.div 
          style={{ opacity: headerOpacity }}
          className="absolute text-center top-[60%] bg-white/40 backdrop-blur-sm p-8 rounded-3xl border border-white/30 shadow-lg" 
        >
          <div className="flex items-baseline justify-center gap-3 mb-4 flex-wrap">
             <motion.span 
              animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1 }}
              className="text-6xl md:text-8xl font-bold text-stone-900 tracking-tighter inline-block"
            >
              Hooray!
            </motion.span>
             <span className="text-4xl md:text-6xl font-medium text-stone-900 tracking-tight">
               I knew you would !!
            </span>
          </div>
          
          <p className="text-xl md:text-2xl italic text-stone-600 font-light mt-4">
            scroll down please~
          </p>
        </motion.div>
      </div>

      {/* Envelope & Letter System */}
      <div className="fixed inset-0 pointer-events-none z-30 flex items-center justify-center">
        <EnvelopeLetter scrollYProgress={scrollYProgress} />
      </div>

      {/* Replay Button - Only active at end */}
      <motion.div style={{ opacity: buttonOpacity }} className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto z-50">
          <button
          onClick={onReplay}
          className="px-10 py-4 bg-stone-900 text-white font-sans text-xs tracking-[0.2em] uppercase hover:bg-stone-700 transition-colors shadow-lg rounded-sm"
        >
          Replay Our Story
        </button>
      </motion.div>

    </div>
  );
}

function EnvelopeLetter({ scrollYProgress }: { scrollYProgress: any }) {
  const envelopeEnterY = useTransform(scrollYProgress, [0.4, 0.5], [500, 0]);
  const envelopeOpacity = useTransform(scrollYProgress, [0.4, 0.45], [0, 1]);

  const flapRotate = useTransform(scrollYProgress, [0.55, 0.65], [0, -180]);

  // Rise out of the envelope, then settle slightly lower so it remains readable.
  const letterRiseY = useTransform(scrollYProgress, [0.65, 0.82], [0, -240]);
  const letterSettleY = useTransform(scrollYProgress, [0.82, 1.0], [0, 320]);
  const letterSlideY = useTransform(() => letterRiseY.get() + letterSettleY.get());
  const letterOpacity = useTransform(scrollYProgress, [0.65, 0.71], [0, 1]);

  const envelopeFadeY = useTransform(scrollYProgress, [0.78, 0.9], [0, 300]);
  const envelopeFadeOpacity = useTransform(scrollYProgress, [0.78, 0.9], [1, 0]);

  return (
    <div className="relative w-full flex flex-col items-center">

      {/* Letter - starts hidden behind envelope, slides up above it */}
      <motion.div
        style={{ y: letterSlideY, opacity: letterOpacity }}
        className="relative z-10 w-[90vw] max-w-[380px] mx-auto"
      >
        <div
          className="rounded-md border border-[#eadfce] bg-gradient-to-b from-[#fffefb] via-[#fff9ef] to-[#f4e8d3] shadow-[0_16px_40px_rgba(84,63,41,0.25)] px-5 py-6 md:px-7 md:py-8"
          data-testid="letter-content"
        >
          <div className="w-full border border-[#e6dace] bg-[#fffaf1]/95 p-4">
            <div className="space-y-3">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c7b39f] to-transparent" />
              <p className="border-b border-stone-200 pb-2 font-romantic text-xl font-bold text-stone-800 md:text-2xl">
                To My Dearest Valentine ❤️,
              </p>

              <p className="font-romantic text-sm leading-relaxed text-stone-700 md:text-base">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
              </p>

              <p className="font-romantic text-sm leading-relaxed text-stone-700 md:text-base">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>

              <p className="font-romantic text-sm leading-relaxed text-stone-700 md:text-base">
                Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Happy Valentine{"'"}s Day ❤️
              </p>

              <p className="font-romantic text-xs italic leading-relaxed text-stone-500 md:text-sm">
                P.s. Write your own heartfelt message here to make it personal and special.
              </p>
            </div>

            <div className="mt-3 border-t border-stone-200 pt-3">
              <p className="font-romantic text-sm text-stone-700 md:text-base">
                Forever yours,
              </p>
              <p className="mt-1 font-romantic text-xl font-bold text-stone-900 md:text-2xl">
                Your Name
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Envelope - sits below the letter, fades out as letter rises */}
      <motion.div
        style={{ y: envelopeEnterY, opacity: envelopeOpacity }}
        className="relative z-20 -mt-4 w-[90vw] max-w-[380px] mx-auto"
      >
        <motion.div
          style={{ y: envelopeFadeY, opacity: envelopeFadeOpacity }}
          className="relative w-full h-[200px] md:h-[230px]"
        >
          {/* Envelope body */}
          <div className="absolute inset-0 rounded-md bg-[#eaddcf] border border-[#d6c4b0] shadow-lg" />

          {/* Inner V crease */}
          <div
            className="absolute left-0 right-0 top-0 bg-[#e3d1be]"
            style={{ height: "55%", clipPath: "polygon(0% 0%, 50% 100%, 100% 0%)" }}
          />

          {/* Bottom half overlay */}
          <div className="absolute left-0 right-0 bottom-0 top-[45%] rounded-b-md bg-[#eaddcf]" />

          {/* Top flap */}
          <motion.div
            style={{ rotateX: flapRotate, perspective: "800px" }}
            className="absolute left-0 right-0 top-0 origin-top z-[5]"
          >
            <div
              className="relative w-full bg-[#eaddcf] border border-[#d6c4b0] shadow-md"
              style={{ height: "120px", clipPath: "polygon(0% 0%, 50% 100%, 100% 0%)" }}
            >
              <div className="absolute left-1/2 top-[70px] h-11 w-11 -translate-x-1/2 rounded-full border-[3px] border-red-900/50 bg-red-800 shadow-lg flex items-center justify-center">
                <Heart size={18} className="text-red-200" fill="currentColor" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

    </div>
  );
}

function FloatingHearts() {
  const [hearts, setHearts] = useState<{id: number, left: number, delay: number, size: number}[]>([]);

  useEffect(() => {
    // Only client-side
    const newHearts = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      size: Math.random() * 20 + 15
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute text-valentine-pink/40"
          style={{
            left: `${heart.left}%`,
            bottom: '-10%',
            animation: `float 10s linear infinite`,
            animationDelay: `${heart.delay}s`,
            fontSize: `${heart.size}px`
          }}
        >
          <Heart fill="currentColor" />
        </div>
      ))}
    </div>
  );
}
