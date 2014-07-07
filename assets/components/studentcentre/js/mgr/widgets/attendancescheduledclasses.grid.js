// !Scheduled Classes Grid
StudentCentre.grid.AttendanceScheduledClasses = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'studentcentre-grid-attendance-scheduled-classes'
        ,url: StudentCentre.config.connectorUrl
        ,baseParams: { action: 'mgr/attendance/scScheduledClassGetList'/* , scheduled_class_id: 11 */ }
        ,fields: ['id', 'class_id', 'location_id', 'class_name', 'location_name', 'duration', 'description', 'start_date', 'end_date', 'active']
        ,paging: true
        ,pageSize: 30
        ,remoteSort: true
        ,anchor: '97%'
        ,autoExpandColumn: 'class_name'
        ,sortBy: 'class_id'
        ,grouping: true
        ,groupBy: 'class_name'
        ,pluralText: 'Classes'
        ,singleText: 'Class'
        ,save_action: 'mgr/attendance/scScheduledClassUpdateFromGrid'
        ,autosave: true
        ,columns: [{
            header: 'id'
            ,hidden: false
            ,dataIndex: 'id'
            ,sortable: true
            ,name: 'id'
        },{
            header: 'class_id'
            ,hidden: true
            ,dataIndex: 'class_id'
            ,name: 'class_id'
        },{
            header: 'location_id'
            ,hidden: true
            ,dataIndex: 'location_id'
            ,name: 'location_id'
        },{
            header: _('studentcentre.class')
            ,dataIndex: 'class_name'
            ,name: 'class_name'
            ,sortable: true
            ,width: 100
        },{
            header: _('studentcentre.location')
            ,dataIndex: 'location_name'
            ,name: 'location_name'
            ,sortable: true
            ,width: 100
        },{
            header: _('studentcentre.description')
            ,dataIndex: 'description'
            ,name: 'description'
            ,sortable: false
            ,width: 100
            ,editor: { xtype: 'textfield' }
        },{
            header: _('studentcentre.duration')
            ,dataIndex: 'duration'
            ,name: 'duration'
            ,sortable: false
            ,width: 100
            ,editor: { xtype: 'numberfield' }
        },{
            header: _('studentcentre.first_class')
            ,dataIndex: 'start_date'
            ,name: 'start_date'
            ,sortable: false
            ,width: 100
        },{
            header: _('studentcentre.last_class')
            ,dataIndex: 'end_date'
            ,name: 'end_date'
            ,sortable: false
            ,width: 100
        },{
            header: _('studentcentre.active')
            ,dataIndex: 'active'
            ,sortable: true
            ,width: 50
            ,editor: { xtype: 'attendance-combo-active-status', renderer: true}
        }]
        ,tbar:[{
            xtype: 'button'
            ,id: 'attendance-create-scheduled-class-button'
            ,text: _('studentcentre.schedule_class')
            ,handler: { xtype: 'studentcentre-window-scheduled-class-create', blankValues: true }
        },{
            xtype: 'button'
            ,id: 'attendance-update-scheduled-class-button'
            ,text: _('studentcentre.update')
            ,listeners: {
                'click': {fn: this.updateScheduledClass, scope: this}
            }
        },{
            xtype: 'button'
            ,id: 'attendance-scheduled-class-active-toggle-button'
            ,text: _('studentcentre.toggle_active_status')
            ,handler: function(btn,e) {
                this.toggleActive(btn,e);
            }
            ,scope: this
        },'->',{ // This defines the toolbar for the search
		    xtype: 'textfield' // Here we're defining the search field for the toolbar
		    ,id: 'scheduled-class-search-filter'
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
            ,id: 'clear-scheduled-class-search'
            ,text: _('studentcentre.clear_search')
            ,listeners: {
                'click': {fn: this.clearSearch, scope: this}
            }
        }]
    });
    StudentCentre.grid.AttendanceScheduledClasses.superclass.constructor.call(this,config)
};
Ext.extend(StudentCentre.grid.AttendanceScheduledClasses,MODx.grid.Grid,{
    search: function(tf,nv,ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,clearSearch: function() {
	    this.getStore().baseParams = {
            action: 'mgr/attendance/scScheduledClassGetList'
    	};
        Ext.getCmp('scheduled-class-search-filter').reset();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,getMenu: function() { // MODX looks for getMenu when someone right-clicks on the grid
	    return [{
	        text: _('studentcentre.update')
	        ,handler: this.updateScheduledClass
	    },'-',{
	        text: _('studentcentre.toggle_active_status')
	        ,handler: this.toggleActive
	    }];
	}
	,updateScheduledClass: function(btn,e) {
		var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
	    if (!this.updateScheduledClassWindow) {
		    this.updateScheduledClassWindow = MODx.load({
		        xtype: 'sc-window-scheduled-class-update'
		        ,record: selRow.data
		        ,listeners: {
		            'success': {
		            	fn:function(r){
		            		this.refresh();
		            		this.getSelectionModel().clearSelections(true);
		            	},scope:this
		            }
		        }
		    });
	    }
		this.updateScheduledClassWindow.setValues(selRow.data);
		this.updateScheduledClassWindow.show(e.target);
	}
	,toggleActive: function(btn,e) {
        var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
        MODx.Ajax.request({
            url: this.config.url
            ,params: {
                action: 'mgr/attendance/scScheduledClassUpdate'
                ,id: selRow.data.id
                ,toggleActive: 1
            }
            ,listeners: {
                'success': {fn:function(r) {
                    this.refresh();
                    Ext.getCmp('studentcentre-grid-attendance-scheduled-classes').refresh();
                    this._updateScheduledClassComboBoxes();
                },scope:this}
            }
        });
        return true;
    }
    // used to reload the Scheduled Class comboboxes in other grids
    ,_updateScheduledClassComboBoxes: function() {
	    var cbScheduledClass = new Array();
        cbScheduledClass[0] = Ext.getCmp('attendance-create-class-enrollment-scheduled-class-combo');
        for (var i=0; i<cbScheduledClass.length; i++) {
	    	if (cbScheduledClass[i]) {
	        	cbScheduledClass[i].setDisabled(false);
	            var s = cbScheduledClass[i].store;
	            s.removeAll();
	            s.load();
	            cbScheduledClass[i].clearValue();
	        }
        }
    }
});
Ext.reg('studentcentre-grid-attendance-scheduled-classes',StudentCentre.grid.AttendanceScheduledClasses);


// !Class Combobox
StudentCentre.combo.ScheduledClassGridClassName = function(config) {
    config = config || {};
    Ext.applyIf(config, {
    	fieldLabel: _('studentcentre.class')
	    ,width: 300
	    ,hiddenName: 'class_id'
	    ,hiddenValue: ''
	    ,emptyText: 'Select class...'
	    ,typeAhead: true
	    ,valueField: 'id'
	    ,displayField: 'name'
	    ,fields: ['id', 'name']
	    ,pageSize: 20
	    ,url: StudentCentre.config.connectorUrl
	    ,baseParams: {
	        action: 'mgr/attendance/scClassGetList'
	    }
    });
    
    StudentCentre.combo.ScheduledClassGridClassName.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.ScheduledClassGridClassName, MODx.combo.ComboBox);
Ext.reg('attendance-class-name-combo', StudentCentre.combo.ScheduledClassGridClassName);


// !Location Combobox
/*
StudentCentre.combo.ScheduledClassGridLocationName = function(config) {
    config = config || {};
    Ext.applyIf(config, {
    	fieldLabel: _('studentcentre.location')
	    ,width: 300
	    ,hiddenName: 'location_id'
	    ,hiddenValue: ''
	    ,emptyText: 'Select location...'
	    ,typeAhead: true
	    ,valueField: 'id'
	    ,displayField: 'name'
	    ,fields: ['id', 'name']
	    ,pageSize: 20
	    ,url: StudentCentre.config.connectorUrl
	    ,baseParams: {
	        action: 'mgr/attendance/scLocationGetList'
	    }
    });
    
    StudentCentre.combo.ScheduledClassGridLocationName.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.ScheduledClassGridLocationName, MODx.combo.ComboBox);
Ext.reg('attendance-location-name-combo', StudentCentre.combo.ScheduledClassGridLocationName);
*/


// !Weekday Combobox
StudentCentre.combo.Weekday = function(config) {
    config = config || {};
    Ext.applyIf(config, {
        store: new Ext.data.ArrayStore({
            id: 'attendance-combo-weekday'
            ,fields: ['value','display']
            ,data: [
                ['Monday','Monday']
                ,['Tuesday','Tuesday']
                ,['Wednesday','Wednesday']
                ,['Thursday','Thursday']
                ,['Friday','Friday']
                ,['Saturday','Saturday']
                ,['Sunday','Sunday']
            ]
        })
        ,mode: 'local'
        ,displayField: 'display'
        ,valueField: 'value'
    });
    
    StudentCentre.combo.Weekday.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.Weekday, MODx.combo.ComboBox);
Ext.reg('attendance-combo-weekday', StudentCentre.combo.Weekday);


// !Create Window
StudentCentre.window.CreateScheduledClass = function(config) {
    config = config || {};
    var dateToday = new Date();
    Ext.applyIf(config,{
        title: _('studentcentre.schedule_class')
        ,width: '400'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,baseParams: {
            action: 'mgr/attendance/scScheduledClassCreate'
        }
        ,fields: [{
            xtype: 'attendance-class-name-combo'
            ,id: 'attendance-create-scheduled-class-class-combo'
            ,name: 'class_id'
            ,hiddenName: 'class_id'
            ,anchor: '100%'
	        ,baseParams: {
		        action: 'mgr/attendance/scClassGetList'
		        ,activeOnly: 1
		    }
        },{
            xtype: 'attendance-combo-location'
            ,id: 'attendance-create-scheduled-class-location-combo'
            ,name: 'location_id'
            ,hiddenName: 'location_id'
            ,anchor: '100%'
	        ,baseParams: {
		        action: 'mgr/attendance/scLocationGetList'
		        ,activeOnly: 1
		    }
        },{
            xtype: 'textfield'
            ,name: 'description'
            ,allowBlank: true
            ,maxLength: 20
            ,fieldLabel: _('studentcentre.description')
        },{
            xtype: 'numberfield'
            ,fieldLabel: _('studentcentre.duration_hours')
            ,name: 'duration'
            ,anchor: '100%'
        },{
            xtype: 'datefield'
            ,name: 'start_date'
            ,fieldLabel: _('studentcentre.first_class')
            ,format: 'd/m/Y'
        },{
            xtype: 'datefield'
            ,name: 'end_date'
            ,fieldLabel: _('studentcentre.last_class')
            ,format: 'd/m/Y'
        }]
    });
    StudentCentre.window.CreateScheduledClass.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.CreateScheduledClass,MODx.Window);
Ext.reg('studentcentre-window-scheduled-class-create',StudentCentre.window.CreateScheduledClass);


// !Update Window
StudentCentre.window.UpdateScheduledClass = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('studentcentre.update')
        ,width: '400'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,baseParams: {
            action: 'mgr/attendance/scScheduledClassUpdate'
        }
        ,fields: [{
            xtype: 'hidden'
            ,name: 'id'
        },{
            xtype: 'attendance-class-name-combo'
            ,id: 'attendance-update-scheduled-class-class-combo'
            ,name: 'class_id'
            ,hiddenName: 'class_id'
            ,anchor: '100%'
	        ,baseParams: {
		        action: 'mgr/attendance/scClassGetList'
		    }
        },{
            xtype: 'attendance-combo-location'
            ,id: 'attendance-update-scheduled-class-location-combo'
            ,name: 'location_id'
            ,hiddenName: 'location_id'
            ,anchor: '100%'
	        ,baseParams: {
		        action: 'mgr/attendance/scLocationGetList'
		    }
        },{
            xtype: 'textfield'
            ,name: 'description'
            ,allowBlank: true
            ,maxLength: 20
            ,fieldLabel: _('studentcentre.description')
        },{
            xtype: 'numberfield'
            ,fieldLabel: _('studentcentre.duration_hours')
            ,name: 'duration'
            ,anchor: '100%'
        },{
            xtype: 'datefield'
            ,name: 'start_date'
            ,allowBlank: true
            ,fieldLabel: _('studentcentre.first_class')
            ,format: 'd/m/Y'
        },{
            xtype: 'datefield'
            ,name: 'end_date'
            ,allowBlank: true
            ,fieldLabel: _('studentcentre.last_class')
            ,format: 'd/m/Y'
        },{
            xtype: 'attendance-combo-active-status'
            ,fieldLabel: _('studentcentre.active')
            ,name: 'active'
            ,hiddenName: 'active'
            ,anchor: '100%'
        }]
    });
    StudentCentre.window.UpdateScheduledClass.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.UpdateScheduledClass,MODx.Window);
Ext.reg('sc-window-scheduled-class-update',StudentCentre.window.UpdateScheduledClass);