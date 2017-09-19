Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {
        this.pulldownContainer = Ext.create('Ext.container.Container', {
            layout: {
                type: 'hbox',
                align: 'stretch'
            }
        });
        this.add(this.pulldownContainer);
        this._loadIterations();
    },

    _loadIterations: function() {
        this.iterComboBox = Ext.create('Rally.ui.combobox.IterationComboBox', {
            listeners: {
                ready: function(comboBox, newValue) {
                    this._loadUsers();
                },
                select: function() {
                    this._loadData();
                },
                scope: this
            }
        });
        this.pulldownContainer.add(this.iterComboBox);
    },

    _loadUsers: function() {
        this.usersComboBox = Ext.create('Rally.ui.combobox.FieldValueComboBox', {
            model: 'User Story',
            field: 'Owner',
            listeners: {
                ready: function(comboBox, newValue) {
                    this._loadData();
                },
                select: function() {
                    this._loadData();
                },
                scope: this
            }
        });
        this.pulldownContainer.add(this.usersComboBox);
    },

    _loadData: function() {
        var selectedIterRef = this.iterComboBox.getRecord().get('_ref');
        var selectedOwnerRef = this.usersComboBox.getValue();
        var filters = [
            {
                property: 'Iteration',
                operation: '=',
                value: selectedIterRef
            }
        ];
        if ( selectedOwnerRef ) {
            filters.push({
                property: 'Owner',
                operation: '=',
                value: selectedOwnerRef
            });
        }

        if ( this.userStoryStore ) {
            this.userStoryStore.setFilter(filters);
            this.userStoryStore.load();
        } else {
            this.userStoryStore = Ext.create('Rally.data.wsapi.Store', {
                model: 'User Story',
                autoLoad: true,
                pageSize: 25,
                filters: filters,
                listeners: {
                    load: function(store, data, success) {
                        if (!this.myGrid) {
                            this._createGrid(store);
                        }
                    },
                    scope: this
                },
                fetch: ['FormattedId', 'Name', 'ScheduleState', 'Iteration', 'Owner']
            });
        }
    },

    _createGrid: function(store) {
        this.myGrid = Ext.create('Rally.ui.grid.Grid', {
            store: store,
            columnCfgs: [
                'FormattedID', 'Name', 'ScheduleState', 'Owner'
            ],
        });
        this.add(this.myGrid);
    }
});
