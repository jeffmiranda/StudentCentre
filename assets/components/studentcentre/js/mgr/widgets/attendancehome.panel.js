StudentCentre.panel.AttendanceHome = function(config) {
    config = config || {};
    var tabIndex;
    tabIndex = isNaN(config.activeTab) ? 0 : config.activeTab;
    Ext.apply(config,{
        border: false
        ,baseCls: 'modx-formpanel'
        ,cls: 'container'
        ,items: [{
            html: '<h2>'+_('studentcentre.att')+'</h2>'
            ,border: false
            ,cls: 'modx-page-header'
        },{
            xtype: 'modx-tabs'
            ,defaults: { border: false ,autoHeight: true, bodyStyle: 'padding:10px' }
			,border: true
			,activeTab: tabIndex
            ,items: [{
                layout: 'anchor'
                ,title: _('studentcentre.att_take_attendance')
                ,defaults: { autoHeight: true }
                ,items: [{
                    html: '<p>'+_('studentcentre.att_take_attendance_desc')+'</p>'
                    ,border: false
                    ,bodyCssClass: 'panel-desc'
                },{
	                layout:'column'
	                ,bodyCssClass: 'main-wrapper'
	                ,border: false
	                ,items: [{
	                	columnWidth: 0.5
	                    ,layout: 'form'
	                    ,border: false
	                    ,items: [{
	                    	xtype: 'attendance-combo-location'
	                    	,id: 'attendance-combo-location'
				            ,fieldLabel: _('studentcentre.att_location')
				            ,name: 'location'
						    ,hiddenName: 'location'
						    ,anchor: '95%'
						    ,listeners: {
					            select: { fn: this.getScheduledClasses, scope: this }
					        }
						}]
	                },{
	                	columnWidth: 0.5
	                    ,layout: 'form'
	                	,border: false
	                	,items: [{
		                    xtype: 'attendance-combo-scheduled-class'
		                    ,id: 'attendance-combo-scheduled-class'
				            ,fieldLabel: _('studentcentre.att_class')
				            ,name: 'class_id'
						    ,hiddenName: 'class_id'
						    ,anchor: '95%'
						    ,disabled: true
						    ,listeners: {
					            select: { fn: this.updateAttendanceForm, scope: this }
					        }
						}]
	                }]
	            },{
	            	xtype:'attendance-panel-create-attendance'
	            	,id: 'attendance-panel-create-attendance'
	            }]
            },{
                layout: 'anchor'
                ,title: _('studentcentre.att_testing')
                ,defaults: { autoHeight: true }
                ,items: [{
                    html: '<p>'+_('studentcentre.att_testing_desc')+'</p>'
                    ,border: false
                    ,bodyCssClass: 'panel-desc'
                },{
	                xtype: 'studentcentre-grid-test-ready'
	                ,cls: 'main-wrapper'
	                ,preventRender: true
                }]
            },{
	            title: _('studentcentre.att_attendance')
                ,defaults: { autoHeight: true }
                ,items: [{
                    html: '<p>'+_('studentcentre.att_attendance_desc')+'</p>'
                    ,border: false
                    ,bodyCssClass: 'panel-desc'
                },{
                    xtype: 'studentcentre-grid-attendance'
                    ,cls: 'main-wrapper'
                    ,preventRender: true
                }]
            },{
	            title: _('studentcentre.progress')
                ,defaults: { autoHeight: true }
                ,items: [{
                    html: '<p>'+_('studentcentre.progress_desc')+'</p>'
                    ,border: false
                    ,bodyCssClass: 'panel-desc'
                },{
                    xtype: 'studentcentre-grid-attendance-progress'
                    ,cls: 'main-wrapper'
                    ,preventRender: true
                }]
            },{
	            title: _('studentcentre.att_level_categories')
                ,defaults: { autoHeight: true }
                ,items: [{
                    html: '<p>'+_('studentcentre.att_level_categories_desc')+'</p>'
                    ,border: false
                    ,bodyCssClass: 'panel-desc'
                },{
                    xtype: 'studentcentre-grid-attendance-level-categories'
                    ,cls: 'main-wrapper'
                    ,preventRender: true
                }]
            },{
	            title: _('studentcentre.att_levels')
                ,defaults: { autoHeight: true }
                ,items: [{
                    html: '<p>'+_('studentcentre.att_levels_desc')+'</p>'
                    ,border: false
                    ,bodyCssClass: 'panel-desc'
                },{
                    xtype: 'studentcentre-grid-attendance-levels'
                    ,cls: 'main-wrapper'
                    ,preventRender: true
                }]
            },{
	            title: _('studentcentre.att_techniques')
                ,defaults: { autoHeight: true }
                ,items: [{
                    html: '<p>'+_('studentcentre.att_techniques_desc')+'</p>'
                    ,border: false
                    ,bodyCssClass: 'panel-desc'
                },{
                    xtype: 'studentcentre-grid-attendance-techniques'
                    ,cls: 'main-wrapper'
                    ,preventRender: true
                }]
            },{
	            title: _('studentcentre.att_levels_techniques')
                ,defaults: { autoHeight: true }
                ,items: [{
                    html: '<p>'+_('studentcentre.att_levels_techniques_desc')+'</p>'
                    ,border: false
                    ,bodyCssClass: 'panel-desc'
                },{
                    xtype: 'studentcentre-grid-attendance-levels-techniques'
                    ,cls: 'main-wrapper'
                    ,preventRender: true
                }]
            },{
	            title: _('studentcentre.att_classes')
                ,defaults: { autoHeight: true }
                ,items: [{
                    html: '<p>'+_('studentcentre.att_classes_desc')+'</p>'
                    ,border: false
                    ,bodyCssClass: 'panel-desc'
                },{
                    xtype: 'studentcentre-grid-attendance-classes'
                    ,cls: 'main-wrapper'
                    ,preventRender: true
                }]
            },{
	            title: _('studentcentre.locations')
                ,defaults: { autoHeight: true }
                ,items: [{
                    html: '<p>'+_('studentcentre.att_locations_desc')+'</p>'
                    ,border: false
                    ,bodyCssClass: 'panel-desc'
                },{
                    xtype: 'studentcentre-grid-attendance-locations'
                    ,cls: 'main-wrapper'
                    ,preventRender: true
                }]
            },{
	            title: _('studentcentre.scheduled_classes')
                ,defaults: { autoHeight: true }
                ,items: [{
                    html: '<p>'+_('studentcentre.scheduled_classes_desc')+'</p>'
                    ,border: false
                    ,bodyCssClass: 'panel-desc'
                },{
                    xtype: 'studentcentre-grid-attendance-scheduled-classes'
                    ,cls: 'main-wrapper'
                    ,preventRender: true
                }]
            },{
	            title: _('studentcentre.enrollment')
                ,defaults: { autoHeight: true }
                ,items: [{
                    html: '<p>'+_('studentcentre.enrollments_desc')+'</p>'
                    ,border: false
                    ,bodyCssClass: 'panel-desc'
                },{
                    xtype: 'studentcentre-grid-attendance-class-enrollments'
                    ,cls: 'main-wrapper'
                    ,preventRender: true
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
    });
    StudentCentre.panel.AttendanceHome.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.panel.AttendanceHome,MODx.Panel, {
	// Load the Sched Class combobox with classes at a specific location
	getScheduledClasses: function(combo, value) {
		// Get the Sched Class combobox
		var cbScheduledClass = Ext.getCmp('attendance-combo-scheduled-class');
		// Get the students fieldset (where the enrolled students will appear)
		var fieldsetStudentAttendance = Ext.getCmp('attendance-fieldset-students-create-attendance');
        if (cbScheduledClass) { // if the combobox was retrieved
        	cbScheduledClass.setDisabled(false); // enable the combobox
            var s = cbScheduledClass.store; // get the store
            s.baseParams['location_id'] = value.id; // set the location_id param
            s.baseParams['activeOnly'] = 1; // only get the active ones
            s.removeAll(); // removes any existing records from the store
            s.load(); // load the store with data
            cbScheduledClass.clearValue(); // clear the text value
        }
        if (fieldsetStudentAttendance) {
        	fieldsetStudentAttendance.removeAll(); // remove all components from the fieldset
        	fieldsetStudentAttendance.update(''); // Ensures that any previous error message is also removed.
        }
    }
    ,updateAttendanceForm: function(combo, value) {
    	var schedClassId = value.id; // get the id from the selected sched class
    	var fieldsetStudentAttendance = Ext.getCmp('attendance-fieldset-students-create-attendance'); // get the student fieldset
    	// start the AJAX request and pass the sched class id to the processor
    	Ext.Ajax.request({
		   url: StudentCentre.config.connectorUrl
		   ,params: {
		        action: 'mgr/attendance/scClassEnrollmentGetList'
		        ,scheduled_class_id: schedClassId
		        ,limit: 0
		        ,activeOnly: 1
		        ,sortStudents: 1
		    }
		   ,success: function(response, opts) { // upon success
		      	var responseObj = Ext.decode(response.responseText); // decode the JSON response text into an object
		      	if (fieldsetStudentAttendance) {
					fieldsetStudentAttendance.removeAll(); // remove all components from the student fieldset
					if (responseObj.total > 0) { // if there are students returned
						var students = responseObj.results; // get the array from the response object
						var schedClassId = students[0].scheduled_class_id; // get the scheduled class ID (they should be the same for each student)
						var hidSchedClassId = Ext.getCmp('scheduled_class'); // get the hidden scheduled class field
						hidSchedClassId.setValue(schedClassId); // set the scheduled class ID. This is so that the Sched Class ID can be passed to the form
						var duration = students[0].duration; // get the class duration from a student
						var hidDuration = Ext.getCmp('class_duration'); // get the hidden class duration field
						hidDuration.setValue(duration); // set the duration. This is so that Visitors can have a default duration value
						// loop through the array and add all the components
						Ext.each(students, function(student, index, allItems) {
							var row = {
								xtype: 'compositefield'
								,fieldLabel: student.student_name
								//,id: 'student_id_' + student.student_id
								,flex: 1
								,items: [{
									xtype: 'hidden'
									,id: 'student_id_' + index
									,name: 'students[' + index + '][student_id]'
									,value: student.student_id
								},{
									xtype: 'xcheckbox'
									,id: 'student_present_' + index
									,name: 'students[' + index + '][present]'
									,boxLabel: _('studentcentre.att_present')
									,value: 1
									,checked: true
									,listeners: {
										check: {
											fn: function(checkbox, checked) {
												var studentId = Ext.getCmp('student_id_' + index).getValue(); //id.substring(id.indexOf('_')+1); // extract the student id
												var duration = Ext.getCmp('class_duration').getValue(); //get the class duration value from the hidden field
												var txtHours = Ext.getCmp('student_hours_' + index);
												if (checked) {
													txtHours.setValue(duration);
													txtHours.setDisabled(false);
												} else {
													txtHours.setValue(0);
													txtHours.setDisabled(true);
												}
											}
										}
									}
								},{
									xtype: 'spacer'
									,width: 20
								},{
									xtype: 'displayfield'
									,value: 'Hours'
								},{
									xtype: 'numberfield'
									,id: 'student_hours_' + index
									,name: 'students[' + index + '][hours]'
									,allowBlank: false
									,allowNegative: false
									,value: student.duration
								},{
									xtype: 'spacer'
									,width: 20
								},{
									xtype: 'xcheckbox'
									,id: 'student_testing_' + index
									,name: 'students[' + index + '][test]'
									,boxLabel: _('studentcentre.att_test_pretest')
									,value: 1
								}]
							};
							fieldsetStudentAttendance.add(row);
						});
						// redraw the layout to make the new components appear
						fieldsetStudentAttendance.doLayout();
						// enable buttons
						Ext.getCmp('btn_reset').setDisabled(false);
						Ext.getCmp('btn_save').setDisabled(false);
					} else {
						// if there aren't any students returned then display this message
						fieldsetStudentAttendance.update('<div class="sc-message">'+_('studentcentre.att_msg_no_stu_in_class')+'</div>');
					}
				} else {
					console.error('fieldsetStudentAttendance does not exist!');
				}
		   }
		   ,failure: function(response, opts) {
		      Ext.MessageBox.alert(_('studentcentre.error'), response.status);
		      console.log('server-side failure with status code ' + response.status);
		   }
		});
    }
    ,disableHours: function(checkbox, checked) {
	    console.log('Checked: ' + checked);
    }
});
Ext.reg('sc-attendance-panel-home',StudentCentre.panel.AttendanceHome);