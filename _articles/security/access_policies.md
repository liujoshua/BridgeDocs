---
title: Access Management Policies for Bridge Server Admins
layout: article
security: true
---

In accordance with the Risk Assessments undertaken by Sage Bionetworks and external auditors of Bridge, the team will take the following steps to control administrative access to the production instance of Bridge Server.

* Only individuals who directly report to the Director of Technology Services (Michael Kellen) may be granted administrative access to Bridge Server, or any of the technology services it depends on (AWS, Stormpath, Heroku). Access will be terminated promptly when an individual leaves this team. Currently, this group includes:
  * Alx Dark (Bridge Server Engineer)
  * Dwayne Jeng (Bridge Server Engineer)
  * Xavier Schildwachter (Sage Principle System Administrator)
  * Shannon Young (Bridge Server Engineer)

* All engineers with IAM access to the Bridge AWS account will enable 2 factor authentication on their accounts.
* Only the Director of Technology Services and Principle System Administrator will have the ability to create IAM accounts for the engineering team, and access to the AWS account credentials. 
* Unique passwords must be generated for the production Bridge Server account, and not shared with other accounts on other systems. Passwords for administrator accounts must be complex. Using a variant of the [Random Diceware](http://world.std.com/~reinhold/diceware.html) approach is recommended if a long passphrase can be generated from many words (See also [xkcd](https://xkcd.com/936/) on this). Alternatively, use at least 10 characters, including upper case, lower case, and a numeral or symbol.
* Passwords for all administrator accounts must be rotated quarterly.