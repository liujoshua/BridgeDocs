---
title: Login Monitoring Policy and Procedures
layout: article
security: true
---

Cloud services that comprise pieces of the Bridge Server infrastructure should generate logs of authentication requests for administrative access to these systems, and provide monitoring and review for abnormal log-in attempts. An example anomaly is repeated failed log in attempts that could indicate a brute force attack on an account, or successful log-ins occurring at unexpected times or from unexpected locations. These log files must be maintained in a secure environment that prevents engineers with administrative access to Bridge services from modifying the logs. Each distinct subsystem/set of services used by Bridge Server much have a defined process for monitoring logins appropriate for the level of risk associated with the data managed by the sub-system.

## Stormpath

The Stormpath sub-system contains user account data, and provides authentication for access to other Bridge services. Stormpath contains encrypted participant emails, organized by study, and other participant PII and the mapping to the participant's Health code, both of which are encrypted by Bridge Server using a key restricted to the Bridge Server AWS account. Thus a breach of this system by itself is a moderate severity event, in which the emails / identities of participants in a Bridge study could be obtained and the attacker could interfere with the functioning of the system. A high security event would be the breach of both Stormpath and the Bridge AWS account, allowing recovery of identifiable health data records.

Stormpath has agreed to provide to Mike Kellen (Director of Technology Services) a weekly email generated from Stormpath logs which contains records of successful and unsuccessful log in attempts.

|url|AuthC|IP|Requester|tenant_uid|status|method|timestamp|
|---|---|---|---|---|---|---|---|
|https://enterprise.stormpath.io/login|t|140.107.180.85|alx.dark@sagebase.org|5xY3mkWKsN4EDhwoKeYHFd|200|POST|2015-11-20 21:34:40.70|
|https://enterprise.stormpath.io/login|t|174.21.207.141|alx.dark@sagebase.org|5xY3mkWKsN4EDhwoKeYHFd|200|POST|2015-11-24 00:30:47.90|
|https://enterprise.stormpath.io/login|t|73.225.222.97|dwayne.jeng@sagebase.org|5xY3mkWKsN4EDhwoKeYHFd|200|POST|2015-11-24 23:36:16.90|
|https://enterprise.stormpath.io/login|t|73.225.222.97|dwayne.jeng@sagebase.org|5xY3mkWKsN4EDhwoKeYHFd|200|POST|2015-11-25 00:44:56.20|

The raw logs are maintained by Stormpath, and not accessible to any Sage employee, preventing tampering. Mike will scan these records on a weekly basis to look for anomalous activity that may constitute an attack on our Stormpath service. 

## Amazon Web Services - Bridge Server

AWS contains raw data files uploaded from Bridge study apps (stored in S3) as well study data linked to participant health code. It also contains the keys for encrypting PII sent to Bridge, including the mapping between Health Code and identity. A breach by itself would be a moderate security event in which the attacker could obtain the study data, including that of participants who did not elect to share their data broadly. However, the attacker would need to also breach Stormpath to link that data to an individual's identity.

The Bridge Server AWS account has been configured with [AWS Cloudtrail](https://aws.amazon.com/cloudtrail/) to store records of all access to the Bridge Server AWS account in a S3 bucket. Access to this data is restricted to Mike Kellen and Xavier Schildwachter. [SumoLogic](https://www.sumologic.com/) has been installed and configured to read this data, and provide a user-facing dashboard and report of administrative access to Bridge Server data stores in AWS. Mike and/or Xavier will review this report weekly to scan for anomalous activity that could indicate a breach or attempted breach of AWS-hosted PII. This tool also has strong ad-hoc query capabilities that allow more detailed follow up to items identified in the dashboards. Access logs are retained by this service on a rolling 30 day period.

## Alerts

Alerts are configured for the following conditions:

* Unusually high number of total API calls
* Unusually high number of total API calls / user
* Unusually high number of authentication failures
* Unusual variation in number of distinct users / day

Here 'unusually high' is an outlier (> x stddev from mean over sliding window).

Also, daily digests are sent on the following (run once a day):

* Any accessDenied/Unauthorized in last 24hrs 
* Any failure to login at console in last 24hrs

Mike and Xa will review these alarms and add / remove alerts or change thresholds as needed.

## Amazon Web Services - Synapse

Coded study data is aggregated and returned to researchers though Synapse, another set of services and tools provided by Sage Bionetworks. Synapse and Bridge are maintained in different AWS accounts dedicated to each purpose. There is no ability to recover any PHI given administrative access to the Synapse AWS account. Login monitoring is currently not enabled for Synapse, but will be once the approach to monitoring AWS for Bridge Server has been fully implemented and is stable. 