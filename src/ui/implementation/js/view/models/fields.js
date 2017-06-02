/**
 * Sample VIEW script.
 *
 * @author Stagejs.CLI
 * @created Wed May 31 2017 15:45:20 GMT-0700 (PDT)
 */
;(function(app){

	app.view('Models.Fields', {

		template: '@view/models/fields.html',
		//data: 'url', {} or [],
		//coop: ['e', 'e'],
		//[editors]: {...},
		
		initialize: function(){
			console.log(this.data);
		},
		//onShow: function(){},
		//onDataRendered: function(){},
		
		actions: {
		//	submit: function(){...},
		//	dosomething: function(){...},
		//	...
		},

	});
	app.view('Models.Relation', {

		template: '@view/models/fields.html',
		// template: [
		// 	'<div class="records-ct">',
		// 	    '<div class="individual hdr">',
		// 	        '<span>{{hdr.left}}</span>',
		// 	        '<span class="pull-right text-right">{{hdr.right}}</span>',
		// 	    '</div>',
		// 	    '<div region="individual-records" class="individuals">',
		// 	            '<div class="individual field">',
		// 	                '<span>{{relation.left}}</span>',
		// 	                '<span class="pull-right text-right">{{relation.right}}</span>',
		// 	            '</div>',
		// 	    '</div>',
		// 	'</div>'
		// ],
		//data: 'url', {} or [],
		//coop: ['e', 'e'],
		//[editors]: {...},
		
		initialize: function(){
			console.log(this.data);
		},
		//onShow: function(){},
		//onDataRendered: function(){},
		
		actions: {
		//	submit: function(){...},
		//	dosomething: function(){...},
		//	...
		},

	});

})(Application);