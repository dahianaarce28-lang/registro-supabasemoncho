-- =========================================================
-- DESAFÍO 02: Registro con bloqueo de dominios (Moncho)
-- Base de datos: PostgreSQL (Supabase compatible)
-- =========================================================

-- Tabla de perfiles de usuario vinculada a auth.users de Supabase[cite: 6]
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security (RLS)[cite: 6]
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad[cite: 6]
CREATE POLICY "Permitir lectura propia" ON public.profiles 
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Permitir inserción propia" ON public.profiles 
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Función en PostgreSQL para validar dominios institucionales en el backend[cite: 6]
CREATE OR REPLACE FUNCTION public.check_email_domain()
RETURNS TRIGGER AS $$
DECLARE
    allowed_domain TEXT := '@asuncionescalada.edu.py';
BEGIN
    IF NEW.email NOT LIKE '%' || allowed_domain THEN
        RAISE EXCEPTION 'Acceso denegado: El correo no pertenece al dominio institucional autorizado (%).', allowed_domain;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;