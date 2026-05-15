"use client";

import { useRef, useEffect, useCallback } from "react";
import { useGameStore } from "@/store/game-store";

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  speed: number;
}

interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export function TennisGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef({
    ball: { x: 400, y: 300, vx: 4, vy: -4, radius: 10, speed: 5 } as Ball,
    playerPaddle: { x: 350, y: 560, width: 100, height: 14 } as Paddle,
    aiPaddle: { x: 350, y: 26, width: 100, height: 14 } as Paddle,
    particles: [] as Particle[],
    score: 0,
    combo: 0,
    maxCombo: 0,
    lives: 3,
    startTime: 0,
    lastHitTime: 0,
    gameOver: false,
    mouseX: 400,
    touchX: 400,
    isTouching: false,
    shake: 0,
    trail: [] as { x: number; y: number; alpha: number }[],
  });

  const { isPlaying, isPaused, isGameOver, startGame, endGame, pauseGame } =
    useGameStore();

  const spawnParticles = useCallback((x: number, y: number, color: string, count: number) => {
    const state = gameStateRef.current;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      state.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 1,
        color,
        size: Math.random() * 4 + 2,
      });
    }
  }, []);

  const resetBall = useCallback((direction: number) => {
    const state = gameStateRef.current;
    state.ball.x = 400;
    state.ball.y = 300;
    state.ball.speed = 5;
    const angle = (Math.random() * 0.6 + 0.2) * Math.PI * direction;
    state.ball.vx = Math.cos(angle) * state.ball.speed * (Math.random() > 0.5 ? 1 : -1);
    state.ball.vy = Math.sin(angle) * state.ball.speed * (direction > 0 ? 1 : -1);
    state.combo = 0;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      gameStateRef.current.mouseX = (e.clientX - rect.left) * scaleX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      gameStateRef.current.touchX = (e.touches[0].clientX - rect.left) * scaleX;
      gameStateRef.current.isTouching = true;
    };

    const handleTouchEnd = () => {
      gameStateRef.current.isTouching = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd);
    canvas.addEventListener("touchcancel", handleTouchEnd);

    let animFrame: number;

    const drawCourt = (ctx: CanvasRenderingContext2D) => {
      // Background
      const gradient = ctx.createLinearGradient(0, 0, 0, 600);
      gradient.addColorStop(0, "#1a5f2a");
      gradient.addColorStop(1, "#2d8a3e");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 600);

      // Court lines
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 3;

      // Outer boundary
      ctx.strokeRect(50, 50, 700, 500);

      // Center line
      ctx.beginPath();
      ctx.moveTo(50, 300);
      ctx.lineTo(750, 300);
      ctx.stroke();

      // Center circle
      ctx.beginPath();
      ctx.arc(400, 300, 50, 0, Math.PI * 2);
      ctx.stroke();

      // Service lines
      ctx.beginPath();
      ctx.moveTo(250, 50);
      ctx.lineTo(250, 550);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(550, 50);
      ctx.lineTo(550, 550);
      ctx.stroke();

      // Net
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillRect(48, 296, 704, 8);
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 2;
      for (let i = 50; i < 750; i += 15) {
        ctx.beginPath();
        ctx.moveTo(i, 296);
        ctx.lineTo(i, 304);
        ctx.stroke();
      }
    };

    const drawPaddle = (ctx: CanvasRenderingContext2D, paddle: Paddle, isPlayer: boolean) => {
      const gradient = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x, paddle.y + paddle.height);
      if (isPlayer) {
        gradient.addColorStop(0, "#ff6b6b");
        gradient.addColorStop(1, "#ee5a5a");
      } else {
        gradient.addColorStop(0, "#4ecdc4");
        gradient.addColorStop(1, "#3dbbb3");
      }
      ctx.fillStyle = gradient;
      ctx.shadowColor = isPlayer ? "#ff6b6b" : "#4ecdc4";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.roundRect(paddle.x - paddle.width / 2, paddle.y, paddle.width, paddle.height, 7);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Paddle detail
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillRect(paddle.x - paddle.width / 2 + 5, paddle.y + 3, paddle.width - 10, 3);
    };

    const drawBall = (ctx: CanvasRenderingContext2D, ball: Ball) => {
      // Trail
      const state = gameStateRef.current;
      state.trail.forEach((t) => {
        ctx.beginPath();
        ctx.arc(t.x, t.y, ball.radius * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 220, 50, ${t.alpha * 0.4})`;
        ctx.fill();
      });

      // Glow
      const glow = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, ball.radius * 3);
      glow.addColorStop(0, "rgba(255, 220, 50, 0.4)");
      glow.addColorStop(1, "rgba(255, 220, 50, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius * 3, 0, Math.PI * 2);
      ctx.fill();

      // Ball
      const ballGrad = ctx.createRadialGradient(
        ball.x - 3, ball.y - 3, 0,
        ball.x, ball.y, ball.radius
      );
      ballGrad.addColorStop(0, "#fff9c4");
      ballGrad.addColorStop(0.5, "#ffeb3b");
      ballGrad.addColorStop(1, "#fbc02d");
      ctx.fillStyle = ballGrad;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();

      // Tennis ball seam
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius * 0.7, 0.5, 2.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius * 0.7, 3.5, 5.5);
      ctx.stroke();
    };

    const drawParticles = (ctx: CanvasRenderingContext2D) => {
      const state = gameStateRef.current;
      state.particles.forEach((p) => {
        ctx.globalAlpha = p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    const drawUI = (ctx: CanvasRenderingContext2D) => {
      const state = gameStateRef.current;

      // Score
      ctx.fillStyle = "#fff";
      ctx.font = "bold 28px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 4;
      ctx.fillText(`${state.score}`, 400, 280);

      // Combo
      if (state.combo > 1) {
        ctx.fillStyle = "#ffeb3b";
        ctx.font = "bold 18px system-ui, sans-serif";
        ctx.fillText(`${state.combo}x COMBO!`, 400, 310);
      }

      // Lives
      ctx.font = "20px system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillStyle = "#fff";
      let livesStr = "";
      for (let i = 0; i < state.lives; i++) livesStr += "🎾 ";
      ctx.fillText(livesStr, 20, 30);

      // Duration
      const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
      ctx.textAlign = "right";
      ctx.fillText(`⏱️ ${elapsed}s`, 780, 30);

      ctx.shadowBlur = 0;

      // Pause overlay
      if (isPaused && !state.gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, 800, 600);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 36px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("⏸️ PAUSED", 400, 300);
        ctx.font = "18px system-ui, sans-serif";
        ctx.fillText("Click or tap to resume", 400, 340);
      }
    };

    const gameLoop = () => {
      const state = gameStateRef.current;

      if (isPlaying && !isPaused && !state.gameOver) {
        const now = Date.now();

        // Screen shake decay
        if (state.shake > 0) state.shake *= 0.9;
        if (state.shake < 0.5) state.shake = 0;

        // Update player paddle
        const targetX = state.isTouching ? state.touchX : state.mouseX;
        state.playerPaddle.x += (targetX - state.playerPaddle.x) * 0.15;
        state.playerPaddle.x = Math.max(
          state.playerPaddle.width / 2 + 50,
          Math.min(750 - state.playerPaddle.width / 2, state.playerPaddle.x)
        );

        // Update AI paddle
        const aiTarget = state.ball.x;
        state.aiPaddle.x += (aiTarget - state.aiPaddle.x) * 0.08;
        state.aiPaddle.x = Math.max(
          state.aiPaddle.width / 2 + 50,
          Math.min(750 - state.aiPaddle.width / 2, state.aiPaddle.x)
        );

        // Update ball
        state.ball.x += state.ball.vx;
        state.ball.y += state.ball.vy;

        // Wall collisions
        if (state.ball.x - state.ball.radius < 50 || state.ball.x + state.ball.radius > 750) {
          state.ball.vx *= -1;
          state.ball.x = Math.max(50 + state.ball.radius, Math.min(750 - state.ball.radius, state.ball.x));
          spawnParticles(state.ball.x, state.ball.y, "#fff", 5);
        }

        // Player paddle collision
        const pp = state.playerPaddle;
        if (
          state.ball.vy > 0 &&
          state.ball.y + state.ball.radius >= pp.y &&
          state.ball.y - state.ball.radius <= pp.y + pp.height &&
          state.ball.x >= pp.x - pp.width / 2 - 5 &&
          state.ball.x <= pp.x + pp.width / 2 + 5
        ) {
          state.ball.vy = -Math.abs(state.ball.vy);
          const hitOffset = (state.ball.x - pp.x) / (pp.width / 2);
          state.ball.vx += hitOffset * 2;
          state.ball.speed = Math.min(state.ball.speed * 1.03, 14);
          const speed = Math.sqrt(state.ball.vx ** 2 + state.ball.vy ** 2);
          state.ball.vx = (state.ball.vx / speed) * state.ball.speed;
          state.ball.vy = (state.ball.vy / speed) * state.ball.speed;

          state.combo++;
          if (state.combo > state.maxCombo) state.maxCombo = state.combo;
          state.score += 10 * state.combo;
          state.lastHitTime = now;
          state.shake = 5;
          spawnParticles(state.ball.x, state.ball.y, "#ff6b6b", 12);
        }

        // AI paddle collision
        const ap = state.aiPaddle;
        if (
          state.ball.vy < 0 &&
          state.ball.y - state.ball.radius <= ap.y + ap.height &&
          state.ball.y + state.ball.radius >= ap.y &&
          state.ball.x >= ap.x - ap.width / 2 - 5 &&
          state.ball.x <= ap.x + ap.width / 2 + 5
        ) {
          state.ball.vy = Math.abs(state.ball.vy);
          const hitOffset = (state.ball.x - ap.x) / (ap.width / 2);
          state.ball.vx += hitOffset * 1.5;
          state.ball.speed = Math.min(state.ball.speed * 1.02, 12);
          const speed = Math.sqrt(state.ball.vx ** 2 + state.ball.vy ** 2);
          state.ball.vx = (state.ball.vx / speed) * state.ball.speed;
          state.ball.vy = (state.ball.vy / speed) * state.ball.speed;
          spawnParticles(state.ball.x, state.ball.y, "#4ecdc4", 8);
        }

        // Ball out (bottom - player loses life)
        if (state.ball.y > 600) {
          state.lives--;
          state.shake = 8;
          spawnParticles(state.ball.x, 590, "#ff4444", 20);
          if (state.lives <= 0) {
            state.gameOver = true;
            const duration = Math.floor((now - state.startTime) / 1000);
            endGame(state.score, state.maxCombo, duration);
          } else {
            resetBall(1);
          }
        }

        // Ball out (top - AI misses, bonus)
        if (state.ball.y < 0) {
          state.score += 50;
          spawnParticles(state.ball.x, 10, "#4ecdc4", 15);
          resetBall(-1);
        }

        // Update trail
        state.trail.push({ x: state.ball.x, y: state.ball.y, alpha: 1 });
        if (state.trail.length > 15) state.trail.shift();
        state.trail.forEach((t) => (t.alpha *= 0.85));
      }

      // Update particles
      state.particles = state.particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.life -= 0.025;
        return p.life > 0;
      });

      // Render
      ctx.save();
      if (state.shake > 0) {
        ctx.translate(
          (Math.random() - 0.5) * state.shake,
          (Math.random() - 0.5) * state.shake
        );
      }

      ctx.clearRect(0, 0, 800, 600);
      drawCourt(ctx);
      drawPaddle(ctx, state.playerPaddle, true);
      drawPaddle(ctx, state.aiPaddle, false);
      drawBall(ctx, state.ball);
      drawParticles(ctx);
      drawUI(ctx);

      ctx.restore();

      animFrame = requestAnimationFrame(gameLoop);
    };

    animFrame = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animFrame);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [isPlaying, isPaused, isGameOver, endGame, spawnParticles, resetBall]);

  // Handle start/pause click
  const handleCanvasClick = () => {
    if (!isPlaying) {
      startGame();
      const state = gameStateRef.current;
      state.startTime = Date.now();
      state.score = 0;
      state.combo = 0;
      state.maxCombo = 0;
      state.lives = 3;
      state.gameOver = false;
      state.particles = [];
      state.trail = [];
      resetBall(-1);
    } else if (isPaused) {
      useGameStore.getState().resumeGame();
    } else {
      pauseGame();
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-[800px]">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onClick={handleCanvasClick}
        className="w-full cursor-pointer rounded-2xl border-4 border-white/20 shadow-2xl"
        style={{ aspectRatio: "4/3", touchAction: "none" }}
      />
      {!isPlaying && !isGameOver && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="rounded-2xl bg-black/60 px-8 py-6 text-center backdrop-blur-md"
            onClick={handleCanvasClick}
            style={{ pointerEvents: "auto", cursor: "pointer" }}
          >
            <div className="mb-2 text-5xl"
            >🎾
            </div>
            <h3 className="mb-1 text-2xl font-bold text-white"
            >Tennis Rally
            </h3>
            <p className="mb-4 text-white/70"
            >Click or tap to start
            </p>
            <div className="flex gap-4 text-sm text-white/60"
            >
              <span
              >🖱️ Mouse
              </span>
              <span
              >👆 Touch
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
