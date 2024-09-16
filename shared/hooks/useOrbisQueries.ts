// Orbis queries on the frontend

import { findRow } from "../orbis/utils";

const useOrbisQueries = () => {
  const fetchProfile = async (did?: string) => {
    if (!did) return null;
    return await findRow({ model: "users", where: { did } });
  };

  return { fetchProfile };
};

export default useOrbisQueries;
