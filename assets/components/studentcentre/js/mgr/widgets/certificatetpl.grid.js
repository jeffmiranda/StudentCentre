// !Certificate type Combobox
StudentCentre.combo.CertificateType = function(config) {
    config = config || {};
    Ext.applyIf(config, {
    	fieldLabel: _('studentcentre.type')
	    ,width: 300
	    ,hiddenName: 'certificate_type_id'
	    ,hiddenValue: ''
	    ,emptyText: 'Select type...'
	    ,typeAhead: true
	    ,valueField: 'id'
	    ,displayField: 'name'
	    ,fields: ['id', 'name']
	    ,pageSize: 20
	    ,url: StudentCentre.config.connectorUrl
	    ,baseParams: {
	        action: 'mgr/certificates/scCertificateTypeGetList'
	        ,activeOnly: 1
	    }
    });
    
    StudentCentre.combo.CertificateType.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.CertificateType, MODx.combo.ComboBox);
Ext.reg('combo-certificate-type', StudentCentre.combo.CertificateType);


// !Level Name Combobox
StudentCentre.combo.LevelName = function(config) {
    config = config || {};
    Ext.applyIf(config, {
    	fieldLabel: _('studentcentre.level')
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
	        ,activeOnly: 1
	    }
    });
    
    StudentCentre.combo.LevelName.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.LevelName, MODx.combo.ComboBox);
Ext.reg('sc-class-level-combo', StudentCentre.combo.LevelName);


