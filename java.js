package com.moncho.desafio02.service;

import org.springframework.stereotype.Service;

/**
 * Servicio Java para la validación del dominio institucional 
 * en el Desafío 02: Registro con bloqueo de dominios.
 */
@Service
public class RegistroService {

    private static final String DOMINIO_AUTORIZADO = "@asuncionescalada.edu.py";

    /**
     * Valida si el correo electrónico cumple con el dominio institucional requerido[cite: 5].
     */
    public boolean validarDominioInstitucional(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        String emailTrimmed = email.trim().toLowerCase();
        return emailTrimmed.endsWith(DOMINIO_AUTORIZADO);
    }

    /**
     * Método de registro con control de excepciones de dominio[cite: 5].
     */
    public void registrarUsuario(String email, String password) throws SecurityException {
        if (!validarDominioInstitucional(email)) {
            throw new SecurityException("Registro bloqueado: El dominio del correo no está autorizado para este sistema.");
        }
        
        if (password == null || password.length() < 6) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 6 caracteres.");
        }

        System.out.println("Usuario registrado exitosamente con el correo: " + email);
    }
}