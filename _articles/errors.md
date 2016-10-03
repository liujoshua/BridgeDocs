---
title: Server Responses and Errors
layout: article
---

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