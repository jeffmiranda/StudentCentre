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


/*
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
*/


// !Location Combobox
StudentCentre.combo.Location = function(config) {
    config = config || {};
    Ext.applyIf(config, {
	    emptyText: _('studentcentre.att_select_loc')
	    ,fieldLabel: _('studentcentre.location')
	    ,typeAhead: true
	    ,valueField: 'id'
	    ,displayField: 'name'
	    ,fields: ['id','name']
	    ,url: StudentCentre.config.connectorUrl
	    ,baseParams: {
	        action: 'mgr/attendance/scLocationGetList'
	        ,activeOnly: 1
	    }
    });
    StudentCentre.combo.Location.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.Location, MODx.combo.ComboBox);
Ext.reg('certificates-combo-location', StudentCentre.combo.Location);


// !Scheduled class combobox. Used on Take Attendance tab
StudentCentre.combo.ScheduledClass = function(config) {
    config = config || {};
    Ext.applyIf(config, {
		emptyText: _('studentcentre.att_select_class')
	    ,fieldLabel: _('studentcentre.class')
	    ,typeAhead: true
	    ,pageSize: 20
	    ,valueField: 'id'
	    ,displayField: 'class_name_description'
	    ,fields: ['id','class_name_description']
	    ,url: StudentCentre.config.connectorUrl
	    ,baseParams: {
	        action: 'mgr/attendance/scScheduledClassGetList'
	        ,activeOnly: 1
	    }
    });
    StudentCentre.combo.ScheduledClass.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.ScheduledClass, MODx.combo.ComboBox);
Ext.reg('certificates-combo-scheduled-class', StudentCentre.combo.ScheduledClass);


// !Student Name Combobox
StudentCentre.combo.StudentName = function(config) {
    config = config || {};
    Ext.applyIf(config, {
    	fieldLabel: _('studentcentre.student')
	    ,name: 'student_id'
	    ,width: 300
	    ,hiddenName: 'student_id' //'student_id'
	    ,hiddenValue: ''
	    ,emptyText: _('studentcentre.att_select_stu')
	    ,typeAhead: true
	    ,valueField: 'student_id'
	    ,displayField: 'username'
	    ,pageSize: 20
	    ,fields: ['student_id', 'username']
	    ,url: StudentCentre.config.connectorUrl
	    ,baseParams: {
	        action: 'mgr/students/scModUserGetList'
	        ,activeOnly: 1
	    }
    });
    
    StudentCentre.combo.StudentName.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.StudentName, MODx.combo.ComboBox);
Ext.reg('certificates-combo-student-name', StudentCentre.combo.StudentName);


// !Level Name Combobox
StudentCentre.combo.LevelName = function(config) {
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
	        action: 'mgr/certificates/scClassLevelGetList'
	    }
    });
    
    StudentCentre.combo.LevelName.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.LevelName, MODx.combo.ComboBox);
Ext.reg('certificates-combo-class-level', StudentCentre.combo.LevelName);


