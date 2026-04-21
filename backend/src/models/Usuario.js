class Usuario {
  constructor({ id_usuario, nombre, correo, contraseña, nivel_educativo, id_tipo_usuario, activo }) {
    this.id_usuario = id_usuario;
    this.nombre = nombre;
    this.correo = correo;
    this.contraseña = contraseña;
    this.nivel_educativo = nivel_educativo;
    this.id_tipo_usuario = id_tipo_usuario;
    this.activo = activo;
  }

  static fromDB(row) {
    return new Usuario(row);
  }

  toJSON() {
    return {
      id_usuario: this.id_usuario,
      nombre: this.nombre,
      correo: this.correo,
      nivel_educativo: this.nivel_educativo,
      id_tipo_usuario: this.id_tipo_usuario,
      activo: this.activo
    };
  }
}

module.exports = Usuario;
