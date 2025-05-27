const mongoose = require("mongoose");
const { Candidate, Election, User } = require("../models/votingModel");
require("dotenv").config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conectado a MongoDB para inicializar datos...");

    // Limpiar datos existentes
    await Candidate.deleteMany({});
    await Election.deleteMany({});

    // Crear candidatos de ejemplo
    const candidates = [
      {
        name: "Juan Pérez",
        party: "Partido de la Esperanza",
        image: "https://via.placeholder.com/150",
        proposals: [
          "Mejorar la educación pública",
          "Crear más empleos",
          "Fortalecer la seguridad ciudadana",
        ],
      },
      {
        name: "María González",
        party: "Movimiento Nacional",
        image: "https://via.placeholder.com/150",
        proposals: [
          "Reformar el sistema de salud",
          "Proteger el medio ambiente",
          "Reducir la corrupción",
        ],
      },
      {
        name: "Carlos Rodríguez",
        party: "Alianza Popular",
        image: "https://via.placeholder.com/150",
        proposals: [
          "Modernizar la infraestructura",
          "Apoyar a las pequeñas empresas",
          "Mejorar el transporte público",
        ],
      },
    ];

    await Candidate.insertMany(candidates);
    console.log("✅ Candidatos creados");

    // Crear elección activa
    const election = new Election({
      title: "Elección Presidencial 2024",
      description: "Elección para elegir al próximo presidente",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
      isActive: true,
    });

    await election.save();
    console.log("✅ Elección creada");

    console.log("🎉 Datos inicializados correctamente");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error inicializando datos:", error);
    process.exit(1);
  }
};

seedData();
