// Notification Popup
// Author: stefan.stoichev@gmail.com
// Version: 0.1.0
// Repo: https://github.com/countnazgul/qlikview-notify-popup

var _path = Qva.Remote + "?public=only&type=document&name=Extensions/notify/";
var serverUrl = "http://localhost:8080/";
var txBoxId = 'Popup'

Qva.AddDocumentExtension('notify', function() {
    Qva.LoadCSS(_path + "styles.css");
    Qva.LoadScript(_path + "jquery-1.12.3.min.js", function() {
        Qva.LoadScript(_path + "notify.min.js", function() {
            $('document').ready(function() {

                var qvDoc = Qv.GetCurrentDocument();
                var documentName = '';
                var textObject = qva.GetQvObject(txBoxId, function() {
                    text = textObject.QvaPublic.GetText();
                    documentName = text;


                    $(document).on('click', '.notifyjs-qv-base .no', function(e) {
                        e.preventDefault();
                        var url = serverUrl + 'details/' + $(this).attr('id');
                        window.open(url, '_blank');
                    });

                    if (documentName.indexOf('.qvw') > -1) {
                        $.get({ url: serverUrl + "notifications/" + documentName, cache: false }, function(data) {

                            for (var i = 0; i < data.length; i++) {
                                $.notify.addStyle('qv', {
                                    html: "<div style='notifyjs-qv-base'><div class='left'>" + data[i].description + "</div>" +
                                    "<div class='right'><button class='no' id='" + data[i]._id + "'>Details</button></div></div>"
                                });

                                $.notify({}, {
                                    style: 'qv',
                                    position: 'top left',
                                    autoHide: true,
                                    clickToHide: true,
                                    autoHideDelay: 10000
                                });
                            }
                        });
                    }
                });
            });
        });
    });
});
