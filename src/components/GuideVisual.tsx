import React from 'react';
import { BookOpen, Check, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { COMPARISON_EXAMPLES } from '../data/lessons';

export default function GuideVisual() {
  return (
    <div className="bg-[#EBF3FF] p-6 rounded-2xl border-8 border-black space-y-6 text-black font-sans max-w-4xl mx-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      {/* Title */}
      <div className="flex items-center gap-3 border-b-4 border-black pb-4">
        <div className="bg-[#E52521] text-white p-2.5 rounded-xl border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-black text-black font-sans uppercase tracking-wide">
            Guía de Verificación y Respuestas del Taller
          </h3>
          <p className="text-xs text-gray-700 font-bold">
            Utiliza este manual oficial para comprobar y corregir los ejercicios de tu cuaderno de geometría espacial.
          </p>
        </div>
      </div>

      {/* Grid of Key Concepts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Point Verification card */}
        <div className="bg-white p-5 rounded-2xl border-4 border-black space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between">
            <span className="text-2xl">🪙</span>
            <span className="text-[10px] font-sans bg-[#FBD000] border-2 border-black px-2 py-0.5 rounded text-black font-black uppercase">
              0 DIMENSIONES
            </span>
          </div>
          <h4 className="text-sm font-black text-black uppercase font-sans">El Punto Geométrico</h4>
          <p className="text-xs text-gray-700 font-bold leading-relaxed">
            Representa una ubicación exacta en el espacio. No tiene longitud, área ni grosor.
          </p>

          <div className="space-y-1.5 pt-2 border-t-2 border-black text-xs">
            <strong className="text-[10px] font-sans text-gray-500 uppercase font-black block">¿Cómo verificar en tu cuaderno?</strong>
            <div className="flex items-start gap-1.5 text-black font-bold">
              <Check className="w-4 h-4 text-[#43B047] shrink-0 mt-0.5 stroke-[3px]" />
              <span>¿Está dibujado como un punto pequeño o cruz?</span>
            </div>
            <div className="flex items-start gap-1.5 text-black font-bold">
              <Check className="w-4 h-4 text-[#43B047] shrink-0 mt-0.5 stroke-[3px]" />
              <span>¿Tiene asignada una <strong>LETRA MAYÚSCULA</strong> (Ej: Punto A)?</span>
            </div>
          </div>
        </div>

        {/* Line Verification card */}
        <div className="bg-white p-5 rounded-2xl border-4 border-black space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between">
            <span className="text-2xl">⚡</span>
            <span className="text-[10px] font-sans bg-[#E52521] border-2 border-black px-2 py-0.5 rounded text-white font-black uppercase">
              1 DIMENSIÓN
            </span>
          </div>
          <h4 className="text-sm font-black text-black uppercase font-sans">La Recta Geométrica</h4>
          <p className="text-xs text-gray-700 font-bold leading-relaxed">
            Una línea infinita sin curvas. Solo tiene largo. Contiene infinitos puntos.
          </p>

          <div className="space-y-1.5 pt-2 border-t-2 border-black text-xs">
            <strong className="text-[10px] font-sans text-gray-500 uppercase font-black block">¿Cómo verificar en tu cuaderno?</strong>
            <div className="flex items-start gap-1.5 text-black font-bold">
              <Check className="w-4 h-4 text-[#43B047] shrink-0 mt-0.5 stroke-[3px]" />
              <span>¿Tiene flechas en <strong>ambos extremos</strong> para indicar infinito?</span>
            </div>
            <div className="flex items-start gap-1.5 text-black font-bold">
              <Check className="w-4 h-4 text-[#43B047] shrink-0 mt-0.5 stroke-[3px]" />
              <span>¿Se nombra con una <strong>letra minúscula</strong> (r) o por dos puntos (↔AB)?</span>
            </div>
          </div>
        </div>

        {/* Plane Verification card */}
        <div className="bg-white p-5 rounded-2xl border-4 border-black space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between">
            <span className="text-2xl">🧱</span>
            <span className="text-[10px] font-sans bg-[#049CD8] border-2 border-black px-2 py-0.5 rounded text-white font-black uppercase">
              2 DIMENSIONES
            </span>
          </div>
          <h4 className="text-sm font-black text-black uppercase font-sans">El Plano Geométrico</h4>
          <p className="text-xs text-gray-700 font-bold leading-relaxed">
            Una superficie perfectamente lisa infinita. Tiene largo y ancho, pero no altura.
          </p>

          <div className="space-y-1.5 pt-2 border-t-2 border-black text-xs">
            <strong className="text-[10px] font-sans text-gray-500 uppercase font-black block">¿Cómo verificar en tu cuaderno?</strong>
            <div className="flex items-start gap-1.5 text-black font-bold">
              <Check className="w-4 h-4 text-[#43B047] shrink-0 mt-0.5 stroke-[3px]" />
              <span>¿Está dibujado como un paralelogramo inclinado (perspectiva)?</span>
            </div>
            <div className="flex items-start gap-1.5 text-black font-bold">
              <Check className="w-4 h-4 text-[#43B047] shrink-0 mt-0.5 stroke-[3px]" />
              <span>¿Tiene una <strong>letra griega</strong> (α, β, π) o tres puntos (Plano ABC)?</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Reference Cheat sheet */}
      <div className="bg-white rounded-2xl border-4 border-black overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="bg-[#049CD8] px-4 py-3 border-b-4 border-black flex justify-between items-center text-white font-sans">
          <span className="text-xs font-black uppercase tracking-wider">
            Tabla de Respuestas y Equivalencias Cotidianas
          </span>
          <span className="text-[10px] font-black bg-white border-2 border-black px-2 py-0.5 rounded text-black uppercase">
            GUÍA INTEGRAL
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#EBF3FF] border-b-4 border-black font-sans font-black text-black text-[10px] uppercase">
                <th className="p-3">CONCEPTO</th>
                <th className="p-3">EN EL SALÓN DE CLASES</th>
                <th className="p-3">EN MARIO BROS (PELÍCULA)</th>
                <th className="p-3">CARACTERÍSTICA MATEMÁTICA</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black text-black">
              {COMPARISON_EXAMPLES.map((ex, i) => (
                <tr key={i} className="hover:bg-[#EBF3FF]/40 font-medium">
                  <td className="p-3 font-black font-sans">
                    {ex.element === 'Punto' && <span className="text-yellow-600 font-black">● {ex.element}</span>}
                    {ex.element === 'Recta' && <span className="text-red-600 font-black">↔ {ex.element}</span>}
                    {ex.element === 'Plano' && <span className="text-[#049CD8] font-black">▱ {ex.element}</span>}
                  </td>
                  <td className="p-3 text-[11px] leading-relaxed font-bold">{ex.classroom}</td>
                  <td className="p-3 text-[11px] leading-relaxed text-black font-black">{ex.marioWorld}</td>
                  <td className="p-3 text-[11px] font-sans text-gray-700 font-bold">{ex.feature}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Guideline Checklist */}
      <div className="bg-[#FBD000] border-4 border-black p-5 rounded-2xl space-y-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-2 text-black">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <h4 className="text-sm font-black font-sans uppercase">
            Lista de Auto-Verificación del Taller (Semana 1)
          </h4>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed text-black">
          <li className="flex items-start gap-2 bg-white p-3 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold">
            <span className="text-[#E52521] font-black">1.</span>
            <span>¿Encontraste 5 puntos en tu aula? Ej: Cabeza de un tornillo de la silla, esquina de la baldosa, punta del lápiz.</span>
          </li>
          <li className="flex items-start gap-2 bg-white p-3 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold">
            <span className="text-[#E52521] font-black">2.</span>
            <span>¿Encontraste 5 rectas? Ej: Pliegue de una hoja de papel, el cable del cargador tenso, junta de ladrillos.</span>
          </li>
          <li className="flex items-start gap-2 bg-white p-3 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold">
            <span className="text-[#E52521] font-black">3.</span>
            <span>¿Encontraste 5 planos? Ej: El vidrio de la ventana, la superficie de la puerta, la tapa del portafolio.</span>
          </li>
          <li className="flex items-start gap-2 bg-white p-3 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold">
            <span className="text-[#E52521] font-black">4.</span>
            <span>¿Dibujaste y nombraste las 10 representaciones? Puntos con mayúscula (A), rectas minúsculas (r) y planos (α).</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
