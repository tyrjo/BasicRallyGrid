Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {
        this._createStore();
    },

    _createStore: function() {
        Ext.create('Rally.data.wsapi.Store', {
            model: 'User Story',
            autoLoad: true,
            listeners: {
                load: function(store, data, success) {
                    this._createGrid(store);
                },
                scope: this
            },
            fetch: ['FormattedId', 'Name', 'ScheduleState']
        });
    },

    _createGrid: function (store) {
        var myGrid = Ext.create('Rally.ui.grid.Grid', {
            store: store,
            columnCfgs: [
                'FormattedID', 'Name', 'ScheduleState'
            ],
            //renderTo: Ext.getBody(),
        });
        this.add(myGrid);
    }
});
