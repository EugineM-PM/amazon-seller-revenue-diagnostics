import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Live3DAvatarProps {
  isSpeaking: boolean;
  onClick?: () => void;
  className?: string;
  size?: number; // e.g. 140 or 180
}

/**
 * Procedural live 3D Pillsbury Doughboy-style Baker Character in Three.js
 * Features:
 * - Round soft dough body & head
 * - Chef / baker toque hat with puff top
 * - Bright lively blue eyes that blink and look around
 * - Happy animated mouth that talks in real-time sync with speech audio
 * - Chef neckerchief tie
 * - Friendly waving right dough arm and breathing idle bounce
 * - Clean lighting with rim highlights and soft studio ambient
 */
export const Live3DAvatar: React.FC<Live3DAvatarProps> = ({
  isSpeaking,
  onClick,
  className = '',
  size = 150,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const isSpeakingRef = useRef<boolean>(isSpeaking);

  // Sync prop changes without triggering full canvas rebuilds
  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || size;
    const height = container.clientHeight || size;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 3.8);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Key front light
    const keyLight = new THREE.DirectionalLight(0xfff6ea, 1.6);
    keyLight.position.set(2, 4, 3);
    scene.add(keyLight);

    // Soft fill light
    const fillLight = new THREE.DirectionalLight(0xbad7ff, 0.9);
    fillLight.position.set(-3, 1, 2);
    scene.add(fillLight);

    // Top rim highlight on chef hat
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.1);
    rimLight.position.set(0, 5, -2);
    scene.add(rimLight);

    // 5. Materials
    // Soft creamy white dough skin
    const doughMat = new THREE.MeshStandardMaterial({
      color: 0xfaf8f2,
      roughness: 0.35,
      metalness: 0.05,
    });

    // Baker hat material (crisp white fabric)
    const hatMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
      metalness: 0.0,
    });

    // Pillsbury blue badge/eyes material
    const blueMat = new THREE.MeshStandardMaterial({
      color: 0x005bbb,
      roughness: 0.2,
      metalness: 0.1,
    });

    // Eye highlight sparkle
    const eyeHighlightMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });

    // Mouth interior material
    const mouthMat = new THREE.MeshStandardMaterial({
      color: 0xaa2233,
      roughness: 0.4,
    });

    // Neckerchief tie material
    const scarfMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3ee,
      roughness: 0.6,
    });

    // 6. Character Hierarchy (Root Group)
    const characterGroup = new THREE.Group();
    characterGroup.position.y = -0.35;
    scene.add(characterGroup);

    // Body (Round, cuddly dough belly)
    const bodyGeo = new THREE.SphereGeometry(0.72, 32, 32);
    bodyGeo.scale(1.0, 1.05, 0.95);
    const bodyMesh = new THREE.Mesh(bodyGeo, doughMat);
    bodyMesh.position.y = 0;
    characterGroup.add(bodyMesh);

    // Short cute dough legs
    const legGeo = new THREE.SphereGeometry(0.24, 24, 24);
    legGeo.scale(0.9, 1.3, 0.9);
    
    const leftLeg = new THREE.Mesh(legGeo, doughMat);
    leftLeg.position.set(-0.35, -0.65, 0.05);
    characterGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, doughMat);
    rightLeg.position.set(0.35, -0.65, 0.05);
    characterGroup.add(rightLeg);

    // Head Group (for independent nod & tilt)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.85, 0.05);
    characterGroup.add(headGroup);

    // Head Sphere (Chubby dough face)
    const headGeo = new THREE.SphereGeometry(0.62, 32, 32);
    headGeo.scale(1.05, 0.98, 1.0);
    const headMesh = new THREE.Mesh(headGeo, doughMat);
    headGroup.add(headMesh);

    // Chubby rosy dough cheeks
    const cheekMat = new THREE.MeshStandardMaterial({
      color: 0xffd2cb,
      roughness: 0.6,
      transparent: true,
      opacity: 0.55,
    });
    const cheekGeo = new THREE.SphereGeometry(0.14, 16, 16);
    cheekGeo.scale(1.2, 0.8, 0.4);

    const leftCheek = new THREE.Mesh(cheekGeo, cheekMat);
    leftCheek.position.set(-0.36, -0.06, 0.52);
    leftCheek.rotation.y = -0.25;
    headGroup.add(leftCheek);

    const rightCheek = new THREE.Mesh(cheekGeo, cheekMat);
    rightCheek.position.set(0.36, -0.06, 0.52);
    rightCheek.rotation.y = 0.25;
    headGroup.add(rightCheek);

    // Eyes Group
    const eyeGeo = new THREE.SphereGeometry(0.095, 24, 24);
    eyeGeo.scale(0.85, 1.05, 0.7);

    // Left Eye
    const leftEyeGroup = new THREE.Group();
    leftEyeGroup.position.set(-0.2, 0.08, 0.56);
    const leftEye = new THREE.Mesh(eyeGeo, blueMat);
    leftEyeGroup.add(leftEye);
    // Eye shine reflection
    const leftShine = new THREE.Mesh(new THREE.SphereGeometry(0.026, 12, 12), eyeHighlightMat);
    leftShine.position.set(-0.02, 0.035, 0.07);
    leftEyeGroup.add(leftShine);
    headGroup.add(leftEyeGroup);

    // Right Eye
    const rightEyeGroup = new THREE.Group();
    rightEyeGroup.position.set(0.2, 0.08, 0.56);
    const rightEye = new THREE.Mesh(eyeGeo, blueMat);
    rightEyeGroup.add(rightEye);
    // Eye shine reflection
    const rightShine = new THREE.Mesh(new THREE.SphereGeometry(0.026, 12, 12), eyeHighlightMat);
    rightShine.position.set(-0.02, 0.035, 0.07);
    rightEyeGroup.add(rightShine);
    headGroup.add(rightEyeGroup);

    // Mouth (Dynamic smiling/talking jaw)
    const mouthGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.08, 24);
    mouthGeo.scale(1.2, 0.9, 0.5);
    const mouthMesh = new THREE.Mesh(mouthGeo, mouthMat);
    mouthMesh.rotation.x = Math.PI / 2;
    mouthMesh.position.set(0, -0.16, 0.57);
    headGroup.add(mouthMesh);

    // Baker Chef Hat (Toque)
    const hatGroup = new THREE.Group();
    hatGroup.position.set(0, 0.46, -0.04);
    headGroup.add(hatGroup);

    // Hat Band (cylinder base with blue Pillsbury oval badge)
    const bandGeo = new THREE.CylinderGeometry(0.42, 0.46, 0.28, 32);
    const bandMesh = new THREE.Mesh(bandGeo, hatMat);
    hatGroup.add(bandMesh);

    // Pillsbury blue badge on hat band
    const badgeGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.02, 24);
    badgeGeo.scale(1.3, 0.1, 0.8);
    const badgeMesh = new THREE.Mesh(badgeGeo, blueMat);
    badgeMesh.position.set(0, 0.02, 0.45);
    badgeMesh.rotation.x = Math.PI / 2;
    hatGroup.add(badgeMesh);

    // Hat Puff / Crown (Soft pleated chef pouf)
    const puffGeo = new THREE.SphereGeometry(0.58, 32, 24);
    puffGeo.scale(1.15, 1.25, 1.1);
    const puffMesh = new THREE.Mesh(puffGeo, hatMat);
    puffMesh.position.set(0, 0.38, -0.02);
    hatGroup.add(puffMesh);

    // Neckerchief / Scarf Tie around neck
    const scarfGeo = new THREE.TorusGeometry(0.46, 0.08, 16, 32);
    scarfGeo.scale(1.0, 0.6, 1.0);
    const scarfMesh = new THREE.Mesh(scarfGeo, scarfMat);
    scarfMesh.position.set(0, 0.47, 0.02);
    scarfMesh.rotation.x = Math.PI / 2.3;
    characterGroup.add(scarfMesh);

    // Scarf knot & tails
    const knotGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const knotMesh = new THREE.Mesh(knotGeo, scarfMat);
    knotMesh.position.set(0, 0.42, 0.5);
    characterGroup.add(knotMesh);

    // Arms
    // Left Arm (rests happily by belly)
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.62, 0.2, 0.1);
    const leftArmGeo = new THREE.CylinderGeometry(0.11, 0.14, 0.48, 16);
    const leftArmMesh = new THREE.Mesh(leftArmGeo, doughMat);
    leftArmMesh.position.y = -0.2;
    leftArmGroup.rotation.z = 0.45;
    leftArmGroup.rotation.x = 0.2;
    leftArmGroup.add(leftArmMesh);
    characterGroup.add(leftArmGroup);

    // Right Arm (Friendly high waving hand)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.62, 0.25, 0.1);
    const rightArmGeo = new THREE.CylinderGeometry(0.11, 0.13, 0.52, 16);
    const rightArmMesh = new THREE.Mesh(rightArmGeo, doughMat);
    rightArmMesh.position.y = 0.22;
    rightArmGroup.add(rightArmMesh);
    // Waving dough mitten hand
    const handGeo = new THREE.SphereGeometry(0.16, 16, 16);
    handGeo.scale(1.0, 1.1, 0.7);
    const rightHand = new THREE.Mesh(handGeo, doughMat);
    rightHand.position.set(0, 0.5, 0);
    rightArmGroup.add(rightHand);
    characterGroup.add(rightArmGroup);

    // Mouse Tracking on Hover
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = THREE.MathUtils.clamp(nx, -1, 1);
      mouseY = THREE.MathUtils.clamp(ny, -1, 1);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || size;
      const h = container.clientHeight || size;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let blinkTimer = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const speaking = isSpeakingRef.current;

      // 1. Idle breathing & bouncing
      const breath = Math.sin(elapsedTime * 2.2) * 0.025;
      characterGroup.position.y = -0.35 + breath;
      bodyMesh.scale.set(1.0 + breath * 0.5, 1.05 - breath * 0.3, 0.95 + breath * 0.5);

      // 2. Head tracking with smooth interpolation
      const targetHeadRotY = mouseX * 0.4 + (speaking ? Math.sin(elapsedTime * 4.5) * 0.08 : 0);
      const targetHeadRotX = -mouseY * 0.25 + (speaking ? Math.cos(elapsedTime * 4.0) * 0.06 : 0);
      headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, targetHeadRotY, 0.08);
      headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, targetHeadRotX, 0.08);
      headGroup.rotation.z = Math.sin(elapsedTime * 1.5) * 0.04;

      // 3. Baker hat soft jiggle
      hatGroup.rotation.z = Math.sin(elapsedTime * 3) * 0.04;
      hatGroup.rotation.x = Math.cos(elapsedTime * 2.5) * 0.03;

      // 4. Arm wave animation
      if (speaking) {
        // Energetic enthusiastic explanatory gesture
        rightArmGroup.rotation.z = -0.7 + Math.sin(elapsedTime * 7.0) * 0.35;
        rightArmGroup.rotation.x = 0.1 + Math.cos(elapsedTime * 5.5) * 0.2;
        leftArmGroup.rotation.z = 0.5 + Math.sin(elapsedTime * 3.5) * 0.15;
      } else {
        // Friendly cheerful wave
        rightArmGroup.rotation.z = -0.55 + Math.sin(elapsedTime * 3.2) * 0.2;
        rightArmGroup.rotation.x = Math.cos(elapsedTime * 2.0) * 0.1;
      }

      // 5. Mouth animation (Realistic speaking sync)
      if (speaking) {
        // Rapid expressive speech articulation
        const mouthOpen = 0.8 + Math.abs(Math.sin(elapsedTime * 14.0)) * 1.8;
        const mouthWidth = 1.0 + Math.sin(elapsedTime * 11.0) * 0.3;
        mouthMesh.scale.set(mouthWidth * 1.2, mouthOpen * 0.9, 0.5);
      } else {
        // Natural happy smile
        mouthMesh.scale.set(1.2, 0.55 + Math.sin(elapsedTime * 1.8) * 0.08, 0.5);
      }

      // 6. Natural Eye Blinking
      blinkTimer += 0.016;
      if (blinkTimer > 3.5) {
        // Quick blink
        leftEye.scale.y = 0.1;
        rightEye.scale.y = 0.1;
        if (blinkTimer > 3.65) {
          leftEye.scale.y = 1.05;
          rightEye.scale.y = 1.05;
          blinkTimer = Math.random() * 0.8; // Randomize next blink
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      scene.clear();
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [size]);

  return (
    <div
      ref={mountRef}
      onClick={onClick}
      className={`relative cursor-pointer select-none transition-transform active:scale-95 ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      title="Click 3D Live AI Baker Avatar to speak or pause analysis"
    />
  );
};
