export const injectC2PAMetadata = async (
  inputFilePath: string,
  manifestPath: string,
  outputFilePath: string,
): Promise<void> => {
  const absoluteInputFilePath = await Deno.realPath(
    inputFilePath,
  );
  const absoluteManifestPath = await Deno.realPath(
    manifestPath,
  );
  const absoluteOutputFilePath = `${Deno.cwd()}/${outputFilePath}`;
  
  const command = new Deno.Command("c2patool", {
    args: [
      absoluteInputFilePath,
      "--manifest", absoluteManifestPath,
      "--output", absoluteOutputFilePath,
      "--force",
    ],
  });

  const { success, stderr } = await command.output();

  if (!success) {
    throw new Error(`C2PA Error: ${new TextDecoder().decode(stderr)}`);
  }
};

