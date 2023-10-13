/*
 * Copyright (C) 2023 Radix IoT LLC. All rights reserved.
 */

const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
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
                                    insert: function (style) {
                                        const meta = document.querySelector('meta[name="user-styles-after-here"]');
                                        meta.parentNode.insertBefore(style, meta);
                                    },
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
                        use: [{
                            loader: 'file-loader',
                            options: {
                                name: 'images/[name].[ext]?v=[hash]',
                                esModule: false
                            }
                        }]
                    },
                    {
                        test: /\.(woff|woff2|eot|ttf|otf)$/,
                        use: [{
                            loader: 'file-loader',
                            options: {
                                name: 'fonts/[name].[ext]?v=[hash]',
                                esModule: false
                            }
                        }]
                    },
                    {
                        test: /\.(txt|csv)$/,
                        use: [{
                            loader: 'raw-loader'
                        }]
                    }
                ]
            },
            optimization: {
                splitChunks: false
            },
            plugins: [
                new CleanWebpackPlugin({
                    cleanStaleWebpackAssets: false
                }),
                new CopyWebpackPlugin([{
                    context: 'web-src/static',
                    from: '**/*'
                }])
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
