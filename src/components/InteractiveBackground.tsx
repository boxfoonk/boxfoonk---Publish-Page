import { useEffect, useRef } from 'react';

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = { x: 0, y: 0, radius: 250, isOutside: true };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      baseColor: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2 + 1.5;
        this.speedX = (Math.random() - 0.5) * 1.2; // Increased speed
        this.speedY = (Math.random() - 0.5) * 1.2; // Increased speed
        
        // Multi-color particles
        const colors = [
          'rgba(244, 63, 94, 0.4)',  // rose
          'rgba(251, 191, 36, 0.4)', // amber
          'rgba(99, 102, 241, 0.4)', // indigo
          'rgba(20, 184, 166, 0.4)', // teal
          'rgba(255, 255, 255, 0.3)' // white
        ];
        this.baseColor = colors[Math.floor(Math.random() * colors.length)];
        this.color = this.baseColor;
      }

      update() {
        // Basic movement
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x > canvas!.width) this.x = 0;
        else if (this.x < 0) this.x = canvas!.width;
        if (this.y > canvas!.height) this.y = 0;
        else if (this.y < 0) this.y = canvas!.height;

        // Mouse interaction: Planetary Gravity (Attraction)
        if (!mouse.isOutside) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            
            // Power of attraction increases as distance decreases (Gravitational feel)
            const force = (mouse.radius - distance) / mouse.radius;
            const pullX = forceDirectionX * force * 1.5; // Much stronger pull
            const pullY = forceDirectionY * force * 1.5;
            
            this.x += pullX;
            this.y += pullY;
            
            // Particles glow brighter when near the mouse
            this.color = this.baseColor.replace('0.4', '0.8').replace('0.3', '0.7');
          } else {
            this.color = this.baseColor;
          }
        } else {
          this.color = this.baseColor;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      // Reduce density for better performance: 15000 pixels per particle
      const numberOfParticles = Math.min((canvas.width * canvas.height) / 15000, 150); 
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isOutside = false;
    };

    const handleMouseLeave = () => {
      mouse.isOutside = true;
    };

    const handleMouseEnter = () => {
      mouse.isOutside = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    // Boundary safety: if mouse is nowhere to be found, don't attract
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    handleResize();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distanceSq = dx * dx + dy * dy;

          if (distanceSq < 22500) { // 150 * 150
            const opacity = 0.12 * (1 - Math.sqrt(distanceSq) / 150);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 0.4;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-70"
      style={{ background: 'transparent' }}
    />
  );
}
