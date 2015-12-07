// !Take Attendance Panel
StudentCentre.panel.AttendanceCreate = function(config) {
    config = config || {};
    var dateToday = new Date();
    Ext.apply(config,{
        border: false
        ,layout: 'form'
        ,baseCls: 'modx-formpanel'
        ,id: 'attendance-tab-create-attendance'
        ,cls: 'container'
        ,items: [{
        	xtype: 'hidden'
        	,id: 'scheduled_class'
        },{
        	xtype: 'hidden'
        	,id: 'class_duration'
        },{
            xtype: 'datefield'
            ,id: 'class_date'
            ,name: 'class_date'
            ,allowBlank: false
            ,fieldLabel: _('studentcentre.att_class_date')
            ,labelWidth: 120
            ,format: 'd/m/Y'
            ,value: dateToday
        },{
        	html: '<br />'
        },{
	        xtype: 'fieldset'
	        ,id: 'attendance-fieldset-students-create-attendance'
	        ,title: _('studentcentre.att_enrolled_students')
			,collapsible: true
			,autoHeight: true
			,labelWidth: 250
			,items: [{
	            xtype: 'toolbar'
	            ,id: 'student-attendance-toolbar'
	            ,anchor: '100%'
	            ,style: {
		            background: 'none'
		            ,border: 0
	            }
	            ,items: [{
	                xtype: 'button'
	                ,id: 'btn-student-attendance-select-all-toggle'
	                ,text: 'Deselect all'
	                ,disabled: true
	                ,listeners: {
			            click: { fn: this.toggleSelectAll, scope: this }
			        }
	            }]
	        },{
		        xtype: 'panel' // tried using modx-formpanel but can't use that inside of another modx-formpanel
		        ,id: 'attendance-panel-students-create-attendance'
		        ,border: false
		        ,layout: 'form'
		        ,cls: 'container'
	        }]
        },{
	        xtype: 'fieldset'
	        ,id: 'attendance-fieldset-visitors-create-attendance'
	        ,title: _('studentcentre.att_visitors')
			,collapsible: true
			,autoHeight: true
			,items: [{
	            xtype: 'toolbar'
	            ,id: 'attendance-toolbar-create-attendance'
	            ,anchor: '100%'
	            ,style: {
		            background: 'none'
		            ,border: 0
	            }
	            ,items: [{
	                xtype: 'button'
	                ,text: _('studentcentre.att_add_visitor')
	                ,listeners: {
			            click: { fn: this.addVisitor, scope: this }
			        }
	            }]
	        },{
		        xtype: 'panel' // tried using modx-formpanel but can't use that inside of another modx-formpanel
		        ,id: 'attendance-panel-visitors-create-attendance'
		        ,border: false
		        ,layout: 'form'
		        ,cls: 'container'
	        }]
        }]
        ,buttons: [{
            text: _('studentcentre.reset')
            ,id: 'btn_reset'
            ,disabled: true
            ,listeners: {
            	click: { fn: this.resetForm, scope: this }
            }
        },{
            text: _('studentcentre.save')
            ,id: 'btn_save'
            ,disabled: true
            ,listeners: {
            	click: { fn: this.submitForm, scope: this }
            }
        }]
	});
	StudentCentre.panel.AttendanceCreate.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.panel.AttendanceCreate, MODx.FormPanel, {
	addVisitor: function(button, e) {
		var fieldsetVisitors = Ext.getCmp('attendance-panel-visitors-create-attendance');
		var duration = Ext.getCmp('class_duration').getValue(); //get the class duration value from the hidden field
		if (!duration) { duration = 1; } //if the class duration isn't set, set it to 1
        if (fieldsetVisitors) {
        	var visitorCount = fieldsetVisitors.items.getCount();
        	var visitorNum = visitorCount + 1;
        	var newVisitor = {
				xtype: 'compositefield'
				,fieldLabel: visitorNum + '. Visitor'
				,labelWidth: 120
				//,id: 'visitor_' + visitorCount
				,flex: 1
				,items: [{
					xtype: 'attendance-combo-student-name'
					,id: 'visitor_' + visitorCount
					,hiddenName: 'visitors[' + visitorCount + '][student_id]'
					,flex: 1
				},{
					xtype: 'spacer'
					,width: 20
				},{
					xtype: 'displayfield'
					,value: _('studentcentre.hours')
				},{
					xtype: 'textfield'
					,id: 'visitor_hours_' + visitorCount
					,name: 'visitors[' + visitorCount + '][hours]'
					,value: duration
					,flex: 1
				}]
			};
			fieldsetVisitors.add(newVisitor);
			fieldsetVisitors.doLayout();
        }
    }
    ,toggleSelectAll: function(button, e) {
	    var students = Ext.getCmp('attendance-panel-students-create-attendance').items.items;
	    var btnToggle = Ext.getCmp('btn-student-attendance-select-all-toggle');
	    var btnToggleText = btnToggle.getText();
	    var chkValue = btnToggleText == 'Deselect all' ? false : true;
	    Ext.each(students, function(student, index, allItems) {
	    	var chkPresent = student.items.items[1];
	    	chkPresent.setValue(chkValue);
	    });
	    var newText = chkValue == false ? 'Select all' : 'Deselect all';
	    btnToggle.setText(newText);
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
			            action: 'mgr/attendance/scAttendanceBatchCreate'
		            }
		            ,success: function(form, action) {
		                resetAttendanceForm();
		                //console.log(action);
						Ext.MessageBox.alert(_('studentcentre.success'),_('studentcentre.att_msg_success_save'));
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
Ext.reg('attendance-panel-create-attendance',StudentCentre.panel.AttendanceCreate);
// !Reset form
var resetAttendanceForm = function(){
	var hidSchedClassId = Ext.getCmp('scheduled_class');
	hidSchedClassId.reset();
	var datePicker = Ext.getCmp('class_date');
	datePicker.reset();
	var hidDuration = Ext.getCmp('class_duration');
	hidDuration.reset();
	var cbSchedClass = Ext.getCmp('attendance-combo-scheduled-class');
	cbSchedClass.clearValue(); // clear value of sched class combobox
	cbSchedClass.setDisabled(true); // disable the combobox
	var cbLocation = Ext.getCmp('attendance-combo-location');
	cbLocation.clearValue(); // clear value of location combobox
	var pnlStudentAttendance = Ext.getCmp('attendance-panel-students-create-attendance'); // get the student panel
	pnlStudentAttendance.removeAll(); // remove all students
	var pnlVisitorAttendance = Ext.getCmp('attendance-panel-visitors-create-attendance'); // get the visitor panel
	pnlVisitorAttendance.removeAll();
	Ext.getCmp('btn-student-attendance-select-all-toggle').setDisabled(true);
	Ext.getCmp('btn_reset').setDisabled(true);
	Ext.getCmp('btn_save').setDisabled(true);
}