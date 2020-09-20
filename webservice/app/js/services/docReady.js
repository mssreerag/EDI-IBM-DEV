'use strict';

angular.module('ediCreatorApp')
.service('docReady', ['$http', function ($http) {

	var updateTextFiels = function () {
		var input_selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea';
		// Set timeout to set some 100ms delay for data fetch;
		setTimeout(function(){
			console.log('acive class added');
			$(input_selector).each(function(index, element) {
				if ($(element).val().length > 0 || $(this).attr('placeholder') !== undefined) {
					$(this).siblings('label, i').addClass('active');
				}
			});
		}, 1000);
	}

	this.run = function () {
		console.log('yoooo. Done');
		$(".button-collapse").sideNav(); 	//Mobile hamburger
		$('.scrollspy').scrollSpy();		//Scrollspy
		$('select').material_select();		//To make <SELECT> element working
		$('ul.tabs').tabs();				//Tabs
		$('input').characterCounter();		//Character Counter
		$('.modal-trigger').leanModal();	//Modal Start
		$(".dropdown-button").dropdown();
		$('.collapsible').collapsible({
			accordion : true
		});
		updateTextFiels();
	}    
}])