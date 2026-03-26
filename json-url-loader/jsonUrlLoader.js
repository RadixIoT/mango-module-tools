/*
 * Copyright (C) 2026 Radix IoT LLC. All rights reserved.
 */

const loaderUtils = require('loader-utils');
const jsonpointer = require('jsonpointer');

const defaultOptions = {
    parse: content => JSON.parse(content),
    serialize: content => JSON.stringify(content),
    publicPath: '',
    targets: data => []
};

const loadModule = function(request) {
    return new Promise((resolve, reject) => {
        this.loadModule(request, (error, source, sourceMap, module) => {
            if (error) {
                reject(error);
            } else {
                resolve({source, sourceMap, module});
            }
        });
    });
};

const transformUrl = function(value) {
    const request = loaderUtils.urlToRequest(value);
    return loadModule.call(this, request).then(({source, sourceMap, module}) => {
        const assets = module.buildInfo.assets;
        if (assets && Object.keys(assets).length) {
            const urls = Object.keys(assets);
            if (urls.length) {
                return urls[0];
            }
        }
        return Promise.reject('No assets');
    });
};

/**
 * JSON URL loader accepts a JSON object and transforms relative URLs contained in the JSON to public paths
 * with the Webpack hash etc. The properties to be transformed are specified by an array of JSON pointers returned
 * by the targets option. The files specified by the URLS must be handled by file-loader.
 */
const jsonUrlLoader = function(content, map, meta) {
    const callback = this.async();
    const options = Object.assign({}, defaultOptions, loaderUtils.getOptions(this));

    const parsed = options.parse(content);
    const targets = typeof options.targets === 'function' ? options.targets(parsed) : options.targets;

    const promises = targets.map(p => {
        const value = jsonpointer.get(parsed, p);
        if (loaderUtils.isUrlRequest(value)) {
            return transformUrl.call(this, value).then(newValue => {
                jsonpointer.set(parsed, options.publicPath + newValue);
            });
        }
    });

    Promise.all(promises).then(() => {
        const serialized = options.serialize(parsed);
        callback(null, serialized, map, meta);
    }, error => {
        callback(error);
    });
};

module.exports = jsonUrlLoader;
module.exports.raw = true;
