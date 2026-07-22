"use client";

import { AdaptiveDpr, Float, Line, Sparkles } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MutableRefObject } from "react";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export type SceneMode = "matter" | "orbit" | "signal";

type SceneCanvasProps = {
  mode: SceneMode;
  onReady: () => void;
};

type SculptureProps = {
  active: boolean;
  pointer: MutableRefObject<THREE.Vector2>;
};

const orbVertexShader = `
  uniform float uTime;
  uniform vec2 uPointer;
  varying vec3 vNormalView;
  varying vec3 vPosition;

  void main() {
    float waveA = sin(position.y * 3.4 + uTime * 1.25) * 0.09;
    float waveB = sin(position.x * 4.8 - uTime * 0.9) * 0.055;
    float pointerWave = sin((position.x + uPointer.x) * 3.0 + (position.y + uPointer.y) * 2.0) * 0.035;
    vec3 displaced = position + normal * (waveA + waveB + pointerWave);

    vNormalView = normalize(normalMatrix * normal);
    vPosition = displaced;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const orbFragmentShader = `
  uniform float uTime;
  varying vec3 vNormalView;
  varying vec3 vPosition;

  void main() {
    float fresnel = pow(1.0 - abs(dot(vNormalView, vec3(0.0, 0.0, 1.0))), 2.4);
    float bands = 0.5 + 0.5 * sin(vPosition.y * 3.2 + vPosition.x * 1.5 + uTime * 0.55);
    vec3 ink = vec3(0.025, 0.03, 0.045);
    vec3 acid = vec3(0.63, 1.0, 0.22);
    vec3 violet = vec3(0.56, 0.26, 1.0);
    vec3 color = mix(ink, mix(violet, acid, bands), 0.48 + fresnel * 0.52);
    color += fresnel * vec3(0.55, 0.72, 1.0) * 0.38;
    gl_FragColor = vec4(color, 1.0);
  }
