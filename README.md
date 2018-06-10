# react-native-image-cache-wrapper
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
We use [`react-native-fetch-blob`](https://github.com/wkh237/react-native-fetch-blob#installation) to handle file system access in this package,
So you should install react-native-image-cache-wrapper and react-native-fetch-blob both.

```bash
npm install react-native-image-cache-wrapper --save

npm install react-native-fetch-blob --save
react-native link react-native-fetch-blob
```
or use yarn

```
yarn add react-native-image-cache-wrapper
yarn add react-native-fetch-blob
```

### ChangeLog

v1.0.0

1. initial release



### Configuration

| Property      | Type          | Default          | Description         | FirstRelease |
| ------------- |:-------------:|:----------------:| ------------------- | ------------ |
| ```<Image/>``` or ```<ImageBackground>``` properties        |         |     | same with ```<Image/>``` and ```<ImageBackground/>``` | 1.0 |
| expiration    | number        | 604800           | expiration seconds (0:no expiration, default cache a week) | 1.0 |
| activityIndicator | Component | null | when loading show it as an indicator, you can use your component| 1.0 |


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

**CachedImage.getSize(url, success=(width,height)=>void,fail=(error)=>void)**

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

**CachedImage.prefetch(url,expiration=0,success=(cachFile)=>void,fail=(error)=>void)**

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





