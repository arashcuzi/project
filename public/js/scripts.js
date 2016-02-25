$(document).ready(function () {
	$("#btnSignup").click(function (evt, req) {
		evt.preventDefault();

		if ($('#fname').val() === '' || $('#lname').val() === '' || $('#email').val() === '') {
			var html = "<div id='alert'><a href='#' class='close' data-dismiss='alert'>&times;</a><strong>Hold up!</strong> Did you fill out the form?</div>"

			$('#alertdiv').html(html);
			$('#alert').addClass('alert alert-warning fade in');

			return;
		} else {
			if ($('#password').val() !== $('#confirm').val()) {
				var html = "<div id='alert'><a href='#' class='close' data-dismiss='alert'>&times;</a><strong>Hey!</strong> Your passwords didn't match!</div>";

				$('#alertdiv').html(html);
				$('#alert').addClass('alert alert-warning fade in');

				return;
			} else {
				$('form').submit();
			}
		}
	});

	$('.done').click(function () {
        var URL = '/api/todo/{{{user._id}}}/' + $(this).attr('id');
        var dataObject = {
            'done': $(this).is(':checked')
        };
        console.log(dataObject);
        $.ajax({
            url: URL,
            type: 'PUT',
            data: dataObject,
            dataType: 'json',
            success: function (result) {
                console.log('it worked');
                //$('#message').html('Todo item updated!').fadeIn(100).fadeOut(3000);
            },
            failure: function (err) {
                console.log('failed');
            }
        })
    });
});