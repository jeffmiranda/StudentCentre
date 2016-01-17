// !Journal Container
StudentCentre.container.AttendanceJournal = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'sc-attendance-journal'
        ,defaults: { autoHeight: true }
        ,items: [{
            layout:'column'
            ,bodyCssClass: 'main-wrapper'
            ,border: false
            ,items: [{
            	columnWidth: 0.5
                ,layout: 'form'
                ,border: false
                ,items: [{
                	xtype: 'attendance-combo-location'
                	,id: 'attendance-combo-location-journal'
		            ,fieldLabel: _('studentcentre.att_location')
		            ,name: 'location'
				    ,hiddenName: 'location'
				    ,anchor: '95%'
				    ,listeners: {
			            select: { fn: this.getScheduledClasses, scope: this }
			        }
				}]
            },{
            	columnWidth: 0.5
                ,layout: 'form'
            	,border: false
            	,items: [{
                    xtype: 'attendance-combo-scheduled-class'
                    ,id: 'attendance-combo-scheduled-class-journal'
		            ,fieldLabel: _('studentcentre.att_class')
		            ,name: 'class_id'
				    ,hiddenName: 'class_id'
				    ,anchor: '95%'
				    ,disabled: true
				    ,listeners: {
			            select: { fn: this.updateJournalGrid, scope: this }
			        }
				}]
            },{
	            columnWidth: 1.0
	            ,xtype: 'container'
	            ,layout: 'form'
	            ,items: [{
                    xtype: 'studentcentre-grid-journal'
                    ,cls: 'main-wrapper'
                    ,preventRender: true
                }]
            }]
        }]
    });
    StudentCentre.container.AttendanceJournal.superclass.constructor.call(this,config)
};
Ext.extend(StudentCentre.container.AttendanceJournal,Ext.Container,{
    // Load the Sched Class combobox with classes at a specific location
	getScheduledClasses: function(combo, value) {
		
		// reset the journal grid
		var gridJournal = Ext.getCmp('studentcentre-grid-journal');
		gridJournal.getStore().baseParams = {
            action: 'mgr/attendance/scJournalGetList'
		};
        Ext.getCmp('journal-search-filter').reset();
        gridJournal.getBottomToolbar().changePage(1);
        gridJournal.refresh();
        
        // Get the Sched Class combobox
		var cbScheduledClass = Ext.getCmp('attendance-combo-scheduled-class-journal');
        if (cbScheduledClass) { // if the combobox was retrieved
        	cbScheduledClass.setDisabled(false); // enable the combobox
            var s = cbScheduledClass.store; // get the store
            s.baseParams['location_id'] = value.id; // set the location_id param
            s.baseParams['activeOnly'] = 1; // only get the active ones
            s.removeAll(); // removes any existing records from the store
            s.load(); // load the store with data
            cbScheduledClass.clearValue(); // clear the text value
        }
    }
    ,updateJournalGrid: function(combo, value) {
		var gridJournal = Ext.getCmp('studentcentre-grid-journal');
		gridJournal.getStore().baseParams = {
            action: 'mgr/attendance/scJournalGetList'
			,schedClassId: value.id
		};
        Ext.getCmp('journal-search-filter').reset();
        gridJournal.getBottomToolbar().changePage(1);
        gridJournal.refresh();
    }
});
Ext.reg('sc-journal-container',StudentCentre.container.AttendanceJournal);


// !Create Journal Window
/**
 * This window is temporary. Once all the students are synced up
 * and have a journal entry, remove this window and button.
 */
