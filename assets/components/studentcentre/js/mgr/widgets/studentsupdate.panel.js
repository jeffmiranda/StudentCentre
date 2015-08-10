// !Gender Combobox
StudentCentre.combo.Gender = function(config) {
    config = config || {};
    Ext.applyIf(config, {
        store: new Ext.data.ArrayStore({
            fields: ['value','display']
            ,data: [
                [0,'']
                ,[1,_('studentcentre.male')]
                ,[2,_('studentcentre.female')]
            ]
        })
        ,mode: 'local'
        ,displayField: 'display'
        ,valueField: 'value'
    });
    
    StudentCentre.combo.Gender.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.Gender, MODx.combo.ComboBox);
Ext.reg('combo-gender-status', StudentCentre.combo.Gender);


// !Student Update
StudentCentre.panel.StudentsUpdate = function(config) {
    config = config || {};
    //console.log(config);
    Ext.apply(config,{
        border: false
        ,url: StudentCentre.config.connectorUrl
        ,baseCls: 'modx-formpanel'
        ,cls: 'container'
        ,items: [{
            html: '<h2>New Student</h2>'
            ,id: 'sc-student-header'
            ,border: false
            ,cls: 'modx-page-header'
        },{
            xtype: 'modx-tabs'
            ,defaults: { border: false ,autoHeight: true, bodyStyle: 'padding:10px' }
			,border: true
            ,items: [{
                layout: 'form'
                ,title: _('studentcentre.profile')
                ,labelWidth: 150
                ,defaults: { autoHeight: true }
                ,items: [{
			        	xtype: 'hidden'
			        	,name: 'class_key'
			        	,value: 'scModUser'
			        },{
			        	xtype: 'hidden'
			        	,name: 'passwordnotifymethod'
			        	,value: 's'
			        },{
			            xtype: 'textfield'
			            ,fieldLabel: _('studentcentre.username')
			            ,name: 'username'
			            ,allowBlank: false
			            ,anchor: '100%'
			        },{
	                    name: 'active'
	                    ,fieldLabel: _('studentcentre.active')
	                    ,xtype: 'xcheckbox'
	                    ,inputValue: 1
	                },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.first_name')
			            ,name: 'firstname'
			            ,allowBlank: false
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.middle_name')
			            ,name: 'middlename'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.last_name')
			            ,name: 'lastname'
			            ,allowBlank: false
			            ,anchor: '100%'
			        },{
			            xtype: 'datefield'
			            ,name: 'start_date'
			            ,fieldLabel: _('studentcentre.start_date')
			            ,format: 'Y-m-d'
			        },{
			        	xtype: 'combo-gender-status'
			        	,fieldLabel: _('studentcentre.gender')
			            ,name: 'gender'
			            ,hiddenName: 'gender'
			        },{
			            xtype: 'datefield'
			            ,name: 'dob'
			            ,fieldLabel: _('studentcentre.birth_date')
			            ,format: 'Y-m-d'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.email')
			            ,name: 'email'
			            ,allowBlank: false
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.email')
			            ,name: 'email2'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.email')
			            ,name: 'email3'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.email')
			            ,name: 'email4'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.address')
			            ,name: 'address'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.city')
			            ,name: 'city'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.province')
			            ,name: 'province'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.postal_code')
			            ,name: 'postalcode'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.phone')
			            ,name: 'phone'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.contact_name1')
			            ,name: 'contactname1'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.contact_phone1')
			            ,name: 'contactphone1'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.contact_name2')
			            ,name: 'contactname2'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.contact_phone2')
			            ,name: 'contactphone2'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.contact_name3')
			            ,name: 'contactname3'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.contact_phone3')
			            ,name: 'contactphone3'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.contact_name4')
			            ,name: 'contactname4'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.contact_phone4')
			            ,name: 'contactphone4'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.emerg_contact_name1')
			            ,name: 'emergname1'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.emerg_phone1a')
			            ,name: 'emergphone1a'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.emerg_phone1b')
			            ,name: 'emergphone1b'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.emerg_phone1c')
			            ,name: 'emergphone1c'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.emerg_rel1')
			            ,name: 'emergrel1'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.emerg_contact_name2')
			            ,name: 'emergname2'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.emerg_phone2a')
			            ,name: 'emergphone2a'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.emerg_phone2b')
			            ,name: 'emergphone2b'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.emerg_phone2c')
			            ,name: 'emergphone2c'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.emerg_rel2')
			            ,name: 'emergrel2'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.emerg_contact_name3')
			            ,name: 'emergname3'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.emerg_phone3a')
			            ,name: 'emergphone3a'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.emerg_phone3b')
			            ,name: 'emergphone3b'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.emerg_phone3c')
			            ,name: 'emergphone3c'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.emerg_rel3')
			            ,name: 'emergrel3'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.emerg_contact_name4')
			            ,name: 'emergname4'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.emerg_phone4a')
			            ,name: 'emergphone4a'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.emerg_phone4b')
			            ,name: 'emergphone4b'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.emerg_phone4c')
			            ,name: 'emergphone4c'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.emerg_rel4')
			            ,name: 'emergrel4'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.referral')
			            ,name: 'referral'
			            ,anchor: '100%'
			        },{
			        	xtype: 'textfield'
			        	,fieldLabel: _('studentcentre.notes')
			            ,name: 'notes'
			            ,anchor: '100%'
			        }]
            }]
            // only to redo the grid layout after the content is rendered
            // to fix overflow components' panels, especially when scroll bar is shown up
            ,listeners: {
                'afterrender': function(tabPanel) {
                    tabPanel.doLayout();
                }
            }
        }]
        ,buttons: [{
            text: _('studentcentre.save')
            ,id: 'btn_save'
            ,listeners: {
            	click: { fn: this.submitForm, scope: this }
            }
        }]
        ,listeners: {
	        'setup': {fn:this.setup,scope:this}
        }
    });
    StudentCentre.panel.StudentsUpdate.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.panel.StudentsUpdate,MODx.FormPanel,{
	setup: function() {
        if (this.config.studentId === '' || this.config.studentId === 0) {
            this.fireEvent('ready');
            return false;
        }
        //console.log(this.config.studentId);
        MODx.Ajax.request({
            url: StudentCentre.config.connectorUrl
            ,params: {
                action: 'mgr/students/scModUserGet'
                ,id: this.config.studentId
            }
            ,listeners: {
                'success': {fn:function(r) {
                    this.getForm().setValues(r.object);
                    //console.log(this.getForm());
                    console.log(r.object);
                    Ext.get('sc-student-header').update('<h2>'+_('studentcentre.student')+': '+r.object.username+'</h2>');
                    this.fireEvent('ready',r.object);
                    MODx.fireEvent('ready');
                },scope:this}
            }
        });
    }
    ,submitForm: function(button, e) {
	    var form = this.getForm();
	    if (form) {
			if(form.isValid()) {
		        form.submit({
		            waitMsg: _('studentcentre.processing')
		            ,url: StudentCentre.config.connectorUrl
		            ,params: {
			            action: 'mgr/students/scModUserUpdate'
			            ,id: this.config.studentId
		            }
		            ,success: function(form, action) {
		                Ext.MessageBox.alert(_('studentcentre.success'), _('studentcentre.stu_student_update_success'), function() {
			                location.href = '?a='+StudentCentre.action+'&action=studentshome';
		                });
		            }
		            ,failure: function(form, action){
		            	//console.log(action);
		            	var responseObj = Ext.decode(action.response.responseText);
		                Ext.MessageBox.alert(_('studentcentre.error'), responseObj.message);
		            }
		        });
			}
		}
    }
});
Ext.reg('sc-students-panel-update',StudentCentre.panel.StudentsUpdate);