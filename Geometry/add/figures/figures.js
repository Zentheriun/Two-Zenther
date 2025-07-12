// Geometry/figures/figures.js

// This module exports functions to create different 3D figures.
// It relies on global variables (scene, materialProperties, objects, world)
// and the createPhysicsObject function, which ideally would be imported or passed.

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
import { materialProperties, objects, world, scene, physics } from '../../script.js';

export function createPhysicsObject(geometry, mass = 1) {
    const randomColor = new THREE.Color().setHSL(Math.random(), 0.8 + Math.random() * 0.2, 0.6 + Math.random() * 0.2);
    const material = new THREE.MeshPhysicalMaterial({
        color: randomColor,
        roughness: materialProperties.roughness,
        metalness: materialProperties.metalness,
        clearcoat: materialProperties.clearcoat,
        clearcoatRoughness: materialProperties.clearcoatRoughness,
        reflectivity: 0.5,
        flatShading: Math.random() > 0.8,
        transparent: true, // For entry animation opacity
        opacity: 0 // Start invisible for animation
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    mesh.position.set(
        (Math.random() - 0.5) * 10,
        10 + Math.random() * 5,
        (Math.random() - 0.5) * 10
    );

    let radius;
    if (geometry.type === 'SphereGeometry') {
        radius = geometry.parameters.radius;
    } else if (geometry.type === 'BoxGeometry') {
        radius = Math.max(geometry.parameters.width, geometry.parameters.height, geometry.parameters.depth) / 2;
    } else if (geometry.type === 'CylinderGeometry') {
        radius = Math.max(geometry.parameters.radiusTop, geometry.parameters.radiusBottom, geometry.parameters.height / 2);
    } else if (geometry.type === 'TorusGeometry') {
        radius = geometry.parameters.radius + geometry.parameters.tube;
    } else {
        geometry.computeBoundingSphere();
        radius = geometry.boundingSphere.radius;
    }

    const physicsObj = {
        mesh: mesh,
        physics: {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                0,
                (Math.random() - 0.5) * 2
            ),
            mass: mass,
            radius: radius
        }
    };

    objects.push(physicsObj);
    world.objects.push(physicsObj);
    scene.add(mesh);

    // Entry animation
    mesh.scale.set(0.01, 0.01, 0.01); // Start very small
    let scaleProgress = 0;
    let opacityProgress = 0;
    const animationDuration = 0.5;

    function animateEntry() {
        if (scaleProgress < 1 || opacityProgress < 1) {
            scaleProgress = Math.min(1, scaleProgress + (1 / 60 / animationDuration));
            opacityProgress = Math.min(1, opacityProgress + (1 / 60 / animationDuration));

            mesh.scale.setScalar(scaleProgress);
            mesh.material.opacity = opacityProgress;
            mesh.material.needsUpdate = true;

            requestAnimationFrame(animateEntry);
        }
    }
    animateEntry();

    return physicsObj;
}

export function addSphere() {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    createPhysicsObject(geometry);
}

export function addCube() {
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    createPhysicsObject(geometry);
}

export function addCylinder() {
    const geometry = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
    createPhysicsObject(geometry);
}

export function addTorus() {
    const geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
    createPhysicsObject(geometry);
}

export function addDodecahedron() {
    const geometry = new THREE.DodecahedronGeometry(1.2);
    createPhysicsObject(geometry);
}

export function addIcosahedron() {
    const geometry = new THREE.IcosahedronGeometry(1.2);
    createPhysicsObject(geometry);
}