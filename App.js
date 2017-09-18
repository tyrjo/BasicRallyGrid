Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {
        var myStore = Ext.create('Rally.data.wsapi.Store', {
            model: 'User Story',
            autoLoad: true,
            listeners: {
                load: function(store, data, success) {
                    console.log("got data", data);
                    var myGrid = Ext.create('Rally.ui.grid.Grid', {
                        store: store,
                        columnCfgs: [
                            'FormattedID', 'Name', 'ScheduleState'
                        ],
                        //renderTo: Ext.getBody(),
                    });
                    this.add(myGrid);
                },
                scope: this
            },
            fetch: ['FormattedId', 'Name', 'ScheduleState']
        });
    }
});
