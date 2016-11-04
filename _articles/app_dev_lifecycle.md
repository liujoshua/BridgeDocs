---
title: Support for the app development lifecycle
layout: article
---

<div id="toc"></div>

After your first release, you will want to test changes while maintaining your production configuration. The Bridge server provides support through the process of developing and releasing software changes.

## Developing and testing 

**By setting application versions on server objects, you restrict new content to the next released version of your application.** 

The two key model objects that can be filtered are consent groups (subpopulations) and schedules. By setting the minimum app version for your platform (iOS or Android) to a level above the released version of your application, your developers and testers can see the new content, while participants will not.

For consent groups, the application version is set on the consent group itself (in the research manager, for either "iPhone OS" or for "Android").

For scheduling, a criteria-type schedule can tie each schedule in a list of schedules to a specific application version range. The first schedule that applies will be used to schedule a user, allowing you to deliver one schedule to production users and a different schedule to testers.

Through schedules, you can refer to different tasks or surveys to perform. 

Similarly, you can make changes to existing schemas that are backwards compatible with any schema revision you are already using in production (data will not be sent to a different Synapse table, though columns may be added in that table and some columns may no longer be populated with data):

|Action|Description|
|---|---|
|Add non-required schema field|Always safe. You can start sending this data with your next release but the existing app is not required to send it.|
|Add required schema field|Set the min app version for this field to the next release version of your application. The next release will see this field (and will be required to send it).|
|Remove schema field (required or not)|Set the max app version for this field to the current release version of your application. The next release will not see the field (and should not send that data).|
|Change the name of a field|This is like a remove and then an add. You may need to set a max version on the old field, and create a new field with a min app version, in order to avoid creating a new revision of the schema.|

## Release to production 

When you are ready, you release a new version of your app to the app store with a higher version number. As users download the app and requests start to include that version number, new app versions (and only new app versions) will see your changes during this transitional period.

The same process works for hiding content on a release: by setting the maximum version of an app that receives a consent group or schedule, and setting that value to the version that is currently in production, when you release a new app version, these objects will no longer be returned to users. 

## End-of-life for older app versions

It is not possible to force users to update their applications, so it is wise to leave older configuration for older app versions if at all possible. Over time, with subsequent revisions of operating systems and phone hardware, some users may even find they cannot update to newer versions of your app until they update their phone hardware.

However, when this is no longer tenable to maintain, you can adjust the minimum supported app version for your study, and app versions before this version will receive an error response from the server. The 410 HTTP response ("Gone") can be intercepted by your application and a message can be shown to the user that the app will no longer work until they upgrade. At this point, anything filtered only to those obsolete app versions can be deleted.

## Supporting studies without public registration

In some cases partners wish to register users without an email address. In these cases they typically assign a code of some kind that is entered into the app to register the phone. Participants are brought into the study outside of a public call for participation that involves downloading and registering through the app. In this case, 1) Sage Bionetworks has no information on participants, because 2) you assume full ownership of assigning the codes and tracking subjects in your study, including the re-identification of participants and contacting them further for any reason.

If this describes your study design, it's important to know how Bridge supports this set-up with a public API.

External IDs are first imported into the system. When a study is configured to manage these IDs, Bridge will not allow an account to be created without one, nor will it allow a code to be used more than once. Bridge exports the external ID to Synapse as part of every record collected. This allows you to identify which participant submitted the data (only you have the mapping between the external ID and the participant it represents).

We then create a set of credentials (a fake email address and password) using this code so your application can authenticate with the Bridge server. Bridge uses the following pattern: if you enter the code ASDF, the server uses your support email address to create an email address (support+ASDF@yourorganization.com) and the password is the code (ASDF). (The support email address is configurable through the API as well as the Bridge Study Manager; although Bridge uses your support email address, it will not send documents to that address). When a code is entered into the app, it uses these credentials to authenticate with the server.

We must do this because the Bridge API is public and without authentication, anyone could submit data to your study. **It is important that your codes are as secure as a reasonably secure password.** A site like [How Secure Is My Password?](https://howsecureismypassword.net/) can help choose a format for your codes.

In the Bridge Study Manager, the Lab Codes section of the application combines this process. You import one or more codes and it will create both the external ID and the credentials. 
