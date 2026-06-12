// audio.js - Web Audio API Synthesizer for Arcane Kingdom Academy
// Synthesizes atmospheric ambient pads and magical sound effects procedurally.

class MagicalAudioEngine {
  constructor() {
    this.ctx = null;
    this.ambientNode = null;
    this.ambientOscs = [];
    this.delayNode = null;
    this.masterVolume = null;
    this.isMuted = true;
    this.ambientVolumeValue = 0.15;
    this.sfxVolumeValue = 0.3;
  }

  // Initialize Audio Context on user interaction
  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    // Create master volume node
    this.masterVolume = this.ctx.createGain();
    this.masterVolume.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
    this.masterVolume.connect(this.ctx.destination);

    // Setup feedback delay line for spaciousness
    this.delayNode = this.ctx.createDelay(2.0);
    this.delayNode.delayTime.value = 0.8;
    
    const delayFeedback = this.ctx.createGain();
    delayFeedback.gain.value = 0.45;
    
    const delayFilter = this.ctx.createBiquadFilter();
    delayFilter.type = 'lowpass';
    delayFilter.frequency.value = 1200;

    // Connect delay loop: input -> delay -> filter -> feedback -> delay
    this.delayNode.connect(delayFilter);
    delayFilter.connect(delayFeedback);
    delayFeedback.connect(this.delayNode);
    
