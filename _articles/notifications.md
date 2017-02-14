---
title: Push Notifications
layout: article
---

<div id="toc"></div>

Bridge provides support to send push notifications to individual participants, or to groups of participants interested in specific [notification topics](/#NotificationTopic). Your client application registers for notifications, and subscribes to the topics the user is interested in. Later when a researcher sends a notification, we use a topic's [Criteria](/#Criteria) to send the notification only to those users who meet the criteria.

## Configuring Notifications

Mobile operating system providers (Apple and Google) provide push notification services (APNS and GCM, respectively). Each service must be configured separately for your study, and then Bridge must be updated with some key information to send push notifications to your app. This configuration is the same regardless of how you use push notifications through Bridge, and only needs to be set up one time.

Bridge engineers will work with your app developers to configure Bridge to send push notifications through the Bridge Study Manager. 

## Registering for Notifications

After a user consents to receive push notifications via the mobile operating system, the system will notify your application and provide a unique *device identifier* (APNS calls this the *device token*, and GCM calls this the *registrationId*). 

Your app should [send this device identifier](/swagger-ui/index.html#!/_For_Consented_Users/createNotificationRegistration) to Bridge in order to register for notifications. Bridge returns a registration GUID which you can use to [update the device identifier at a later time](/swagger-ui/index.html#!/_For_Consented_Users/updateNotificationRegistration), as well as to subscribe to notification topics (see below).

It is possible to [retrieve a list of device registrations for a participant](/swagger-ui/index.html#!/_For_Consented_Users/getNotificationRegistrations) (if the participant installs your app on multiple devices. there will be more than one).

Some notification services, like APNS, suggest that this device identifier can change over the lifetime of your app's installation. Follow the advice of your push notification provider. Bridge allows the registration to be updated at any time.

Once registered, you will be able to [send a push notification to an individual user](/swagger-ui/index.html#!/_For_Researchers/sendNotificationToParticipant) on the registered device. In the Bridge Study Manager, find an individual user, and navigate to their *Push Notifications* tab. If they have a registration, they can receive a notification.

<div class="ui message">
    <div class="ui header">Example</div>

    <p>A study has asked participants to provide genetic history in a survey. If the user qualifies, the study would like to offer a free DNA testing kit to the participant. In this context, it would be appropriate to contact the participant directly, either through email or through a notification for a free offer of the kit.</p>
</div>

## Notification Topics

To send notifications to more than one user, you must [create some *notification topics*](/swagger-ui/index.html#!/_For_Developers/createNotificationTopic).

Under *Push Notifications* in the Bridge Study Manager, developers can create one or more topics. We strongly suggest you create a general topic to apply to all users, but you may create as many additional topics as you need. Apps then subscribe to one or more topics in order to [receive topic notifications](/swagger-ui/index.html#!/_For_Researchers/sendNotificationToTopic).

Topic notifications can be sent from the Bridge Study Manager by navigating to the topic under *Push Notifications*.

### Subscription options

Your app must then [subscribe to any topic for which that user will receive notifications](/swagger-ui/index.html#!/_For_Consented_Users/subscribeToTopics). The topic GUIDs can be hard-coded in your application, but it is more advisable to [retrieve them from the server](/swagger-ui/index.html#!/_For_Consented_Users/getTopicSubscriptions) or from the user's session, which also contains the list of [SubscriptionStatus](/#SubscriptionStatus) records. 

**Users can subscribe to a topic even if they do not meet the criteria. If at a later time, they meet the criteria, they will receive notifications for that topic.**

If a device is unregistered with Bridge, all topic subscriptions are deleted as well.

Client developers can adopt one of two approaches to these subscriptions.

#### Option #1: Subscribe to all topics and let the server route notifications

When the user gives permission to receive remote notifications, register their device with Bridge and subscribe to all notification topics. 

In order for a user to receive a notification, they must meet the criteria defined for the topic. The user disables all notifications by deleting their registration with the Bridge server. They cannot manipulate individual topics separately. This is the simplest and most straightforward way to implement notifications.

<div class="ui message">
    <div class="ui header">Example</div>
    <p>In a bilingual study, you could create a "General English" topic requiring the user's language to be "en" and "General Spanish" topic requiring the user's language to be "es".

    <p>Your app could use subscribe the user to both topics. When sending notifications, your research manager would send an English message to the English channel and a Spanish message to the Spanish channel. Depending on the user's chosen language, they would receive one of the two notifications, in their chosen language.

    <p>The advantage of this approach is that if the participant ever changes their language, they would immediately begin receiving the notifications in that language.
</div>

#### Option #2: Subscribe only to the topics chosen by the user

When the user gives permission to receive remote notifications, register their device and set up some default topic subscriptions (see below). In your app, present the list of topics to the user as a set of preferences to receive different types of notifications, so the user can turn notifications on or off for each topic. 

These subscriptions are persisted with the server. In order for a user to receive a notification, they must have subscribed to the topic, *and* they must meet any criteria defined for the topic. 

During the first time onboarding experience, you can choose one of several defaults:

* enable all notification types (subscribe the user to all topics to start); 
* disable all notification types (do not subscribe the user to any topic, though this may be confusing since they just gave consent to receive notifications); or 
* present the user with the topics and allow them to selectively subscribe to some notifications (the most complex onboarding option since it requires some additional UI).

<div class="ui message">
    <div class="ui header">Example</div>

    <p>To engage users, a study plans to send notifications on a variety of topics: when a new survey or article appears in the application; when the study reaches the target number of active users; when the study produces a new report on the participant's data; when a new version of the app is released; and other potential topics may be added later.

    <p>It is appropriate to break these notifications up into different topics, and allow the user to subscribe only to the notifications they are interested in. Too many notifications will encourage the participant to turn off notifications or delete the app.

    <p>Note that if a new topic is added later, no user will initially be subscribed to it. You will need to subscribe them in an app update, or notify users through a general topic channel that there is a new kind of notification available to them.
</div>

### Filtering Topic Notifications

As previously mentioned, each topic has an optional set of [Criteria](/#Criteria) associated with it. If criteria are present, only those subscribed devices where the user meets the criteria will receive the notification.

Filtering occurs on top of subscriptions, so when using criteria to filter, for a participant to receive a topic notification, they must have: 

1. registered their device for notifications; 
2. subscribed to the topic in question; and 
3. they must match the criteria assigned to the topic.

## Push Notification Content

The content of a push notification is defined by the [NotificationMessage](/#NotificationMessage) object. It is currently very simple, but will be augmented over time.