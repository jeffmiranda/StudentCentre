// !Belt Combobox
StudentCentre.combo.Belt = function(config) {
    config = config || {};
    Ext.applyIf(config, {
        store: new Ext.data.ArrayStore({
            fields: ['value','display']
            ,data: [
                ['notreceived','Not received']
                ,['awarded','Awarded']
            ]
        })
        ,mode: 'local'
        ,displayField: 'display'
        ,valueField: 'value'
        ,hiddenName: 'belt'
    });
    
    StudentCentre.combo.Belt.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.Belt, MODx.combo.ComboBox);
Ext.reg('attendance-combo-belt', StudentCentre.combo.Belt);


// !Certificate Combobox
StudentCentre.combo.Certificate = function(config) {
    config = config || {};
    Ext.applyIf(config, {
        store: new Ext.data.ArrayStore({
            fields: ['value','display']
            ,data: [
                ['notreceived','Not received']
                ,['printed','Printed']
                ,['awarded','Awarded']
            ]
        })
        ,mode: 'local'
        ,displayField: 'display'
        ,valueField: 'value'
        ,hiddenName: 'certificate'
    });
    
    StudentCentre.combo.Certificate.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.Certificate, MODx.combo.ComboBox);
Ext.reg('attendance-combo-certificate', StudentCentre.combo.Certificate);


// !Progress Combobox
StudentCentre.combo.Progress = function(config) {
    config = config || {};
    Ext.applyIf(config, {
        store: new Ext.data.ArrayStore({
            fields: ['value','display']
            ,data: [
                [0,'0']
                ,[10,'10']
                ,[20,'20']
                ,[30,'30']
                ,[40,'40']
                ,[50,'50']
                ,[60,'60']
                ,[70,'70']
                ,[80,'80']
                ,[90,'90']
                ,[100,'100']
            ]
        })
        ,mode: 'local'
        ,displayField: 'display'
        ,valueField: 'value'
    });
    
    StudentCentre.combo.Progress.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.Progress, MODx.combo.ComboBox);
Ext.reg('attendance-combo-progress', StudentCentre.combo.Progress);


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
                	,id: 'attendance-combo-location-jouranl'
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
        Ext.getCmp('attendance-search-filter').reset();
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
        Ext.getCmp('attendance-search-filter').reset();
        gridJournal.getBottomToolbar().changePage(1);
        gridJournal.refresh();
    }
});
Ext.reg('sc-journal-container',StudentCentre.container.AttendanceJournal);

