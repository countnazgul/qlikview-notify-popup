$(document).ready(function() {
    moment.locale('en-gb');

    var table = $('#example').DataTable({
        select: true,
        "paging": false,
        "filter": false,
        "autoWidth": false,
        "columnDefs": [{
            "targets": -1,
            "data": null,
            "defaultContent": '<a class="btn btn-danger" href="#"><i class="icon-trash icon-white"></i>Delete</a>'
        }, {
            "targets": [0],
            "visible": false
        }, {
            "width": "5%",
            "targets": [0]
        }, {
            "width": "5%",
            "targets": [3,5]
        }, {
            "width": "32.5%",
            "targets": [1,2]
        }, {
            "width": "15%",
            "targets": [4]
        }]
    });

    $('#example tbody').on('click', 'a', function(e) {
        var data = table.row($(this).parents('tr')).data();
        var row = table.row($(this).parents('tr'));
        e.preventDefault();

        var options = {
            message: "Are you sure you want to delete this notification?",
            title: 'Delete'


        };

        eModal.confirm(options, null)
            .then(function() {
                $.ajax({
                    type: "POST",
                    url: '/delete',
                    dataType: 'json',
                    contentType: "application/json",
                    async: true,
                    data: '{"id": "' + data[0] + '"}',
                    success: function(returndata) {

                        if (returndata.removed === 1) {
                            row.remove().draw();
                            $('#document').val('')
                            $('#description').val('')
                            $('#validto').val('')
                            $('#save').text('Add');
                            $('#active').prop('checked', false);
                            selected = false;
                        }
                    }
                });
            }, function() {
                //console.log('cancel')
            });

    });

    var selected = false;
    var selectedId = '';

    table.on('select', function(e, dt, type, indexes) {
        if (type === 'row') {
            selected = true;

            var d = table.rows(indexes).data()[0];
            selectedId = d[0];
            //console.log(data);
            $('#document').val(d[1]);
            $('#description').val(d[2]);
            $('#validto').val(d[4]);
            $('#save').text('Update');
            var checked = (d[3] === "true");
            $('#active').prop('checked', checked);

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
    });

    $('#save').on('click', function() {
        var valid = '';
        if ($('#active').is(':checked')) {
            valid = true;
        }
        else {
            valid = false;
        }

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
                    "valid": valid
                }),
                success: function(returndata) {
                    table.row.add([
                        returndata._id,
                        $('#document').val(),
                        $('#description').val(),
                        valid,
                        $('#validto').val()

                    ]).draw(true);
                    $('#document').val('');
                    $('#description').val('');
                    $('#validto').val('');
                    $('#valid').attr('checked', true);

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
                    "valid": valid
                }),
                success: function(returndata) {
                    var r = table.rows('.selected');

                    table
                        .row(r)
                        .data(
                            [
                                selectedId,
                                $('#document').val(),
                                $('#description').val(),
                                valid,
                                $('#validto').val()
                            ])
                        .draw(true);

                    table.$('tr.selected').removeClass('selected');
                    selected = false;
                    selectedId = '';
                    $('#document').val('');
                    $('#description').val('');
                    $('#validto').val('');
                    $('#valid').attr('checked', true);




                }
            });
        }
    });

});