// create array to format month names
var monthNames = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');

// !Comment Window
StudentCentre.window.TestTechniqueComments = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('studentcentre.att_all_technique_comments')
        ,width: '600'
        ,url: StudentCentre.config.connectorUrl
        ,labelAlign: 'left'
        ,fields: [{
            xtype: 'hidden'
            ,name: 'technique_id'
        },{
            xtype: 'displayfield'
            ,fieldLabel: _('studentcentre.att_technique')
            ,name: 'technique_name'
            ,anchor: '100%'
            ,style: { marginBottom: '20px'}
        },{
	        xtype: 'sc-grid-test-technique-comments'
	        ,id: 'technique-comments-grid'
	        ,baseParams: { 
				action: 'mgr/attendance/scStudentTestTechniqueGetList'
				,student_id: config.record.student_id
				,level_id: config.record.level_id
				,technique_id: config.record.technique_id
				,commentsOnly: 1
			}
			,height: '300'
        }]
        ,buttons: [{
	        text: _('studentcentre.close')
	        ,listeners: {
            	click: { fn: this.closeWindow, scope: this }
            }
        }]
    });
    StudentCentre.window.TestTechniqueComments.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.window.TestTechniqueComments,MODx.Window, {
	closeWindow: function(btn, e) {
		this.hide();
	}
});
Ext.reg('sc-window-test-technique-comments',StudentCentre.window.TestTechniqueComments);

// !Technique Comments Grid
StudentCentre.grid.TestTechniqueComments = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        layout: 'form'
        ,url: StudentCentre.config.connectorUrl
        ,baseParams: {
        	action: 'mgr/attendance/scStudentTestTechniqueGetList'
        }
        ,autoHeight: false
        ,fields: ['id','comment','date_created']
        ,paging: true
        ,remoteSort: true
        ,anchor: '100%'
        ,autoExpandColumn: 'comment'
        ,columns: [{
            header: _('studentcentre.comment')
            ,dataIndex: 'comment'
            ,sortable: false
            ,width: 350
            ,renderer: function(value, metadata) {
			    metadata.attr = 'style="white-space: normal;"';
			    return value;
			}
        },{
            header: _('studentcentre.date')
            ,dataIndex: 'date_created'
            ,sortable: false
            ,width: 100
        }]
    });
    StudentCentre.grid.TestTechniqueComments.superclass.constructor.call(this,config)
};
Ext.extend(StudentCentre.grid.TestTechniqueComments,MODx.grid.Grid);
Ext.reg('sc-grid-test-technique-comments',StudentCentre.grid.TestTechniqueComments);

