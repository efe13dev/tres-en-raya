import { useCallback, useEffect, useRef } from 'react';

const SOUND_MAP = {
  moveX: [
    { frequency: 392, duration: 0.08, volume: 0.035, type: 'triangle' },
    { frequency: 523, duration: 0.12, volume: 0.02, type: 'sine', delay: 0.03 }
  ],
  moveO: [
    { frequency: 294, duration: 0.08, volume: 0.032, type: 'sine' },
    { frequency: 440, duration: 0.12, volume: 0.024, type: 'triangle', delay: 0.03 }
  ],
  win: [
    { frequency: 523, duration: 0.1, volume: 0.035, type: 'triangle' },
    { frequency: 659, duration: 0.12, volume: 0.03, type: 'triangle', delay: 0.08 },
    { frequency: 784, duration: 0.18, volume: 0.028, type: 'sine', delay: 0.16 }
  ],
  draw: [
    { frequency: 330, duration: 0.1, volume: 0.03, type: 'sine' },
    { frequency: 294, duration: 0.12, volume: 0.024, type: 'triangle', delay: 0.08 }
  ],
  reset: [
    { frequency: 260, duration: 0.08, volume: 0.026, type: 'sawtooth' },
    { frequency: 220, duration: 0.1, volume: 0.02, type: 'triangle', delay: 0.05 }
  ]
};

function buildTone(audioContext, tone) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const filterNode = audioContext.createBiquadFilter();
  const startTime = audioContext.currentTime + (tone.delay ?? 0);
  const endTime = startTime + tone.duration;

  oscillator.type = tone.type;
  oscillator.frequency.setValueAtTime(tone.frequency, startTime);

  filterNode.type = 'lowpass';
  filterNode.frequency.setValueAtTime(1800, startTime);

  gainNode.gain.setValueAtTime(0.0001, startTime);
  gainNode.gain.exponentialRampToValueAtTime(tone.volume, startTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, endTime);

  oscillator.connect(filterNode);
  filterNode.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start(startTime);
  oscillator.stop(endTime + 0.02);
}

export function useSound(enabled) {
  const audioContextRef = useRef(null);

  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      return null;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }

    return audioContextRef.current;
  }, []);

  const warmup = useCallback(() => {
    if (!enabled) {
      return;
    }

    const audioContext = getAudioContext();
    if (audioContext?.state === 'suspended') {
      audioContext.resume();
    }
  }, [enabled, getAudioContext]);

  const play = useCallback((type) => {
    if (!enabled) {
      return;
    }

    const audioContext = getAudioContext();

    if (!audioContext) {
      return;
    }

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const preset = SOUND_MAP[type];

    if (!preset) {
      return;
    }

    preset.forEach((tone) => buildTone(audioContext, tone));
  }, [enabled, getAudioContext]);

  useEffect(() => {
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    warmup,
    play
  };
}
