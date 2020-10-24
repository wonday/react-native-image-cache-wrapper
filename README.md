# react-native-image-cache-wrapper - Strange error fixed version - Алдаа зассан хувилбар
[![npm](https://img.shields.io/npm/v/react-native-image-cache-wrapper.svg?style=flat-square)](https://www.npmjs.com/package/react-native-image-cache-wrapper)

The best react native image cache wrapper.

### Feature

* the same usage with ```<Image/>``` and ```<ImageBackground/>```
* can set activity indicator
* cache images with expiration
* clear one cache or all cache files
* support getSize() and prefetch()
* support cache base64 data to local

### Installation
We use [`rn-fetch-blob`](https://github.com/joltup/rn-fetch-blob) to handle file system access in this package,
So you should install react-native-image-cache-wrapper and rn-fetch-blob both.

```bash
npm install react-native-image-cache-wrapper --save

npm install rn-fetch-blob --save
react-native link rn-fetch-blob
```
or use yarn

```
yarn add react-native-image-cache-wrapper
yarn add rn-fetch-blob
```
*Notice: if you use RN 0.60+, please use rn-fetch-blob v0.10.16*


### ChangeLog

v1.0.7

1. fix Strange error

v1.0.6

1. add static method ```CachedImage.isUrlCached(url,success=(cachFile)=>void,fail=(error)=>void))```
2. add static method ```CachedImage.getCacheFilename(url)```
3. add static property ```CachedImage.cacheDir```, user can use to set customized cacheDir

v1.0.5

1. fix for RN 0.59

v1.0.4

1. fix Content-Length check

v1.0.3

1. fix file successfully download check

v1.0.2

1. use rn-fetch-blob instead of react-native-fetch-blob

v1.0.0

1. initial release

[[more]](https://github.com/wonday/react-native-image-cache-wrapper/releases)


### Configuration

| Property      | Type          | Default          | Description         | FirstRelease |
| ------------- |:-------------:|:----------------:| ------------------- | ------------ |
| ```<Image/>``` or ```<ImageBackground>``` properties        |         |     | same with ```<Image/>``` and ```<ImageBackground/>``` | 1.0 |
| expiration    | number        | 604800           | expiration seconds (0:no expiration, default cache a week) | 1.0 |
| activityIndicator | Component | null | when loading show it as an indicator, you can use your component| 1.0 |
| retry | Object | {count: 3, interval: 100} | when multiple parallel requests are made for the same uri only the first remote fetch is made, the remaining requests will read from cache. If the remote request has not completed then cache checks for subsequent requests will occur using this retry config. Count is the number of times to try. Interval is the time to wait between each retry. If the first (original) remote request fails then all requests will fail (your app may retry, e.g., provide user interction for refresh) | 1.0.8 |

### Usage

```
import CachedImage from 'react-native-image-cache-wrapper';

render()
{
    return (

            <View>
                <CachedImage source={{uri:"https://assets-cdn.github.com/images/modules/logos_page/Octocat.png"}}/>
                <CachedImage source={{uri:"https://assets-cdn.github.com/images/modules/logos_page/Octocat.png"}}/>
                    <Text>This is example with image background.</Text>
                </CachedImage>
            </View>
        );
}
```

### Static Function

**CachedImage.getSize(url, success=(width,height)=>void,fail=(error)=>void,retry={retryConfig})**

Get the image size, if no cache, will cache it.

Example:
```
import CachedImage from 'react-native-image-cache-wrapper';

CachedImage.getSize("https://assets-cdn.github.com/images/modules/logos_page/Octocat.png", 
    (width,height)=>{
        console.log("width:"+width+" height:"+height);
    },(error)=>{
        console.log("error:"+error);
    });
```

**CachedImage.prefetch(url,expiration=0,success=(cachFile)=>void,fail=(error)=>void,retry={retryConfig})**

prefetch an image and cache it.

Example:
```
import CachedImage from 'react-native-image-cache-wrapper';

// prefetch and cache image 3600 seconds
CachedImage.prefetch("https://assets-cdn.github.com/images/modules/logos_page/Octocat.png", 3600, 
    (cacheFile)=>{
        console.log("cache filename:"+cacheFile);
    },(error)=>{
        console.log("error:"+error);
    });
```

**CachedImage.deleteCache(url)**

delete a cache file.

Example:
```
import CachedImage from 'react-native-image-cache-wrapper';

// prefetch and cache image 3600 seconds
CachedImage.deleteCache("https://assets-cdn.github.com/images/modules/logos_page/Octocat.png");
```

**CachedImage.clearCache()**

clear all cache.

Example:
```
import CachedImage from 'react-native-image-cache-wrapper';

// prefetch and cache image 3600 seconds
CachedImage.clearCache();
```

**CachedImage.isUrlCached(url,success=(cachFile)=>void,fail=(error)=>void))**

check if a url is cached.

Example:
```
import CachedImage from 'react-native-image-cache-wrapper';

// check if a url is cached.
CachedImage.isUrlCached(url,(exists)=>{
    alert(exists);
});
```

**CachedImage.getCacheFilename(url)**

make a cache filename.

Example:
```
import CachedImage from 'react-native-image-cache-wrapper';

// check if a url is cached.
let cachedFilename = CachedImage.getCacheFilename(url);
```

**CachedImage.cacheDir**

the property that can get/set cacheDir

Example:
```
import CachedImage from 'react-native-image-cache-wrapper';

// check if a url is cached.
CachedImage.cacheDir = RNFetchBlob.fs.dirs.CacheDir + "/CachedImage/";
```






