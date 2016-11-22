---
title: Customizing Content for Participants
layout: article
---

<div id="toc"></div>

As described in [Study Design](/articles/study_design.html), study content can be tailored to users for the purpose of implementing features like app updates, localization, or study cohorts. 

On the server, [Subpopulations](/#Subpopulation) (consent groups) and [Schedules](/#SchedulePlan) can both be configured with the information in the [Criteria](/#Criteria) object. Clients can then send the `User-Agent` and `Accept-Language` headers, and along with data groups you assign to each participant, the server can filter the objects for a given user.

**Filtering is opt-in**: if a request doesn't include filtering information, everything is applied to that user.

Subpopulation filtering returns *all matches that apply,* because a user may have more than one applicable consent agreement they must agree to.

Criteria schedule plans return *the first applicable schedule.* The plan examines the criteria for each potential schedule, in order, until a match is found. It then uses that schedule to schedule tasks for the participant.

## On the server: Criteria

When creating server configuration, all fields in the criteria object are optional. If a field is not provided, then all participants are assumed to match on that criteria. 

For example, if `allOfGroups` is an empty array, the participant can be assigned any data groups and they will match when selecting server objects. If no `User-Agent` header is included with a request, no filtering will be done based on the version of the application. And so forth.

|Name|Type|Description|
|---|---|---|
|language|String|The object associated with these criteria should be returned to participants only if the participant has declared this language to be one of their preferred languages. Languages are declared by participants through the Accept-Language HTTP header (we save this language preference the first time it is sent; thereafter it is retrieved as part of the participant's profile information, and can be changed through the profile and participant APIs).|
|minAppVersions|Object|This object maps operating system names to a minimum app version. For example, "iPhone OS" may be set to version 2, while "Android" might be set to version 10. Any operating system names can be used, but these two strings are expected for these two common mobile operating systems. The object associated with these criteria should be returned to participants only if the User-Agent header specifies an application version that is equal to or greater the version given for that operating system. Minimum and maximum values, when both specified, indicate a range of valid application version numbers. If no value for the operating system, there is no minimum required version.|
|maxAppVersions|Object|This object maps operating system names to a maximum app version. For example, "iPhone OS" may be set to version 2, while "Android" might be set to version 10. Any operating system names can be used, but these two strings are expected for these two common mobile operating systems. The object associated with these criteria should be returned to participants only if the User-Agent header specifies an application version that is equal to or less than the version given for that operating system. Minimum and maximum values, when both specified, indicate a range of valid application version numbers. If no value for the operating system, there is no maximum required version.|
|allofGroups|String[]|The object associated with these criteria should be returned to participants only if the user making the request has been assigned *ALL* of the data groups contained in this set (duplicate values in the array are removed). If the set is empty, there are no required data groups. Data groups must be defined as part of the [Study](/#Study) object before they can be included in this set or assigned to participants, and the same data group cannot be in the allOfGroups and noneOfGroups sets at the same time|
|noneOfGroups|String[]|The object associated with these criteria should be returned to participants only if the user making the request has been assigned *NONE* of the data groups contained in this set (duplicate values in the array are removed). If the set is empty, there are no prohibited data groups. Data groups must be defined as part of the [Study](/#Study) object before they can be included in this set or assigned to participants, and the same data group cannot be in the allOfGroups and noneOfGroups sets at the same time.|

### Example

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

In this example the iOS application would only see the object if it was a version between 3-22, while an Android application would see the object if it was version 10 or greater (no upper limit). The user would have to have data groups "a" and "b", and could not have data groups "c" and "d". Finally, the user would need to declare English as an accepted language. 

## From the client

Features such as content filtering require the application to send some information to the server.

### User Agent Header

Applications should send their version information as part of a specially formatted `User-Agent` header. This header tells the server about the app, hardware and SDK being used to make the request. The app must submit one of the following formats:

|Format Variants|Example|
|---|---|
|appName/appVersion|Share The Journey/22|
|appName/appVersion sdkName/sdkVersion|Asthma/14 BridgeJavaSDK/10|
|appName/appVersion (deviceName; osName/osVersion) sdkName/sdkVersion|Cardio Health/1 (Unknown iPhone; iPhone OS/9.0.2) BridgeSDK/4|

If the header is not in one of these prescribed formats, it will be ignored and all server resources will be returned. Note that it is possible to come up with partial combinations of these strings that confuses our parsing; be sure your UA string is in one of these formats.

Application version filtering, both to lock old versions of your app out of the server and to filter content, is done on the combination of osName and appVersion.

The [Java REST client](/articles/java.html) provides APIs to set this header through the [ClientInfo](/#ClientInfo) object. 

### Accept-Language Header

The user's language preference is provided using the standard semantics of the HTTP `Accept-Language` header. Because study requirements can change significantly based on a user's language, Bridge saves these language preferences in the user's participant record and does not use different language preferences after that. 

The `Accept-Language` header value is typically captured and persisted during sign up (as long as the application sends it). If you wish to allow a user to change their language choice after enrolling, you will need to update the language using the user's participant record.

The participat record stores language preferences as an ordered list of two-letter language codes, from most desired to least desired (but still acceptable) language choice. For example, "en, fr" would indicate that the server should return English resources if they exist, or French otherwise. 

**Note that if the user's language match changes, this may infer a change in the governance jurisdiction of the user. This is why we will not change the language choice even if a user updates the language preferences on their device and starts sending a different `Accept-Language` header.**

### Data groups

Finally, data groups are string "tags" that are assigned to a participant's record using the participant record APIs. The server will also filter content based on the data groups of the participant making a request. They do not have to be sent with the request (the server knows them already). They can really represent anything about a group of users that you need to track through the Bridge server, for filtering or any other purpose. 

To prevent abuse of data groups, all possible data group strings must be defined beforehand as part of the [Study](/#Study) object.
