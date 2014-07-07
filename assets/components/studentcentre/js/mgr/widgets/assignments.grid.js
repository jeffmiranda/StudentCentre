// !Assignments Grid
StudentCentre.grid.Assignments = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'studentcentre-grid-assignments'
        ,url: StudentCentre.config.connectorUrl
        ,baseParams: { action: 'mgr/assignments/scAssignmentGetList' }
        ,fields: ['id','name','description','program_id','program_name','level_id','level_name','active','last_modified']
        ,paging: true
        ,remoteSort: true
        ,anchor: '97%'
        ,autoExpandColumn: 'name'
        ,grouping: true
        ,groupBy: 'program_name'
        ,pluralText: 'Assignments'
        ,singleText: 'Assignment'
        ,save_action: 'mgr/assignments/scAssignmentUpdateFromGrid'
        ,autosave: true
        ,columns: [{
            header: _('id')
            ,hidden: true
            ,dataIndex: 'id'
        },{
            header: _('studentcentre.name')
            ,dataIndex: 'name'
            ,width: 50
            ,editor: { xtype: 'textfield' }
        },{
            header: _('studentcentre.description')
            ,dataIndex: 'description'
            ,width: 50
            ,editor: { xtype: 'htmleditor' }
        },{
            header: _('studentcentre.ass_program_name')
            ,dataIndex: 'program_name'
            ,sortable: true
            ,width: 50
        },{
            header: _('studentcentre.ass_program_id')
            ,dataIndex: 'program_id'
            ,hidden: true
        },{
            header: _('studentcentre.ass_level_name')
            ,dataIndex: 'level_name'
            ,sortable: true
            ,width: 50
        },{
            header: _('studentcentre.ass_level_id')
            ,dataIndex: 'level_id'
            ,hidden: true
        },{
            header: _('studentcentre.active')
            ,dataIndex: 'active'
            ,sortable: true
            ,width: 50
            ,editor: { xtype: 'assignment-combo-active-status', renderer: true}
            // the xtype 'assignment-combo-active-status' above is defined in the enrollment grid
        },{
            header: _('studentcentre.last_modified')
            ,dataIndex: 'last_modified'
            ,sortable: true
            ,width: 50
        }]
        ,tbar:[{
            xtype: 'button'
            ,id: 'assignments-create-assignment-button'
            ,text: _('studentcentre.ass_create_assignment')
            ,handler: { xtype: 'studentcentre-window-assignment-create', blankValues: true }
        },{
            xtype: 'button'
            ,id: 'assignments-update-assignment-button'
            ,text: _('studentcentre.ass_update_assignment')
            ,listeners: {
                'click': {fn: this.updateAssignment, scope: this}
            }
        },{
            xtype: 'button'
            ,id: 'assignments-assignment-active-toggle-button'
            ,text: _('studentcentre.ass_toggle_active')
            ,handler: function(btn,e) {
                this.toggleActiveAssignment(btn,e);
            }
            ,scope: this
        },'->',{ // This defines the toolbar for the search
		    xtype: 'textfield' // Here we're defining the search field for the toolbar
		    ,id: 'assignment-search-filter'
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
            ,id: 'clear-assignment-search'
            ,text: _('studentcentre.ass_clear_search')
            ,listeners: {
                'click': {fn: this.clearAssignmentSearch, scope: this}
            }
        }]
    });
    StudentCentre.grid.Assignments.superclass.constructor.call(this,config)
};
Ext.extend(StudentCentre.grid.Assignments,MODx.grid.Grid,{
    search: function(tf,nv,ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,clearAssignmentSearch: function() {
	    this.getStore().baseParams = {
            action: 'mgr/assignments/scAssignmentGetList'
    	};
        Ext.getCmp('assignment-search-filter').reset();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,getMenu: function() { // MODX looks for getMenu when someone right-clicks on the grid
	    return [{
	        text: _('studentcentre.ass_update_assignment')
	        ,handler: this.updateAssignment
	    },{
	        text: _('studentcentre.ass_toggle_active')
	        ,handler: this.toggleActiveAssignment
	    }];
	}
	,updateAssignment: function(btn,e) {
		var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
        if (!this.updateAssignmentWindow) {
		    this.updateAssignmentWindow = MODx.load({
		        xtype: 'studentcentre-window-assignment-update'
		        ,record: selRow.data
		        ,listeners: {
		            'success': {
		            	fn:function(r){
		            		this.refresh();
		                    Ext.getCmp('studentcentre-grid-student-assignments').refresh();
		            	},scope:this
		            }
		        }
		    });
	    }
		this.updateAssignmentWindow.setValues(selRow.data);
		this.updateAssignmentWindow.show(e.target);
	}
	,toggleActiveAssignment: function(btn,e) {
        var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
        MODx.Ajax.request({
            url: this.config.url
            ,params: {
                action: 'mgr/assignments/scAssignmentUpdate'
                ,id: selRow.data.id
                ,toggleActive: 1
            }
            ,listeners: {
                'success': {fn:function(r) {
                    this.refresh();
                },scope:this}
            }
        });
        return true;
    }
});
Ext.reg('studentcentre-grid-assignments',StudentCentre.grid.Assignments);


// !Program Name Combobox
StudentCentre.combo.AssignmentsGridProgramName = function(config) {
    config = config || {};
    Ext.applyIf(config, {
    	id: 'assignment-combo-assignments-program-name'
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
    
    StudentCentre.combo.AssignmentsGridProgramName.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.AssignmentsGridProgramName, MODx.combo.ComboBox);
Ext.reg('assignment-combo-assignments-program-name', StudentCentre.combo.AssignmentsGridProgramName);


// !Level Name Combobox
StudentCentre.combo.AssignmentsGridLevelName = function(config) {
    config = config || {};
    Ext.applyIf(config, {
    	id: 'assignment-combo-assignments-level-name'
	    ,fieldLabel: _('studentcentre.ass_program')
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
	        action: 'mgr/assignments/scAssignmentLevelGetList'
	    }
    });
    
    StudentCentre.combo.AssignmentsGridLevelName.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.AssignmentsGridLevelName, MODx.combo.ComboBox);
Ext.reg('assignment-combo-assignments-level-name', StudentCentre.combo.AssignmentsGridLevelName);


// !Create Assignment Window
StudentCentre.window.CreateAssignment = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('studentcentre.ass_create_assignment')
        ,width: '400'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,baseParams: {
            action: 'mgr/assignments/scAssignmentCreate'
        }
        ,fields: [{
            xtype: 'textfield'
            ,fieldLabel: _('studentcentre.name')
            ,name: 'name'
            ,anchor: '100%'
        },{
            xtype: 'htmleditor'
            ,fieldLabel: _('studentcentre.description')
            ,name: 'description'
            ,anchor: '100%'
        },{
            xtype: 'assignment-combo-assignments-program-name'
            ,fieldLabel: _('studentcentre.ass_program')
            ,name: 'program_id'
            ,hiddenName: 'program_id'
            ,anchor: '100%'
            ,listeners: {
	            select: { fn: this.getLevels, scope: this }
	        }
        },{
            xtype: 'assignment-combo-assignments-level-name'
            ,fieldLabel: _('studentcentre.ass_level')
            ,name: 'level_id'
            ,hiddenName: 'level_id'
            ,anchor: '100%'
        },{
            xtype: 'assignment-combo-active-status'
            // the xtype 'assignment-combo-active-status' above is defined in the enrollment grid
            ,fieldLabel: _('studentcentre.ass_active_status')
            ,name: 'active'
            ,hiddenName: 'active'
            ,anchor: '100%'
        }]
    });
    StudentCentre.window.CreateAssignment.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.CreateAssignment,MODx.Window, {
	getLevels: function(combo, value) {
    	var cbLevel = Ext.getCmp('assignment-combo-assignments-level-name');
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
Ext.reg('studentcentre-window-assignment-create',StudentCentre.window.CreateAssignment);


// !Program Name Combobox for update window
StudentCentre.combo.AssignmentsUpdateProgramName = function(config) {
    config = config || {};
    Ext.applyIf(config, {
    	id: 'assignment-combo-update-assignments-program-name'
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
    
    StudentCentre.combo.AssignmentsUpdateProgramName.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.AssignmentsUpdateProgramName, MODx.combo.ComboBox);
Ext.reg('assignment-combo-update-assignments-program-name', StudentCentre.combo.AssignmentsUpdateProgramName);


// !Level Name Combobox for update window
StudentCentre.combo.AssignmentsUpdateLevelName = function(config) {
    config = config || {};
    Ext.applyIf(config, {
    	id: 'assignment-combo-update-assignments-level-name'
	    ,fieldLabel: _('studentcentre.ass_program')
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
	        action: 'mgr/assignments/scAssignmentLevelGetList'
	    }
    });
    
    StudentCentre.combo.AssignmentsUpdateLevelName.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.AssignmentsUpdateLevelName, MODx.combo.ComboBox);
Ext.reg('assignment-combo-update-assignments-level-name', StudentCentre.combo.AssignmentsUpdateLevelName);


// !Update Assignment Window
StudentCentre.window.UpdateAssignment = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('studentcentre.ass_update_assignment')
        ,width: '400'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,baseParams: {
            action: 'mgr/assignments/scAssignmentUpdate'
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
            xtype: 'htmleditor'
            ,fieldLabel: _('studentcentre.description')
            ,name: 'description'
            ,anchor: '100%'
        },{
            xtype: 'assignment-combo-update-assignments-program-name'
            ,fieldLabel: _('studentcentre.ass_program')
            ,name: 'program_id'
            ,hiddenName: 'program_id'
            ,anchor: '100%'
            ,listeners: {
	            select: { fn: this.getLevels, scope: this }
	        }
        },{
            xtype: 'assignment-combo-update-assignments-level-name'
            ,fieldLabel: _('studentcentre.ass_level')
            ,name: 'level_id'
            ,hiddenName: 'level_id'
            ,anchor: '100%'
        },{
            xtype: 'assignment-combo-active-status'
            // the xtype 'assignment-combo-active-status' above is defined in the enrollment grid
            ,fieldLabel: _('studentcentre.ass_active_status')
            ,name: 'active'
            ,hiddenName: 'active'
            ,anchor: '100%'
        }]
    });
    StudentCentre.window.UpdateAssignment.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.UpdateAssignment,MODx.Window, {
	getLevels: function(combo, value) {
    	var cbLevel = Ext.getCmp('assignment-combo-update-assignments-level-name');
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
Ext.reg('studentcentre-window-assignment-update',StudentCentre.window.UpdateAssignment);