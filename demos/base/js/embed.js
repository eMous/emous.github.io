var embeded_js = embeded_js || (function () {
    (window.onload = function () {
        (function initCSS(){
            var dropdown_eles = document.getElementsByClassName("dropdown");
            Array.from(dropdown_eles).forEach(function (el) {
                el.addEventListener("mouseenter",function (event) {
                    el.querySelector(".dropdown-content").style.display = "block";
                });
                el.addEventListener("mouseleave",function (event) {
                    el.querySelector(".dropdown-content").style.display = "none";
                })
            });
        }());
    });


    var _args = {};

    return {
        _args: _args,
        toggleFrameShow: function (_this, kind, href) {

            var active_eles = document.getElementsByClassName("active");
            var show_eles = document.getElementsByClassName("show");

            // Remove ALL active class label.
            Array.from(active_eles).forEach(function (el) {
                el.classList.remove("active");
            });

            // Make the ATag and its parent li active.
            _this.classList.add("active");
            _this.parentElement.parentElement.classList.add("active");

            // Remove ALL show class label.
            Array.from(show_eles).forEach(function (el) {
                el.classList.remove("show");
            });

            // Make ATag's kind viewer(result or html or js or css or others) show.
            if (kind != "result_viewer" && kind != "html_viewer" && kind != "js_viewer" && kind != "css_viewer" && kind != "others_viewer") {
                this._Log("Toggle an error kind of file: " + kind);
                return;
            }

            // Make the clicked iframe visible.
            var kind_container = document.getElementById(kind);
            kind_container.classList.add("show");
            // var iframe = kind_container.querySelector("[src='" + href + "']");
            var iframe = kind_container.querySelector("[data-src='" + href + "']");
            iframe.classList.add("show");

            // Hide the dropdown-container.
            const mouse_levea_event = new Event('mouseleave');
            _this.parentElement.parentElement.dispatchEvent(mouse_levea_event);

            // Let editor refresh if current is not result frame.
            if (kind != "result_viewer"){
                iframe.contentWindow.mirrorcode_ctrl_js._args.editor.refresh();
            }
        },
        _getResultPageHeight: function (id) {
            try {
                var iframe = document.getElementById(id);
                if (iframe.attachEvent) {
                    iframe.attachEvent("onload", function () {
                        iframe.height = iframe.contentWindow.document.documentElement.scrollHeight;
                    });

                } else {
                    iframe.onload = function () {
                        iframe.height = iframe.contentDocument.body.scrollHeight;
                    };

                }
            } catch (e) {
                this._Log('Unable to get page height of ' + id);
            }
        },
        // // Absolute dirty hack >_<.
        // _getOverflowSettingOfResultPage: function(){
        //     return;
        //     var result_iframe = document.querySelector("#result_iframe");
        //     var html_element = result_iframe.contentDocument.querySelector("html");
        //     var body_element = result_iframe.contentDocument.querySelector("body");
        //     var ret = {"html":{"overflow":{},"overflowX":{},"overflowY":{}},"body":{"overflow":{},"overflowX":{},"overflowY":{}}};
        //     ret.html.overflow = window.getComputedStyle(html_element).overflow
        //     ret.html.overflowX = window.getComputedStyle(html_element).overflowX
        //     ret.html.overflowY = window.getComputedStyle(html_element).overflowY

        //     ret.body.overflow = window.getComputedStyle(body_element).overflow;
        //     ret.body.overflowX = window.getComputedStyle(body_element).overflowX;
        //     ret.body.overflowY = window.getComputedStyle(body_element).overflowY;

        //     var _html = ret.html,_body = ret.body;
        //     html_element.style.max_width="500px";

        //     if(_html.overflowX == "hidden" || (_html.overflowX == "visible" && _body.overflowX == "hidden")){
        //         console.log(" forbidden inject X scroll!")
        //     }
        //     if(_html.overflowY == "hidden" || (_html.overflowY == "visible" && _body.overflowY == "hidden")){
        //         console.log(" forbidden inject Y scroll!")
        //     }
        //     // if(_html.overflowX == "visible" && _html.overflowY == "visible")

        //     return ret;
        // },
        // Method is hooked when the iframe onLoad
        hook: function () {
            var _this = this;
            // Base result iframe height equals embed iframe height - header height(50px) 
            (function initResultiframesize() {
                return;
                var result_iframe = document.querySelector("#result_iframe");
                // var result = document.querySelector("#result");
                // var s = document.querySelector("header");
                // var sd = document.querySelector("header").offsetHeight;
                result_iframe.style.height = _this._args.demo_iframe.offsetHeight - document.querySelector("header").offsetHeight;
                // result.style.height = result_iframe.style.height
            }());
            (function analyseDemoFiles() {
                document.querySelector("#actions").style.display = "block";

                var args = _this._args;
                var html_files = args.this_demo_files.html;
                var js_files = args.this_demo_files.js;
                var css_files = args.this_demo_files.css;
                var others_files = args.this_demo_files.others;

                var a_li_result = document.querySelector("a[href='#Result']").parentElement;
                var a_li_html = document.querySelector("a[href='#HTML']").parentElement;
                var a_li_js = document.querySelector("a[href='#JavaScript']").parentElement;
                var a_li_css = document.querySelector("a[href='#CSS']").parentElement;
                var a_li_others = document.querySelector("a[href='#Others']").parentElement;

                var getFileName = function (str) {
                    var index = str.lastIndexOf("/");
                    return str.substr(index + 1);
                };
                var insertATagsToDropdownContent = function(a_li_dropdown_content,arr_files,kind){
                    var length = a_li_dropdown_content.children.length - arr_files.length;
                    // Dynamic add ATag.
                    if (length > 0) {
                        for (var i = 0; i < length; i++) {
                            a_li_dropdown_content.children[0].remove();
                        }
                    }
                    if (length < 0) {
                        length = Math.abs(length);
                        for (var i = 0; i < length; i++) {
                            var a_ele = document.createElement("a");
                            a_li_dropdown_content.children[0].parentNode.insertBefore(a_ele, a_li_dropdown_content.firstChild);
                        }
                    }
                    // Set ATags' attrs.
                    for (var i = 0; i < arr_files.length; i++) {
                        a_li_dropdown_content.children[i].textContent = getFileName(arr_files[i]);
                        a_li_dropdown_content.children[i].setAttribute("href", "#" + arr_files[i]);
                        var quota = "\"";
                        a_li_dropdown_content.children[i].setAttribute("onclick", "embeded_js.toggleFrameShow(" + "this" + "," + quota + kind + quota + "," + quota + arr_files[i] + quota + ")");
                    }
                };
                var createAnResultIframeToContainer = function (container, html_url) {
                    uriEmbedded = html_url;
                    iframe = document.createElement("iframe");
                    iframe.src = uriEmbedded;
                    iframe.dataset.src = uriEmbedded;
                    iframe.width = "100%";
                    iframe.style.border = 0;
                    iframe.height = _this._args.demo_iframe.offsetHeight - document.querySelector("header").offsetHeight;
                    iframe.allowtransparency = true;
                    iframe.sandbox = "allow-modals allow-forms allow-popups allow-scripts allow-same-origin";
                    container.insertBefore(iframe, container.firstChild);
                    return iframe;
                };
                var createAnMirrorCodeIframeToContainer = function (container, file_url, file_suffix) {
                    uriEmbedded = "/demos/base/mirrorcode.html";
                    var iframe = document.createElement("iframe");
                    iframe.src = uriEmbedded;
                    iframe.dataset.src = file_url;
                    iframe.width = "100%";
                    iframe.style.border = 0;
                    iframe.height = _this._args.demo_iframe.offsetHeight - document.querySelector("header").offsetHeight;
                    iframe.allowtransparency = true;
                    iframe.sandbox = "allow-modals allow-forms allow-popups allow-scripts allow-same-origin";
                    container.insertBefore(iframe, container.firstChild);
                    iframe.onload = function () {
                        var ctr_js = iframe.contentWindow.mirrorcode_ctrl_js;
                        ctr_js._Log = _this._Log;
                        ctr_js._args.iframe_self_living = iframe;
                        var mime_type;
                        if (file_suffix == "html"){
                            mime_type = "text/html";
                        }else if(file_suffix == "js"){
                            mime_type = "text/javascript";
                        }else if(file_suffix == "css"){
                            mime_type = "text/css";
                        }else if(file_suffix == "others"){
                            mime_type = "text/x-sh";
                        }else{
                            _this._Log("Something went wrong with file suffix: "+ file_suffix);
                        }
                        iframe.contentWindow.mirrorcode_ctrl_js.hook(file_url,mime_type)
                    };
                    return iframe;
                };
                // Result dropdown_content.
                if (html_files.length == 0) {
                    // Means that there is no result page. 
                    a_li_result.classList.remove("active");
                    a_li_js.classList.add("active");

                    a_li_result.style.display = "none";
                    a_li_html.style.display = "none";
                } else {
                    var a_li_dropdown_content = a_li_result.getElementsByClassName("dropdown-content")[0];
                    insertATagsToDropdownContent(a_li_dropdown_content,html_files,"result_viewer");
                    // Create iframes.
                    for (var i = 0; i < html_files.length; i++) {
                        var iframe = createAnResultIframeToContainer(document.getElementById("result_viewer"), html_files[i]);
                    }

                    // Show the first demo.
                    _this.toggleFrameShow(a_li_dropdown_content.children[0], "result_viewer", a_li_dropdown_content.children[0].getAttribute("href").substr(1))
                }
                // Javascript dropdown_content.
                if (js_files.length == 0){
                    a_li_js.style.display = "none";
                    if (html_files.length == 0) {
                        // Means that there is no result page and no js page.
                        a_li_js.classList.remove("active");
                        a_li_css.classList.add("active");
                    }
                }else{
                    var a_li_dropdown_content = a_li_js.getElementsByClassName("dropdown-content")[0];
                    insertATagsToDropdownContent(a_li_dropdown_content,js_files,"js_viewer");

                    // Create iframes.
                    for (var i = 0; i < js_files.length; i++) {
                        var iframe = createAnMirrorCodeIframeToContainer(document.getElementById("js_viewer"), js_files[i],"js");
                    }
                }
                // CSS dropdown_content.
                if (css_files.length == 0){
                    a_li_css.style.display = "none";
                    if (js_files.length == 0 && html_files.length == 0) {
                        // Means that there is no result page and no js page.
                        a_li_css.classList.remove("active");
                        a_li_others.classList.add("active");
                    }
                }else{
                    var a_li_dropdown_content = a_li_css.getElementsByClassName("dropdown-content")[0];
                    insertATagsToDropdownContent(a_li_dropdown_content,css_files,"css_viewer");

                    // Create iframes.
                    for (var i = 0; i < css_files.length; i++) {
                        var iframe = createAnMirrorCodeIframeToContainer(document.getElementById("css_viewer"), css_files[i],"css");
                    }
                }
                // HTML dropdown_content.
                if (html_files.length != 0) {
                    var a_li_dropdown_content = a_li_html.getElementsByClassName("dropdown-content")[0];
                    insertATagsToDropdownContent(a_li_dropdown_content, html_files, "html_viewer");
                    // Create iframes.
                    for (var i = 0; i < html_files.length; i++) {
                        var iframe = createAnMirrorCodeIframeToContainer(document.getElementById("html_viewer"), html_files[i],"html");
                    }
                }
                // Others dropdown_content.
                if (others_files.length == 0){
                    a_li_others.style.display = "none";
                    if (css_files.length == 0 && js_files.length == 0 && html_files.length == 0) {
                        // Means that there is no result page and no js page.
                        a_li_others.classList.remove("active");
                        _this._Log("There is empty in the demo.");

                    }
                }else{
                    var a_li_dropdown_content = a_li_others.getElementsByClassName("dropdown-content")[0];
                    insertATagsToDropdownContent(a_li_dropdown_content,others_files,"others_viewer");

                    // Create iframes.
                    for (var i = 0; i < others_files.length; i++) {
                        var iframe = createAnMirrorCodeIframeToContainer(document.getElementById("others_viewer"), others_files[i],"others");
                    }
                }
            }())

            // var s = this._getOverflowSettingOfResultPage()
            // console.log(JSON.stringify(s))
        }
    }
}());