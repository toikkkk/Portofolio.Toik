'use client';
import * as THREE from 'three';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from '@react-three/rapier';

type Props = {
  front: THREE.Texture;
  back: THREE.Texture;
  strap: THREE.Texture;
  /** true shows the back of the card; the card turns around its vertical axis. */
  flipped?: boolean;
};

// Card geometry in world units
const CARD_W = 2.0;
const CARD_H = 2.8125; // same 1:1.406 ratio as the printed faces
const CARD_D = 0.035;
const RING_Y = CARD_H / 2 + 0.2;

const STRAP_W = 0.62; // strap width in world units
const STRAP_TILE = STRAP_W * 4; // one printed tile is 4:1, so this keeps the text undistorted
const SEGMENTS = 32; // where the strap passes through the clip

/**
 * A strap made of four physics points (one fixed, three free) that ends in a hanging card.
 * Dragging the card switches it to a kinematic body that follows the pointer; releasing hands it back
 * to the simulation. The strap is a smoothed curve through the points.
 */
export default function Band({ front, back, strap, flipped = false }: Props) {
  const anchor = useRef<RapierRigidBody>(null);
  const p1 = useRef<RapierRigidBody>(null);
  const p2 = useRef<RapierRigidBody>(null);
  const p3 = useRef<RapierRigidBody>(null);
  const card = useRef<RapierRigidBody>(null);
  const face = useRef<THREE.Group>(null); // the printed card and its clip; turned by the front/back toggle
  const ribbon = useMemo(() => {
    const n = SEGMENTS + 1;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 2 * 3), 3));
    g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(n * 2 * 3).map((_, i) => (i % 3 === 2 ? 1 : 0)), 3));
    g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(n * 2 * 2), 2));
    const idx: number[] = [];
    for (let i = 0; i < SEGMENTS; i++) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    g.setIndex(idx);
    return g;
  }, []);

  const [grab, setGrab] = useState<THREE.Vector3 | null>(null);
  const [hover, setHover] = useState(false);
  const { gl } = useThree();

  const scratch = useMemo(
    () => ({
      pointer: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      angvel: new THREE.Vector3(),
      rot: new THREE.Vector3(),
      s1: new THREE.Vector3(),
      s2: new THREE.Vector3(),
      ready: false,
    }),
    []
  );
  // A cubic Bezier through the four physics points. (A Catmull-Rom curve diverges numerically when
  // the strap hangs perfectly straight, so it is avoided on purpose.)
  const curve = useMemo(
    () => new THREE.CubicBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()),
    []
  );

  const body = { canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 } as const;

  useRopeJoint(anchor, p1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(p1, p2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(p2, p3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(p3, card, [[0, 0, 0], [0, RING_Y, 0]]);

  useEffect(() => {
    const el = gl.domElement;
    el.style.cursor = hover ? (grab ? 'grabbing' : 'grab') : 'auto';
    return () => {
      el.style.cursor = 'auto';
    };
  }, [hover, grab, gl]);

  useFrame((state, delta) => {
    // ease the card toward the requested side (independent of the physics body, which keeps swinging)
    if (face.current) face.current.rotation.y = THREE.MathUtils.damp(face.current.rotation.y, flipped ? Math.PI : 0, 5, delta);
    const c = card.current;
    if (!c || !anchor.current || !p1.current || !p2.current || !p3.current) return;

    if (grab) {
      scratch.pointer.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      scratch.dir.copy(scratch.pointer).sub(state.camera.position).normalize();
      scratch.pointer.add(scratch.dir.multiplyScalar(state.camera.position.length()));
      [card, p1, p2, p3, anchor].forEach((r) => r.current?.wakeUp());
      c.setNextKinematicTranslation({
        x: scratch.pointer.x - grab.x,
        y: scratch.pointer.y - grab.y,
        z: scratch.pointer.z - grab.z,
      });
    }

    // Smooth the two middle points so the strap bends instead of kinking.
    if (!scratch.ready) {
      scratch.s1.copy(p1.current.translation() as unknown as THREE.Vector3);
      scratch.s2.copy(p2.current.translation() as unknown as THREE.Vector3);
      scratch.ready = true;
    }
    [
      [scratch.s1, p1.current],
      [scratch.s2, p2.current],
    ].forEach(([smooth, rb]) => {
      const s = smooth as THREE.Vector3;
      const t = (rb as RapierRigidBody).translation();
      const gap = Math.max(0.1, Math.min(1, s.distanceTo(t as unknown as THREE.Vector3)));
      // k must stay <= 1: a larger step overshoots the target and the strap oscillates on slow frames
      s.lerp(t as unknown as THREE.Vector3, Math.min(1, Math.min(delta, 1 / 30) * (10 + gap * 40)));
    });

    curve.v0.copy(p3.current.translation() as unknown as THREE.Vector3);
    curve.v1.copy(scratch.s2);
    curve.v2.copy(scratch.s1);
    curve.v3.copy(anchor.current.translation() as unknown as THREE.Vector3);
    // Lay a flat ribbon along the curve. Width runs perpendicular to the strap inside the screen plane.
    const pts = curve.getPoints(SEGMENTS);
    const pos = ribbon.getAttribute('position') as THREE.BufferAttribute;
    const uv = ribbon.getAttribute('uv') as THREE.BufferAttribute;
    let along = 0;
    for (let i = 0; i <= SEGMENTS; i++) {
      const a = pts[Math.max(0, i - 1)];
      const b = pts[Math.min(SEGMENTS, i + 1)];
      const tx = b.x - a.x;
      const ty = b.y - a.y;
      const len = Math.hypot(tx, ty) || 1;
      const nx = (-ty / len) * (STRAP_W / 2);
      const ny = (tx / len) * (STRAP_W / 2);
      const p = pts[i];
      if (i > 0) along += p.distanceTo(pts[i - 1]);
      pos.setXYZ(i * 2, p.x + nx, p.y + ny, p.z);
      pos.setXYZ(i * 2 + 1, p.x - nx, p.y - ny, p.z);
      uv.setXY(i * 2, along / STRAP_TILE, 1);
      uv.setXY(i * 2 + 1, along / STRAP_TILE, 0);
    }
    pos.needsUpdate = true;
    uv.needsUpdate = true;

    // Gently stop the card from spinning around the vertical axis forever.
    scratch.angvel.copy(c.angvel() as unknown as THREE.Vector3);
    scratch.rot.copy(c.rotation() as unknown as THREE.Vector3);
    c.setAngvel({ x: scratch.angvel.x, y: scratch.angvel.y - scratch.rot.y * 0.25, z: scratch.angvel.z }, true);
  });

  strap.wrapS = strap.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={anchor} {...body} type="fixed" />
        <RigidBody ref={p1} position={[0.5, 0, 0]} {...body}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody ref={p2} position={[1, 0, 0]} {...body}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody ref={p3} position={[1.5, 0, 0]} {...body}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody ref={card} position={[2, 0, 0]} {...body} type={grab ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[CARD_W / 2, CARD_H / 2, 0.025]} />
          <group
            ref={face}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            onPointerUp={(e) => {
              (e.target as Element).releasePointerCapture(e.pointerId);
              setGrab(null);
            }}
            onPointerCancel={() => setGrab(null)}
            onPointerDown={(e) => {
              (e.target as Element).setPointerCapture(e.pointerId);
              const t = card.current!.translation();
              setGrab(new THREE.Vector3().copy(e.point).sub(new THREE.Vector3(t.x, t.y, t.z)));
            }}
          >
            {/* card body */}
            <RoundedBox args={[CARD_W, CARD_H, CARD_D]} radius={0.09} smoothness={4}>
              <meshPhysicalMaterial color="#141417" roughness={0.4} metalness={0.5} clearcoat={1} clearcoatRoughness={0.2} />
            </RoundedBox>
            {/* printed faces */}
            <mesh position={[0, 0, CARD_D / 2 + 0.0008]}>
              <planeGeometry args={[CARD_W, CARD_H]} />
              <meshPhysicalMaterial map={front} alphaTest={0.5} roughness={0.38} metalness={0.2} clearcoat={0.9} clearcoatRoughness={0.18} />
            </mesh>
            <mesh position={[0, 0, -(CARD_D / 2 + 0.0008)]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[CARD_W, CARD_H]} />
              <meshPhysicalMaterial map={back} alphaTest={0.5} roughness={0.38} metalness={0.2} clearcoat={0.9} clearcoatRoughness={0.18} />
            </mesh>
            {/* clip: a plate on the card and a ring the strap runs through */}
            <mesh position={[0, CARD_H / 2 + 0.05, 0]}>
              <boxGeometry args={[0.42, 0.2, 0.08]} />
              <meshStandardMaterial color="#c9c9cf" metalness={1} roughness={0.25} />
            </mesh>
            <mesh position={[0, RING_Y, 0]}>
              <torusGeometry args={[0.1, 0.026, 16, 32]} />
              <meshStandardMaterial color="#c9c9cf" metalness={1} roughness={0.25} />
            </mesh>
          </group>
        </RigidBody>
      </group>

      <mesh geometry={ribbon} frustumCulled={false}>
        <meshStandardMaterial map={strap} side={THREE.DoubleSide} roughness={0.7} metalness={0.05} />
      </mesh>
    </>
  );
}
