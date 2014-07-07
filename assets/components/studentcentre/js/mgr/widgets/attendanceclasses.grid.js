// !Classes Grid
StudentCentre.grid.AttendanceClasses = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'studentcentre-grid-attendance-classes'
        ,url: StudentCentre.config.connectorUrl
        ,baseParams: { action: 'mgr/attendance/scClassGetList' }
        ,fields: ['id', 'class_level_category_id', 'category_name', 'name', 'description', 'active']
        ,paging: true
        ,remoteSort: true
        ,anchor: '97%'
        ,autoExpandColumn: 'name'
        ,grouping: true
        ,groupBy: 'category_name'
        ,pluralText: 'Classes'
        ,singleText: 'Class'
        ,save_action: 'mgr/attendance/scClassUpdateFromGrid'
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
            header: _('studentcentre.active')
            ,dataIndex: 'active'
            ,sortable: true
            ,width: 50
            // below xtype defined in attendancelevelcategories.grid.js
            ,editor: { xtype: 'attendance-combo-active-status', renderer: true}
        }]
        ,tbar:[{
            xtype: 'button'
            ,id: 'attendance-create-class-button'
            ,text: _('studentcentre.att_create_class')
            ,handler: { xtype: 'studentcentre-window-class-create', blankValues: true }
        },{
            xtype: 'button'
            ,id: 'attendance-update-class-button'
            ,text: _('studentcentre.update')
            ,listeners: {
                'click': {fn: this.updateClass, scope: this}
            }
        },{
            xtype: 'button'
            ,id: 'attendance-class-active-toggle-button'
            ,text: _('studentcentre.toggle_active_status')
            ,handler: function(btn,e) {
                this.toggleActive(btn,e);
            }
            ,scope: this
        },'->',{ // This defines the toolbar for the search
		    xtype: 'textfield' // Here we're defining the search field for the toolbar
		    ,id: 'class-search-filter'
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
            ,id: 'clear-class-search'
            ,text: _('studentcentre.clear_search')
            ,listeners: {
                'click': {fn: this.clearSearch, scope: this}
            }
        }]
    });
    StudentCentre.grid.AttendanceClasses.superclass.constructor.call(this,config)
};
Ext.extend(StudentCentre.grid.AttendanceClasses,MODx.grid.Grid,{
    search: function(tf,nv,ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,clearSearch: function() {
	    this.getStore().baseParams = {
            action: 'mgr/attendance/scClassGetList'
    	};
        Ext.getCmp('class-search-filter').reset();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,getMenu: function() { // MODX looks for getMenu when someone right-clicks on the grid
	    return [{
	        text: _('studentcentre.update')
	        ,handler: this.updateClass
	    },'-',{
	        text: _('studentcentre.toggle_active_status')
	        ,handler: this.toggleActive
	    }];
	}
	,updateClass: function(btn,e) {
		var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
        //console.log(selRow.data);
	    if (!this.updateClassWindow) {
		    this.updateClassWindow = MODx.load({
		        xtype: 'sc-window-class-update'
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
		this.updateClassWindow.setValues(selRow.data);
		this.updateClassWindow.show(e.target);
	}
	,toggleActive: function(btn,e) {
        var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
        MODx.Ajax.request({
            url: this.config.url
            ,params: {
                action: 'mgr/attendance/scClassUpdate'
                ,id: selRow.data.id
                ,toggleActive: 1
            }
            ,listeners: {
                'success': {fn:function(r) {
                    this.refresh();
                    Ext.getCmp('studentcentre-grid-attendance-classes').refresh();
                    this._updateClassComboBoxes();
                },scope:this}
            }
        });
        return true;
    }
    // used to reload the Class comboboxes in other grids
    ,_updateClassComboBoxes: function() {
	    var cbClass = new Array();
        cbClass[0] = Ext.getCmp('attendance-create-scheduled-class-class-combo');
        for (var i=0; i<cbClass.length; i++) {
	    	if (cbClass[i]) {
	        	cbClass[i].setDisabled(false);
	            var s = cbClass[i].store;
	            s.removeAll();
	            s.load();
	            cbClass[i].clearValue();
	        }
        }
    }
});
Ext.reg('studentcentre-grid-attendance-classes',StudentCentre.grid.AttendanceClasses);


// !Level Category Name Active Combobox
// 'attendance-combo-level-category-name' is defined in the Levels grid.

// !Create Class Window
StudentCentre.window.CreateClass = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('studentcentre.att_create_class')
        ,width: '400'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,baseParams: {
            action: 'mgr/attendance/scClassCreate'
        }
        ,fields: [{
            xtype: 'attendance-combo-level-category-name'
            ,id: 'attendance-combo-create-class-category-name'
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
        }]
    });
    StudentCentre.window.CreateClass.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.CreateClass,MODx.Window);
Ext.reg('studentcentre-window-class-create',StudentCentre.window.CreateClass);


// !Update Window
StudentCentre.window.UpdateClass = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('studentcentre.att_update_class')
        ,width: '400'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,baseParams: {
            action: 'mgr/attendance/scClassUpdate'
        }
        ,fields: [{
            xtype: 'hidden'
            ,name: 'id'
        },{
            xtype: 'attendance-combo-level-category-name'
            ,id: 'attendance-combo-update-class-category-name'
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
            xtype: 'attendance-combo-active-status'
            ,fieldLabel: _('studentcentre.active')
            ,name: 'active'
            ,hiddenName: 'active'
            ,anchor: '100%'
        }]
    });
    StudentCentre.window.UpdateClass.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.UpdateClass,MODx.Window);
Ext.reg('sc-window-class-update',StudentCentre.window.UpdateClass);