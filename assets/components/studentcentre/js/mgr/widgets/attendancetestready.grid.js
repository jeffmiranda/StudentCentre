// !Test Ready Grid
StudentCentre.grid.TestReady = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'studentcentre-grid-test-ready'
        ,url: StudentCentre.config.connectorUrl
        ,baseParams: {
			action: 'mgr/attendance/scClassProgressGetList'
        	,testReadyOnly: 1
        	,activeOnly: 1
        }
        ,fields: ['id','student_id','class_level_category_id','level_id','next_level_id','username','class_level_category_name','level_name','next_level_name','hours_since_leveling','total_hours']
        ,paging: true
        ,pageSize: 20
        ,remoteSort: true
        ,anchor: '97%'
        ,columns: [{
            header: _('studentcentre.id')
            ,hidden: true
            ,dataIndex: 'id'
        },{
            header: _('studentcentre.att_student_id')
            ,hidden: true
            ,dataIndex: 'student_id'
            ,name: 'student_id'
        },{
            header: _('studentcentre.att_level_category_id')
            ,hidden: true
            ,dataIndex: 'class_level_category_id'
            ,name: 'class_level_category_id'
        },{
            header: _('studentcentre.ass_level_id')
            ,hidden: true
            ,dataIndex: 'level_id'
            ,name: 'level_id'
        },{
            header: _('studentcentre.next_level_id')
            ,hidden: true
            ,dataIndex: 'next_level_id'
            ,name: 'next_level_id'
        },{
            header: _('studentcentre.username')
            ,dataIndex: 'username'
            ,sortable: true
            ,width: 50
        },{
            header: _('studentcentre.att_level_category')
            ,dataIndex: 'class_level_category_name'
            ,sortable: true
            ,width: 50
        },{
            header: _('studentcentre.att_level')
            ,dataIndex: 'level_name'
            ,sortable: true
            ,width: 50
        },{
            header: _('studentcentre.next_level')
            ,dataIndex: 'next_level_name'
            ,sortable: true
            ,width: 50
        },{
            header: _('studentcentre.att_hours_since_leveling')
            ,dataIndex: 'hours_since_leveling'
            ,sortable: true
            ,width: 50
        },{
            header: _('studentcentre.att_total_hours')
            ,dataIndex: 'total_hours'
            ,sortable: true
            ,width: 50
        }]
        ,tbar:[{
            xtype: 'button'
            ,id: 'attendance-start-test-button'
            ,text: _('studentcentre.att_start_test')
            ,listeners: {
                'click': {fn: this.startTest, scope: this}
            }
        },'->',{ // This defines the toolbar for the search
		    xtype: 'textfield' // Here we're defining the search field for the toolbar
		    ,id: 'test-ready-search-filter'
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
            ,id: 'clear-test-ready-search'
            ,text: _('studentcentre.ass_clear_search')
            ,listeners: {
                'click': {fn: this.clearTestReadySearch, scope: this}
            }
        }]
    });
    StudentCentre.grid.TestReady.superclass.constructor.call(this,config)
};
Ext.extend(StudentCentre.grid.TestReady,MODx.grid.Grid,{
    search: function(tf,nv,ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,clearTestReadySearch: function() {
	    this.getStore().baseParams = {
            action: 'mgr/attendance/scClassProgressGetList'
        	,testReadyOnly: 1
    	};
        Ext.getCmp('test-ready-search-filter').reset();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,startTest: function(btn,e) {
    
    	var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
        //console.log(selRow.data);
        strData = encodeURIComponent(Ext.util.JSON.encode(selRow.data));
        //console.log('String: '+strData);
        location.href = '?a='+StudentCentre.action+'&action=attendancetest&data='+strData;
    }
    ,getMenu: function() { // MODX looks for getMenu when someone right-clicks on the grid
	    return [{
	        text: _('studentcentre.att_start_test')
	        ,handler: this.startTest
	    }];
	}
});
Ext.reg('studentcentre-grid-test-ready',StudentCentre.grid.TestReady);