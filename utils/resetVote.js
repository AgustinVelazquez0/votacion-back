const mongoose = require("mongoose");
const { User, Candidate, Vote, Election } = require("../models/votingModel");
require("dotenv").config();

const resetUserVote = async (userEmail) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Buscar usuario
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      console.log("Usuario no encontrado");
      return;
    }

    // Buscar voto
    const vote = await Vote.findOne({ userId: user._id });

    if (vote) {
      // Decrementar candidato
      await Candidate.findByIdAndUpdate(vote.candidateId, {
        $inc: { votes: -1 },
      });

      // Eliminar voto
      await Vote.deleteOne({ userId: user._id });
      console.log("✅ Voto eliminado");
    }

    // Resetear usuario
    await User.findByIdAndUpdate(user._id, {
      hasVoted: false,
      $unset: { votedAt: 1 },
    });

    console.log("✅ Usuario reseteado");
    console.log("🎉 Voto completamente eliminado");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

// Usar: node utils/resetVote.js
resetUserVote("pepe@pepe.com");
