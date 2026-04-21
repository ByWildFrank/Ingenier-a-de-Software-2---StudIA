class Usuario {
  constructor({ id_usuario, nombre, correo, nivel_educativo, id_tipo_usuario }) {
    this.id_usuario = id_usuario;
    this.nombre = nombre;
    this.correo = correo;
    this.nivel_educativo = nivel_educativo;
    this.id_tipo_usuario = id_tipo_usuario;
  }

  static fromDB(row) {
    return new Usuario(row);
  }
}

module.exports = Usuario;
