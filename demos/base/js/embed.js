
var embeded_js = embeded_js || (function () {
    var _args = {

    };
    return {
        _args: _args,
        toggleFrameShow: function (_this, kind, href) {
            var active_eles = document.getElementsByClassName("active");
            var show_eles = document.getElementsByClassName("show");

            // Remove ALL active class label.
            
            Array.prototype.forEach.call(active_eles, function (el) {
                el.classList.remove("active");
                console.log(el.tagName);
            });
            [].forEach.call(active_eles, function (el) {
                console.log(el.tagName);
            });
            // Make the ATag and its parent li active.
            _this.classList.add("active");
            _this.parentElement.classList.add("active");

            // Remove ALL show class label.
            Array.prototype.forEach.call(show_eles, function (el) {
                el.classList.remove("show");
            });
            // Make ATag's kind viewer(result or html or js or css or others) show.
            if (kind != "result" && kind != "html" && kind != "js" && kind != "css" && kind != "others") {
                this._Log("Toggle an error kind of file: "+ kind);
                return;
            }
            document.getElementById(kind).classList.add("show");

        },
        _getResultPageHeight: function (id) {
            try {
                var iframe = document.getElementById(id);
                if (iframe.attachEvent) {
                    iframe.attachEvent("onload", function () {
                        iframe.height = iframe.contentWindow.document.documentElement.scrollHeight;
                    });
                    return;
                } else {
                    iframe.onload = function () {
                        iframe.height = iframe.contentDocument.body.scrollHeight;
                    };
                    return;
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
                var args = _this._args
                var html_files = args.this_demo_files.html;
                var js_files = args.this_demo_files.js;
                var css_files = args.this_demo_files.css;

                var a_li_result = document.querySelector("a[href='#Result']").parentElement;
                var a_li_html = document.querySelector("a[href='#HTML']").parentElement;
                var a_li_js = document.querySelector("a[href='#JavaScript']").parentElement;

                var getFileName = function (str) {
                    var index = str.lastIndexOf("/");
                    return str.substr(index + 1);
                }
                var createAnResultIframeToContainer = function (container, html_url) {
                    uriEmbedded = html_url;
                    iframe = document.createElement("iframe");
                    iframe.src = uriEmbedded;
                    iframe.id = html_url;
                    iframe.scrolling = "auto";
                    iframe.width = "100%";
                    iframe.height = _this._args.demo_iframe.offsetHeight - document.querySelector("header").offsetHeight;
                    iframe.frameBorder = "0";
                    iframe.allowtransparency = true;
                    iframe.sandbox = "allow-modals allow-forms allow-popups allow-scripts allow-same-origin";
                    container.insertBefore(iframe, container.firstChild);
                    return iframe;
                }

                if (html_files.length == 0) {
                    // Means that there is no result page. 
                    a_li_result.classList.remove("active");
                    a_li_js.classList.add("active");

                    a_li_result.style.display = "none";
                    a_li_html.style.display = "none";
                } else {
                    var a_li_dropdown_content = a_li_result.getElementsByClassName("dropdown-content")[0];
                    var length = a_li_dropdown_content.children.length - html_files.length;
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
                    for (var i = 0; i < html_files.length; i++) {
                        a_li_dropdown_content.children[i].textContent = getFileName(html_files[i]);
                        a_li_dropdown_content.children[i].setAttribute("href", "#" + html_files[i]);
                        var quota = "\"";
                        a_li_dropdown_content.children[i].setAttribute("onclick", "embeded_js.toggleFrameShow(" + "this" + "," + quota + "result" + quota + "," + quota + html_files[i] + quota + ")");
                        // Make the first active.
                        if (i == 0) {
                            a_li_dropdown_content.children[i].classList.add("active");
                        }
                    }

                    // Create iframes.
                    for (var i = 0; i < html_files.length; i++) {
                        var iframe = createAnResultIframeToContainer(document.getElementById("result"), html_files[i]);
                        // Make other iframes hidden.
                        if (i != 0) {
                            iframe.style.display = "none";
                        }
                    }
                }
                ;
            }())

            // var s = this._getOverflowSettingOfResultPage()
            // console.log(JSON.stringify(s))
        }
    }
}())