// Geometry/control/properties/physicsControls.js

// This module exports functions to initialize physics and material control event listeners.
// It relies on global variables (physics, materialProperties) which ideally would be passed as parameters
// or managed via a state object. For this example, we assume they are accessible globally or imported.

import { physics, materialProperties, objects, world, scene, camera, renderer, controls, isPaused, time, frameCount, lastTime, mouse, raycaster, isDragging, draggedObject, currentSceneType, addSphere, addCube, addCylinder } from '../../../script.js'; // Adjust path as necessary


export function setupPhysicsControls() {
    document.getElementById('gravity-slider').addEventListener('input', (e) => {
        physics.gravity = parseFloat(e.target.value);
        const gravityValueSpan = document.getElementById('gravity-value');
        gravityValueSpan.textContent = physics.gravity;
        gravityValueSpan.style.transform = 'scale(1.1)';
        gravityValueSpan.style.color = '#fff';
        setTimeout(() => {
            gravityValueSpan.style.transform = 'scale(1)';
            gravityValueSpan.style.color = '#00d4ff';
        }, 100);
    });

    document.getElementById('bounce-slider').addEventListener('input', (e) => {
        physics.bounce = parseFloat(e.target.value);
        const bounceValueSpan = document.getElementById('bounce-value');
        bounceValueSpan.textContent = physics.bounce;
        bounceValueSpan.style.transform = 'scale(1.1)';
        bounceValueSpan.style.color = '#fff';
        setTimeout(() => {
            bounceValueSpan.style.transform = 'scale(1)';
            bounceValueSpan.style.color = '#00d4ff';
        }, 100);
    });

    document.getElementById('friction-slider').addEventListener('input', (e) => {
        physics.friction = parseFloat(e.target.value);
        const frictionValueSpan = document.getElementById('friction-value');
        frictionValueSpan.textContent = physics.friction;
        frictionValueSpan.style.transform = 'scale(1.1)';
        frictionValueSpan.style.color = '#fff';
        setTimeout(() => {
            frictionValueSpan.style.transform = 'scale(1)';
            frictionValueSpan.style.color = '#00d4ff';
        }, 100);
    });
}

export function setupMaterialControls() {
    document.getElementById('roughness-slider').addEventListener('input', (e) => {
        materialProperties.roughness = parseFloat(e.target.value);
        const roughnessValueSpan = document.getElementById('roughness-value');
        roughnessValueSpan.textContent = materialProperties.roughness.toFixed(2);
        roughnessValueSpan.style.transform = 'scale(1.1)';
        roughnessValueSpan.style.color = '#fff';
        setTimeout(() => {
            roughnessValueSpan.style.transform = 'scale(1)';
            roughnessValueSpan.style.color = '#00d4ff';
        }, 100);
    });
    document.getElementById('metalness-slider').addEventListener('input', (e) => {
        materialProperties.metalness = parseFloat(e.target.value);
        const metalnessValueSpan = document.getElementById('metalness-value');
        metalnessValueSpan.textContent = materialProperties.metalness.toFixed(2);
        metalnessValueSpan.style.transform = 'scale(1.1)';
        metalnessValueSpan.style.color = '#fff';
        setTimeout(() => {
            metalnessValueSpan.style.transform = 'scale(1)';
            metalnessValueSpan.style.color = '#00d4ff';
        }, 100);
    });
    document.getElementById('clearcoat-slider').addEventListener('input', (e) => {
        materialProperties.clearcoat = parseFloat(e.target.value);
        const clearcoatValueSpan = document.getElementById('clearcoat-value');
        clearcoatValueSpan.textContent = materialProperties.clearcoat.toFixed(2);
        clearcoatValueSpan.style.transform = 'scale(1.1)';
        clearcoatValueSpan.style.color = '#fff';
        setTimeout(() => {
            clearcoatValueSpan.style.transform = 'scale(1)';
            clearcoatValueSpan.style.color = '#00d4ff';
        }, 100);
    });
    document.getElementById('clearcoat-roughness-slider').addEventListener('input', (e) => {
        materialProperties.clearcoatRoughness = parseFloat(e.target.value);
        const clearcoatRoughnessValueSpan = document.getElementById('clearcoat-roughness-value');
        clearcoatRoughnessValueSpan.textContent = materialProperties.clearcoatRoughness.toFixed(2);
        clearcoatRoughnessValueSpan.style.transform = 'scale(1.1)';
        clearcoatRoughnessValueSpan.style.color = '#fff';
        setTimeout(() => {
            clearcoatRoughnessValueSpan.style.transform = 'scale(1)';
            clearcoatRoughnessValueSpan.style.color = '#00d4ff';
        }, 100);
    });
}