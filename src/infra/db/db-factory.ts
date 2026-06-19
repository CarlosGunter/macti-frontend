import { initPostgres } from "./postgres/postgres";
import { initSQLite } from "./sqlite/sqlite";

const mapDb = {
  sqlite: initSQLite,
  postgres: initPostgres,
};

type DbProvider = keyof typeof mapDb;

export const getDbInstance = () => {
  const DATABASE_PROVIDER = process.env.DATABASE_PROVIDER as DbProvider;
  const initDb = mapDb[DATABASE_PROVIDER];

  if (!initDb) {
    throw new Error(
      `Solo se admiten los siguientes proveedores de base de datos: ${Object.keys(mapDb).join(", ")}. Proveedor recibido: ${DATABASE_PROVIDER}`,
    );
  }

  return initDb();
};
