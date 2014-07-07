// !Locations Grid
StudentCentre.grid.AttendanceLocations = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'studentcentre-grid-attendance-locations'
        ,url: StudentCentre.config.connectorUrl
        ,baseParams: { action: 'mgr/attendance/scLocationGetList' }
        ,fields: ['id','name','description','address','active']
        ,paging: true
        ,remoteSort: true
        ,anchor: '97%'
        ,autoExpandColumn: 'name'
        ,save_action: 'mgr/attendance/scLocationUpdateFromGrid'
        ,autosave: true
        ,save_callback: this._updateLocationComboBoxes
        ,columns: [{
            header: _('studentcentre.id')
            ,hidden: true
            ,dataIndex: 'id'
            ,name: 'id'
        },{
            header: _('studentcentre.name')
            ,dataIndex: 'name'
            ,name: 'name'
            ,sortable: true
            ,width: 100
            ,editor: { xtype: 'textfield' }
        },{
            header: _('studentcentre.description')
            ,dataIndex: 'description'
            ,name: 'description'
            ,sortable: true
            ,width: 100
            ,editor: { xtype: 'textfield' }
        },{
            header: _('studentcentre.address')
            ,dataIndex: 'address'
            ,name: 'address'
            ,sortable: true
            ,width: 100
            ,editor: { xtype: 'textfield' }
        },{
            header: _('studentcentre.active')
            ,dataIndex: 'active'
            ,sortable: true
            ,width: 50
            ,editor: { xtype: 'attendance-combo-active-status', renderer: true}
        }]
        ,tbar:[{
            xtype: 'button'
            ,id: 'attendance-create-location-button'
            ,text: _('studentcentre.att_create_location')
            ,handler: { xtype: 'studentcentre-window-location-create', blankValues: true }
        },{
            xtype: 'button'
            ,id: 'attendance-update-location-button'
            ,text: _('studentcentre.update')
            ,listeners: {
                'click': {fn: this.updateLocation, scope: this}
            }
        },{
            xtype: 'button'
            ,id: 'attendance-location-active-toggle-button'
            ,text: _('studentcentre.toggle_active_status')
            ,handler: function(btn,e) {
                this.toggleActive(btn,e);
            }
            ,scope: this
        },'->',{ // This defines the toolbar for the search
		    xtype: 'textfield' // Here we're defining the search field for the toolbar
		    ,id: 'location-search-filter'
		    ,emptyText: _('studentcentre.search...')
		    ,listeners: {
		        'change': {fn:this.search,scope:this}
		        ,'render': {fn: function(cmp) {
		            new Ext.KeyMap(cmp.getEl(), {
		                key: Ext.EventObject.ENTER
		                ,fn: function() {
		                    this.fireEvent('change',this);
		                    this.blur();
		                    return true;
		                }
		                ,scope: cmp
		            });
		        },scope:this}
		    }
		},{
            xtype: 'button'
            ,id: 'clear-location-search'
            ,text: _('studentcentre.clear_search')
            ,listeners: {
                'click': {fn: this.clearSearch, scope: this}
            }
        }]
    });
    StudentCentre.grid.AttendanceLocations.superclass.constructor.call(this,config)
};
Ext.extend(StudentCentre.grid.AttendanceLocations,MODx.grid.Grid,{
    search: function(tf,nv,ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,clearSearch: function() {
	    this.getStore().baseParams = {
            action: 'mgr/attendance/scLocationGetList'
    	};
        Ext.getCmp('location-search-filter').reset();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,getMenu: function() { // MODX looks for getMenu when someone right-clicks on the grid
	    return [{
	        text: _('studentcentre.update')
	        ,handler: this.updateLocation
	    },'-',{
	        text: _('studentcentre.toggle_active_status')
	        ,handler: this.toggleActive
	    }];
	}
	,updateLocation: function(btn,e) {
		var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
        //console.log(selRow.data);
	    if (!this.updateLocationWindow) {
		    this.updateLocationWindow = MODx.load({
		        xtype: 'sc-window-location-update'
		        ,record: selRow.data
		        ,listeners: {
		            'success': {
		            	fn:function(r){
		            		this.refresh();
		            		this.getSelectionModel().clearSelections(true);
		            		this._updateLocationComboBoxes();
		            	},scope:this
		            }
		        }
		    });
	    }
		this.updateLocationWindow.setValues(selRow.data);
		this.updateLocationWindow.show(e.target);
	}
	,toggleActive: function(btn,e) {
        var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
        MODx.Ajax.request({
            url: this.config.url
            ,params: {
                action: 'mgr/attendance/scLocationUpdate'
                ,id: selRow.data.id
                ,toggleActive: 1
            }
            ,listeners: {
                'success': {fn:function(r) {
                    this.refresh();
                    Ext.getCmp('studentcentre-grid-attendance-locations').refresh();
                    this._updateLocationComboBoxes();
                },scope:this}
            }
        });
        return true;
    }
    // used to reload the Location comboboxes in the other grid
    ,_updateLocationComboBoxes: function() {
	    var cbLocation = new Array();
        cbLocation[0] = Ext.getCmp('attendance-create-scheduled-class-location-combo');
        for (var i=0; i<cbLocation.length; i++) {
	    	if (cbLocation[i]) {
	        	cbLocation[i].setDisabled(false);
	            var s = cbLocation[i].store;
	            s.removeAll();
	            s.load();
	            cbLocation[i].clearValue();
	        }
        }
    }
});
Ext.reg('studentcentre-grid-attendance-locations',StudentCentre.grid.AttendanceLocations);


// !Active Combobox
// xtype 'attendance-combo-active-status' is defined in level categories list

// !Create Location Window
StudentCentre.window.CreateLocation = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('studentcentre.att_create_location')
        ,width: '400'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,baseParams: {
            action: 'mgr/attendance/scLocationCreate'
        }
        ,fields: [{
            xtype: 'textfield'
            ,fieldLabel: _('studentcentre.name')
            ,name: 'name'
            ,anchor: '100%'
        },{
            xtype: 'textfield'
            ,fieldLabel: _('studentcentre.description')
            ,name: 'description'
            ,anchor: '100%'
        },{
            xtype: 'textfield'
            ,fieldLabel: _('studentcentre.address')
            ,name: 'address'
            ,anchor: '100%'
        }]
    });
    StudentCentre.window.CreateLocation.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.CreateLocation,MODx.Window);
Ext.reg('studentcentre-window-location-create',StudentCentre.window.CreateLocation);


// !Update Window
StudentCentre.window.UpdateLocation = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('studentcentre.att_update_location')
        ,width: '400'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,baseParams: {
            action: 'mgr/attendance/scLocationUpdate'
        }
        ,fields: [{
            xtype: 'hidden'
            ,name: 'id'
        },{
            xtype: 'textfield'
            ,fieldLabel: _('studentcentre.name')
            ,name: 'name'
            ,anchor: '100%'
        },{
            xtype: 'textfield'
            ,fieldLabel: _('studentcentre.description')
            ,name: 'description'
            ,anchor: '100%'
        },{
            xtype: 'textfield'
            ,fieldLabel: _('studentcentre.address')
            ,name: 'address'
            ,anchor: '100%'
        },{
            xtype: 'attendance-combo-active-status'
            ,fieldLabel: _('studentcentre.active')
            ,name: 'active'
            ,hiddenName: 'active'
            ,anchor: '100%'
        }]
    });
    StudentCentre.window.UpdateLocation.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.UpdateLocation,MODx.Window);
Ext.reg('sc-window-location-update',StudentCentre.window.UpdateLocation);