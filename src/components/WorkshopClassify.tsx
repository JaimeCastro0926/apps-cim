import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, CheckCircle, XCircle, Coins, Award, ArrowRight, HelpCircle } from 'lucide-react';
import { CLASSIFICATION_ITEMS } from '../data/lessons';
import { audio } from '../utils/audio';

interface WorkshopClassifyProps {
  onComplete: (score: number) => void;
  addCoins: (amount: number) => void;
  coins: number;
}

export default function WorkshopClassify({ onComplete, addCoins, coins }: WorkshopClassifyProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<{ status: 'correct' | 'incorrect'; message: string } | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const currentItem = CLASSIFICATION_ITEMS[currentIndex];

  const handleClassify = (selectedType: 'point' | 'line' | 'plane') => {
    if (feedback) return; // Prevent double clicks during feedback

    const isCorrect = currentItem.type === selectedType;

    if (isCorrect) {
      audio.playCorrect();
      setCorrectCount(prev => prev + 1);
      addCoins(10);
      setFeedback({
        status: 'correct',
        message: `¡Excelente! La "${currentItem.name}" es un excelente modelo de un ${selectedType.toUpperCase()} en geometría. ${currentItem.description}`
      });
    } else {
      audio.playWrong();
      const typeLabels = { point: 'Punto (0D)', line: 'Recta (1D)', plane: 'Plano (2D)' };
      setFeedback({
        status: 'incorrect',
        message: `¡Oh no! El elemento "${currentItem.name}" corresponde a un ${typeLabels[currentItem.type].toUpperCase()}. Recuerda: ${currentItem.description}`
      });
    }
  };

  const handleNext = () => {
    setFeedback(null);
    if (currentIndex < CLASSIFICATION_ITEMS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      audio.playJump();
    } else {
      setIsGameOver(true);
      const finalScore = Math.round((correctCount / CLASSIFICATION_ITEMS.length) * 100);
      onComplete(finalScore);
      audio.playLevelClear();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#EBF3FF] border-8 border-black rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
      {/* Header Info */}
      <div className="bg-[#43B047] px-6 py-3.5 flex justify-between items-center border-b-4 border-black text-white font-sans text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-white font-black uppercase">
          <Layers className="w-5 h-5" />
          <span>MISIÓN 3 • LA TUBERÍA CLASIFICADORA</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-white text-black font-black px-3 py-1 rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Coins className="w-4 h-4 text-[#FBD000] animate-pulse" />
            <span className="text-black font-black uppercase text-xs">{coins} MONEDAS</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      {!isGameOver ? (
        <div className="flex-1 flex flex-col p-6 gap-6 justify-between overflow-y-auto">
          {/* Progress bar */}
          <div className="w-full space-y-1">
            <div className="flex justify-between text-xs font-sans font-black text-black">
              <span>CLASIFICANDO COFRES GEOMÉTRICOS</span>
              <span>ELEMENTO {currentIndex + 1} DE {CLASSIFICATION_ITEMS.length}</span>
            </div>
            <div className="w-full bg-white h-4 rounded-full overflow-hidden border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div
                className="bg-[#43B047] h-full transition-all duration-300 border-r-2 border-black"
                style={{ width: `${((currentIndex + 1) / CLASSIFICATION_ITEMS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Flashcard to classify */}
          <div className="flex-1 flex items-center justify-center max-w-lg mx-auto w-full my-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentItem.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl border-4 border-black p-6 flex flex-col items-center justify-center text-center space-y-4 w-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden text-black"
              >
                {/* Decorative retro block corners */}
                <div className="absolute top-2 left-2 text-black/40 text-[10px] font-sans font-black">❓</div>
                <div className="absolute top-2 right-2 text-black/40 text-[10px] font-sans font-black">❓</div>

                {/* Big element Icon */}
                <div className="w-24 h-24 bg-[#EBF3FF] rounded-full border-4 border-black flex items-center justify-center text-5xl relative shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <motion.span
                    animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 0.95, 1] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  >
                    {currentItem.icon}
                  </motion.span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg font-black text-black tracking-wide uppercase">{currentItem.name}</h4>
                  <p className="text-xs text-gray-700 max-w-xs font-sans font-bold">
                    ¿Cuál de los 3 elementos básicos representa mejor este objeto del Reino?
                  </p>
                </div>

                {/* Feedback overlay */}
                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`w-full p-4 rounded-xl border-4 border-black flex items-start gap-3 text-left z-10 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                        feedback.status === 'correct'
                          ? 'bg-[#EBF3FF] text-[#049CD8]'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {feedback.status === 'correct' ? (
                        <CheckCircle className="w-5 h-5 shrink-0 text-[#049CD8] mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
                      )}
                      <div className="space-y-1">
                        <strong className="text-xs font-sans font-black uppercase block">
                          {feedback.status === 'correct' ? '¡Correcto! +10 Monedas' : 'Incorrecto'}
                        </strong>
                        <p className="text-xs leading-relaxed font-bold">{feedback.message}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pipes Selection Underneath */}
          {!feedback ? (
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto w-full">
              {/* Point Pipe */}
              <button
                id="pipe-point"
                onClick={() => handleClassify('point')}
                className="flex flex-col items-center group cursor-pointer"
              >
                {/* Pipe Top flange */}
                <div className="w-20 sm:w-24 h-7 bg-[#43B047] rounded-md border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-sans text-[10px] text-white font-black group-hover:brightness-110 transition-all uppercase">
                  PUNTO (0D)
                </div>
                {/* Pipe Column Body */}
                <div className="w-16 sm:w-20 h-10 sm:h-12 bg-green-700 border-x-4 border-b-4 border-t-0 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative flex justify-center items-center">
                  <span className="text-2xl group-hover:-translate-y-2 transition-all">🪙</span>
                  <div className="absolute right-1 w-1 bg-green-600 h-full opacity-30" />
                </div>
              </button>

              {/* Line Pipe */}
              <button
                id="pipe-line"
                onClick={() => handleClassify('line')}
                className="flex flex-col items-center group cursor-pointer"
              >
                {/* Pipe Top flange */}
                <div className="w-20 sm:w-24 h-7 bg-[#43B047] rounded-md border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-sans text-[10px] text-white font-black group-hover:brightness-110 transition-all uppercase">
                  RECTA (1D)
                </div>
                {/* Pipe Column Body */}
                <div className="w-16 sm:w-20 h-10 sm:h-12 bg-green-700 border-x-4 border-b-4 border-t-0 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative flex justify-center items-center">
                  <span className="text-2xl group-hover:-translate-y-2 transition-all">⚡</span>
                  <div className="absolute right-1 w-1 bg-green-600 h-full opacity-30" />
                </div>
              </button>

              {/* Plane Pipe */}
              <button
                id="pipe-plane"
                onClick={() => handleClassify('plane')}
                className="flex flex-col items-center group cursor-pointer"
              >
                {/* Pipe Top flange */}
                <div className="w-20 sm:w-24 h-7 bg-[#43B047] rounded-md border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-sans text-[10px] text-white font-black group-hover:brightness-110 transition-all uppercase">
                  PLANO (2D)
                </div>
                {/* Pipe Column Body */}
                <div className="w-16 sm:w-20 h-10 sm:h-12 bg-green-700 border-x-4 border-b-4 border-t-0 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative flex justify-center items-center">
                  <span className="text-2xl group-hover:-translate-y-2 transition-all">🧱</span>
                  <div className="absolute right-1 w-1 bg-green-600 h-full opacity-30" />
                </div>
              </button>
            </div>
          ) : (
            /* Next Button when feedback is open */
            <div className="flex justify-center max-w-sm mx-auto w-full font-sans">
              <button
                id="btn-siguiente-clasificacion"
                onClick={handleNext}
                className="w-full bg-[#E52521] text-white border-4 border-black font-sans font-black text-xs py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:brightness-110 active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer uppercase"
              >
                Siguiente Elemento <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Game Over Score view */
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 text-black bg-white/40 rounded-xl m-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="w-20 h-20 bg-[#FBD000] rounded-full border-4 border-black flex items-center justify-center animate-bounce shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Award className="w-12 h-12 text-black" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-[#E52521] font-sans uppercase">¡MISIÓN 3 COMPLETADA!</h3>
            <p className="text-sm text-gray-800 font-bold max-w-md mx-auto">
              ¡Increíble trabajo! Has clasificado todos los elementos perdidos del Reino Champiñón en sus correspondientes tuberías tridimensionales. La estabilidad molecular del espacio se ha reestablecido por completo.
            </p>
          </div>

          <div className="bg-white px-6 py-4 rounded-2xl border-4 border-black space-y-2 max-w-xs w-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between text-xs font-sans font-black uppercase text-gray-600">
              <span>Total Respuestas:</span>
              <span>{CLASSIFICATION_ITEMS.length}</span>
            </div>
            <div className="flex justify-between text-xs font-sans font-black uppercase text-[#43B047]">
              <span>Respuestas Correctas:</span>
              <span>{correctCount}</span>
            </div>
            <div className="flex justify-between text-xs font-sans font-black uppercase text-[#049CD8] border-t-2 border-black pt-2">
              <span>Puntuación Precisión:</span>
              <span>{Math.round((correctCount / CLASSIFICATION_ITEMS.length) * 100)}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#FBD000] px-5 py-2.5 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Coins className="w-5 h-5 text-black animate-pulse" />
            <span className="text-black font-sans font-black uppercase">+{correctCount * 10} Monedas de Oro Ganadas</span>
          </div>

          <button
            id="btn-finalizar-mision-3"
            onClick={() => onComplete(Math.round((correctCount / CLASSIFICATION_ITEMS.length) * 100))}
            className="bg-[#43B047] text-white border-4 border-black font-sans font-black text-xs px-6 py-3 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:brightness-110 active:translate-y-[2px] active:shadow-none transition-all cursor-pointer uppercase"
          >
            Finalizar y Guardar Resultados
          </button>
        </div>
      )}
    </div>
  );
}
