export const presets = [
    {
        id: "preset-linear-base",
        name: "Sistema Lineal (Punto de Silla)",
        description: "Usa los parámetros de la matriz del artículo original pero calculados con matemática real exacta, resultando en un Punto de Silla (inestable con dirección de escape).",
        model: "linear",
        params: {
            a11: 0.500,
            a12: 0.100,
            a21: 0.100,
            a22: 0.150,
            initX1: 1.0,
            initX2: 1.0,
            time: 100
        }
    },
    {
        id: "preset-lv-base",
        name: "Lotka-Volterra Base",
        description: "El modelo biológico no lineal clásico con los parámetros del artículo: P=100 y D=10. Produce comportamiento oscilatorio periódico.",
        model: "lotka-volterra",
        params: {
            initP: 100,
            initD: 10,
            r1: 0.005,
            a1: 0.0001,
            a2: 0.0001,
            r2: 0.015,
            time: 100
        }
    },
    {
        id: "preset-parasitoidism",
        name: "Parasitoidismo Extremo",
        description: "Simula el colapso demográfico. Los invasores radicales con alta tasa de éxito cazan de forma agresiva y extinguen a la población pasiva, colapsando ellos también.",
        model: "lotka-volterra",
        params: {
            initP: 120,
            initD: 40,
            r1: 0.01,
            a1: 0.001,
            a2: 0.0002,
            r2: 0.05,
            time: 120
        }
    },
    {
        id: "preset-stable-peace",
        name: "Estabilización y Paz Social",
        description: "Un sistema lineal donde las interacciones de competencia se controlan (coeficientes de crecimiento propios negativos), guiando al sistema a un punto de equilibrio estable en el origen.",
        model: "linear",
        params: {
            a11: -0.400,
            a12: -0.100,
            a21: -0.050,
            a22: -0.200,
            initX1: 8.0,
            initX2: 6.0,
            time: 50
        }
    }
];