// !Test
StudentCentre.panel.AttendanceTest = function(config) {
    config = config || {};
    var today = new Date();
    var todayDate = today.getDate();
	var todayMonth = today.getMonth();
	todayMonth++;
	var todayYear = today.getFullYear();
    Ext.apply(config,{
        border: false
        ,url: StudentCentre.config.connectorUrl
        ,baseCls: 'modx-formpanel'
        ,cls: 'container'
        ,items: [{
            html: '<h2>'+config.testData.class_name+': '+config.testData.level_name+' Test for '+config.testData.student_name+'</h2>'
            ,border: false
            ,cls: 'modx-page-header'
        },{
            xtype: 'modx-tabs'
            ,defaults: { border: false ,autoHeight: true, bodyStyle: 'padding:10px' }
			,border: true
            ,items: [{
                layout: 'form'
                ,title: _('studentcentre.att_test')
                ,labelWidth: 150
                ,defaults: { autoHeight: true }
                ,items: [{
                    html: '<p>'+_('studentcentre.att_test_desc')+'</p>'
                    ,border: false
                    ,bodyCssClass: 'panel-desc'
                    ,style: { marginBottom: '20px' }
                },{
			        xtype: 'fieldset'
			        ,title: _('studentcentre.att_today_test')
			        ,id: 'fldCurrentTest'
					,collapsible: true
					,autoHeight: true
					,items: [{
						xtype: 'hidden'
						,name: 'class_progress_id'
						,value: config.testData.id
					},{
						xtype: 'displayfield'
						,fieldLabel: _('studentcentre.date')
						,value: monthNames[todayMonth] + ' ' + todayDate + ', ' + todayYear
					},{
						xtype: 'compositefield'
						,fieldLabel: _('studentcentre.type')
						,flex: 1
						,items: [{
							xtype: 'displayfield'
							,value: _('studentcentre.att_pre_test')
						},{
							xtype: 'radio'
							,name: 'test_type'
							,inputValue: 'Pre-test'
							,checked: true
							,style: { verticalAlign: 'middle' }
						},{
							xtype: 'displayfield'
							,value: _('studentcentre.att_test')
						},{
							xtype: 'radio'
							,name: 'test_type'
							,inputValue: 'Test'
							,style: { verticalAlign: 'middle' }
						}]
					}]
		        },{
			        xtype: 'fieldset'
			        ,title: _('studentcentre.att_student_info')
					,collapsible: true
					,autoHeight: true
					,items: [{
		                xtype: 'hidden'
		                ,name: 'level_id'
		                ,value: config.testData.level_id
	                },{
		                xtype: 'hidden'
		                ,name: 'student_id'
		                ,value: config.testData.student_id
	                },{
		                xtype: 'displayfield'
		                ,fieldLabel: _('studentcentre.att_student_name')
		                ,value: config.testData.student_name
	                },{
		                xtype: 'displayfield'
		                ,fieldLabel: _('studentcentre.att_class')
		                ,value: config.testData.class_name
	                },{
		                xtype: 'displayfield'
		                ,fieldLabel: _('studentcentre.att_level')
		                ,value: config.testData.level_name
	                },{
		                xtype: 'displayfield'
		                ,fieldLabel: _('studentcentre.att_hours_since_leveling')
		                ,value: config.testData.hours_since_leveling
	                }]
		        },{
			        xtype: 'fieldset'
			        ,title: _('studentcentre.att_prev_test')
			        ,id: 'fldLastTest'
					,collapsible: true
					,autoHeight: true
					,hidden: true
		        },{
			        xtype: 'fieldset'
			        ,id: 'attendance-fieldset-test-techniques'
			        ,title: _('studentcentre.att_techniques')
					,collapsible: true
					,autoHeight: true
		        },{
			        xtype: 'fieldset'
			        ,title: _('studentcentre.summary')
					,collapsible: true
					,autoHeight: true
					,items: [{
						xtype: 'xcheckbox'
						,fieldLabel: _('studentcentre.att_pass')
						,name: 'pass'
					},{
						xtype: 'textarea'
						,name: 'comment'
						,fieldLabel: _('studentcentre.comment')
						,width: '99%'
					}]
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
            text: _('studentcentre.reset')
            ,id: 'btn_reset'
            ,listeners: {
            	click: { fn: this.resetForm, scope: this }
            }
        },{
            text: _('studentcentre.save')
            ,id: 'btn_save'
            //,disabled: true
            ,listeners: {
            	click: { fn: this.submitForm, scope: this }
            }
        }]
        ,listeners: {
	        'setup': {fn:this.setup,scope:this}
        }
    });
    StudentCentre.panel.AttendanceTest.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.panel.AttendanceTest,MODx.FormPanel,{
	setup: function() {
        if (!this.config.testData) return;
        MODx.Ajax.request({
            url: this.config.url
            ,params: {
                action: 'mgr/attendance/scTestSetup'
                ,level_id: this.config.testData.level_id
                ,student_id: this.config.testData.student_id
            }
			,listeners: {
                'success': {fn: function(response) {
                    var testSetup = response.object;
                    console.log(testSetup);
                    var lastTest = testSetup.last_test;
                    var techniques = testSetup.techniques;
                    if (lastTest) { 
                    	var ltInfo = lastTest.info;
						var fieldsetPrevTest = Ext.getCmp('fldLastTest'); // get the Previous Test fieldset
						var ltDateInfo = new Date(ltInfo.date_created + ' 12:00:00');
						var ltDate = ltDateInfo.getDate();
						var ltMonth = ltDateInfo.getMonth();
						var ltYear = ltDateInfo.getFullYear();
                    	// create the xtype component to hold the date
                    	var ltDateCreated = {
			                xtype: 'displayfield'
			                ,fieldLabel: _('studentcentre.date')
			                ,value: monthNames[ltMonth] + ' ' + ltDate + ', ' + ltYear
		                };
		                // create the xtype component to hold the pass status of the previous test
		                var ltType = {
			                xtype: 'displayfield'
			                ,fieldLabel: _('studentcentre.type')
			                ,value: ltInfo.type
		                };
		                // create the xtype component to hold the pass status of the previous test
		                var ltPassStatus = (ltInfo.pass) ? 'Yes' : 'No';
		                var ltPass = {
			                xtype: 'displayfield'
			                ,fieldLabel: _('studentcentre.att_pass')
			                ,value: ltPassStatus
		                };
		                // create the xtype component to hold the comment for the previous test
			            var ltComment = {
			                xtype: 'displayfield'
			                ,fieldLabel: _('studentcentre.comment')
			                ,value: ltInfo.comment
		                }
		                // add the components to the fieldset
		                fieldsetPrevTest.add(ltDateCreated);
		                fieldsetPrevTest.add(ltType);
		                fieldsetPrevTest.add(ltPass);
		                fieldsetPrevTest.add(ltComment);
		                // unhide the fieldset
		                fieldsetPrevTest.show();
                    }
                    var fieldsetTechniques = Ext.getCmp('attendance-fieldset-test-techniques'); // get the Techniques fieldset
					for (var prop in techniques) {
						// important check that this is objects own property 
						// not from prototype prop inherited
						if (techniques.hasOwnProperty(prop)) {
							var comment = '';
							var techPass = false;
							// also check to ensure lastTest exists and isn't FALSE
							if (lastTest && lastTest.techniques.hasOwnProperty(techniques[prop].technique_id)) {
								comment = '<em>Previous test comment: ' + lastTest.techniques[techniques[prop].technique_id].comment + '</em>'
								techPass = (lastTest.techniques[techniques[prop].technique_id].pass == 1) ? true : false;
							}
							var technique = {
								xtype: 'compositefield'
								,fieldLabel: techniques[prop].name
								,labelWidth: 0
								,flex: 1
								,hideLabel: true
								,style: {
						            marginTop: '20px'
						            ,marginLeft: '10px'
						        }
								,items: [{
									xtype: 'displayfield'
									,value: techniques[prop].order + '.'
								},{
									xtype: 'spacer'
									,width: 10
								},{
									xtype: 'xcheckbox'
									,id: 'technique_id_' + techniques[prop].technique_id
									,name: 'techniques[' + techniques[prop].technique_id + '][pass]'
									,value: 1
									,checked: techPass
								},{
									xtype: 'displayfield'
									,value: techniques[prop].name
								}]
							};
							var prevComment = {
								xtype: 'displayfield'
								,hideLabel: true
								,value: comment
								,style: { marginLeft: '40px' }
							};
							var commentField = {
								xtype: 'compositefield'
								,hideLabel: true
								,style: {
						            marginLeft: '40px'
						            ,marginBottom: '20px'
						        }
								,items: [{
									xtype: 'displayfield'
									,value: _('studentcentre.comment')
								},{
									xtype: 'textfield'
									,name: 'techniques[' + techniques[prop].technique_id + '][comment]'
									,width: 200
								},{
									xtype : 'container'
					                ,layout : 'form'
					                ,items  : {
					                    xtype      : 'button'
					                    ,text: _('studentcentre.att_view_all_comments')
					                    ,student_id: this.config.testData.student_id
					                    ,level_id: techniques[prop].level_id
					                    ,technique_id: techniques[prop].technique_id
					                    ,technique_name: techniques[prop].name
					                    ,listeners: {
											'click': {fn: this.showComments, scope: this}
										}
					                }
								}]
							};
							fieldsetTechniques.add(technique);
							fieldsetTechniques.add(prevComment);
							fieldsetTechniques.add(commentField);
						}
					}
					// redraw the layout to make the new components appear
					fieldsetTechniques.doLayout();
                    
                }, scope: this }
                ,'failure': {fn: function(response) {
	                Ext.MessageBox.alert(_('studentcentre.error'), response.status);
					console.log('server-side failure with status code ' + response.status);
                }, scope: this }
            }
        });
    }
    ,showComments: function(button, e) {
    	var techniqueData = {
	        student_id: button.student_id
	        ,level_id: button.level_id
	        ,technique_id: button.technique_id
	        ,technique_name: button.technique_name
        };
    	if (!this.showCommentsWindow) { // create the window if it doesnt exist yet
		    this.showCommentsWindow = MODx.load({
		        xtype: 'sc-window-test-technique-comments'
		        ,record: techniqueData
		    });
	    } else { // the window exists so reuse it
	    	this.showCommentsWindow.setValues(techniqueData);
	    	var commentsGrid = Ext.getCmp('technique-comments-grid');
	    	var commentsGridStore = commentsGrid.getStore();
	    	// get the last options for the store
	    	var lastOptions = commentsGridStore.lastOptions;
	    	// set new options to override existing ones
			Ext.apply(lastOptions.params, {
			    technique_id: techniqueData.technique_id
			});
			// reload the store
			commentsGridStore.reload(lastOptions);
	    }
		this.showCommentsWindow.show(e.target);
    }
    ,resetForm: function(button, e) {
		resetAttendanceForm();
    }
    ,submitForm: function(button, e) {
	    var form = this.getForm();
	    if (form) {
			if(form.isValid()) {
		        form.submit({
		            waitMsg: _('studentcentre.processing')
		            ,url: StudentCentre.config.connectorUrl
		            ,params: {
			            action: 'mgr/attendance/scStudentTestSave'
		            }
		            ,success: function(form, action) {
		                Ext.MessageBox.alert(_('studentcentre.success'), action.result.message, function() {
			                location.href = '?a='+StudentCentre.action+'&action=attendancehome&activeTab=1';
		                });
		            }
		            ,failure: function(form, action){
		            	var responseObj = Ext.decode(action.response.responseText);
		                Ext.MessageBox.alert(_('studentcentre.error'), responseObj.message);
		            }
		        });
			}
		}
    }
});
Ext.reg('sc-attendance-panel-test',StudentCentre.panel.AttendanceTest);