StudentCentre.window.CreateJournal = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('studentcentre.create_journal')
        ,width: '400'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,baseParams: {
            action: 'mgr/attendance/scJournalCreate'
        }
        ,fields: [{
        	xtype: 'attendance-combo-location'
        	,id: 'attendance-combo-location-create-jouranl'
            ,fieldLabel: _('studentcentre.att_location')
            ,name: 'location'
		    ,hiddenName: 'location'
		    ,anchor: '95%'
		    ,listeners: {
	            select: { fn: this.getScheduledClasses, scope: this }
	        }
		},{
            xtype: 'attendance-combo-scheduled-class'
            ,id: 'attendance-combo-scheduled-class-create-journal'
            ,fieldLabel: _('studentcentre.att_class')
            ,name: 'class_id'
		    ,hiddenName: 'class_id'
		    ,anchor: '95%'
		    ,disabled: true
		    ,listeners: {
	            select: { fn: this.getEnrolledStudents, scope: this }
	        }
		},{
			xtype: 'attendance-combo-student-name'
			,id: 'create-journal-win-student-name'
			,hiddenName: 'student_id'
			,anchor: '95%'
			,disabled: true
			,allowBlank: false
			,baseParams: {
		        action: 'mgr/attendance/scModUserGetList'
		        ,activeOnly: 1
		    }
		},{
            xtype: 'attendance-combo-belt'
            ,fieldLabel: _('studentcentre.belt')
            ,name: 'belt'
            ,width: '50%'
        },{
            xtype: 'attendance-combo-certificate'
            ,fieldLabel: _('studentcentre.certificate')
            ,name: 'certificate'
            ,width: '50%'
        },{
            xtype: 'attendance-combo-progress'
            ,fieldLabel: _('studentcentre.written_test_progress')
            ,name: 'written_test_progress'
            ,width: '50%'
        },{
            xtype: 'attendance-combo-active-status'
            ,fieldLabel: _('studentcentre.test_fee')
            ,name: 'test_fee'
            ,width: '50%'
            ,hiddenName: 'test_fee'
        },{
	        xtype: 'numberfield'
            ,fieldLabel: _('studentcentre.pre_test_qty')
            ,name: 'pre_test_qty'
            ,width: '50%'
        },{
			xtype: 'datefield'
            ,name: 'test_date'
            ,allowBlank: true
            ,fieldLabel: _('studentcentre.test_date')
            ,format: 'Y-m-d'
            ,width: '50%'
		},{
			xtype: 'xcheckbox'
			,name: 'active'
			,fieldLabel: _('studentcentre.active')
			,checked: true
		}]
    });
    StudentCentre.window.CreateJournal.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.CreateJournal,MODx.Window,{
	// Load the Sched Class combobox with classes at a specific location
	getScheduledClasses: function(combo, value) {
		//console.log(value);
		// Get the students combobox disable and clear it
		var cbStudents = Ext.getCmp('create-journal-win-student-name');
    	cbStudents.setDisabled(true);
        var d = cbStudents.store;
        d.removeAll();
        d.load();
        cbStudents.clearValue();
        
		// Get the Sched Class combobox
		var cbScheduledClass = Ext.getCmp('attendance-combo-scheduled-class-create-journal');
    	cbScheduledClass.setDisabled(false);
        var s = cbScheduledClass.store;
        s.baseParams['location_id'] = value.id;
        s.removeAll();
        s.load();
        cbScheduledClass.clearValue();
    }
    // Load the Students combobox with students enrolled for the scheduled class
	,getEnrolledStudents: function(combo, value) {
		// Get the Students combobox
		var cbStudents = Ext.getCmp('create-journal-win-student-name');
    	cbStudents.setDisabled(false);
        var s = cbStudents.store;
        s.baseParams['scheduled_class_id'] = value.id;
        s.removeAll();
        s.load();
        cbStudents.clearValue();
    }
});
Ext.reg('sc-window-journal-create',StudentCentre.window.CreateJournal);


