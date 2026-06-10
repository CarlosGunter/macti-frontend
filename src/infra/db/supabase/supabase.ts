import { Pool } from "pg";

export const initSupabase = () => {
  const connectionString = process.env.SUPABASE_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error(
      "Se requiere la variable de entorno SUPABASE_CONNECTION_STRING para conectar a la base de datos.",
    );
  }

  return new Pool({
    connectionString: connectionString,
  });
};
