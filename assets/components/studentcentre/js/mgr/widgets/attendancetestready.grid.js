// !Test Ready Grid
StudentCentre.grid.TestReady = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'studentcentre-grid-test-ready'
        ,url: StudentCentre.config.connectorUrl
        ,baseParams: {
			action: 'mgr/attendance/scClassProgressGetList'
        	,testReadyOnly: 1
        }
        ,fields: ['id','student_id','class_id','level_id','student_name','class_name','level_name','hours_since_leveling','total_hours','last_modified']
        ,paging: true
        ,remoteSort: true
        ,anchor: '97%'
        ,columns: [{
            header: _('studentcentre.id')
            ,hidden: true
            ,dataIndex: 'id'
        },{
            header: _('studentcentre.att_student_id')
            ,hidden: true
            ,dataIndex: 'student_id'
            ,name: 'student_id'
        },{
            header: _('studentcentre.att_class_id')
            ,hidden: true
            ,dataIndex: 'class_id'
            ,name: 'class_id'
        },{
            header: _('studentcentre.ass_level_id')
            ,hidden: true
            ,dataIndex: 'level_id'
            ,name: 'level_id'
        },{
            header: _('studentcentre.att_student_name')
            ,dataIndex: 'student_name'
            ,sortable: true
            ,width: 50
        },{
            header: _('studentcentre.att_class')
            ,dataIndex: 'class_name'
            ,sortable: true
            ,width: 50
        },{
            header: _('studentcentre.att_level')
            ,dataIndex: 'level_name'
            ,sortable: true
            ,width: 50
        },{
            header: _('studentcentre.att_hours_since_leveling')
            ,dataIndex: 'hours_since_leveling'
            ,sortable: true
            ,width: 50
        },{
            header: _('studentcentre.att_total_hours')
            ,dataIndex: 'total_hours'
            ,sortable: true
            ,width: 50
        },{
            header: _('studentcentre.last_modified')
            ,dataIndex: 'last_modified'
            ,sortable: true
            ,width: 50
        }]
        ,tbar:[{
            xtype: 'button'
            ,id: 'attendance-start-test-button'
            ,text: _('studentcentre.att_start_test')
            ,listeners: {
                'click': {fn: this.startTest, scope: this}
            }
        },'->',{ // This defines the toolbar for the search
		    xtype: 'textfield' // Here we're defining the search field for the toolbar
		    ,id: 'test-ready-search-filter'
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
            ,id: 'clear-test-ready-search'
            ,text: _('studentcentre.ass_clear_search')
            ,listeners: {
                'click': {fn: this.clearTestReadySearch, scope: this}
            }
        }]
    });
    StudentCentre.grid.TestReady.superclass.constructor.call(this,config)
};
Ext.extend(StudentCentre.grid.TestReady,MODx.grid.Grid,{
    search: function(tf,nv,ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,clearTestReadySearch: function() {
	    this.getStore().baseParams = {
            action: 'mgr/attendance/scClassProgressGetList'
        	,testReadyOnly: 1
    	};
        Ext.getCmp('test-ready-search-filter').reset();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,startTest: function(btn,e) {
    
    	var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
        //console.log(selRow.data);
        strData = encodeURIComponent(Ext.util.JSON.encode(selRow.data));
        //console.log('String: '+strData);
        location.href = '?a='+StudentCentre.action+'&action=attendancetest&data='+strData;
    }
    ,getMenu: function() { // MODX looks for getMenu when someone right-clicks on the grid
	    return [{
	        text: _('studentcentre.att_start_test')
	        ,handler: this.startTest
	    }];
	}
});
Ext.reg('studentcentre-grid-test-ready',StudentCentre.grid.TestReady);


/*
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
            ,format: 'M d, Y'
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
	        xtype: 'attendance-combo-scheduled-class'
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
			,fieldLabel: _('studentcentre.att_testing')
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
    // Load the Sched Class combobox with classes at a specific location
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
		        action: 'mgr/attendance/scScheduledClassActiveGetList'
		        ,scheduled_class_id: schedClassId
		    }
		   ,success: function(response, opts) { // upon success
		      	var responseObj = Ext.decode(response.responseText); // decode the JSON response text into an object
				if (responseObj.total > 0) { // if there was a class returned
					var schedClass = responseObj.results; // get the array from the response object
					var hours = Ext.getCmp('create-att-win-hours'); // get the hours field
					hours.setValue(schedClass[0].class_duration); // set the duration
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
            xtype: 'datefield'
            ,id: 'update-att-win-class-date'
            ,name: 'date'
            ,allowBlank: false
            ,fieldLabel: _('studentcentre.att_class_date')
            ,format: 'M d, Y'
        },{
            xtype: 'attendance-combo-location' // this combobox is defined in attendancecreate.js
            ,id: 'att-win-update-combobox-location'
            ,fieldLabel: _('studentcentre.att_location')
            ,name: 'location'
		    ,hiddenName: 'location_id'
		    ,anchor: '100%'
		    ,listeners: {
	            select: { fn: this.getScheduledClasses, scope: this }
	        }
        },{
	        xtype: 'attendance-combo-scheduled-class'
            ,id: 'update-att-win-scheduled-class'
            ,fieldLabel: _('studentcentre.att_class')
            ,name: 'scheduled_class_id'
		    ,hiddenName: 'scheduled_class_id'
		    ,anchor: '100%'
		    ,allowBlank: false
		    ,disabled: true
		    ,listeners: {
	            select: { fn: this.getEnrolledStudents, scope: this }
	        }
        },{
			xtype: 'attendance-combo-student-name'
			,id: 'update-att-win-student-name'
			,hiddenName: 'student_id'
			,anchor: '100%'
			,allowBlank: false
			,disabled: true
		},{
			xtype: 'numberfield'
			,id: 'update-att-win-hours'
			,name: 'hours'
			,allowBlank: false
			,allowNegative: false
			,fieldLabel: _('studentcentre.att_hours')
		},{
			xtype: 'xcheckbox'
			,fieldLabel: _('studentcentre.att_testing')
			,name: 'test'
		}]
    });
    StudentCentre.window.UpdateAttendance.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.UpdateAttendance,MODx.Window, {
	// Load the Sched Class combobox with classes at a specific location
	getScheduledClasses: function(combo, value) {
		// Get the students combobox
		var cbStudents = Ext.getCmp('update-att-win-student-name');
		if (cbStudents) { // if the combobox was retrieved
        	cbStudents.setDisabled(true); // disable the combobox
            var d = cbStudents.store; // get the store
            d.removeAll(); // removes any existing records from the store
            d.load(); // load the store with data
            cbStudents.clearValue(); // clear the text value
        }
		// Get the Sched Class combobox
		var cbScheduledClass = Ext.getCmp('update-att-win-scheduled-class');
		if (cbScheduledClass) { // if the combobox was retrieved
        	cbScheduledClass.setDisabled(false); // enable the combobox
            var s = cbScheduledClass.store; // get the store
            s.baseParams['location_id'] = value.id; // set the location_id param
            s.removeAll(); // removes any existing records from the store
            s.load(); // load the store with data
            cbScheduledClass.clearValue(); // clear the text value
        }
    }
    // Load the Sched Class combobox with classes at a specific location
	,getEnrolledStudents: function(combo, value) {
		// Get the Students combobox
		var cbStudents = Ext.getCmp('update-att-win-student-name');
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
		        action: 'mgr/attendance/scScheduledClassActiveGetList'
		        ,scheduled_class_id: schedClassId
		    }
		   ,success: function(response, opts) { // upon success
		      	var responseObj = Ext.decode(response.responseText); // decode the JSON response text into an object
				if (responseObj.total > 0) { // if there was a class returned
					var schedClass = responseObj.results; // get the array from the response object
					var hours = Ext.getCmp('update-att-win-hours'); // get the hours field
					if (hours) {
						hours.setValue(schedClass[0].class_duration); // set the duration
					} else {
						// if the hours component doesn't exist
						console.log('Could not get the hours component!');
					}
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
Ext.reg('sc-window-attendance-update',StudentCentre.window.UpdateAttendance);
*/