// !Update Journal Window
StudentCentre.window.UpdateJournal = function(config) {
    config = config || {};
    //console.log(config);
    Ext.applyIf(config,{
        title: _('studentcentre.update_journal')
        ,width: '600'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,baseParams: {
            action: 'mgr/attendance/scJournalUpdate'
        }
        ,fields: [{
            xtype: 'hidden'
            ,name: 'id'
            ,id: 'update_journal_id'
        },{
            xtype: 'hidden'
            ,name: 'student_id'
        },{
            xtype: 'displayfield'
            ,fieldLabel: _('studentcentre.username')
            ,name: 'username'
            ,width: '50%'
        },{
            xtype: 'attendance-class-level-combo'
            ,id: 'attendance-combo-journal-update-class-level'
            ,fieldLabel: _('studentcentre.next_level')
            ,name: 'next_level_id'
            ,hiddenName: 'next_level_id'
            ,hiddenValue: 'next_level_id'
            ,width: '50%'
        },{
            xtype: 'displayfield'
            ,fieldLabel: _('studentcentre.att_hours_required')
            ,name: 'hours_required'
            ,width: '50%'
        },{
            xtype: 'textfield'
            ,fieldLabel: _('studentcentre.att_hours_since_leveling')
            ,name: 'hours_since_leveling'
            ,width: '50%'
        },{
            xtype: 'attendance-combo-belt'
            ,fieldLabel: _('studentcentre.belt')
            ,name: 'belt'
            ,width: '50%'
        },{
            xtype: 'attendance-combo-certificate'
            ,fieldLabel: _('studentcentre.certificate')
            ,name: 'certificate'
            ,width: '50%'
        },{
            xtype: 'attendance-combo-progress'
            //,id: 'attendance-combo-progress-update-journal'
            ,fieldLabel: _('studentcentre.written_test_progress')
            ,name: 'written_test_progress'
            ,width: '50%'
        },{
            xtype: 'attendance-combo-active-status'
            //,id: 'attendance-combo-test-fee-update-journal'
            ,fieldLabel: _('studentcentre.test_fee')
            ,name: 'test_fee'
            ,width: '50%'
            ,hiddenName: 'test_fee'
        },{
	        xtype: 'numberfield'
            //,id: 'attendance-num-pre-tests-update-journal'
            ,fieldLabel: _('studentcentre.pre_test_qty')
            ,name: 'pre_test_qty'
            ,width: '50%'
        },{
			xtype: 'datefield'
            //,id: 'attendance-test-date-update-journal'
            ,name: 'test_date'
            ,allowBlank: true
            ,fieldLabel: _('studentcentre.test_date')
            ,format: 'Y-m-d'
            ,width: '50%'
		},{
			xtype: 'textarea'
			//,id: 'attendance-new-comment-update-journal'
			,name: 'comment'
			,fieldLabel: _('studentcentre.comment')
			,width: '97%'
		},{
			xtype: 'sc-grid-journal-comments'
			,id: 'sc-grid-journal-comments'
			,fieldLabel: _('studentcentre.comments')
			,width: '97%'
			,height: '200'
			,baseParams: {
		        action: 'mgr/attendance/scJournalCommentGetList'
		        ,journalId: config.record.id
		    }
		}]
    });
    StudentCentre.window.UpdateJournal.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.UpdateJournal,MODx.Window);
Ext.reg('sc-window-journal-update',StudentCentre.window.UpdateJournal);

