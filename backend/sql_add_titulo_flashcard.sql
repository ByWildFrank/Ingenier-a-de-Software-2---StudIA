------------------------------------------------------------
-- AGREGAR COLUMNA titulo A LA TABLA Flashcard
------------------------------------------------------------
ALTER TABLE Flashcard
ADD titulo VARCHAR(200) NULL;
GO

------------------------------------------------------------
-- ACTUALIZAR SP: sp_Flashcard_Crear (con titulo)
------------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_Flashcard_Crear
  @id_apunte INT,
  @titulo VARCHAR(200),
  @pregunta VARCHAR(500),
  @dificultad TINYINT,
  @activa BIT
AS
BEGIN
  INSERT INTO Flashcard (id_apunte, titulo, pregunta, dificultad, activa)
  VALUES (@id_apunte, @titulo, @pregunta, @dificultad, @activa);

  SELECT SCOPE_IDENTITY() AS id_flashcard;
END
GO

------------------------------------------------------------
-- ACTUALIZAR SP: sp_Flashcard_Actualizar (con titulo)
------------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_Flashcard_Actualizar
  @id_flashcard INT,
  @titulo VARCHAR(200),
  @pregunta VARCHAR(500),
  @dificultad TINYINT,
  @activa BIT
AS
BEGIN
  UPDATE Flashcard
  SET titulo = @titulo,
      pregunta = @pregunta,
      dificultad = @dificultad,
      activa = @activa
  WHERE id_flashcard = @id_flashcard AND activo = 1;
END
GO
