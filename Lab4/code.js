$(document).ready(function(){
	
	$('#fourth').hide();
	
	$('#hideShow').click(function () {
		$('#dinnerTable').toggle(2000);
	});
	
	$('#first').click(function () {
		$('p').slideUp(400);
	})
	$('#second').click(function () {
		$('p').css('color', 'red');
	})
	
	$('#dinnerTable').click(function () {
		$('#fourth').show();
	});
	
	$('#fourth').mouseover(function () {
		$('#fourth').css('font-size', '80px');
	});
});