// !Create Certificate Window
StudentCentre.window.CreateCertificate = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('studentcentre.create_certificate')
        ,width: '400'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,baseParams: {
            action: 'mgr/certificates/scCertificateCreate'
        }
        ,fields: [{
            xtype: 'certificates-combo-location'
            ,id: 'create-certificate-window-location'
            ,name: 'location'
		    ,hiddenName: 'location_id'
		    ,anchor: '100%'
		    ,allowBlank: true
		    ,listeners: {
	            select: { fn: this.getScheduledClasses, scope: this }
	        }
        },{
	        xtype: 'certificates-combo-scheduled-class'
            ,id: 'create-certificate-window-scheduled-class'
            ,name: 'scheduled_class_id'
		    ,hiddenName: 'scheduled_class_id'
		    ,anchor: '100%'
		    ,disabled: true
		    ,allowBlank: true
		    ,listeners: {
	            select: { fn: this.getEnrolledStudents, scope: this }
	        }
        },{
			xtype: 'certificates-combo-student-name'
			,id: 'create-certificate-window-student-name'
			,hiddenName: 'student_id'
			,anchor: '100%'
			,disabled: true
			,allowBlank: false
			,listeners: {
	            select: { fn: function() {
			        // Get the certificate type combobox and enable it
					var cbCTypes = Ext.getCmp('create-certificate-window-certificate-type');
					if (cbCTypes) { // if the combobox was retrieved
			        	cbCTypes.setDisabled(false); // enable the combobox
			        }
	            }
	            , scope: this }
	        }
		},{
            xtype: 'combo-certificate-type'
            ,id: 'create-certificate-window-certificate-type'
            ,name: 'certificate_type_id'
            ,hiddenName: 'certificate_type_id'
            ,anchor: '100%'
            ,disabled: true
            ,allowBlank: false
            ,listeners: {
	            select: { fn: this.toggleFields, scope: this }
	        }
        },{
			xtype: 'numberfield'
			,id: 'create-certificate-window-anniversary'
			,name: 'anniversary'
			,disabled: true
			,allowBlank: true
			,allowNegative: false
			,fieldLabel: _('studentcentre.anniversary')
		},{
			xtype: 'numberfield'
			,id: 'create-certificate-window-hours'
			,name: 'hours'
			,disabled: true
			,allowBlank: true
			,allowNegative: false
			,fieldLabel: _('studentcentre.hours')
		},{
            xtype: 'certificates-combo-class-level'
            ,id: 'create-certificate-window-class-level'
            ,name: 'level_id'
            ,hiddenName: 'level_id'
            ,anchor: '100%'
            ,disabled: false
            ,allowBlank: true
        }]
    });
    StudentCentre.window.CreateCertificate.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.CreateCertificate,MODx.Window,{
	// Load the Sched Class combobox with classes at a specific location
	getScheduledClasses: function(combo, value) {
		// Get the students combobox and reset it
		var cbStudents = Ext.getCmp('create-certificate-window-student-name');
		if (cbStudents) { // if the combobox was retrieved
        	cbStudents.setDisabled(true); // disable the combobox
            var d = cbStudents.store; // get the store
            d.removeAll(); // removes any existing records from the store
            d.load(); // load the store with data
            cbStudents.clearValue(); // clear the text value
        }
		// Reset certificate fields
		this._resetCertificateFields();
		// Get the Sched Class combobox
		var cbClass = Ext.getCmp('create-certificate-window-scheduled-class');
		if (cbClass) { // if the combobox was retrieved
        	cbClass.setDisabled(false); // enable the combobox
            var c = cbClass.store; // get the store
            c.baseParams['location_id'] = value.id; // set the location_id param
            c.removeAll(); // removes any existing records from the store
            c.load(); // load the store with data
            cbClass.clearValue(); // clear the text value
        }
    }
    // Load the Students combobox with students enrolled for the scheduled class
	,getEnrolledStudents: function(combo, value) {
		// Reset certificate fields
		this._resetCertificateFields();
		// Get the Students combobox
		var cbStudents = Ext.getCmp('create-certificate-window-student-name');
		if (cbStudents) { // if the combobox was retrieved
        	cbStudents.setDisabled(false); // enable the combobox
            var st = cbStudents.store; // get the store
            st.baseParams['scheduled_class_id'] = value.id; // set the scheduled_class_id param
            st.removeAll(); // removes any existing records from the store
            st.load(); // load the store with data
            cbStudents.clearValue(); // clear the text value
        }
    }
    // Toggle certificate fields based on selected certificate type
    ,toggleFields: function(combo, value) {
		var typeId = value.id;
		// disable anniversary, hour, and level fields
		// Get the anniversary field and reset it
        var txtAnniversary = Ext.getCmp('create-certificate-window-anniversary');
		if (txtAnniversary) { // if the field was retrieved
        	txtAnniversary.setValue(''); // clear the field
        	txtAnniversary.setDisabled(true); // disable the field
        }
        // Get the hours field and reset it
        var txtHours = Ext.getCmp('create-certificate-window-hours');
		if (txtHours) { // if the field was retrieved
        	txtHours.setValue(''); // clear the field
        	txtHours.setDisabled(true); // disable the field
        }
        // Get the level combobox and reset it
		var cbLevels = Ext.getCmp('create-certificate-window-class-level');
		if (cbLevels) { // if the combobox was retrieved
        	cbLevels.setDisabled(true); // disable the combobox
            var l = cbLevels.store; // get the store
            l.removeAll(); // removes any existing records from the store
            l.load(); // load the store with data
            cbLevels.clearValue(); // clear the text value
        }
        // Enable the appropriate field depending on what the certificate type ID is
		switch (typeId) {
			case 1:
			    if (txtAnniversary) { txtAnniversary.setDisabled(false); }
			    break;
			case 2:
			    if (txtHours) { txtHours.setDisabled(false); }
			    break;
			case 3:
			    if (cbLevels) {
		        	cbLevels.setDisabled(false);
		            var ls = cbLevels.store; // get the store
		            // Now get the values for scheduled class and student
		            // and set the base params
		            var cbClass = Ext.getCmp('create-certificate-window-scheduled-class');
					if (cbClass) {
			        	var schedClassId = cbClass.getValue();
			        	ls.baseParams['scheduled_class_id'] = schedClassId;
			        }
		            ls.removeAll(); // removes any existing records from the store
		            ls.load(); // load the store with data
		            console.log(ls);
		            cbLevels.clearValue(); // clear the text value
			    }
			    break;
		}
    }
    ,_resetCertificateFields: function() {
        // Get the certificate type combobox and reset it
		var cbCertTypes = Ext.getCmp('create-certificate-window-certificate-type');
		if (cbCertTypes) { // if the combobox was retrieved
        	cbCertTypes.setDisabled(true); // disable the combobox
            var s = cbCertTypes.store; // get the store
            s.removeAll(); // removes any existing records from the store
            s.load(); // load the store with data
            cbCertTypes.clearValue(); // clear the text value
        }
        // Get the anniversary field and reset it
        var txtAnniversary = Ext.getCmp('create-certificate-window-anniversary');
		if (txtAnniversary) { // if the field was retrieved
        	txtAnniversary.setValue(''); // clear the field
        	txtAnniversary.setDisabled(true); // disable the field
        }
        // Get the hours field and reset it
        var txtHours = Ext.getCmp('create-certificate-window-hours');
		if (txtHours) { // if the field was retrieved
        	txtHours.setValue(''); // clear the field
        	txtHours.setDisabled(true); // disable the field
        }
        // Get the level combobox and reset it
		var cbLevels = Ext.getCmp('create-certificate-window-class-level');
		if (cbLevels) { // if the combobox was retrieved
        	cbLevels.setDisabled(true); // disable the combobox
            var l = cbLevels.store; // get the store
            l.removeAll(); // removes any existing records from the store
            l.load(); // load the store with data
            cbLevels.clearValue(); // clear the text value
        }
    }
});
Ext.reg('sc-window-certificate-create',StudentCentre.window.CreateCertificate);