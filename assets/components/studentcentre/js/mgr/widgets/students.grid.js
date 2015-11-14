// !Students Grid
StudentCentre.grid.Students = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'sc-grid-students'
        ,url: StudentCentre.config.connectorUrl
        ,baseParams: {
        	action: 'mgr/students/scModUserGetList'
        	,activeOnly: 1
        }
        ,fields: ['id','internalKey','username','firstname','lastname','dob','email','phone','active']
        ,paging: true
        ,remoteSort: true
        ,anchor: '97%'
        ,autoExpandColumn: 'username'
        //,save_action: 'mgr/students/scModUserUpdateFromGrid'
        //,autosave: true
        ,columns: [{
            header: 'id'
            ,hidden: true
            ,dataIndex: 'id'
            ,name: 'id'
        },{
            header: _('studentcentre.id')
            ,dataIndex: 'internalKey'
            ,name: 'internalKey'
            ,sortable: true
            ,width: 40
        },{
            header: _('studentcentre.username')
            ,dataIndex: 'username'
            ,name: 'username'
            ,sortable: true
        },{
            header: _('studentcentre.first_name')
            ,dataIndex: 'firstname'
            ,name: 'firstname'
            ,sortable: true
        },{
            header: _('studentcentre.last_name')
            ,dataIndex: 'lastname'
            ,name: 'lastname'
            ,sortable: true
        },{
            header: _('studentcentre.birth_date')
            ,dataIndex: 'dob'
            ,name: 'dob'
            ,sortable: true
        },{
            header: _('studentcentre.active')
            ,dataIndex: 'active'
            ,name: 'active'
            ,editor: { xtype: 'combo-active-status', renderer: true}
            ,sortable: true
        }]
        ,tbar:[{
            xtype: 'button'
            ,id: 'students-create-student-button'
            ,text: _('studentcentre.create_student')
            ,listeners: {
                'click': {fn: function() {
	                location.href = '?a='+StudentCentre.action+'&action=studentscreate';
                }, scope: this}
            }
        },{
            xtype: 'button'
            ,id: 'students-update-student-button'
            ,text: _('studentcentre.update')
            ,listeners: {
                'click': {fn: this.updateStudent, scope: this}
            }
        },{
            xtype: 'button'
            ,id: 'students-active-toggle-button'
            ,text: _('studentcentre.toggle_active_status')
            ,handler: function(btn,e) {
                this.toggleActive(btn,e);
            }
            ,scope: this
        },'->',{ // This defines the toolbar for the search
		    xtype: 'textfield' // Here we're defining the search field for the toolbar
		    ,id: 'students-search-filter'
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
            ,id: 'clear-student-search'
            ,text: _('studentcentre.clear_search')
            ,listeners: {
                'click': {fn: this.clearStudentSearch, scope: this}
            }
        }]
    });
    StudentCentre.grid.Students.superclass.constructor.call(this,config)
};
Ext.extend(StudentCentre.grid.Students,MODx.grid.Grid,{
    search: function(tf,nv,ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,clearStudentSearch: function() {
	    this.getStore().baseParams = {
            action: 'mgr/students/scModUserGetList'
            ,activeOnly: 1
    	};
        Ext.getCmp('students-search-filter').reset();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,getMenu: function() { // MODX looks for getMenu when someone right-clicks on the grid
	    return [{
	        text: _('studentcentre.update')
	        ,handler: this.updateStudent
	    },'-',{
	        text: _('studentcentre.toggle_active_status')
	        ,handler: this.toggleActive
	    }];
	}
    ,updateStudent: function(btn,e) {
		var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
        location.href = '?a='+StudentCentre.action+'&action=studentsupdate&sid='+selRow.data.internalKey;
	}
	,toggleActive: function(btn,e) {
        var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
        MODx.Ajax.request({
            url: this.config.url
            ,params: {
                action: 'mgr/students/scModUserUpdate'
                ,id: selRow.data.id
                ,toggleActive: 1
            }
            ,listeners: {
                'success': {fn:function(r) {
                    this.refresh();
                    Ext.getCmp('sc-grid-students').refresh();
                },scope:this}
            }
        });
        return true;
    }
});
Ext.reg('sc-grid-students',StudentCentre.grid.Students);


// !Active Combobox
StudentCentre.combo.ActiveStatus = function(config) {
    config = config || {};
    Ext.applyIf(config, {
        store: new Ext.data.ArrayStore({
            id: 'combo-active-status'
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
Ext.reg('combo-active-status', StudentCentre.combo.ActiveStatus);