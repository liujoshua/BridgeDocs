---
title: Key Management
layout: article
security: true
---

Currently, there is one master key for "account ID" encryption.  It is passed to the server application via an environment variable.  There is one key pair per study for health data encryption.  The key pairs are stored encrypted (256-AES-GCM) in AWS S3, in a bucket dedicated for this purpose.  Access to this bucket is limited by AWS IAM security policies to only the Sage Bridge server technical team.  Key pairs are loaded by the server application at runtime from the S3 buckets.  All server components are in accounts which are isolated from all other work at Sage Bionetworks, and access is limited to the Bridge technical team.  Furthermore, production / staging accounts are separated from development instances, allowing further limitation of access to production data.

# Future Extensions

In the future, we would like to shift key management to [AWS Key Management Solution](http://aws.amazon.com/kms/). This would aid in ensuring policies like key rotation were consistently implemented and enforced. However, it is an open question of this sort of solution can be made to work with Heroku, or if it would require shifting the business logic tier to an AWS solution such as Elastic Beanstalk.