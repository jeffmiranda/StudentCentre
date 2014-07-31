// !Progress Grid
StudentCentre.grid.AttendanceProgress = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'studentcentre-grid-attendance-progress'
        ,url: StudentCentre.config.connectorUrl
        ,baseParams: { action: 'mgr/attendance/scClassProgressGetList' }
        ,fields: ['id', 'class_level_category_id', 'level_id', 'student_id', 'student_name', 'class_level_category_name', 'level_name', 'hours_since_leveling', 'total_hours', 'test_ready', 'last_modified']
        ,paging: true
        ,remoteSort: true
        ,anchor: '97%'
        ,autoExpandColumn: 'student_name'
        ,grouping: true
        ,groupBy: 'student_name'
        ,pluralText: 'Class level categories'
        ,singleText: 'Class level category'
        ,save_action: 'mgr/attendance/scClassProgressUpdateFromGrid'
        ,autosave: true
        ,columns: [{
            header: _('studentcentre.id')
            ,hidden: false
            ,dataIndex: 'id'
            ,name: 'id'
        },{
            header: _('studentcentre.student_name')
            ,dataIndex: 'student_name'
            ,name: 'student_name'
            ,sortable: true
        },{
            header: _('studentcentre.att_level_category')
            ,dataIndex: 'class_level_category_name'
            ,name: 'class_level_category_name'
            ,sortable: true
        },{
            header: _('studentcentre.att_level')
            ,dataIndex: 'level_name'
            ,name: 'level_name'
            ,sortable: false
        },{
            header: _('studentcentre.att_hours_since_leveling')
            ,dataIndex: 'hours_since_leveling'
            ,name: 'hours_since_leveling'
            ,sortable: true
            ,editor: { xtype: 'numberfield' }
        },{
            header: _('studentcentre.att_total_hours')
            ,dataIndex: 'total_hours'
            ,name: 'total_hours'
            ,sortable: true
            ,editor: { xtype: 'numberfield' }
        },{
            header: _('studentcentre.att_test_ready')
            ,dataIndex: 'test_ready'
            ,name: 'test_ready'
            ,sortable: true
            ,editor: { xtype: 'attendance-combo-active-status', renderer: true}
        },{
            header: _('studentcentre.last_modified')
            ,dataIndex: 'last_modified'
            ,sortable: true
        }]
        ,tbar:[{
            xtype: 'button'
            ,id: 'attendance-update-progress-button'
            ,text: _('studentcentre.update')
            ,listeners: {
                'click': {fn: this.updateProgress, scope: this}
            }
        },'->',{ // This defines the toolbar for the search
		    xtype: 'textfield' // Here we're defining the search field for the toolbar
		    ,id: 'progress-search-filter'
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
            ,id: 'clear-progress-search'
            ,text: _('studentcentre.clear_search')
            ,listeners: {
                'click': {fn: this.clearSearch, scope: this}
            }
        }]
    });
    StudentCentre.grid.AttendanceProgress.superclass.constructor.call(this,config)
};
Ext.extend(StudentCentre.grid.AttendanceProgress,MODx.grid.Grid,{
    search: function(tf,nv,ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,clearSearch: function() {
	    this.getStore().baseParams = {
            action: 'mgr/attendance/scClassProgressGetList'
    	};
        Ext.getCmp('progress-search-filter').reset();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,getMenu: function() { // MODX looks for getMenu when someone right-clicks on the grid
	    return [{
	        text: _('studentcentre.update')
	        ,handler: this.updateProgress
	    }];
	}
	,updateProgress: function(btn,e) {
		var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
        //console.log(selRow.data);
	    if (!this.updateProgressWindow) {
		    this.updateProgressWindow = MODx.load({
		        xtype: 'sc-window-progress-update'
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
		this.updateProgressWindow.setValues(selRow.data);
		this.updateProgressWindow.show(e.target);
	}
});
Ext.reg('studentcentre-grid-attendance-progress',StudentCentre.grid.AttendanceProgress);


// !Update Window
StudentCentre.window.UpdateProgress = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('studentcentre.att_update_progress')
        ,width: '400'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,baseParams: {
            action: 'mgr/attendance/scClassProgressUpdate'
        }
        ,fields: [{
            xtype: 'hidden'
            ,name: 'id'
        },{
            xtype: 'displayfield'
            ,fieldLabel: _('studentcentre.student_name')
            ,name: 'student_name'
            ,anchor: '100%'
        },{
            xtype: 'displayfield'
            ,fieldLabel: _('studentcentre.att_class')
            ,name: 'class_name'
            ,anchor: '100%'
        },{
            xtype: 'displayfield'
            ,fieldLabel: _('studentcentre.att_level')
            ,name: 'level_name'
            ,anchor: '100%'
        },{
            xtype: 'numberfield'
            ,fieldLabel: _('studentcentre.att_hours_since_leveling')
            ,name: 'hours_since_leveling'
            ,anchor: '100%'
        },{
            xtype: 'numberfield'
            ,fieldLabel: _('studentcentre.att_total_hours')
            ,name: 'total_hours'
            ,anchor: '100%'
        },{
            xtype: 'xcheckbox'
            ,fieldLabel: _('studentcentre.att_test_ready')
            ,name: 'test_ready'
            ,anchor: '100%'
        },{
            xtype: 'displayfield'
            ,fieldLabel: _('studentcentre.last_modified')
            ,name: 'last_modified'
            ,anchor: '100%'
        }]
    });
    StudentCentre.window.UpdateProgress.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.UpdateProgress,MODx.Window);
Ext.reg('sc-window-progress-update',StudentCentre.window.UpdateProgress);