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
import photo10 from "@assets/937658B5-ED2D-4D85-92DF-44A27B809F8C_1_102_o_1770877231936.jpeg";
import photo11 from "@assets/5C1DD69B-F575-4053-A9E2-8AF8D85BC7A8_1_102_o_1770877239395.jpeg";

// Floral Assets (Keeping for subtle background texture if needed, or removing if fully replaced)
import floralBg from "@assets/1c1e1934764a7859c7d06dd90ee9fd5e_1770876135345.jpg";

type GameState = "INITIAL" | "REJECT_1" | "REJECT_2" | "SUCCESS";

const GALLERY_PHOTOS = [
  { src: photo1, rotate: -5, x: -10, y: 0 },
  { src: photo2, rotate: 3, x: 15, y: -20 },
  { src: photo3, rotate: -2, x: -20, y: 10 },
  { src: photo4, rotate: 6, x: 25, y: 15 },
  { src: photo5, rotate: -4, x: -15, y: -10 },
  { src: photo6, rotate: 2, x: 10, y: 20 },
  { src: photo7, rotate: -6, x: -25, y: -5 },
  { src: photo8, rotate: 4, x: 20, y: 5 },
  { src: photo9, rotate: -3, x: -5, y: -15 },
  { src: photo10, rotate: 5, x: 30, y: -25 },
  { src: photo11, rotate: -1, x: 0, y: 25 },
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
  
  // Create staggered animations for the photos based on scroll
  // We want them to start scattered, then "scoot" to the sides as we scroll down
  const photoAnims = GALLERY_PHOTOS.map((_, i) => {
    // Alternate moving left and right
    const direction = i % 2 === 0 ? -1 : 1;
    // Calculate a random but deterministic movement amount
    const moveX = (300 + Math.random() * 200) * direction;
    
    return {
      x: useTransform(scrollYProgress, [0, 0.2], [0, moveX]),
      opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0.2]),
      scale: useTransform(scrollYProgress, [0, 0.2], [1, 0.8]),
    };
  });

  // Opacity controls for text sections
  const textOpacity1 = useTransform(scrollYProgress, [0.15, 0.25], [0, 1]);
  const textOpacity2 = useTransform(scrollYProgress, [0.3, 0.4], [0, 1]);
  const textOpacity3 = useTransform(scrollYProgress, [0.45, 0.55], [0, 1]);
  const textOpacity4 = useTransform(scrollYProgress, [0.6, 0.7], [0, 1]);
  const buttonOpacity = useTransform(scrollYProgress, [0.8, 0.9], [0, 1]);

  return (
    <div className="min-h-[300vh] relative bg-stone-50 overflow-x-hidden font-romantic">
      
      {/* Sticky container for the photos to stay fixed while we scroll "through" them */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full max-w-6xl mx-auto">
          {GALLERY_PHOTOS.map((photo, i) => (
            <motion.div
              key={i}
              style={{
                x: photoAnims[i].x,
                opacity: photoAnims[i].opacity,
                scale: photoAnims[i].scale,
                rotate: photo.rotate,
                left: `${50 + photo.x}%`,
                top: `${40 + photo.y}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.8, type: "spring" }}
              className="absolute w-48 md:w-64 bg-white p-3 pb-8 shadow-xl transform -translate-x-1/2 -translate-y-1/2 rotate-2"
            >
              <img 
                src={photo.src} 
                alt="Us" 
                className="w-full h-full object-cover filter sepia-[0.2]"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Content Container - creates the scroll height */}
      <div className="relative z-10 w-full flex flex-col items-center">
        
        {/* Initial View - Just the "She said Yes" text */}
        <div className="h-screen flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-stone-100"
          >
            <h1 className="text-6xl md:text-8xl font-medium text-stone-900 mb-4 tracking-tighter">
              She said Yes!
            </h1>
            <p className="text-2xl md:text-3xl italic text-stone-600 font-light">
              (Scroll down to read my letter)
            </p>
          </motion.div>
        </div>

        {/* Letter Sections - Spaced out for scrolling */}
        <div className="max-w-2xl px-6 pb-32">
          
          <motion.div style={{ opacity: textOpacity1 }} className="min-h-[50vh] flex items-center justify-center py-20">
             <p className="text-3xl md:text-4xl text-stone-800 leading-relaxed text-center font-romantic">
              "Dearest Ga-eun,<br/>
              From the moment we met, you've brought so much joy into my life."
            </p>
          </motion.div>

          <motion.div style={{ opacity: textOpacity2 }} className="min-h-[50vh] flex items-center justify-center py-20">
            <p className="text-3xl md:text-4xl text-stone-800 leading-relaxed text-center font-romantic">
              "Your smile, your laugh, and even the way you look at me when I'm being silly—I love every single bit of it."
            </p>
          </motion.div>

          <motion.div style={{ opacity: textOpacity3 }} className="min-h-[50vh] flex items-center justify-center py-20">
            <p className="text-3xl md:text-4xl text-stone-800 leading-relaxed text-center font-romantic">
              "I wanted to ask you this in a special way because you deserve nothing but the best. Thank you for being my valentine."
            </p>
          </motion.div>

          <motion.div style={{ opacity: textOpacity4 }} className="min-h-[50vh] flex flex-col items-center justify-center py-20">
            <p className="text-4xl md:text-5xl text-stone-900 font-bold mb-8 text-center font-romantic">
              "I love you, forever."
            </p>
            <p className="text-2xl text-stone-600 italic">
              - Your Valentine
            </p>
          </motion.div>

          <motion.div style={{ opacity: buttonOpacity }} className="flex justify-center py-20">
             <button
              onClick={onReplay}
              className="px-10 py-4 bg-stone-900 text-white font-sans text-xs tracking-[0.2em] uppercase hover:bg-stone-700 transition-colors shadow-lg rounded-sm"
            >
              Replay Our Story
            </button>
          </motion.div>
        </div>
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
