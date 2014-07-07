// !Levels Grid
StudentCentre.grid.AttendanceLevels = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'studentcentre-grid-attendance-levels'
        ,url: StudentCentre.config.connectorUrl
        ,baseParams: { action: 'mgr/attendance/scClassLevelGetList' }
        ,fields: ['id', 'class_level_category_id', 'category_name', 'name', 'description', 'hours_required', 'test_threshold', 'order', 'active']
        ,paging: true
        ,remoteSort: true
        ,anchor: '97%'
        ,autoExpandColumn: 'name'
        ,grouping: true
        ,groupBy: 'category_name'
        ,pluralText: 'Levels'
        ,singleText: 'Level'
        ,save_action: 'mgr/attendance/scClassLevelUpdateFromGrid'
        ,autosave: true
        ,columns: [{
            header: _('studentcentre.id')
            ,hidden: true
            ,dataIndex: 'id'
            ,name: 'id'
        },{
            header: _('studentcentre.id')
            ,hidden: true
            ,dataIndex: 'class_level_category_id'
            ,name: 'class_level_category_id'
        },{
            header: _('studentcentre.att_level_category')
            ,dataIndex: 'category_name'
            ,name: 'category_name'
            ,sortable: true
            ,width: 100
        },{
            header: _('studentcentre.name')
            ,dataIndex: 'name'
            ,name: 'name'
            ,sortable: true
            ,width: 100
            ,editor: { xtype: 'textfield' }
        },{
            header: _('studentcentre.description')
            ,dataIndex: 'description'
            ,name: 'description'
            ,sortable: true
            ,width: 100
            ,editor: { xtype: 'textfield' }
        },{
            header: _('studentcentre.att_hours_required')
            ,dataIndex: 'hours_required'
            ,name: 'hours_required'
            ,sortable: true
            ,width: 100
            ,editor: { xtype: 'numberfield' }
        },{
            header: _('studentcentre.att_test_threshold')
            ,dataIndex: 'test_threshold'
            ,name: 'test_threshold'
            ,sortable: true
            ,width: 100
            ,editor: { xtype: 'numberfield' }
        },{
            header: _('studentcentre.order')
            ,dataIndex: 'order'
            ,name: 'order'
            ,sortable: true
            ,width: 100
            ,editor: { xtype: 'numberfield' }
        },{
            header: _('studentcentre.active')
            ,dataIndex: 'active'
            ,sortable: true
            ,width: 50
            // below xtype defined in attendancelevelcategories.grid.js
            ,editor: { xtype: 'attendance-combo-active-status', renderer: true}
        }]
        ,tbar:[{
            xtype: 'button'
            ,id: 'attendance-create-level-button'
            ,text: _('studentcentre.att_create_level')
            ,handler: { xtype: 'studentcentre-window-level-create', blankValues: true }
        },{
            xtype: 'button'
            ,id: 'attendance-update-level-button'
            ,text: _('studentcentre.update')
            ,listeners: {
                'click': {fn: this.updateLevel, scope: this}
            }
        },{
            xtype: 'button'
            ,id: 'attendance-level-active-toggle-button'
            ,text: _('studentcentre.toggle_active_status')
            ,handler: function(btn,e) {
                this.toggleActive(btn,e);
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
            ,text: _('studentcentre.clear_search')
            ,listeners: {
                'click': {fn: this.clearSearch, scope: this}
            }
        }]
    });
    StudentCentre.grid.AttendanceLevels.superclass.constructor.call(this,config)
};
Ext.extend(StudentCentre.grid.AttendanceLevels,MODx.grid.Grid,{
    search: function(tf,nv,ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,clearSearch: function() {
	    this.getStore().baseParams = {
            action: 'mgr/attendance/scClassLevelGetList'
    	};
        Ext.getCmp('level-search-filter').reset();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,getMenu: function() { // MODX looks for getMenu when someone right-clicks on the grid
	    return [{
	        text: _('studentcentre.update')
	        ,handler: this.updateLevel
	    },'-',{
	        text: _('studentcentre.toggle_active_status')
	        ,handler: this.toggleActive
	    }];
	}
	,updateLevel: function(btn,e) {
		var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
        //console.log(selRow.data);
	    if (!this.updateLevelWindow) {
		    this.updateLevelWindow = MODx.load({
		        xtype: 'sc-window-level-update'
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
		this.updateLevelWindow.setValues(selRow.data);
		this.updateLevelWindow.show(e.target);
	}
	,toggleActive: function(btn,e) {
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
    }
});
Ext.reg('studentcentre-grid-attendance-levels',StudentCentre.grid.AttendanceLevels);


// !Level Category Name Active Combobox
StudentCentre.combo.LevelGridCategoryName = function(config) {
    config = config || {};
    Ext.applyIf(config, {
    	id: 'attendance-combo-level-category-name'
	    ,fieldLabel: _('studentcentre.att_level_category')
	    ,name: 'name'
	    ,width: 300
	    ,hiddenName: 'category_id'
	    ,hiddenValue: ''
	    ,emptyText: 'Select category...'
	    ,typeAhead: true
	    ,valueField: 'id'
	    ,displayField: 'name'
	    ,fields: ['id', 'name']
	    ,url: StudentCentre.config.connectorUrl
	    ,baseParams: {
	        action: 'mgr/attendance/scClassLevelCategoryGetList'
	        ,activeOnly: 1
	    }
    });
    
    StudentCentre.combo.LevelGridCategoryName.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.LevelGridCategoryName, MODx.combo.ComboBox);
Ext.reg('attendance-combo-level-category-name', StudentCentre.combo.LevelGridCategoryName);


// !Create Level Window
StudentCentre.window.CreateLevel = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('studentcentre.att_create_level')
        ,width: '400'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,baseParams: {
            action: 'mgr/attendance/scClassLevelCreate'
        }
        ,fields: [{
            xtype: 'attendance-combo-level-category-name'
            ,id: 'attendance-combo-create-level-category-name'
            ,fieldLabel: _('studentcentre.att_level_category')
            ,name: 'class_level_category_id'
            ,hiddenName: 'class_level_category_id'
            ,anchor: '100%'
        },{
            xtype: 'textfield'
            ,fieldLabel: _('studentcentre.name')
            ,name: 'name'
            ,anchor: '100%'
        },{
            xtype: 'textfield'
            ,fieldLabel: _('studentcentre.description')
            ,name: 'description'
            ,anchor: '100%'
        },{
            xtype: 'numberfield'
            ,fieldLabel: _('studentcentre.att_hours_required')
            ,name: 'hours_required'
            ,anchor: '100%'
        },{
            xtype: 'numberfield'
            ,fieldLabel: _('studentcentre.att_test_threshold')
            ,name: 'test_threshold'
            ,anchor: '100%'
        },{
            xtype: 'numberfield'
            ,fieldLabel: _('studentcentre.order')
            ,name: 'order'
            ,anchor: '100%'
        }]
    });
    StudentCentre.window.CreateLevel.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.CreateLevel,MODx.Window);
Ext.reg('studentcentre-window-level-create',StudentCentre.window.CreateLevel);


// !Update Update Window
StudentCentre.window.UpdateLevel = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('studentcentre.att_update_level')
        ,width: '400'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,baseParams: {
            action: 'mgr/attendance/scClassLevelUpdate'
        }
        ,fields: [{
            xtype: 'hidden'
            ,name: 'id'
        },{
            xtype: 'attendance-combo-level-category-name'
            ,id: 'attendance-combo-update-level-category-name'
            ,fieldLabel: _('studentcentre.att_level_category')
            ,name: 'class_level_category_id'
            ,hiddenName: 'class_level_category_id'
            ,anchor: '100%'
            ,baseParams: {
		        action: 'mgr/attendance/scClassLevelCategoryGetList'
		    }
        },{
            xtype: 'textfield'
            ,fieldLabel: _('studentcentre.name')
            ,name: 'name'
            ,anchor: '100%'
        },{
            xtype: 'textfield'
            ,fieldLabel: _('studentcentre.description')
            ,name: 'description'
            ,anchor: '100%'
        },{
            xtype: 'numberfield'
            ,fieldLabel: _('studentcentre.att_hours_required')
            ,name: 'hours_required'
            ,anchor: '100%'
        },{
            xtype: 'numberfield'
            ,fieldLabel: _('studentcentre.att_test_threshold')
            ,name: 'test_threshold'
            ,anchor: '100%'
        },{
            xtype: 'numberfield'
            ,fieldLabel: _('studentcentre.order')
            ,name: 'order'
            ,anchor: '100%'
        },{
            xtype: 'attendance-combo-active-status'
            ,fieldLabel: _('studentcentre.active')
            ,name: 'active'
            ,hiddenName: 'active'
            ,anchor: '100%'
        }]
    });
    StudentCentre.window.UpdateLevel.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.UpdateLevel,MODx.Window);
Ext.reg('sc-window-level-update',StudentCentre.window.UpdateLevel);