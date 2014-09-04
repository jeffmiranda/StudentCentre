// !Attendance Grid
StudentCentre.grid.StudentAttendance = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'studentcentre-grid-attendance'
        ,url: StudentCentre.config.connectorUrl
        ,baseParams: { action: 'mgr/attendance/scAttendanceGetList' }
        ,fields: ['id','location_id','location_name','student_id','username','scheduled_class_id','class_name','hours','test','date']
        ,paging: true
        ,remoteSort: true
        ,anchor: '97%'
        ,autoExpandColumn: 'username'
        ,save_action: 'mgr/attendance/scAttendanceUpdateFromGrid'
        ,autosave: true
        ,columns: [{
            header: _('studentcentre.id')
            ,hidden: false
            ,dataIndex: 'id'
            ,name: 'id'
            ,width: 30
        },{
            header: _('studentcentre.att_student_id')
            ,hidden: true
            ,dataIndex: 'student_id'
            ,name: 'student_id'
        },{
            header: _('studentcentre.att_location_id')
            ,hidden: true
            ,dataIndex: 'location_id'
            ,name: 'location_id'
        },{
            header: _('studentcentre.att_scheduled_class_id')
            ,hidden: true
            ,dataIndex: 'scheduled_class_id'
            ,name: 'scheduled_class_id'
        },{
            header: _('studentcentre.date')
            ,dataIndex: 'date'
            ,sortable: true
            ,width: 50
            ,name: 'date'
        },{
            header: _('studentcentre.username')
            ,dataIndex: 'username'
            ,sortable: true
            ,width: 50
        },{
            header: _('studentcentre.location')
            ,dataIndex: 'location_name'
            ,sortable: true
            ,width: 50
        },{
            header: _('studentcentre.att_class')
            ,dataIndex: 'class_name'
            ,sortable: true
            ,width: 50
        },{
            header: _('studentcentre.att_hours')
            ,dataIndex: 'hours'
            ,name: 'hours'
            ,sortable: true
            ,width: 50
            ,allowBlank: false
			,allowNegative: false
            ,editor: { xtype: 'numberfield' }
        },{
            header: _('studentcentre.att_test_pretest')
            ,dataIndex: 'test'
            ,name: 'test'
            ,sortable: true
            ,width: 50
            ,editor: { xtype: 'attendance-combo-tested', renderer: true}
        }]
        ,tbar:[{
            xtype: 'button'
            ,id: 'attendance-create-attendance-button'
            ,text: _('studentcentre.att_create_attendance')
            ,handler: { xtype: 'studentcentre-window-attendance-create', blankValues: true }
        },{
            xtype: 'button'
            ,id: 'attendance-update-attendance-button'
            ,text: _('studentcentre.update')
            ,listeners: {
                'click': {fn: this.updateAttendance, scope: this}
            }
        },{
            xtype: 'button'
            ,id: 'attendance-remove-attendance-button'
            ,text: _('studentcentre.remove')
            ,listeners: {
                'click': {fn: this.removeAttendance, scope: this}
            }
        },'->',{ // This defines the toolbar for the search
		    xtype: 'textfield' // Here we're defining the search field for the toolbar
		    ,id: 'attendance-search-filter'
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
            ,id: 'clear-attendance-search'
            ,text: _('studentcentre.ass_clear_search')
            ,listeners: {
                'click': {fn: this.clearAttendanceSearch, scope: this}
            }
        }]
    });
    StudentCentre.grid.StudentAttendance.superclass.constructor.call(this,config)
};
Ext.extend(StudentCentre.grid.StudentAttendance,MODx.grid.Grid,{
    search: function(tf,nv,ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,clearAttendanceSearch: function() {
	    this.getStore().baseParams = {
            action: 'mgr/attendance/scAttendanceGetList'
    	};
        Ext.getCmp('attendance-search-filter').reset();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,getMenu: function() { // MODX looks for getMenu when someone right-clicks on the grid
	    return [{
	        text: _('studentcentre.update')
	        ,handler: this.updateAttendance
	    },'-',{
	        text: _('studentcentre.remove')
	        ,handler: this.removeAttendance
	    }];
	}
	,updateAttendance: function(btn,e) {
		var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
        //console.log(selRow.data);
	    if (!this.updateAttendanceWindow) {
		    this.updateAttendanceWindow = MODx.load({
		        xtype: 'sc-window-attendance-update'
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
		this.updateAttendanceWindow.setValues(selRow.data);
		this.updateAttendanceWindow.show(e.target);
	}
	,removeAttendance: function() {
	    if (this.selModel.selections.items.length == 1) {
		    MODx.msg.confirm({
		        title: _('studentcentre.att_remove_attendance')
		        ,text: _('studentcentre.att_remove_attendance_text')
		        ,url: StudentCentre.config.connectorUrl
		        ,params: {
		            action: 'mgr/attendance/scAttendanceRemove'
		            ,id: this.selModel.selections.items[0].id
		        }
		        ,listeners: {
		            'success': {fn:this.refresh, scope:this}
		        }
		    });
		}
	}
});
Ext.reg('studentcentre-grid-attendance',StudentCentre.grid.StudentAttendance);


// !Tested Combobox
StudentCentre.combo.Tested = function(config) {
    config = config || {};
    Ext.applyIf(config, {
        store: new Ext.data.ArrayStore({
            id: 'attendance-combo-tested'
            ,fields: ['value','display']
            ,data: [
                [1,'Yes']
                ,[0,'No']
            ]
        })
        ,mode: 'local'
        ,displayField: 'display'
        ,valueField: 'value'
    });
    
    StudentCentre.combo.Tested.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.Tested, MODx.combo.ComboBox);
Ext.reg('attendance-combo-tested', StudentCentre.combo.Tested);


// !Create Attendance Window
StudentCentre.window.CreateAttendance = function(config) {
    config = config || {};
    var dateToday = new Date();
    Ext.applyIf(config,{
        title: _('studentcentre.att_create_attendance')
        ,width: '400'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,baseParams: {
            action: 'mgr/attendance/scAttendanceCreate'
        }
        ,fields: [{
            xtype: 'datefield'
            ,id: 'create-att-win-class-date'
            ,name: 'date'
            ,allowBlank: false
            ,fieldLabel: _('studentcentre.att_class_date')
            ,format: 'd/m/Y'
            ,value: dateToday
        },{
            xtype: 'attendance-combo-location' // this combobox is defined in attendancecreate.js
            ,fieldLabel: _('studentcentre.att_location')
            ,name: 'location'
		    ,hiddenName: 'location_id'
		    ,anchor: '100%'
		    ,listeners: {
	            select: { fn: this.getScheduledClasses, scope: this }
	        }
        },{
	        xtype: 'attendance-combo-scheduled-class' // this combobox is defined in attendancecreate.js
            ,id: 'create-att-win-scheduled-class'
            ,fieldLabel: _('studentcentre.att_class')
            ,name: 'scheduled_class_id'
		    ,hiddenName: 'scheduled_class_id'
		    ,anchor: '100%'
		    ,disabled: true
		    ,allowBlank: false
		    ,listeners: {
	            select: { fn: this.getEnrolledStudents, scope: this }
	        }
        },{
			xtype: 'attendance-combo-student-name'
			,id: 'create-att-win-student-name'
			,hiddenName: 'student_id'
			,anchor: '100%'
			,disabled: true
			,allowBlank: false
		},{
			xtype: 'numberfield'
			,id: 'create-att-win-hours'
			,name: 'hours'
			,allowBlank: false
			,allowNegative: false
			,fieldLabel: _('studentcentre.att_hours')
		},{
			xtype: 'xcheckbox'
			,fieldLabel: _('studentcentre.att_test_pretest')
			,name: 'test'
		}]
    });
    StudentCentre.window.CreateAttendance.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.CreateAttendance,MODx.Window,{
	// Load the Sched Class combobox with classes at a specific location
	getScheduledClasses: function(combo, value) {
		// Get the students combobox
		var cbStudents = Ext.getCmp('create-att-win-student-name');
		if (cbStudents) { // if the combobox was retrieved
        	cbStudents.setDisabled(true); // disable the combobox
            var d = cbStudents.store; // get the store
            d.removeAll(); // removes any existing records from the store
            d.load(); // load the store with data
            cbStudents.clearValue(); // clear the text value
        }
		// Get the Sched Class combobox
		var cbScheduledClass = Ext.getCmp('create-att-win-scheduled-class');
		if (cbScheduledClass) { // if the combobox was retrieved
        	cbScheduledClass.setDisabled(false); // enable the combobox
            var s = cbScheduledClass.store; // get the store
            s.baseParams['location_id'] = value.id; // set the location_id param
            s.removeAll(); // removes any existing records from the store
            s.load(); // load the store with data
            cbScheduledClass.clearValue(); // clear the text value
        }
    }
    // Load the Students combobox with students enrolled for the scheduled class
	,getEnrolledStudents: function(combo, value) {
		// Get the Students combobox
		var cbStudents = Ext.getCmp('create-att-win-student-name');
		if (cbStudents) { // if the combobox was retrieved
        	cbStudents.setDisabled(false); // enable the combobox
            var s = cbStudents.store; // get the store
            s.baseParams['scheduled_class_id'] = value.id; // set the scheduled_class_id param
            s.removeAll(); // removes any existing records from the store
            s.load(); // load the store with data
            cbStudents.clearValue(); // clear the text value
        }
        this._setHours(value);
    }
    ,_setHours: function(value) {
    	var schedClassId = value.id; // get the id from the selected sched class
    	// start the AJAX request and pass the sched class id to the processor
    	Ext.Ajax.request({
		   url: StudentCentre.config.connectorUrl
		   ,params: {
		        action: 'mgr/attendance/scScheduledClassGetList'
		        ,scheduled_class_id: schedClassId
		        ,activeOnly: 1
		    }
		   ,success: function(response, opts) { // upon success
		      	var responseObj = Ext.decode(response.responseText); // decode the JSON response text into an object
				if (0 < responseObj.results.length) { // if there was a class returned
					var schedClass = responseObj.results; // get the array from the response object
					var hours = Ext.getCmp('create-att-win-hours'); // get the hours field
					hours.setValue(schedClass[0].duration); // set the duration
				} else {
					// if there wasn't a scheduled class returned
					console.log('Could not retrieve a scheduled class ID!');
				}
		   }
		   ,failure: function(response, opts) {
		      console.log('server-side failure with status code ' + response.status);
		   }
		});
    }
});
Ext.reg('studentcentre-window-attendance-create',StudentCentre.window.CreateAttendance);


// !Update Attendance Window
StudentCentre.window.UpdateAttendance = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('studentcentre.att_update_attendance')
        ,width: '400'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,baseParams: {
            action: 'mgr/attendance/scAttendanceUpdate'
        }
        ,fields: [{
            xtype: 'hidden'
            ,name: 'id'
        },{
            xtype: 'displayfield'
            ,id: 'update-att-win-class-date'
            ,fieldLabel: _('studentcentre.att_class_date')
            ,name: 'date'
        },{
            xtype: 'displayfield'
            ,id: 'att-win-update-combobox-location'
            ,fieldLabel: _('studentcentre.att_location')
            ,name: 'location_name'
        },{
	        xtype: 'displayfield'
            ,id: 'update-att-win-scheduled-class'
            ,fieldLabel: _('studentcentre.att_class')
            ,name: 'class_name'
        },{
			xtype: 'displayfield'
			,id: 'update-att-win-student-name'
			,fieldLabel: _('studentcentre.username')
			,name: 'username'
		},{
			xtype: 'numberfield'
			,id: 'update-att-win-hours'
			,name: 'hours'
			,allowBlank: false
			,allowNegative: false
			,fieldLabel: _('studentcentre.att_hours')
		},{
			xtype: 'xcheckbox'
			,fieldLabel: _('studentcentre.att_test_pretest')
			,name: 'test'
		}]
    });
    StudentCentre.window.UpdateAttendance.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.UpdateAttendance,MODx.Window);
Ext.reg('sc-window-attendance-update',StudentCentre.window.UpdateAttendance);