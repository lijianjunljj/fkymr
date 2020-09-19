const {ccclass, property} = cc._decorator;

@ccclass
export default class Httputils extends cc.Component {

    public static post(url, headers, params, callback) {
        var xhr = cc.loader.getXMLHttpRequest();

        // note: In Internet Explorer, the timeout property may be set only after calling the open()
        // method and before calling the send() method.
        xhr.timeout = 5000;// 5 seconds for timeout

        xhr.ontimeout = function(event)
        {
            console.log("请求超时了 url",url);
            callback(-1);
        };

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if(xhr.status >= 200 && xhr.status < 300) {
                    var response = xhr.responseText;
                    callback(JSON.parse(response));
                } else {
                    cc.log('xhr.readyState='+xhr.readyState+'  xhr.status='+xhr.status);
                    callback(-1);
                }                
            }
        };
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Accept", "application/json");
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }
        if(headers) {
            for(var header in headers) {
                xhr.setRequestHeader(header, headers[header]);
            }
        }
        
        xhr.send(JSON.stringify(params));
    }

    public static get(url, headers, callback) {
        var xhr = cc.loader.getXMLHttpRequest();
        // note: In Internet Explorer, the timeout property may be set only after calling the open()
        // method and before calling the send() method.
        xhr.timeout = 5000;// 5 seconds for timeout

        xhr.ontimeout = function(event)
        {
            console.log("请求超时了 url",url);
            callback(-1);
        };

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if(xhr.status >= 200 && xhr.status < 300) {
                    var response = xhr.responseText;
                    callback(JSON.parse(response));
                }
                else {
                    callback(-1);
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Accept", "application/json");
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }
        if(headers) {
            for(var header in headers) {
                xhr.setRequestHeader(header, headers[header]);
            }
        }
        
        
        xhr.send();
    }
}