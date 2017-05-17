;(function(app){

	app.setup({
		//navigate region for context
		navRegion: 'context',
		//setup layout
		layout: {
			split: ['4em:Header', '1:context'],
			bars: false
		},
		//default context
		//defaultContext: 'Status',
		//view source
		// viewSrcs: 'js', //set this to a folder path to enable view dynamic loading.
		//---------------------------------------------------------------------------------------------
		fullScreen: true, //this will put <body> to be full screen sized (window.innerHeight).
		//---------------------------------------------------------------------------------------------
		i18nTransFile: 'i18n.json', //can be {locale}.json
		i18nLocale: '', //if you really want to force the app to certain locale other than browser preference. (Still override-able by ?locale=.. in url)
		//---------------------------------------------------------------------------------------------
		//baseAjaxURI: '/api/v1', //modify this to fit your own backend apis. e.g index.php?q= or '/api'
		timeout: 5 * 60 * 1000 //general communication timeout (ms), e.g when using app.remote()
	});

	app.addInitializer(function(){
		app.global = app.global || {};
		app.global.bcsMap = {
				'Devices': 'Devices',
				'Devices.Indvs': 'Ungrouped Devices',
				'Devices.IndvsTable': 'Ungrouped Devices Table',
				'Devices.Groups': 'Saved Groups',
				'Devices.Groups.Temporary': 'Batch Config History',
				'Devices.Topo': 'Topology',
				'Devices.PhyPorts': 'Ports',
				'System': 'System',
				'System.SwitchPorts': 'Switch Ports',
				'admin': 'Admin',
				'time': 'Time',
				'license': 'License',
				'update': 'Update',
				'host-name': 'HostName',
		};
		app.global.product = 'ADC';
		if(!window.location.href.includes('#navigate')){
			window.location.href = '#navigate/Models/Models.Display';
		}
	});

	//hide cli view

	//get a hostname to show at the initial loading
	// app.addInitializer(function(){
	// 	return app.remote({
	// 		url: '/beta/api/devices',
	// 	}).done(function(data){
	// 		*
	// 		 * In data, the grouped devices always at the beginning, and single devices are at the end.
	// 		 * Therefore, fetch the last one in the array(a single device) as the default device
			 
	// 		/*app.navigate({
	// 			path: 'Status',
	// 			data: data[data.length - 1]
	// 		});*/
	// 		//cache in the global object
	// 		app.global = app.global || {};
	// 		app.global.cm = data;
	// 		//navigate to the new page
	// 		window.location.href = '#navigate/Devices/Devices.Indvs';
	// 	});
	// });


	// //fetch meta data
	// app.addInitializer(function(){
	// 	return app.remote({
	// 		url: '/beta/api/meta',
	// 		querys: {
	// 			id: app.param('hostname')
	// 		}
	// 	}).done(function(data){
	// 		app.global = app.global || {};
	// 		app.global.product = data.product;
	// 		app.global.model = app.global.platform = data.platform;
	// 		app.global.version = data.version;
	// 		// if(app.global.product && app.global.version){
	// 		// 	$('head title').text('Forti' + app.global.product + (app.global.model ? ('-' + app.global.model) : "") + " v" + app.global.version);
	// 		// }
	// 	});
	// });


})(Application);
