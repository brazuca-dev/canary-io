export const createTempFile = async (
  tempPath: string,
  data: Uint8Array,
): Promise<void> => {
  await Deno.writeFile(tempPath, data);
};

export const readTempFile = async (
  tempPath: string,
): Promise<Uint8Array> => {
  return await Deno.readFile(tempPath);
};

export const removeTempFile = async (
  tempPath: string,
): Promise<void> => {
  await Deno.remove(tempPath);
};
