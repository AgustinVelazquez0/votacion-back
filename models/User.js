const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    dni: {
      type: String,
      required: [true, "DNI es obligatorio"],
      unique: true,
      trim: true,
      minlength: [7, "DNI debe tener al menos 7 dígitos"],
      maxlength: [10, "DNI debe tener máximo 10 dígitos"],
      match: [/^\d+$/, "DNI solo debe contener números"],
    },

    password: {
      type: String,
      required: [true, "Contraseña es obligatoria"],
      minlength: [6, "Contraseña debe tener al menos 6 caracteres"],
      select: false, // Por defecto no incluir la contraseña en las consultas
    },

    name: {
      type: String,
      required: [true, "Nombre es obligatorio"],
      trim: true,
      minlength: [2, "Nombre debe tener al menos 2 caracteres"],
      maxlength: [100, "Nombre debe tener máximo 100 caracteres"],
    },

    email: {
      type: String,
      required: [true, "Email es obligatorio"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email inválido"],
    },

    hasVoted: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["voter", "admin"],
      default: "voter",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    votedAt: {
      type: Date,
      default: null,
    },

    ipAddress: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    collection: "users",
  }
);

// Índices para mejorar el rendimiento
userSchema.index({ hasVoted: 1 });
userSchema.index({ isActive: 1 });

// Middleware pre-save para validaciones adicionales
userSchema.pre("save", function (next) {
  // Validar DNI
  if (this.dni && !/^\d{7,10}$/.test(this.dni)) {
    return next(new Error("DNI debe tener entre 7 y 10 dígitos numéricos"));
  }

  // Actualizar fecha de modificación
  this.updatedAt = new Date();

  next();
});

// Método para marcar como votado
userSchema.methods.markAsVoted = function () {
  this.hasVoted = true;
  this.votedAt = new Date();
  this.updatedAt = new Date();
  return this.save();
};

// Método para verificar si puede votar
userSchema.methods.canVote = function () {
  return this.isActive && !this.hasVoted;
};

// Método para obtener información pública del usuario
userSchema.methods.getPublicInfo = function () {
  return {
    id: this._id,
    dni: this.dni,
    name: this.name,
    email: this.email,
    hasVoted: this.hasVoted,
    role: this.role,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    lastLogin: this.lastLogin,
  };
};

// Método estático para encontrar usuario por DNI
userSchema.statics.findByDni = function (dni) {
  return this.findOne({ dni, isActive: true });
};

// Método estático para contar votos
userSchema.statics.getVotingStats = function () {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        votedUsers: { $sum: { $cond: ["$hasVoted", 1, 0] } },
        activeUsers: { $sum: { $cond: ["$isActive", 1, 0] } },
      },
    },
  ]);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
