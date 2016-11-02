---
title: REST Java Client
layout: article
---

<div class="ui positive message">

<p>We currently have a Java-based REST client (v{{site.data.versions.java_sdk}}): </p>

<ul>
    <li><a class="item" href="/rest-client/{{site.data.versions.java_sdk}}/apidocs/index.html">REST client API docs</a></li>
    <li><a class="item" href="https://github.com/Sage-Bionetworks/BridgeJavaSDK">GitHub</a></li>
</ul>
</div>

## Installing the REST client (Maven)

Add the Sage Bionetworks repository and the REST client to your <code>pom.xml</code>:

``` xml
<dependencies>
    <dependency>
    <groupId>org.sagebionetworks</groupId>
    <artifactId>rest-client</artifactId>
    <version>{{site.data.versions.java_sdk}}</version>
    </dependency>
</dependencies>
...
<repositories>
    <repository>
        <id>org-sagebridge-repo-maven-releases</id>
        <name>org-sagebridge-repo-maven-releases</name>
        <url>http://repo-maven.sagebridge.org/</url>
    </repository>
</repositories>
```

If you don't have an account to start, you can create one (if you do not have a study, you will have to contact Sage Bionetworks to create one):

``` java
SignUp signUp = new SignUp()
    .study("my-study-id")
    .email("email@email.com")
    .password("password");

ClientManager manager = new ClientManager.build();
AuthenticationApi authApi = manager.getClient(AuthenticationApi.class);
authApi.signUp(signUp).execute();

// check your email and verify your email address

// Now you can sign in, although ClientManager will do this automatically
SignIn signIn = new SignIn()
    .study("my-study-id")
    .email("email@email.com")
    .password("password");
UserSessionInfo session = authApi.signIn(signIn).execute().body();
```

## Configuration

If you use the `ClientManager` class to manage access to the server, you should create a `bridge-sdk.properties` file in your user home directory (`~/bridge-sdk.properites` on Mac OSX and Linux):

``` java
study.identifier = yourStudyIdentifier
account.email = email@address.com
account.password = yourPassword
```

Now you can use the credentials without embedding them in your program:

``` java
// The first time you connect to the server, we will sign you in.
Config config = new Config();
ClientManager manager = new ClientManager.withConfig(config).build();

// Will sign you in any time you do not have a session.
ForConsentedUsersApi usersApi = manager.getClient(ForConsentedUsersApi.class);
ScheduledActivityList scheduledActivities = usersApi
    .getScheduledActivities("+00:00", 4, 0).execute().body();
```

The server can tailor behavior for your app based on its version. But you must send this information to the server in the `User-Agent` header of requests. This is represented by the `ClientInfo` class, which can be provided to the `ClientManager`: 

``` java
ClientInfo info = new ClientInfo();
info.setAppName("HealthStudyApp");
info.setAppVersion(12);
info.setDeviceName("Google Plexus");
info.setOsName("Android"); // or "iPhone OS"
info.setOsVersion("10.0.2");

ClientManager manager = new ClientManager
    .withClientInfo(info)
    .withClientConfig(config).build();
```

See the [`ClientInfo`](/#ClientInfo) object for further details.

## Using the client

The available Api clients are documented in the javadocs for the REST client. You can create them 
using the `ClientManager` (as shown above).

Finally you may wish to sign out when you are done:

``` java
AuthenticationApi authApi = manager.getClient(AuthenticationApi.class);
authApi.signout(new EmptyPayload()).execute();
```

