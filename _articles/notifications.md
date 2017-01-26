---
title: Push Notifications
layout: article
---

Bridge provides support to send push notifications to individual participants, or to groups of participants interested in specific *topics.* Your client application registers for notifications, and subscribes to the topics the user is interested in. Later when a researcher sends a notification, we use a topic's [Criteria](/#Criteria) to filter out only those users who match that topic, allowing you to target the populations that are designed into your study configuration.

## Notifying individuals

Once a client app has registered with Bridge, researchers can use the Bridge Research Manager to send a push notification directly to a user. An example might be a notice to a user that they had qualified for a free genetic test as part of the study.

## Notifying groups of individuals

In addition, a developer can define any number of [topics](/#NotificationTopic) as part of the study's design. Push notifications can be sent through these topics to participants using the same [Criteria](/#Criteria) that are used to select consents and schedules. 

Your client app must specifically subscribe to these topics to indicate that the user has consented to receive these notifications. You might choose to make this process "opt-out" by subscribing the user to all topics if they agree to receive notifications. But your client app should provide the means to subscribe and unsubscribe to each topic individually as part of the application's settings.

Researchers can use the Bridge Research Manager to send a push notification to a group of users subscribed to a topic. If the topic has inclusion criteria, only those users who match the inclusion criteria will receive the notification. In short, a user must ask to receive a topic and qualify to receive a topic in order to receive push notifications for that topic.

## Push notification content

The content of a push notification is defined by the [NotificationMessage](/#NotificationMessage) object. It is currently very simple, but will be augmented over time.