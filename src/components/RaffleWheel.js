import React, { useState, useRef, useEffect } from 'react';
import './RaffleWheel.css'; 
import { supabase } from '../lib/supabaseClient';

// --- PRIZE CONFIGURATION ---
const TIERS = {
  tier1: {
    label: "iPhone XR - 11 Pro Max",
    dbValue: "Tier 1",
    prizes: [
      { name: "COMPLETE CHARGER", icon: "🔌", weight: 100 },
      { name: "CABLE ONLY", icon: "➰", weight: 80 },
      { name: "CMPT PROTOECTOR & CASE", icon: "🛡️", weight: 100 },
      { name: "CASE ONLY", icon: "📱", weight: 80 },
      { name: "PROTECTOR ONLY", icon: "💎", weight: 80 },
      { name: "THANK YOU", icon: "😢", weight: 15 }
    ]
  },
  tier2: {
    label: "iPhone 12 - 14 Pro Max",
    dbValue: "Tier 2",
    prizes: [
      { name: "COMPLETE CHARGER", icon: "🔌", weight: 100 },
      { name: "CABLE ONLY", icon: "➰", weight: 90 },
      { name: "AIRPODS", icon: "🎧", weight: 12 }, 
      { name: "PROTECOR+CASE", icon: "🛡️", weight: 100 },
      { name: "T-SHIRT", icon: "👕", weight: 40 },
      { name: "10% DISC. NEXT YEAR", icon: "🎫", weight: 12 },
      { name: "THANK YOU", icon: "😢", weight: 10 }
    ]
  },
  tier3: {
    label: "iPhone 15 - 17 Pro Max",
    dbValue: "Tier 3",
    prizes: [
      { name: "AIRPODS", icon: "🎧", weight: 12 },    
      { name: "RICE & OIL", icon: "🍚", weight: 10 }, 
      { name: "COMPLETE CHARGER", icon: "🔌", weight: 100 },
      { name: "T-SHIRT", icon: "👕", weight: 50 },
      { name: "NOKIA 105", icon: "📞", weight: 12 },   
      { name: "15 SERIES CHARGER CMPT", icon: "🔋", weight: 100 },
      { name: "10% 2026 DISC.", icon: "🎟️", weight: 12 },
      { name: "CHICKEN", icon: "🐔", weight: 10 },    
      { name: "THANK YOU", icon: "😢", weight: 10 }
    ]
  }
};

// --- AUDIO ENGINE (Synthesized Sounds) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Helper to play a single note
const playTone = (freq, type, duration, startTime = 0, vol = 0.1) => {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startTime);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  gain.gain.setValueAtTime(0, audioCtx.currentTime + startTime);
  gain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + startTime + duration);
  
  osc.start(audioCtx.currentTime + startTime);
  osc.stop(audioCtx.currentTime + startTime + duration);
};

const playTickSound = () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  // Soft woodblock tick
  playTone(800, 'square', 0.05, 0, 0.03); 
};

const playWinSound = () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  // TRUMPET FANFARE: "Da-da-da-DAAA!" (Major Triad)
  const type = 'sawtooth'; // Sawtooth sounds brassy like a trumpet
  const vol = 0.15;

  // Note 1: C5
  playTone(523.25, type, 0.15, 0, vol);
  // Note 2: C5
  playTone(523.25, type, 0.15, 0.15, vol);
  // Note 3: C5
  playTone(523.25, type, 0.15, 0.30, vol);
  // Note 4: G5 (Long & Loud)
  playTone(783.99, type, 0.8, 0.45, vol + 0.1);
  
  // Add a harmony note (E5) on the last blast for richness
  playTone(659.25, 'triangle', 0.8, 0.45, vol);
};

const playLoseSound = () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  // Sad "Wah-wah-wah" slide
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(300, audioCtx.currentTime);
  osc.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.8);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.8);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.8);
};


