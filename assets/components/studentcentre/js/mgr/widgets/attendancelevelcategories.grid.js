// !Level Categories Grid
StudentCentre.grid.AttendanceLevelCategories = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'studentcentre-grid-attendance-level-categories'
        ,url: StudentCentre.config.connectorUrl
        ,baseParams: { action: 'mgr/attendance/scClassLevelCategoryGetList' }
        ,fields: ['id','name','description','active']
        ,paging: true
        ,remoteSort: true
        ,anchor: '97%'
        ,autoExpandColumn: 'name'
        ,save_action: 'mgr/attendance/scClassLevelCategoryUpdateFromGrid'
        ,autosave: true
        ,save_callback: this._updateCategoryComboBoxes
        ,columns: [{
            header: _('studentcentre.id')
            ,hidden: true
            ,dataIndex: 'id'
            ,name: 'id'
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
            header: _('studentcentre.active')
            ,dataIndex: 'active'
            ,sortable: true
            ,width: 50
            ,editor: { xtype: 'attendance-combo-active-status', renderer: true}
        }]
        ,tbar:[{
            xtype: 'button'
            ,id: 'attendance-create-level-category-button'
            ,text: _('studentcentre.att_create_category')
            ,handler: { xtype: 'studentcentre-window-level-category-create', blankValues: true }
        },{
            xtype: 'button'
            ,id: 'attendance-update-level-category-button'
            ,text: _('studentcentre.update')
            ,listeners: {
                'click': {fn: this.updateCategory, scope: this}
            }
        },{
            xtype: 'button'
            ,id: 'attendance-category-active-toggle-button'
            ,text: _('studentcentre.toggle_active_status')
            ,handler: function(btn,e) {
                this.toggleActive(btn,e);
            }
            ,scope: this
        },'->',{ // This defines the toolbar for the search
		    xtype: 'textfield' // Here we're defining the search field for the toolbar
		    ,id: 'level-category-search-filter'
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
            ,id: 'clear-level-category-search'
            ,text: _('studentcentre.clear_search')
            ,listeners: {
                'click': {fn: this.clearSearch, scope: this}
            }
        }]
    });
    StudentCentre.grid.AttendanceLevelCategories.superclass.constructor.call(this,config)
};
Ext.extend(StudentCentre.grid.AttendanceLevelCategories,MODx.grid.Grid,{
    search: function(tf,nv,ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,clearSearch: function() {
	    this.getStore().baseParams = {
            action: 'mgr/attendance/scClassLevelCategoryGetList'
    	};
        Ext.getCmp('level-category-search-filter').reset();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,getMenu: function() { // MODX looks for getMenu when someone right-clicks on the grid
	    return [{
	        text: _('studentcentre.update')
	        ,handler: this.updateCategory
	    },'-',{
	        text: _('studentcentre.toggle_active_status')
	        ,handler: this.toggleActive
	    }];
	}
	,updateCategory: function(btn,e) {
		var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
        //console.log(selRow.data);
	    if (!this.updateCategoryWindow) {
		    this.updateCategoryWindow = MODx.load({
		        xtype: 'sc-window-level-category-update'
		        ,record: selRow.data
		        ,listeners: {
		            'success': {
		            	fn:function(r){
		            		this.refresh();
		            		this.getSelectionModel().clearSelections(true);
		            		this._updateCategoryComboBoxes();
		            	},scope:this
		            }
		        }
		    });
	    }
		this.updateCategoryWindow.setValues(selRow.data);
		this.updateCategoryWindow.show(e.target);
	}
	,toggleActive: function(btn,e) {
        var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
        MODx.Ajax.request({
            url: this.config.url
            ,params: {
                action: 'mgr/attendance/scClassLevelCategoryUpdate'
                ,id: selRow.data.id
                ,toggleActive: 1
            }
            ,listeners: {
                'success': {fn:function(r) {
                    this.refresh();
                    Ext.getCmp('studentcentre-grid-attendance-level-categories').refresh();
                    this._updateCategoryComboBoxes();
                },scope:this}
            }
        });
        return true;
    }
    // used to reload the Category comboboxes in the levels grid
    ,_updateCategoryComboBoxes: function() {
	    var cbCategory = new Array();
        cbCategory[0] = Ext.getCmp('attendance-combo-create-level-category-name');
        cbCategory[1] = Ext.getCmp('attendance-combo-create-class-category-name');
        for (var i=0; i<cbCategory.length; i++) {
	    	if (cbCategory[i]) {
	        	cbCategory[i].setDisabled(false);
	            var s = cbCategory[i].store;
	            s.removeAll();
	            s.load();
	            cbCategory[i].clearValue();
	        }
        }
    }
});
Ext.reg('studentcentre-grid-attendance-level-categories',StudentCentre.grid.AttendanceLevelCategories);


// !Active Combobox
StudentCentre.combo.ActiveStatus = function(config) {
    config = config || {};
    Ext.applyIf(config, {
        store: new Ext.data.ArrayStore({
            id: 'attendance-combo-active-status'
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
Ext.reg('attendance-combo-active-status', StudentCentre.combo.ActiveStatus);


// !Create Level Categories Window
StudentCentre.window.CreateLevelCategory = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('studentcentre.att_create_category')
        ,width: '400'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,baseParams: {
            action: 'mgr/attendance/scClassLevelCategoryCreate'
        }
        ,fields: [{
            xtype: 'textfield'
            ,fieldLabel: _('studentcentre.name')
            ,name: 'name'
            ,anchor: '100%'
        },{
            xtype: 'textfield'
            ,fieldLabel: _('studentcentre.description')
            ,name: 'description'
            ,anchor: '100%'
        }]
    });
    StudentCentre.window.CreateLevelCategory.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.CreateLevelCategory,MODx.Window);
Ext.reg('studentcentre-window-level-category-create',StudentCentre.window.CreateLevelCategory);


// !Update Category Window
StudentCentre.window.UpdateLevelCategory = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('studentcentre.att_update_category')
        ,width: '400'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,baseParams: {
            action: 'mgr/attendance/scClassLevelCategoryUpdate'
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
            xtype: 'textfield'
            ,fieldLabel: _('studentcentre.description')
            ,name: 'description'
            ,anchor: '100%'
        },{
            xtype: 'attendance-combo-active-status'
            ,fieldLabel: _('studentcentre.active')
            ,name: 'active'
            ,hiddenName: 'active'
            ,anchor: '100%'
        }]
    });
    StudentCentre.window.UpdateLevelCategory.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.UpdateLevelCategory,MODx.Window);
Ext.reg('sc-window-level-category-update',StudentCentre.window.UpdateLevelCategory);