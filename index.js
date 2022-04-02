function handler(event) {
    // NOTE: This example function is for a viewer request event trigger. 
    // Choose viewer request for event trigger when you associate this function with a distribution.
    var request = event.request;
    var cookies = request.cookies;
    var auth = request.headers.authorization && request.headers.authorization.value;
    var eventType = event.context.eventType;
    
    var unauthorisedResponse = {
        statusCode: 401,
        statusDescription: 'Unauthorized',
        headers: {
            'www-authenticate': { value: 'Basic' }
        }
    }
    
    if(eventType === 'viewer-request') {
        if(Object.keys(cookies).length == 0) {
            if(!auth){
                return unauthorisedResponse;
            } else {
                // username = 'admin', password = 'pwd$%#$'
                var key = 'Basic YWRtaW46cHdkJCUjJA==';
                if(auth === key) {
                    request.headers['x-custom-header'] = { value: 'true' };
                    return request;
                } else {
                    return unauthorisedResponse;
                }
            }
        } 
        else if(cookies && cookies.user && cookies.user.value == 'admin') {
            return request;
        }
        return unauthorisedResponse;
    } else if (eventType === 'viewer-response') {
        var response = event.response;
        if(request.headers['x-custom-header'] && request.headers['x-custom-header'].value == 'true') {
            response.cookies['user'] = {
                value: "admin",
                attributes: "Secure; Path=/; Domain=cloudfront.net; Max-Age=300"
            }
            delete request.headers['x-custom-header'];
        }
        return response;
    }
}
