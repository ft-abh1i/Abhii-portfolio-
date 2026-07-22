"use client";

import { AdaptiveDpr, Float, Line, Sparkles } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const shellVertexShader = `
  uniform float uTime;
  uniform vec2 uPointer;
  varying vec3 vNormalView;
  varying vec3 vPosition;

  void main() {
    float rippleA = sin(position.y * 4.2 + uTime * 0.48) * 0.018;
    float rippleB = sin(position.x * 5.1 - uTime * 0.35) * 0.012;
    float pointerRipple = sin((position.x + uPointer.x) * 2.4 + (position.y + uPointer.y) * 2.1) * 0.009;
    vec3 displaced = position + normal * (rippleA + rippleB + pointerRipple);

    vNormalView = normalize(normalMatrix * normal);
    vPosition = displaced;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const shellFragmentShader = `
  uniform float uTime;
  varying vec3 vNormalView;
  varying vec3 vPosition;

  void main() {
    float fresnel = pow(1.0 - abs(dot(vNormalView, vec3(0.0, 0.0, 1.0))), 2.2);
    float ribbonA = 0.5 + 0.5 * sin(vPosition.y * 4.0 + vPosition.x * 2.2 + uTime * 0.42);
    float ribbonB = 0.5 + 0.5 * sin(vPosition.z * 5.0 - vPosition.y * 2.4 - uTime * 0.28);
    float ribbon = smoothstep(0.24, 0.92, ribbonA * 0.64 + ribbonB * 0.36);

    vec3 violet = vec3(0.48, 0.25, 1.0);
    vec3 lavender = vec3(0.78, 0.70, 1.0);
    vec3 acid = vec3(0.73, 1.0, 0.18);
    vec3 glass = mix(violet, lavender, fresnel);
    glass = mix(glass, acid, ribbon * 0.34);
    glass += fresnel * vec3(0.34, 0.28, 0.74);

    float alpha = 0.08 + fresnel * 0.62 + ribbon * 0.08;
    gl_FragColor = vec4(glass, alpha);
  }
