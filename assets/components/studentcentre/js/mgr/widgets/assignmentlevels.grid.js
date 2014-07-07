// !Levels Grid
StudentCentre.grid.StudentLevels = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'studentcentre-grid-assignment-levels'
        ,url: StudentCentre.config.connectorUrl
        ,baseParams: { action: 'mgr/assignments/scAssignmentLevelGetList' }
        ,fields: ['id','program_id','program_name','name','active','last_modified']
        ,paging: true
        ,remoteSort: true
        ,anchor: '97%'
        ,autoExpandColumn: 'name'
        ,grouping: true
        ,groupBy: 'program_name'
        ,pluralText: 'Levels'
        ,singleText: 'Level'
        ,save_action: 'mgr/assignments/scAssignmentLevelUpdateFromGrid'
        ,autosave: true
        ,columns: [{
            header: _('id')
            ,hidden: true
            ,dataIndex: 'id'
        },{
            header: _('studentcentre.ass_program_name')
            ,dataIndex: 'program_name'
            ,sortable: true
            ,width: 150
        },{
            header: _('studentcentre.ass_program_id')
            ,dataIndex: 'program_id'
            ,hidden: true
        },{
            header: _('studentcentre.ass_level_name')
            ,dataIndex: 'name'
            ,sortable: true
            ,width: 150
            ,editor: { xtype: 'textfield' }
        },{
            header: _('studentcentre.ass_active_status')
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
            ,id: 'assignments-create-level-button'
            ,text: _('studentcentre.ass_create_level')
            ,handler: { xtype: 'studentcentre-window-level-create', blankValues: true }
        },{
            xtype: 'button'
            ,id: 'assignments-update-level-button'
            ,text: _('studentcentre.ass_update_level')
            ,listeners: {
                'click': {fn: this.updateLevel, scope: this}
            }
        },{
            xtype: 'button'
            ,id: 'assignments-level-active-toggle-button'
            ,text: _('studentcentre.ass_toggle_active')
            ,handler: function(btn,e) {
                this.toggleActiveLevel(btn,e);
            }
            ,scope: this
        },'->',{ // This defines the toolbar for the search
		    xtype: 'textfield' // Here we're defining the search field for the toolbar
		    ,id: 'level-search-filter'
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
            ,id: 'clear-level-search'
            ,text: _('studentcentre.ass_clear_search')
            ,listeners: {
                'click': {fn: this.clearLevelSearch, scope: this}
            }
        }]
    });
    StudentCentre.grid.StudentLevels.superclass.constructor.call(this,config)
};
Ext.extend(StudentCentre.grid.StudentLevels,MODx.grid.Grid,{
    search: function(tf,nv,ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,clearLevelSearch: function() {
	    this.getStore().baseParams = {
            action: 'mgr/assignments/scAssignmentLevelGetList'
    	};
        Ext.getCmp('level-search-filter').reset();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,getMenu: function() { // MODX looks for getMenu when someone right-clicks on the grid
	    return [{
	        text: _('studentcentre.ass_update_level')
	        ,handler: this.updateLevel
	    },{
	        text: _('studentcentre.ass_toggle_active')
	        ,handler: this.toggleActiveLevel
	    }];
	}
	,updateLevel: function(btn,e) {
		var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
        if (!this.updateLevelWindow) {
		    this.updateLevelWindow = MODx.load({
		        xtype: 'studentcentre-window-level-update'
		        ,record: selRow.data
		        ,listeners: {
		            'success': {
		            	fn:function(r){
		            		this.refresh();
		            		//this.getSelectionModel().clearSelections(true);
		                    var cbLevel = Ext.getCmp('assignment-combo-level-name-active');
					    	if (cbLevel) {
					        	cbLevel.setDisabled(false);
					            var s = cbLevel.store;
					            s.removeAll();
					            s.load();
					            cbLevel.clearValue();
					        }
		            	},scope:this
		            }
		        }
		    });
	    }
		this.updateLevelWindow.setValues(selRow.data);
		this.updateLevelWindow.show(e.target);
	}
	,toggleActiveLevel: function(btn,e) {
        var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
        MODx.Ajax.request({
            url: this.config.url
            ,params: {
                action: 'mgr/assignments/scAssignmentLevelUpdate'
                ,id: selRow.data.id
                ,toggleActive: 1
            }
            ,listeners: {
                'success': {fn:function(r) {
                    //this.getSelectionModel().clearSelections(true);
                    this.refresh();
                    var cbLevel = Ext.getCmp('assignment-combo-level-name');
			    	if (cbLevel) {
			        	cbLevel.setDisabled(false);
			            var s = cbLevel.store;
			            s.removeAll();
			            s.load();
			            cbLevel.clearValue();
			        }
                },scope:this}
            }
        });
        return true;
    }
});
Ext.reg('studentcentre-grid-assignment-levels',StudentCentre.grid.StudentLevels);


// !Program Name Active Combobox
StudentCentre.combo.LevelsGridProgramName = function(config) {
    config = config || {};
    Ext.applyIf(config, {
    	fieldLabel: _('studentcentre.ass_program')
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
    
    StudentCentre.combo.LevelsGridProgramName.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.LevelsGridProgramName, MODx.combo.ComboBox);
Ext.reg('assignment-combo-levels-program-name', StudentCentre.combo.LevelsGridProgramName);


// !Create Level Window
StudentCentre.window.CreateLevel = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('studentcentre.ass_create_level')
        ,width: '400'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,baseParams: {
            action: 'mgr/assignments/scAssignmentLevelCreate'
        }
        ,fields: [{
            xtype: 'assignment-combo-levels-program-name'
            ,id: 'assignment-combo-levels-create-program-name'
			,fieldLabel: _('studentcentre.ass_program')
            ,name: 'program_id'
            ,hiddenName: 'program_id'
            ,anchor: '100%'
			,baseParams: {
		        action: 'mgr/assignments/scAssignmentProgramGetList'
		        ,activeOnly: 1
		    }
        },{
            xtype: 'textfield'
            ,fieldLabel: _('studentcentre.ass_level')
            ,name: 'name'
            ,anchor: '100%'
        }]
    });
    StudentCentre.window.CreateLevel.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.CreateLevel,MODx.Window);
Ext.reg('studentcentre-window-level-create',StudentCentre.window.CreateLevel);


/*
// !Program Name Active Combobox for update window
StudentCentre.combo.LevelsGridProgramNameUpdate = function(config) {
    config = config || {};
    Ext.applyIf(config, {
    	id: 'assignment-combo-levels-program-name-update'
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
    
    StudentCentre.combo.LevelsGridProgramNameUpdate.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.LevelsGridProgramNameUpdate, MODx.combo.ComboBox);
Ext.reg('assignment-combo-levels-program-name-update', StudentCentre.combo.LevelsGridProgramNameUpdate);
*/


// !Update Level Window
StudentCentre.window.UpdateLevel = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('studentcentre.ass_update_level')
        ,width: '400'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,baseParams: {
            action: 'mgr/assignments/scAssignmentLevelUpdate'
        }
        ,fields: [{
            xtype: 'hidden'
            ,name: 'id'
        },{
            xtype: 'assignment-combo-levels-program-name'
            ,id: 'assignment-combo-levels-update-program-name'
            ,fieldLabel: _('studentcentre.ass_program')
            ,name: 'program_id'
            ,hiddenName: 'program_id'
            ,anchor: '100%'
        },{
            xtype: 'textfield'
            ,fieldLabel: _('studentcentre.ass_level')
            ,name: 'name'
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
    StudentCentre.window.UpdateLevel.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.UpdateLevel,MODx.Window);
Ext.reg('studentcentre-window-level-update',StudentCentre.window.UpdateLevel);