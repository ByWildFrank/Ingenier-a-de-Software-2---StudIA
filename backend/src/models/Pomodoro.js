class Pomodoro {
  constructor({ id_pomodoro, id_usuario, fecha, duracion_estudio, duracion_descanso, activo }) {
    this.id_pomodoro = id_pomodoro;
    this.id_usuario = id_usuario;
    this.fecha = fecha;
    this.duracion_estudio = duracion_estudio;
    this.duracion_descanso = duracion_descanso;
    this.activo = activo;
  }

  static fromDB(row) {
    return new Pomodoro(row);
  }

  toJSON() {
    return {
      id_pomodoro: this.id_pomodoro,
      id_usuario: this.id_usuario,
      fecha: this.fecha,
      duracion_estudio: this.duracion_estudio,
      duracion_descanso: this.duracion_descanso,
      activo: this.activo
    };
  }
}

module.exports = Pomodoro;
