import React, { useEffect, useRef } from 'react';

interface EntropyProps {
    className?: string;
    size?: number;
}

export function Entropy({ className = "", size = 400 }: EntropyProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Basic Settings
        const dpr = window.devicePixelRatio || 1;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
        ctx.scale(dpr, dpr);

        // Theme Colors
        const colors = ['#a855f7', '#3b82f6', '#ec4899', '#10b981', '#f59e0b']; // Purple, Blue, Pink, Emerald, Amber

        class Particle {
            x: number;
            y: number;
            size: number;
            order: boolean;
            velocity: { x: number; y: number };
            originalX: number;
            originalY: number;
            influence: number;
            neighbors: Particle[];
            color: string;
            twinkleSpeed: number;
            twinklePhase: number;

            constructor(x: number, y: number, order: boolean) {
                this.x = x;
                this.y = y;
                this.originalX = x;
                this.originalY = y;
                this.size = Math.random() * 2 + 1;
                this.order = order;
                this.velocity = {
                    x: (Math.random() - 0.5) * 2,
                    y: (Math.random() - 0.5) * 2
                };
                this.influence = 0;
                this.neighbors = [];
                // Assign a "hidden" color that only reveals when twinkling
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.twinkleSpeed = Math.random() * 0.05 + 0.02;
                this.twinklePhase = Math.random() * Math.PI * 2;
            }

            update(time: number) {
                if (this.order) {
                    // Ordered particles influenced by chaos
                    const dx = this.originalX - this.x;
                    const dy = this.originalY - this.y;

                    // Calculate influence from chaotic neighbors
                    const chaosInfluence = { x: 0, y: 0 };
                    this.neighbors.forEach(neighbor => {
                        if (!neighbor.order) {
                            const distance = Math.hypot(this.x - neighbor.x, this.y - neighbor.y);
                            const strength = Math.max(0, 1 - distance / 100);
                            chaosInfluence.x += (neighbor.velocity.x * strength);
                            chaosInfluence.y += (neighbor.velocity.y * strength);
                            this.influence = Math.max(this.influence, strength);
                        }
                    });

                    // Mix ordered motion and chaotic influence
                    this.x += dx * 0.05 * (1 - this.influence) + chaosInfluence.x * this.influence;
                    this.y += dy * 0.05 * (1 - this.influence) + chaosInfluence.y * this.influence;

                    // Influence decay
                    this.influence *= 0.99;
                } else {
                    // Chaotic motion
                    this.velocity.x += (Math.random() - 0.5) * 0.5;
                    this.velocity.y += (Math.random() - 0.5) * 0.5;
                    this.velocity.x *= 0.95;
                    this.velocity.y *= 0.95;
                    this.x += this.velocity.x;
                    this.y += this.velocity.y;

                    // Boundary checks
                    if (this.x < size / 2 || this.x > size) this.velocity.x *= -1;
                    if (this.y < 0 || this.y > size) this.velocity.y *= -1;
                    this.x = Math.max(size / 2, Math.min(size, this.x));
                    this.y = Math.max(0, Math.min(size, this.y));
                }
            }

            draw(ctx: CanvasRenderingContext2D, time: number) {
                // Twinkle Logic
                const twinkle = Math.sin(time * this.twinkleSpeed + this.twinklePhase);
                const normalizedTwinkle = (twinkle + 1) / 2; // 0 to 1

                // Alpha calc - Make it brighter overall (0.4 to 1.0 range)
                const alpha = this.order ?
                    (0.9 - this.influence * 0.5) * (0.6 + normalizedTwinkle * 0.4) :
                    0.9 * (0.6 + normalizedTwinkle * 0.4);

                // Color Logic: Mostly bright white, very rare subtle color touches
                // Threshold increased to 0.96 for "very small touches"
                if (normalizedTwinkle > 0.96) {
                    ctx.fillStyle = this.color;
                    ctx.globalAlpha = alpha;
                } else {
                    ctx.fillStyle = '#ffffff';
                    ctx.globalAlpha = alpha; // Removed the dimmer factor, keep it bright
                }

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0; // Reset
            }
        }

        // Create particle grid
        const particles: Particle[] = [];
        const gridSize = 25;
        const spacing = size / gridSize;

        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const x = spacing * i + spacing / 2;
                const y = spacing * j + spacing / 2;
                const order = x < size / 2; // Left side ordered, right side chaos
                particles.push(new Particle(x, y, order));
            }
        }

        // Update neighbors
        function updateNeighbors() {
            particles.forEach(particle => {
                particle.neighbors = particles.filter(other => {
                    if (other === particle) return false;
                    const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
                    return distance < 100;
                });
            });
        }

        let time = 0;
        let animationId: number;

        function animate() {
            if (!ctx) return;
            ctx.clearRect(0, 0, size, size);

            // Update neighbors logic (throttled)
            if (time % 30 === 0) {
                updateNeighbors();
            }

            // Update and draw all particles
            particles.forEach(particle => {
                particle.update(time);
                particle.draw(ctx, time);

                // Draw connections
                particle.neighbors.forEach(neighbor => {
                    const distance = Math.hypot(particle.x - neighbor.x, particle.y - neighbor.y);
                    if (distance < 50) {
                        const alpha = 0.2 * (1 - distance / 50);

                        // Lines are white
                        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(neighbor.x, neighbor.y);
                        ctx.stroke();
                    }
                });
            });

            // Draw separator line
            ctx.strokeStyle = '#ffffff4D'; // Using a default white with alpha since particleColor is removed
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(size / 2, 0);
            ctx.lineTo(size / 2, size);
            ctx.stroke();

            // Labels replaced with English for consistency
            ctx.font = '12px monospace';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';

            time++;
            animationId = requestAnimationFrame(animate);
        }

        animate();

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [size]);

    return (
        <div className={`relative ${className}`} style={{ width: size, height: size }}>
            <canvas
                ref={canvasRef}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
        </div>
    );
}
