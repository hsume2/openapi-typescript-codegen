import { resolve, relative } from 'path';

import type { Client } from '../client/interfaces/Client';
import { writeFile } from './fileSystem';
import { Templates } from './registerHandlebarTemplates';
import { sortModelsByName } from './sortModelsByName';
import { sortServicesByName } from './sortServicesByName';

/**
 * Generate the OpenAPI client index file using the Handlebar template and write it to disk.
 * The index file just contains all the exports you need to use the client as a standalone
 * library. But yuo can also import individual models and services directly.
 * @param client Client object, containing, models, schemas and services
 * @param templates The loaded handlebar templates
 * @param outputPath Directory to write the generated files to
 * @param useUnionTypes Use union types instead of enums
 * @param exportCore: Generate core
 * @param exportServices: Generate services
 * @param exportModels: Generate models
 * @param exportSchemas: Generate schemas
 */
export async function writeClientIndex(
    client: Client,
    templates: Templates,
    outputPath: string,
    corePath: string,
    modelsPath: string,
    schemasPath: string,
    servicesPath: string,
    useUnionTypes: boolean,
    exportCore: boolean,
    exportServices: boolean,
    exportModels: boolean,
    exportSchemas: boolean
): Promise<void> {
    const modelsRelativePath = relative(outputPath, modelsPath);
    const schemasRelativePath = relative(outputPath, schemasPath);
    const servicesRelativePath = relative(outputPath, servicesPath);
    const coreRelativePath = relative(outputPath, corePath);

    await writeFile(
        resolve(outputPath, 'index.ts'),
        templates.index({
            exportCore,
            exportServices,
            exportModels,
            exportSchemas,
            useUnionTypes,
            server: client.server,
            version: client.version,
            models: sortModelsByName(client.models),
            services: sortServicesByName(client.services),
            modelsPath: modelsRelativePath.startsWith('../') ? modelsRelativePath : `./${modelsRelativePath}`,
            schemasPath: schemasRelativePath.startsWith('../') ? schemasRelativePath : `./${schemasRelativePath}`,
            servicesPath: servicesRelativePath.startsWith('../') ? servicesRelativePath : `./${servicesRelativePath}`,
            corePath: coreRelativePath.startsWith('../') ? coreRelativePath : `./${coreRelativePath}`,
        })
    );
}
