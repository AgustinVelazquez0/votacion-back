const { User, Candidate, Vote, Election } = require("../models/votingModel");

// Resetear voto de un usuario (solo para desarrollo/testing)
const resetUserVote = async (req, res) => {
  try {
    const userId = req.user.id; // O req.params.userId para admin

    // 1. Buscar el voto del usuario
    const userVote = await Vote.findOne({ userId });

    if (userVote) {
      // 2. Decrementar votos del candidato
      await Candidate.findByIdAndUpdate(userVote.candidateId, {
        $inc: { votes: -1 },
      });

      // 3. Eliminar el voto
      await Vote.deleteOne({ userId });
    }

    // 4. Resetear estado del usuario
    await User.findByIdAndUpdate(userId, {
      hasVoted: false,
      $unset: { votedAt: 1 },
    });

    // 5. Actualizar total de votos en elección
    const totalVotes = await Vote.countDocuments();
    await Election.updateMany({}, { totalVotes });

    res.json({ message: "Voto reseteado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error reseteando voto", error: error.message });
  }
};

// Obtener todos los candidatos
const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ name: 1 });
    res.json(candidates);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
};

// Votar por un candidato
const vote = async (req, res) => {
  try {
    const { candidateId } = req.body;
    const userId = req.user.userId;

    // Verificar si el usuario ya votó
    const user = await User.findById(userId);
    if (user.hasVoted) {
      return res.status(400).json({ message: "Ya has ejercido tu voto" });
    }

    // Verificar que el candidato existe
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidato no encontrado" });
    }

    // Verificar que hay una elección activa
    const activeElection = await Election.findOne({ isActive: true });

    const totalVotes = await Vote.countDocuments(); // ✅ Cuenta real de votos
    const totalUsers = await User.countDocuments(); // ✅ Todos los usuarios
    const participation =
      totalUsers > 0 ? ((totalVotes / totalUsers) * 100).toFixed(2) : "0";

    if (!activeElection) {
      return res.status(400).json({ message: "No hay elección activa" });
    }

    // Verificar que estamos en el período de votación
    const now = new Date();
    if (now < activeElection.startDate || now > activeElection.endDate) {
      return res
        .status(400)
        .json({ message: "La votación no está disponible en este momento" });
    }

    // Registrar el voto
    const vote = new Vote({
      userId,
      candidateId,
      ipAddress: req.ip,
    });

    await vote.save();

    // Actualizar contador del candidato
    await Candidate.findByIdAndUpdate(candidateId, { $inc: { votes: 1 } });

    // Marcar usuario como votante
    await User.findByIdAndUpdate(userId, {
      hasVoted: true,
      votedAt: new Date(),
    });

    // Actualizar total de votos en la elección
    await Election.findByIdAndUpdate(activeElection._id, {
      $inc: { totalVotes: 1 },
    });

    res.json({ message: "Voto registrado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
};

// Obtener información de la elección
const getElection = async (req, res) => {
  try {
    const election = await Election.findOne({ isActive: true });
    if (!election) {
      return res.status(404).json({ message: "No hay elección activa" });
    }
    res.json(election);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
};

// Obtener resultados
const getResults = async (req, res) => {
  try {
    // 1. Traer todos los candidatos sin votos
    const candidates = await Candidate.find().lean();

    // 2. Hacer un aggregation para contar los votos por candidateId
    const votes = await Vote.aggregate([
      { $group: { _id: "$candidateId", totalVotes: { $sum: 1 } } },
    ]);

    // 3. Mapear los votos al array de candidatos
    const enrichedCandidates = candidates.map((candidate) => {
      const voteEntry = votes.find(
        (v) => String(v._id) === String(candidate._id)
      );
      return {
        id: candidate._id,
        name: candidate.name,
        party: candidate.party,
        votes: voteEntry ? voteEntry.totalVotes : 0,
      };
    });

    // 4. Obtener estadísticas globales
    const totalVotes = await Vote.countDocuments();
    const totalUsers = await User.countDocuments();
    const participation =
      totalUsers > 0 ? ((totalVotes / totalUsers) * 100).toFixed(2) : "0";

    const activeElection = await Election.findOne({ isActive: true });

    // 5. Responder con estructura limpia
    res.json({
      candidates: enrichedCandidates.sort((a, b) => b.votes - a.votes),
      totalVotes,
      totalUsers,
      participation: `${participation}%`,
      election: activeElection,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
};

// Verificar estado del usuario
const getUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
};

module.exports = {
  getCandidates,
  vote,
  getResults,
  getUserStatus,
  getElection,
  resetUserVote,
};
