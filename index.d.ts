/**
 * Copyright (c) 2018-present, Wonday (@wonday.org)
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from 'react';
import * as ReactNative from 'react-native';

interface Props {
    source: any,
    defaultSource?: any,
    style?: any,
    resizeMode?: string,
    expiration?: number,
    activityIndicator?: any,
    onLoad?: () => void,
    onError?: (error: object) => void,
}

declare class CachedImage extends React.Component<Props, any> {
}

export default CachedImage;
