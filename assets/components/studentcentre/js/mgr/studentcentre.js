var StudentCentre = function(config) {
    config = config || {};
    StudentCentre.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre,Ext.Component,{
    page:{},window:{},grid:{},tree:{},container:{},panel:{},combo:{},config:{},tabs:{},store:{},toolbar:{}
});
Ext.reg('studentcentre',StudentCentre);
StudentCentre = new StudentCentre();


/*
 * Here we're defining some common components used by many
 * of the widgets in the Student Centre.
 */

// !Tested Combobox
StudentCentre.combo.Tested = function(config) {
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
    
    StudentCentre.combo.Tested.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.Tested, MODx.combo.ComboBox);
Ext.reg('attendance-combo-tested', StudentCentre.combo.Tested);


// !Location Combobox
StudentCentre.combo.AttendanceLocation = function(config) {
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
    StudentCentre.combo.AttendanceLocation.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.AttendanceLocation, MODx.combo.ComboBox);
Ext.reg('attendance-combo-location', StudentCentre.combo.AttendanceLocation);


// !Scheduled class combobox. Used on Take Attendance tab
StudentCentre.combo.AttendanceScheduledClass = function(config) {
    config = config || {};
    Ext.applyIf(config, {
	     emptyText: _('studentcentre.att_select_class')
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
    StudentCentre.combo.AttendanceScheduledClass.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.AttendanceScheduledClass, MODx.combo.ComboBox);
Ext.reg('attendance-combo-scheduled-class', StudentCentre.combo.AttendanceScheduledClass);


// !Student Name Combobox
StudentCentre.combo.StudentName = function(config) {
    config = config || {};
    Ext.applyIf(config, {
    	fieldLabel: _('studentcentre.ass_student')
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
Ext.reg('attendance-combo-student-name', StudentCentre.combo.StudentName);


// !Belt Combobox
StudentCentre.combo.Belt = function(config) {
    config = config || {};
    Ext.applyIf(config, {
        store: new Ext.data.ArrayStore({
            fields: ['value','display']
            ,data: [
                ['notreceived','Not received']
                ,['awarded','Awarded']
            ]
        })
        ,mode: 'local'
        ,displayField: 'display'
        ,valueField: 'value'
        ,hiddenName: 'belt'
    });
    
    StudentCentre.combo.Belt.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.Belt, MODx.combo.ComboBox);
Ext.reg('attendance-combo-belt', StudentCentre.combo.Belt);


// !Certificate Combobox
StudentCentre.combo.Certificate = function(config) {
    config = config || {};
    Ext.applyIf(config, {
        store: new Ext.data.ArrayStore({
            fields: ['value','display']
            ,data: [
                ['notreceived','Not received']
                ,['printed','Printed']
                ,['awarded','Awarded']
            ]
        })
        ,mode: 'local'
        ,displayField: 'display'
        ,valueField: 'value'
        ,hiddenName: 'certificate'
    });
    
    StudentCentre.combo.Certificate.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.Certificate, MODx.combo.ComboBox);
Ext.reg('attendance-combo-certificate', StudentCentre.combo.Certificate);


// !Progress Combobox
StudentCentre.combo.Progress = function(config) {
    config = config || {};
    Ext.applyIf(config, {
        store: new Ext.data.ArrayStore({
            fields: ['value','display']
            ,data: [
                [0,'0']
                ,[10,'10']
                ,[20,'20']
                ,[30,'30']
                ,[40,'40']
                ,[50,'50']
                ,[60,'60']
                ,[70,'70']
                ,[80,'80']
                ,[90,'90']
                ,[100,'100']
            ]
        })
        ,mode: 'local'
        ,displayField: 'display'
        ,valueField: 'value'
    });
    
    StudentCentre.combo.Progress.superclass.constructor.call(this, config);
};
Ext.extend(StudentCentre.combo.Progress, MODx.combo.ComboBox);
Ext.reg('attendance-combo-progress', StudentCentre.combo.Progress);
