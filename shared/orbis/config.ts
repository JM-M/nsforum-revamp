import { OrbisConfig } from "@useorbis/db-sdk";

const config: OrbisConfig = {
  ceramic: {
    gateway: process.env.NEXT_PUBLIC_CERAMIC_NODE_URL as string,
  },
  nodes: [
    {
      gateway: process.env.NEXT_PUBLIC_ORBIS_NODE_URL as string,
      env: process.env.NEXT_PUBLIC_ORBIS_ENVIRONMENT_ID,
    },
  ],
};

export default config;
