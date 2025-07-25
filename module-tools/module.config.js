/*
 * Copyright (C) 2023 Radix IoT LLC. All rights reserved.
 */

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const readPackage = require('./readPackage');

module.exports = (configOptions = {}) => {
    const moduleRoot = configOptions.moduleRoot || path.resolve('.');
    return readPackage(moduleRoot).then(packageJson => {
        const moduleName = packageJson.com_radixiot.moduleName;
        return {
            entry: {
                [moduleName]: `./web-src/${moduleName}.js`
            },
            module: {
                rules: [
                    {
                        test: /\.html$/,
                        use: [{
                            loader: 'html-loader',
                            options: {}
                        }]
                    },
                    {
                        test: /\.css$/,
                        use: [
                            {
                                loader: 'style-loader',
                                options: {
                                    insert: 'meta[name="user-styles-after-here"]',
                                    injectType: 'singletonStyleTag'
                                }
                            },
                            {
                                loader: 'css-loader'
                            }
                        ]
                    },
                    {
                        test: /\.(png|svg|jpg|jpeg|gif)$/,
                        type: 'asset/resource',
                        generator: {
                            filename: 'images/[name].[ext]?v=[contenthash]'
                        }
                    },
                    {
                        test: /\.(woff|woff2|eot|ttf|otf)$/,
                        type: 'asset/resource',
                        generator: {
                            filename: 'fonts/[name].[ext]?v=[contenthash]'
                        }
                    },
                    {
                        test: /\.(txt|csv)$/,
                        type: 'asset/source'
                    }
                ]
            },
            optimization: {
                splitChunks: false
            },
            plugins: [
                new CopyWebpackPlugin({
                    patterns: [{
                        from: '**/*',
                        context: 'web-src/static',
                        noErrorOnMissing: true
                    }]
                })
            ],
            output: {
                filename: '[name].js?v=[chunkhash]',
                path: path.resolve('web', 'angular'),
                publicPath: `/modules/${moduleName}/web/angular/`,
                libraryTarget: 'umd',
                libraryExport: 'default',
                library: moduleName
            },
            externals: {
                'angular': 'angular',
                'cldrjs': 'cldrjs',
                'cldr-data': 'cldr-data',
                'file-saver': 'file-saver',
                'globalize': 'globalize',
                'ipaddr.js': 'ipaddr.js',
                'jquery': 'jquery',
                'js-sha512': 'sha512',
                'jszip': 'jszip',
                'mathjs': 'mathjs',
                'moment': 'moment',
                'moment-timezone': 'moment-timezone',
                'papaparse': 'papaparse',
                'pdfmake': 'pdfmake',
                'plotly.js': 'plotly.js',
                'stacktrace-js': 'stacktrace-js',
                'tinycolor2': 'tinycolor2',
                'xlsx': 'xlsx',
                'amcharts/amcharts': 'amcharts/amcharts',
                'amcharts/funnel': 'amcharts/funnel',
                'amcharts/gantt': 'amcharts/gantt',
                'amcharts/gauge': 'amcharts/gauge',
                'amcharts/pie': 'amcharts/pie',
                'amcharts/radar': 'amcharts/radar',
                'amcharts/serial': 'amcharts/serial',
                'amcharts/xy': 'amcharts/xy'
            }
        };
    });
};
