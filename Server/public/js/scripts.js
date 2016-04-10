$(document).ready(function() {
    moment.locale('en-gb');

    var table = $('#example').DataTable({
        select: true,
        "paging": true,
        "filter": true,
        "autoWidth": false,
        "columnDefs": [{
            "targets": -2,
            "data": null,
            "defaultContent": '<a class="btn btn-danger" href="#"><i class="icon-trash icon-white"></i>Delete</a>'
        }, {
                "targets": [0],
                "visible": true
            }, {
                "width": "5%",
                "targets": [0]
            }, {
                "width": "5%",
                "targets": [3, 5]
            }, {
                "width": "32.5%",
                "targets": [1, 2]
            }, {
                "width": "15%",
                "targets": [4]
            }, {
                "targets": -1,
                "visible": false
            }]
    });
    $.notify.defaults({ globalPosition: "top left" });

    $('#example tbody').on('click', 'a', function(e) {

        if ($(this).attr("class") == 'btn btn-danger') {
            var data = table.row($(this).parents('tr')).data();
            var row = table.row($(this).parents('tr'));
            e.preventDefault();

            var options = {
                message: "Are you sure you want to delete this notification?",
                title: 'Delete'
            };

            var id = $(data[0]).text();

            eModal.confirm(options, null)
                .then(function() {
                    $.ajax({
                        type: "POST",
                        url: '/delete',
                        dataType: 'json',
                        contentType: "application/json",
                        async: true,
                        data: '{"id": "' + id + '"}',
                        success: function(returndata) {

                            if (returndata.removed === 1) {
                                row.remove().draw();
                                $('#document').val('')
                                $('#description').val('')
                                $('#detaildescription').val('')
                                $('#validto').val('')
                                $('#save').text('Add');
                                $('#active').prop('checked', false);
                                selected = false;
                                $.notify("Deleted", "success");
                            }
                        }
                    });
                }, function() {
                    //console.log('cancel')
                });
        }
    });

    var selected = false;
    var selectedId = '';

    table.on('select', function(e, dt, type, indexes) {
        if (type === 'row') {
            selected = true;

            var d = table.rows(indexes).data()[0];

            selectedId = $(d[0]).text();
            //console.log(data);
            $('#document').val(d[1]);
            $('#description').val(d[2]);
            $('#validto').val(d[4]);
            $('#save').text('Update');
            var checked = (d[3] === "true");
            $('#active').prop('checked', checked);
            $('#detaildescription').val(d[6])

        }
    });

    table.on('deselect', function(e, dt, type, indexes) {
        selected = false;
        selectedId = '';
        $('#document').val('')
        $('#description').val('')
        $('#validto').val('')
        $('#save').text('Add');
        $('#active').prop('checked', true);
        $('#detaildescription').val('');
    });

    $('#save').on('click', function() {
        var valid = '';
        if ($('#active').is(':checked')) {
            valid = true;
        }
        else {
            valid = false;
        }

        if ($('#document').val() != '' && $('#description').val() != '' && $('#validto').val() != '' && $('#detaildescription').val() != '') {
            if (selected == false) {
                $.ajax({
                    type: "POST",
                    url: '/add',
                    dataType: 'json',
                    contentType: "application/json",
                    async: true,
                    data: JSON.stringify({
                        "document": $('#document').val(),
                        "description": $('#description').val(),
                        "validTo": $('#validto').val(),
                        "valid": valid,
                        'detaildescription': $('#detaildescription').val()
                    }),
                    success: function(returndata) {
                        table.row.add([
                            '<a href="/details/' + returndata._id + '">' + returndata._id + '</a>',
                            $('#document').val(),
                            $('#description').val(),
                            valid,
                            $('#validto').val(),
                            '',
                            $('#detaildescription').val()

                        ]).draw(true);
                        $('#document').val('');
                        $('#description').val('');
                        $('#detaildescription').val('');
                        $('#validto').val('');
                        $('#valid').attr('checked', true);
                        $.notify("Added",  "success");
                    }
                });
            }
            else {
                $.ajax({
                    type: "POST",
                    url: '/update',
                    dataType: 'json',
                    contentType: "application/json",
                    async: true,
                    data: JSON.stringify({
                        "id": selectedId,
                        "document": $('#document').val(),
                        "description": $('#description').val(),
                        "validTo": $('#validto').val(),
                        "valid": valid,
                        'detaildescription': $('#detaildescription').val()
                    }),
                    success: function(returndata) {
                        var r = table.rows('.selected');

                        table
                            .row(r)
                            .data(
                            [
                                '<a href="/details/' + selectedId + '">' + selectedId + '</a>',
                                $('#document').val(),
                                $('#description').val(),
                                valid,
                                $('#validto').val(),
                                '',
                                 $('#detaildescription').val()
                            ])
                            .draw(true);

                        table.$('tr.selected').removeClass('selected');
                        selected = false;
                        selectedId = '';
                        $('#document').val('');
                        $('#description').val('');
                        $('#detaildescription').val('');
                        $('#validto').val('');
                        $('#valid').attr('checked', true);
                        $.notify("Updated", "success");
                    }
                });
            }
        } else {
            $.notify("Please fill all the fields.", "error");
        }
    });

});