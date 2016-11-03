---
title: The REST API
layout: article
---

<div class="ui positive message">
<p>The REST API is expressed as a <a href="/swagger.json">Swagger specification 
file</a>, which can be used to generate a simple Bridge REST client in a wide 
variety of languages. See <a href="http://swagger.io/">Swagger</a> for more 
information.</p>

<ul>
    <li>
        <a href="/swagger-ui/index.html" target="_blank">API Browser</a> - 
            view the URLs of the API
    </li>
    <li>
        <a href="/model-browser.html">Model Browser</a> - 
            view the payloads (JSON) sent back and forth in the API
    </li>
</ul>
</div>

The Bridge service API can be accessed at [https://webservices.sagebridge.org](https://webservices.sagebridge.org). Sessions are always scoped to a specific study, and any call that creates a session (or operates without one, such as a request to reset a password), will require the study identifier be provided as part of the JSON payload.

Once credentials are submitted to the sign in URL, the system will return a JSON message with a session token. This session token should be added as a header to every subsequent HTTP request, using the header value Bridge-Session.

If you have not signed in, all services will return a 401 (forbidden) error response.

If the user has not agreed to participate in research, services will return a 412 (precondition not met) error response, until the consent API has been used to consent to research.

If the version of the app making a request has a lower app version than the version supported by your study, services will return 410 (service gone) to indicate the application is obsolete and must be updated.

Timestamps are expressed in ISO 8601 format (e.g. 2011-12-03T22:11:34.554Z), using the extended notation, to represent dates, dates and times, or times (separate from a specific day or time zone).

In the JSON objects described here, the server will always include a "type" property with a unique type value for that kind of object. However, these type properties never need to be submitted back to the server, as the server can deduce the JSON object's type from the API endpoint. Example JSON messages in the documentation show this type property, and including it in your JSON back to the server is harmless.

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

## Roles

There are some [roles](/#Role) that you must be assigned on the server in order to use many of the administrative APIs on Bridge.