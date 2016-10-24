---
title: Study Design
layout: article
study_design: true
---

The Bridge server has a model for customizing the schedules, consents, and other information items that are returned from the server, based upon the individual participant. There are some specific criteria that can be used to filter server responses:

**The version of the application at the time of the request**<br>Through the use of our SDK, your application will send an HTTP header to Bridge that includes your application version. This can be used to filter content on the server.

**The data group tags assigned to a user**<br>DataGroup tags can be assigned to users to model any of a number of differences between users (anything short of information that would be identifying for an individual user, like an ID).

**The user's preferred language**<br>Information about the user's preferred language is sent in an HTTP header and saved as part of the user's profile. This language preference can be used to return localized content to a study participant.

**Important: filtering is "opt in". If these values are not sent in HTTP headers or set for the user, no filtering will occur.**

These criteria can be used to select:

* The specific consent(s) that a user receives based on the subpopulations they are assigned to;
* The schedules that are used to create tasks for a user (and thus, the surveys or tasks the user will be asked to do in the app);

Using these primitives, Bridge can model a few different use cases:  

**Study Cohorts**<br>Individuals can be tagged with a data group during enrollment, and your study can filter consents, schedules, surveys and tasks based upon these cohorts. Cohorts can include control groups, underage participants, and more.

**Test Users**<br>Test or beta users can be tagged with a data group. Records in Synapse are exported with the user’s data groups, so you can remove this test data from your final data set.

**Application releases**<br>You can hold back consent and scheduling changes by filtering them out of study content until a new app with a new version is downloaded by users. Test versions of the application, with the higher application version, can see these changes during your testing period.

**Localization**<br>Language differences can be used to return different consents, activities, and surveys to a user, or even change the study to meet different governance requirements for different locales.

## Initial Set-Up

In setting up the server for your study, you will:

* Create a subpopulation (or consent group) for each class of consent you have in your study, defining the criteria for inclusion in that subpopulation (you start with a default consent group that everyone is required to agree to). These consents can be optional or required;

* Update the study consents for your subpopulations to reflect your IRB-approved consent documents, publishing a version for each subpopulation when you are satisfied with your edits;

* Create surveys and define task identifiers for tasks that are done in your app, publishing survey versions when you are satisfied with your edits;

* Create upload schemas for data you will upload to the Bridge server (surveys have schemas automatically generated when they are published, so normally this will only include non-survey tasks like tapping tasks, gait tests, etc.). These do not need to be published, since you will reference a specific revision of the schema in your data uploads;

* Create schedule plans that include schedules for published surveys and task identifiers, filtered on the criteria described above, as needed;

Consents and surveys can be edited multiple times, and then a revision can be published when you have a final product. Surveys can have multiple published versions, but it is most commen to return the most recently published revision to users (the exact revision is recorded in the uploaded responses). 

Schemas are not published, but you always reference a specific revision of a schema in your application (it is "baked in" to your application code), so this is not necessary.

Schedules, email templates, and all other configuration settings are not versioned; they are immediately reflected in your study. **That includes subpopulation and schedule plan filtering criteria.**