// !Certificate Template Grid
StudentCentre.grid.CertificateTpl = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'sc-grid-certificate-tpl'
        ,url: StudentCentre.config.connectorUrl
        ,baseParams: {
        	action: 'mgr/certificates/scCertificateTplGetList'
        }
        ,fields: ['id','certificate_type_id','level_id','certificate_type','level_name','description','active']
        ,paging: true
        ,remoteSort: true
        ,anchor: '97%'
        ,autoExpandColumn: 'certificate_type'
        ,save_action: 'mgr/certificates/scCertificateTplUpdateFromGrid'
        ,autosave: true
        ,columns: [{
            header: 'id'
            ,hidden: true
            ,dataIndex: 'id'
            ,name: 'id'
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
            //,editor: { xtype: 'combo-certificate-type', renderer: true }
        },{
            header: _('studentcentre.level')
            ,dataIndex: 'level_name'
            ,name: 'level_name'
            ,sortable: true
            ,width: 50
        },{
            header: _('studentcentre.description')
            ,dataIndex: 'description'
            ,name: 'description'
            ,sortable: true
            ,width: 40
            ,editor: { xtype: 'textfield' }
        },
        /*{
            header: _('studentcentre.active')
            ,dataIndex: 'active'
            ,name: 'active'
            ,sortable: true
            ,width: 30
            ,editor: { xtype: 'combo-active-status', renderer: true}
        },*/
        {
	        xtype: 'actioncolumn'
	        ,header: _('studentcentre.view')
	        ,width: 50
	        ,align: 'center'
	        ,css: 'padding-top: 8px;'
	        ,items: [{
	            icon: MODx.config["studentcentre.assets_url"] + 'images/ico-view.png'
	            ,tooltip: _('studentcentre.view')
	            ,handler: function (grid, rowIndex, colIndex, item, e) {
                    var id = grid.store.data.keys[rowIndex];
                    window.open(MODx.config["studentcentre.assets_url"] + 'certificatetpl/' + id + '.jpg');
                }
                ,scope: this
	        }]
	    }]
        ,tbar:[{
            xtype: 'button'
            ,id: 'sc-upload-certificate-tpl-button'
            ,text: _('studentcentre.upload_certificate_tpl')
            ,handler: { xtype: 'sc-window-certificate-tpl-upload', blankValues: true }
        },{
            xtype: 'button'
            ,id: 'sc-update-certificate-tpl-button'
            ,text: _('studentcentre.update')
            ,listeners: {
                'click': {fn: this.updateCertificateTpl, scope: this}
            }
        },{
            xtype: 'button'
            ,id: 'sc-remove-certificate-tpl-button'
            ,text: _('studentcentre.remove')
            ,listeners: {
                'click': {fn: this.removeCertificateTpl, scope: this}
            }
        }
        /*
        ,{
            xtype: 'button'
            ,id: 'sc-toggle-active-button'
            ,text: _('studentcentre.toggle_active_status')
            ,handler: function(btn,e) {
                this.toggleActive(btn,e);
            }
            ,scope: this
        }
        */
        ,'->',{ // This defines the toolbar for the search
		    xtype: 'textfield' // Here we're defining the search field for the toolbar
		    ,id: 'certificate-tpl-search-filter'
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
            ,id: 'clear-certificate-tpl-search'
            ,text: _('studentcentre.clear_search')
            ,listeners: {
                'click': {fn: this.clearCertificateTplSearch, scope: this}
            }
        }]
    });
    StudentCentre.grid.CertificateTpl.superclass.constructor.call(this,config)
};
Ext.extend(StudentCentre.grid.CertificateTpl,MODx.grid.Grid,{
    search: function(tf,nv,ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,clearCertificateTplSearch: function() {
	    this.getStore().baseParams = {
            action: 'mgr/certificates/scCertificateTplGetList'
    	};
        Ext.getCmp('certificate-tpl-search-filter').reset();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,getMenu: function() { // MODX looks for getMenu when someone right-clicks on the grid
	    return [{
	        text: _('studentcentre.update')
	        ,handler: this.updateCertificateTpl
	    },'-',{
	        text: _('studentcentre.remove')
	        ,handler: this.removeCertificateTpl
	    }
	    /*
	    ,'-',{
	        text: _('studentcentre.toggle_active_status')
	        ,handler: this.toggleActive
	    }
	    */
	    ];
	}
	,updateCertificateTpl: function(btn,e) {
		var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
        //console.log(selRow.data);
	    if (!this.updateCertificateTplWindow) {
		    this.updateCertificateTplWindow = MODx.load({
		        xtype: 'sc-window-certificate-tpl-update'
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
		this.updateCertificateTplWindow.setValues(selRow.data);
		this.updateCertificateTplWindow.show(e.target);
	}
	,removeCertificateTpl: function() {
	    if (this.selModel.selections.items.length == 1) {
		    MODx.msg.confirm({
		        title: _('studentcentre.remove_certificate_tpl')
		        ,text: _('studentcentre.remove_certificate_tpl_text')
		        ,url: StudentCentre.config.connectorUrl
		        ,params: {
		            action: 'mgr/certificates/scCertificateTplRemove'
		            ,id: this.selModel.selections.items[0].id
		        }
		        ,listeners: {
		            'success': {fn:this.refresh, scope:this}
		        }
		    });
		}
	}
	,toggleActive: function(btn,e) {
        var selRow = this.getSelectionModel().getSelected();
        if (selRow.length <= 0) return false;
        MODx.Ajax.request({
            url: this.config.url
            ,params: {
                action: 'mgr/certificates/scCertificateTplUpdate'
                ,id: selRow.data.id
                ,toggleActive: 1
            }
            ,listeners: {
                'success': {fn:function(r) {
                    this.refresh();
                    Ext.getCmp('sc-grid-certificate-tpl').refresh();
                },scope:this}
            }
        });
        return true;
    }
});
Ext.reg('sc-grid-certificate-tpl',StudentCentre.grid.CertificateTpl);


// !Upload Certificate Template Window
StudentCentre.window.UploadCertificateTpl = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('studentcentre.upload_certificate_tpl')
        ,width: '400'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,fileUpload: true
        ,baseParams: {
            action: 'mgr/certificates/scCertificateTplCreate'
        }
        ,fields: [{
            xtype: 'textfield'
            ,fieldLabel: _('studentcentre.template_jpg')
            ,inputType: 'file'
            ,name: 'tpl'
            ,anchor: '100%'
        },{
            xtype: 'combo-certificate-type'
            ,id: 'sc-upload-combo-certificate-type'
            ,fieldLabel: _('studentcentre.type')
            ,name: 'certificate_type_id'
            ,hiddenName: 'certificate_type_id'
            ,anchor: '100%'
            ,listeners: {
	            select: { fn: this.toggleDisabledClassLevelCombo, scope: this }
	        }
        },{
            xtype: 'sc-class-level-combo'
            ,id: 'sc-upload-class-level-combo'
            ,fieldLabel: _('studentcentre.level')
            ,name: 'level_id'
            ,hiddenName: 'level_id'
            ,anchor: '100%'
            ,disabled: true
        },{
            xtype: 'textfield'
            ,fieldLabel: _('studentcentre.description')
            ,name: 'description'
            ,anchor: '100%'
        }]
    });
    StudentCentre.window.UploadCertificateTpl.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.UploadCertificateTpl,MODx.Window, {
	toggleDisabledClassLevelCombo: function(combo, value) {
		var cbClassLevel = Ext.getCmp('sc-upload-class-level-combo');
		// if the type equals level
		if (combo.value == 3) {
			cbClassLevel.enable();
		} else {
			cbClassLevel.clearValue();
			cbClassLevel.disable();
		}
    }
});
Ext.reg('sc-window-certificate-tpl-upload',StudentCentre.window.UploadCertificateTpl);


// !Update Window
StudentCentre.window.UpdateCertificateTpl = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('studentcentre.update_certificate_tpl')
        ,width: '400'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,fileUpload: true
        ,baseParams: {
            action: 'mgr/certificates/scCertificateTplUpdate'
        }
        ,fields: [{
            xtype: 'hidden'
            ,name: 'id'
        },{
        	xtype: 'button'
        	,fieldLabel: ' '
        	,text: _('studentcentre.certificate_view_current_tpl')
        	,listeners: {
                'click': {fn:function(btn, e) {
                    window.open(MODx.config["studentcentre.assets_url"] + 'certificatetpl/' + config.record.id + '.jpg');
                }, scope: this }
            }
        },{
            xtype: 'textfield'
            ,fieldLabel: _('studentcentre.upload_new_template_jpg')
            ,inputType: 'file'
            ,name: 'tpl'
            ,anchor: '100%'
        },{
            xtype: 'combo-certificate-type'
            ,id: 'sc-update-combo-certificate-type'
            ,fieldLabel: _('studentcentre.type')
            ,name: 'certificate_type_id'
            ,hiddenName: 'certificate_type_id'
            ,anchor: '100%'
            ,disabled: true
        },{
            xtype: 'sc-class-level-combo'
            ,id: 'sc-update-class-level-combo'
            ,fieldLabel: _('studentcentre.level')
            ,name: 'level_id'
            ,hiddenName: 'level_id'
            ,anchor: '100%'
            ,disabled: true
        },{
            xtype: 'textfield'
            ,fieldLabel: _('studentcentre.description')
            ,name: 'description'
            ,anchor: '100%'
        }/*
,{
            xtype: 'combo-active-status'
            ,fieldLabel: _('studentcentre.active')
            ,name: 'active'
            ,hiddenName: 'active'
            ,anchor: '100%'
        }
*/]
    });
    StudentCentre.window.UpdateCertificateTpl.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.UpdateCertificateTpl,MODx.Window);
Ext.reg('sc-window-certificate-tpl-update',StudentCentre.window.UpdateCertificateTpl);