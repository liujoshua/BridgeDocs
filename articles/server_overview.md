---
title: Overview of the Bridge Server
layout: article
---

Sage Bionetworks’ Bridge Server is designed to securely manage data captured from IRB-approved human health research studies conducted through mobile technology platforms.  The server allows study participants to fully manage their individual health data while participating in app-mediated health research studies.  It also enables the aggregation, distribution and reuse of participant data for future research in accordance with best practices for data privacy and the protection of human subjects. Sage is architecting Bridge as an online service which may potentially be used by multiple mobile health studies and apps.  These studies may or may not have Sage personnel involved in the actual study.  Thus, a key aspect of the Bridge architecture is that personal contact information for study participants is stored completely separately and securely from the study data (e.g. height, body weight, blood pressures, heart rates, medications, voice recordings, survey answers).

![Personal Data Dashboard](/images/bridge_overview1.png)

The central organizing construct for Bridge data is a timeline; this organization facilitates the development of a personal dashboard for individuals to track their own disease history.  Data for a study is organized into modules, each one targeting different aspects of the symptoms or environmental factors associated with the condition being studies.

![](/images/bridge_overview2.png)

Researchers analyzing data collected by Bridge will focus on understanding populations for research purposes, rather than providing medical guidance to individuals.  A key function of the Bridge server is to facilitate the gathering of consistently structured data from population of participants.  Another key goal is that the studies are assumes to be dynamic.  Modules may be modified or added as a study progresses and researchers learn more.  

![](/images/bridge_overview3.png)

Ultimately, we should aim to support an ecosystem of apps designed for different studies, in which some modules may be shared among studies to capture data in consistent formats and speed development time.