import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, HelpCircle, Star, Award, Coins, BookOpen, Layers, ArrowRight, CornerRightDown } from 'lucide-react';
import { LESSONS } from '../data/lessons';
import { audio } from '../utils/audio';

interface PresentationProps {
  onComplete: () => void;
  addCoins: (amount: number) => void;
  coins: number;
}

export default function Presentation({ onComplete, addCoins, coins }: PresentationProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slide = LESSONS[currentSlideIndex];

  // Point visual interactive states
  const [points, setPoints] = useState<{ id: string; x: number; y: number; label: string }[]>([
    { id: '1', x: 120, y: 150, label: 'A' },
    { id: '2', x: 280, y: 80, label: 'B' }
  ]);
  const [questionBlockHit, setQuestionBlockHit] = useState(false);

  // Line visual interactive states
  const [lineAngle, setLineAngle] = useState(25); // degrees
  const [lineOffset, setLineOffset] = useState(120);

  // Plane visual interactive states
  const [planeTilt, setPlaneTilt] = useState(30); // pitch
  const [planeRotate, setPlaneRotate] = useState(-15); // yaw

  // 3D Space interactive states
  const [coordX, setCoordX] = useState(50); // width (left-right)
  const [coordY, setCoordY] = useState(60); // height (up-down)
  const [coordZ, setCoordZ] = useState(30); // depth (back-forth)

  // Quiz states (for the final summary slide)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const handleNext = () => {
    if (currentSlideIndex < LESSONS.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
      audio.playJump();
    } else {
      onComplete();
      audio.playLevelClear();
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
      audio.playJump();
    }
  };

  const handleHitBlock = () => {
    if (!questionBlockHit) {
      setQuestionBlockHit(true);
      audio.playCoin();
      addCoins(15);
      // Spawn a new point where the coin pops up
      const newPoint = { id: Date.now().toString(), x: 200, y: 40, label: 'C' };
      setPoints(prev => [...prev, newPoint]);
      setTimeout(() => {
        setQuestionBlockHit(false);
      }, 300);
    }
  };

  const handleQuizAnswer = (questionIdx: number, optionIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [questionIdx]: optionIdx }));
    audio.playCoin();
  };

  const handleSubmitQuiz = () => {
    const correctAnswers = [2, 0, 1]; // indexes of correct options
    let score = 0;
    correctAnswers.forEach((correct, idx) => {
      if (quizAnswers[idx] === correct) {
        score++;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    const coinsWon = score * 20;
    addCoins(coinsWon);
    if (score === 3) {
      audio.playPowerup();
    } else if (score > 0) {
      audio.playCorrect();
    } else {
      audio.playWrong();
    }
  };

  // Character style resolver
  const getCharacterColors = (char: string) => {
    switch (char) {
      case 'mario':
        return { bg: 'bg-red-500', text: 'text-red-600', border: 'border-red-500', accent: 'bg-red-100', name: 'Mario' };
      case 'luigi':
        return { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-500', accent: 'bg-green-100', name: 'Luigi' };
      case 'peach':
        return { bg: 'bg-pink-400', text: 'text-pink-600', border: 'border-pink-400', accent: 'bg-pink-50', name: 'Princesa Peach' };
      case 'toad':
        return { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-500', accent: 'bg-blue-50', name: 'Toad' };
      default:
        return { bg: 'bg-yellow-500', text: 'text-yellow-600', border: 'border-yellow-500', accent: 'bg-yellow-50', name: 'Geómetra' };
    }
  };

  const charStyle = getCharacterColors(slide.character);

  return (
    <div className="flex flex-col h-full bg-[#EBF3FF] border-8 border-black rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative" id="presentation-container">
      {/* HUD Bar */}
      <div className="bg-[#43B047] px-6 py-3.5 flex justify-between items-center border-b-4 border-black text-white font-sans text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-white font-black uppercase">
          <BookOpen className="w-5 h-5" />
          <span>MODO LECCIÓN • SEMANA 1</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-white/80 font-bold uppercase">NIVEL:</span>
            <span className="text-white font-black">{currentSlideIndex + 1} / {LESSONS.length}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white text-black font-black px-3 py-1 rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Coins className="w-4 h-4 text-[#FBD000] animate-pulse" />
            <span className="text-black font-black tracking-wider text-xs">{coins} <span className="text-[10px]">MONEDAS</span></span>
          </div>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-black h-3 flex border-b-2 border-black">
        {LESSONS.map((_, idx) => (
          <div
            key={idx}
            className={`flex-1 transition-all duration-300 ${
              idx <= currentSlideIndex ? 'bg-[#FBD000] border-r border-black last:border-0' : 'bg-white'
            }`}
          />
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row p-6 gap-6 overflow-y-auto">
        {/* Left column: Text & Dialogue */}
        <div className="flex-1 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-black tracking-wider text-white uppercase bg-[#E52521] px-3 py-1.5 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block">
                {slide.subtitle || 'Concepto'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight leading-tight font-sans uppercase">
                {slide.title}
              </h2>
            </div>
            <p className="text-gray-800 text-sm sm:text-base leading-relaxed font-bold">
              {slide.content}
            </p>

            {/* Concept Details Cheat-sheet panel */}
            {slide.conceptDetails && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3 font-sans text-xs sm:text-sm"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-black">
                  <div className="bg-gray-50 p-2.5 rounded border-2 border-black font-bold">
                    <strong className="text-[#E52521] block mb-0.5 font-sans uppercase text-[10px] tracking-wider font-black">Definición matemática:</strong>
                    <span>{slide.conceptDetails.definition}</span>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded border-2 border-black font-bold">
                    <strong className="text-[#049CD8] block mb-0.5 font-sans uppercase text-[10px] tracking-wider font-black">Nomenclatura / Notación:</strong>
                    <span className="font-mono text-[#E52521] text-xs">{slide.conceptDetails.notation}</span>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded border-2 border-black font-bold">
                    <strong className="text-[#43B047] block mb-0.5 font-sans uppercase text-[10px] tracking-wider font-black">En el Reino Champiñón:</strong>
                    <span>{slide.conceptDetails.marioExample}</span>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded border-2 border-black font-bold">
                    <strong className="text-[#FBD000] text-black block mb-0.5 font-sans uppercase text-[10px] tracking-wider font-black">En la vida real (Tu aula):</strong>
                    <span>{slide.conceptDetails.realExample}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Character Dialogue Bubble */}
          <div className="flex items-start gap-3 bg-white p-4 rounded-xl border-4 border-black relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {/* Avatar Circle */}
            <div className={`w-12 h-12 rounded-full border-2 border-black ${charStyle.bg} shrink-0 flex items-center justify-center font-black text-white shadow-md relative`}>
              {slide.character === 'mario' && <span className="text-lg">M</span>}
              {slide.character === 'luigi' && <span className="text-lg">L</span>}
              {slide.character === 'peach' && <span className="text-lg">P</span>}
              {slide.character === 'toad' && <span className="text-lg">T</span>}
              {/* Little crown or hat decoration */}
              <div className="absolute -top-1.5 -right-1 bg-[#FBD000] text-[8px] text-black px-1 rounded-full font-sans font-black scale-90 border border-black">
                INFO
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-black tracking-wide text-black uppercase">
                {charStyle.name} dice:
              </span>
              <p className="text-gray-800 italic text-xs sm:text-sm font-semibold">
                "{slide.characterDialogue}"
              </p>
            </div>
          </div>
        </div>

        {/* Right column: Beautiful Interactive Demonstration Canvas */}
        <div className="flex-1 min-h-[300px] lg:min-h-0 bg-white rounded-2xl border-4 border-black relative flex flex-col items-center justify-center p-4 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] select-none">
          {/* Visual representations according to slide category */}

          {/* 1. INTRO / WELCOME */}
          {slide.visualType === 'intro' && (
            <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-4 p-4 relative">
              {/* Stars animation */}
              <div className="absolute top-4 left-4 text-yellow-400 animate-bounce"><Star className="w-8 h-8 fill-yellow-400" /></div>
              <div className="absolute bottom-10 right-10 text-yellow-500 animate-ping"><Star className="w-4 h-4 fill-yellow-400" /></div>

              {/* Pixel Art-style Castle Icon or Visual */}
              <div className="relative w-40 h-40 bg-gradient-to-b from-blue-900/50 to-red-950/20 rounded-full border border-slate-800 flex items-center justify-center overflow-hidden shadow-2xl">
                {/* Visual castle shapes with geometric annotations */}
                <div className="absolute bottom-0 w-32 h-20 bg-slate-800 rounded-t-lg border-2 border-slate-700 flex justify-around p-2 items-end">
                  <div className="w-8 h-16 bg-red-900 border-2 border-red-700 rounded-t-md relative flex items-center justify-center">
                    <span className="text-[9px] font-mono text-red-400 absolute top-1">Punto A</span>
                  </div>
                  <div className="w-10 h-10 bg-slate-700 border-2 border-slate-600 rounded-md relative">
                    <span className="text-[8px] font-mono text-yellow-400 absolute inset-0 m-auto flex items-center justify-center">Plano α</span>
                  </div>
                  <div className="w-8 h-16 bg-red-900 border-2 border-red-700 rounded-t-md relative flex items-center justify-center">
                    <span className="text-[9px] font-mono text-red-400 absolute top-1">Punto B</span>
                  </div>
                </div>
                {/* Flying laser line representing a line */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-red-500 animate-pulse shadow-red-500 shadow-md transform rotate-12" />
                <span className="absolute top-10 right-4 font-mono text-[9px] text-red-400">Recta r</span>
              </div>

              <div className="space-y-2">
                <span className="text-xl font-bold text-yellow-400 font-mono tracking-wider">MUNDO 1-1: ACADEMIA GEOMÉTRICA</span>
                <p className="text-xs text-slate-400 max-w-sm">
                  Utilizaremos las leyes de las matemáticas y la ayuda de Mario para reconstruir las dimensiones perdidas de la princesa.
                </p>
              </div>

              <button
                id="btn-empezar-aventura"
                onClick={handleNext}
                className="bg-gradient-to-r from-red-600 to-yellow-500 text-white font-mono font-bold px-6 py-3 rounded-xl border-b-4 border-yellow-700 hover:brightness-110 active:border-b-2 active:translate-y-[2px] transition-all flex items-center gap-2 cursor-pointer text-sm"
              >
                ¡Empezar Aventura! <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 2. POINT INTERACTIVE VISUAL */}
          {slide.visualType === 'point' && (
            <div className="w-full h-full flex flex-col justify-between items-center relative p-2">
              <span className="text-xs font-mono text-slate-500 absolute top-2">¡Haz clic en el bloque para golpear y crear el Punto C!</span>

              <div className="flex-1 w-full flex items-center justify-center relative">
                {/* 2D Coordinate Grid */}
                <div className="absolute inset-4 border border-slate-800/60 rounded-xl grid grid-cols-8 grid-rows-6 opacity-30 pointer-events-none">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div key={i} className="border-t border-l border-slate-800/40" />
                  ))}
                </div>

                {/* Animated Question block in center-left */}
                <motion.div
                  id="question-block"
                  onClick={handleHitBlock}
                  animate={questionBlockHit ? { y: [-15, 0] } : {}}
                  transition={{ duration: 0.15 }}
                  className="absolute left-10 top-1/2 -translate-y-1/2 w-16 h-16 bg-yellow-500 rounded-xl border-4 border-yellow-600 shadow-lg flex items-center justify-center font-bold text-slate-900 cursor-pointer active:scale-95 select-none hover:brightness-110 z-10"
                >
                  <span className="text-3xl font-extrabold text-yellow-900">?</span>
                  {/* Screws on corner */}
                  <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-yellow-600 rounded-full" />
                  <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-yellow-600 rounded-full" />
                  <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-yellow-600 rounded-full" />
                  <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-yellow-600 rounded-full" />
                </motion.div>

                {/* Drawn Points on Canvas */}
                <div className="w-full h-48 relative max-w-md bg-slate-950/30 rounded-xl">
                  {/* Points */}
                  {points.map((p) => (
                    <motion.div
                      key={p.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute flex flex-col items-center"
                      style={{ left: p.x, top: p.y }}
                    >
                      {/* Star representation */}
                      <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse border-2 border-yellow-600 flex items-center justify-center shadow-[0_0_10px_rgba(234,179,8,0.8)] relative">
                        <div className="absolute -top-5 bg-slate-900 border border-yellow-500 text-yellow-400 font-mono text-[10px] px-1.5 py-0.5 rounded shadow">
                          Punto {p.label}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono mt-1">x:{p.x}, y:{p.y}</span>
                    </motion.div>
                  ))}

                  {/* Bowser floating face with an angry mark (coordinate point) */}
                  <div className="absolute right-10 top-10 flex flex-col items-center">
                    <div className="text-4xl">👹</div>
                    <div className="w-3 h-3 bg-red-600 rounded-full border border-white absolute -top-1 -right-1 flex items-center justify-center">
                      <div className="absolute -top-5 bg-red-950 text-red-400 font-mono text-[9px] px-1 rounded border border-red-800">
                        Punto D (Enemigo)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Explanation of dimensions */}
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-center text-xs text-slate-300 w-full font-mono max-w-sm">
                <span className="text-yellow-400 font-bold">Dimensión 0:</span> Un punto es infinitesimalmente pequeño. No tiene área, volumen ni dirección. Solo define una <span className="underline">ubicación única</span>.
              </div>
            </div>
          )}

          {/* 3. LINE INTERACTIVE VISUAL */}
          {slide.visualType === 'line' && (
            <div className="w-full h-full flex flex-col justify-between items-center relative p-2">
              <span className="text-xs font-mono text-slate-500 absolute top-2">¡Ajusta la inclinación de la recta r con el control!</span>

              <div className="flex-1 w-full flex items-center justify-center relative">
                {/* 2D Grid */}
                <div className="absolute inset-4 border border-slate-800/60 rounded-xl grid grid-cols-10 grid-rows-8 opacity-20 pointer-events-none">
                  {Array.from({ length: 80 }).map((_, i) => (
                    <div key={i} className="border-t border-l border-slate-800/40" />
                  ))}
                </div>

                <div className="w-full h-48 relative max-w-md flex items-center justify-center">
                  {/* Two points defining the line */}
                  <div className="absolute left-1/4 top-1/3 flex flex-col items-center z-10">
                    <div className="w-3.5 h-3.5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="absolute -top-5 bg-slate-900 text-blue-400 font-mono text-[9px] px-1 rounded border border-blue-800">
                        Punto P
                      </div>
                    </div>
                  </div>
                  <div className="absolute right-1/4 bottom-1/3 flex flex-col items-center z-10">
                    <div className="w-3.5 h-3.5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="absolute -bottom-6 bg-slate-900 text-blue-400 font-mono text-[9px] px-1 rounded border border-blue-800">
                        Punto Q
                      </div>
                    </div>
                  </div>

                  {/* Infinite Line drawing */}
                  <div
                    className="absolute w-full h-1.5 bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)] transition-all duration-150"
                    style={{
                      transform: `rotate(${lineAngle}deg) translateY(${lineOffset - 120}px)`,
                      width: '140%',
                    }}
                  >
                    {/* Directional arrow decorations at ends */}
                    <div className="absolute left-0 -top-1 w-3 h-3 bg-red-500 transform rotate-45 border-l border-b border-white" />
                    <div className="absolute right-0 -top-1 w-3 h-3 bg-red-500 transform rotate-45 border-r border-t border-white" />

                    {/* Label of line */}
                    <div className="absolute left-1/2 -top-6 bg-slate-900 border border-red-500 text-red-400 font-mono text-[10px] px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                      Recta r (pasa por P y Q)
                    </div>
                  </div>

                  {/* Little flying red Shell to make it look active */}
                  <motion.div
                    animate={{ x: [-150, 250], y: [-50, 100] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                    className="absolute text-xl pointer-events-none z-20"
                    style={{ transform: `rotate(${lineAngle}deg)` }}
                  >
                    🐢
                  </motion.div>
                </div>
              </div>

              {/* Interactive sliders */}
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 w-full max-w-sm space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Rotación Recta:</span>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    value={lineAngle}
                    onChange={(e) => {
                      setLineAngle(parseInt(e.target.value));
                      audio.playJump();
                    }}
                    className="flex-1 accent-red-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-red-400 font-bold min-w-[28px] text-right">{lineAngle}°</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 text-center">
                  <span className="text-red-400 font-bold">Dimensión 1:</span> Se extiende en una dirección infinita. Une dos puntos P y Q. <span className="underline">No tiene fin</span>.
                </div>
              </div>
            </div>
          )}

          {/* 4. PLANE INTERACTIVE VISUAL */}
          {slide.visualType === 'plane' && (
            <div className="w-full h-full flex flex-col justify-between items-center relative p-2">
              <span className="text-xs font-mono text-slate-500 absolute top-2">¡Mueve los controles para inclinar la perspectiva del plano α!</span>

              <div className="flex-1 w-full flex items-center justify-center relative">
                {/* 3D Container box */}
                <div
                  className="w-64 h-40 bg-slate-900/30 border border-slate-800/40 rounded-xl relative flex items-center justify-center overflow-visible"
                  style={{ perspective: '400px' }}
                >
                  {/* Glowing 3D Plane represented as a tilted grid sheet */}
                  <motion.div
                    className="w-48 h-32 bg-gradient-to-tr from-pink-500/20 via-purple-500/10 to-pink-500/25 border-2 border-pink-500 rounded-lg relative flex items-center justify-center shadow-[0_0_20px_rgba(244,114,182,0.3)]"
                    style={{
                      transform: `rotateX(${planeTilt}deg) rotateY(${planeRotate}deg)`,
                      transformStyle: 'preserve-3d',
                    }}
                    transition={{ type: 'spring', stiffness: 80 }}
                  >
                    {/* Tiny grid marks inside plane */}
                    <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-40 pointer-events-none">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className="border-t border-l border-pink-500/30" />
                      ))}
                    </div>

                    {/* Labeled points resting inside the plane */}
                    <div className="absolute left-6 top-8 w-2 h-2 bg-pink-400 rounded-full flex items-center justify-center">
                      <span className="absolute -top-4 text-[9px] font-mono text-pink-300">Punto A</span>
                    </div>
                    <div className="absolute right-8 bottom-6 w-2 h-2 bg-pink-400 rounded-full flex items-center justify-center">
                      <span className="absolute -bottom-4 text-[9px] font-mono text-pink-300">Punto B</span>
                    </div>
                    <div className="absolute right-12 top-10 w-2 h-2 bg-pink-400 rounded-full flex items-center justify-center">
                      <span className="absolute -top-4 text-[9px] font-mono text-pink-300">Punto C</span>
                    </div>

                    {/* Recta inside the plane */}
                    <div className="absolute left-0 right-0 h-0.5 bg-yellow-400 transform rotate-12">
                      <span className="absolute left-2 -top-3 text-[8px] font-mono text-yellow-300">Recta s</span>
                    </div>

                    {/* Flat Mario icon sitting on the plane */}
                    <div className="absolute inset-0 m-auto w-10 h-10 flex items-center justify-center text-2xl select-none" style={{ transform: 'translateZ(10px) rotateX(-10deg)' }}>
                      🚶‍♂️
                    </div>

                    {/* Label of Plane */}
                    <div className="absolute -bottom-5 right-2 bg-slate-900 border border-pink-500 text-pink-400 font-mono text-[10px] px-1.5 py-0.5 rounded shadow">
                      Plano α (Alfa)
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Tilt controls */}
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 w-full max-w-sm space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-mono text-slate-400 uppercase">Inclinación X:</span>
                    <input
                      type="range"
                      min="10"
                      max="60"
                      value={planeTilt}
                      onChange={(e) => setPlaneTilt(parseInt(e.target.value))}
                      className="accent-pink-500 h-1 bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-mono text-slate-400 uppercase">Rotación Y:</span>
                    <input
                      type="range"
                      min="-45"
                      max="45"
                      value={planeRotate}
                      onChange={(e) => setPlaneRotate(parseInt(e.target.value))}
                      className="accent-pink-500 h-1 bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
                <div className="text-[10px] font-mono text-slate-400 text-center">
                  <span className="text-pink-400 font-bold">Dimensión 2:</span> Superficie lisa bidimensional. Contiene infinitos puntos y rectas. <span className="underline">Se extiende sin límites</span>.
                </div>
              </div>
            </div>
          )}

          {/* 5. 3D COORDINATE SYSTEM */}
          {slide.visualType === 'space' && (
            <div className="w-full h-full flex flex-col justify-between items-center relative p-2">
              <span className="text-xs font-mono text-slate-500 absolute top-2">¡Controla a Mario en las 3 dimensiones del espacio!</span>

              <div className="flex-1 w-full flex items-center justify-center relative">
                {/* 3D Isometric grid box */}
                <div className="w-64 h-44 bg-slate-950 rounded-xl relative border-2 border-slate-800 flex items-center justify-center overflow-visible">
                  {/* Origin axes lines (X, Y, Z) */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {/* Eje X (Horizontal - Green) */}
                    <div className="absolute w-44 h-[2px] bg-green-500/40">
                      <span className="absolute -right-4 -top-2 font-mono text-[10px] text-green-400 font-bold">X</span>
                    </div>
                    {/* Eje Y (Vertical - Blue) */}
                    <div className="absolute w-[2px] h-32 bg-blue-500/40">
                      <span className="absolute -top-4 -left-1 font-mono text-[10px] text-blue-400 font-bold">Y</span>
                    </div>
                    {/* Eje Z (Depth - Red, drawn diagonally for perspective) */}
                    <div className="absolute w-40 h-[2px] bg-red-500/40 transform rotate-[30deg]">
                      <span className="absolute -right-4 -top-2 font-mono text-[10px] text-red-400 font-bold">Z</span>
                    </div>
                  </div>

                  {/* Interactive Mario avatar representing current (X, Y, Z) */}
                  <motion.div
                    className="absolute flex flex-col items-center z-30"
                    style={{
                      // Map state (0-100) to pixel offsets on X, Y, and Z axes
                      x: (coordX - 50) * 1.5 + (coordZ - 50) * 0.8,
                      y: -(coordY - 50) * 1.2 + (coordZ - 50) * 0.4,
                    }}
                    transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                  >
                    {/* Small tag displaying Coordinates */}
                    <div className="bg-slate-900/90 text-white border border-yellow-500 rounded px-1.5 py-0.5 font-mono text-[9px] mb-1 whitespace-nowrap shadow-md">
                      Punto P <span className="text-yellow-400 font-bold">({coordX}, {coordY}, {coordZ})</span>
                    </div>
                    {/* Mario jumping sprite or emoji */}
                    <div className="text-3xl animate-bounce">🏃‍♂️</div>
                    {/* Shadow on Z floor */}
                    <div
                      className="w-6 h-1.5 bg-black/60 rounded-full blur-[1px] mt-0.5 transition-all"
                      style={{
                        transform: `scale(${1 - coordY / 150})`,
                        opacity: 1 - coordY / 120,
                      }}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Coordinate Sliders */}
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 w-full max-w-sm space-y-1.5 text-[10px] font-mono">
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col gap-0.5 bg-green-950/20 p-1.5 rounded border border-green-900/30">
                    <span className="text-green-400 font-bold uppercase text-[8px]">Eje X (Ancho):</span>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={coordX}
                      onChange={(e) => {
                        setCoordX(parseInt(e.target.value));
                        audio.playJump();
                      }}
                      className="accent-green-500 h-1 cursor-pointer w-full"
                    />
                    <span className="text-center text-green-300 font-bold mt-0.5">{coordX}px</span>
                  </div>

                  <div className="flex flex-col gap-0.5 bg-blue-950/20 p-1.5 rounded border border-blue-900/30">
                    <span className="text-blue-400 font-bold uppercase text-[8px]">Eje Y (Alto/Salto):</span>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={coordY}
                      onChange={(e) => {
                        setCoordY(parseInt(e.target.value));
                        audio.playJump();
                      }}
                      className="accent-blue-500 h-1 cursor-pointer w-full"
                    />
                    <span className="text-center text-blue-300 font-bold mt-0.5">{coordY}px</span>
                  </div>

                  <div className="flex flex-col gap-0.5 bg-red-950/20 p-1.5 rounded border border-red-900/30">
                    <span className="text-red-400 font-bold uppercase text-[8px]">Eje Z (Fondo):</span>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={coordZ}
                      onChange={(e) => {
                        setCoordZ(parseInt(e.target.value));
                        audio.playJump();
                      }}
                      className="accent-red-500 h-1 cursor-pointer w-full"
                    />
                    <span className="text-center text-red-300 font-bold mt-0.5">{coordZ}px</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. REAL LIFE EXAMPLES TABLE */}
          {slide.visualType === 'examples' && (
            <div className="w-full h-full flex flex-col justify-between items-center relative p-2">
              <span className="text-xs font-mono text-slate-500 absolute top-2">¡Compara la geometría del aula y del videojuego!</span>

              <div className="flex-1 w-full flex items-center justify-center p-2 mt-4">
                <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 space-y-2.5 w-full text-xs">
                  {/* Item 1 */}
                  <div className="bg-slate-950 p-2 rounded border-l-4 border-yellow-500 flex items-start gap-2">
                    <span className="text-lg">🪙</span>
                    <div>
                      <strong className="text-yellow-400 font-mono block">PUNTO (0D)</strong>
                      <p className="text-[11px] text-slate-300">Una esquina del bloque, la punta de la bandera, la esquina de tu mesa.</p>
                    </div>
                  </div>
                  {/* Item 2 */}
                  <div className="bg-slate-950 p-2 rounded border-l-4 border-red-500 flex items-start gap-2">
                    <span className="text-lg">⚡</span>
                    <div>
                      <strong className="text-red-400 font-mono block">RECTA (1D)</strong>
                      <p className="text-[11px] text-slate-300">El rayo de Bowser, el mástil metálico, el borde recto del tablero.</p>
                    </div>
                  </div>
                  {/* Item 3 */}
                  <div className="bg-slate-950 p-2 rounded border-l-4 border-pink-500 flex items-start gap-2">
                    <span className="text-lg">🧱</span>
                    <div>
                      <strong className="text-pink-400 font-mono block">PLANO (2D)</strong>
                      <p className="text-[11px] text-slate-300">La superficie plana de un bloque de ladrillos, el suelo, la pared lisa del aula.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-mono text-slate-400 text-center bg-slate-900/60 p-2 rounded-lg border border-slate-800 w-full max-w-sm">
                💡 <span className="text-yellow-400 font-bold">Consejo:</span> Busca estos elementos a tu alrededor. ¡Los necesitarás para las siguientes misiones de reconstrucción!
              </div>
            </div>
          )}

          {/* 7. SUMMARY & ASSESSMENT CHIP */}
          {slide.visualType === 'summary' && (
            <div className="w-full h-full flex flex-col justify-between items-center relative p-2 overflow-y-auto">
              {!quizSubmitted ? (
                <div className="w-full space-y-3 p-1">
                  <div className="bg-yellow-950/20 p-2 rounded border border-yellow-900 text-center">
                    <span className="text-[10px] font-mono text-yellow-400 font-bold tracking-wider uppercase">📝 MINI EXAMEN DE ADMISIÓN</span>
                    <h4 className="text-xs text-white font-semibold">¡Responde para ganar un bonus de monedas doradas!</h4>
                  </div>

                  <div className="space-y-3 text-left">
                    {/* Q1 */}
                    <div className="space-y-1">
                      <p className="text-[11px] text-slate-300 font-semibold">1. ¿Qué dimensiones posee un Punto geométrico?</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {['1 dimensión', '2 dimensiones', '0 dimensiones'].map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleQuizAnswer(0, i)}
                            className={`p-1.5 rounded font-mono text-[9px] border text-center transition-all ${
                              quizAnswers[0] === i
                                ? 'bg-yellow-500 text-slate-950 border-yellow-400 font-bold'
                                : 'bg-slate-900 hover:bg-slate-850 text-slate-400 border-slate-800'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Q2 */}
                    <div className="space-y-1">
                      <p className="text-[11px] text-slate-300 font-semibold">2. El mástil recto de una bandera representa:</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {['Una Recta', 'Un Plano', 'Un Punto'].map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleQuizAnswer(1, i)}
                            className={`p-1.5 rounded font-mono text-[9px] border text-center transition-all ${
                              quizAnswers[1] === i
                                ? 'bg-red-500 text-white border-red-400 font-bold'
                                : 'bg-slate-900 hover:bg-slate-850 text-slate-400 border-slate-800'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Q3 */}
                    <div className="space-y-1">
                      <p className="text-[11px] text-slate-300 font-semibold">3. La superficie del suelo de ladrillo es:</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {['Un Punto', 'Un Plano', 'Una Recta'].map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleQuizAnswer(2, i)}
                            className={`p-1.5 rounded font-mono text-[9px] border text-center transition-all ${
                              quizAnswers[2] === i
                                ? 'bg-pink-500 text-white border-pink-400 font-bold'
                                : 'bg-slate-900 hover:bg-slate-850 text-slate-400 border-slate-800'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    id="btn-enviar-quiz"
                    onClick={handleSubmitQuiz}
                    disabled={quizAnswers[0] === undefined || quizAnswers[1] === undefined || quizAnswers[2] === undefined}
                    className="w-full bg-green-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:border-slate-900 text-white font-mono font-bold text-xs py-2 rounded-lg border-b-4 border-green-800 hover:brightness-110 active:border-b-2 active:translate-y-[1px] cursor-pointer transition-all uppercase"
                  >
                    Enviar Respuestas y Calificar
                  </button>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-4 py-6">
                  <div className="w-16 h-16 bg-yellow-500 rounded-full border-4 border-yellow-400 flex items-center justify-center animate-bounce shadow-lg">
                    <Award className="w-9 h-9 text-slate-950" />
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-lg font-bold text-yellow-400 font-mono">¡EXAMEN COMPLETADO!</h4>
                    <p className="text-sm text-white font-mono">
                      Calificación: <span className="text-green-400 font-extrabold">{quizScore} / 3 Correctas</span>
                    </p>
                    <p className="text-xs text-slate-400 max-w-xs">
                      {quizScore === 3
                        ? '¡Perfecto! Has ganado un super bonus de +60 monedas de oro.'
                        : quizScore > 0
                        ? `¡Excelente esfuerzo! Has ganado +${quizScore * 20} monedas de oro.`
                        : '¡No te preocupes! Vuelve a revisar los conceptos y sigue intentándolo.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-yellow-950/50 px-4 py-2 rounded-xl border border-yellow-600">
                    <Coins className="w-5 h-5 text-yellow-400 animate-pulse" />
                    <span className="text-yellow-400 font-mono font-bold">+{quizScore * 20} Monedas de Oro</span>
                  </div>

                  <button
                    id="btn-ir-taller"
                    onClick={handleNext}
                    className="bg-green-600 text-white font-mono font-bold text-xs px-6 py-2.5 rounded-lg border-b-4 border-green-800 hover:brightness-110 active:border-b-2 active:translate-y-[1px] transition-all cursor-pointer"
                  >
                    Ir al Taller Práctico
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Footer Controls */}
      <div className="bg-[#43B047] px-6 py-4 flex justify-between items-center border-t-4 border-black">
        <button
          id="btn-slide-anterior"
          onClick={handlePrev}
          disabled={currentSlideIndex === 0}
          className="flex items-center gap-1.5 bg-white disabled:bg-gray-200 border-4 border-black text-black font-sans font-black text-xs px-4 py-2.5 rounded-xl hover:bg-gray-100 active:translate-y-[2px] active:shadow-none transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] uppercase disabled:opacity-50 select-none"
        >
          <ChevronLeft className="w-4 h-4 text-black" /> Anterior
        </button>

        <span className="text-white font-sans text-xs font-black uppercase hidden sm:inline-block">
          Usa los botones para navegar la lección
        </span>

        <button
          id="btn-slide-siguiente"
          onClick={handleNext}
          className="flex items-center gap-1.5 bg-[#E52521] border-4 border-black text-white font-sans font-black text-xs px-5 py-2.5 rounded-xl hover:brightness-110 active:translate-y-[2px] active:shadow-none cursor-pointer transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] select-none uppercase"
        >
          {currentSlideIndex === LESSONS.length - 1 ? (
            <>Finalizar Lección <Award className="w-4 h-4" /></>
          ) : (
            <>Siguiente <ChevronRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  );
}
