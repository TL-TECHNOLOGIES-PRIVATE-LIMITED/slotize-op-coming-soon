import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ComingSoonPage = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const particlesMeshRef = useRef(null);
  const timeRef = useRef(0);
  const [countdown, setCountdown] = React.useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  // Initialize Three.js scene
  useEffect(() => {
    sceneRef.current = new THREE.Scene();
    sceneRef.current.background = new THREE.Color(0x000819); // Dark blue background
    
    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    rendererRef.current = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });

    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current.setPixelRatio(window.devicePixelRatio);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 300;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const scales = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount; i++) {
      // Position
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;

      // Color - Create aurora colors
      const color = new THREE.Color();
      color.setHSL(
        0.5 + Math.random() * 0.2, 
        0.8, // Saturation
        0.6 + Math.random() * 0.2 
      );
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      // Scale (size) of particles
      scales[i] = Math.random();
    }

    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    particlesGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(colors, 3)
    );
    particlesGeometry.setAttribute(
      'scale',
      new THREE.BufferAttribute(scales, 1)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    particlesMeshRef.current = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );
    sceneRef.current.add(particlesMeshRef.current);

    cameraRef.current.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      timeRef.current += 0.001;

      if (particlesMeshRef.current) {
        // Update particle positions for aurora effect
        const positions = particlesMeshRef.current.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += Math.sin(timeRef.current + i) * 0.002;
          positions[i + 1] += Math.cos(timeRef.current + i) * 0.002;
        }
        particlesMeshRef.current.geometry.attributes.position.needsUpdate = true;

        // Rotate the entire system slowly
        particlesMeshRef.current.rotation.y += 0.0003;
        particlesMeshRef.current.rotation.x += 0.0001;
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    animate();

    const handleResize = () => {
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (particlesMeshRef.current) {
        particlesGeometry.dispose();
        particlesMaterial.dispose();
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    const launchDate = new Date('2024-12-31T00:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      if (distance < 0) {
        setCountdown({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
        });
        return;
      }

      setCountdown({
        days: String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0'),
        hours: String(
          Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        ).padStart(2, '0'),
        minutes: String(
          Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        ).padStart(2, '0'),
        seconds: String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(
          2,
          '0'
        ),
      });
    };

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(timer);
  }, []);

  const CountdownItem = ({ value, label }) => (
    <div className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur-md shadow-lg">
      <span className="text-3xl md:text-4xl font-bold text-blue-600 animate-pulse">{value}</span>
      <span className="text-xs sm:text-sm text-gray-200 ">{label}</span>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-[#000819]">
      <canvas ref={canvasRef} className="fixed inset-0" />
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="p-6 sm:p-8 rounded-lg bg-black/70 backdrop-blur-sm shadow-2xl w-full max-w-lg">
          <div className="text-center">
            <h1 className="mb-4 text-4xl sm:text-6xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              SLOTIZE
            </h1>
            <p className="mb-6 text-base sm:text-xl text-gray-200">
              Revolutionize your appointment scheduling with cutting-edge features and seamless integration.
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-4 sm:gap-8 mb-6">
              <CountdownItem value={countdown.days} label="Days" />
              <CountdownItem value={countdown.hours} label="Hours" />
              <CountdownItem value={countdown.minutes} label="Minutes" />
              <CountdownItem value={countdown.seconds} label="Seconds" />
            </div>
            <p className="text-sm sm:text-base text-gray-300">
              <span className="font-semibold">December 31, 2024</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;