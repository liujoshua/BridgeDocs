---
title: Customizing Content for Participants
layout: article
---

<div id="toc"></div>

## Criteria

All fields in the criteria object are optional. If not provided, any value supplied by a participant is assumed to match. For example, if allOfGroups is an empty array, the participant can be assigned any data groups and they will match when using these criteria to select server objects. If no application versions are specified for the operating system given in the request User-Agent string, the object is returned. And so forth.

|Name|Type|Description|
|---|---|---|
|language|String|The object associated with these criteria should be returned to participants only if the participant has declared this language to be one of their preferred languages. Languages are declared by participants through the Accept-Language header of requests to the API (we save this language preference on the first request where it is sent to the server; thereafter it is retrieved as part of the participant's profile information, and can be changed through the profile and participant APIs).|
|minAppVersions|Object|This object is a map of operating system names, to the minimum app version declared for that system. For example, "iPhone OS" may be set to version 2, while "Android" might be set to version 10. Any operating system names can be used, but these two strings are expected for these two common mobile operating systems. The object associated with these criteria should be returned to participants only if the User-Agent header specifies an operating system and application version that are equal to or greater the version given for that operating system. Minimum and maximum values, when both specified, indicate a range of valid application version numbers. If no value for the operating system, there is no minimum required version.|
|maxAppVersions|Object|This object is a map of operating system names, to the minimum app version declared for that system. For example, "iPhone OS" may be set to version 2, while "Android" might be set to version 10. Any operating system names can be used, but these two strings are expected for these two common mobile operating systems. The object associated with these criteria should be returned to participants only if the User-Agent header specifies an operating system and application version that are equal to or less than the version given for that operating system. Minimum and maximum values, when both specified, indicate a range of valid application version numbers. If no value for the operating system, there is no maximum version after which the object would not be returned.|
|allofGroups|String[]|The object associated with these criteria should be returned to participants only if the user making the request has been assigned *ALL* of the data groups contained in this set (duplicate values in the array are removed). If the set is empty, there are no required data groups. Data groups must be defined on the study before they can be included in this set or assigned to participants, and the same data group cannot be in the allOfGroups and noneOfGroups sets at the same time|
|noneOfGroups|String[]|The object associated with these criteria should be returned to participants only if the user making the request has been assigned *NONE* of the data groups contained in this set (duplicate values in the array are removed). If the set is empty, there are no prohibited data groups. Data groups must be defined on the study before they can be included in this set or assigned to participants, and the same data group cannot be in the allOfGroups and noneOfGroups sets at the same time.|

### Example

Note: in this example the iOS application would only see the object if it was a version between 3-22, while an Android application would see the object if it was version 10 or greater (no upper limit).

```json
{ 
    "language": "en",
    "minAppVersions": {
        "iPhone OS": 3,
        "Android": 10
    },
    "maxAppVersions": {
        "iPhone OS": 22
    },
    "allOfGroups":["b","a"],
    "noneOfGroups":["c","d"]
}
```
## User Agent Header

The Bridge server allows study designers to filter resources by the version of the application making a request (schedules and scheduled activities can currently be filtered this way). In order for this to work, you must submit a User-Agent header in a specific format:

|Format Variants|Example|
|---|---|
|appName/appVersion|Share The Journey/22|
|appName/appVersion sdkName/sdkVersion|Asthma/14 BridgeJavaSDK/10|
|appName/appVersion (deviceName; osName/osVersion) sdkName/sdkVersion|Cardio Health/1 (Unknown iPhone; iPhone OS/9.0.2) BridgeSDK/4|

If the header is not in one of these prescribed formats, it will be ignored and all server resources will be returned. Note that it is possible to come up with partial combinations of these strings that confuse our parsing; be sure your UA string is in one of these formats.

The [Java REST client](/articles/java.html) provides APIs to set this header. 

Filtering is done on osName + appVersion (other kinds of filtering may be done at a later date).

## Accept-Language Header