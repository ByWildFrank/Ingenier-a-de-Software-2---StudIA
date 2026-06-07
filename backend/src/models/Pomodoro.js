class Pomodoro {
  constructor({ id_pomodoro, id_usuario, fecha, duracion_estudio, duracion_descanso, activo }) {
    this.id_pomodoro = id_pomodoro;
    this.id_usuario = id_usuario;
    this.fecha = fecha;
    this.duracion_estudio = duracion_estudio;
    this.duracion_descanso = duracion_descanso;
    this.activo = activo;
  }

  getFecha() { return this.fecha; }
  getDuracionEstudio() { return this.duracion_estudio; }
  getDuracionDescanso() { return this.duracion_descanso; }
  getActivo() { return this.activo; }

  setFecha(fecha) { this.fecha = fecha; }
  setDuracionEstudio(d) { this.duracion_estudio = d; }
  setDuracionDescanso(d) { this.duracion_descanso = d; }
  setActivo(activo) { this.activo = activo; }

  iniciarSesionEstudio() {
    this.fecha = new Date();
    this.activo = true;
  }

  iniciarDescanso() {
    console.log(`Descanso iniciado: ${this.duracion_descanso} minutos.`);
  }

  finalizarPomodoro() {
    this.activo = false;
  }

  static desdeDB(row) { return new Pomodoro(row); }

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
