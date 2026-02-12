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
      </div>

      {/* Envelope & Letter System */}
      <div className="fixed inset-0 pointer-events-none z-30 flex items-center justify-center">
        <EnvelopeLetter scrollYProgress={scrollYProgress} />
      </div>

      {/* Replay Button - Only active at end */}
      <motion.div style={{ opacity: buttonOpacity }} className="fixed bottom-10 left-1/2 -translate-x-1/2 pointer-events-auto z-50">
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
  // Phase 1: Envelope enters from bottom (0.4 - 0.5)
  const envelopeY = useTransform(scrollYProgress, [0.4, 0.5], [600, 0]);
  const envelopeOpacity = useTransform(scrollYProgress, [0.4, 0.45], [0, 1]);

  // Phase 2: Flap opens (0.5 - 0.6)
  const flapRotate = useTransform(scrollYProgress, [0.5, 0.6], [0, -180]);
  const flapOpacity = useTransform(scrollYProgress, [0.58, 0.62], [1, 0]);

  // Phase 3: Letter slides up out of envelope (0.6 - 0.85)
  const letterY = useTransform(scrollYProgress, [0.6, 0.85], [280, -200]);

  // Phase 4: Letter expands to full readable size (0.85 - 1.0)
  const letterScale = useTransform(scrollYProgress, [0.85, 0.95], [1, 1.15]);
  const letterOpacity = useTransform(scrollYProgress, [0.85, 1.0], [1, 1]);

  // Envelope fades out as letter takes center stage (0.8 - 0.9)
  const envelopeContainerOpacity = useTransform(scrollYProgress, [0.8, 0.9], [1, 0]);

  return (
    <div className="relative w-full max-w-lg mx-auto">

      <motion.div
        style={{ y: envelopeStageY, opacity: envelopeOpacity }}
        className="relative w-[320px] md:w-[400px] h-[220px] md:h-[260px] mx-auto z-20"
      >
        {/* Envelope back panel */}
        <motion.div style={{ y: envelopeShellY, zIndex: envelopeBackZ }} className="absolute inset-0">
          <div className="absolute inset-0 rounded-md border border-[#cebba7] bg-[#d6c4b0] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_16px_34px_rgba(69,47,30,0.2)]" />
          <div
            className="absolute left-0 right-0 top-0 z-[2] bg-[#cbb8a4]"
            style={{ height: "56%", clipPath: "polygon(0% 0%, 50% 100%, 100% 0%)" }}
          />
        </motion.div>

        {/* Letter sheet: clipped to envelope bounds until final reveal */}
        <motion.div className="absolute inset-0 overflow-visible" style={{ clipPath: letterRevealClip, zIndex: letterLayerZ }}>
          <motion.div
            style={{
              rotateX: flapRotate,
              opacity: flapOpacity,
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden"
            }}
            className="absolute left-0 right-0 top-0 origin-top"
          >
            <div
              className="relative w-full border border-[#d6c4b0] bg-[#eaddcf] shadow-lg"
              style={{ height: "180px", clipPath: "polygon(0% 0%, 50% 100%, 100% 0%)" }}
            >
              <div className="absolute left-1/2 top-[130px] h-14 w-14 -translate-x-1/2 rounded-full border-4 border-red-900/50 bg-red-800 shadow-xl flex items-center justify-center">
                <Heart size={24} className="text-red-200" fill="currentColor" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Letter - slides up and out */}
        <motion.div
          style={{
            y: letterY,
            scale: letterScale,
            opacity: letterOpacity,
          }}
          className="absolute left-1/2 top-[40px] -translate-x-1/2 w-[460px] md:w-[580px] origin-bottom"
        >
          <div
            className="rounded-md border border-[#eadfce] bg-gradient-to-b from-[#fffefb] via-[#fff9ef] to-[#f4e8d3] shadow-[0_20px_50px_rgba(84,63,41,0.3)] px-6 py-7 md:px-8 md:py-9"
            data-testid="letter-content"
          >
            <div className="flex w-full flex-col justify-between border border-[#e6dace] bg-[#fffaf1]/95 p-4 md:p-5" style={{ minHeight: "500px" }}>
              <div className="space-y-4">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c7b39f] to-transparent" />
                <p className="border-b border-stone-200 pb-3 font-romantic text-2xl font-bold text-stone-800 md:text-3xl">
                  To 우리 소중한 공주❤️,
                </p>

                <p className="font-romantic text-base leading-relaxed text-stone-700 md:text-lg">
                  From the moment we met, you've bought so much joy & laughter into my simple life like someone suddenly turned the colors back on.
                </p>

                <p className="font-romantic text-base leading-relaxed text-stone-700 md:text-lg">
                  I miss your smile, your laugh, and all the little moments in between. I wish I could see you again very soon so we can make even more fun & unforgettable memories, just like we did in Korea and Indonesia.
                </p>

                <p className="font-romantic text-base leading-relaxed text-stone-700 md:text-lg">
                  I wanted to ask you this in a special way, because you deserve nothing but the best. Even though I can't be there in person with "real" flowers this time, I hope this little gift still reaches you with a big smile. Thank you for being my Valentine. 사랑한다 ❤️
                </p>

                <p className="font-romantic text-sm italic leading-relaxed text-stone-500 md:text-base">
                  P.s. I made this late at night for days, right in front of you during our calls and powered by lots of love, good music, and questionable sleep decisions.
                </p>

                <p className="font-romantic text-sm italic leading-relaxed text-stone-500 md:text-base">
                  Special shoutout to Replit, Claude code, and ChatGPT. LMAO they really carried my ass🤓
                </p>
              </div>

              <div className="mt-4 border-t border-stone-200 pt-4">
                <p className="font-romantic text-base text-stone-700 md:text-lg">
                  Your one & only smarty pants,
                </p>
                <p className="mt-1 font-romantic text-2xl font-bold text-stone-900 md:text-3xl">
                  Kwakteria
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Envelope front pocket + flap */}
        <motion.div style={{ y: envelopeShellY, zIndex: envelopeFrontZ, perspective: "1000px" }} className="absolute inset-0">
          <div className="absolute inset-0 rounded-md border border-[#d6c4b0]" />
          <div className="absolute bottom-0 left-0 top-0 w-[14px] bg-[#d9c8b5]" />
          <div className="absolute bottom-0 right-0 top-0 w-[14px] bg-[#d9c8b5]" />
          <div
            className="absolute left-0 right-0 top-0 bg-[#e3d1be]"
            style={{ height: "56%", clipPath: "polygon(0% 0%, 50% 100%, 100% 0%)" }}
          />
          <div className="absolute left-0 right-0 bottom-0 top-[56%] rounded-b-md bg-[#eaddcf]" />

          {/* Top flap (opens upward) */}
          <motion.div
            style={{ rotateX: flapRotate, opacity: flapOpacity, backfaceVisibility: "hidden" }}
            className="absolute left-0 right-0 top-0 origin-top z-[20]"
          >
            <div
              className="relative w-full border border-[#d6c4b0] bg-[#eaddcf] shadow-md"
              style={{ height: "140px", clipPath: "polygon(0% 0%, 50% 100%, 100% 0%)" }}
            >
              <div className="absolute left-1/2 top-[85px] h-12 w-12 -translate-x-1/2 rounded-full border-4 border-red-900/50 bg-red-800 shadow-lg flex items-center justify-center">
                <Heart size={20} className="text-red-200" fill="currentColor" />
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
