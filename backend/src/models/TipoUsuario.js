class TipoUsuario {
  constructor({ id_tipo_usuario, nombre_tipo, activo }) {
    this.id_tipo_usuario = id_tipo_usuario;
    this.nombre_tipo = nombre_tipo?.trim();
    this.activo = activo;
  }

  static desdeDB(row) {
    return new TipoUsuario(row);
  }

  toJSON() {
    return {
      id_tipo_usuario: this.id_tipo_usuario,
      nombre_tipo: this.nombre_tipo,
      activo: this.activo
    };
  }
}

module.exports = TipoUsuario;
