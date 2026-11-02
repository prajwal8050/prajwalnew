import React, { useRef, useEffect, useState } from 'react';
import { Check, Gift, Sparkles, CheckCircle2 } from 'lucide-react';
import { LoveCoupon } from '../../types/birthday';
import { sounds } from '../../utils/soundEffects';

interface ScratchCouponProps {
  coupon: LoveCoupon;
  onRedeem: (couponId: string) => void;
}

export const ScratchCoupon: React.FC<ScratchCouponProps> = ({ coupon, onRedeem }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isScratched, setIsScratched] = useState<boolean>(coupon.isScratched);
  const [isRedeemed, setIsRedeemed] = useState<boolean>(coupon.isRedeemed);
  const isDrawing = useRef(false);

  useEffect(() => {
    if (isScratched) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill canvas with gold/rose metallic shimmer
    const rect = canvas.getBoundingClientRect();
    const width = (canvas.width = Math.max(rect.width || canvas.offsetWidth || 300, 200));
    const height = (canvas.height = Math.max(rect.height || canvas.offsetHeight || 110, 80));

    if (width <= 0 || height <= 0) return;

    try {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#f59e0b');
      grad.addColorStop(0.3, '#fbbf24');
      grad.addColorStop(0.5, '#fde68a');
      grad.addColorStop(0.7, '#fbbf24');
      grad.addColorStop(1, '#d97706');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Decorative scratch pattern text
      ctx.fillStyle = 'rgba(120, 53, 15, 0.45)';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✨ Rub with cursor to scratch ✨', width / 2, height / 2);
    } catch {
      // Safe fallback
    }
  }, [isScratched]);

  const scratch = (clientX: number, clientY: number) => {
    if (isScratched) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    sounds.playScratchSound();

    // Check completion threshold
    checkScratchProgress(ctx, canvas.width, canvas.height);
  };

  const checkScratchProgress = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    try {
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      let clearPixels = 0;
      const totalPixels = data.length / 4;

      for (let i = 3; i < data.length; i += 16) {
        if (data[i] === 0) clearPixels++;
      }

      const ratio = clearPixels / (totalPixels / 4);
      if (ratio > 0.42) {
        setIsScratched(true);
        sounds.playCelebrationChime();
      }
    } catch {
      // Fallback
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDrawing.current = true;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
  };

  const handleRedeemClick = () => {
    sounds.playCelebrationChime();
    setIsRedeemed(true);
    onRedeem(coupon.id);
  };

  return (
    <div className="relative rounded-xl overflow-hidden bg-stone-900 border border-stone-800 shadow-lg flex flex-col justify-between p-5 transition-transform hover:-translate-y-1">
      {/* Top Banner */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>{coupon.badge}</span>
        </span>
        <span className="text-[10px] font-mono text-stone-500 uppercase">
          {coupon.code}
        </span>
      </div>

      {/* Hidden Content Box with Scratch Layer */}
      <div className="relative rounded-lg overflow-hidden bg-stone-950 border border-stone-800 p-4 min-h-[110px] flex flex-col justify-center text-center my-1">
        {/* Underlying Perk Text */}
        <div>
          <h4 className="font-serif-display text-base font-bold text-rose-200 mb-1">
            {coupon.title}
          </h4>
          <p className="text-xs text-stone-300 font-light leading-relaxed">
            {coupon.perk}
          </p>
        </div>

        {/* Scratch Canvas Overlay */}
        {!isScratched && (
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="absolute inset-0 w-full h-full cursor-crosshair touch-none z-10"
          />
        )}
      </div>

      {/* Bottom Redemption State */}
      <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between">
        {!isScratched ? (
          <button
            onClick={() => {
              setIsScratched(true);
              sounds.playSparkle();
            }}
            className="text-[11px] text-stone-400 hover:text-stone-200 underline focus:outline-none"
          >
            Instant Reveal
          </button>
        ) : isRedeemed ? (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Redeemed for You!</span>
          </div>
        ) : (
          <button
            onClick={handleRedeemClick}
            className="w-full py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Redeem This Voucher</span>
          </button>
        )}
      </div>

      {/* Stamped Watermark when redeemed */}
      {isRedeemed && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rotate-[-15deg] border-2 border-emerald-500 text-emerald-500 font-black text-sm tracking-widest uppercase px-3 py-1 rounded bg-black/40 backdrop-blur-sm">
          REDEEMED ✓
        </div>
      )}
    </div>
  );
};
