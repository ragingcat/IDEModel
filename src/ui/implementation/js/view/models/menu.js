/**
 * Sample VIEW script.
 *
 * @author Stagejs.CLI
 * @created Wed Mar 01 2017 16:29:28 GMT-0800 (PST)
 */
;(function(app){

	app.view('Models.Menu', {

		template: '@view/models/menu.html',
		//data: 'url', {} or [],
		//coop: ['e', 'e'],
		//[editors]: {...},
		
		initialize: function(){},
		//onShow: function(){},
		//onDataRendered: function(){},
		
		actions: {
		//	submit: function(){...},
		//	dosomething: function(){...},
		//	...
		},
		coop:['context-switched', 'navigate-to'],
		onItemActivated: function($item) {
		    app.navigate('Models/' + $item.data('context'));
		    app.coop('breadcrumbs-change', [{href: 'Models', name: app.global.bcsMap['Models']}, {href: $item.data('context'), name: app.global.bcsMap[$item.data('context')]}]);
		},
		onContextSwitched: function($item) {
			if(window.location.hash.startsWith("#navigate/Models")){
				var sub = window.location.hash.slice("#navigate/Models/".length);
				this.$el.find('[data-context="' + sub + '"]').addClass('actived');
			    app.coop('breadcrumbs-change', [{href: 'Models', name: app.global.bcsMap['Models']}, {href: sub, name: app.global.bcsMap[sub]}]);

			}
		},
	});

})(Application);