`;

const innerVertexShader = `
  uniform float uTime;
  varying vec3 vPosition;

  void main() {
    vec3 displaced = position;
    displaced += normal * sin(position.y * 5.0 + position.x * 2.0 + uTime * 0.55) * 0.045;
    vPosition = displaced;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const innerFragmentShader = `
  uniform float uTime;
  varying vec3 vPosition;

  void main() {
    float wave = 0.5 + 0.5 * sin(vPosition.x * 4.0 - vPosition.y * 5.2 + uTime * 0.62);
    float fold = smoothstep(0.35, 0.86, wave);
    vec3 violet = vec3(0.34, 0.12, 0.82);
    vec3 mist = vec3(0.72, 0.66, 1.0);
    vec3 acid = vec3(0.65, 1.0, 0.12);
    vec3 color = mix(violet, mist, fold);
    color = mix(color, acid, smoothstep(-0.8, 0.4, -vPosition.y) * 0.24);
    gl_FragColor = vec4(color, 0.13 + fold * 0.12);
  }
`;

function makeGlowTexture() {
  const size = 128;
  const data = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const dx = (x / (size - 1)) * 2 - 1;
      const dy = (y / (size - 1)) * 2 - 1;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const strength = Math.pow(Math.max(0, 1 - distance), 2.65);
      const index = (y * size + x) * 4;
      data[index] = 255;
      data[index + 1] = 255;
      data[index + 2] = 255;
      data[index + 3] = Math.round(strength * 255);
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function GlassOrb() {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.ShaderMaterial>(null);
  const inner = useRef<THREE.ShaderMaterial>(null);
  const pointer = useRef(new THREE.Vector2());
  const { viewport } = useThree();
  const compact = viewport.width < 5.2;

  const shellUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
    }),
    [],
  );

  const innerUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  const glowTexture = useMemo(() => makeGlowTexture(), []);

  const orbitOne = useMemo(
    () =>
      Array.from({ length: 120 }, (_, index) => {
        const angle = (index / 119) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(angle) * 1.75, Math.sin(angle) * 1.18, Math.sin(angle * 2) * 0.08);
      }),
    [],
  );

  const orbitTwo = useMemo(
    () =>
      Array.from({ length: 120 }, (_, index) => {
        const angle = (index / 119) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(angle) * 1.92, Math.sin(angle) * 1.42, 0);
      }),
    [],
  );

  useEffect(() => {
    const handlePointer = (event: PointerEvent) => {
      pointer.current.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
    };

    window.addEventListener("pointermove", handlePointer, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointer);
  }, []);

  useEffect(() => () => glowTexture.dispose(), [glowTexture]);

  useFrame(({ clock }, delta) => {
    if (!group.current || !shell.current || !inner.current) return;

    shell.current.uniforms.uTime.value = clock.elapsedTime;
    shell.current.uniforms.uPointer.value.lerp(pointer.current, 0.045);
    inner.current.uniforms.uTime.value = clock.elapsedTime;

    const targetX = compact ? 0 : 1.32;
    const targetY = compact ? 0.68 : 0.18;
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, targetX + pointer.current.x * 0.08, 3.2, delta);
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, targetY + pointer.current.y * 0.06, 3.2, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, pointer.current.y * 0.08, 3.0, delta);
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      pointer.current.x * 0.12 + clock.elapsedTime * 0.035,
      3.0,
      delta,
    );
    group.current.rotation.z = Math.sin(clock.elapsedTime * 0.22) * 0.025;
  });

  const radius = compact ? 1.28 : 1.58;

  return (
    <group ref={group}>
      <Float speed={0.58} rotationIntensity={0.035} floatIntensity={0.16}>
        <sprite scale={[compact ? 4.4 : 5.4, compact ? 4.4 : 5.4, 1]} position={[0.02, -0.18, -0.9]}>
          <spriteMaterial
            map={glowTexture}
            color="#7c4dff"
            transparent
            opacity={0.2}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>

        <sprite scale={[compact ? 2.5 : 3.1, compact ? 2.5 : 3.1, 1]} position={[0.05, -0.34, 0.2]}>
          <spriteMaterial
            map={glowTexture}
            color="#b9ff25"
            transparent
            opacity={0.68}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>

        <mesh>
          <sphereGeometry args={[radius, compact ? 72 : 112, compact ? 54 : 84]} />
          <shaderMaterial
            ref={shell}
            vertexShader={shellVertexShader}
            fragmentShader={shellFragmentShader}
            uniforms={shellUniforms}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh scale={0.9} rotation={[0.36, -0.28, 0.22]}>
          <sphereGeometry args={[radius, compact ? 48 : 72, compact ? 36 : 56]} />
          <shaderMaterial
            ref={inner}
            vertexShader={innerVertexShader}
            fragmentShader={innerFragmentShader}
            uniforms={innerUniforms}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <mesh scale={1.035} rotation={[0.24, 0.34, -0.14]}>
          <sphereGeometry args={[radius, 26, 18]} />
          <meshBasicMaterial color="#d9ccff" wireframe transparent opacity={0.055} depthWrite={false} />
        </mesh>

        <group rotation={[0.34, -0.16, 0.18]}>
          <Line points={orbitOne} color="#b7ff32" lineWidth={0.72} transparent opacity={0.24} />
        </group>
        <group rotation={[-0.52, 0.44, -0.28]}>
          <Line points={orbitTwo} color="#cfc4ff" lineWidth={0.55} transparent opacity={0.18} dashed dashSize={0.055} gapSize={0.085} />
        </group>

        <pointLight position={[0.08, -0.2, 1.2]} color="#b9ff32" intensity={compact ? 8 : 12} distance={5.5} />
        <pointLight position={[-0.8, 0.7, 1.6]} color="#8f64ff" intensity={compact ? 5 : 8} distance={5.5} />
      </Float>
    </group>
  );
}

function OrbScene() {
  return (
    <>
      <fog attach="fog" args={["#050609", 5.5, 13]} />
      <ambientLight intensity={0.38} />
      <directionalLight position={[3, 4, 5]} color="#eeeaff" intensity={1.8} />
      <directionalLight position={[-4, -1, 2]} color="#7250ff" intensity={1.15} />
      <Sparkles count={95} scale={[9, 7, 6]} size={0.85} speed={0.08} opacity={0.32} color="#ebe8ff" />
      <GlassOrb />
    </>
  );
}

export default function ReferenceHero() {
  return (
    <section className="reference-hero" aria-label="Homepage introduction">
      <div className="reference-hero-canvas" aria-hidden="true">
        <Canvas
          dpr={[1, 1.55]}
          camera={{ position: [0, 0, 6], fov: 42, near: 0.1, far: 30 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.16;
            gl.outputColorSpace = THREE.SRGBColorSpace;
          }}
        >
          <OrbScene />
          <AdaptiveDpr pixelated />
        </Canvas>
      </div>

      <div className="reference-hero-lines" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="reference-hero-meta">INDIA / 2026</div>

      <div className="reference-hero-copy">
        <div className="reference-hero-kicker"><i /> Open for creative collaborations</div>
        <h1>
          <span>3D</span>
          <span>Developer <em>&amp;</em></span>
          <span>Visual</span>
          <span>Designer<i>.</i></span>
        </h1>
        <p>Building immersive interfaces with motion, atmosphere and real-time 3D.</p>
        <a href="#work" className="reference-hero-cta">
          <span>Explore work</span>
          <b aria-hidden="true">↗</b>
        </a>
      </div>
    </section>
  );
}
