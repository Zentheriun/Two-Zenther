// Variables globales
let scene, camera, renderer, world, controls;
let objects = [];
let physics = { gravity: -9.8, bounce: 0.7, friction: 0.5 };
let materialProperties = { roughness: 0.5, metalness: 0.5, clearcoat: 0.0, clearcoatRoughness: 0.0 };
let isPaused = false;
let time = 0;
let frameCount = 0;
let lastTime = performance.now();
let mouse = new THREE.Vector2();
let raycaster = new THREE.Raycaster();
let isDragging = false;
let draggedObject = null;
let currentSceneType = 'default'; // To keep track of the current environment

// Inicialización
function init() {
    // Configurar escena
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000510, 10, 100);

    // Configurar cámara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 20);
    camera.lookAt(0, 0, 0);

    // Configurar renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8;
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Configurar OrbitControls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;

    // Crear mundo físico simple
    world = {
        objects: [],
        step: function(deltaTime) {
            if (isPaused) return;

            this.objects.forEach(obj => {
                if (obj.physics) {
                    // Aplicar gravedad
                    obj.physics.velocity.y += physics.gravity * deltaTime;

                    // Aplicar fricción (simple air friction / rolling resistance)
                    obj.physics.velocity.x *= (1 - physics.friction * deltaTime);
                    obj.physics.velocity.z *= (1 - physics.friction * deltaTime);

                    // Actualizar posición
                    obj.mesh.position.add(obj.physics.velocity.clone().multiplyScalar(deltaTime));

                    // Rotación basada en velocidad (visual effect, not true physics)
                    if (obj.physics.velocity.length() > 0.1) {
                        obj.mesh.rotation.x += obj.physics.velocity.length() * deltaTime * 0.5;
                        obj.mesh.rotation.z += obj.physics.velocity.length() * deltaTime * 0.3;
                    }

                    // Colisiones con el suelo
                    if (obj.mesh.position.y < obj.physics.radius) {
                        obj.mesh.position.y = obj.physics.radius;
                        obj.physics.velocity.y = -obj.physics.velocity.y * physics.bounce;

                        // Efecto de rebote visual
                        obj.mesh.scale.set(1.1, 0.9, 1.1);
                        setTimeout(() => {
                            obj.mesh.scale.set(1, 1, 1);
                        }, 100);
                    }

                    // Colisiones con las paredes (simple boundary)
                    if (Math.abs(obj.mesh.position.x) > 15) {
                        obj.mesh.position.x = Math.sign(obj.mesh.position.x) * 15;
                        obj.physics.velocity.x = -obj.physics.velocity.x * physics.bounce;
                    }
                    if (Math.abs(obj.mesh.position.z) > 15) {
                        obj.mesh.position.z = Math.sign(obj.mesh.position.z) * 15;
                        obj.physics.velocity.z = -obj.physics.velocity.z * physics.bounce;
                    }
                }
            });
        }
    };

    // Configurar luces
    setupLights();

    // Crear entorno inicial
    createDefaultScene(); // Start with the default scene

    // Event listeners
    setupEventListeners();

    // Iniciar animación
    animate();
}

function setupLights() {
    // Clear existing lights if any
    scene.children.filter(child => child.isLight).forEach(light => scene.remove(light));

    // Luz ambiental
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    // Luz direccional principal
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Luces de colores
    const colorLight1 = new THREE.PointLight(0x00d4ff, 0.8, 30);
    colorLight1.position.set(-10, 5, 10);
    scene.add(colorLight1);

    const colorLight2 = new THREE.PointLight(0xff0088, 0.6, 25);
    colorLight2.position.set(10, 8, -10);
    scene.add(colorLight2);
}

function clearEnvironment() {
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
    objects = [];
    world.objects = [];
}

