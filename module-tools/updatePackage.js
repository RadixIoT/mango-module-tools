/*
 * Copyright (C) 2023 Radix IoT LLC. All rights reserved.
 */

const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const readPackage = require('./readPackage');

module.exports = function updatePackage(pom, directory = path.resolve('.'), writeFile = false) {
    const packageJsonPath = path.join(directory, 'package.json');

    return readPackage(directory).then(packageJson => {
        const originalPackageJson = _.cloneDeep(packageJson);

        if (packageJson.com_radixiot == null) {
            packageJson.com_radixiot = {};
        }

        packageJson.com_radixiot.moduleName = pom.project.name[0];
        packageJson.name = '@radixiot/' + _.kebabCase(pom.project.name[0]);
        // version tag may not be present or may contain a property
        if (pom.project.version && !pom.project.version[0].includes('${')) {
            packageJson.version = pom.project.version[0];
        }
        packageJson.description = pom.project.description[0];
        packageJson.main = `web/angular/${pom.project.name[0]}.js`;

        if (!writeFile || _.isEqual(packageJson, originalPackageJson)) {
            return Promise.resolve(packageJson);
        }

        return new Promise((resolve, reject) => {
            const newContents = JSON.stringify(packageJson, null, 2);
            fs.writeFile(packageJsonPath, newContents, error => {
                if (error) {
                    reject(error);
                } else {
                    resolve(packageJson);
                }
            });
        });
    });
};
