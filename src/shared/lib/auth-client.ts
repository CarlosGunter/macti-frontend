import { genericOAuthClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const createInstituteAuthClient = (institute: string) =>
  createAuthClient({
    baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/proxy/${institute}`,
    plugins: [genericOAuthClient()],
  });

type AuthClient = ReturnType<typeof createInstituteAuthClient>;

const authClientCache = new Map<string, AuthClient>();

export const getAuthClient = (institute: string) => {
  const cachedClient = authClientCache.get(institute);

  if (cachedClient) {
    return cachedClient;
  }

  const client = createInstituteAuthClient(institute);

  authClientCache.set(institute, client);
  return client;
};
