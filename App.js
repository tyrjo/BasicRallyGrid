Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items: [
        {
            xtype: 'container',
            itemId: 'pulldown-container',
            layout: {
                type: 'hbox',
                align: 'stretch'
            }
        }
    ],

    launch: function () {
        this._loadIterations();
    },

    _loadIterations: function () {
        var iterComboBox = {
            xtype: 'rallyiterationcombobox',
            itemId: 'iteration-combobox',
            fieldLabel: 'Iteration',
            labelAlign: 'right',
            listeners: {
                ready: this._loadUsers,
                select: this._loadData,
                scope: this
            }
        };
        this.down('#pulldown-container').add(iterComboBox);
    },

    _loadUsers: function () {
        var usersComboBox = {
            xtype: 'rallyfieldvaluecombobox',
            itemId: 'user-combobox',
            model: 'User Story',
            field: 'Owner',
            fieldLabel: 'Owner',
            labelAlign: 'right',
            listeners: {
                ready: this._loadData,
                select: this._loadData,
                scope: this
            }
        };
        this.down('#pulldown-container').add(usersComboBox);
    },

    _getFilters: function(iterationRef, ownerRef) {
        var filters = Ext.create('Rally.data.wsapi.Filter', {
            property: 'Iteration',
            operation: '=',
            value: iterationRef
        });
        if (ownerRef) {
            var ownerFilter = Ext.create('Rally.data.wsapi.Filter', {
                property: 'Owner',
                operation: '=',
                value: ownerRef
            });
            filters = filters.and(ownerFilter);
        }
        return filters;
    },

    _loadData: function () {
        var selectedIterRef = this.down('#iteration-combobox').getRecord().get('_ref');
        var selectedOwnerRef = this.down('#user-combobox').getValue();
        var filters = this._getFilters(selectedIterRef, selectedOwnerRef);

        if (selectedOwnerRef) {
            var ownerFilter = Ext.create('Rally.data.wsapi.Filter', {
                property: 'Owner',
                operation: '=',
                value: selectedOwnerRef
            });
            filters = filters.and(ownerFilter);
        }
        if (this.userStoryStore) {
            this.userStoryStore.setFilter(filters);
            this.userStoryStore.load();
        } else {
            this.userStoryStore = Ext.create('Rally.data.wsapi.Store', {
                model: 'User Story',
                autoLoad: true,
                pageSize: 25,
                filters: filters,
                listeners: {
                    load: this._onStoreLoad,
                    scope: this
                },
                fetch: ['FormattedId', 'Name', 'ScheduleState', 'Iteration', 'Owner']
            });
        }
    },

    _onStoreLoad: function(store) {
        if (!this.myGrid) {
            this._createGrid(store);
        }
    },

    _createGrid: function (store) {
        this.myGrid = {
            xtype: 'rallygrid',
            store: store,
            columnCfgs: [
                'FormattedID', 'Name', 'ScheduleState', 'Owner'
            ],
        };
        this.add(this.myGrid);
    }
});
