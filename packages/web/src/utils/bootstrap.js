import { getUser } from "./auth";

const bootstrapAppData = async () => {
  const data = await getUser();
  if (!data) {
    return { user: null };
  }
  return data;
};

export { bootstrapAppData };
