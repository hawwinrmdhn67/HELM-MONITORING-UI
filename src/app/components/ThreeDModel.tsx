"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, useGLTF } from "@react-three/drei";
import { Suspense, useRef, useState, useEffect } from "react";
import * as THREE from "three";

function useHelmetData(helmetId: string) {
  const [data, setData] = useState({ pitch: 0, roll: 0 });

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:3001/api/update-location");
        const json = await res.json();
        const helmet = json[helmetId];
        if (helmet) {
          setData({
            pitch: helmet.pitch ?? 0,
            roll: helmet.roll ?? 0,
          });
        }
      } catch (err) {
        console.error("Failed to fetch helmet data", err);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [helmetId]);

  return data;
}

function BikeWithStreet({ helmetId }: { helmetId: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Group>(null);

  const { scene } = useGLTF("/models/motorcycle.glb")

  const { pitch, roll } = useHelmetData(helmetId);

  useEffect(() => {
    if (modelRef.current) {
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const bottom = box.min.y;
      modelRef.current.position.y = -bottom;
    }
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.set(
        (-pitch * Math.PI) / 180, 
        0,                        
        (-roll * Math.PI) / 180   
      );
    }
  });

  return (
    <group ref={groupRef}>
      <primitive
        ref={modelRef}
        object={scene}
        scale={1}
        rotation={[0, Math.PI, 0]} 
      />
    </group>
  );
}

export default function ThreeDMode() {
  return (
    <div className="w-full h-[500px] md:h-[700px] bg-gray-100 rounded-lg shadow-lg">
      <Canvas camera={{ position: [5, 5, 12], fov: 50 }} shadows>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

        <Suspense fallback={<Html center>Loading 3D Model...</Html>}>
          <BikeWithStreet helmetId="H01" />
        </Suspense>

        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
    </div>
  );
}
