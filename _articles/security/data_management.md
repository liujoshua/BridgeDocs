---
title: Policies around management of participant data
layout: article
security: true
---

## Giving Consent is a Precondition to Collecting User Data

The Bridge API is set up such that no data can be uploaded by an app until the app makes a call to indicate the electronic-consent process has been completed by the user.  Once this occurs, data will be continuously uploaded by the app on the users behalf as a background process on the client.

## Participants may Access their own Data

Sage believes that a user should always have the right to obtain the data that he or she provided to the study.  The Bridge API therefore allows any individual user to retrieve his or her own data from the server at least in principle.  In practice, for most participants access to their own data will depend on the support for data retrieval provided by their study's app. The current APIs are geared around providing support to a client.

## Researcher access to Participant Data

Periodically, bulk exports of deidentified study data are produced by Bridge server for each study, and posted on Sage's data sharing platform, Synapse.  Each study PI will have some control over the timing of data releases to Synapse, but we anticipate that new versions of datasets become available on the order of a few days to weeks, not in real time.

## Administrative access to Bridge Server

Administrative access to Bridge Server cloud service providers is limited to the Director of Engineering (Currently Michael Kellen) and members of the Bridge Server Engineering team (Currently Eric Wu, Dwayne Jeng, and Alx Dark).  Access will be granted, revoked as members leave this team.  All individuals must access these systems through individual accounts.  Passwords must be at least 8 characters, and consist of a mix of at least 3 of these 4 character types: uppercase, lowercase, numeric, and special characters.  Passwords should not be shared across different services, and must be rotated at least annually.

All Bridge server work should use accounts dedicated for supporting test, staging, or production instances of Bridge server, and not support any other Sage projects.

Confidential PII should not be moved from Bridge Server infrastructure components and placed on any personal workstation, laptop, or portable media.

## Revoking/Resuming Data Sharing

The server provides API calls allowing the user the ability to suspend or resume sharing data with investigators.  Suspending data sharing does not disable the account, but it does block user data from being included in any future data set exported from the study.  Participants may continue to use the app, and resume data sharing at a later date.

An administrative-only API call can be made by Bridge technical admins to permanently delete a user's account and all associated data from Bridge server if requested by a user.

Note, even after a Bridge account has been deleted, it is not possible to pull back data already distributed to researchers.  This fact is explained to users during the informed consent process which much be completed to enroll.

## Retention after Study Completion

Bridge is not intended to be a long-term storage solution for mobile health studies.  At the end of a study, all data in the system for that study will be purged from the system.  Coded study data may be maintained as a researcher resource by Sage in our Synapse system, or managed by the study team.