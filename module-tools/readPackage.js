/*
 * Copyright (C) 2023 Radix IoT LLC. All rights reserved.
 */

const path = require('path');
const fs = require('fs');
const defaultPackageJson = require('./defaultPackage.json');

module.exports = function readPackage(directory = path.resolve('.')) {
    const packageJsonPath = path.join(directory, 'package.json');

    return new Promise((resolve, reject) => {
        fs.readFile(packageJsonPath, 'utf8', (error, data) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    resolve(defaultPackageJson);
                } else {
                    reject(error);
                }
            } else {
                resolve(data);
            }
        });
    }).then(packageJson => {
        return Promise.resolve(typeof packageJson === 'string' ?
            JSON.parse(packageJson) :
            packageJson);
    });
};
