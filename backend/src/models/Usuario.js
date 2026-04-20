class Usuario {
  constructor({ id_usuario, nombre, correo, nivel_educativo, id_tipo_usuario }) {
    this.id = id_usuario;
    this.nombre = nombre;
    this.correo = correo;
    this.nivelEducativo = nivel_educativo;
    this.tipoUsuario = id_tipo_usuario;
  }

  static fromDB(row) {
    return new Usuario(row);
  }
}

module.exports = Usuario;
