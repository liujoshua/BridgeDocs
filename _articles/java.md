---
title: Android &amp; Java Support
layout: article
---

We currently have a REST API SDK in Java to support Android application development. However, it is a general purpose Java library for accessing the Bridge REST API. It  may be used in any Java program that supports Java 7 or later, including Android applications.

## Installing the SDK (Maven)

Add the Sage Bionetworks repository and the SDK to your <code>pom.xml</code>:

    <dependencies>
        <dependency>
            <groupId>org.sagebionetworks.bridge</groupId>
            <artifactId>java-sdk</artifactId>
            <version>{{site.data.versions.java_sdk}}</version>
        </dependency>
    </dependencies>
    ...
    <repositories>
        <repository>
            <id>sagebionetworks-releases-local</id>
            <url>http://sagebionetworks.artifactoryonline.
                com/sagebionetworks/libs-releases-local</url>
        </repository>
    </repositories>

If you don't have an account to start, you can create one (if you do not have a study, you will have to contact Sage Bionetworks to create one):

``` java
SignUpCredentials signUp = new SignUpCredentials(
    "studyIdentifier", "username", "email", "password");
ClientProvider.signUp(signUp);

// check your email and verify your email address

// Now you can sign in
SignInCredentials signIn = new SignInCredentials(
    "studyIdentifier", "username", "password");
Session session = ClientProvider.signIn(config.getAccountCredentials());
```

## Configuration

Once you have an account, you can create a `bridge-sdk.properties` file in your user home directory (`~/bridge-sdk.properites` on Mac OSX and Linux):

``` java
study.identifier = yourStudyIdentifier
account.email = email@address.com
account.password = yourPassword
```

Now you can use the credentials without embedding them in your program:

``` java
Config config = ClientProvider.getConfig();
Session session = ClientProvider.signIn(config.getAccountCredentials());
```

The server can tailor behavior for your app based on its version. But you must send this information to the server in the `User-Agent` header of requests. It's important to configure this correctly before the first release of your app, because once released the app cannot be changed. You will then lose the ability to tailor content (or even access) to an app based on its version. 

In your code during initialization, you configure the user agent using the `ClientInfo` object:

``` java
ClientProvider.getClientInfo()
    .withAppName("My App Name") // same across platforms
    .withAppVersion(1)
    .withDevice("HTC Legend");
```

See the `ClientInfo` object for further details.

## Using the SDK

Once you have created an account and signed in, you can use the session to get a client tailored to your specific permissions in the API:

``` java
// Client for normal participant activities like submitting data or 
// retrieving activities
UserClient client = session.getUserClient();

// Client for developing a study or mobile application
DeveloperClient client = session.getDeveloperClient();

// Client for researchers who have access to participant information 
// but cannot edit studies
DeveloperClient client = session.getResearcherClient();

// Client for Bridge administrators 
AdminClient client = session.getAdminClient();
```

Each of these clients is documented in this API documentation. 
  
Finally you may wish to sign out when you are done:

``` java
session.signOut();
```

**The clients share configuration state.** You must create separate clients if you 
wish to have multiple threads accessing the API concurrently, but all threads will depend on shared mutable configuration state.
