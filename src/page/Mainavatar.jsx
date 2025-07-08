import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "../components/Experience";
import { UI } from "../components/UI";

export function Mainavatar(){
    return (
        <>
            <Loader />
            <UI />
            <Canvas shadows camera={{ position: [0, 0, 1], fov: 40 }} style={{ pointerEvents: 'none' }} >
            <Experience />
            </Canvas>
        </>
    )
}