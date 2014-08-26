// !Active Assignments Grid
StudentCentre.grid.StudentAssignments = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'studentcentre-grid-student-assignments'
        ,url: StudentCentre.config.connectorUrl
        ,baseParams: { action: 'mgr/assignments/scStudentAssignmentGetList' }
        ,fields: ['id','student_id','username','assignment_name','assignment_desc','program_name','level_name','status','progress']
        ,paging: true
        ,remoteSort: true
        ,anchor: '97%'
        ,autoExpandColumn: 'assignment_name'
        ,save_action: 'mgr/assignments/scStudentAssignmentUpdateFromGrid'
        ,autosave: true
        ,grouping: false
        ,groupBy: 'student_name'
        ,pluralText: 'Assignments'
        ,singleText: 'Assignment'
        ,columns: [{
            header: _('id')
            ,hidden: true
            ,dataIndex: 'id'
            ,sortable: true
            ,width: 30
        },{
            header: _('studentcentre.ass_student_id')
            ,hidden: true
            ,dataIndex: 'student_id'
        },{
            header: _('studentcentre.username')
            ,dataIndex: 'username'
            ,sortable: true
            ,width: 50
        },{
            header: _('studentcentre.ass_status')
            ,dataIndex: 'status'
            ,sortable: true
            ,width: 70
            ,editor: { xtype: 'assignment-combo-status', renderer: true}
        },{
            header: _('studentcentre.ass_progress')
            ,dataIndex: 'progress'
            ,sortable: true
            ,width: 40
            ,editor: { xtype: 'assignment-combo-progress', renderer: true}
        },{
            header: _('studentcentre.ass_name')
            ,dataIndex: 'assignment_name'
            ,sortable: true
            ,width: 150
        },{
            header: _('studentcentre.ass_description')
            ,dataIndex: 'assignment_desc'
            ,hidden: true
            ,sortable: false
            ,width: 150
        },{
            header: _('studentcentre.ass_program')
            ,dataIndex: 'program_name'
            ,sortable: true
            ,width: 80
        },{
            header: _('studentcentre.ass_level')
            ,dataIndex: 'level_name'
            ,sortable: true
            ,width: 80
        }]
        ,tbar:[{
            xtype: 'button'
            ,id: 'assignments-update-button'
            ,text: _('studentcentre.ass_update')
            ,listeners: {
                'click': {fn: this.updateStudentAssignment, scope: this}
            }
        },'->',{ // This defines the toolbar for the search
		    xtype: 'textfield' // Here we're defining the search field for the toolbar
		    ,id: 'assignments-search-filter'
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
            ,id: 'clear-search'
            ,text: _('studentcentre.ass_clear_search')
            ,listeners: {
                'click': {fn: this.clearSearch, scope: this}
            }
        }]
    });
    StudentCentre.grid.StudentAssignments.superclass.constructor.call(this,config)
};
Ext.extend(StudentCentre.grid.StudentAssignments,MODx.grid.Grid,{
    search: function(tf,nv,ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,clearSearch: function() {
	    this.getStore().baseParams = {
            action: 'mgr/assignments/scStudentAssignmentGetList'
    	};
        Ext.getCmp('assignments-search-filter').reset();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,getMenu: function() { // MODX looks for getMenu when someone right-clicks on the grid
	    return [{
	        text: _('studentcentre.ass_update')
	        ,handler: this.updateStudentAssignment // call updateStudentAssignment when the user clicks Update from the context menu
	    }];
	}
	,updateStudentAssignment: function(btn,e) { // here we define the updateStudentAssignment function
        var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
        if (!this.updateStudentAssignmentWindow) {
	        this.updateStudentAssignmentWindow = MODx.load({
	            xtype: 'studentcentre-window-student-assignment-update'
	            ,record: selRow.data
	            ,listeners: {
	                'success': {fn:this.refresh,scope:this}
	            }
	        });
	    } else {
		    this.updateStudentAssignmentWindow.setValues(selRow.data);
		    var assCommentsGrid = Ext.getCmp('studentcentre-grid-student-assignment-comments');
	    	var assCommentsGridStore = assCommentsGrid.getStore();
	    	// get the last options for the store
	    	var lastOptions = assCommentsGridStore.lastOptions;
	    	// set new options to override existing ones
			Ext.apply(lastOptions.params, {
			    id: selRow.data.id
			});
			// reload the store
			assCommentsGridStore.reload(lastOptions);
	    }
	    this.updateStudentAssignmentWindow.show(e.target);
	}
});
Ext.reg('studentcentre-grid-student-assignments',StudentCentre.grid.StudentAssignments);


// !Status Combobox
StudentCentre.combo.AssignmentStatus = function(config) {
    config = config || {};
    Ext.applyIf(config, {
	     fieldLabel: _('studentcentre.ass_status')
	    ,name: 'status'
	    ,width: 300
	    ,hiddenName: 'status'
	    ,emptyText: 'Select status...'
	    ,typeAhead: true
	    ,editable: false
	    ,valueField: 'status'
	    ,displayField: 'status'
	    ,fields: ['status']
	    ,url: StudentCentre.config.connectorUrl
	    ,baseParams: {
	        action: 'mgr/assignments/scAssignmentStatusGetList'
	    }
    });
    
    StudentCentre.combo.AssignmentStatus.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.AssignmentStatus, MODx.combo.ComboBox);
Ext.reg('assignment-combo-status', StudentCentre.combo.AssignmentStatus);


// !Progress Combobox
StudentCentre.combo.AssignmentProgress = function(config) {
    config = config || {};
    Ext.applyIf(config, {
	     fieldLabel: _('studentcentre.ass_progress')
	    ,name: 'progress'
	    ,width: 300
	    ,hiddenName: 'progress'
	    ,emptyText: 'Select progress...'
	    ,typeAhead: true
	    ,valueField: 'progress'
	    ,displayField: 'progress'
	    ,fields: ['progress']
	    ,url: StudentCentre.config.connectorUrl
	    ,baseParams: {
	        action: 'mgr/assignments/scAssignmentProgressGetList'
	    }
    });
    
    StudentCentre.combo.AssignmentProgress.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.AssignmentProgress, MODx.combo.ComboBox);
Ext.reg('assignment-combo-progress', StudentCentre.combo.AssignmentProgress);


// !Reply Window
StudentCentre.window.UpdateStudentAssignment = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('studentcentre.ass_update')
        ,width: '600'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,baseParams: {
            action: 'mgr/assignments/scStudentAssignmentUpdate'
            ,userId: StudentCentre.config.userId
            ,processorsPath: StudentCentre.config.processorsPath
        }
        ,fields: [{
            xtype: 'hidden'
            ,name: 'id'
        },{
            xtype: 'displayfield'
            ,fieldLabel: _('studentcentre.username')
            ,name: 'username'
            ,anchor: '100%'
        },{
            xtype: 'displayfield'
            ,fieldLabel: _('studentcentre.ass_name')
            ,name: 'assignment_name'
            ,anchor: '100%'
        },{
            xtype: 'displayfield'
            ,fieldLabel: _('studentcentre.ass_description')
            ,name: 'assignment_desc'
            ,anchor: '100%'
        },{
            xtype: 'displayfield'
            ,fieldLabel: _('studentcentre.ass_program')
            ,name: 'program_name'
            ,anchor: '100%'
        },{
            xtype: 'displayfield'
            ,fieldLabel: _('studentcentre.ass_level')
            ,name: 'level_name'
            ,anchor: '100%'
        },{
            xtype: 'assignment-combo-status'
            ,fieldLabel: _('studentcentre.ass_status')
            ,name: 'status'
            ,anchor: '100%'
        },{
            xtype: 'assignment-combo-progress'
            ,fieldLabel: _('studentcentre.ass_progress')
            ,name: 'progress'
            ,anchor: '100%'
        },{
            xtype: 'htmleditor'
            ,enableAlignments: false
            ,enableColors: false
            ,enableFont: false
            ,enableFontSize: false
            ,enableFormat: false
            ,enableLinks: false
            ,enableLists: false
            ,enableSourceEdit: false
            ,fieldLabel: _('studentcentre.ass_comment')
            ,name: 'comment'
            ,anchor: '100%'
            ,height: 80
        },{
	        xtype: 'studentcentre-grid-student-assignment-comments'
	        ,baseParams: { 
				// send the product id to your processor,
				// or you'll get all comments :)
				action: 'mgr/assignments/scStudentAssignmentCommentsGetList'
				,id: config.record.id 
			}
			,height: '300'
        }]
    });
    StudentCentre.window.UpdateStudentAssignment.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.UpdateStudentAssignment,MODx.Window);
