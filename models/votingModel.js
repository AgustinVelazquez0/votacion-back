const mongoose = require("mongoose");

// Esquema para usuarios
const userSchema = new mongoose.Schema(
  {
    dni: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    hasVoted: {
      type: Boolean,
      default: false,
    },
    votedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Esquema para candidatos
const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    party: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    proposals: [
      {
        type: String,
      },
    ],
    votes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Esquema para votos (para auditoria)
const voteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Esquema para configuración de elección
const electionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    totalVotes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Verificar si los modelos ya existen antes de crearlos
const User = mongoose.models.User || mongoose.model("User", userSchema);
const Candidate =
  mongoose.models.Candidate || mongoose.model("Candidate", candidateSchema);
const Vote = mongoose.models.Vote || mongoose.model("Vote", voteSchema);
const Election =
  mongoose.models.Election || mongoose.model("Election", electionSchema);

module.exports = {
  User,
  Candidate,
  Vote,
  Election,
};
