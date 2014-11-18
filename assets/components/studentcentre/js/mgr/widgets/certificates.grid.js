// !Certificates Grid
StudentCentre.grid.Certificates = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'sc-grid-certificates'
        ,url: StudentCentre.config.connectorUrl
        ,baseParams: {
        	action: 'mgr/certificates/scCertificateGetList'
        }
        ,fields: ['id','student_id','certificate_type_id','level_id','certificate_type','username','level_name','hours','anniversary','flag','date_created']
        ,paging: true
        ,remoteSort: true
        ,anchor: '97%'
        ,autoExpandColumn: 'username'
        ,save_action: 'mgr/certificates/scCertificateUpdateFromGrid'
        ,autosave: true
        ,columns: [{
            header: 'id'
            ,hidden: true
            ,dataIndex: 'id'
            ,name: 'id'
        },{
            header: 'student_id'
            ,hidden: true
            ,dataIndex: 'student_id'
            ,name: 'student_id'
        },{
            header: 'certificate_type_id'
            ,hidden: true
            ,dataIndex: 'certificate_type_id'
            ,name: 'certificate_type_id'
        },{
            header: 'level_id'
            ,hidden: true
            ,dataIndex: 'level_id'
            ,name: 'level_id'
        },{
            header: _('studentcentre.type')
            ,dataIndex: 'certificate_type'
            ,name: 'certificate_type'
            ,sortable: true
            ,width: 40
        },{
            header: _('studentcentre.username')
            ,dataIndex: 'username'
            ,name: 'username'
            ,sortable: true
            ,width: 40
        },{
            header: _('studentcentre.level')
            ,dataIndex: 'level_name'
            ,name: 'level_name'
            ,sortable: true
            ,width: 50
        },{
            header: _('studentcentre.hours')
            ,dataIndex: 'hours'
            ,name: 'hours'
            ,sortable: true
            ,width: 30
        },{
            header: _('studentcentre.anniversary')
            ,dataIndex: 'anniversary'
            ,name: 'anniversary'
            ,sortable: true
            ,width: 30
        },{
            header: _('studentcentre.date_created')
            ,dataIndex: 'date_created'
            ,name: 'date_created'
            ,sortable: true
            ,width: 40
        },{
            header: _('studentcentre.flag')
            ,dataIndex: 'flag'
            ,name: 'flag'
            ,sortable: true
            ,width: 30
            ,align: 'center'
            ,editor: { xtype: 'combo-flag-status' }
            ,renderer: function(value) {
            	var strFlag = 'ico-unflagged.png';
            	if (value == 1) strFlag = 'ico-flagged.png';
		        return '<img src="' + MODx.config["studentcentre.assets_url"] + 'images/' + strFlag + '" />';
		    }
        }]
        ,tbar:[{
            xtype: 'button'
            ,id: 'sc-create-certificate-button'
            ,text: _('studentcentre.create_certificate')
            ,handler: { xtype: 'sc-window-certificate-create', blankValues: true }
        },{
            xtype: 'button'
            ,id: 'sc-generate-certificate-button'
            ,text: _('studentcentre.generate_pdf')
            ,listeners: {
                'click': {fn: this.generateCertificate, scope: this}
            }
        },{
            xtype: 'button'
            ,id: 'sc-flag-toggle-button'
            ,text: _('studentcentre.toggle_flag_status')
            ,handler: function(btn,e) {
                this.toggleFlag(btn,e);
            }
            ,scope: this
        },'->',{ // This defines the toolbar for the search
		    xtype: 'textfield' // Here we're defining the search field for the toolbar
		    ,id: 'certificates-search-filter'
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
            ,id: 'clear-certificates-search'
            ,text: _('studentcentre.clear_search')
            ,listeners: {
                'click': {fn: this.clearCertificateSearch, scope: this}
            }
        }]
    });
    StudentCentre.grid.Certificates.superclass.constructor.call(this,config)
};
Ext.extend(StudentCentre.grid.Certificates,MODx.grid.Grid,{
    search: function(tf,nv,ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,clearCertificateSearch: function() {
	    this.getStore().baseParams = {
            action: 'mgr/certificates/scCertificateGetList'
    	};
        Ext.getCmp('certificates-search-filter').reset();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,getMenu: function() { // MODX looks for getMenu when someone right-clicks on the grid
	    return [{
	        text: _('studentcentre.generate_pdf')
	        ,handler: this.generateCertificate
	    },'-',{
	        text: _('studentcentre.toggle_flag_status')
	        ,handler: this.toggleFlag
	    }];
	}
    ,generateCertificate: function(btn,e) {
    	console.log(this.config.url);
		var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
        location.href = this.config.url+'?action=mgr/certificates/scCertificateGenerate&cid='+selRow.data.id+'&HTTP_MODAUTH='+MODx.siteId;
	}
	,toggleFlag: function(btn,e) {
        var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
        MODx.Ajax.request({
            url: this.config.url
            ,params: {
                action: 'mgr/certificates/scCertificateUpdate'
                ,id: selRow.data.id
                ,toggleFlag: 1
            }
            ,listeners: {
                'success': {fn:function(r) {
                    this.refresh();
                    Ext.getCmp('sc-grid-certificates').refresh();
                },scope:this}
            }
        });
        return true;
    }
});
Ext.reg('sc-grid-certificates',StudentCentre.grid.Certificates);


// !Flag Combobox
StudentCentre.combo.FlagStatus = function(config) {
    config = config || {};
    Ext.applyIf(config, {
        store: new Ext.data.ArrayStore({
            fields: ['value','display']
            ,data: [
                [1,'Flag']
                ,[0,'Unflag']
            ]
        })
        ,mode: 'local'
        ,displayField: 'display'
        ,valueField: 'value'
    });
    
    StudentCentre.combo.FlagStatus.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.FlagStatus, MODx.combo.ComboBox);
Ext.reg('combo-flag-status', StudentCentre.combo.FlagStatus);


// !Active Combobox
StudentCentre.combo.ActiveStatus = function(config) {
    config = config || {};
    Ext.applyIf(config, {
        store: new Ext.data.ArrayStore({
            fields: ['value','display']
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