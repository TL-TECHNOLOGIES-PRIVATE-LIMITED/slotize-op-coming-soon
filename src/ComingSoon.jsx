import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import TypingEffect from './TypingEffect';
import { format } from 'date-fns';

const ComingSoonPage = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const particlesMeshRef = useRef(null);
  const confettiParticlesRef = useRef(null);
  const timeRef = useRef(0);

  const LAUNCH_DATE = new Date('2025-01-15T00:00:00');
  const [isLive, setIsLive] = React.useState(false);
  const [countdown, setCountdown] = React.useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });



  const initConfetti = () => {
    const confettiGeometry = new THREE.BufferGeometry();
    const particlesCount = 200;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const velocities = new Float32Array(particlesCount * 3);
    const rotations = new Float32Array(particlesCount * 3);
  
    // Festive colors for confetti
    const festiveColors = [
      new THREE.Color(0xff0000), // Red
      new THREE.Color(0x00ff00), // Green
      new THREE.Color(0x0000ff), // Blue
      new THREE.Color(0xffff00), // Yellow
      new THREE.Color(0xff00ff), // Magenta
      new THREE.Color(0x00ffff), // Cyan
      new THREE.Color(0xffa500), // Orange
      new THREE.Color(0x800080)  // Purple
    ];
  
    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
  
      // Start from the center of the screen (0, 0, 0)
      positions[i3] = 0;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = 0;
  
      // Random velocities for an outward explosion effect
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.03 + 0.01; 
      velocities[i3] = Math.cos(angle) * speed;
      velocities[i3 + 1] = Math.sin(angle) * speed;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.05;
  
      // Random rotations for the particles to spin during the explosion
      rotations[i3] = Math.random() * 0.02;
      rotations[i3 + 1] = Math.random() * 0.02;
      rotations[i3 + 2] = Math.random() * 0.02;
  
      // Random colors from festive palette
      const color = festiveColors[Math.floor(Math.random() * festiveColors.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
  
    confettiGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    confettiGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
    const confettiMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
  
    const confettiParticles = new THREE.Points(confettiGeometry, confettiMaterial);
    confettiParticlesRef.current = {
      mesh: confettiParticles,
      velocities,
      rotations,
      positions: confettiParticles.geometry.attributes.position.array
    };
  
    sceneRef.current.add(confettiParticles);
  };
  
  const animateConfetti = () => {
    requestAnimationFrame(animateConfetti);
  
    if (confettiParticlesRef.current) {
      const positions = confettiParticlesRef.current.positions;
      const velocities = confettiParticlesRef.current.velocities;
  
      for (let i = 0; i < positions.length; i += 3) {
        // Update positions based on velocity
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];
  
        // Add some swaying motion and reset particles when they reach a certain limit
        if (positions[i + 1] < -5) {
          positions[i + 1] = 10;
          positions[i] = 0;
          positions[i + 2] = 0;
        }
  
        // Add some swaying motion
        positions[i] += Math.sin(timeRef.current + i) * 0.01;
      }
  
      confettiParticlesRef.current.mesh.geometry.attributes.position.needsUpdate = true;
      timeRef.current += 0.01;
    }
  
    rendererRef.current.render(sceneRef.current, cameraRef.current);
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (isLive) {
      // Setup for live state with confetti
      sceneRef.current = new THREE.Scene();
      sceneRef.current.background = new THREE.Color(0x000819);

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

      cameraRef.current.position.z = 5;

      // Initialize confetti
      initConfetti();

      // Animation loop for confetti
      const animateConfetti = () => {
        requestAnimationFrame(animateConfetti);

        if (confettiParticlesRef.current) {
          const positions = confettiParticlesRef.current.positions;
          const velocities = confettiParticlesRef.current.velocities;

          for (let i = 0; i < positions.length; i += 3) {
            // Update positions based on velocity
            positions[i] += velocities[i];
            positions[i + 1] += velocities[i + 1];
            positions[i + 2] += velocities[i + 2];

            // Reset particles that fall below the screen
            if (positions[i + 1] < -5) {
              positions[i + 1] = 10;
              positions[i] = (Math.random() - 0.5) * 20;
              positions[i + 2] = (Math.random() - 0.5) * 20;
            }

            // Add some swaying motion
            positions[i] += Math.sin(timeRef.current + i) * 0.01;
          }

          confettiParticlesRef.current.mesh.geometry.attributes.position.needsUpdate = true;
          timeRef.current += 0.01;
        }

        rendererRef.current.render(sceneRef.current, cameraRef.current);
      };

      animateConfetti();

      const handleResize = () => {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (confettiParticlesRef.current) {
          confettiParticlesRef.current.mesh.geometry.dispose();
          confettiParticlesRef.current.mesh.material.dispose();
        }
        if (rendererRef.current) {
          rendererRef.current.dispose();
        }
      };
    }
  }, [isLive]);

  // Initialize Three.js scene
  useEffect(() => {
    if (!isLive) { // Only initialize if NOT live
      sceneRef.current = new THREE.Scene();
      sceneRef.current.background = new THREE.Color(0x000819);

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
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 10;
        positions[i3 + 1] = (Math.random() - 0.5) * 10;
        positions[i3 + 2] = (Math.random() - 0.5) * 10;

        const color = new THREE.Color();
        color.setHSL(
          0.5 + Math.random() * 0.2,
          0.8,
          0.6 + Math.random() * 0.2
        );
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;

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
        if (!isLive) { // Only continue animation if NOT live
          requestAnimationFrame(animate);
          timeRef.current += 0.001;

          if (particlesMeshRef.current) {
            const positions = particlesMeshRef.current.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
              positions[i] += Math.sin(timeRef.current + i) * 0.002;
              positions[i + 1] += Math.cos(timeRef.current + i) * 0.002;
            }
            particlesMeshRef.current.geometry.attributes.position.needsUpdate = true;
            particlesMeshRef.current.rotation.y += 0.0003;
            particlesMeshRef.current.rotation.x += 0.0001;
          }

          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      };

      animate();

      const handleResize = () => {
        if (!isLive) {
          cameraRef.current.aspect = window.innerWidth / window.innerHeight;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        }
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
    }
  }, [isLive]);

  useEffect(() => {
    const launchDate = LAUNCH_DATE.getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      if (distance < 0) {
        setIsLive(true);
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
          2, '0'
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
      <span className="text-xs sm:text-sm text-gray-200">{label}</span>
    </div>
  );

  const LiveMessage = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="text-4xl md:text-6xl font-bold text-green-500 animate-pulse">
        We are Live!
      </div>
      <div className="text-xl text-gray-200">
        Welcome to the future of appointment scheduling
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-[#000819]">
      <canvas ref={canvasRef} className="fixed inset-0" />
      <div className="relative  z-10 flex items-center justify-center min-h-screen px-4 sm:px-0">
        <div className="p-6 sm:p-8 rounded-lg bg-black/70 backdrop-blur-sm shadow-2xl w-full max-w-2xl">
          {/* Rest of your component JSX */}
          <div className="text-center">
            <div className="flex items-center justify-center bg-white/70 mx-auto max-w-sm rounded-lg">
              <img src="/Slotize.png" alt="Slotize Logo" className="w-16 h-16 sm:w-24 -ml-12 sm:h-24" />
              <h1 className="mb-4 text-4xl sm:text-6xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                SLOTIZE
              </h1>
            </div>
            <p className="my-6 text-base sm:text-xl text-gray-200">
              Revolutionize your appointment scheduling with cutting-edge features and seamless integration.
            </p>
            {!isLive ? (
              <>
                <div className="mb-8">
                  <TypingEffect
                    text="Coming Soon"
                    className="text-blue-600"
                  />
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-4 gap-4 sm:gap-8 mb-6">
                  <CountdownItem value={countdown.days} label="Days" />
                  <CountdownItem value={countdown.hours} label="Hours" />
                  <CountdownItem value={countdown.minutes} label="Minutes" />
                  <CountdownItem value={countdown.seconds} label="Seconds" />
                </div>
                <p className="text-sm sm:text-base text-gray-300">
                  <span className="font-semibold">{format(LAUNCH_DATE, 'dd MMMM, yyyy')}</span>
                </p>
              </>
            ) : (
              <LiveMessage />
            )}
          </div>
          <div className="flex justify-center mt-6 space-x-4">
            <a
              href="https://www.facebook.com/tltechnologiespvtltd"
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md shadow-lg hover:bg-white/20 transition group hover:scale-110"
            >
              <FontAwesomeIcon
                icon={faFacebook}
                className="text-blue-600 text-xl transition-transform transform group-hover:scale-110"
              />
            </a>
            <a
              href="https://api.whatsapp.com/send/?phone=%2B919061432814&text=Hello%2C+I+am+interested+to+know+more+about+PRODUCTS+%26+SERVICES&type=phone_number&app_absent=0"
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 flex items-center hover:scale-110 justify-center rounded-full bg-white/10 backdrop-blur-md shadow-lg hover:bg-white/20 transition group"
            >
              <FontAwesomeIcon
                icon={faWhatsapp}
                className="text-green-500 text-xl transition-transform transform group-hover:scale-110"
              />
            </a>
            <a
              href="https://www.instagram.com/tltechnologiespvtltd/"
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 flex items-center hover:scale-110 justify-center rounded-full bg-white/10 backdrop-blur-md shadow-lg hover:bg-white/20 transition group"
            >
              <FontAwesomeIcon
                icon={faInstagram}
                className="text-pink-500 text-xl transition-transform transform group-hover:scale-110"
              />
            </a>
            <a
              href="https://www.linkedin.com/company/tltechnologiespvtltd/"
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 flex items-center hover:scale-110 justify-center rounded-full bg-white/10 backdrop-blur-md shadow-lg hover:bg-white/20 transition group"
            >
              <FontAwesomeIcon
                icon={faLinkedin}
                className="text-blue-700 text-xl transition-transform transform group-hover:scale-110"
              />
            </a>
          </div>
          <footer className="w-full mt-4  py-4 px-4 text-center bg-black/70 backdrop-blur-sm">
          <div className="text-sm text-gray-400">
            <p>
              © 2025 Slotize. All rights reserved. 
              <span className="mx-2">|</span>
              A product of <a 
                href="https://tltechnologies.net" 
                target="_blank" 
                rel="noreferrer" 
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                TL Technologies
              </a>
            </p>
          </div>
        </footer>
        </div>
        
      </div>
      
    </div>
  );
};

export default ComingSoonPage;