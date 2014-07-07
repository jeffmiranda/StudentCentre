// !Levels Techniques Grid
StudentCentre.grid.AttendanceLevelsTechniques = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'studentcentre-grid-attendance-levels-techniques'
        ,url: StudentCentre.config.connectorUrl
        ,baseParams: { action: 'mgr/attendance/scLevelTechniqueGetList' }
        ,fields: ['id', 'level_id', 'technique_id', 'level_name', 'technique_name', 'order']
        ,paging: true
        ,remoteSort: true
        ,anchor: '97%'
        ,autoExpandColumn: 'technique_name'
        ,grouping: true
        ,groupBy: 'level_name'
        ,pluralText: 'Techniques'
        ,singleText: 'Technique'
        ,save_action: 'mgr/attendance/scLevelTechniqueUpdateFromGrid'
        ,autosave: true
        ,columns: [{
            header: _('studentcentre.id')
            ,hidden: true
            ,dataIndex: 'id'
            ,name: 'id'
        },{
            header: _('studentcentre.id')
            ,hidden: true
            ,dataIndex: 'level_id'
            ,name: 'level_id'
        },{
            header: _('studentcentre.id')
            ,hidden: true
            ,dataIndex: 'technique_id'
            ,name: 'technique_id'
        },{
            header: _('studentcentre.att_level')
            ,dataIndex: 'level_name'
            ,name: 'level_name'
            ,sortable: true
            ,width: 100
        },{
            header: _('studentcentre.att_technique')
            ,dataIndex: 'technique_name'
            ,name: 'technique_name'
            ,sortable: true
            ,width: 100
        },{
            header: _('studentcentre.order')
            ,dataIndex: 'order'
            ,name: 'order'
            ,sortable: true
            ,width: 100
            ,editor: { xtype: 'numberfield' }
        }]
        ,tbar:[{
            xtype: 'button'
            ,id: 'attendance-create-level-technique-button'
            ,text: _('studentcentre.att_create_level_technique')
            ,handler: { xtype: 'studentcentre-window-level-technique-create', blankValues: true }
        },{
            xtype: 'button'
            ,id: 'attendance-update-level-technique-button'
            ,text: _('studentcentre.update')
            ,listeners: {
                'click': {fn: this.updateLevelTechnique, scope: this}
            }
        },{
            xtype: 'button'
            ,id: 'attendance-remove-level-technique-button'
            ,text: _('studentcentre.remove')
            ,handler: function(btn,e) {
                this.removeLevelTechnique(btn,e);
            }
            ,scope: this
        },'->',{ // This defines the toolbar for the search
		    xtype: 'textfield' // Here we're defining the search field for the toolbar
		    ,id: 'level-technique-search-filter'
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
            ,id: 'clear-level-technique-search'
            ,text: _('studentcentre.clear_search')
            ,listeners: {
                'click': {fn: this.clearSearch, scope: this}
            }
        }]
    });
    StudentCentre.grid.AttendanceLevelsTechniques.superclass.constructor.call(this,config)
};
Ext.extend(StudentCentre.grid.AttendanceLevelsTechniques,MODx.grid.Grid,{
    search: function(tf,nv,ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,clearSearch: function() {
	    this.getStore().baseParams = {
            action: 'mgr/attendance/scLevelTechniqueGetList'
    	};
        Ext.getCmp('level-technique-search-filter').reset();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,getMenu: function() { // MODX looks for getMenu when someone right-clicks on the grid
	    return [{
	        text: _('studentcentre.update')
	        ,handler: this.updateLevelTechnique
	    },'-',{
	        text: _('studentcentre.remove')
	        ,handler: this.removeLevelTechnique
	    }];
	}
	,updateLevelTechnique: function(btn,e) {
		var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
	    if (!this.updateLevelTechniqueWindow) {
		    this.updateLevelTechniqueWindow = MODx.load({
		        xtype: 'sc-window-level-technique-update'
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
		this.updateLevelTechniqueWindow.setValues(selRow.data);
		this.updateLevelTechniqueWindow.show(e.target);
	}
	,removeLevelTechnique: function(btn,e) {
        var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
	    MODx.msg.confirm({
	        title: _('studentcentre.remove')
	        ,text: _('studentcentre.att_confirm_remove_level_technique')
	        ,url: this.config.url
	        ,params: {
	            action: 'mgr/attendance/scLevelTechniqueRemove'
	            ,id: selRow.data.id
	        }
	        ,listeners: {
	            'success': {fn:this.refresh,scope:this}
	        }
	    });
/*
        var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
        MODx.Ajax.request({
            url: this.config.url
            ,params: {
                action: 'mgr/attendance/scClassLevelUpdate'
                ,id: selRow.data.id
                ,toggleActive: 1
            }
            ,listeners: {
                'success': {fn:function(r) {
                    this.refresh();
                    Ext.getCmp('studentcentre-grid-attendance-levels').refresh();
                },scope:this}
            }
        });
        return true;
*/
    }
});
Ext.reg('studentcentre-grid-attendance-levels-techniques',StudentCentre.grid.AttendanceLevelsTechniques);


// !Level Name Combobox
StudentCentre.combo.LevelTechniqueGridLevelName = function(config) {
    config = config || {};
    Ext.applyIf(config, {
    	fieldLabel: _('studentcentre.att_level')
	    ,width: 300
	    ,hiddenName: 'level_id'
	    ,hiddenValue: ''
	    ,emptyText: 'Select level...'
	    ,typeAhead: true
	    ,valueField: 'id'
	    ,displayField: 'name'
	    ,fields: ['id', 'name']
	    ,pageSize: 20
	    ,url: StudentCentre.config.connectorUrl
	    ,baseParams: {
	        action: 'mgr/attendance/scClassLevelGetList'
	    }
    });
    
    StudentCentre.combo.LevelTechniqueGridLevelName.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.LevelTechniqueGridLevelName, MODx.combo.ComboBox);
Ext.reg('attendance-class-level-combo', StudentCentre.combo.LevelTechniqueGridLevelName);


// !Technique Name Combobox
StudentCentre.combo.LevelTechniqueGridTechniqueName = function(config) {
    config = config || {};
    Ext.applyIf(config, {
    	fieldLabel: _('studentcentre.att_technique')
	    ,width: 300
	    ,hiddenName: 'technique_id'
	    ,hiddenValue: ''
	    ,emptyText: 'Select technique...'
	    ,typeAhead: true
	    ,valueField: 'id'
	    ,displayField: 'name'
	    ,fields: ['id', 'name']
	    ,pageSize: 20
	    ,url: StudentCentre.config.connectorUrl
	    ,baseParams: {
	        action: 'mgr/attendance/scTechniqueGetList'
	    }
    });
    
    StudentCentre.combo.LevelTechniqueGridTechniqueName.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.LevelTechniqueGridTechniqueName, MODx.combo.ComboBox);
Ext.reg('attendance-class-technique-combo', StudentCentre.combo.LevelTechniqueGridTechniqueName);


// !Create Window
StudentCentre.window.CreateLevelTechnique = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('studentcentre.att_create_level_technique')
        ,width: '400'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,baseParams: {
            action: 'mgr/attendance/scLevelTechniqueCreate'
        }
        ,fields: [{
            xtype: 'attendance-class-level-combo'
            ,id: 'attendance-level-technique-create-class-level-combo'
            ,name: 'level_id'
            ,hiddenName: 'level_id'
            ,anchor: '100%'
	        ,baseParams: {
		        action: 'mgr/attendance/scClassLevelGetList'
		        ,activeOnly: 1
		    }
        },{
            xtype: 'attendance-class-technique-combo'
            ,id: 'attendance-level-technique-create-technique-combo'
            ,name: 'technique_id'
            ,hiddenName: 'technique_id'
            ,anchor: '100%'
	        ,baseParams: {
		        action: 'mgr/attendance/scTechniqueGetList'
		        ,activeOnly: 1
		    }
        },{
            xtype: 'numberfield'
            ,fieldLabel: _('studentcentre.order')
            ,name: 'order'
            ,anchor: '100%'
        }]
    });
    StudentCentre.window.CreateLevelTechnique.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.CreateLevelTechnique,MODx.Window);
Ext.reg('studentcentre-window-level-technique-create',StudentCentre.window.CreateLevelTechnique);


// !Update Window
StudentCentre.window.UpdateLevelTechnique = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('studentcentre.update')
        ,width: '400'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,baseParams: {
            action: 'mgr/attendance/scLevelTechniqueUpdate'
        }
        ,fields: [{
            xtype: 'hidden'
            ,name: 'id'
        },{
            xtype: 'attendance-class-level-combo'
            ,id: 'attendance-level-technique-update-class-level-combo'
            ,name: 'level_id'
            ,hiddenName: 'level_id'
            ,anchor: '100%'
        },{
            xtype: 'attendance-class-technique-combo'
            ,id: 'attendance-level-technique-update-technique-combo'
            ,name: 'technique_id'
            ,hiddenName: 'technique_id'
            ,anchor: '100%'
        },{
            xtype: 'numberfield'
            ,fieldLabel: _('studentcentre.order')
            ,name: 'order'
            ,anchor: '100%'
        }]
    });
    StudentCentre.window.UpdateLevelTechnique.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.UpdateLevelTechnique,MODx.Window);
Ext.reg('sc-window-level-technique-update',StudentCentre.window.UpdateLevelTechnique);