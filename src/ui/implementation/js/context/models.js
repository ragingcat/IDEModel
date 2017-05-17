/**
 * Sample CONTEXT script.
 *
 * @author Stagejs.CLI
 * @created Mon Aug 29 2016 12:51:43 GMT-0700 (PDT)
 */
;(function(app){
    app.page('Models', {
        template: [
            '<div style="height: 100%; width: 100%; display: flex; flex-flow: row; justify-content: flex-start; position: relative;">',
                '<div style="flex: 0 0 220px;" view="Models.Menu"></div>',
                '<div style="flex: 0 0 3px;background-color: #ddd;"></div>',
                '<div style="flex: 1 1 0px; display: flex; flex-flow: column; justify-content: flex-start;" class="body">',
                    // '<div style="flex: 0 0 38px;" view="BreadCrumbs"></div>',
                    // '<div style="flex: 0 0 1px;background-color: #ddd;"></div>',
                    '<div style="flex: 1 1 0;" region="panel"></div>',
                '</div>',
            '</div>',
        ],
        // layout: {
        //     // split: ['220px:Devices.Menu', ['1:.body', ['37px:BreadCrumbs', '1:panel']]],
        //     split: ['220px:Devices.Menu', '1:.body'],
        //     dir: 'v',
        //     bars: {flex: '0 0 2px', 'background-color': '#ddd'},
        //     // bars: false
        // },
        navRegion: 'panel',
        actions: {
            'remove-filter': function(){
                //appearance
                this.$el.find('.search-filter-placeholder').removeClass('hidden');
                this.$el.find('.search-filter-active').addClass('hidden');
                //metadata
                this.onSearch('');
            },
        },
        initialize: function(){
            console.log('aa')
        },
        onNavigateTo: function(path){
        }

    });
})(Application);
