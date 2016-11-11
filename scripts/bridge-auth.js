function getSessionToken(form) {
    try {
        var body = {
            study: form.studyId.value,
            email: form.email.value,
            password: form.password.value
        };
        if (!body.study || !body.email || !body.password) {
            alert("All values are required to sign into the Bridge server.");
            return;
        }
        alert(JSON.stringify(body));
        $.ajax({
            type: 'POST',
            url: "https://webservices.sagebridge.org/v3/auth/signIn",
            data: JSON.stringify(body),
            contentType: "application/json",
            headers: { 'Content-Type': 'application/json' },
            dataType: "json"
        }).then(function (response) {
            window.sessionToken = response.sessionToken;
            var apiKeyAuth = new SwaggerClient.ApiKeyAuthorization("Bridge-Session", response.sessionToken, "header");
            swaggerUi.api.clientAuthorizations.add("BridgeSecurity", apiKeyAuth);
            // There are these little warning buttons that allow you to sign in because I don't
            // know how to tell swagger-ui you have authenticated.
            $(form).html("<h3>Session: "+response.sessionToken+"</h3>");
            $(".authorize-wrapper_operation").remove();
            alert("Signed in. Authenticated sample calls should work");
        }).fail(function (response) {
            var payload = JSON.parse(response.responseText);
            alert(payload.message);
        });
    } catch (e) {
        console.error(e);
    }
}
