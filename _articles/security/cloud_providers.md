---
title: Cloud Providers used by Bridge Server
layout: article
security: true
---

Coded study data are stored at rest in Bridge using Amazon Web Services (AWS). Amazon is the leader in cloud computing and provides world-class security, and supports solutions to comply with strict federal requirements including [the standards of HIPPA](http://aws.amazon.com/compliance/). AWS end-to-end security and end-to-end privacy measures ensure the confidentiality and integrity of the data. The physical measures for access security assumed by Amazon include burglar alarms and logical entry checks. All communication is encrypted via SSL using HTTPS, SSH, or SCP when transmitting data or commands to and from AWS. Once data is submitted, the AWS network fabric does not allow others to see any data traffic not intended for them, as most ports are firewalled for both ingress and egress. AWS credentials include username, password, access keys, and ssh keys. The Bridge server uses a combination of AWS Dynamo and S3 for storage. All actual health data is stored encrypted in S3; Dynamo contains only metadata used to locate particular health data records. This architecture is consistent with AWS guidelines for HIPPA-compliant apps, although Sage has not currently completed a formal 3rd party security certification process.

As described in [Management of user account data](/articles/security/account_management.html), user account information including Personally Identifying Information is stored separately in Stormpath, a cloud-hosted authentication as a service provider. Stormpath itself is hosted by Amazon.

Our app servers run in [Heroku](https://www.heroku.com/), a platform as a service provider which provides the ability to rapidly adjust server bandwidth to load. No data is stored in Heroku servers, and this tier communicates with the underlying storage layers in AWS and Stormpath, and with client applications via HTTPS.

As a caching layer, we use Redis from Redis Labs. Redis Labs is ultimately hosted by AWS. 