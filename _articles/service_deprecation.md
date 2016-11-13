---
title: Deprecation of services
layout: article
---

Service endpoints are versioned independently, e.g. there may be one up-to-date service available at `/v1/*`, while another up-to-date service is available at `/v2/*`. All HTTP verbs will work against that version of the endpoint.

We currently consider "sub-path" endpoints to be separate endpoints. For example `/v1/api/consent` and `/v1/api/consent/email` are considered separate endpoints and versioned separately.

When an endpoint has been deprecated (it is planned for removal at a future date), the responses from that endpoint will include a `Bridge-Api-Status` header with the value of `deprecated`. At a future time, that endpoint may return 410, Gone, and will no longer be functional. Please look for an alternative service in the API, and contact us if necessary to find a suitable service to which to migrate.