// !Update Journal Window
StudentCentre.window.UpdateJournal = function(config) {
    config = config || {};
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
            xtype: 'attendance-combo-belt'
            //,id: 'attendance-combo-belt-update-journal'
            ,fieldLabel: _('studentcentre.belt')
            ,name: 'belt'
            ,width: '50%'
        },{
            xtype: 'attendance-combo-certificate'
            //,id: 'attendance-combo-cert-update-journal'
            ,fieldLabel: _('studentcentre.certificate')
            ,name: 'certificate'
            ,width: '50%'
        },{
            xtype: 'attendance-combo-progress'
            ,id: 'attendance-combo-progress-update-journal'
            ,fieldLabel: _('studentcentre.written_test_progress')
            ,name: 'written_test_progress'
            ,width: '50%'
        },{
            xtype: 'attendance-combo-active-status'
            ,id: 'attendance-combo-test-fee-update-journal'
            ,fieldLabel: _('studentcentre.test_fee')
            ,name: 'test_fee'
            ,width: '50%'
        },{
	        xtype: 'numberfield'
            ,id: 'attendance-num-pre-tests-update-journal'
            ,fieldLabel: _('studentcentre.pre_test_qty')
            ,name: 'pre_test_qty'
            ,width: '50%'
        },{
			xtype: 'datefield'
            ,id: 'attendance-test-date-update-journal'
            ,name: 'date_created'
            ,allowBlank: true
            ,fieldLabel: _('studentcentre.test_date')
            ,format: 'Y-m-d'
            ,width: '50%'
		},{
			xtype: 'textarea'
			,id: 'attendance-new-comment-update-journal'
			,name: 'comment'
			,fieldLabel: _('studentcentre.comment')
			,width: '97%'
		},{
			xtype: 'sc-grid-journal-comments'
			,id: 'sc-grid-journal-comments'
			,fieldLabel: _('studentcentre.comments')
			,width: '97%'
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
        ,fields: ['id','class_progress_id','student_id','username','belt','certificate','written_test_progress','test_fee','test_date','pre_test_qty','active','last_comment']
        ,paging: true
        ,remoteSort: true
        ,anchor: '97%'
        ,autoExpandColumn: 'username'
        ,save_action: 'mgr/attendance/scJournalUpdateFromGrid'
        ,autosave: true
        ,columns: [{
            header: _('studentcentre.id')
            ,hidden: false
            ,dataIndex: 'id'
            ,name: 'id'
            ,width: 30
        },{
            header: _('studentcentre.att_class_progress_id')
            ,hidden: true
            ,dataIndex: 'class_progress_id'
            ,name: 'class_progress_id'
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
            ,width: 100
        },{
            header: _('studentcentre.belt')
            ,dataIndex: 'belt'
            ,sortable: true
            ,width: 50
            ,name: 'belt'
            //,id: 'journal-combo-belt-status'
            ,editor: { xtype: 'attendance-combo-belt', renderer: true}
        },{
            header: _('studentcentre.certificate')
            ,dataIndex: 'certificate'
            ,sortable: true
            ,width: 50
            ,name: 'certificate'
            //,id: 'journal-combo-certificate-status'
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
            ,dataIndex: 'test_date'
            ,sortable: true
            ,width: 50
            ,name: 'test_date'
            ,allowBlank: true
			,editor: { xtype: 'datefield', format: 'Y-m-d' }
        },{
            header: _('studentcentre.last_comment')
            ,sortable: true
            ,dataIndex: 'last_comment'
            ,name: 'last_comment'
            ,width: 100
        }]
        ,tbar:[{
            xtype: 'button'
            ,id: 'attendance-update-journal-button'
            ,text: _('studentcentre.update')
            ,listeners: {
                'click': {fn: this.updateJournal, scope: this}
            }
        },{
            xtype: 'button'
            ,id: 'attendance-toggle-active-journal-button'
            ,text: _('studentcentre.toggle_active_status')
            ,listeners: {
                'click': {fn: this.toggleActiveStatus, scope: this}
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
    StudentCentre.grid.AttendanceJournal.superclass.constructor.call(this,config)
};
Ext.extend(StudentCentre.grid.AttendanceJournal,MODx.grid.Grid,{
    search: function(tf,nv,ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,clearAttendanceSearch: function() {
	    var cbScheduledClass = Ext.getCmp('attendance-combo-scheduled-class-journal');
	    this.getStore().baseParams = {
            action: 'mgr/attendance/scJournalGetList'
            ,schedClassId: cbScheduledClass.value
    	};
        Ext.getCmp('attendance-search-filter').reset();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,getMenu: function() { // MODX looks for getMenu when someone right-clicks on the grid
	    return [{
	        text: _('studentcentre.update')
	        ,handler: this.updateJournal
	    },'-',{
	        text: _('studentcentre.toggle_active_status')
	        ,handler: this.toggleActiveStatus
	    }];
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
		this.updateJournalWindow.show(e.target);
	}
/*
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
*/
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
/*
        ,tbar:['->'
        ,{ // This defines the toolbar for the search
		    xtype: 'textfield' // Here we're defining the search field for the toolbar
		    ,id: 'attendance-journal-comments-search-filter'
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
            ,text: _('studentcentre.clear_search')
            ,listeners: {
                'click': {fn: this.clearJournalCommentsSearch, scope: this}
            }
        }]
*/
    });
    StudentCentre.grid.AttendanceJournalComments.superclass.constructor.call(this,config)
};
Ext.extend(StudentCentre.grid.AttendanceJournalComments,MODx.grid.Grid/*
,{
    search: function(tf,nv,ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,clearJournalCommentsSearch: function() {
	    var hidJournalId = Ext.getCmp('update_journal_id');
	    this.getStore().baseParams = {
            action: 'mgr/attendance/scJournalCommentGetList'
            ,journalId: hidJournalId.value
    	};
        Ext.getCmp('attendance-journal-comments-search-filter').reset();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
}
*/);
Ext.reg('sc-grid-journal-comments',StudentCentre.grid.AttendanceJournalComments);