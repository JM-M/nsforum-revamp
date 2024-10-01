import { env } from "@/env";
import axios, { AxiosError } from "axios";
import fs from "fs";
import { isEqual, isNil, omitBy } from "lodash-es";
import migrations from "../migrations";
import models from "../models";
import schemas from "../schemas";

const writeFile = (path: string, content: string) => {
  fs.writeFile(path, content, "utf8", (err: unknown) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log(`${path} successfully written!`);
    }
  });
};

const updateModelVersion = (modelName: string) => {
  const versionRegex = /_v(\d+)$/; // Regex to match "_v" followed by digits at the end

  // Check if the string ends with a version number
  const match = modelName.match(versionRegex);

  if (match) {
    // If a version is found, increment it
    const currentVersion = parseInt(match[1], 10);
    const newVersion = currentVersion + 1;
    return modelName.replace(versionRegex, `_v${newVersion}`);
  } else {
    // If no version is found, append "_v0"
    return `${modelName}_v0`;
  }
};

const syncModel = async (modelName: string) => {
  const currentSchema =
    migrations.schemas[modelName as keyof typeof migrations.schemas];
  const newSchema = schemas[modelName as keyof typeof schemas];

  if (newSchema && isEqual(currentSchema, newSchema)) {
    console.log(`No schema changes found for: ${modelName}`);
    return;
  }

  const updatedName = updateModelVersion(
    models[modelName as keyof typeof models]?.name || modelName,
  );

  const schema = {
    ...newSchema,
    name: updatedName,
  };

  try {
    const { data } = await axios.post(
      `${env.BASE_URL}/api/dev/orbis/create-model`,
      {
        schema,
      },
    );
    console.log(`Successfully created new model for ${modelName}: `, data);
    if (data?.id) {
      return { ...data, name: updatedName } as { id: string; name: string };
    } else {
      console.log(`Could not create a new model for ${modelName}`);
    }
  } catch (error) {
    console.log(
      `An error occured while creating model ${modelName}: `,
      (error as AxiosError)?.response?.data || (error as Error)?.message,
    );
  }
};

const updateFiles = (updatedModels: any) => {
  const numUpdatedModels = Object.keys(updatedModels).length;
  console.log(`${numUpdatedModels} model were updated`);
  if (!numUpdatedModels) return;

  // models.ts file
  const modelsFileContent = `
  const models = ${JSON.stringify(updatedModels, undefined, 2)} as const;

  export default models;
  `;
  writeFile("shared/orbis/models.ts", modelsFileContent);

  // migrations.ts file
  const migrationsFileContent = `
const schemas = ${JSON.stringify(schemas, undefined, 2)};

const migrations = { schemas } as const;

export default migrations;
`;
  writeFile("shared/orbis/migrations.ts", migrationsFileContent);
};

const syncModels = async () => {
  if (!env.ORBIS_DB_AUTH_TOKEN) {
    console.log("ORBIS_DB_AUTH_TOKEN env variable is required");
    return;
  }
  const newSchemas = schemas;
  const newModels: any = {};

  for (const modelName in newSchemas) {
    if (Object.prototype.hasOwnProperty.call(newSchemas, modelName)) {
      const modelData = await syncModel(modelName);
      newModels[modelName] = modelData;
    }
  }

  const updatedModels = omitBy({ ...(models || {}), ...newModels }, isNil);
  updateFiles(updatedModels);
};

export default syncModels;