    // Connect delay to master
    this.delayNode.connect(this.masterVolume);
  }

  setMute(mute) {
    this.isMuted = mute;
    if (!this.ctx) this.init();
    
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      
      const targetGain = mute ? 0 : 1;
      this.masterVolume.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.15);
      
      if (!mute && this.ambientOscs.length === 0) {
        this.playAmbient();
      }
    }
  }

  toggleMute() {
    this.setMute(!this.isMuted);
    return this.isMuted;
  }

  // Play a luxurious, floating background drone/pad
  playAmbient() {
    if (this.isMuted || !this.ctx) return;
    this.stopAmbient();

    const now = this.ctx.currentTime;
    
    // Ambient gain node
    this.ambientNode = this.ctx.createGain();
    this.ambientNode.gain.setValueAtTime(0, now);
    this.ambientNode.gain.linearRampToValueAtTime(this.ambientVolumeValue, now + 3);
    this.ambientNode.connect(this.masterVolume);

    // Filter to sweep frequencies slowly (LFO-like modulation)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    filter.Q.value = 3;
    filter.connect(this.ambientNode);

    // Setup slow LFO for filter cutoff
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.05; // 20-second cycle
    
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 250; // Sweeps filter between 150Hz and 650Hz
    
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start(now);

    // Main notes of a magical minor-ninth/suspended chord (Am9 / Dm9 / Gmaj7 vibe)
    // Frequencies: A2 (110Hz), E3 (164.81Hz), C4 (261.63Hz), G4 (392.00Hz), B4 (493.88Hz)
    const frequencies = [110.00, 164.81, 261.63, 392.00, 493.88];
    
    frequencies.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      // Use triangle or sine waves for smooth, warm drones
      osc.type = index % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.value = freq;
      
      // Detune slightly for lush chorus effect
      osc.detune.value = (Math.random() - 0.5) * 15;

      const oscGain = this.ctx.createGain();
      oscGain.gain.value = 0.2 / frequencies.length;

      // Connect to delay and filter
      osc.connect(oscGain);
      oscGain.connect(filter);
      
      // Feed some into the echo delay unit
      const delayFeed = this.ctx.createGain();
      delayFeed.gain.value = 0.15;
      oscGain.connect(delayFeed);
      delayFeed.connect(this.delayNode);

      osc.start(now);
      this.ambientOscs.push(osc);
    });
    
    // Store LFO in oscillators array so we can stop it later
    this.ambientOscs.push(lfo);
  }

  stopAmbient() {
    this.ambientOscs.forEach(osc => {
      try { osc.stop(); } catch(e) {}
    });
    this.ambientOscs = [];
    if (this.ambientNode) {
      try { this.ambientNode.disconnect(); } catch(e) {}
      this.ambientNode = null;
    }
  }

  // Synthesize a magical spell cast sweep
  playSpellSFX() {
    if (this.isMuted || !this.ctx) return;
    
    const now = this.ctx.currentTime;
    
    // 1. Synthesizer sweep
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.8);
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(2500, now + 0.8);
    filter.Q.value = 5;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(this.sfxVolumeValue, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterVolume);
    
    // Feed into the echo delay for magical tail
    const delayFeed = this.ctx.createGain();
    delayFeed.gain.value = 0.3;
    gain.connect(delayFeed);
    delayFeed.connect(this.delayNode);

    osc.start(now);
    osc.stop(now + 0.85);

    // 2. High-frequency noise sparkles (combining FM or highpass noise)
    const sparkleOsc = this.ctx.createOscillator();
    sparkleOsc.type = 'triangle';
    sparkleOsc.frequency.setValueAtTime(1200, now);
    sparkleOsc.frequency.linearRampToValueAtTime(4500, now + 0.6);
    
    // Fast frequency modulation (vibraphone/sparkle)
    const vibrato = this.ctx.createOscillator();
    vibrato.frequency.value = 35;
    const vibratoGain = this.ctx.createGain();
    vibratoGain.gain.value = 300;
    
    vibrato.connect(vibratoGain);
    vibratoGain.connect(sparkleOsc.frequency);

    const sparkleGain = this.ctx.createGain();
    sparkleGain.gain.setValueAtTime(0, now);
    sparkleGain.gain.linearRampToValueAtTime(this.sfxVolumeValue * 0.4, now + 0.05);
    sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    sparkleOsc.connect(sparkleGain);
    sparkleGain.connect(this.masterVolume);

    vibrato.start(now);
    sparkleOsc.start(now);
    
    vibrato.stop(now + 0.65);
    sparkleOsc.stop(now + 0.65);
  }

  // Synthesize a page-turning sound (paper sweep)
  playPageTurnSFX() {
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.4; // 0.4 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Create white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = buffer;

    // Filter to simulate paper rustling (moving bandpass filter)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 2.0;
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.4);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(this.sfxVolumeValue * 0.7, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    noiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterVolume);

    noiseNode.start(now);
    noiseNode.stop(now + 0.45);
  }

  // Synthesize a metallic gold coin chime
  playCoinSFX() {
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;

    // High pitch chime using two sine waves for metallic dissonance
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();

    osc1.type = 'sine';
    osc1.frequency.value = 987.77; // B5
    
    osc2.type = 'sine';
    osc2.frequency.value = 1318.51; // E6 (creates a bright perfect fifth/fourth harmony)

    const gain1 = this.ctx.createGain();
    const gain2 = this.ctx.createGain();

    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(this.sfxVolumeValue * 0.5, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(this.sfxVolumeValue * 0.4, now + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain1);
    osc2.connect(gain2);

    gain1.connect(this.masterVolume);
    gain2.connect(this.masterVolume);

    osc1.start(now);
    osc2.start(now);

    osc1.stop(now + 0.4);
    osc2.stop(now + 0.4);
  }

  // Synthesize metallic sword draw/clang
  playSwordSFX() {
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;

    // Metallic clash (high frequency frequency sweeps + decay)
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2000, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);

    const ring = this.ctx.createOscillator();
    ring.type = 'sine';
    ring.frequency.value = 880; // A5 metal resonance
    ring.detune.value = 10;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 1800;
    noiseFilter.Q.value = 8;

    // Generate quick noise burst for the clash impact
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(this.sfxVolumeValue * 0.8, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterVolume);

    // Vol Gains
    const gain1 = this.ctx.createGain();
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(this.sfxVolumeValue * 0.6, now + 0.01);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    const gainRing = this.ctx.createGain();
    gainRing.gain.setValueAtTime(0, now);
    gainRing.gain.linearRampToValueAtTime(this.sfxVolumeValue * 0.4, now + 0.03);
    gainRing.gain.exponentialRampToValueAtTime(0.001, now + 0.6); // ring decays slower

    osc.connect(gain1);
    gain1.connect(this.masterVolume);

    ring.connect(gainRing);
    gainRing.connect(this.masterVolume);
    
    // Connect ring to delay for space
    const delayFeed = this.ctx.createGain();
    delayFeed.gain.value = 0.2;
    gainRing.connect(delayFeed);
    delayFeed.connect(this.delayNode);

    osc.start(now);
    ring.start(now);
    noiseSource.start(now);

    osc.stop(now + 0.2);
    ring.stop(now + 0.65);
  }
}

// Export as a global singleton for easy script usage
window.magicalAudio = new MagicalAudioEngine();
