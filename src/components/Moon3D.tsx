'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Moon3DProps {
    phase: number; // 0-1, where 0 = new moon, 0.5 = full moon
    illumination: number; // 0-100
    size?: number;
}

export default function Moon3D({ phase, illumination, size = 250 }: Moon3DProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const moonRef = useRef<THREE.Mesh | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || isReady) return;

        const updateReadyState = () => {
            if (container.clientWidth > 0 && container.clientHeight > 0) {
                setIsReady(true);
            }
        };

        updateReadyState();
        const observer = new ResizeObserver(updateReadyState);
        observer.observe(container);

        return () => observer.disconnect();
    }, [isReady]);

    useEffect(() => {
        if (!containerRef.current || !isReady) return;

        const container = containerRef.current;
        let width = container.clientWidth;
        let height = container.clientHeight;
        if (!width || !height) {
            return;
        }

        // Scene setup
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.z = 2.8; // Closer camera for more detail

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Texture loader
        const textureLoader = new THREE.TextureLoader();

        // Load textures
        const moonTexture = textureLoader.load('/moon-texture.jpg');
        moonTexture.colorSpace = THREE.SRGBColorSpace;

        // Geometry
        const geometry = new THREE.SphereGeometry(1, 48, 48);

        // Material - increased brightness and roughness
        const material = new THREE.MeshStandardMaterial({
            map: moonTexture,
            roughness: 0.7, // Less shiny, more rock-like
            metalness: 0.1,
            bumpScale: 0.05,
        });

        // Store texture reference for cleanup
        const textures = [moonTexture];

        const moon = new THREE.Mesh(geometry, material);

        // Correct initial rotation to show familiar face
        moon.rotation.y = -Math.PI / 2;

        scene.add(moon);
        moonRef.current = moon;

        // Lighting Setup

        // 1. Ambient Light - High base visibility so it's not pitch black
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        // 2. Directional Light (Sun)
        const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);

        // Position sun based on phase
        // Phase 0 = New Moon (Sun behind Moon relative to Earth? No, sun behind Moon relative to camera)
        // Actually simpler: 
        // New Moon (0): Light from behind (-Z)
        // Full Moon (0.5): Light from front (+Z)

        // Let's set the light angle correctly
        // cos(angle) gives -1 to 1.
        const angle = (phase - 0.5) * Math.PI * 2; // Adjust phase to align

        // Position light in a circle around the moon
        sunLight.position.set(
            Math.sin(angle) * 10,
            0,
            Math.cos(angle) * 10
        );
        scene.add(sunLight);

        // Animation Loop
        let animationId = 0;
        let isVisible = false;
        let lastFrame = 0;
        const frameInterval = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? Infinity : 1000 / 30;

        const renderFrame = () => {
            renderer.render(scene, camera);
        };

        const animate = (time: number) => {
            animationId = requestAnimationFrame(animate);
            if (!isVisible || document.hidden || time - lastFrame < frameInterval) return;
            lastFrame = time;

            if (moonRef.current) {
                moonRef.current.rotation.y += 0.0007;
            }

            renderFrame();
        };
        renderFrame();

        const resizeObserver = new ResizeObserver(() => {
            if (!container || !renderer) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            if (!w || !h) return;
            width = w;
            height = h;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            renderFrame();
        });

        const visibilityObserver = new IntersectionObserver((entries) => {
            isVisible = entries.some((entry) => entry.isIntersecting);
            if (isVisible && !animationId) {
                animationId = requestAnimationFrame(animate);
            }
            if (isVisible) {
                renderFrame();
            }
        }, { threshold: 0.01 });

        resizeObserver.observe(container);
        visibilityObserver.observe(container);
        animationId = requestAnimationFrame(animate);

        return () => {
            resizeObserver.disconnect();
            visibilityObserver.disconnect();
            if (animationId) {
                cancelAnimationFrame(animationId);
            }

            // Proper cleanup to prevent memory leaks
            textures.forEach(texture => texture.dispose());
            geometry.dispose();
            material.dispose();
            renderer.dispose();

            // Remove all lights and objects from scene
            scene.traverse((object) => {
                if (object instanceof THREE.Mesh) {
                    object.geometry?.dispose();
                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach(mat => mat.dispose());
                        } else {
                            object.material.dispose();
                        }
                    }
                }
            });

            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [isReady, phase, size]);

    // Update light position on phase change
    useEffect(() => {
        if (!sceneRef.current) return;

        sceneRef.current.traverse((child) => {
            if (child instanceof THREE.DirectionalLight) {
                const angle = (phase - 0.5) * Math.PI * -2; // Invert for correct waxing/waning
                child.position.set(
                    Math.sin(angle) * 10,
                    0,
                    Math.cos(angle) * 10
                );
            }
        });
    }, [phase]);

    return (
        <div
            ref={containerRef}
            className="moon-3d-container relative mx-auto"
            style={{
                width: `min(${size}px, 100%)`,
                height: `min(${size}px, 100%)`,
                maxWidth: '100%',
                aspectRatio: '1 / 1',
            }}
        />
    );
}
