---
title: Policies and Principles for mHealth Studies
layout: article
---
Conducting a research study in human health comes with serious obligations and responsibilities to safeguard the rights of study participants.  Developers should be aware that the obligations of designing an appropriate and ethical medical study exceed those of most app development projects.  Bridge is designed to facilitate the development apps that adhere to these principles, but ultimate responsibility rests with the app developers and study’s Principal Investigators. 

## Formal ethical review is required to launch a mHealth study
All medical studies on human subjects must be reviewed by an Instititutional Review Board (IRB).  This is a legal and ethical obligation which is not optional.  Sage does not permit the use of Bridge in any study which has not undergone appropriate IRB review, and can assist with IRB filings for your study.

## Giving consent is a precondition to collecting user data

The Bridge API is set up such that no data can be uploaded by an app until the app makes a call to indicate the electronic-consent process has been completed by the user.  Once this occurs, data will be continuously uploaded by the app on the user's behalf as a background process on the client.  It is critical that app developers implement an appropriate informed consent process as part of the app onboarding process, and have this process formally reviewed by the study's IRB.  Templates for informed consent that have been successfully used in prior studies are included in our SDKs.

## Participants may access their own data

Sage believes that a user should always have the right to obtain the data that he or she provided to the study.  The Bridge API therefore allows any individual user to retrieve his or her own data from the server at least in principle.  In practice, for most participants access to their own data will depend on the support for data retrieval provided by their study's app. The current APIs are geared around providing support to a client.

## Researchers should only access coded study data for analysis

Periodically, bulk exports of deidentified study data are produced by Bridge server for each study, and posted on Sage's data sharing platform, Synapse.  Each study PI will have some control over the timing of data releases to Synapse, but we anticipate that new versions of datasets become available on the order of a few days to weeks, not in real time.

## Participants have the right to revoke and resume data sharing with the study

The server provides API calls allowing the user the ability to suspend or resume sharing data with investigators.  Suspending data sharing does not disable the account, but it does block user data from being included in any future data set exported from the study.  Participants may continue to use the app, and resume data sharing at a later date.

An administrative-only API call can be made by Bridge technical admins to permanently delete a user's account and all associated data from Bridge server if requested by a user.

Note, even after a Bridge account has been deleted, it is not possible to pull back data already distributed to researchers.  This fact is explained to users during the informed consent process which much be completed to enroll.

## Links to participant identity should not be retained after study completion

Bridge is not intended to be a long-term storage solution for mobile health studies.  At the end of a study, all data in the system for that study will be purged from the system.  Coded study data may be maintained as a researcher resource by Sage in our Synapse system, or managed by the study team.
