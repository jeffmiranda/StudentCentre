// !Techniques Grid
StudentCentre.grid.AttendanceTechniques = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'studentcentre-grid-attendance-techniques'
        ,url: StudentCentre.config.connectorUrl
        ,baseParams: { action: 'mgr/attendance/scTechniqueGetList' }
        ,fields: ['id','name','description','active']
        ,paging: true
        ,remoteSort: true
        ,anchor: '97%'
        ,autoExpandColumn: 'name'
        ,save_action: 'mgr/attendance/scTechniqueUpdateFromGrid'
        ,autosave: true
        ,save_callback: this._updateTechniqueComboBoxes
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
            ,id: 'attendance-create-technique-button'
            ,text: _('studentcentre.att_create_technique')
            ,handler: { xtype: 'studentcentre-window-technique-create', blankValues: true }
        },{
            xtype: 'button'
            ,id: 'attendance-update-technique-button'
            ,text: _('studentcentre.update')
            ,listeners: {
                'click': {fn: this.updateTechnique, scope: this}
            }
        },{
            xtype: 'button'
            ,id: 'attendance-technique-active-toggle-button'
            ,text: _('studentcentre.toggle_active_status')
            ,handler: function(btn,e) {
                this.toggleActive(btn,e);
            }
            ,scope: this
        },'->',{ // This defines the toolbar for the search
		    xtype: 'textfield' // Here we're defining the search field for the toolbar
		    ,id: 'technique-search-filter'
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
            ,id: 'clear-technique-search'
            ,text: _('studentcentre.clear_search')
            ,listeners: {
                'click': {fn: this.clearSearch, scope: this}
            }
        }]
    });
    StudentCentre.grid.AttendanceTechniques.superclass.constructor.call(this,config)
};
Ext.extend(StudentCentre.grid.AttendanceTechniques,MODx.grid.Grid,{
    search: function(tf,nv,ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,clearSearch: function() {
	    this.getStore().baseParams = {
            action: 'mgr/attendance/scTechniqueGetList'
    	};
        Ext.getCmp('technique-search-filter').reset();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,getMenu: function() { // MODX looks for getMenu when someone right-clicks on the grid
	    return [{
	        text: _('studentcentre.update')
	        ,handler: this.updateTechnique
	    },'-',{
	        text: _('studentcentre.toggle_active_status')
	        ,handler: this.toggleActive
	    }];
	}
	,updateTechnique: function(btn,e) {
		var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
        //console.log(selRow.data);
	    if (!this.updateTechniqueWindow) {
		    this.updateTechniqueWindow = MODx.load({
		        xtype: 'sc-window-technique-update'
		        ,record: selRow.data
		        ,listeners: {
		            'success': {
		            	fn:function(r){
		            		this.refresh();
		            		this.getSelectionModel().clearSelections(true);
		            		//this._updateCategoryComboBoxes();
		            	},scope:this
		            }
		        }
		    });
	    }
		this.updateTechniqueWindow.setValues(selRow.data);
		this.updateTechniqueWindow.show(e.target);
	}
	,toggleActive: function(btn,e) {
        var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
        MODx.Ajax.request({
            url: this.config.url
            ,params: {
                action: 'mgr/attendance/scTechniqueUpdate'
                ,id: selRow.data.id
                ,toggleActive: 1
            }
            ,listeners: {
                'success': {fn:function(r) {
                    this.refresh();
                    Ext.getCmp('studentcentre-grid-attendance-techniques').refresh();
                    this._updateTechniqueComboBoxes();
                },scope:this}
            }
        });
        return true;
    }
    // used to reload the Technique combobox in the Level Techniques grid
    ,_updateTechniqueComboBoxes: function() {
	    var cbTechniques = new Array();
        cbTechniques[0] = Ext.getCmp('attendance-create-level-technique-technique-combo');
        for (var i=0; i<cbTechniques.length; i++) {
	    	if (cbTechniques[i]) {
	        	cbTechniques[i].setDisabled(false);
	            var s = cbTechniques[i].store;
	            s.removeAll();
	            s.load();
	            cbTechniques[i].clearValue();
	        }
        }
    }
});
Ext.reg('studentcentre-grid-attendance-techniques',StudentCentre.grid.AttendanceTechniques);


// !Create Technique Window
StudentCentre.window.CreateTechnique = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('studentcentre.att_create_technique')
        ,width: '400'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,baseParams: {
            action: 'mgr/attendance/scTechniqueCreate'
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
    StudentCentre.window.CreateTechnique.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.CreateTechnique,MODx.Window);
Ext.reg('studentcentre-window-technique-create',StudentCentre.window.CreateTechnique);


// !Update Technique Window
StudentCentre.window.UpdateTechnique = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('studentcentre.att_update_technique')
        ,width: '400'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,baseParams: {
            action: 'mgr/attendance/scTechniqueUpdate'
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
    StudentCentre.window.UpdateTechnique.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.UpdateTechnique,MODx.Window);
Ext.reg('sc-window-technique-update',StudentCentre.window.UpdateTechnique);