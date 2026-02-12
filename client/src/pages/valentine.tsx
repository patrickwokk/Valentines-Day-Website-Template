import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

// Assets
import happyPuppy from "@assets/1-excited_1770876596574.gif";
import angryPuppy from "@assets/2-angry-dog_1770876596575.gif";
import beggingPuppy from "@assets/3-puppy-please_1770876596575.webp";
import couplePhoto from "/couple-placeholder.jpg"; 

// Using the attached asset for the background
import floralBg from "@assets/1c1e1934764a7859c7d06dd90ee9fd5e_1770876135345.jpg";

type GameState = "INITIAL" | "REJECT_1" | "REJECT_2" | "SUCCESS";

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
          image: couplePhoto,
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
        couplePhoto={content.image} 
        onReplay={handleReplay} 
        bgImage={floralBg}
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

function SuccessView({ couplePhoto, onReplay, bgImage }: { couplePhoto: string, onReplay: () => void, bgImage: string }) {
  return (
    <div className="min-h-screen relative overflow-x-hidden font-romantic text-stone-800 bg-stone-50">
      {/* Background with overlay */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 md:opacity-100"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      {/* Gradient overlay to ensure text readability */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-white/90 via-white/80 to-white/90 backdrop-blur-[1px]" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-24 flex flex-col items-center">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-medium text-stone-900 mb-6 tracking-tighter drop-shadow-sm" data-testid="title-success">
            She said Yes!
          </h1>
          <p className="text-2xl md:text-3xl italic text-stone-600 font-light">
            (I knew you would ❤️)
          </p>
        </motion.div>

        {/* Photo Frame */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="relative w-full aspect-[3/4] md:aspect-[4/5] max-w-md mb-24 bg-white p-3 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rotate-1"
        >
          <img 
            src={couplePhoto} 
            alt="Us together" 
            className="w-full h-full object-cover"
            data-testid="image-couple"
          />
        </motion.div>

        {/* Letter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="bg-white/80 backdrop-blur-sm p-10 md:p-16 shadow-xl mb-24 w-full border border-stone-100"
        >
          <p className="mb-8 font-semibold text-3xl text-stone-900 font-romantic" data-testid="letter-greeting">Dearest Ga-eun,</p>
          
          <div className="space-y-8 text-stone-800 text-xl md:text-2xl font-light leading-relaxed font-romantic" data-testid="letter-body">
            <p>
              I'm writing this because I want you to know how much you mean to me. 
              Usually I'm not this cheesy, but for you, I'll make an exception.
            </p>
            <p>
              From the moment we met, you've brought so much joy into my life. 
              Your smile, your laugh, and even the way you get angry at me—I love all of it.
            </p>
            <p>
              I wanted to ask you this in a special way because you deserve nothing but the best.
              Thank you for being my valentine, today and hopefully for many more to come.
            </p>
            <p className="pt-8 text-2xl">
              Love,<br/>
              <span className="font-semibold">Your Valentine</span>
            </p>
          </div>
        </motion.div>

        {/* Replay Button */}
        <motion.button
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          onClick={onReplay}
          className="px-10 py-4 bg-stone-900 text-white font-sans text-xs tracking-[0.2em] uppercase hover:bg-stone-700 transition-colors shadow-lg rounded-sm"
          data-testid="button-replay"
        >
          Replay Our Story
        </motion.button>

        <div className="h-24" />
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
