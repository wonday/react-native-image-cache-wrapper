/**
 * Copyright (c) 2018-present, Wonday (@wonday.org)
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    Image,
    ImageBackground,
    Platform,
} from 'react-native';

import RNFetchBlob from 'react-native-fetch-blob';

const SHA1 = require('crypto-js/sha1');

const defaultImageTypes = ['png', 'jpeg', 'jpg', 'gif', 'bmp', 'tiff', 'tif'];
const cacheDir = RNFetchBlob.fs.dirs.CacheDir + "/CachedImage/";

export default class CachedImage extends Component {

    static defaultProps = {
        expiration: 86400 * 7, // default cache a week
        activityIndicator: null, // default not show an activity indicator
    };

    /**
     * delete a cache file
     * @param url
     */
    static deleteCache = url => {
        const cacheFile = _getCacheFilename(url);
        return RNFetchBlob.fs.unlink(cacheFile);
    };

    /**
     * clear all cache files
     */
    static clearCache = () => RNFetchBlob.fs.unlink(cacheDir);

    /**
     * Same as ReactNaive.Image.getSize only it will not download the image if it has a cached version
     * @param url
     * @param success callback (width,height)=>{}
     * @param failure callback (error:string)=>{}
     */
    static getSize = (url: string, success: Function, failure: Function) => {

        CachedImage.prefetch(url, 0,
            (cacheFile) => {
                if (Platform.OS === 'android') {
                    url = "file://" + cacheFile;
                } else {
                    url = cacheFile;
                }
                Image.getSize(url, success, failure);
            },
            (error) => {
                Image.getSize(url, success, failure);
            });

    };

    /**
     * prefech an image
     *
     * @param url
     * @param expiration if zero or not set, no expiration
     * @param success callback (cacheFile:string)=>{}
     * @param failure callback (error:string)=>{}
     */
    static prefetch = (url: string, expiration: number, success: Function, failure: Function) => {

        // source invalidate
        if (!url || url.toString() !== url) {
            failure && failure("no url.");
            return;
        }

        const cacheFile = _getCacheFilename(url);

        RNFetchBlob.fs.stat(cacheFile)
            .then((stats) => {
                // if exist and not expired then use it.
                if (!Boolean(expiration) || (expiration * 1000 + stats.lastModified) > (new Date().getTime())) {
                    success && success(cacheFile);
                } else {
                    _saveCacheFile(url, success, failure);
                }
            })
            .catch((error) => {
                // not exist
                _saveCacheFile(url, success, failure);
            });
    };

    constructor(props) {

        super(props);
        this.state = {
            source: null,
        };

        this._useDefaultSource = false;
        this._downloading = false;
        this._mounted = false;
    }

    componentDidMount() {
        this._mounted = true;
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    render() {

        if (this.props.source && this.props.source.uri) {
            if (!this.state.source && !this._downloading) {
                this._downloading = true;
                CachedImage.prefetch(this.props.source.uri,
                    this.props.expiration,
                    (cacheFile) => {
                        setTimeout(() => {
                            if (this._mounted) {
                                this.setState({source: {uri: "file://" + cacheFile}});
                            }
                            this._downloading = false;
                        }, 0);
                    }, (error) => {
                        // cache failed use original source
                        if (this._mounted) {
                            this.setState({source: this.props.source});
                        }
                        this._downloading = false;
                    });
            }
        } else {
            this.state.source = this.props.source;
        }

        let children = (this.state.source) ? this.props.children : (
            <View {...this.props} style={this.props.style ? [this.props.style, {
                alignItems: 'center',
                justifyContent: 'center'
            }] : {alignItems: 'center', justifyContent: 'center'}}>
                {this.props.activityIndicator}
            </View>);

        const renderImage = (props, children) => (children ? <ImageBackground {...props}>{children}</ImageBackground> :
            <Image {...props}/>);

        const result = renderImage({
            ...this.props,
            source: this.state.source,
            onError: (error) => {
                // error happened, delete cache
                if (this.props.source && this.props.source.uri) {
                    CachedImage.deleteCache(this.props.source.uri);
                }
                if (this.props.onError) {
                    this.props.onError(error);
                } else {
                    if (!this._useDefaultSource && this.props.defaultSource) {
                        this._useDefaultSource = true;
                        setTimeout(() => {
                            this.setState({source: this.props.defaultSource});
                        }, 0);
                    }
                }
            }
        }, children);

        return (result);
    }
}

/**
 * make a cache filename
 * @param url
 * @returns {string}
 */
function _getCacheFilename(url) {

    if (!url || url.toString() !== url) return "";

    let ext = url.replace(/.+\./, "").toLowerCase();
    if (defaultImageTypes.indexOf(ext) === -1) ext = "png";
    let hash = SHA1(url);
    return cacheDir + hash + "." + ext;
}

/**
 * save a url or base64 data to local file
 *
 *
 * @param url
 * @param success callback (cacheFile:string)=>{}
 * @param failure callback (error:string)=>{}
 */
async function _saveCacheFile(url: string, success: Function, failure: Function) {

    try {
        const isNetwork = !!(url && url.match(/^https?:\/\//));
        const isBase64 = !!(url && url.match(/^data:/));
        const cacheFile = _getCacheFilename(url);

        if (isNetwork) {
            const tempCacheFile = cacheFile + '.tmp';
            await RNFetchBlob.fs.unlink(tempCacheFile);
            RNFetchBlob.config({
                // response data will be saved to this path if it has access right.
                path: tempCacheFile,
            })
                .fetch(
                    'GET',
                    url
                )
                .then(async (res) => {
                    let {status} = res.respInfo;

                    switch (status) {
                        case 200: /* OK */
                        case 204: /* No content */
                        case 304: /* Not modified */
                        {
                            await RNFetchBlob.fs.unlink(cacheFile);
                            RNFetchBlob.fs
                                .mv(tempCacheFile, cacheFile)
                                .then(() => {
                                    success && success(cacheFile);
                                })
                                .catch(async (error) => {
                                    failure && failure(error);
                                });
                            break;
                        }
                        default:
                            await RNFetchBlob.fs.unlink(tempCacheFile);
                            failure && failure("status code:" + status);
                            break;
                    }

                })
                .catch(async (error) => {
                    await RNFetchBlob.fs.unlink(tempCacheFile);
                    failure && failure(error);
                });
        } else if (isBase64) {
            let data = url.replace(/data:/i, '');
            RNFetchBlob.fs
                .writeFile(cacheFile, data, 'base64')
                .then(() => {
                    success && success(cacheFile);
                })
                .catch(async (error) => {
                    await RNFetchBlob.fs.unlink(cacheFile);
                    failure && failure(error);
                });
        } else {
            failure && failure("not support url");
        }
    } catch (error) {
        failure && failure(error);
    }
}