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
// New photos
import photo10 from "@assets/EE12EF45-3ED6-41DF-9170-DB1964B01338_1_105_c_1770878484705.jpeg";
import photo11 from "@assets/C36829A7-0F61-442B-978C-28FFE9EF7E7F_1_102_o_1770878516271.jpeg";
import photo12 from "@assets/F0F13826-741D-4BF4-BC06-7E56BC4C0D2D_4_5005_c_1770878541738.jpeg";
import photo13 from "@assets/26E6FFDE-BE64-4309-87B6-C4D57FD2B84F_1_102_o_1770878550588.jpeg";

// Floral Assets (Keeping for subtle background texture if needed, or removing if fully replaced)
import floralBg from "@assets/1c1e1934764a7859c7d06dd90ee9fd5e_1770876135345.jpg";

type GameState = "INITIAL" | "REJECT_1" | "REJECT_2" | "SUCCESS";

const GALLERY_PHOTOS = [
  // Top layer (closest/fastest) - Centered cluster
  { src: photo1, rotate: -5, x: -15, y: -10, z: 2, scale: 1.1 },
  { src: photo2, rotate: 3, x: 15, y: -15, z: 2, scale: 1.1 },
  
  // Middle layer - Slightly wider
  { src: photo3, rotate: -2, x: -25, y: 10, z: 1, scale: 1 },
  { src: photo4, rotate: 6, x: 25, y: 5, z: 1, scale: 1 },
  { src: photo5, rotate: -4, x: -5, y: -25, z: 1, scale: 1 },
  { src: photo6, rotate: 2, x: 8, y: 25, z: 1, scale: 1 },
  
  // Background/Edges layer - Framing the center
  { src: photo7, rotate: -6, x: -30, y: -5, z: 0, scale: 0.9 },
  { src: photo8, rotate: 4, x: 28, y: 20, z: 0, scale: 0.9 },
  { src: photo9, rotate: -3, x: -12, y: 20, z: 0, scale: 0.9 },
  
  // New photos - Tucked in
  { src: photo10, rotate: 5, x: 18, y: -25, z: 1, scale: 1 },
  { src: photo11, rotate: -4, x: -18, y: 35, z: 2, scale: 1.1 },
  { src: photo12, rotate: 2, x: 22, y: 30, z: 0, scale: 0.9 },
  { src: photo13, rotate: -2, x: 0, y: -35, z: 1, scale: 1 },
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
    // Photos move UP at different speeds based on their "z-index" / layer
    // Closer items (z=2) move faster than further items (z=0)
    const baseSpeed = 800;
    const speed = baseSpeed + (photo.z * 400); 
    const yOutput = -1 * speed; // Move way up
    
    return {
      y: useTransform(scrollYProgress, [0, 1], [0, yOutput]),
      opacity: useTransform(scrollYProgress, [0, 0.25], [1, 0]), // Photos fade out earlier
    };
  });

  // Text Animations - Moving up alongside photos but visible longer
  // We want them to "scroll" up naturally like a credits roll but with parallax
  const textSpeed = -600; 
  
  // Staggered start positions for text chunks
  // They start "below" the fold and scroll UP into view and then out
  const t1Y = useTransform(scrollYProgress, [0.1, 0.4], [300, -300]);
  const t1Op = useTransform(scrollYProgress, [0.1, 0.2, 0.3, 0.4], [0, 1, 1, 0]);

  const t2Y = useTransform(scrollYProgress, [0.3, 0.6], [300, -300]);
  const t2Op = useTransform(scrollYProgress, [0.3, 0.4, 0.5, 0.6], [0, 1, 1, 0]);

  const t3Y = useTransform(scrollYProgress, [0.5, 0.8], [300, -300]);
  const t3Op = useTransform(scrollYProgress, [0.5, 0.6, 0.7, 0.8], [0, 1, 1, 0]);

  const t4Y = useTransform(scrollYProgress, [0.7, 1.0], [300, 0]); // Ends at center
  const t4Op = useTransform(scrollYProgress, [0.7, 0.8], [0, 1]);

  const buttonOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]); 

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

      {/* Text Container - Messages scroll up like "Part of the polaroid flow" */}
      <div className="fixed inset-0 pointer-events-none z-20 flex flex-col items-center justify-center p-6">
        
        {/* Header - Disappears on scroll */}
        <motion.div 
          style={{ opacity: headerOpacity }}
          className="absolute text-center bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-stone-100 top-[60%]" 
        >
          <div className="flex items-baseline justify-center gap-3 mb-4 flex-wrap">
             <motion.span 
              animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1 }}
              className="text-6xl md:text-8xl font-bold text-stone-900 tracking-tighter inline-block"
            >
              Horray!
            </motion.span>
             <span className="text-4xl md:text-6xl font-medium text-stone-900 tracking-tight">
               그럴 줄 알았어 !!
            </span>
          </div>
          
          <p className="text-xl md:text-2xl italic text-stone-600 font-light mt-4">
            scroll down 주세요~
          </p>
        </motion.div>

        {/* Message 1 */}
        <motion.div 
          style={{ opacity: t1Op, y: t1Y }} 
          className="absolute max-w-2xl text-center z-30"
        >
           <div className="bg-white p-6 pb-12 shadow-xl rotate-[-2deg] transform transition-transform hover:scale-105 border-8 border-white">
             <p className="text-3xl md:text-4xl text-stone-900 leading-relaxed font-romantic font-bold">
              "Dearest Ga-eun,<br/>
              From the moment we met, you've brought so much joy into my life."
            </p>
           </div>
        </motion.div>

        {/* Message 2 */}
        <motion.div 
          style={{ opacity: t2Op, y: t2Y }} 
          className="absolute max-w-2xl text-center z-30"
        >
          <div className="bg-white p-6 pb-12 shadow-xl rotate-[1deg] transform transition-transform hover:scale-105 border-8 border-white">
            <p className="text-3xl md:text-4xl text-stone-900 leading-relaxed font-romantic font-bold">
              "Your smile, your laugh, and even the way you look at me when I'm being silly—I love every single bit of it."
            </p>
          </div>
        </motion.div>

        {/* Message 3 */}
        <motion.div 
          style={{ opacity: t3Op, y: t3Y }} 
          className="absolute max-w-2xl text-center z-30"
        >
          <div className="bg-white p-6 pb-12 shadow-xl rotate-[-1deg] transform transition-transform hover:scale-105 border-8 border-white">
            <p className="text-3xl md:text-4xl text-stone-900 leading-relaxed font-romantic font-bold">
              "I wanted to ask you this in a special way because you deserve nothing but the best. Thank you for being my valentine."
            </p>
          </div>
        </motion.div>

        {/* Final Message */}
        <motion.div 
          style={{ opacity: t4Op, y: t4Y }} 
          className="absolute max-w-2xl text-center flex flex-col items-center z-30"
        >
          <div className="bg-white p-8 pb-16 shadow-2xl rotate-[2deg] border-8 border-white mb-8">
            <p className="text-5xl md:text-7xl text-stone-900 font-bold mb-4 font-romantic">
              "I love you, forever."
            </p>
            <p className="text-3xl text-stone-600 italic">
              - Your Valentine
            </p>
          </div>
        </motion.div>

        {/* Replay Button - Only active at end */}
        <motion.div style={{ opacity: buttonOpacity }} className="absolute bottom-20 pointer-events-auto z-40">
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