Ext.reg('studentcentre-window-student-assignment-update',StudentCentre.window.UpdateStudentAssignment);


// !Comments Grid
StudentCentre.grid.StudentAssignmentComments = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'studentcentre-grid-student-assignment-comments'
        ,layout: 'form'
        ,url: StudentCentre.config.connectorUrl
        ,baseParams: {
        	action: 'mgr/assignments/scStudentAssignmentCommentsGetList'
        }
        ,autoHeight: false
        ,fields: ['id','username','comment','date_created']
        ,paging: true
        ,remoteSort: true
        ,anchor: '100%'
        ,autoExpandColumn: 'comment'
        ,columns: [{
            header: _('studentcentre.username')
            ,dataIndex: 'username'
            ,sortable: false
            ,width: 100
        },{
            header: _('studentcentre.ass_comment')
            ,dataIndex: 'comment'
            ,sortable: false
            ,width: 350
            ,renderer: function(value, metadata) {
			    metadata.attr = 'style="white-space: normal;"';
			    return value;
			}
        },{
            header: _('studentcentre.ass_date_created')
            ,dataIndex: 'date_created'
            ,sortable: true
            ,width: 100
        }]
    });
    StudentCentre.grid.StudentAssignmentComments.superclass.constructor.call(this,config)
};
Ext.extend(StudentCentre.grid.StudentAssignmentComments,MODx.grid.Grid);
Ext.reg('studentcentre-grid-student-assignment-comments',StudentCentre.grid.StudentAssignmentComments);