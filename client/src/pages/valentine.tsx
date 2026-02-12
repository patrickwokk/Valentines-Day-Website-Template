import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Heart } from "lucide-react";

// Assets
import happyPuppy from "@assets/1-excited_1770876596574.gif";
import angryPuppy from "@assets/2-angry-dog_1770876596575.gif";
import beggingPuppy from "@assets/3-puppy-please_1770876596575.webp";

// Photo Assets
import photo1 from "@assets/BD8BBA69-E650-4124-BBAC-618ABB29E997_1_102_o_1770877002215.jpeg";
import photo2 from "@assets/9969E619-B449-453C-91D5-3174D487D6EC_4_5005_c_1770877019708.jpeg";
import photo3 from "@assets/C12B98ED-9F98-4521-9C97-C924930B551E_1_102_o_1770877061969.jpeg";
import photo4 from "@assets/911D2329-F027-4F57-BD4D-2316528C43EA_1_102_o_1770877101880.jpeg";
import photo5 from "@assets/B3E5E6DC-DAC9-42C2-A183-36D5C892E809_4_5005_c_1770877139538.jpeg";
import photo6 from "@assets/D148961A-5E38-4097-8193-DA843BB530FB_1_105_c_1770877169930.jpeg";
import photo7 from "@assets/ACF6D9EB-768F-4858-ADD1-F2426FE4DACA_1_105_c_1770877180380.jpeg";
import photo8 from "@assets/2ABA7306-3DAF-4367-A6D0-590DB4EF9145_1_105_c_1770877209211.jpeg";
import photo9 from "@assets/8F1AEA78-F103-4E27-A784-8640A453772A_4_5005_c_1770877217445.jpeg";

// Floral Assets (Keeping for subtle background texture if needed, or removing if fully replaced)
import floralBg from "@assets/1c1e1934764a7859c7d06dd90ee9fd5e_1770876135345.jpg";

type GameState = "INITIAL" | "REJECT_1" | "REJECT_2" | "SUCCESS";

const GALLERY_PHOTOS = [
  { src: photo1, rotate: -5, x: -35, y: -25, z: 1 },
  { src: photo2, rotate: 3, x: 35, y: -30, z: 2 },
  { src: photo3, rotate: -2, x: -40, y: 15, z: 3 },
  { src: photo4, rotate: 6, x: 45, y: 10, z: 1 },
  { src: photo5, rotate: -4, x: -15, y: -40, z: 2 },
  { src: photo6, rotate: 2, x: 10, y: 45, z: 3 },
  { src: photo7, rotate: -6, x: -45, y: -5, z: 1 },
  { src: photo8, rotate: 4, x: 40, y: 35, z: 2 },
  { src: photo9, rotate: -3, x: -20, y: 30, z: 3 },
];

