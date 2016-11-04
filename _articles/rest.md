---
title: The REST API
layout: article
---

<div class="ui positive message">
<p>The REST API is expressed as a <a href="/swagger.json">Swagger specification 
file</a>, which can be used to generate a simple Bridge REST client in a wide 
variety of languages. See <a href="http://swagger.io/">Swagger</a> for more 
information.</p>

<dl>
    <dt><a href="/swagger-ui/index.html" target="_blank">API Browser</a></dt>
    <dd>View the URLs of the API</dd>

    <dt><a href="/model-browser.html">Model Browser</a></dt>
    <dd>View the payloads (JSON) sent back and forth in the API</dd>
</dl>
</div>

<div id="toc"></div>

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

## Deprecation of services

Service endpoints are versioned independently, e.g. there may be one up-to-date service available at `/v1/**`, while another up-to-date service is available at `/v2/*`. All HTTP verbs will work against that version of the endpoint.

We currently consider "sub-path" endpoints to be separate endpoints. For example `/v1/api/consent` and `/v1/api/consent/email` are considered separate endpoints and versioned separately.

When an endpoint has been deprecated (it is planned for removal at a future date), the responses from that endpoint will include a `Bridge-Api-Status` header with the value of `deprecated`. At a future time, that endpoint may return 410, Gone, and will no longer be functional. Please look for an alternative service in the API, and contact us if necessary to find a suitable service to which to migrate.

## Server Responses and Errors

|HTTP status code|Error type|Message|
|---|---|---|
|200||*variable*|
|201||"&lt;entityTypeName&gt; created."|
|400|BadRequestException|*variable*|
|400|PublishedSurveyException|A published survey cannot be updated or deleted (only closed).|
|400|InvalidEntityException|*variable based on fields that are invalid*|
|401|NotAuthenticatedException|Not signed in|
|403|UnauthorizedException|Caller does not have permission to access this service.|
|404|EntityNotFoundException|&lt;entityTypeName&gt; not found.|
|409|EntityAlreadyExistsException|&lt;entityTypeName&gt; already exists.|
|409|ConcurrentModificationException|&lt;entityTypeName&gt; has the wrong version number; it may have been saved in the background.|
|410|UnsupportedVersionException|"This app version is not supported. Please update." The app has sent a valid User-Agent header and the server has determined that the app's version is out-of-date and no longer supported by the configuration of the study on the server. The user should be prompted to update the application before using it further. Data will not be accepted by the server and schedule, activities, surveys, etc. will not be returned to this app until it sends a later version number.|
|412|ConsentRequiredException|Consent is required before signing in. This exception is returned with a JSON payload that includes the user's session. The user is considered signed in at this point, but unable to use any service endpoint that requires consent to participate in the study.|
|423|BridgeServerException|"Account disabled, please contact user support"|
|500|BridgeServerException|*variable*|
|503|ServiceUnavailableException|*variable|

If a response returns no JSON payload, it will normally return a message, and this includes error responses:

```json
{"message":"Not signed in."}
```

These messages are not localized. They are somewhat suitable for display to users, but mostly present as an aid to API developers.

Invalid entities return more complex errors with an "errors" property that breaks down the issues by field (the field key can be a nested set of properties into the object structure). For example, an invalid survey:

```json
{   
   "message":"Survey is invalid: element1.identifier is required",
   "errors":{   
      "element1.identifier":[   
         "element1.identifier is required"
      ]
   }
}
```

The first element of the survey is missing an identifier (which is required).