function createDefaultScene() {
    currentSceneType = 'default';
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

function createGridWorldScene() {
    currentSceneType = 'grid';
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

function switchScene(type) {
    if (currentSceneType === type) return;

    clearEnvironment();
    setupLights();

    if (type === 'default') {
        createDefaultScene();
    } else if (type === 'grid') {
        createGridWorldScene();
    }
    // Add some objects to the new scene
    addSphere();
    addCube();
    addCylinder();
}

function createParticles() {
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

function setupEventListeners() {
    // Redimensionar
    window.addEventListener('resize', onWindowResize);

    // Mouse events for custom dragging
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);

    // Physics controls
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

    // Material controls
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

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseDown(event) {
    if (event.button === 0) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(objects.map(obj => obj.mesh));

        if (intersects.length > 0) {
            isDragging = true;
            draggedObject = intersects[0].object;
            controls.enabled = false;
        }
    }
}

function onMouseMove(event) {
    if (isDragging && draggedObject) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -draggedObject.position.y);
        const intersectionPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(dragPlane, intersectionPoint);

        if (intersectionPoint) {
            const obj = objects.find(o => o.mesh === draggedObject);
            if (obj) {
                const force = intersectionPoint.clone().sub(obj.mesh.position).multiplyScalar(50);
                obj.physics.velocity.add(force.clampLength(0, 10));
            }
        }
    }
}

function onMouseUp() {
    isDragging = false;
    draggedObject = null;
    controls.enabled = true;
}

function createPhysicsObject(geometry, mass = 1) {
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

// --- New Figure Functions ---
function addSphere() {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    createPhysicsObject(geometry);
}

function addCube() {
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    createPhysicsObject(geometry);
}

function addCylinder() {
    const geometry = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
    createPhysicsObject(geometry);
}

function addTorus() {
    const geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
    createPhysicsObject(geometry);
}

function addDodecahedron() {
    const geometry = new THREE.DodecahedronGeometry(1.2);
    createPhysicsObject(geometry);
}

function addIcosahedron() {
    const geometry = new THREE.IcosahedronGeometry(1.2);
    createPhysicsObject(geometry);
}
// --- End New Figure Functions ---


function resetScene() {
    objects.forEach(obj => {
        scene.remove(obj.mesh);
        obj.mesh.geometry.dispose();
        if (Array.isArray(obj.mesh.material)) {
            obj.mesh.material.forEach(m => m.dispose());
        } else {
            obj.mesh.material.dispose();
        }
    });
    objects = [];
    world.objects = [];
    time = 0;
    document.getElementById('object-count').textContent = objects.length;
    document.getElementById('time').textContent = time.toFixed(1);

    clearEnvironment();
    setupLights();
    if (currentSceneType === 'default') {
        createDefaultScene();
    } else if (currentSceneType === 'grid') {
        createGridWorldScene();
    }
}

function togglePause() {
    isPaused = !isPaused;
    document.querySelector('button[onclick="togglePause()"]').textContent =
        isPaused ? '▶️ Continuar' : '⏸️ Pausar';
}

function explode() {
    // Sacudida de Cámara (Simulada)
    const originalCamPos = camera.position.clone();
    const shakeIntensity = 0.5;
    const shakeDuration = 0.3;

    let shakeTime = 0;
    function animateCameraShake() {
        if (shakeTime < shakeDuration) {
            camera.position.x = originalCamPos.x + (Math.random() - 0.5) * shakeIntensity;
            camera.position.y = originalCamPos.y + (Math.random() - 0.5) * shakeIntensity;
            camera.position.z = originalCamPos.z + (Math.random() - 0.5) * shakeIntensity;
            shakeTime += 0.016;
            requestAnimationFrame(animateCameraShake);
        } else {
            camera.position.copy(originalCamPos);
        }
    }
    animateCameraShake();

    // Apply force to existing objects
    objects.forEach(obj => {
        const direction = obj.mesh.position.clone().normalize();
        const force = direction.multiplyScalar(15 + Math.random() * 10);
        force.y = Math.abs(force.y) + 5;
        obj.physics.velocity.add(force);
    });

    // --- Bomb Explosion Yellow Effect ---
    const explosionOrigin = new THREE.Vector3(0, 2, 0);

    // 1. Temporary Point Light for flash
    const explosionLight = new THREE.PointLight(0xffff00, 8, 20);
    explosionLight.position.copy(explosionOrigin);
    scene.add(explosionLight);

    // 2. Explosion visual (expanding and fading sphere)
    const explosionGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const explosionMaterial = new THREE.MeshBasicMaterial({
        color: 0xffa500,
        transparent: true,
        opacity: 1,
        side: THREE.FrontSide
    });
    const explosionMesh = new THREE.Mesh(explosionGeometry, explosionMaterial);
    explosionMesh.position.copy(explosionOrigin);
    scene.add(explosionMesh);

    let explosionTime = 0;
    const explosionDuration = 0.6;
    const maxExplosionScale = 25;

    function animateExplosionEffect() {
        if (explosionTime < explosionDuration) {
            const progress = explosionTime / explosionDuration;

            explosionLight.intensity = Math.max(0, 8 * (1 - progress * 2));

            explosionMesh.scale.setScalar(0.5 + progress * maxExplosionScale);
            explosionMaterial.opacity = Math.max(0, 1 - progress * 1.5);

            explosionTime += 0.016;
            requestAnimationFrame(animateExplosionEffect);
        } else {
            scene.remove(explosionLight);
            scene.remove(explosionMesh);
            explosionGeometry.dispose();
            explosionMaterial.dispose();
        }
    }
    requestAnimationFrame(animateExplosionEffect);

    // Partículas de Escombros (simples)
    const debrisCount = 30;
    const debrisGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const debrisMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });

    for (let i = 0; i < debrisCount; i++) {
        const debris = new THREE.Mesh(debrisGeometry, debrisMaterial);
        debris.position.copy(explosionOrigin);
        scene.add(debris);

        const velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 10,
            Math.random() * 8 + 2,
            (Math.random() - 0.5) * 10
        );

        let debrisTime = 0;
        const debrisLife = 1 + Math.random();

        function animateDebris() {
            if (debrisTime < debrisLife) {
                debris.position.add(velocity.clone().multiplyScalar(0.016));
                velocity.y -= 9.8 * 0.016;
                debris.material.opacity = Math.max(0, 1 - (debrisTime / debrisLife));
                debris.material.needsUpdate = true;
                debrisTime += 0.016;
                requestAnimationFrame(animateDebris);
            } else {
                scene.remove(debris);
                debris.geometry.dispose();
                debris.material.dispose();
            }
        }
        animateDebris();
    }
}

