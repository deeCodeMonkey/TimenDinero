
$(document).ready(function () {

    //delete Project per modal
    $('#delete-project-btn').click(function () {
        var project_id = $(this).attr('data-project-id');
        var client_id = $(this).attr('data-client-id');
        console.log('this is from jquery' + project_id);
        var url = '/admin/delete/' + project_id;
        $.ajax({
            url: url,
            type: 'DELETE',
            success: function (result) {
                window.location = '/admin/' + client_id;
            }, error: function (err) {
                console.log(err);
            }
        });
    });

    //expland table for task/project list
    $('[data-open-details]').click(function (e) {
        e.preventDefault();
        $(this).next().toggleClass('is-active');
        $(this).toggleClass('is-active');
    });


    //delete Company per modal
    $('#delete-company').click(function () {
        var id = $(this).val();
        console.log('this is jquery ' + id);
        var url = '/company/delete/' + id;
        $.ajax({
            url: url,
            type: 'DELETE',
            success: function (result) {
                window.location = '/';
            }, error: function (err) {
                console.log(err);
            }
        });
    });


    //date of today for invoice
    $('#today').html(new Date().toISOString().slice(0, 10));

    //email pdf invoice
    $('#pdfSender').click(function () {
        //to prevent from clicking more than once
        $('#pdfSender').attr("disabled", "disabled");
        $('#emailModal').modal();
        console.log($('#pdfSender').attr('data-id'));
        window.location = '/invoice/pdf/' + $('#pdfSender').attr('data-id');
    });



    //search bar
    var cache = {};
    //autcomplete is a jquery UI component
    //autocomplete provides suggestions while you type into the field
    $("#search").autocomplete({
        minLength: 1,
        delay: 300,
        //returns array of labels with values
        source: function (request, response) {
            var term = request.term;
            if (term in cache) {
                response(cache[term]);
                return cache[term];
            }
            //get company search response from API
            $.getJSON("/company/search",
                request,
                function (data, status, xhr) {
                    cache[term] = data;
                    response(data);
                    return cache[term];
                });
        },
        //when company selected
        select: function (event, ui) {
            window.location = '/company/profile/' + ui.item.value;
            return false;
        }
    });


    //create click event for edit, displays data for editing
    $('.edit-project').click(function () {
        $('#edit-form-id').val($(this).data('id'));
        $('#edit-form-client-id').val($(this).data('client-id'));
        $('#edit-form-date').val($(this).data('date'));
        $('#edit-form-title').val($(this).data('title'));
        $('#edit-form-task').val($(this).data('task'));
        $('#edit-form-hours').val($(this).data('hours'));
        $('#edit-form-rate').val($(this).data('rate'));
        $('#edit-form-description').val($(this).data('description'));
        $('#edit-form-notes').val($(this).data('notes'));
    });

    //default to today's date on 'add' form
    $('#newProjectDate').val(new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10));

    //create click event for delete, reference variables specific to project
    $('.delete-project').click(function () {
        $('#delete-project-btn').attr('data-project-id', $(this).data('id'));
        $('#delete-project-name').text($(this).data('title'));
        $('#delete-task').text($(this).data('task'));
    });

});



