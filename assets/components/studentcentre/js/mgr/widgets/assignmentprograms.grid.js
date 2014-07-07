// !Programs Grid
StudentCentre.grid.StudentPrograms = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'studentcentre-grid-assignment-programs'
        ,url: StudentCentre.config.connectorUrl
        ,baseParams: { action: 'mgr/assignments/scAssignmentProgramGetList' }
        ,fields: ['id','name','active','last_modified']
        ,paging: true
        ,remoteSort: true
        ,anchor: '97%'
        ,autoExpandColumn: 'name'
        ,save_action: 'mgr/assignments/scAssignmentProgramUpdateFromGrid'
        ,autosave: true
        ,save_callback: this._updateProgramComboBoxes
        ,columns: [{
            header: _('id')
            ,hidden: true
            ,dataIndex: 'id'
        },{
            header: _('studentcentre.ass_program_name')
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
            ,id: 'assignments-create-program-button'
            ,text: _('studentcentre.ass_create_program')
            ,handler: { xtype: 'studentcentre-window-program-create', blankValues: true }
        },{
            xtype: 'button'
            ,id: 'assignments-update-program-button'
            ,text: _('studentcentre.ass_update_program')
            ,listeners: {
                'click': {fn: this.updateProgram, scope: this}
            }
        },{
            xtype: 'button'
            ,id: 'assignments-program-active-toggle-button'
            ,text: _('studentcentre.ass_toggle_active')
            ,handler: function(btn,e) {
                this.toggleActiveProgram(btn,e);
            }
            ,scope: this
        },'->',{ // This defines the toolbar for the search
		    xtype: 'textfield' // Here we're defining the search field for the toolbar
		    ,id: 'program-search-filter'
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
            ,id: 'clear-program-search'
            ,text: _('studentcentre.ass_clear_search')
            ,listeners: {
                'click': {fn: this.clearProgramSearch, scope: this}
            }
        }]
    });
    StudentCentre.grid.StudentPrograms.superclass.constructor.call(this,config)
};
Ext.extend(StudentCentre.grid.StudentPrograms,MODx.grid.Grid,{
    search: function(tf,nv,ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,clearProgramSearch: function() {
	    this.getStore().baseParams = {
            action: 'mgr/assignments/scAssignmentProgramGetList'
    	};
        Ext.getCmp('program-search-filter').reset();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,getMenu: function() { // MODX looks for getMenu when someone right-clicks on the grid
	    return [{
	        text: _('studentcentre.ass_update_program')
	        ,handler: this.updateProgram
	    },{
	        text: _('studentcentre.ass_toggle_active')
	        ,handler: this.toggleActiveProgram
	    }];
	}
	,updateProgram: function(btn,e) {
		var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
	    this.updateProgramWindow = MODx.load({
	        xtype: 'studentcentre-window-program-update'
	        ,record: selRow.data
	        ,listeners: {
	            'success': {
	            	fn:function(r){
	            		this.refresh();
	            		this._updateProgramComboBoxes();
	            	},scope:this
	            }
	        }
	    });
		this.updateProgramWindow.setValues(selRow.data);
		this.updateProgramWindow.show(e.target);
	}
	,toggleActiveProgram: function(btn,e) {
        var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
        MODx.Ajax.request({
            url: this.config.url
            ,params: {
                action: 'mgr/assignments/scAssignmentProgramUpdate'
                ,id: selRow.data.id
                ,toggleActive: 1
            }
            ,listeners: {
                'success': {fn:function(r) {
                    this.refresh();
                    this._updateProgramComboBoxes();
                },scope:this}
            }
        });
        return true;
    }
    ,_updateProgramComboBoxes: function() {
		var cbProgram = new Array();
		cbProgram[0] = Ext.getCmp('assignment-combo-enrollment-program-name');
		cbProgram[1] = Ext.getCmp('assignment-combo-levels-create-program-name');
		for (var i=0; i<cbProgram.length; i++) {
			if (cbProgram[i]) {
		    	cbProgram[i].setDisabled(false);
		        var s = cbProgram[i].store;
		        s.removeAll();
		        s.load();
		        cbProgram[i].clearValue();
		    }
		}
    }
});
Ext.reg('studentcentre-grid-assignment-programs',StudentCentre.grid.StudentPrograms);


// !Create Program Window
StudentCentre.window.CreateProgram = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('studentcentre.ass_create_program')
        ,width: '400'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,baseParams: {
            action: 'mgr/assignments/scAssignmentProgramCreate'
        }
        ,fields: [{
            xtype: 'textfield'
            ,fieldLabel: _('studentcentre.ass_program')
            ,name: 'name'
            ,anchor: '100%'
        }]
    });
    StudentCentre.window.CreateProgram.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.CreateProgram,MODx.Window);
Ext.reg('studentcentre-window-program-create',StudentCentre.window.CreateProgram);


// !Update Program Window
StudentCentre.window.UpdateProgram = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('studentcentre.ass_update_program')
        ,width: '400'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,baseParams: {
            action: 'mgr/assignments/scAssignmentProgramUpdate'
        }
        ,fields: [{
            xtype: 'hidden'
            ,name: 'id'
        },{
            xtype: 'textfield'
            ,fieldLabel: _('studentcentre.ass_program')
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
    StudentCentre.window.UpdateProgram.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.UpdateProgram,MODx.Window);
Ext.reg('studentcentre-window-program-update',StudentCentre.window.UpdateProgram);