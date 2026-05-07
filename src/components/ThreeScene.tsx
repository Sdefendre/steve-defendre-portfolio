"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      windowWidth / windowHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    let renderer: THREE.WebGLRenderer | null = null;
    let particlesGeometry: THREE.BufferGeometry | null = null;
    let particlesMaterial: THREE.PointsMaterial | null = null;
    const shapes: THREE.Mesh[] = [];
    const shapeGeometries: THREE.BufferGeometry[] = [];
    let shapeMaterial: THREE.MeshBasicMaterial | null = null;
    let isDisposed = false;

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let frameId = 0;
    let elapsedTime = 0;
    let startAnimation = () => {};
    const reducedMotionQuery =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    let shouldReduceMotion = reducedMotionQuery?.matches ?? false;

    const renderScene = () => {
      if (!renderer || isDisposed) return;
      renderer.render(scene, camera);
    };

    const stopAnimation = () => {
      if (!frameId) return;
      cancelAnimationFrame(frameId);
      frameId = 0;
    };

    const shouldAnimate = () =>
      !shouldReduceMotion && document.visibilityState === "visible";

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / windowWidth) * 2 - 1;
      mouseY = -(event.clientY / windowHeight) * 2 + 1;
    };

    const handleResize = () => {
      if (!renderer || isDisposed) return;

      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;

      camera.aspect = windowWidth / windowHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(windowWidth, windowHeight);
      renderScene();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        stopAnimation();
        return;
      }

      startAnimation();
    };

    const handleMotionPreferenceChange = (event: MediaQueryListEvent) => {
      shouldReduceMotion = event.matches;

      if (shouldReduceMotion) {
        stopAnimation();
        renderScene();
        return;
      }

      startAnimation();
    };

    const cleanup = () => {
      if (isDisposed) return;
      isDisposed = true;

      stopAnimation();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotionQuery?.removeEventListener(
        "change",
        handleMotionPreferenceChange
      );
      if (renderer && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer?.dispose();
      particlesGeometry?.dispose();
      particlesMaterial?.dispose();
      shapeGeometries.forEach((geometry) => geometry.dispose());
      shapes.forEach((shape) => {
        if (Array.isArray(shape.material)) {
          shape.material.forEach((material) => material.dispose());
          return;
        }
        shape.material.dispose();
      });
      shapeMaterial?.dispose();
    };

    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(windowWidth, windowHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Create floating particles
      particlesGeometry = new THREE.BufferGeometry();
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
      particlesMaterial = new THREE.PointsMaterial({
        size: 0.15,
        color: new THREE.Color("#6366f1"),
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });

      const particlesMesh = new THREE.Points(
        particlesGeometry,
        particlesMaterial
      );
      scene.add(particlesMesh);

      // Create floating geometric shapes
      shapeGeometries.push(
        new THREE.IcosahedronGeometry(1, 0),
        new THREE.OctahedronGeometry(1, 0),
        new THREE.TetrahedronGeometry(1, 0)
      );

      shapeMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color("#8b5cf6"),
        wireframe: true,
        transparent: true,
        opacity: 0.15,
      });

      for (let i = 0; i < 15; i++) {
        const geometry =
          shapeGeometries[Math.floor(Math.random() * shapeGeometries.length)];
        const meshMaterial = shapeMaterial.clone();
        const mesh = new THREE.Mesh(geometry, meshMaterial);

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

      // Animation loop
      const clock = new THREE.Clock(false);

      const animate = () => {
        frameId = 0;
        if (!renderer || isDisposed) return;

        if (!shouldAnimate()) {
          renderScene();
          return;
        }

        elapsedTime += Math.min(clock.getDelta(), 0.033);

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
        frameId = requestAnimationFrame(animate);
      };

      startAnimation = () => {
        if (frameId || !shouldAnimate() || !renderer || isDisposed) return;

        clock.start();
        frameId = requestAnimationFrame(animate);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("resize", handleResize);
      document.addEventListener("visibilitychange", handleVisibilityChange);
      reducedMotionQuery?.addEventListener(
        "change",
        handleMotionPreferenceChange
      );

      renderScene();
      startAnimation();
    } catch (error) {
      cleanup();
      console.error("ThreeScene disabled because WebGL setup failed.", error);
      return;
    }

    // Cleanup
    return cleanup;
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: "linear-gradient(135deg, #fafafa 0%, #f0f0f5 100%)" }}
    />
  );
}
