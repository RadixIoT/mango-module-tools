/*
 * Copyright (C) 2023 Radix IoT LLC. All rights reserved.
 */

const camelCase = function(input, splitOn = '-') {
    return input.split(splitOn)
        .map((str, i) => {
            if (i > 0) {
                return str.charAt(0).toUpperCase() + str.slice(1)
            } else {
                return str;
            }
        })
        .join('');
};

const dashCase = function(input, splitOn = /(?=[A-Z])/) {
    return input.split(splitOn)
        .map((str, i) => {
            return str.toLowerCase();
        })
        .join('-');
};

const parseNumber = function(value) {
    return Number.parseInt(value, 10);
};

const parseBoolean = function(value) {
    return value.toLowerCase() === 'true';
};

const printHelp = function(optionsInfo) {
    const tableData = Object.entries(optionsInfo).map(([key, info]) => {
        return {
            argument: `--${dashCase(key)}`,
            type: info.type || 'string',
            description: info.description,
            required: info.required || false,
            'default': info.defaultValue
        };
    });
    console.table(tableData);
};

const parseArguments = function(args, optionsInfo) {
    const options = {};
    args.forEach(arg => {
        const matches = /^--(.*?)(?:=(.*))?$/.exec(arg);
        if (!matches) throw new Error(`Unknown argument ${arg}`);

        const [dashName, value] = matches.slice(1);
        const name = camelCase(dashName);

        const info = optionsInfo[name];
        if (!info) throw new Error(`Unknown option ${name}`);

        if (info.type === 'boolean') {
            if (value === undefined) {
                options[name] = true;
            } else {
                options[name] = parseBoolean(value);
            }
        } else if (info.type === 'number') {
            options[name] = parseNumber(value);
        } else if (info.type === 'regex') {
            options[name] = new RegExp(value, info.regexFlags);
        } else if (info.type === 'array') {
            const split = value.split(/\s*,\s*/);
            if (info.arrayType === 'boolean') {
                options[name] = split.map(parseBoolean);
            } else if (info.arrayType === 'number') {
                options[name] = split.map(parseNumber);
            } else {
                options[name] = split;
            }
        } else {
            options[name] = value || '';
        }
    });

    if (options.help) {
        printHelp(optionsInfo);
        process.exit(0);
    }

    Object.entries(optionsInfo).forEach(([name, info]) => {
        if (!options.hasOwnProperty(name)) {
            if (info.required) {
                throw new Error(`Option --${dashCase(name)} is required`);
            } else if (info.hasOwnProperty('defaultValue')) {
                options[name] = info.defaultValue;
            }
        }
    });

    return options;
};

module.exports = {parseArguments, dashCase, camelCase};
