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

## Overview

The Bridge service API can be accessed at [https://webservices.sagebridge.org](https://webservices.sagebridge.org). 

Sessions are always scoped to a specific study, which is provided when a user signs in. Once credentials are submitted to the sign in URL, the system will return a JSON user session that includes a `sessionToken` property. That session token should be sent with all further requests to the Bridge server using the `Bridge-Session` HTTP header.

If you have not signed in, all services will return a 401 (forbidden) error response.

If the user has not agreed to participate in research, participant-facing services will return a 412 (precondition not met) error response, until the consent API has been used to consent to research. Note that a user can have a session but not be consented to participate in the research of the study. 

If the version of the app making a request has a lower app version than the version supported by your study, services will return 410 (service gone) to indicate the application is obsolete and must be updated. This minimum required application version can be set separately for Android and iOS applications. 

### Data formats

Timestamps are expressed in ISO 8601 format (e.g. 2011-12-03T22:11:34.554Z), using the extended notation, to represent dates, dates and times, or times (separate from a specific day or time zone).

JSON objects returned from the Bridge server will contain a `type` property with a unique type string for that kind of object. This may aid deserialization. However, these type properties do not need to be submitted back to the server (the Bridge server can deduce the JSON object's type from the API endpoint). Example JSON messages in the documentation show this type property, and including it in your JSON back to the server is harmless.

## Roles

Many endpoints will return a 403 error (Unauthorized) unless the caller is in one of several administrative [roles](/#Role) (see the REST model documentation). By far the most common role is the `developer` role which is required to access most of the configuration and reporting APIs.

## Deprecation of services

Service endpoints are versioned independently, e.g. there may be one up-to-date service available at `/v1/*`, while another up-to-date service is available at `/v2/*`. All HTTP verbs will work against that version of the endpoint.

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