// Simple 8-bit retro synthesizer using Web Audio API

class AudioSynth {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playCoin() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  playJump() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  playPowerup() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [330, 392, 659, 523, 587, 784]; // E4, G4, E5, C5, D5, G5
      const duration = 0.07;

      notes.forEach((freq, index) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + index * duration);

        gain.gain.setValueAtTime(0.08, now + index * duration);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (index + 1) * duration);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + index * duration);
        osc.stop(now + (index + 1) * duration);
      });
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  playCorrect() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.setValueAtTime(1046.5, now + 0.3); // C6

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  playWrong() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.25);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  playLevelClear() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Mario course clear classic motif (simplified)
      // C4 E4 G4 C5 E5 G5
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      const durations = [0.1, 0.1, 0.1, 0.15, 0.15, 0.15, 0.4];
      let cumulativeTime = 0;

      notes.forEach((freq, index) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const d = durations[index];

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + cumulativeTime);

        gain.gain.setValueAtTime(0.1, now + cumulativeTime);
        gain.gain.exponentialRampToValueAtTime(0.01, now + cumulativeTime + d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + cumulativeTime);
        osc.stop(now + cumulativeTime + d);
        cumulativeTime += d;
      });
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  playLevelStart() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Classic Mario starting motif: E E . E . C E . G . . . g
      const notes = [659, 659, 659, 523, 659, 784, 392];
      const times = [0, 0.12, 0.24, 0.36, 0.42, 0.54, 0.72];
      const durations = [0.08, 0.08, 0.08, 0.06, 0.08, 0.12, 0.15];

      notes.forEach((freq, index) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const t = times[index];
        const d = durations[index];

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + t);

        gain.gain.setValueAtTime(0.08, now + t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + t);
        osc.stop(now + t + d);
      });
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }
}

export const audio = new AudioSynth();
