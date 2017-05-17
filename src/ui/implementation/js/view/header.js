;(function(app){

	var _currentView = '';
	app.view('Header', {
		template: '@view/header.html',
		coop:['context-switched'],
		actions: {
			goto: function($el){
				var context = $el.data('context');
				if( context ){
					app.navigate(context);
				}
			},
			'load-cm': function(){
				var Cm = app.get('Cm');
				(new Cm()).overlay({
					class: 'overlay-cm',
					effect: false
				});
				// (new CmHolder()).overlay({
				// 	class: 'overlay-cm',
				// 	effect: false
				// });
			}
		},
		onReady: function(){
			var that = this,
				flag = false;

			//initialize tooltip
			this.$el.find('[data-toggle="tooltip"]').tooltip();

			//for debugging cm.js
			// _.defer(function(){
			// 	that.$el.find('.cm-link-href').click();
			// });
		},
		onContextSwitched: function(ctx){
			_.defer(function(argument){
				this.$el.find('.active').removeClass('active');
				if(ctx === 'System'){
					this.$el.find('[data-context="System/System.SwitchPorts"]').addClass('active')
				}else if(ctx === 'Models'){
					this.$el.find('[data-context="Models/Models.IndvsTable"]').addClass('active')
				}else{
					this.$el.find('[data-context="' + ctx + '"]').addClass('active');
				}
			}.bind(this));
		}
	});
})(Application);