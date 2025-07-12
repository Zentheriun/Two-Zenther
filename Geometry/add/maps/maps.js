// Geometry/maps/maps.js

// This module handles the creation and switching of different scene environments.
// It relies on global variables (scene, currentSceneType) which ideally would be imported or passed.

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
import { scene, objects, world, camera, renderer, currentSceneType, setupLights } from '../../script.js';
import { addSphere, addCube, addCylinder } from '../figures/figures.js'; // Import adding functions for new scene


export function clearEnvironment() {
    // Remove all objects and environment meshes (floor, particles)
    scene.children.filter(child => child !== camera && !child.isLight).forEach(child => {
        scene.remove(child);
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
            if (Array.isArray(child.material)) {
                child.material.forEach(m => m.dispose());
            } else {
                child.material.dispose();
            }
        }
    });
    // Clear physics objects as well
    objects.forEach(obj => {
        obj.mesh.geometry.dispose();
        obj.mesh.material.dispose();
    });
    objects.length = 0; // Clear the array
    world.objects.length = 0; // Clear the array
}

export function createParticles() {
    const particleCount = 200;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 150;
        positions[i * 3 + 1] = Math.random() * 80;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 150;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: 0x00d4ff,
        size: 0.8,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
}

export function createDefaultScene() {
    // We need to update currentSceneType here if it's not managed externally
    // currentSceneType = 'default'; // This needs to be handled by the main script
    scene.background = new THREE.Color(0x000510);
    scene.fog = new THREE.Fog(0x000510, 10, 100);

    // Suelo con patrón
    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Patrón de cuadrícula
    ctx.fillStyle = '#001122';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 2;
    for (let i = 0; i <= 512; i += 32) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 512);
        ctx.moveTo(0, i);
        ctx.lineTo(512, i);
        ctx.stroke();
    }

    const floorTexture = new THREE.CanvasTexture(canvas);
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(5, 5);

    const floorMaterial = new THREE.MeshLambertMaterial({
        map: floorTexture,
        transparent: true,
        opacity: 0.8
    });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    createParticles();
}

export function createGridWorldScene() {
    // currentSceneType = 'grid'; // This needs to be handled by the main script
    scene.background = new THREE.Color(0x050010);
    scene.fog = new THREE.Fog(0x050010, 5, 80);

    // Grid floor
    const gridHelper = new THREE.GridHelper(40, 40, 0x00d4ff, 0x555555);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    const floorGeometry = new THREE.PlaneGeometry(40, 40);
    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Add some basic walls for the grid world
    const wallMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1a2e, transparent: true, opacity: 0.6 });

    const wallGeometry = new THREE.BoxGeometry(40, 10, 0.5);

    const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall1.position.set(0, 5, -20);
    wall1.receiveShadow = true; wall1.castShadow = true;
    scene.add(wall1);

    const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall2.position.set(0, 5, 20);
    wall2.receiveShadow = true; wall2.castShadow = true;
    scene.add(wall2);

    const wall3 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 10, 40), wallMaterial);
    wall3.position.set(-20, 5, 0);
    wall3.receiveShadow = true; wall3.castShadow = true;
    scene.add(wall3);

    const wall4 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 10, 40), wallMaterial);
    wall4.position.set(20, 5, 0);
    wall4.receiveShadow = true; wall4.castShadow = true;
    scene.add(wall4);
}

export function switchScene(type) {
    // This function will be called from the HTML buttons, so it needs to be globally accessible
    // or properly linked via the main script.
    // It also needs access to currentSceneType, clearEnvironment, setupLights, createDefaultScene, createGridWorldScene.
    // For now, these are assumed to be accessible in the main script that imports this.

    if (window.currentSceneType === type) return; // Access via window for global scope

    clearEnvironment();
    setupLights(); // Assuming setupLights is imported or global

    if (type === 'default') {
        createDefaultScene();
        window.currentSceneType = 'default';
    } else if (type === 'grid') {
        createGridWorldScene();
        window.currentSceneType = 'grid';
    }
    // Add some objects to the new scene
    addSphere();
    addCube();
    addCylinder();
}