// !Journal Grid
StudentCentre.grid.AttendanceJournal = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'studentcentre-grid-journal'
        ,url: StudentCentre.config.connectorUrl
        ,baseParams: {
	        action: 'mgr/attendance/scJournalGetList'
	    }
        ,fields: ['id','next_level_id','student_id','username','next_level','hours_required','hours_since_leveling','belt','certificate','written_test_progress','test_fee','test_date','pre_test_qty','active','last_comment']
        ,paging: true
        ,remoteSort: true
        ,anchor: '97%'
        ,autoExpandColumn: 'username'
        ,save_action: 'mgr/attendance/scJournalUpdateFromGrid'
        ,autosave: true
        ,columns: [{
            header: _('studentcentre.id')
            ,hidden: true
            ,dataIndex: 'id'
            ,name: 'id'
            ,width: 30
        },{
            header: _('studentcentre.next_level_id')
            ,hidden: true
            ,dataIndex: 'next_level_id'
            ,name: 'next_level_id'
        },{
            header: _('studentcentre.student_id')
            ,hidden: true
            ,dataIndex: 'student_id'
            ,name: 'student_id'
        },{
            header: _('studentcentre.active')
            ,hidden: true
            ,dataIndex: 'active'
            ,name: 'active'
        },{
            header: _('studentcentre.username')
            ,sortable: true
            ,dataIndex: 'username'
            ,name: 'username'
            ,width: 50
        },{
            header: _('studentcentre.next_level')
            ,sortable: true
            ,dataIndex: 'next_level'
            ,name: 'next_level'
            ,width: 50
        },{
            header: _('studentcentre.att_hours_required')
            ,sortable: true
            ,dataIndex: 'hours_required'
            ,name: 'hours_required'
            ,width: 50
        },{
            header: _('studentcentre.att_hours_since_leveling')
            ,sortable: true
            ,dataIndex: 'hours_since_leveling'
            ,name: 'hours_since_leveling'
            ,width: 50
        },{
            header: _('studentcentre.belt')
            ,dataIndex: 'belt'
            ,sortable: true
            ,width: 50
            ,name: 'belt'
            ,editor: { xtype: 'attendance-combo-belt', renderer: true}
        },{
            header: _('studentcentre.certificate')
            ,dataIndex: 'certificate'
            ,sortable: true
            ,width: 50
            ,name: 'certificate'
            ,editor: { xtype: 'attendance-combo-certificate', renderer: true}
        },{
            header: _('studentcentre.written_test_progress')
            ,dataIndex: 'written_test_progress'
            ,sortable: true
            ,width: 50
            ,name: 'written_test_progress'
            ,id: 'journal-combo-written-test-progress'
            ,editor: { xtype: 'attendance-combo-progress', renderer: true}
        },{
            header: _('studentcentre.test_fee')
            //,id: 'attendance-combo-test-fee-grid-journal'
            ,dataIndex: 'test_fee'
            ,sortable: true
            ,width: 50
            ,name: 'test_fee'
            ,allowBlank: false
			,editor: { xtype: 'attendance-combo-active-status', renderer: true}
        },{
            header: _('studentcentre.pre_test_qty')
            ,dataIndex: 'pre_test_qty'
            ,sortable: true
            ,width: 50
            ,name: 'pre_test_qty'
            ,allowBlank: false
			,allowNegative: false
            ,editor: { xtype: 'numberfield' }
        },{
	        header: _('studentcentre.test_date')
	        ,type: 'date'
            ,dataIndex: 'test_date'
            ,sortable: true
            ,width: 50
            ,name: 'test_date'
            ,allowBlank: true
            ,dateFormat: 'Y-m-d'
            /**
	         * Commented out the editor line below because when it's enabled
	         * the date displays as one day off. Total pain in the ass
	         * and I haven't been able to fix it.
	         */
            //,editor: { xtype: 'datefield', format: 'Y-m-d' }
        },{
            header: _('studentcentre.last_comment')
            ,sortable: true
            ,dataIndex: 'last_comment'
            ,name: 'last_comment'
            ,width: 100
        }]
        ,tbar:[{
	        // Remove this button once all the students are synced up
            xtype: 'button'
            ,id: 'attendance-create-journal-button'
            ,text: _('studentcentre.create_journal')
            ,listeners: {
                'click': {fn: this.createJournal, scope: this}
            }
        },{
            xtype: 'button'
            ,id: 'attendance-update-journal-button'
            ,text: _('studentcentre.update')
            ,listeners: {
                'click': {fn: this.updateJournal, scope: this}
            }
        },{
            xtype: 'button'
            ,id: 'attendance-toggle-active-journal-button'
            ,text: _('studentcentre.deactivate')
            ,listeners: {
                'click': {fn: this.toggleActive, scope: this}
            }
        },'->',{ // This defines the toolbar for the search
		    xtype: 'textfield' // Here we're defining the search field for the toolbar
		    ,id: 'journal-search-filter'
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
            ,text: _('studentcentre.ass_clear_search')
            ,listeners: {
                'click': {fn: this.clearJournalSearch, scope: this}
            }
        }]
    });
    StudentCentre.grid.AttendanceJournal.superclass.constructor.call(this,config)
};
Ext.extend(StudentCentre.grid.AttendanceJournal,MODx.grid.Grid,{
    search: function(tf,nv,ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,clearJournalSearch: function() {
	    var cbScheduledClass = Ext.getCmp('attendance-combo-scheduled-class-journal');
	    this.getStore().baseParams = {
            action: 'mgr/attendance/scJournalGetList'
            ,schedClassId: cbScheduledClass.value
    	};
        Ext.getCmp('journal-search-filter').reset();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,getMenu: function() { // MODX looks for getMenu when someone right-clicks on the grid
	    return [{
	        text: _('studentcentre.update')
	        ,handler: this.updateJournal
	    },'-',{
	        text: _('studentcentre.deactivate')
	        ,handler: this.toggleActive
	    }];
	}
	,createJournal: function(btn,e) {
		//var selRow = this.getSelectionModel().getSelected();
        //if (selRow.length <= 0) return false;
	    if (!this.createJournalWindow) {
		    this.createJournalWindow = MODx.load({
		        xtype: 'sc-window-journal-create'
		    });
	    }
	    this.createJournalWindow.reset();
	    // get the location and class combo boxes above the grid
		var locCombo = Ext.getCmp('attendance-combo-location-journal');
	    var classCombo = Ext.getCmp('attendance-combo-scheduled-class-journal');
	    // if the class combo is enabled
	    if (classCombo.disabled == false) {
		    // enable the class combo in the create window
		    Ext.getCmp('attendance-combo-scheduled-class-create-journal').setDisabled(false);
		    var classId = classCombo.getValue();
		    // if there's a value in the class combo
		    if (classId) {
			    // get the students combo and pass it the value of the class combo
			    // to get a list of students for that class
				var cbStudents = Ext.getCmp('create-journal-win-student-name');
	        	cbStudents.setDisabled(false); // enable the combobox
	            var s = cbStudents.store; // get the store
	            s.baseParams['scheduled_class_id'] = classId; // set the scheduled_class_id param
	            s.removeAll(); // removes any existing records from the store
	            s.load(); // load the store with data
	            cbStudents.clearValue(); // clear the text value
		    }
	    }
	    // set the values for the combo boxes in the create window
		this.createJournalWindow.setValues({
			location: locCombo.getValue()
			,class_id: classCombo.getValue()
		});
		this.createJournalWindow.show(e.target);
	}
	,updateJournal: function(btn,e) {
		var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
	    if (!this.updateJournalWindow) {
		    this.updateJournalWindow = MODx.load({
		        xtype: 'sc-window-journal-update'
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
		this.updateJournalWindow.setValues(selRow.data);
	    var jourGrid = Ext.getCmp('sc-grid-journal-comments');
	    var lastOpt = jourGrid.getStore().lastOptions;
	    Ext.apply(lastOpt.params, {
		    journalId: selRow.data.id
	    });
	    jourGrid.getStore().reload(lastOpt);
		this.updateJournalWindow.show(e.target);
	}
	,toggleActive: function(btn,e) {
        var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
        MODx.Ajax.request({
            url: this.config.url
            ,params: {
                action: 'mgr/attendance/scJournalUpdate'
                ,id: selRow.data.id
                ,toggleActive: 1
            }
            ,listeners: {
                'success': {fn:function(r) {
                    this.refresh();
                    Ext.getCmp('studentcentre-grid-journal').refresh();
                },scope:this}
            }
        });
        return true;
    }
});
Ext.reg('studentcentre-grid-journal',StudentCentre.grid.AttendanceJournal);

//  COMMENTS GRID IN UPDATE WINDOW
StudentCentre.grid.AttendanceJournalComments = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        url: StudentCentre.config.connectorUrl
        ,baseParams: {
	        action: 'mgr/attendance/scJournalCommentGetList'
	    }
	    ,autoHeight: false
        ,fields: ['id','comment','date_created']
        ,paging: true
        ,remoteSort: true
        ,anchor: '100%'
        ,autoExpandColumn: 'comment'
        ,columns: [{
            header: _('studentcentre.id')
            ,hidden: true
            ,dataIndex: 'id'
        },{
            header: _('studentcentre.comment')
            ,dataIndex: 'comment'
            ,sortable: true
            ,width: 150
        },{
            header: _('studentcentre.date_created')
            ,sortable: true
            ,dataIndex: 'date_created'
            ,width: 100
        }]
    });
    StudentCentre.grid.AttendanceJournalComments.superclass.constructor.call(this,config)
};
Ext.extend(StudentCentre.grid.AttendanceJournalComments,MODx.grid.Grid);
Ext.reg('sc-grid-journal-comments',StudentCentre.grid.AttendanceJournalComments);