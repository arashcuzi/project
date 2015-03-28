$(document).ready(function () {
	$("#btnSignup").click(function (evt, req){
		evt.preventDefault();

		if ($('#password').val() !== $('#confirm').val()) {
			var html = "<a href='#' class='close' data-dismiss='alert'>&times;</a><strong>Hey!</strong> Your passwords didn't match!";

			$('#createalert').html(html);
			$('#createalert').addClass('alert alert-warning fade in');
		} else {
			$('form').submit();
		}
	})
})