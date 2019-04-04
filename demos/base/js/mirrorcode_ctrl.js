var mirrorcode_ctrl_js = mirrorcode_ctrl_js || (function(){
    var _args = {
        editor:{}
    }
    return {
        _args: _args,
        fileContentHook: function(file_url,content){
            this._args.editor.setValue(content);
        },
        hook: function (file_url,mime_type) {
            var _this = this;
            (function createEditor(mime_type) {
                console.log(mime_type);
                var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
                    lineNumbers: true,
                    matchBrackets: true,
                    mode: mime_type,
                    readOnly:"nocursor",
                });
                _this._args.editor = editor;
                editor.setSize("100%",_this._args.iframe_self_living.height);

                (function getFileContent(file_url) {
                    var xmlHttp = new XMLHttpRequest();
                    xmlHttp.onreadystatechange = function() {
                        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                            _this.fileContentHook(file_url,xmlHttp.responseText);
                    }
                    xmlHttp.open("GET", file_url, true); // true for asynchronous
                    xmlHttp.send(null);
                }(file_url))

            }(mime_type))
        }
    }
}());