export default function ValentinePage() {
  const [gameState, setGameState] = useState<GameState>("INITIAL");
  const [yesScale, setYesScale] = useState(1);

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
    setGameState("INITIAL");
    setYesScale(1);
    window.scrollTo(0, 0);
  };

  // Content configuration based on state
  const getContent = () => {
    switch (gameState) {
      case "INITIAL":
        return {
          image: happyPuppy,
          text: "가은아 will you be my valentine? 😫🥺🤩",
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
    // Each photo moves up at a slightly different speed (parallax)
    // We want them to start at their original position and move UP out of view
    // Some move faster (closer), some slower (further)
    const speed = 0.5 + Math.random() * 1.5;
    const yOutput = -800 * speed; // Move way up
    
    return {
      y: useTransform(scrollYProgress, [0, 0.6], [0, yOutput]),
      opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]), // Fade out quicker to clear view
    };
  });

  // Sticky text animations - enter, hold, exit up
  const textOpacity1 = useTransform(scrollYProgress, [0.1, 0.2, 0.3, 0.4], [0, 1, 1, 0]);
  const textY1 = useTransform(scrollYProgress, [0.1, 0.2, 0.3, 0.4], [50, 0, 0, -50]);

  const textOpacity2 = useTransform(scrollYProgress, [0.3, 0.4, 0.5, 0.6], [0, 1, 1, 0]);
  const textY2 = useTransform(scrollYProgress, [0.3, 0.4, 0.5, 0.6], [50, 0, 0, -50]);

  const textOpacity3 = useTransform(scrollYProgress, [0.5, 0.6, 0.7, 0.8], [0, 1, 1, 0]);
  const textY3 = useTransform(scrollYProgress, [0.5, 0.6, 0.7, 0.8], [50, 0, 0, -50]);

  const textOpacity4 = useTransform(scrollYProgress, [0.7, 0.8, 0.9, 1.0], [0, 1, 1, 1]); // Stays visible at end
  const textY4 = useTransform(scrollYProgress, [0.7, 0.8, 0.9, 1.0], [50, 0, 0, 0]);

  const buttonOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]); // Fade out header quickly

  return (
    <div className="h-[400vh] relative bg-stone-50 overflow-x-hidden font-romantic">
      
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
                left: `${50 + photo.x}%`,
                top: `${50 + photo.y}%`, // Centered vertically initially
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
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

      {/* Fixed Centered Text Container - Messages appear here one by one */}
      <div className="fixed inset-0 pointer-events-none z-20 flex flex-col items-center justify-center p-6">
        
        {/* Header - Disappears on scroll */}
        <motion.div 
          style={{ opacity: headerOpacity }}
          className="absolute text-center bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-stone-100 top-[60%]" // Moved down
        >
          <h1 className="text-5xl md:text-7xl font-medium text-stone-900 mb-4 tracking-tighter">
            Horray! 그럴 줄 알았어 !!
          </h1>
          <p className="text-xl md:text-2xl italic text-stone-600 font-light animate-bounce mt-4">
            scroll down 주세요~
          </p>
        </motion.div>

        {/* Message 1 */}
        <motion.div style={{ opacity: textOpacity1, y: textY1 }} className="absolute max-w-2xl text-center">
           <p className="text-3xl md:text-5xl text-stone-900 leading-relaxed font-romantic font-bold drop-shadow-sm bg-white/60 p-4 rounded-xl backdrop-blur-sm">
            "Dearest Ga-eun,<br/>
            From the moment we met, you've brought so much joy into my life."
          </p>
        </motion.div>

        {/* Message 2 */}
        <motion.div style={{ opacity: textOpacity2, y: textY2 }} className="absolute max-w-2xl text-center">
          <p className="text-3xl md:text-5xl text-stone-900 leading-relaxed font-romantic font-bold drop-shadow-sm bg-white/60 p-4 rounded-xl backdrop-blur-sm">
            "Your smile, your laugh, and even the way you look at me when I'm being silly—I love every single bit of it."
          </p>
        </motion.div>

        {/* Message 3 */}
        <motion.div style={{ opacity: textOpacity3, y: textY3 }} className="absolute max-w-2xl text-center">
          <p className="text-3xl md:text-5xl text-stone-900 leading-relaxed font-romantic font-bold drop-shadow-sm bg-white/60 p-4 rounded-xl backdrop-blur-sm">
            "I wanted to ask you this in a special way because you deserve nothing but the best. Thank you for being my valentine."
          </p>
        </motion.div>

        {/* Final Message */}
        <motion.div style={{ opacity: textOpacity4, y: textY4 }} className="absolute max-w-2xl text-center flex flex-col items-center">
          <p className="text-5xl md:text-7xl text-stone-900 font-bold mb-8 font-romantic">
            "I love you, forever."
          </p>
          <p className="text-3xl text-stone-600 italic mb-8">
            - Your Valentine
          </p>
        </motion.div>

        {/* Replay Button - Only active at end */}
        <motion.div style={{ opacity: buttonOpacity }} className="absolute bottom-20 pointer-events-auto">
           <button
            onClick={onReplay}
            className="px-10 py-4 bg-stone-900 text-white font-sans text-xs tracking-[0.2em] uppercase hover:bg-stone-700 transition-colors shadow-lg rounded-sm"
          >
            Replay Our Story
          </button>
        </motion.div>

      </div>

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
