// !Enrollments Grid
StudentCentre.grid.AttendanceClassEnrollments = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'studentcentre-grid-attendance-class-enrollments'
        ,url: StudentCentre.config.connectorUrl
        ,baseParams: { action: 'mgr/attendance/scClassEnrollmentGetList' }
        ,fields: ['id', 'student_id', 'scheduled_class_id', 'student_name', 'class_name', 'description', 'location_name', 'day', 'date_created', 'active']
        ,paging: true
        ,remoteSort: true
        ,anchor: '97%'
        ,autoExpandColumn: 'student_name'
        ,sortBy: 'scheduled_class_id'
        ,grouping: true
        ,groupBy: 'class_name'
        ,pluralText: 'Students'
        ,singleText: 'Student'
        ,save_action: 'mgr/attendance/scClassEnrollmentUpdateFromGrid'
        ,autosave: true
        ,columns: [{
            header: 'id'
            ,hidden: true
            ,dataIndex: 'id'
            ,name: 'id'
        },{
            header: 'student_id'
            ,hidden: true
            ,dataIndex: 'student_id'
            ,name: 'student_id'
        },{
            header: 'scheduled_class_id'
            ,hidden: true
            ,dataIndex: 'scheduled_class_id'
            ,name: 'scheduled_class_id'
        },{
            header: _('studentcentre.student_name')
            ,dataIndex: 'student_name'
            ,name: 'student_name'
            ,sortable: true
            ,width: 100
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
            ,sortable: true
            ,width: 100
        },{
        	header: _('studentcentre.enrolled')
        	,dataIndex: 'date_created'
        	,name: 'date_created'
        	,sortable: true
        	,width: 100
        },{
            header: _('studentcentre.active')
            ,dataIndex: 'active'
            ,sortable: true
            ,width: 50
            ,editor: { xtype: 'attendance-combo-active-status', renderer: true} // active combobox defined in Level Categories grid
        }]
        ,tbar:[{
            xtype: 'button'
            ,id: 'attendance-create-class-enrollment-button'
            ,text: _('studentcentre.enroll_student')
            ,handler: { xtype: 'studentcentre-window-class-enrollment-create', blankValues: true }
        },{
            xtype: 'button'
            ,id: 'attendance-update-class-enrollment-button'
            ,text: _('studentcentre.update')
            ,listeners: {
                'click': {fn: this.updateClassEnrollment, scope: this}
            }
        },{
            xtype: 'button'
            ,id: 'attendance-class-enrollment-active-toggle-button'
            ,text: _('studentcentre.toggle_active_status')
            ,handler: function(btn,e) {
                this.toggleActive(btn,e);
            }
            ,scope: this
        },'->',{ // This defines the toolbar for the search
		    xtype: 'textfield' // Here we're defining the search field for the toolbar
		    ,id: 'class-enrollment-search-filter'
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
            ,id: 'clear-class-enrollment-search'
            ,text: _('studentcentre.clear_search')
            ,listeners: {
                'click': {fn: this.clearSearch, scope: this}
            }
        }]
    });
    StudentCentre.grid.AttendanceClassEnrollments.superclass.constructor.call(this,config)
};
Ext.extend(StudentCentre.grid.AttendanceClassEnrollments,MODx.grid.Grid,{
    search: function(tf,nv,ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,clearSearch: function() {
	    this.getStore().baseParams = {
            action: 'mgr/attendance/scClassEnrollmentGetList'
    	};
        Ext.getCmp('class-enrollment-search-filter').reset();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,getMenu: function() { // MODX looks for getMenu when someone right-clicks on the grid
	    return [{
	        text: _('studentcentre.update')
	        ,handler: this.updateClassEnrollment
	    },'-',{
	        text: _('studentcentre.toggle_active_status')
	        ,handler: this.toggleActive
	    }];
	}
	,updateClassEnrollment: function(btn,e) {
		var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
	    if (!this.updateClassEnrollmentWindow) {
		    this.updateClassEnrollmentWindow = MODx.load({
		        xtype: 'sc-window-class-enrollment-update'
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
		this.updateClassEnrollmentWindow.setValues(selRow.data);
		this.updateClassEnrollmentWindow.show(e.target);
	}
	,toggleActive: function(btn,e) {
        var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
        MODx.Ajax.request({
            url: this.config.url
            ,params: {
                action: 'mgr/attendance/scClassEnrollmentUpdate'
                ,id: selRow.data.id
                ,toggleActive: 1
            }
            ,listeners: {
                'success': {fn:function(r) {
                    this.refresh();
                    Ext.getCmp('studentcentre-grid-attendance-class-enrollments').refresh();
                    //this._updateClassEnrollmentComboBoxes();
                },scope:this}
            }
        });
        return true;
    }
    // used to reload the Class Enrollment comboboxes in other grids
/*
    ,_updateClassEnrollmentComboBoxes: function() {
	    var cbClassEnrollment = new Array();
        cbClassEnrollment[0] = Ext.getCmp('PUT THE ID OF THE COMBOBOX HERE');
        for (var i=0; i<cbClassEnrollment.length; i++) {
	    	if (cbClassEnrollment[i]) {
	        	cbClassEnrollment[i].setDisabled(false);
	            var s = cbClassEnrollment[i].store;
	            s.removeAll();
	            s.load();
	            cbClassEnrollment[i].clearValue();
	        }
        }
    }
*/
});
Ext.reg('studentcentre-grid-attendance-class-enrollments',StudentCentre.grid.AttendanceClassEnrollments);

// !Student combobox defined in attendancecreate.js
// xtype: attendance-combo-student-name

// !Scheduled Class Combobox
StudentCentre.combo.ClassEnrollmentGridScheduledClass = function(config) {
    config = config || {};
    Ext.applyIf(config, {
    	fieldLabel: _('studentcentre.class')
	    ,width: 300
	    ,hiddenName: 'scheduled_class_id'
	    ,hiddenValue: ''
	    ,emptyText: 'Select class...'
	    ,typeAhead: true
	    ,valueField: 'id'
	    ,displayField: 'class_name_description'
	    ,fields: ['id', 'class_name_description']
	    ,pageSize: 30
	    ,url: StudentCentre.config.connectorUrl
	    ,baseParams: {
	        action: 'mgr/attendance/scScheduledClassGetList'
	    }
    });
    
    StudentCentre.combo.ClassEnrollmentGridScheduledClass.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.ClassEnrollmentGridScheduledClass, MODx.combo.ComboBox);
Ext.reg('attendance-scheduled-class-name-combo', StudentCentre.combo.ClassEnrollmentGridScheduledClass);


// !Create Window
StudentCentre.window.CreateClassEnrollment = function(config) {
    config = config || {};
    var dateToday = new Date();
    Ext.applyIf(config,{
        title: _('studentcentre.enroll_student')
        ,width: '400'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,baseParams: {
            action: 'mgr/attendance/scClassEnrollmentCreate'
        }
        ,fields: [{
            xtype: 'attendance-combo-student-name'
            ,id: 'attendance-create-class-enrollment-student-combo'
            ,anchor: '100%'
        },{
            xtype: 'attendance-scheduled-class-name-combo'
            ,id: 'attendance-create-class-enrollment-scheduled-class-combo'
            ,name: 'scheduled_class_id'
            ,hiddenName: 'scheduled_class_id'
            ,anchor: '100%'
	        ,baseParams: {
		        action: 'mgr/attendance/scScheduledClassGetList'
		        ,activeOnly: 1
		    }
        }/*
,{
            xtype: 'datefield'
            ,name: 'start_date'
            ,allowBlank: false
            ,fieldLabel: _('studentcentre.first_class')
            ,format: 'd/m/Y'
            ,value: dateToday
        },{
            xtype: 'datefield'
            ,name: 'end_date'
            ,allowBlank: false
            ,fieldLabel: _('studentcentre.last_class')
            ,format: 'd/m/Y'
            ,value: dateToday
        },{
            xtype: 'timefield'
            ,name: 'start_time'
            ,allowBlank: false
            ,fieldLabel: _('studentcentre.start_time')
        },{
            xtype: 'timefield'
            ,name: 'end_time'
            ,allowBlank: false
            ,fieldLabel: _('studentcentre.end_time')
        },{
            xtype: 'attendance-combo-weekday'
            ,fieldLabel: _('studentcentre.day')
            ,name: 'day'
            ,anchor: '100%'
        }
*/]
    });
    StudentCentre.window.CreateClassEnrollment.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.CreateClassEnrollment,MODx.Window);
Ext.reg('studentcentre-window-class-enrollment-create',StudentCentre.window.CreateClassEnrollment);


// !Update Window
StudentCentre.window.UpdateClassEnrollment = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('studentcentre.update')
        ,width: '400'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,baseParams: {
            action: 'mgr/attendance/scClassEnrollmentUpdate'
        }
        ,fields: [{
            xtype: 'hidden'
            ,name: 'id'
        },{
            xtype: 'displayfield'
            ,fieldLabel: _('studentcentre.student_name')
            ,name: 'student_name'
        },{
            xtype: 'displayfield'
            ,fieldLabel: _('studentcentre.class')
            ,name: 'class_name'
        },{
            xtype: 'attendance-combo-active-status'
            ,fieldLabel: _('studentcentre.active')
            ,name: 'active'
            ,hiddenName: 'active'
            ,anchor: '100%'
        }]
    });
    StudentCentre.window.UpdateClassEnrollment.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.UpdateClassEnrollment,MODx.Window);
Ext.reg('sc-window-class-enrollment-update',StudentCentre.window.UpdateClassEnrollment);