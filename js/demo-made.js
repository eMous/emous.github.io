---
---
{% assign demos = site.demos %}
var demo_js = demo_js || (function () {
    var _args = {
        demo_base_url: "{{site.data.demoConf.demoBaseUrl}}",
        demo_data_arr : {
            {% for demo in site.data.demoConf.demos %}
                "{{demo.id}}" : {
                    "description": "{{ demo.description }}",
                    "date": "{{ demo.date | date_to_rfc822 }}",
                    "url":"{{ demo.url }}",
                    "categories": "{{ demo.categories }}",
                    "tags": "{{ demo.tags }}",
                    "trace_posts": {{ demo.trace_posts | jsonify }}
                }{% unless forloop.last %},{% endunless %}{% endfor %}
        },
        {% assign file_suffix = demos.file_suffix %}
        file_suffix : {
            ignore_cap:{% if file_suffix.ignore_cap != nil %}{{file_suffix.ignore_cap}}{% else %}true{% endif %},
            suffix_pattern:{% if file_suffix.suffix_pattern != nil %}{
                html:{% if file_suffix.suffix_pattern.html %}{{ file_suffix.suffix_pattern.html | jsonify }}{% else %}["html","htm"]{% endif %},
                js:{% if file_suffix.suffix_pattern.js %}{{ file_suffix.suffix_pattern.js | jsonify }}{% else %}["js"]{% endif %},
                css:{% if file_suffix.suffix_pattern.css %}{{ file_suffix.suffix_pattern.css | jsonify }}{% else %}["css"]{% endif %},
            }{% else %}{
                html:["html","htm"],
                js:["js"],
                css:["css"]
            }{% endif %},
            suffix_mapping:{}
        },
        demo_list:null

    }; // private
    // Get demo list from the url of Page Demo_list. 
    (function getDemoList(){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            _args.demo_list = JSON.parse(this.responseText)
          }
        };
        var get_list_url = "{% for page in site.pages %}{% if page.id == site.demos.page_id %}{{page.permalink}}{% endif %}{% endfor %}".trim();
        xhttp.open("GET", get_list_url, true);
        xhttp.send();
    })();

    // Deal file_suffix with patterns and cap_ignore.Generate a map like that {
    //     "html":"html",
    //     "htm":"html",
    //     "js":"js",
    //     "css":"css"
    // }
    (function createSuffixMapping(){
        var file_suffix = _args.file_suffix
        Object.keys(file_suffix.suffix_pattern).forEach(function(key){
            file_suffix.suffix_pattern[key].forEach(element=>{
                if(file_suffix.ignore_cap){ 
                    element = element.toLowerCase();
                }
                file_suffix.suffix_mapping[element] = key;
            })
       });
    })();

    return {
        _args: _args,

        _Log: function(message){
            var func;
            if({{demos.debug}}){
                func = alert;
            }else{
                func = console.log;
            }
            func(message);
        },
        // return a map like {
        //     "html":["fooHtmlPath/fooA.html","fooHtmlPath/fooB.html"],
        //     "js":["fooJsPath/fooA.js"],
        //     "css":["fooCssPath/ss."],
        // }
        _GetDemoFileUrls:function(demoID){
            var ret = {"html":[],"js":[],"css":[],"others":[]};
            var demo_data = _args.demo_data_arr[demoID];
            if(!demo_data){
                this._Log("Error demoID!");
            }
            var demo_dir = _args.demo_base_url + demo_data.url;

            var filterFunc = function(url){
                var ret = url.search(demo_dir)
                return  -1 != ret;
            }
            var file_url_list  = _args.demo_list.filter(filterFunc);

            file_url_list.forEach(element => {
                var getSuffix = function(file_url){
                    var index = file_url.lastIndexOf(".");
                    var suffix = file_url.substr(index+1);
                    return suffix;
                }
                var suffix = getSuffix(element);
                var strEqual = function(str1,str2,b_cap_ingore){
                    var ret;
                    if(b_cap_ingore){
                        ret = (str1.toLowerCase() == str2.toLowerCase());
                    }else{
                        ret = (str1 == str2);
                    }
                    return ret;
                }
                var b_find_pattern = false;
                var file_suffix = _args.file_suffix;
                var suffix_mapping = file_suffix.suffix_mapping;

                // suffsuffix_mapping structure like{
                //     "html":["fooHtmlPath/fooA.html","fooHtmlPath/fooB.html"],
                //     js":["fooJsPath/fooA.js"],
                //     css":["fooCssPath/ss."],
                // }                
                for (var suffix_in_rule in suffix_mapping){
                    if(strEqual(suffix_in_rule,suffix,file_suffix.ignore_cap)){
                        b_find_pattern = true;
                        ret[suffix_mapping[suffix_in_rule]].push(element)
                        break;
                    }
                }
                if(!b_find_pattern){
                    ret["others"].push(element)
                }
            });
            return ret;
        },
        EmbedDemo: function (demoId) {
            var _this = this;
            var script_here = document.currentScript;
            var in_interval_obj = {
                counter:1,
                createEmbedFrame : function () {
                    if(_args.demo_list == null){
                        // Still fetching the list..
                        console.log(in_interval_obj.counter);
                        if(in_interval_obj.counter == 500) {
                            _this._Log("Fetch demo list failed, check your setting!");
                            debugger;
                            clearInterval(interval_id);
                        }
                        in_interval_obj.counter++;
                        return;
                    }
                    clearInterval(interval_id);
                    
                    var this_demo_files = _this._GetDemoFileUrls(demoId);
    
                    var currentSlug, iframe, listeners, setHeight, target, uid, uriEmbedded, uriOriginal, uriOriginalNoProtocol;
                    id = ((new Date().getTime())).toString();
                    uriEmbedded = "/demos/base/embed.html";
                    target = script_here;
                    iframe = document.createElement("iframe");
                    iframe.src = uriEmbedded;
                    iframe.id = id;
                    // iframe.scrolling = "auto";
                    iframe.width = "100%";
                    // iframe.height = "100%";
                    iframe.frameBorder = "0";
                    iframe.allowtransparency = true;
                    iframe.sandbox = "allow-modals allow-forms allow-popups allow-scripts allow-same-origin";
                    
                    target.parentNode.insertBefore(iframe, target.nextSibling);
                    iframe.onload = function(){
                        // Deep copy of this demo_js instance.
                        var copy = Object.assign({}, demo_js);
                        copy._args = JSON.parse(JSON.stringify(demo_js))._args;
                        // Inject other attrs. 
                        copy._args.this_demo_files = this_demo_files;
                        copy._args.demo_iframe = iframe;

                        var embeded_js = iframe.contentWindow.embeded_js;
                        var _args_of_embed_js = Object.assign(copy._args,embeded_js._args);
                        // Add methods of demo_js to embeded_js.
                        embeded_js = Object.assign(demo_js,embeded_js);
                        // Add _args of demo_js to embeded_js.
                        embeded_js._args = _args_of_embed_js;
                        // Merge done. Then embeded_js has all abilities of demo_js.
                        iframe.contentWindow.embeded_js = embeded_js;
                        iframe.contentWindow.embeded_js.hook();
                    }
                    
    
                    // setHeight = function (data) {
                    //     if (data.slug === currentSlug) {
                    //         return iframe.height = data.height + 50;
                    //     }
                    // };
                    // listeners = (function (_this) {
                    //     return function (event) {
                    //         var data, eventName;
                    //         eventName = event.data[0];
                    //         data = event.data[1];
                    //         switch (eventName) {
                    //             case "embed":
                    //                 return setHeight(data);
                    //             case "resultsFrame":
                    //                 if (data.height == 0) {
                    //                     data.height = 500;
                    //                 }
                    //                 return setHeight(data);
                    //         }
                    //     };
                    // })(this); return window.addEventListener("message", listeners, false);
                }
            }
            var interval_id = setInterval(in_interval_obj.createEmbedFrame, 35);
        }
    };
}());
