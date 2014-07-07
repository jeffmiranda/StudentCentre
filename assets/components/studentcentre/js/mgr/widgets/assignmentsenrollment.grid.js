// !Student AssignmentEnrollment Grid
StudentCentre.grid.StudentAssignmentEnrollment = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'studentcentre-grid-student-enrollment'
        ,url: StudentCentre.config.connectorUrl
        ,baseParams: { action: 'mgr/assignments/scAssignmentEnrollmentGetList' }
        ,fields: ['id','student_id','student_name','program_id','program_name','level_id','level_name','active','last_modified']
        ,paging: true
        ,remoteSort: true
        ,anchor: '97%'
        ,autoExpandColumn: 'program_name'
        ,grouping: false
        ,groupBy: 'student_name'
        ,pluralText: 'Programs'
        ,singleText: 'Program'
        ,save_action: 'mgr/assignments/scAssignmentEnrollmentToggleActive'
        ,autosave: true
        ,columns: [{
            header: _('id')
            ,hidden: true
            ,dataIndex: 'id'
        },{
            header: _('studentcentre.ass_student_id')
            ,hidden: true
            ,dataIndex: 'student_id'
        },{
            header: _('studentcentre.ass_student_name')
            ,dataIndex: 'student_name'
            ,sortable: true
            ,width: 50
        },{
            header: _('studentcentre.ass_program_id')
            ,hidden: true
            ,dataIndex: 'program_id'
        },{
            header: _('studentcentre.ass_program')
            ,dataIndex: 'program_name'
            ,sortable: true
            ,width: 150
        },{
            header: _('studentcentre.ass_level_id')
            ,hidden: true
            ,dataIndex: 'level_id'
        },{
            header: _('studentcentre.ass_level')
            ,dataIndex: 'level_name'
            ,sortable: true
            ,width: 150
        },{
            header: _('studentcentre.ass_active_status')
            ,dataIndex: 'active'
            ,sortable: true
            ,width: 50
            ,editor: { xtype: 'assignment-combo-active-status', renderer: true}
        },{
            header: _('studentcentre.last_modified')
            ,dataIndex: 'last_modified'
            ,sortable: true
            ,width: 80
        }]
        ,tbar:[{
            xtype: 'button'
            ,id: 'assignments-enrollment-button'
            ,text: _('studentcentre.ass_enroll_student')
            ,handler: { xtype: 'studentcentre-window-enrollment-create', blankValues: true }
        },{
            xtype: 'button'
            ,id: 'assignments-enrollment-active-toggle-button'
            ,text: _('studentcentre.ass_enroll_toggle_active')
            ,handler: function(btn,e) {
                this.toggleActiveEnrollment(btn,e);
            }
            ,scope: this
        },'->',{ // This defines the toolbar for the search
		    xtype: 'textfield' // Here we're defining the search field for the toolbar
		    ,id: 'enrollment-search-filter'
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
            ,id: 'clear-enrollment-search'
            ,text: _('studentcentre.ass_clear_search')
            ,listeners: {
                'click': {fn: this.clearEnrollmentSearch, scope: this}
            }
        }]
    });
    StudentCentre.grid.StudentAssignmentEnrollment.superclass.constructor.call(this,config)
};
Ext.extend(StudentCentre.grid.StudentAssignmentEnrollment,MODx.grid.Grid,{
    search: function(tf,nv,ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,clearEnrollmentSearch: function() {
	    this.getStore().baseParams = {
            action: 'mgr/assignments/scAssignmentEnrollmentGetList'
    	};
        Ext.getCmp('enrollment-search-filter').reset();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,getMenu: function() { // MODX looks for getMenu when someone right-clicks on the grid
	    return [{
	        text: _('studentcentre.ass_enroll_toggle_active')
	        ,handler: this.toggleActiveEnrollment
	    }];
	}
	,toggleActiveEnrollment: function(btn,e) {
        var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
        //console.log(JSON.stringify(selRow.data));
        record = JSON.stringify(selRow.data);

        MODx.Ajax.request({
            url: this.config.url
            ,params: {
                action: 'mgr/assignments/scAssignmentEnrollmentToggleActive'
                ,data: record
            }
            ,listeners: {
                'success': {fn:function(r) {
                    //this.getSelectionModel().clearSelections(true);
                    this.refresh();
                    Ext.getCmp('studentcentre-grid-student-assignments').refresh();
                },scope:this}
            }
        });
        return true;
    }
});
Ext.reg('studentcentre-grid-student-enrollment',StudentCentre.grid.StudentAssignmentEnrollment);


// !Active Combobox
StudentCentre.combo.ActiveStatus = function(config) {
    config = config || {};
    Ext.applyIf(config, {
        store: new Ext.data.ArrayStore({
            id: 'assignment-combo-active-status'
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
    
    StudentCentre.combo.ActiveStatus.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.ActiveStatus, MODx.combo.ComboBox);
Ext.reg('assignment-combo-active-status', StudentCentre.combo.ActiveStatus);


// !Student Name Combobox
StudentCentre.combo.StudentName = function(config) {
    config = config || {};
    Ext.applyIf(config, {
    	id: 'assignment-combo-student-name'
	    ,fieldLabel: _('studentcentre.ass_student')
	    ,name: 'student_name'
	    ,width: 300
	    ,hiddenName: 'student_id'
	    ,hiddenValue: ''
	    ,emptyText: 'Select student...'
	    ,typeAhead: true
	    ,valueField: 'student_id'
	    ,displayField: 'student_name'
	    ,pageSize: 20
	    ,fields: ['student_id', 'student_name']
	    ,url: StudentCentre.config.connectorUrl
	    ,baseParams: {
	        action: 'mgr/assignments/scModUserGetList'
	    }
    });
    
    StudentCentre.combo.StudentName.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.StudentName, MODx.combo.ComboBox);
Ext.reg('assignment-combo-student-name', StudentCentre.combo.StudentName);


// !Program Name Active Combobox
StudentCentre.combo.AssignmentEnrollmentProgramName = function(config) {
    config = config || {};
    Ext.applyIf(config, {
    	id: 'assignment-combo-enrollment-program-name'
	    ,fieldLabel: _('studentcentre.ass_program')
	    ,name: 'name'
	    ,width: 300
	    ,hiddenName: 'program_id'
	    ,hiddenValue: ''
	    ,emptyText: 'Select program...'
	    ,typeAhead: true
	    ,valueField: 'id'
	    ,displayField: 'name'
	    ,fields: ['id', 'name']
	    ,url: StudentCentre.config.connectorUrl
	    ,baseParams: {
	        action: 'mgr/assignments/scAssignmentProgramGetList'
	    }
    });
    
    StudentCentre.combo.AssignmentEnrollmentProgramName.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.AssignmentEnrollmentProgramName, MODx.combo.ComboBox);
Ext.reg('assignment-combo-enrollment-program-name', StudentCentre.combo.AssignmentEnrollmentProgramName);


// !Level Name Active Combobox
StudentCentre.combo.AssignmentEnrollmentLevelName = function(config) {
    config = config || {};
    Ext.applyIf(config, {
    	id: 'assignment-combo-enrollment-level-name'
	    ,fieldLabel: _('studentcentre.ass_level')
	    ,name: 'name'
	    ,width: 300
	    ,hiddenName: 'level_id'
	    ,hiddenValue: ''
	    ,emptyText: 'Select level...'
	    ,typeAhead: true
	    ,valueField: 'id'
	    ,displayField: 'name'
	    ,fields: ['id', 'name']
	    ,url: StudentCentre.config.connectorUrl
	    ,baseParams: {
	        action: 'mgr/assignments/scAssignmentLevelActiveGetList'
	    }
    });
    
    StudentCentre.combo.AssignmentEnrollmentLevelName.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.AssignmentEnrollmentLevelName, MODx.combo.ComboBox);
Ext.reg('assignment-combo-enrollment-level-name', StudentCentre.combo.AssignmentEnrollmentLevelName);


// !Create AssignmentEnrollment Window
StudentCentre.window.CreateAssignmentEnrollment = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('studentcentre.ass_enroll_student')
        ,width: '400'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,baseParams: {
            action: 'mgr/assignments/scAssignmentEnrollmentCreate'
        }
        ,fields: [{
            xtype: 'assignment-combo-student-name'
            ,fieldLabel: _('studentcentre.ass_student')
            ,anchor: '100%'
        },{
            xtype: 'assignment-combo-enrollment-program-name'
            ,fieldLabel: _('studentcentre.ass_program')
            ,anchor: '100%'
			,baseParams: {
		        action: 'mgr/assignments/scAssignmentProgramActiveGetList'
		        ,activeOnly: 1
		    }

            ,listeners: {
	            select: { fn: this.getLevels, scope: this }
	        }
        },{
            xtype: 'assignment-combo-enrollment-level-name'
            ,fieldLabel: _('studentcentre.ass_level')
            ,anchor: '100%'
        }]
    });
    StudentCentre.window.CreateAssignmentEnrollment.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.CreateAssignmentEnrollment,MODx.Window, {
	getLevels: function(combo, value) {
    	var cbLevel = Ext.getCmp('assignment-combo-enrollment-level-name');
    	//console.log(cbLevel);
        if (cbLevel) {
        	cbLevel.setDisabled(false);
            var s = cbLevel.store;
            //console.log(s);
            s.baseParams['program_id'] = value.id;
            s.removeAll();
            s.load();
            cbLevel.clearValue();
        }
    }
});
Ext.reg('studentcentre-window-enrollment-create',StudentCentre.window.CreateAssignmentEnrollment);