export default function RaffleWheel({ branch }) {
  const [selectedTier, setSelectedTier] = useState('tier1');
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [rotation, setRotation] = useState(0);
  
  const currentRotation = useRef(0);
  
  // --- PHYSICS ---
  const spinDuration = 12000; // 12 Seconds
  const spinCount = 20;       // 20 Full Rotations

  const currentTierData = TIERS[selectedTier];
  const prizes = currentTierData.prizes;
  const numSegments = prizes.length;
  const segmentAngle = 360 / numSegments;

  // --- SOUND LOGIC ---
  useEffect(() => {
    let tickInterval;
    if (spinning) {
      // Play tick every 100ms
      tickInterval = setInterval(() => {
        playTickSound();
      }, 100);
    } else {
      clearInterval(tickInterval);
    }
    return () => clearInterval(tickInterval);
  }, [spinning]);

  useEffect(() => {
    setRotation(0);
    currentRotation.current = 0;
    setResult(null);
  }, [selectedTier]);

  // SVG Helper
  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const drawSlice = (index) => {
    const startAngle = index / numSegments;
    const endAngle = (index + 1) / numSegments;
    const [startX, startY] = getCoordinatesForPercent(startAngle);
    const [endX, endY] = getCoordinatesForPercent(endAngle);
    const largeArcFlag = startAngle - endAngle <= 0.5 ? 0 : 1;
    return `M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`;
  };

  const spin = async () => {
    if (spinning || result) return;
    
    // Ensure Audio Context is active
    if (audioCtx.state === 'suspended') await audioCtx.resume();

    setSpinning(true);

    // 1. SELECT WINNER
    let totalWeight = prizes.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    let winningIndex = 0;
    for (let i = 0; i < prizes.length; i++) {
      if (random < prizes[i].weight) {
        winningIndex = i;
        break;
      }
      random -= prizes[i].weight;
    }
    
    const winningPrize = prizes[winningIndex];

    // 2. MATH
    const fullSpins = spinCount * 360; 
    const targetAngle = (winningIndex * segmentAngle) + (segmentAngle / 2);
    const landingAngle = -targetAngle;
    const currentMod = currentRotation.current % 360;
    const finalRotate = currentRotation.current - currentMod + fullSpins + (360 + landingAngle);

    setRotation(finalRotate);

    // 3. FINISH
    setTimeout(async () => {
      setResult(winningPrize);
      setSpinning(false);
      currentRotation.current = finalRotate; 

      // PLAY TRUMPET FANFARE
      if (winningPrize.name.includes("TRY AGAIN")) {
        playLoseSound();
      } else {
        playWinSound();
      }

      // SAVE TO DB
      if (!winningPrize.name.includes("TRY AGAIN")) {
        try {
          await supabase.from('raffle_wins').insert([
            { branch: branch, tier: currentTierData.dbValue, prize_name: winningPrize.name }
          ]);
        } catch (error) { console.error("Error saving win:", error); }
      }
    }, spinDuration);
  };

  const reset = () => {
      setResult(null);
  };

  return (
    <div className="raffle-container">
      {!spinning && !result && (
        <div className="tier-selector">
          <label>SELECT CATEGORY:</label>
          <select value={selectedTier} onChange={(e) => setSelectedTier(e.target.value)}>
            {Object.entries(TIERS).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
        </div>
      )}

      <div className="wheel-wrapper">
        <div className="pointer-arrow"></div>
        <div 
          className="svg-wheel-container"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? `transform ${spinDuration}ms cubic-bezier(0.12, 0.8, 0.1, 1)` : 'none'
          }}
        >
            <svg viewBox="-1 -1 2 2" style={{ transform: 'rotate(-90deg)' }}> 
                <defs>
                    <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFD700" />
                        <stop offset="50%" stopColor="#FDB931" />
                        <stop offset="100%" stopColor="#B8860B" />
                    </linearGradient>
                    <linearGradient id="black-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#333" />
                        <stop offset="100%" stopColor="#000" />
                    </linearGradient>
                </defs>
                
                {prizes.map((prize, index) => {
                    const midAngle = (index * segmentAngle) + (segmentAngle / 2);
                    const rad = (midAngle * Math.PI) / 180;
                    const textX = Math.cos(rad) * 0.65;
                    const textY = Math.sin(rad) * 0.65;

                    return (
                        <g key={index}>
                            <path 
                                d={drawSlice(index)} 
                                fill={index % 2 === 0 ? "url(#gold-grad)" : "url(#black-grad)"} 
                                stroke="#1a1a1a"
                                strokeWidth="0.01"
                            />
                            <g transform={`translate(${textX}, ${textY}) rotate(${midAngle})`}>
                                <text x="0" y="0" fill={index % 2 === 0 ? "black" : "#FFD700"} fontSize="0.08" fontWeight="900" textAnchor="middle" dominantBaseline="middle">{prize.icon}</text>
                                <text x="0" y="0.12" fill={index % 2 === 0 ? "black" : "#FFD700"} fontSize="0.06" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">{prize.name}</text>
                            </g>
                        </g>
                    );
                })}
            </svg>
        </div>
        <div className="wheel-center-cap"><div className="center-inner">SPIN</div></div>
    </div>

      {result && (
        <div className="winner-overlay">
          <div className="winner-card-luxury">
            <h2 className="winner-title">{result.name.includes("TRY AGAIN") ? "OOPS!" : "CONGRATULATIONS!"}</h2>
            <div className="winner-icon-large">{result.icon}</div>
            <div className="winner-name-large">{result.name}</div>
            {result.name.includes("CHICKEN") || result.name.includes("RICE") ? (<div className="jackpot-alert">JACKPOT WIN!</div>) : null}
            <button onClick={reset} className="next-spin-btn-luxury">NEXT CUSTOMER</button>
          </div>
          {!result.name.includes("TRY AGAIN") && <div className="confetti-gold"></div>}
        </div>
      )}

      {!result && (
        <button className="big-spin-btn-luxury" onClick={spin} disabled={spinning}>
            {spinning ? 'SPINNING...' : 'SPIN TO WIN'}
        </button>
      )}
    </div>
  );
}
