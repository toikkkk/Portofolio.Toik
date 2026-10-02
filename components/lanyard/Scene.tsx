'use client';
import * as THREE from 'three';
import { useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import Band from './Band';
import { loadFonts, makeCardFaces, makeStrapTexture } from './textures';

type Tex = { front: THREE.Texture; back: THREE.Texture; strap: THREE.Texture };

// Keep the whole card in frame on narrow panels.
function FitCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;
    cam.fov = aspect < 0.7 ? 36 : aspect < 0.9 ? 31 : 26;
    cam.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

export default function Scene({ active }: { active: boolean }) {
  const [tex, setTex] = useState<Tex | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      await loadFonts();
      const faces = await makeCardFaces();
      if (alive) setTex({ ...faces, strap: makeStrapTexture() });
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 2]}
      camera={{ position: [0, 0.6, 13], fov: 25 }}
      gl={{ alpha: true, antialias: true }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      aria-label="Interactive name card hanging from a strap. Drag it."
    >
      <FitCamera />
      <ambientLight intensity={Math.PI * 0.8} />
      <Environment resolution={256}>
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={8} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
      </Environment>
      {tex && (
        <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
          <Band front={tex.front} back={tex.back} strap={tex.strap} />
        </Physics>
      )}
    </Canvas>
  );
}
