"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Create floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );

    // Particle material with gradient colors
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.15,
      color: new THREE.Color("#6366f1"),
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create floating geometric shapes
    const shapes: THREE.Mesh[] = [];
    const shapeGeometries = [
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.OctahedronGeometry(1, 0),
      new THREE.TetrahedronGeometry(1, 0),
    ];

    const shapeMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#8b5cf6"),
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });

    for (let i = 0; i < 15; i++) {
      const geometry = shapeGeometries[Math.floor(Math.random() * shapeGeometries.length)];
      const mesh = new THREE.Mesh(geometry, shapeMaterial.clone());

      mesh.position.x = (Math.random() - 0.5) * 60;
      mesh.position.y = (Math.random() - 0.5) * 60;
      mesh.position.z = (Math.random() - 0.5) * 30;

      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;

      const scale = Math.random() * 2 + 0.5;
      mesh.scale.set(scale, scale, scale);

      shapes.push(mesh);
      scene.add(mesh);
    }

    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse following
      targetX += (mouseX - targetX) * 0.02;
      targetY += (mouseY - targetY) * 0.02;

      // Rotate particles
      particlesMesh.rotation.y = elapsedTime * 0.05;
      particlesMesh.rotation.x = elapsedTime * 0.03;

      // Mouse influence on particles
      particlesMesh.rotation.y += targetX * 0.1;
      particlesMesh.rotation.x += targetY * 0.1;

      // Animate shapes
      shapes.forEach((shape, i) => {
        shape.rotation.x += 0.002 + i * 0.0005;
        shape.rotation.y += 0.003 + i * 0.0005;
        shape.position.y += Math.sin(elapsedTime + i) * 0.005;
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      shapeGeometries.forEach(g => g.dispose());
      shapeMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: "linear-gradient(135deg, #fafafa 0%, #f0f0f5 100%)" }}
    />
  );
}
