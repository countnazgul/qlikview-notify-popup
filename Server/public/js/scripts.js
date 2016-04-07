$(document).ready(function() {
    var table = $('#example').DataTable({
        select: false,
        "paging": false,
        "filter": false,
        "columnDefs": [
            {
                "targets": -1,
                "data": null,
                "defaultContent": '<a class="btn btn-danger" href="#"><i class="icon-trash icon-white"></i>Delete</a>'
            },
            {
                "targets": [0],
                "visible": false
            }]
    });
    
   var tableTools = new $.fn.dataTable.TableTools( table, {
      sRowSelect: "os",
      aButtons: []
    } );
      
    $( tableTools.fnContainer() ).insertBefore('div.dataTables_wrapper');    
    
    $('#example tbody').on('click', 'a', function(e) {
        var data = table.row($(this).parents('tr')).data();
        var row = table.row($(this).parents('tr'));

        bootbox.confirm("Are you sure?", function(result) {
            if (result == true) {
                $.ajax
                    ({
                        type: "POST",
                        url: '/delete',
                        dataType: 'json',
                        contentType: "application/json",
                        async: true,
                        data: '{"id": "' + data[0] + '"}',
                        success: function(returndata) {

                            if (returndata.removed === 1) {
                                row.remove().draw();
                            }
                        }
                    })
            }
        });
        
    $('#example tbody').on( 'click', 'td', function () {
        console.log('test')
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    } );        





        //alert( data[0] +"'s salary is: "+ data[ 5 ] );
    });

});