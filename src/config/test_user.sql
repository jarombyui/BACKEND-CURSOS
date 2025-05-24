-- Insertar usuario de prueba (la contraseña es 'password123')
INSERT INTO usuarios (nombre, email, password, rol) 
VALUES (
    'Usuario Prueba',
    'test@example.com',
    '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX5Yx',
    'usuario'
) ON DUPLICATE KEY UPDATE id=id; 