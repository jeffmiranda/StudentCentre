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
			            select: { fn: this.updateAttendanceForm, scope: this }
			        }
				}]
            },{
	            columnWidth: 1.0
	            ,xtype: 'container'
	            ,layout: 'form'
	            ,items: [{
                    xtype: 'studentcentre-grid-attendance'
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
		// Get the Sched Class combobox
		var cbScheduledClass = Ext.getCmp('attendance-combo-scheduled-class-journal');
		// Get the journal table
		//var tblJournal = Ext.getCmp('');
        if (cbScheduledClass) { // if the combobox was retrieved
        	cbScheduledClass.setDisabled(false); // enable the combobox
            var s = cbScheduledClass.store; // get the store
            s.baseParams['location_id'] = value.id; // set the location_id param
            s.baseParams['activeOnly'] = 1; // only get the active ones
            s.removeAll(); // removes any existing records from the store
            s.load(); // load the store with data
            cbScheduledClass.clearValue(); // clear the text value
        }
/*
        if (pnlStudentAttendance) {
        	pnlStudentAttendance.removeAll(); // remove all components from the panel
        	pnlStudentAttendance.update(''); // Ensures that any previous error message is also removed.
        }
*/
    }
});
Ext.reg('sc-journal-container',StudentCentre.container.AttendanceJournal);

// !Journal Grid
StudentCentre.grid.AttendanceJournal = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'studentcentre-grid-journal'
        ,url: StudentCentre.config.connectorUrl
        ,baseParams: { action: 'mgr/attendance/scJournalGetList' }
        ,fields: ['id','class_progress_id','student_id','username','belt','certificate','written_test_progress','test_fee','test_date','pre_test_qty']
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