`;

function dampScale(group: THREE.Group | null, active: boolean, delta: number) {
  if (!group) return;
  const target = active ? 1 : 0.0001;
  const next = THREE.MathUtils.damp(group.scale.x, target, active ? 4.8 : 7.5, delta);
  group.scale.setScalar(next);
  group.visible = next > 0.005;
}

function MatterSculpture({ active, pointer }: SculptureProps) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
    }),
    [],
  );

  useFrame(({ clock }, delta) => {
    dampScale(group.current, active, delta);
    if (!group.current || !material.current) return;

    material.current.uniforms.uTime.value = clock.elapsedTime;
    material.current.uniforms.uPointer.value.lerp(pointer.current, 0.055);
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      pointer.current.y * 0.22 + clock.elapsedTime * 0.035,
      3.2,
      delta,
    );
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      pointer.current.x * 0.32 + clock.elapsedTime * 0.08,
      3.2,
      delta,
    );
    group.current.position.x = THREE.MathUtils.damp(
      group.current.position.x,
      viewport.width < 6 ? 0 : 1.35,
      4,
      delta,
    );
  });

  return (
    <group ref={group}>
      <Float speed={1.05} rotationIntensity={0.16} floatIntensity={0.28}>
        <mesh>
          <icosahedronGeometry args={[1.42, viewport.width < 6 ? 3 : 5]} />
          <shaderMaterial
            ref={material}
            vertexShader={orbVertexShader}
            fragmentShader={orbFragmentShader}
            uniforms={uniforms}
          />
        </mesh>
        <mesh scale={1.18} rotation={[0.45, 0.2, 0.1]}>
          <icosahedronGeometry args={[1.42, 2]} />
          <meshBasicMaterial color="#d8ff86" wireframe transparent opacity={0.085} />
        </mesh>
      </Float>
    </group>
  );
}

function OrbitSculpture({ active, pointer }: SculptureProps) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const rings = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  useFrame(({ clock }, delta) => {
    dampScale(group.current, active, delta);
    if (!group.current || !core.current || !rings.current) return;

    group.current.position.x = THREE.MathUtils.damp(
      group.current.position.x,
      viewport.width < 6 ? 0 : 1.15,
      4,
      delta,
    );
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, pointer.current.y * 0.18, 3, delta);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, pointer.current.x * 0.28, 3, delta);
    core.current.rotation.x = clock.elapsedTime * 0.18;
    core.current.rotation.y = clock.elapsedTime * 0.28;
    rings.current.rotation.x = clock.elapsedTime * 0.12;
    rings.current.rotation.z = -clock.elapsedTime * 0.16;
  });

  return (
    <group ref={group}>
      <Float speed={0.9} rotationIntensity={0.08} floatIntensity={0.22}>
        <mesh ref={core}>
          <torusKnotGeometry args={[0.83, 0.23, viewport.width < 6 ? 96 : 180, 24, 2, 3]} />
          <meshStandardMaterial color="#b9ff52" metalness={0.78} roughness={0.24} emissive="#18320b" />
        </mesh>
        <group ref={rings}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.55, 0.018, 12, 160]} />
            <meshBasicMaterial color="#8d66ff" transparent opacity={0.68} />
          </mesh>
          <mesh rotation={[0.55, 0.2, 0.85]}>
            <torusGeometry args={[1.92, 0.01, 10, 160]} />
            <meshBasicMaterial color="#ddf7ff" transparent opacity={0.28} />
          </mesh>
          <mesh rotation={[1.15, 0.35, -0.25]}>
            <torusGeometry args={[1.3, 0.012, 10, 160]} />
            <meshBasicMaterial color="#c8ff5a" transparent opacity={0.35} />
          </mesh>
        </group>
        <pointLight color="#b8ff58" intensity={15} distance={5} />
      </Float>
    </group>
  );
}

function SignalSculpture({ active, pointer }: SculptureProps) {
  const group = useRef<THREE.Group>(null);
  const points = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  const compact = viewport.width < 6;

  const positions = useMemo(() => {
    const count = compact ? 700 : 1500;
    const data = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const progress = index / count;
      const angle = progress * Math.PI * 13;
      const radius = 0.75 + Math.sin(angle * 0.45) * 0.3 + Math.random() * 0.22;
      data[index * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.12;
      data[index * 3 + 1] = (progress - 0.5) * 3.4 + (Math.random() - 0.5) * 0.12;
      data[index * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 0.12;
    }
    return data;
  }, [compact]);

  const linePoints = useMemo(
    () =>
      Array.from({ length: 90 }, (_, index) => {
        const progress = index / 89;
        const angle = progress * Math.PI * 6;
        return new THREE.Vector3(
          Math.cos(angle) * (0.84 + Math.sin(angle * 0.5) * 0.18),
          (progress - 0.5) * 3.15,
          Math.sin(angle) * (0.84 + Math.sin(angle * 0.5) * 0.18),
        );
      }),
    [],
  );

  useFrame(({ clock }, delta) => {
    dampScale(group.current, active, delta);
    if (!group.current || !points.current) return;

    group.current.position.x = THREE.MathUtils.damp(
      group.current.position.x,
      viewport.width < 6 ? 0 : 1.25,
      4,
      delta,
    );
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, pointer.current.y * 0.18, 3, delta);
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      pointer.current.x * 0.22 + clock.elapsedTime * 0.12,
      3,
      delta,
    );
    points.current.rotation.y = -clock.elapsedTime * 0.08;
  });

  return (
    <group ref={group}>
      <Float speed={0.7} rotationIntensity={0.06} floatIntensity={0.16}>
        <points ref={points}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          </bufferGeometry>
          <pointsMaterial color="#c9ff5a" size={compact ? 0.022 : 0.018} sizeAttenuation transparent opacity={0.82} />
        </points>
        <Line points={linePoints} color="#8a62ff" lineWidth={1.2} transparent opacity={0.55} />
        <mesh scale={0.72}>
          <octahedronGeometry args={[1, 2]} />
          <meshBasicMaterial color="#e8f2ff" wireframe transparent opacity={0.13} />
        </mesh>
      </Float>
    </group>
  );
}

function SceneWorld({ mode }: { mode: SceneMode }) {
  const pointer = useRef(new THREE.Vector2());
  const world = useRef<THREE.Group>(null);

  useEffect(() => {
    const handlePointer = (event: PointerEvent) => {
      pointer.current.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
    };
    window.addEventListener("pointermove", handlePointer, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointer);
  }, []);

  useFrame(({ clock }, delta) => {
    if (!world.current) return;
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = window.scrollY / maxScroll;
    world.current.position.y = THREE.MathUtils.damp(world.current.position.y, (progress - 0.35) * -0.55, 2.5, delta);
    world.current.rotation.z = THREE.MathUtils.damp(
      world.current.rotation.z,
      Math.sin(clock.elapsedTime * 0.2) * 0.025,
      2,
      delta,
    );
  });

  return (
    <>
      <fog attach="fog" args={["#07080b", 5, 14]} />
      <ambientLight intensity={0.72} />
      <directionalLight position={[3, 4, 4]} color="#dfffb0" intensity={2.4} />
      <directionalLight position={[-4, -1, 2]} color="#7a53ff" intensity={1.8} />
      <pointLight position={[0, 0, 4]} color="#e6f3ff" intensity={4.5} distance={9} />
      <Sparkles count={90} scale={[10, 8, 7]} size={1.2} speed={0.12} opacity={0.25} color="#dce8ff" />
      <group ref={world}>
        <MatterSculpture active={mode === "matter"} pointer={pointer} />
        <OrbitSculpture active={mode === "orbit"} pointer={pointer} />
        <SignalSculpture active={mode === "signal"} pointer={pointer} />
      </group>
    </>
  );
}

export default function SceneCanvas({ mode, onReady }: SceneCanvasProps) {
  const readyOnce = useRef(false);

  return (
    <div className="scene-canvas" aria-hidden="true">
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 6], fov: 42, near: 0.1, far: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.08;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          if (!readyOnce.current) {
            readyOnce.current = true;
            window.setTimeout(onReady, 180);
          }
        }}
      >
        <SceneWorld mode={mode} />
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  );
}
