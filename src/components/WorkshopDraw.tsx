import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit3, CheckCircle, RotateCcw, Plus, Trash2, Coins, Layers, HelpCircle } from 'lucide-react';
import { audio } from '../utils/audio';

interface WorkshopDrawProps {
  onComplete: () => void;
  addCoins: (amount: number) => void;
  coins: number;
}

interface GeometricElement {
  id: string;
  type: 'point' | 'line' | 'plane';
  coords: { x: number; y: number }[];
  label: string;
}

export default function WorkshopDraw({ onComplete, addCoins, coins }: WorkshopDrawProps) {
  const [activeMode, setActiveMode] = useState<'point' | 'line' | 'plane'>('point');
  const [elements, setElements] = useState<GeometricElement[]>([
    { id: '1', type: 'point', coords: [{ x: 3, y: 4 }], label: 'Punto A' },
    { id: '2', type: 'line', coords: [{ x: 1, y: 2 }, { x: 7, y: 2 }], label: 'Recta m' }
  ]);
  const [currentPoints, setCurrentPoints] = useState<{ x: number; y: number }[]>([]);
  const [inputLabel, setInputLabel] = useState('');
  const [isAddingLabel, setIsAddingLabel] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Grid dimensions
  const gridRows = 8;
  const gridCols = 10;

  const handleCellClick = (x: number, y: number) => {
    // Prevent duplicate points in current drawing stroke
    if (currentPoints.some(p => p.x === x && p.y === y)) return;

    audio.playJump();

    if (activeMode === 'point') {
      // Points are instantaneous, just trigger label screen
      setCurrentPoints([{ x, y }]);
      setInputLabel(`Punto ${String.fromCharCode(65 + elements.filter(e => e.type === 'point').length)}`);
      setIsAddingLabel(true);
    } else if (activeMode === 'line') {
      const updated = [...currentPoints, { x, y }];
      if (updated.length === 2) {
        setCurrentPoints(updated);
        setInputLabel(`Recta ${String.fromCharCode(114 + elements.filter(e => e.type === 'line').length)}`); // r, s, t...
        setIsAddingLabel(true);
      } else {
        setCurrentPoints(updated);
      }
    } else if (activeMode === 'plane') {
      const updated = [...currentPoints, { x, y }];
      if (updated.length === 3) {
        setCurrentPoints(updated);
        const greekPlanes = ['α', 'β', 'π', 'γ'];
        const planeIdx = elements.filter(e => e.type === 'plane').length % greekPlanes.length;
        setInputLabel(`Plano ${greekPlanes[planeIdx]}`);
        setIsAddingLabel(true);
      } else {
        setCurrentPoints(updated);
      }
    }
  };

  const handleSaveElement = () => {
    if (!inputLabel.trim()) return;

    const newElement: GeometricElement = {
      id: Date.now().toString(),
      type: activeMode,
      coords: currentPoints,
      label: inputLabel.trim()
    };

    setElements(prev => [...prev, newElement]);
    setCurrentPoints([]);
    setIsAddingLabel(false);
    setInputLabel('');
    audio.playCoin();
    addCoins(30);
  };

  const handleCancelDrawing = () => {
    setCurrentPoints([]);
    setIsAddingLabel(false);
    setInputLabel('');
    audio.playJump();
  };

  const handleDeleteElement = (id: string) => {
    setElements(prev => prev.filter(e => e.id !== id));
    audio.playWrong();
  };

  const handleClearAll = () => {
    setElements([]);
    setCurrentPoints([]);
    setIsAddingLabel(false);
    audio.playWrong();
  };

  const handleFinishMission = () => {
    onComplete();
    audio.playLevelClear();
    setShowSummary(true);
  };

  // Helper to render lines between grid coordinate cells
  const getLineStyles = (c1: { x: number; y: number }, c2: { x: number; y: number }) => {
    const scaleX = 100 / (gridCols - 1);
    const scaleY = 100 / (gridRows - 1);

    const x1 = c1.x * scaleX;
    const y1 = c1.y * scaleY;
    const x2 = c2.x * scaleX;
    const y2 = c2.y * scaleY;

    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    return {
      left: `${x1}%`,
      top: `${y1}%`,
      width: `${length}%`,
      transform: `rotate(${angle}deg)`,
      transformOrigin: 'top left'
    };
  };

  // Helper to render planes (Polygon SVG paths)
  const getPlaneSvgPath = (coords: { x: number; y: number }[]) => {
    if (coords.length < 3) return '';
    const scaleX = 100 / (gridCols - 1);
    const scaleY = 100 / (gridRows - 1);
    return `M ${coords[0].x * scaleX} ${coords[0].y * scaleY} L ${coords[1].x * scaleX} ${coords[1].y * scaleY} L ${coords[2].x * scaleX} ${coords[2].y * scaleY} Z`;
  };

  const pointsCount = elements.filter(e => e.type === 'point').length;
  const linesCount = elements.filter(e => e.type === 'line').length;
  const planesCount = elements.filter(e => e.type === 'plane').length;

  return (
    <div className="flex flex-col h-full bg-[#EBF3FF] border-8 border-black rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
      {/* Header HUD */}
      <div className="bg-[#43B047] px-6 py-3.5 flex justify-between items-center border-b-4 border-black text-white font-sans text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-white font-black uppercase">
          <Edit3 className="w-5 h-5" />
          <span>MISIÓN 2 • CONSTRUCTOR GEOMÉTRICO</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-white text-black font-black px-3 py-1 rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Coins className="w-4 h-4 text-[#FBD000] animate-pulse" />
            <span className="text-black font-black uppercase text-xs">{coins} MONEDAS</span>
          </div>
        </div>
      </div>

      {!showSummary ? (
        <div className="flex-1 flex flex-col xl:flex-row p-6 gap-6 overflow-y-auto">
          {/* Main Drawing Grid Area */}
          <div className="flex-1 flex flex-col space-y-4">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-0.5">
                <h3 className="text-base font-black text-black uppercase font-sans">Tablero de Dibujo Tridimensional</h3>
                <p className="text-xs text-gray-800 font-bold">
                  {activeMode === 'point' && '🔴 Haz clic en una intersección de coordenadas para marcar un Punto.'}
                  {activeMode === 'line' && `⚡ Haz clic en 2 intersecciones consecutivas para trazar una Recta. (${currentPoints.length}/2)`}
                  {activeMode === 'plane' && `🧱 Haz clic en 3 intersecciones para estirar un Plano triangular. (${currentPoints.length}/3)`}
                </p>
              </div>

              {/* Mode Toggles */}
              <div className="flex bg-white p-1.5 rounded-xl border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] gap-1 shrink-0">
                <button
                  id="mode-point"
                  onClick={() => {
                    setActiveMode('point');
                    setCurrentPoints([]);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-black flex items-center gap-1 transition-all cursor-pointer uppercase ${
                    activeMode === 'point' ? 'bg-[#FBD000] text-black border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]' : 'text-gray-500 hover:text-black border-2 border-transparent'
                  }`}
                >
                  🪙 Puntos
                </button>
                <button
                  id="mode-line"
                  onClick={() => {
                    setActiveMode('line');
                    setCurrentPoints([]);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-black flex items-center gap-1 transition-all cursor-pointer uppercase ${
                    activeMode === 'line' ? 'bg-[#E52521] text-white border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]' : 'text-gray-500 hover:text-black border-2 border-transparent'
                  }`}
                >
                  ⚡ Rectas
                </button>
                <button
                  id="mode-plane"
                  onClick={() => {
                    setActiveMode('plane');
                    setCurrentPoints([]);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-black flex items-center gap-1 transition-all cursor-pointer uppercase ${
                    activeMode === 'plane' ? 'bg-[#049CD8] text-white border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]' : 'text-gray-500 hover:text-black border-2 border-transparent'
                  }`}
                >
                  🧱 Planos
                </button>
              </div>
            </div>

            {/* Drawing Canvas Board */}
            <div className="relative flex-1 min-h-[350px] bg-slate-950 border-4 border-black rounded-2xl overflow-hidden p-6 select-none flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {/* Star-studded night grid background */}
              <div className="absolute inset-4 grid grid-cols-9 grid-rows-7 pointer-events-none opacity-20">
                {Array.from({ length: 63 }).map((_, i) => (
                  <div key={i} className="border-t border-l border-slate-700" />
                ))}
              </div>

              {/* Grid Node Interactive Canvas */}
              <div className="relative w-full aspect-[16/10] max-w-2xl bg-slate-900/40 rounded-xl">
                {/* SVG Overlay to render planes */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                  {/* Render existing planes */}
                  {elements.filter(e => e.type === 'plane').map((e) => (
                    <path
                      key={e.id}
                      d={getPlaneSvgPath(e.coords)}
                      fill="rgba(244, 114, 182, 0.25)"
                      stroke="rgb(244, 114, 182)"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                    />
                  ))}

                  {/* Render in-progress plane layout */}
                  {activeMode === 'plane' && currentPoints.length >= 2 && (
                    <path
                      d={getPlaneSvgPath([...currentPoints, currentPoints[0]])}
                      fill="rgba(244, 114, 182, 0.1)"
                      stroke="rgb(244, 114, 182)"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                    />
                  )}
                </svg>

                {/* Render lines */}
                {elements.filter(e => e.type === 'line').map((e) => (
                  <div
                    key={e.id}
                    className="absolute h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)] pointer-events-none"
                    style={getLineStyles(e.coords[0], e.coords[1])}
                  >
                    {/* Floating line label */}
                    <span className="absolute -top-5 left-1/3 bg-slate-950 text-red-400 border border-red-900 rounded px-1.5 py-0.5 text-[8px] font-mono whitespace-nowrap shadow-md">
                      ↔ {e.label}
                    </span>
                  </div>
                ))}

                {/* Render in-progress line path */}
                {activeMode === 'line' && currentPoints.length === 1 && (
                  <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    {/* Visual guideline pointer box */}
                  </div>
                )}

                {/* Draw grid coordinate dot nodes click selectors */}
                {Array.from({ length: gridRows }).map((_, rIdx) => {
                  const yPercent = (rIdx / (gridRows - 1)) * 100;
                  return (
                    <div key={rIdx} className="absolute w-full h-0 border-t border-slate-800/10" style={{ top: `${yPercent}%` }}>
                      {Array.from({ length: gridCols }).map((_, cIdx) => {
                        const xPercent = (cIdx / (gridCols - 1)) * 100;

                        // Check if this point is currently being clicked/drawn
                        const isSelectedInDraft = currentPoints.some(p => p.x === cIdx && p.y === rIdx);

                        return (
                          <div
                            key={cIdx}
                            onClick={() => handleCellClick(cIdx, rIdx)}
                            className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center hover:bg-yellow-500/10 cursor-pointer group transition-all z-10"
                            style={{ left: `${xPercent}%` }}
                          >
                            {/* Inner core grid coordinate node point */}
                            <div className={`w-2 h-2 rounded-full transition-all ${
                              isSelectedInDraft
                                ? 'bg-yellow-400 ring-4 ring-yellow-500 scale-125'
                                : 'bg-slate-700 group-hover:bg-yellow-500 group-hover:scale-110'
                            }`} />

                            {/* Hover tooltip displaying coordinate (X,Y) */}
                            <span className="absolute -top-5 bg-slate-950 border border-slate-800 rounded px-1 py-0.5 text-[8px] font-mono text-slate-500 hidden group-hover:inline-block pointer-events-none whitespace-nowrap z-30">
                              ({cIdx}, {gridRows - 1 - rIdx})
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}

                {/* Render placed point star markers */}
                {elements.filter(e => e.type === 'point').map((e) => {
                  const scaleX = 100 / (gridCols - 1);
                  const scaleY = 100 / (gridRows - 1);
                  const left = e.coords[0].x * scaleX;
                  const top = e.coords[0].y * scaleY;

                  return (
                    <div
                      key={e.id}
                      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-20"
                      style={{ left: `${left}%`, top: `${top}%` }}
                    >
                      <div className="w-4 h-4 bg-yellow-400 rounded-full border-2 border-white animate-pulse flex items-center justify-center shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
                      <span className="bg-slate-950 text-yellow-400 border border-yellow-900 rounded px-1.5 py-0.5 text-[9px] font-mono mt-1 shadow-md">
                        • {e.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Label Naming Modals / Inlines */}
            <AnimatePresence>
              {isAddingLabel && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-[#FBD000] border-4 border-black p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20 text-black"
                >
                  <div className="flex-1 space-y-1 text-center sm:text-left">
                    <h4 className="text-sm font-black text-black font-sans uppercase">
                      ¡Elemento trazado correctamente!
                    </h4>
                    <p className="text-xs text-black font-bold">
                      Asigna un nombre formal geométrico para registrar la figura en los planos de Peach.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      id="input-label-figura"
                      type="text"
                      value={inputLabel}
                      onChange={(e) => setInputLabel(e.target.value)}
                      placeholder="Ej. Recta r"
                      className="bg-white border-2 border-black px-3 py-2 rounded-lg text-black font-sans font-bold text-xs w-full sm:w-48 outline-none focus:ring-2 focus:ring-black"
                    />
                    <button
                      id="btn-guardar-figura"
                      onClick={handleSaveElement}
                      className="bg-[#43B047] text-white font-sans font-black text-xs px-4 py-2.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:brightness-110 active:translate-y-[1px] active:shadow-none transition-all cursor-pointer shrink-0 uppercase"
                    >
                      Registrar
                    </button>
                    <button
                      id="btn-cancelar-figura"
                      onClick={handleCancelDrawing}
                      className="bg-white border-2 border-black text-black font-sans font-bold text-xs px-3 py-2.5 rounded-lg transition-all hover:bg-gray-100 cursor-pointer shrink-0 uppercase"
                    >
                      Borrar
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Shape Inventory */}
          <div className="w-full xl:w-80 flex flex-col justify-between gap-6 shrink-0">
            <div className="bg-white p-4 rounded-2xl border-4 border-black flex-1 flex flex-col space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
              <div className="flex items-center justify-between border-b-2 border-black pb-2">
                <span className="text-xs font-sans font-black">INVENTARIO RECONSTRUIDO:</span>
                <span className="text-xs font-sans font-black text-[#E52521]">{elements.length} REGISTROS</span>
              </div>

              {/* Geometry Counts tracker */}
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-sans font-black uppercase text-black">
                <div className="bg-gray-50 p-2 rounded border-2 border-black">
                  <span className="text-[#049CD8] font-black block">{pointsCount}</span>
                  <span className="text-gray-700">Puntos</span>
                </div>
                <div className="bg-gray-50 p-2 rounded border-2 border-black">
                  <span className="text-[#E52521] font-black block">{linesCount}</span>
                  <span className="text-gray-700">Rectas</span>
                </div>
                <div className="bg-gray-50 p-2 rounded border-2 border-black">
                  <span className="text-[#43B047] font-black block">{planesCount}</span>
                  <span className="text-gray-700">Planos</span>
                </div>
              </div>

              {/* Scrollable list of shapes */}
              <div className="flex-1 overflow-y-auto space-y-2 max-h-[180px] xl:max-h-none font-sans">
                {elements.length > 0 ? (
                  elements.map((e) => (
                    <div
                      key={e.id}
                      className="bg-[#EBF3FF] border-2 border-[#049CD8]/60 p-2.5 rounded-xl flex items-center justify-between font-sans text-xs"
                    >
                      <div className="space-y-0.5 font-sans">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px]">
                            {e.type === 'point' && '🪙'}
                            {e.type === 'line' && '⚡'}
                            {e.type === 'plane' && '🧱'}
                          </span>
                          <span className="font-black text-black">{e.label}</span>
                        </div>
                        <p className="text-[9px] text-gray-700 font-bold">
                          Coords:{' '}
                          {e.coords
                            .map((c) => `(${c.x}, ${gridRows - 1 - c.y})`)
                            .join(' ➔ ')}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteElement(e.id)}
                        className="p-1 hover:bg-[#E52521]/15 rounded text-[#E52521] transition-all cursor-pointer border border-transparent hover:border-[#E52521]"
                        title="Eliminar elemento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 p-6 space-y-1.5">
                    <Layers className="w-8 h-8 text-gray-300 animate-pulse" />
                    <p className="text-xs font-sans font-bold">El inventario está vacío. Traza figuras en la cuadrícula.</p>
                  </div>
                )}
              </div>

              {elements.length > 0 && (
                <button
                  id="btn-borrar-todo"
                  onClick={handleClearAll}
                  className="text-[10px] font-sans font-black uppercase text-[#E52521] bg-white border-2 border-[#E52521] rounded py-1.5 hover:bg-[#E52521]/10 cursor-pointer flex items-center justify-center gap-1 transition-all shadow-[2px_2px_0px_0px_rgba(229,37,33,1)]"
                >
                  <RotateCcw className="w-3 h-3" /> Reiniciar Inventario
                </button>
              )}
            </div>

            {/* Save blueprint button */}
            <button
              id="btn-guardar-planos"
              onClick={handleFinishMission}
              disabled={pointsCount < 1 || linesCount < 1 || planesCount < 1}
              className="w-full bg-[#43B047] disabled:bg-gray-200 disabled:text-gray-400 border-4 border-black text-white font-sans font-black text-xs py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer uppercase"
            >
              {pointsCount >= 1 && linesCount >= 1 && planesCount >= 1
                ? '¡Guardar Planos y Avanzar!'
                : 'Falta crear al menos 1 de cada tipo'}
            </button>
          </div>
        </div>
      ) : (
        /* Mission complete summary */
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 text-black bg-white/40 rounded-xl m-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="w-20 h-20 bg-[#43B047] rounded-full border-4 border-black flex items-center justify-center animate-bounce shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-[#43B047] font-sans uppercase">¡MISIÓN 2 COMPLETADA!</h3>
            <p className="text-sm text-gray-800 font-bold max-w-md mx-auto">
              ¡Maravilloso! Has creado y nombrado nuevos planos geométricos tridimensionales utilizando la cuadrícula de coordenadas del Reino. Peach tiene ahora un juego de planos exactos para la reconstrucción física de los muros.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center max-w-sm w-full font-sans text-xs font-black uppercase text-black">
            <div className="bg-white p-3 rounded-xl border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-[#FBD000] font-black block text-lg">{pointsCount}</span>
              <span>Puntos</span>
            </div>
            <div className="bg-white p-3 rounded-xl border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-[#E52521] font-black block text-lg">{linesCount}</span>
              <span>Rectas</span>
            </div>
            <div className="bg-white p-3 rounded-xl border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-[#049CD8] font-black block text-lg">{planesCount}</span>
              <span>Planos</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#FBD000] px-5 py-2.5 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Coins className="w-5 h-5 text-black animate-pulse" />
            <span className="text-black font-sans font-black uppercase">+{elements.length * 30} Monedas de Oro Ganadas</span>
          </div>

          <p className="text-[10px] text-gray-700 font-sans font-black uppercase">
            ¡Prepárate para la Misión 3: Clasificación de Elementos de Mario Bros!
          </p>
        </div>
      )}
    </div>
  );
}
