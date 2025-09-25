// "use client";

// import { useCallback } from "react";
// import Particles from "react-tsparticles";
// import { loadFull } from "tsparticles";

// const ParticlesBackground = () => {
//     const particlesInit = useCallback(async (engine) => {
//         await loadFull(engine);
//     }, []);

//     return (
//         <div className="absolute inset-0 h-full -z-10">
//             <Particles
//                 id="tsparticles"
//                 init={particlesInit}
//                 options={{
//                     background: {
//                         color: "black", // رنگ زمینه
//                     },
//                     particles: {
//                         number: {
//                             value: 70,
//                             density: {
//                                 enable: true,
//                                 area: 800,
//                             },
//                         },
//                         color: {
//                             value: "#ffffff",
//                         },
//                         shape: {
//                             type: ["circle", "square", "triangle", "star"],
//                         },
//                         opacity: {
//                             value: 0.3,
//                             random: true,
//                             anim: {
//                                 enable: true,
//                                 speed: 0.5,
//                                 opacity_min: 0.1,
//                                 sync: false,
//                             },
//                         },
//                         size: {
//                             value: { min: 3, max: 6 },
//                             random: true,
//                         },
//                         links: {
//                             enable: true,
//                             distance: 130,
//                             color: "#ffffff",
//                             opacity: 0.4,
//                             width: 1,
//                         },
//                         move: {
//                             enable: true,
//                             speed: 1.5,
//                             direction: "none",
//                             random: false,
//                             straight: false,
//                             outModes: {
//                                 default: "out",
//                             },
//                         },
//                     },
//                     interactivity: {
//                         events: {
//                             onHover: {
//                                 enable: true,
//                                 mode: "grab",
//                             },
//                             onClick: {
//                                 enable: true,
//                                 mode: "push",
//                             },
//                         },
//                         modes: {
//                             grab: {
//                                 distance: 140,
//                                 links: {
//                                     opacity: 1,
//                                 },
//                             },
//                             push: {
//                                 quantity: 3,
//                             },
//                         },
//                     },
//                     detectRetina: true,
//                 }}
//             />
//         </div>
//     );
// };

// export default ParticlesBackground;