function animate() {
    requestAnimationFrame(animate);

    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    if (!isPaused) {
        time += deltaTime;
        world.step(deltaTime);
    }

    objects.forEach(obj => {
        if (obj.mesh.material.isMeshPhysicalMaterial) {
            obj.mesh.material.roughness = materialProperties.roughness;
            obj.mesh.material.metalness = materialProperties.metalness;
            obj.mesh.material.clearcoat = materialProperties.clearcoat;
            obj.mesh.material.clearcoatRoughness = materialProperties.clearcoatRoughness;
            obj.mesh.material.needsUpdate = true;
        }
    });

    controls.update();

    // Actualizar estadísticas con animación
    frameCount++;
    if (frameCount >= 60) {
        const fpsSpan = document.getElementById('fps');
        const objectCountSpan = document.getElementById('object-count');
        const timeSpan = document.getElementById('time');

        fpsSpan.textContent = Math.round(1 / deltaTime);
        fpsSpan.style.transform = 'scale(1.1)';
        setTimeout(() => { fpsSpan.style.transform = 'scale(1)'; }, 100);

        objectCountSpan.textContent = objects.length;
        objectCountSpan.style.transform = 'scale(1.1)';
        setTimeout(() => { objectCountSpan.style.transform = 'scale(1)'; }, 100);

        timeSpan.textContent = time.toFixed(1);
        timeSpan.style.transform = 'scale(1.1)';
        setTimeout(() => { timeSpan.style.transform = 'scale(1)'; }, 100);

        frameCount = 0;
    }

    renderer.render(scene, camera);
}

// Iniciar aplicación
init();