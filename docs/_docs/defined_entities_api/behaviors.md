---
layout: default
title:  "Behaviors"
category: Defined Entities API
catOrder: 4
iconShape: objects
hasMore: true
order: 5
permalink: /docs/defined_entities_api/behaviors
---

# Defined Interface Behaviors

## Overview
Behaviors are operations that can be invoked on defined entitites. The invocation of behaviors applies only to their existence on a defined entity. The association of a behavior with an interface or with a defined entity type is not an executable construct. 

## Types of Behavior Executions
There are a few different types of behavior executions:
- [WebHook behaviors](#webhook-behaviors) - provide webHook functionality in the context of VCD
- MQTT behaviors - send messages to an extension MQTT topic
- VRO behaviors - execute VRO workflows imported in VCD

## Behavior definition
All types of behavior execution have a common definition structure:

```json
{
	"description": "behavior description",
    "name": "behavior name",
    "execution": {
             "type": "...",
             "execution_properties": {}
    }
}
```
The behavior execution type is set in the ```type``` field of the ```execution```.

### Special execution properties
There are some special properties which can be set in the behavior definition ```execution``` or ```execution_properties```. 

- fields with prefix ```_internal_``` - field is write-only – once it is set it cannot be obtained through a GET request on the behavior. The field value is saved encrypted in the DB. It is only accessible to Cloud Director (i.e. the shared secret in webHook behaviors). These fields work on top level in the behavior ```execution``` or ```execution_properties```.
```json
 "execution": {
         "type": "...",
         "_internal_key": "...",
         "execution_properties": {
             "_internal_key_1": "..."
         }
}
```
- fields with prefix ```_secure_``` - field is write-only - once it is set it cannot be obtained through a GET request on the behavior. The field value is saved encrypted in the DB. However, this field is accessible to behavior executors. This means a different thing in the context of different types of behaviors (i.e. these fields are accessible to the webHook behaviors' template). These fields work on top level in the behavior ```execution``` or ```execution_properties```.
```json
 "execution": {
         "type": "...",
         "_secure_key": "...",
         "execution_properties": {
             "_secure_key_1": "..."
         }
}
```
- ```execution_properties``` - this field contains some special properties used to configure the behavior execution:
    - ```actAsToken``` - ```boolean``` (default is ```false```) – set to true if you want to include a Cloud Director act-as token in the behavior invocation arguments (depending on the type of behavior you may want to receive the act-as token in order to make additional API calls to VCD). The token invalidates when the behavior execution completes (the behavior invocation task is completed). The token is created on behalf of the user who invokes the behavior.

## Invoking behaviors
Since behaviors only exist in the context of defined interfaces and are only executable in the context of defined entities, you need to do some initital work before executing a behavior:

1. Create a defined interface
    ```http
    POST https://{api_host}/cloudapi/1.0.0/interfaces

    {
        "name": "test_interface",
        "version": "1.0.0",
        "vendor": "vmware",
        "nss": "test_interface",
        "readonly": false
    }
    ```
2. Add behaviors to created interface
    ```http
    POST https://{api_host}/cloudapi/1.0.0/interfaces/{interface_id}/behaviors

    {
    	"description": "behavior description",
        "name": "test_behavior",
        "execution": {
                 "type": "...",
                 "execution_properties": {}
        }
    }
    ```
3. Create a defined entity type
    ```http
    POST https://{api_host}/cloudapi/1.0.0/entityTypes

    {
       "vendor":"vmware",
       "name":"test_type",
       "nss":"test_type",
       "version":"1.0.0",
       "interfaces": ["urn:vcloud:interface:vmware:test_interface:1.0.0"],
    	"schema": {
    		"type": "object", 
            "properties": {
                "a": {
                    "type": "string"
                }
            }
    		}
    	}
    }
    ```
4. Set behavior access controls
    ```http
    POST https://{api_host}/cloudapi/1.0.0/entityTypes/{entity_type_id}/behaviorAccessControls

    {
    	"accessLevelId": "urn:vcloud:accessLevel:ReadOnly",
    	"behaviorId": "urn:vcloud:behavior-interface:test_behavior:vmware:test_interface:1.0.0"
    }
    ```
5. Create and resolve defined entity
    ```http
    POST 
    https://{api_host}/cloudapi/1.0.0/entityTypes/{entity_type_id}

    {
       "name":"test_entity",
       "entity":{
          "a": "abc"
       }
    }
    ```

    ```http
    POST https://{api_host}/cloudapi/1.0.0/entities/{entity_id}/resolve
    ```
6. Invoke behavior
    ```http
    POST https://{api_host}/cloudapi/1.0.0/entities/{entity_id}/behaviors/{behavior_id}/invocations

    {
        "arguments": {
            "x": 7,
            "y": 9
        },
        "metadata": {}
    }
    ```
    Behavior invocation is a long running process associated with a task. The above API call returns a task in the response ```Location``` header. The result of the execution can be found in the task ```result``` field once it is completed.

    ```http
    GET https://{api_host}/api/task/{task_id}
    ```

    ```http
    Response:
    ...
    "result": {
            "resultContent": "ok",
            "resultReference": null
        }
    ...
    ```
## WebHook behaviors
### Getting started
In short, webHook behaviors send a POST request to a webHook server and after receiving the server response, update the behavior invocation task accordingly. The payload sent to the webHook server is configurable.

In order to invoke webHook behaviors you need a webHook server to receive requests from Cloud Director. To begin with, we will be using [webhooks.site](https://webhook.site){:target="_blank"} which is an online tool for testing webHooks. With webhooks.site you get a random URL which you can use as a webHook server URL. You can edit the response sent back from webhooks.site to each request. For now, set it to:
       
```http
Content-Type: text/plain
Response body: "ok"
```
### Create and invoke a simple WebHook behavior

#### WebHook behavior definition
```json
{
    "name": "webhookBehavior",
    "execution": {
             "type": "WebHook",
             "id": "testWebHook",
             "href": "https://hooks.slack.com:443/services/T07UZFN0N/B01EW5NC42D/rfjhHCGIwzuzQFrpPZiuLkIX" ,
             "_internal_key": "secretKey"
    }
}
```
#### Invoke behavior and GET result

```http
POST https://{api_host}/cloudapi/1.0.0/entities/{entity_id}/behaviors/{behavior_id}/invocations

{
    "arguments": {
        "x": 7,
        "y": 9
    },
    "metadata": {}
}
```

In webhook.site you can examine what is the payload and the headers of the request received from Cloud Director.

```http
GET https://{api_host}/api/task/{task_id}
```

```http
Response:
...
"result": {
        "resultContent": "ok", //this is what we configured the webhook.site to return in the response body
        "resultReference": null
    }
...
```
### WebHook request payload (Cloud Director -> WebHook server)

As you have seen from the previous example, the default payload sent to webHook servers is a JSON containing information about the actual behavior invocation (behavior information, entity information and some metadata). However, you can also customize this payload by setting a template in the behavior definition. [FreeMarker template engine](https://freemarker.apache.org/docs/dgui_quickstart_template.html){:target="_blank"} is used to render the payload from the provided template and the data model. 

#### **The data model** 

The data model represents all the data that was prepared for the template or in other words all the data which can be included in the payload. As far as the template author is concerned, the data-model is a tree-like structure and can be visualized as:

```json
+ - entityId //id of the invoked defined entity
|
+ - typeId //id of the entity type of the invoked defined entity
|   
+ - arguments // the arguments passed in the behavior invocation
|  
+ - arguments_string //a json format string of arguments, can be used if the user wants to add all the arguments to the payload
|
+ - _execution_properties // can select all the values from execution_properties by key name
|                      
+ - _metadata
|   |
|   + - executionId
|   + - behaviorId
|   + - executionType
|   + - taskId
|   + - execution // can select all the values from execution by key name
|   |   |
|   |   + - href
|   + - invocation // can select all the values from invocation by key name
|   + - invocationId
	|   + - requestId
|   + - apiVersion
|  
+ -  entity //a map of the entity, can select all values in entity by key name
|
+ - entity_string  //a json format string of entity

```
#### **The template**
More details on how to build a template can be found in the [FreeMarker documentation](https://freemarker.apache.org/docs/dgui_quickstart_template.html){:target="_blank"}. In short, the way to evaluate a key from the data model is wrapping the key in ```${…}```, for example ```${_metadata.execution.href}``` is the way to get the href value from the execution. An example template is:

```json
{"text": "Behavior with id ${_metadata.behaviorId} was executed on entity with id ${entityId}"}
```
#### **Setting custom request headers** 
If you need to set certain headers in the webHook request, you can do that again by using the template. Each header can be set as a variable in the template with the prefix ```header_```. Examples:

```
<#assign header_Content\-Type = "application/json" />

<#assign header_Authorization = "${_execution_properties._secure_token}" />
```
- Example behavior definition with custom payload and headers

```json
{
    "name": "test-behavior",
    "execution": {
             "type": "WebHook",
             "id": "testWebHook",
             "href": "https://webhook.site/45b2d281-9de8-4eec-b7cc-a67529ec4be4" ,
             "_internal_key": "secretKey",
             "execution_properties": {
                 "template": {
                    "content": "<#assign header_Authorization = \"${_execution_properties._secure_token}\" />{\"text\": \"Behavior with id ${_metadata.behaviorId} was executed on entity with id ${entityId}\"   }"
                 },
                 "_secure_token": "secureToken"
             }      
    }
}
```

### WebHook response payload (WebHook server -> Cloud Director)

There are three possible response formats for the webHook server to send back to Cloud Director. Each one is processed differently by Cloud Director. The above examples both use the simple response format.
#### Simple response 

Sets the behavior invocation task result only

- Success response - the behavior invocation task status is set to ```SUCCESS``` and the response body is used as the task result

```http
Status code: 200
Content-Type:  text/plain //or none

...some string...
```

- Error response - the behavior invocation task status is set to ```ERROR```
    - response code ```!=``` 200

#### Task update response (one time task update) 
Allows for updating not only the behavior invocation task ```result```, but also task ```status```, ```details```, ```operation```, ```error```, ```progress```. The payload must represent a valid ```JSON``` representation of a ```TaskType``` with the task properties that need to be modified.
- Success response

```http
Status code: 200
Content-Type:  application/vnd.vmware.vcloud.task+json

{
    "status": "success",
    "details": "example details",
    "operation": "example operation",
    "progress": 100,
    "result": {
        "resultContent": "example result"
    }
}
```

- Error response

```http
Status code: 200
Content-Type:  application/vnd.vmware.vcloud.task+json

{
    "status": "error",
    "details": "example details",
    "operation": "example operation",
    "progress": 50,
    "error": {
        "majorErrorCode": 404,
        "minorErrorCode":"ERROR",
        "message": "example error message"
    }
}
```

#### Continuous task update response 
Allows for sending multiple task updates before completing the behavior invocation task. This is done by using ```HTTP multipart response```. Each update is a separate body part of the response body. The last body part of the response body must complete the task. If it does not, the task is completed with error with an error message indicating that the task should have been completed but was not.
- Example response

```http
Status code: 200
Content-Type: multipart/form-data; boundary=<boundary_string>
--<boundary_string>
Content-Type: application/vnd.vmware.vcloud.task+json
{                                                       
    "details": "example details",                      
    "operation": "example operation",
    "progress": 50
}
--<boundary_string>
Content-Type: application/vnd.vmware.vcloud.task+json
{
    "status": "success",
    "progress": 100,
    "result": {
        "resultContent": "example result"
    }
}
--<boundary_string>
```

There is a new line after each boundary string, ```Content-Type``` header and body. The body parts of the response can be either represent a simple response or a task update response. The last body part of the webhook server response body must complete the task. If it does not, the task is completed with error with an error message indicating that the task should have been completed but was not. Once a body part completes the behavior invocation task, all other body parts received after that are ignored.

### Authentication of webHook behavior requests

WebHook behavior requests are secured via HMAC authentication.

#### What is HMAC authentication?

**HMAC** (or hash-based message authentication code) is a mechanism used to ensure the authenticity and integrity of HTTP requests. This is achieved by including two custom headers to each HTTP request – signature header and digest (in our case ```x-vcloud-signature``` and ```x-vcloud-digest```). 

```http
x-vcloud-signature=[ algorithm="hmac-sha512", headers="host date (request-target) digest", signature="WjuxZuVgNXctRBuDLONeQ0NWXt+O36YL8wMdjhCGCeW7Fq8sMHfU6NCS0O6STJx2z/wRkHTjzil4GAfuho9ZUw=="]

x-vcloud-digest=[SHA-512=Yt4eiT2VmUyX8wDt6wneZ10VRk1B1H2jmHP1R7YanI9hykEAjUdtg7JzxfioBQm/iWRRNBM8B0aJnw6Jd29Jqg==]
```

#### Some terms

- Shared secret - this a string which is only known to Cloud Director and the webHook server (```_internal_key```). This shared secret will be used to generate the signature header
- Signature header (```x-vcloud-signature```) - This is a custom header sent with each webHook request. It consists of three parts:
    - algorithm (```hmac-sha512```) - this is the algorithm used to generate the signature
    - headers (```host date (request-target) digest```) - this shows what is included in the base ```string``` which is signed to create the signature 
        - host - the webHook server host
        - date - date of the request
        - (reguest-target) = ```<http-method> + <ASCII space> + <path>``` (i.e. ```post /webhook```)
        - digest - ```sha-512``` digest of the request body
    - signature - this is the generated signature
- Digest header ('x-vcloud-digest') - this is a base64 encoded sha-512 digest of the request body
#### How are requests authenticated by the webhook server?

Each webHook request from VCD can be verified by generating the signature using the shared secret and comparing it to the signature in the signature header from VCD. If they match, the request is verified.
    
Example Java code for verifying a signature header:

```java
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
/**
 * Verifies an incoming webHook behavior request from VCD.
 */
public class HMACRequestVerificator {
    private static final String DIGEST_ALGORITHM = "hmac-sha512";
    private static final String HEADER_SIGNATURE = "x-vcloud-signature";
    private static final String HEADER_DATE = "date";
    private static final String SIGNATURE_PARAM_SIGNATURE = "signature";
    private static final String SIGNATURE_PARAM_ALGORITHM = "algorithm";
    private static final String SIGNATURE_PARAM_HEADERS = "headers";
    private static final String HEADERS_DATE = "date";
    private static final String HEADERS_HOST = "host";
    private static final String HEADERS_REQUEST_TARGET = "(request-target)";
    private static final String HEADERS_DIGEST = "digest";
    private static final Pattern HEADER_SIGNATURE_PATTERN = Pattern.compile("^algorithm=\".+\",headers=\".+\",signature=\".+\"$");
    private Map<String, List<String>> headers = null;
    private Map<String, String> signatureParams = null;
    private final String sharedSecret;
    private String host;
    private String path;
    private String payload;
    private static final ObjectMapper objectMapper = new ObjectMapper()
            .setSerializationInclusion(JsonInclude.Include.NON_NULL);
    /**
     * @param sharedSecret the shared secret which will be used to verify the signature from the VCD request headers.
     */
    public HMACRequestVerificator(String sharedSecret) {
        this.sharedSecret = sharedSecret;
    }
    /**
     * Provides the host and path of the webhook server.
     * @param webhookServerUrl URL of the webhook server endpoint
     * @return this {@link HMACRequestVerificator}
     */
    public HMACRequestVerificator withWebhookServerUrl(String webhookServerUrl) {
        Optional<URI> webhookServerUri = buildWebhookServerURI(webhookServerUrl);
        if (webhookServerUri.isPresent()) {
            URI uri = webhookServerUri.get();
            host = uri.getHost();
            path = uri.getPath();
        }
        return this;
    }
    /**
     * Provides the host and path of the webhook server.
     * @param host the host of the webhook server
     * @param path the path of the webhook server
     * @return this {@link HMACRequestVerificator}
     */
    public HMACRequestVerificator withWebhookServerHostAndPath(String host, String path) {
        this.host = host;
        this.path = path;
        return this;
    }
    /**
     * @param headers the headers of the incoming request from VCD
     * @return this {@link HMACRequestVerificator}
     */
    public HMACRequestVerificator withHeaders(Map<String, List<String>> headers) {
        this.headers = headers;
        return this;
    }
    /**
     * @param payload the payload of the incoming request from VCD
     * @return this {@link HMACRequestVerificator}
     */
    public HMACRequestVerificator withPayload(Object payload) {
        this.payload = serializePayload(payload);
        return this;
    }
    /**
     * Executes verification.
     * @return true if verification was successful and false otherwise
     */
    public boolean verify() {
        if (!checkParameters()) {
            return false;
        }
        String signatureFromServer = signatureParams.get(SIGNATURE_PARAM_SIGNATURE);
        Optional<String> signatureToVerify = buildSignatureToVerify(payload);
        return signatureToVerify.isPresent() && signatureFromServer.equals(signatureToVerify.get());
    }
    private boolean checkParameters() {
        return validateParameters() && validateHeaders();
    }
    private boolean validateParameters() {
        return sharedSecret != null && payload != null && host != null && path != null;
    }
    private boolean validateHeaders() {
        if (headers == null
                || !headers.containsKey(HEADERS_DATE)
                || !headers.containsKey(HEADER_SIGNATURE)) {
            return false;
        }
        String signatureHeader = headers.get(HEADER_SIGNATURE).get(0);
        Matcher matcher = HEADER_SIGNATURE_PATTERN.matcher(signatureHeader);
        if (!matcher.matches()) {
            return false;
        }
        signatureParams = extractSignatureParams(headers.get(HEADER_SIGNATURE).get(0));
        return signatureParams.containsKey(SIGNATURE_PARAM_SIGNATURE)
                && signatureParams.containsKey(SIGNATURE_PARAM_HEADERS)
                && signatureParams.containsKey(SIGNATURE_PARAM_ALGORITHM);
    }
    private Map<String, String> extractSignatureParams(String signatureHeader) {
        String [] signatureHeaders = signatureHeader.split(",");
        Map<String, String> result = new HashMap<>();
        for (String h : signatureHeaders) {
            String param = h.split("=")[0];
            String value = h.split("\"")[1];
            result.put(param.toLowerCase(), value);
        }
        return result;
    }
    private byte[] getDigest(String payload) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-512");
            digest.update(payload.getBytes());
            return digest.digest();
        } catch (NoSuchAlgorithmException e) {
            //should not happen
            throw new RuntimeException(e);
        }
    }
    private Optional<String> buildSignatureToVerify(String payload) {
        String signatureString = buildSignatureString(payload);
        if (signatureParams.get(SIGNATURE_PARAM_ALGORITHM).equalsIgnoreCase(DIGEST_ALGORITHM)) {
            return Optional.of(signDataSHA512HMAC(signatureString, sharedSecret));
        }
        return Optional.empty();
    }
    private String signDataSHA512HMAC(String data, String sharedSecret) {
        try {
            final byte[] byteKey = sharedSecret.getBytes(StandardCharsets.UTF_8);
            Mac sha512Hmac = Mac.getInstance("HmacSHA512");
            SecretKeySpec keySpec = new SecretKeySpec(byteKey, "HmacSHA512");
            sha512Hmac.init(keySpec);
            byte[] macData = sha512Hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return getBase64(macData);
        } catch (InvalidKeyException | NoSuchAlgorithmException e) {
            throw new RuntimeException(e.getMessage());
        }
    }
    private String buildSignatureString(String payload) {
        String[] headersInSignature = signatureParams.get(SIGNATURE_PARAM_HEADERS).split(" ");
        return Arrays.stream(headersInSignature)
                .map(headerInSignature -> buildSignatureStringHeaderParam(headerInSignature, payload))
                .filter(Objects::nonNull)
                .collect(Collectors.joining("\n"));
    }
    private String buildSignatureStringHeaderParam(String paramName, String payload) {
        if (paramName.equalsIgnoreCase(HEADERS_HOST)) {
            return "host: " + host;
        } else if (paramName.equalsIgnoreCase(HEADERS_DATE)) {
            return "date: " + getDate();
        } else if (paramName.equalsIgnoreCase(HEADERS_DIGEST)) {
            return "digest: SHA-512=" + getBase64(getDigest(payload));
        } else if (paramName.equalsIgnoreCase(HEADERS_REQUEST_TARGET)) {
            return "(request-target): post " + path;
        }
        return null;
    }
    private String getBase64(byte[] signature) {
        return Base64.getEncoder().encodeToString(signature);
    }
    private Optional<URI> buildWebhookServerURI(String webhookServerUrl) {
        try {
            return Optional.of(new URI(webhookServerUrl));
        } catch (URISyntaxException e) {
            return Optional.empty();
        }
    }
    private String getDate() {
        return headers.get(HEADER_DATE).get(0).split("\"")[0];
    }
    private String serializePayload(Object payload) {
        try {
            return objectMapper.writeValueAsString(payload);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
```