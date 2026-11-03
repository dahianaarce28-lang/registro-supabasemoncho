// Validaciones del FRONTEND (mejoran la experiencia, pero NO son seguridad real).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(value, allowedDomains) {
  const email = value.trim().toLowerCase();
  if (!email) return { ok: false, msg: "Ingresa tu correo institucional." };
  if (!email.includes("@")) return { ok: false, msg: "Falta el símbolo @ en el correo." };
  if (!EMAIL_RE.test(email)) {
    return { ok: false, msg: "El formato del correo no es válido. Ejemplo: nombre@" + allowedDomains[0] };
  }
  const domain = email.split("@")[1];
  if (!allowedDomains.includes(domain)) {
    return {
      ok: false,
      msg: `El dominio @${domain} no está permitido. Usa un correo @${allowedDomains.join(" o @")}.`
    };
  }
  return { ok: true, msg: "Correo institucional válido ✓" };
}

export function passwordChecks(pass) {
  return {
    len: pass.length >= 8,
    upper: /[A-Z]/.test(pass),
    lower: /[a-z]/.test(pass),
    num: /\d/.test(pass)
  };
}

export function validatePassword(pass) {
  if (!pass) return { ok: false, msg: "Ingresa una contraseña." };
  const c = passwordChecks(pass);
  if (!c.len) return { ok: false, msg: "La contraseña debe tener al menos 8 caracteres." };
  if (!c.upper) return { ok: false, msg: "Agrega al menos una letra mayúscula." };
  if (!c.lower) return { ok: false, msg: "Agrega al menos una letra minúscula." };
  if (!c.num) return { ok: false, msg: "Agrega al menos un número." };
  return { ok: true, msg: "Contraseña segura ✓" };
}

export function validateConfirm(pass, confirm) {
  if (!confirm) return { ok: false, msg: "Repite la contraseña para confirmarla." };
  if (pass !== confirm) return { ok: false, msg: "Las contraseñas no coinciden." };
  return { ok: true, msg: "Las contraseñas coinciden ✓" };
}

// Traduce los errores de Supabase Auth a mensajes claros.
export function supabaseErrorMessage(err) {
  const code = (err && err.code) || "";
  const msg = (err && err.message) || "";
  const status = err && err.status;

  // El trigger de la base de datos rechazó el dominio (Supabase lo devuelve como error 500 genérico)
  if (/database error saving new user|DOMINIO_NO_PERMITIDO/i.test(msg)) {
    return "El servidor rechazó el registro: el dominio del correo no está autorizado.";
  }
  if (code === "user_already_exists" || /already registered|already been registered/i.test(msg)) {
    return "Ese correo ya está registrado. Intenta iniciar sesión.";
  }
  if (code === "weak_password" || /password should be at least/i.test(msg)) {
    return "La contraseña es demasiado débil. Usa al menos 8 caracteres, mayúscula, minúscula y número.";
  }
  if (code === "validation_failed" || /invalid.*email|unable to validate email/i.test(msg)) {
    return "El correo no tiene un formato válido.";
  }
  if (code === "over_email_send_rate_limit" || status === 429 || /rate limit/i.test(msg)) {
    return "Demasiados correos enviados. Espera unos minutos e inténtalo de nuevo.";
  }
  if (code === "signup_disabled" || /signups not allowed/i.test(msg)) {
    return "Los registros están desactivados en Supabase (Authentication → Sign In / Providers).";
  }
  if (/invalid api key|apikey/i.test(msg)) {
    return "La clave anon de supabase-config.js no es válida. Revisa la configuración.";
  }
  if (/failed to fetch|network/i.test(msg)) {
    return "Sin conexión con Supabase. Revisa tu internet y la SUPABASE_URL.";
  }
  if (/invalid login credentials/i.test(msg)) {
    return "Credenciales incorrectas.";
  }
  return "Ocurrió un error inesperado" + (code ? ` (${code})` : "") + ". Inténtalo nuevamente.";
}