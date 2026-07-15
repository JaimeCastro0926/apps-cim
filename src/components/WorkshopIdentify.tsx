import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, CheckCircle, HelpCircle, Coins, Award, Compass } from 'lucide-react';
import { SEARCH_ITEMS } from '../data/lessons';
import { audio } from '../utils/audio';

interface WorkshopIdentifyProps {
  onComplete: (score: number) => void;
  addCoins: (amount: number) => void;
  coins: number;
}

export default function WorkshopIdentify({ onComplete, addCoins, coins }: WorkshopIdentifyProps) {
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<typeof SEARCH_ITEMS[0] | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const handleItemClick = (item: typeof SEARCH_ITEMS[0]) => {
    setSelectedItem(item);
    if (!foundIds.includes(item.id)) {
      const updatedFound = [...foundIds, item.id];
      setFoundIds(updatedFound);
      audio.playCoin();
      addCoins(20);
    } else {
      audio.playJump();
    }
  };

  const handleFinish = () => {
    const finalScore = Math.round((foundIds.length / SEARCH_ITEMS.length) * 100);
    onComplete(finalScore);
    audio.playLevelClear();
    setShowSummary(true);
  };

  const pointsCount = foundIds.filter(id => SEARCH_ITEMS.find(item => item.id === id)?.type === 'point').length;
  const linesCount = foundIds.filter(id => SEARCH_ITEMS.find(item => item.id === id)?.type === 'line').length;
  const planesCount = foundIds.filter(id => SEARCH_ITEMS.find(item => item.id === id)?.type === 'plane').length;

  return (
    <div className="flex flex-col h-full bg-[#EBF3FF] border-8 border-black rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
      {/* Header Info */}
      <div className="bg-[#43B047] px-6 py-3.5 flex justify-between items-center border-b-4 border-black text-white font-sans text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-white font-black uppercase">
          <Compass className="w-5 h-5 animate-spin" />
          <span>MISIÓN 1 • EXPLORADOR GEOMÉTRICO</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-white text-black font-black px-3 py-1 rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Coins className="w-4 h-4 text-[#FBD000] animate-pulse" />
            <span className="text-black font-black uppercase text-xs">{coins} MONEDAS</span>
          </div>
        </div>
      </div>

      {/* Main Mission Content */}
      {!showSummary ? (
        <div className="flex-1 flex flex-col xl:flex-row p-6 gap-6 overflow-y-auto">
          {/* Visual Map Area */}
          <div className="flex-1 flex flex-col space-y-4">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-black uppercase font-sans">Misión: Reparar el Castillo de Peach</h3>
              <p className="text-xs text-gray-800 font-bold">
                ¡Haz clic en los destellos geométricos amarillos en el mapa interactivo para identificarlos y agregarlos al estabilizador!
              </p>
            </div>

            {/* Interactive Graphic Scene */}
            <div className="relative w-full aspect-[16/10] min-h-[300px] bg-gradient-to-b from-sky-300 via-sky-100 to-green-100 border-4 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {/* Sun/Cloud background elements */}
              <div className="absolute top-6 left-10 w-16 h-16 bg-yellow-200 rounded-full blur-sm opacity-85" />
              <div className="absolute top-10 right-20 w-24 h-8 bg-white/70 rounded-full blur-[1px]" />
              <div className="absolute top-16 left-32 w-16 h-6 bg-white/60 rounded-full blur-[2px]" />

              {/* Distant mountains/hills */}
              <div className="absolute bottom-16 left-0 w-full h-32 bg-green-200/60 rounded-t-[120px] transform translate-y-8" />
              <div className="absolute bottom-16 right-0 w-2/3 h-40 bg-green-300/40 rounded-t-[160px] transform translate-y-12" />

              {/* THE CASTLE DRAWING (Geometric Blocks using absolute positioning) */}
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-72 h-48 flex flex-col justify-end items-center">
                {/* Roof Cone / Peak (Star target s1) */}
                <div className="w-0 h-0 border-l-[36px] border-r-[36px] border-b-[48px] border-l-transparent border-r-transparent border-b-red-500 relative">
                  {/* Castle Peak Tower Center */}
                  <div className="absolute top-10 -left-1.5 w-3 h-10 bg-slate-100" />
                </div>
                {/* Castle Main Structure (s6 Wall) */}
                <div className="w-56 h-32 bg-slate-100 border-4 border-slate-300 rounded-t-md relative flex flex-col justify-between p-4 shadow-lg">
                  {/* Castle Windows */}
                  <div className="flex justify-around w-full">
                    <div className="w-6 h-10 bg-sky-400 rounded-t-full border border-slate-300" />
                    <div className="w-6 h-10 bg-sky-400 rounded-t-full border border-slate-300" />
                  </div>
                  {/* Castle Arch Gate */}
                  <div className="w-16 h-14 bg-yellow-950/20 border-t-4 border-x-4 border-amber-600 rounded-t-full self-center flex items-center justify-center">
                    <div className="w-10 h-10 bg-yellow-950/40 rounded-t-full" />
                  </div>
                </div>
              </div>

              {/* Question Box Block (Target s5) */}
              <div className="absolute left-[30%] top-[45%] w-10 h-10 bg-yellow-500 border-2 border-yellow-600 rounded shadow-md flex items-center justify-center font-bold text-yellow-900 select-none">
                ?
              </div>

              {/* Wooden Bridge (Target s3 Floor, s4 Support Truss) */}
              <div className="absolute bottom-4 left-6 right-6 h-16 relative">
                {/* Flat Bridge Deck */}
                <div className="absolute top-0 w-full h-4 bg-amber-700 border-t-2 border-b-2 border-amber-800 flex justify-between px-6">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="w-[1px] h-full bg-amber-950/40" />
                  ))}
                </div>
                {/* Bridge Supports (Lines s4) */}
                <div className="absolute bottom-0 left-[15%] w-3 h-12 bg-amber-850" />
                <div className="absolute bottom-0 right-[15%] w-3 h-12 bg-amber-850" />
                {/* Diagonal supporting trusses */}
                <div className="absolute top-3 left-[18%] w-16 h-1 border-t-2 border-amber-900 transform rotate-12 origin-top-left" />
                <div className="absolute top-3 right-[18%] w-16 h-1 border-t-2 border-amber-900 transform -rotate-12 origin-top-right" />
              </div>

              {/* Flagpole Landmark (Target s2 Flagpole) */}
              <div className="absolute right-[12%] bottom-16 h-40 w-1 bg-slate-500">
                {/* Flag */}
                <div className="absolute top-4 left-1 w-12 h-8 bg-red-600 border border-red-700 rounded-r flex items-center justify-center text-white text-[10px] font-bold font-mono">
                  M
                </div>
              </div>

              {/* Floating interactive highlight circles (glowing star markers) */}
              {SEARCH_ITEMS.map((item) => {
                const isFound = foundIds.includes(item.id);
                return (
                  <motion.button
                    id={`marker-${item.id}`}
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className="absolute z-20 cursor-pointer"
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                    whileHover={{ scale: 1.2 }}
                    animate={{
                      boxShadow: isFound
                        ? ['0 0 4px rgba(34,197,94,0.5)', '0 0 12px rgba(34,197,94,0.8)', '0 0 4px rgba(34,197,94,0.5)']
                        : ['0 0 6px rgba(234,179,8,0.6)', '0 0 16px rgba(234,179,8,1)', '0 0 6px rgba(234,179,8,0.6)']
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <div className={`p-1.5 rounded-full border-2 ${
                      isFound ? 'bg-green-500 border-green-300 text-white' : 'bg-yellow-400 border-white text-slate-900'
                    } flex items-center justify-center`}>
                      <Star className={`w-3.5 h-3.5 ${isFound ? 'fill-white' : 'fill-slate-900 animate-spin'}`} />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Side Info & Selected Item Panel */}
          <div className="w-full xl:w-80 flex flex-col gap-6 justify-between shrink-0">
            {/* Found list checklist */}
            <div className="bg-white p-4 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4 text-black">
              <div className="flex items-center justify-between border-b-2 border-black pb-2">
                <span className="text-xs font-sans font-black">ESTABILIZADOR:</span>
                <span className="text-xs font-sans font-black text-[#E52521]">
                  {foundIds.length} / {SEARCH_ITEMS.length} ENCONTRADOS
                </span>
              </div>

              {/* Mini counters */}
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-sans font-black uppercase text-black">
                <div className="bg-gray-50 p-2 rounded border-2 border-black">
                  <span className="text-[#049CD8] font-black block">{pointsCount} / 2</span>
                  <span className="text-gray-700">Puntos (0D)</span>
                </div>
                <div className="bg-gray-50 p-2 rounded border-2 border-black">
                  <span className="text-[#E52521] font-black block">{linesCount} / 2</span>
                  <span className="text-gray-700">Rectas (1D)</span>
                </div>
                <div className="bg-gray-50 p-2 rounded border-2 border-black">
                  <span className="text-[#43B047] font-black block">{planesCount} / 2</span>
                  <span className="text-gray-700">Planos (2D)</span>
                </div>
              </div>

              <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
                {SEARCH_ITEMS.map((item) => {
                  const isFound = foundIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-2 rounded text-xs font-sans font-bold border-2 ${
                        isFound ? 'bg-[#EBF3FF] border-[#049CD8] text-[#049CD8]' : 'bg-gray-50 border-black/10 text-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px]">
                          {item.type === 'point' && '🪙'}
                          {item.type === 'line' && '⚡'}
                          {item.type === 'plane' && '🧱'}
                        </span>
                        <span>{item.name}</span>
                      </div>
                      <span className="text-[9px] font-bold">
                        {isFound ? '✓ OK' : '✕ FALTA'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected item details */}
            <div className="flex-1 min-h-[150px] bg-white p-4 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center text-black">
              <AnimatePresence mode="wait">
                {selectedItem ? (
                  <motion.div
                    key={selectedItem.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-2.5 text-left"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">
                        {selectedItem.type === 'point' && '🪙'}
                        {selectedItem.type === 'line' && '⚡'}
                        {selectedItem.type === 'plane' && '🧱'}
                      </span>
                      <span className="text-xs font-sans font-black text-[#E52521] uppercase">
                        {selectedItem.marioRef}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-black uppercase">{selectedItem.name}</h4>
                    <p className="text-xs text-gray-800 font-semibold leading-relaxed bg-gray-50 p-2.5 rounded border-2 border-black">
                      {selectedItem.description}
                    </p>
                    <div className="bg-[#43B047] text-white border-2 border-black p-2 rounded text-center font-sans font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      ✓ ¡+20 Monedas de Oro agregadas!
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center text-gray-400 py-6 space-y-2">
                    <HelpCircle className="w-8 h-8 mx-auto text-gray-300 animate-pulse" />
                    <p className="text-xs font-sans font-bold">Selecciona cualquier destello brillante en el mapa para examinar su geometría.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Complete button */}
            <button
              id="btn-completar-mision-1"
              onClick={handleFinish}
              disabled={foundIds.length < SEARCH_ITEMS.length}
              className="w-full bg-[#E52521] disabled:bg-gray-200 disabled:text-gray-400 border-4 border-black text-white font-sans font-black text-xs py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer uppercase"
            >
              {foundIds.length === SEARCH_ITEMS.length
                ? '¡Reconstrucción Lista! Finalizar Misión'
                : `Faltan ${SEARCH_ITEMS.length - foundIds.length} elementos por encontrar`}
            </button>
          </div>
        </div>
      ) : (
        /* Summary view once clicked */
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 text-black bg-white/40 rounded-xl m-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="w-20 h-20 bg-[#43B047] rounded-full border-4 border-black flex items-center justify-center animate-bounce shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-[#43B047] font-sans uppercase">¡MISIÓN 1 COMPLETADA!</h3>
            <p className="text-sm text-gray-800 font-bold max-w-md mx-auto">
              ¡Increíble! Has identificado con éxito los puntos de anclaje, los cables tensores de apoyo y los planos de la fachada del castillo de la Princesa Peach. Los estabilizadores dimensionales han neutralizado la anomalía de Bowser.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center max-w-sm w-full font-sans text-xs font-black uppercase text-black">
            <div className="bg-white p-3 rounded-xl border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-[#FBD000] font-black block text-lg">2</span>
              <span>Puntos</span>
            </div>
            <div className="bg-white p-3 rounded-xl border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-[#E52521] font-black block text-lg">2</span>
              <span>Rectas</span>
            </div>
            <div className="bg-white p-3 rounded-xl border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-[#049CD8] font-black block text-lg">2</span>
              <span>Planos</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#FBD000] px-5 py-2.5 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Coins className="w-5 h-5 text-black animate-pulse" />
            <span className="text-black font-sans font-black uppercase">+120 Monedas de Oro Ganadas</span>
          </div>

          <p className="text-[10px] text-gray-700 font-sans font-black uppercase">
            Las monedas se han añadido a tu inventario. ¡Prepárate para la Misión 2 de Dibujo Geométrico!
          </p>
        </div>
      )}
    </div>
  );
}
