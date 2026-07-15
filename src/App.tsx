import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Star, BookOpen, Compass, Edit3, Layers, HelpCircle, Trophy, Volume2, VolumeX, ShieldCheck, Award, Heart, RefreshCw } from 'lucide-react';
import { UserProgress } from './types';
import { audio } from './utils/audio';

// Import our modular components
import Presentation from './components/Presentation';
import WorkshopIdentify from './components/WorkshopIdentify';
import WorkshopDraw from './components/WorkshopDraw';
import WorkshopClassify from './components/WorkshopClassify';
import GuideVisual from './components/GuideVisual';

export default function App() {
  const [activeTab, setActiveTab] = useState<'menu' | 'lesson' | 'mission1' | 'mission2' | 'mission3' | 'guide'>('menu');
  const [isMuted, setIsMuted] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [certificateUnlocked, setCertificateUnlocked] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  // User stats & levels state
  const [progress, setProgress] = useState<UserProgress>({
    slidesCompleted: false,
    mission1Score: 0,
    mission1Completed: false,
    mission2Completed: false,
    mission3Score: 0,
    mission3Completed: false,
    totalCoins: 0,
  });

  // Load progress from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('geometry_mario_progress');
      if (saved) {
        setProgress(JSON.parse(saved));
      }
      const savedName = localStorage.getItem('geometry_student_name');
      if (savedName) {
        setStudentName(savedName);
      }
    } catch (e) {
      console.warn('LocalStorage load failed', e);
    }

    // Play retro startup sound when user interacts or on load fallback
    const initSound = () => {
      if (!isMuted) audio.playLevelStart();
      window.removeEventListener('click', initSound);
    };
    window.addEventListener('click', initSound);
    return () => window.removeEventListener('click', initSound);
  }, []);

  // Save progress helper
  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    try {
      localStorage.setItem('geometry_mario_progress', JSON.stringify(newProgress));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  };

  // Check if certificate should be unlocked
  useEffect(() => {
    if (progress.slidesCompleted && progress.mission1Completed && progress.mission2Completed && progress.mission3Completed) {
      setCertificateUnlocked(true);
    }
  }, [progress]);

  const addCoins = (amount: number) => {
    if (isMuted) {
      saveProgress({ ...progress, totalCoins: progress.totalCoins + amount });
      return;
    }
    // Incrementally trigger sounds for extra delight
    saveProgress({ ...progress, totalCoins: progress.totalCoins + amount });
  };

  const handleCompleteLesson = () => {
    const updated = { ...progress, slidesCompleted: true };
    saveProgress(updated);
    setActiveTab('menu');
  };

  const handleCompleteMission1 = (score: number) => {
    const updated = {
      ...progress,
      mission1Completed: true,
      mission1Score: score,
    };
    saveProgress(updated);
  };

  const handleCompleteMission2 = () => {
    const updated = {
      ...progress,
      mission2Completed: true,
    };
    saveProgress(updated);
  };

  const handleCompleteMission3 = (score: number) => {
    const updated = {
      ...progress,
      mission3Completed: true,
      mission3Score: score,
    };
    saveProgress(updated);
  };

  const handleResetAll = () => {
    const fresh: UserProgress = {
      slidesCompleted: false,
      mission1Score: 0,
      mission1Completed: false,
      mission2Completed: false,
      mission3Score: 0,
      mission3Completed: false,
      totalCoins: 0,
    };
    saveProgress(fresh);
    setStudentName('');
    localStorage.removeItem('geometry_student_name');
    setCertificateUnlocked(false);
    setShowCertificate(false);
    setActiveTab('menu');
    audio.playWrong();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleSaveStudentName = (name: string) => {
    setStudentName(name);
    try {
      localStorage.setItem('geometry_student_name', name);
    } catch (e) {
      console.warn(e);
    }
    audio.playPowerup();
  };

  return (
    <div className="min-h-screen bg-[#5C94FC] text-black font-sans antialiased relative overflow-x-hidden flex flex-col justify-between border-[12px] border-[#924E1B] p-4 sm:p-6 shadow-2xl">
      {/* Retro Sky Background Decorative Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none z-0" />

      {/* Navigation Top Header bar - Mario HUD */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-4 py-4 flex items-center justify-between bg-black/40 backdrop-blur-md rounded-xl border-4 border-white text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] mb-6">
        <div className="flex items-center gap-3 cursor-pointer bg-[#E52521] px-4 py-1.5 rounded border-2 border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] text-white" onClick={() => setActiveTab('menu')}>
          <div className="w-8 h-8 bg-white text-[#E52521] rounded-full flex items-center justify-center font-black text-lg border-2 border-black">
            M
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-black tracking-wider text-[#FBD000] font-sans uppercase">
              REINO GEOMÉTRICO
            </h1>
            <p className="text-[9px] text-white/80 font-mono font-black">SEMANA 01 • GRADO 7°</p>
          </div>
        </div>

        {/* Global Stats HUD */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#43B047] px-4 py-1.5 rounded border-2 border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] text-white">
            <span className="text-sm">🪙</span>
            <span className="font-sans font-black tracking-widest text-xs sm:text-sm uppercase">
              Monedas: {progress.totalCoins}
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            id="btn-toggle-muting"
            onClick={toggleMute}
            className="p-2 bg-black/40 hover:bg-black/60 border-2 border-white rounded text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] transition-all cursor-pointer flex items-center justify-center"
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Guide Shortcut tab */}
          <button
            id="shortcut-guia"
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-1.5 rounded border-2 font-sans text-xs font-black uppercase transition-all cursor-pointer flex items-center gap-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] ${
              activeTab === 'guide'
                ? 'bg-[#FBD000] text-black border-white'
                : 'bg-[#049CD8] text-white border-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Guía de Respuestas
          </button>
        </div>
      </header>

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-2 py-4 relative z-10 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {/* MENU TAB */}
          {activeTab === 'menu' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
              key="menu"
            >
              {/* Jumbotron Hero - Bento Box */}
              <div className="bg-white rounded-2xl border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden text-slate-800 max-w-4xl mx-auto text-center space-y-4">
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#FBD000] rounded-full flex items-center justify-center border-4 border-black rotate-12 shadow-sm">
                  <span className="text-3xl">⭐</span>
                </div>

                <motion.div
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="inline-block"
                >
                  <span className="text-[10px] font-sans font-black tracking-widest bg-[#E52521] text-white border-2 border-black px-3.5 py-1 rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
                    ¡Aventura de Aprendizaje para 7° Grado!
                  </span>
                </motion.div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight leading-none uppercase font-sans">
                  Puntos, Rectas y <br />
                  <span className="text-[#049CD8] font-black italic underline decoration-wavy decoration-[#FBD000]">
                    Planos en el Espacio
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-gray-700 max-w-2xl mx-auto font-medium leading-relaxed">
                  ¡Mario, Luigi y la Princesa Peach te necesitan! Bowser destruyó el castillo tridimensional. Domina los elementos fundamentales de la geometría para restaurar el Reino Champiñón.
                </p>

                {/* Progress bar level */}
                <div className="max-w-md mx-auto pt-2 space-y-2">
                  <div className="flex justify-between text-xs font-black font-mono text-gray-600 uppercase">
                    <span>RECONSTRUCCIÓN GLOBAL</span>
                    <span>
                      {
                        [
                          progress.slidesCompleted,
                          progress.mission1Completed,
                          progress.mission2Completed,
                          progress.mission3Completed,
                        ].filter(Boolean).length
                      }{' '}
                      / 4 ETAPAS COMPLETAS
                    </span>
                  </div>
                  <div className="w-full bg-black h-4 rounded-full overflow-hidden border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
                    <div
                      className="bg-[#43B047] h-full transition-all duration-500 border-r-2 border-white/40"
                      style={{
                        width: `${
                          ([
                            progress.slidesCompleted,
                            progress.mission1Completed,
                            progress.mission2Completed,
                            progress.mission3Completed,
                          ].filter(Boolean).length /
                            4) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Course Chapters Grid - Bento Style */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                {/* 1. Interactive Slides */}
                <div
                  id="card-leccion"
                  onClick={() => setActiveTab('lesson')}
                  className="bg-[#FBD000] text-black border-4 border-black rounded-2xl p-5 flex flex-col justify-between space-y-5 cursor-pointer transition-all hover:translate-y-[-4px] active:translate-y-0 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black border-2 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        1
                      </div>
                      <span className={`text-[10px] font-black tracking-wider px-2.5 py-1 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                        progress.slidesCompleted ? 'bg-[#43B047] text-white' : 'bg-white text-black'
                      }`}>
                        {progress.slidesCompleted ? 'COMPLETO ✓' : 'DISPONIBLE'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-black uppercase font-sans tracking-wide">
                        Lección Interactiva
                      </h3>
                      <p className="text-xs text-black/80 font-bold leading-relaxed mt-1">
                        Estudia el Punto (0D), la Recta (1D) y el Plano (2D). Explora diagramas interactivos en 3D y gana un bonus en el cuestionario.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-black font-mono uppercase bg-white border-2 border-black px-3 py-1.5 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] self-start">
                    <span>Estudiar ahora</span> <Play className="w-3.5 h-3.5 fill-black" />
                  </div>
                </div>

                {/* 2. Mission 1: Identification */}
                <div
                  id="card-mision-1"
                  onClick={() => setActiveTab('mission1')}
                  className="bg-[#E52521] text-white border-4 border-black rounded-2xl p-5 flex flex-col justify-between space-y-5 cursor-pointer transition-all hover:translate-y-[-4px] active:translate-y-0 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black border-2 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        2
                      </div>
                      <span className={`text-[10px] font-black tracking-wider px-2.5 py-1 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                        progress.mission1Completed ? 'bg-[#43B047] text-white' : 'bg-white text-black'
                      }`}>
                        {progress.mission1Completed ? `NOTA: ${progress.mission1Score}%` : 'DISPONIBLE'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white uppercase font-sans tracking-wide">
                        Misión 1: Identificar
                      </h3>
                      <p className="text-xs text-white/90 font-bold leading-relaxed mt-1">
                        Explora la fachada del Castillo de Peach y encuentra los elementos geométricos ocultos para estabilizar las dimensiones físicas.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-black font-mono uppercase bg-white border-2 border-black px-3 py-1.5 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] self-start">
                    <span>Explorar Reino</span> <Compass className="w-3.5 h-3.5 text-black" />
                  </div>
                </div>

                {/* 3. Mission 2: Drawing Grid */}
                <div
                  id="card-mision-2"
                  onClick={() => setActiveTab('mission2')}
                  className="bg-[#049CD8] text-white border-4 border-black rounded-2xl p-5 flex flex-col justify-between space-y-5 cursor-pointer transition-all hover:translate-y-[-4px] active:translate-y-0 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black border-2 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        3
                      </div>
                      <span className={`text-[10px] font-black tracking-wider px-2.5 py-1 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                        progress.mission2Completed ? 'bg-[#43B047] text-white' : 'bg-white text-black'
                      }`}>
                        {progress.mission2Completed ? 'COMPLETO ✓' : 'DISPONIBLE'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white uppercase font-sans tracking-wide">
                        Misión 2: Trazar
                      </h3>
                      <p className="text-xs text-white/90 font-bold leading-relaxed mt-1">
                        ¡Usa la tabla coordenada de diseño para crear y rotular tus propios puntos, rectas y planos geométricos en una cuadrícula!
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-black font-mono uppercase bg-white border-2 border-black px-3 py-1.5 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] self-start">
                    <span>Trazar planos</span> <Edit3 className="w-3.5 h-3.5 text-black" />
                  </div>
                </div>

                {/* 4. Mission 3: Classification Pipes */}
                <div
                  id="card-mision-3"
                  onClick={() => setActiveTab('mission3')}
                  className="bg-[#43B047] text-white border-4 border-black rounded-2xl p-5 flex flex-col justify-between space-y-5 cursor-pointer transition-all hover:translate-y-[-4px] active:translate-y-0 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black border-2 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        4
                      </div>
                      <span className={`text-[10px] font-black tracking-wider px-2.5 py-1 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                        progress.mission3Completed ? 'bg-black text-white' : 'bg-white text-black'
                      }`}>
                        {progress.mission3Completed ? `NOTA: ${progress.mission3Score}%` : 'DISPONIBLE'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white uppercase font-sans tracking-wide">
                        Misión 3: Clasificar
                      </h3>
                      <p className="text-xs text-white/90 font-bold leading-relaxed mt-1">
                        Clasifica monedas, vigas, láseres y lavas en las tuberías de Punto (0D), Recta (1D) o Plano (2D) con explicaciones instantáneas.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-black font-mono uppercase bg-white border-2 border-black px-3 py-1.5 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] self-start">
                    <span>Ordenar tuberías</span> <Layers className="w-3.5 h-3.5 text-black" />
                  </div>
                </div>
              </div>

              {/* Certificate Unlock Banner & Form */}
              {certificateUnlocked && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#FBD000] rounded-3xl p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center justify-between gap-6 text-black"
                >
                  <div className="space-y-2 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-red-600">
                      <Trophy className="w-6 h-6 animate-bounce" />
                      <span className="font-sans font-black text-sm uppercase tracking-wider">¡SÚPER RECONSTRUCCIÓN LOGRADA!</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-black font-sans uppercase">
                      ¡Tu Diploma de Geometría Espacial está listo!
                    </h3>
                    <p className="text-xs text-gray-800 font-bold">
                      Has completado con éxito la lección teórica, la identificación en el mapa de Peach, el trazado en coordenadas y la clasificación por tuberías. Escribe tu nombre para recibir tu recompensa formal.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                    <input
                      id="input-student-name"
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Escribe tu Nombre"
                      className="bg-white border-2 border-black px-4 py-2.5 rounded-xl font-mono text-xs text-black placeholder-gray-500 outline-none w-full sm:w-56 focus:ring-2 focus:ring-black font-bold"
                    />
                    <button
                      id="btn-generar-diploma"
                      onClick={() => {
                        if (studentName.trim()) {
                          handleSaveStudentName(studentName.trim());
                          setShowCertificate(true);
                        } else {
                          audio.playWrong();
                        }
                      }}
                      className="bg-[#E52521] text-white hover:bg-[#c41e1a] border-2 border-black font-mono font-black text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none uppercase"
                    >
                      Generar Diploma
                    </button>
                  </div>
                </motion.div>
              )}


              {/* Achievements & Reset footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-900 text-slate-500 text-xs font-mono">
                <span>Diseñado en base al temario de Semana 1 de Geometría Espacial para grado 7°</span>
                <button
                  id="btn-reiniciar-progreso"
                  onClick={handleResetAll}
                  className="hover:text-red-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-red-950 transition-all cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Reiniciar Progreso
                </button>
              </div>
            </motion.div>
          )}

          {/* CHAPTER 1: PRESENTATION SLIDES */}
          {activeTab === 'lesson' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[600px]"
              key="lesson"
            >
              <Presentation
                onComplete={handleCompleteLesson}
                addCoins={addCoins}
                coins={progress.totalCoins}
              />
            </motion.div>
          )}

          {/* CHAPTER 2: MISSION 1 */}
          {activeTab === 'mission1' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[600px]"
              key="mission1"
            >
              <WorkshopIdentify
                onComplete={(score) => {
                  handleCompleteMission1(score);
                  setActiveTab('menu');
                }}
                addCoins={addCoins}
                coins={progress.totalCoins}
              />
            </motion.div>
          )}

          {/* CHAPTER 3: MISSION 2 */}
          {activeTab === 'mission2' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[600px]"
              key="mission2"
            >
              <WorkshopDraw
                onComplete={() => {
                  handleCompleteMission2();
                  setActiveTab('menu');
                }}
                addCoins={addCoins}
                coins={progress.totalCoins}
              />
            </motion.div>
          )}

          {/* CHAPTER 4: MISSION 3 */}
          {activeTab === 'mission3' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[600px]"
              key="mission3"
            >
              <WorkshopClassify
                onComplete={(score) => {
                  handleCompleteMission3(score);
                  setActiveTab('menu');
                }}
                addCoins={addCoins}
                coins={progress.totalCoins}
              />
            </motion.div>
          )}

          {/* CHAPTER 5: VISUAL REFERENCE GUIDE */}
          {activeTab === 'guide' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
              key="guide"
            >
              <div className="flex items-center justify-between">
                <button
                  id="btn-guia-regresar-menu"
                  onClick={() => setActiveTab('menu')}
                  className="bg-white hover:bg-gray-100 border-4 border-black text-black font-sans font-black text-xs px-5 py-2.5 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer uppercase"
                >
                  ← Regresar al Mapa de Misiones
                </button>
              </div>

              <GuideVisual />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Diploma Certificate Lightbox Portal */}
      <AnimatePresence>
        {showCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-[#FBD000] p-8 rounded-3xl border-8 border-black max-w-2xl w-full text-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative space-y-6 text-center select-none"
            >
              {/* Closing cross */}
              <button
                id="btn-cerrar-diploma"
                onClick={() => setShowCertificate(false)}
                className="absolute top-4 right-4 text-black hover:text-[#E52521] font-black font-sans text-sm bg-white border-2 border-black w-8 h-8 flex items-center justify-center rounded-full transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none"
              >
                ✕
              </button>

              {/* Decorative crest */}
              <div className="w-16 h-16 bg-[#E52521] border-4 border-black text-white rounded-full mx-auto flex items-center justify-center font-black text-3xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] animate-bounce">
                👑
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-sans font-black uppercase tracking-widest text-[#E52521] block">
                  DIPLOMA OFICIAL DE EXCELENCIA GEOMÉTRICA
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-black tracking-tight font-sans uppercase">
                  Castillo Dimensional de Peach
                </h3>
              </div>

              <div className="py-6 border-y-4 border-black/40 space-y-4">
                <p className="text-xs text-black/80 font-sans font-bold uppercase italic">
                  Por cuanto ha demostrado maestría absoluta sobre las dimensiones del espacio...
                </p>
                <h2 className="text-3xl sm:text-4xl font-black text-[#E52521] uppercase tracking-wide font-sans underline decoration-black decoration-wavy">
                  {studentName || 'SUPER ESTUDIANTE'}
                </h2>
                <p className="text-xs text-black max-w-md mx-auto leading-relaxed font-bold">
                  Es condecorado(a) formalmente con el título honorífico de <strong className="text-black underline">Maestro Constructor del Reino Champiñón</strong>, habiendo completado los talleres teóricos e identificaciones de <strong>Puntos (0D), Rectas (1D) y Planos (2D)</strong> de la Semana 1.
                </p>
              </div>

              {/* Signatures */}
              <div className="flex justify-around items-center pt-2 font-sans text-[11px] text-black font-bold uppercase">
                <div className="text-center">
                  <div className="w-24 border-b-2 border-black mx-auto mb-1 flex justify-center italic text-[#E52521] font-black">Mario Bros</div>
                  <span>Reconstructor Principal</span>
                </div>
                <div className="text-center">
                  <div className="w-24 border-b-2 border-black mx-auto mb-1 flex justify-center italic text-[#049CD8] font-black">Princesa Peach</div>
                  <span>Gobernante del Reino</span>
                </div>
              </div>

              {/* Certificate rewards status */}
              <div className="bg-white border-4 border-black p-3 rounded-xl max-w-xs mx-auto shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-black font-sans font-black text-xs block uppercase">✓ {progress.totalCoins} Monedas Doradas</span>
                <span className="text-[9px] text-gray-700 font-mono block">Acumuladas en tu Cuenta Estudiantil</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer copyright */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 border-t-4 border-black text-center text-xs text-black font-bold uppercase">
        © 2026 Academia de Geometría Espacial. Mario Bros, Luigi y Peach son personajes inspirados en Nintendo. Diseñado con fines didácticos interactivos.
      </footer>
    </div>
  );
}
