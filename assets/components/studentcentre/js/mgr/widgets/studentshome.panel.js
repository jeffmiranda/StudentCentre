StudentCentre.panel.StudentsHome = function(config) {
    config = config || {};
    Ext.apply(config,{
        border: false
        ,baseCls: 'modx-formpanel'
        ,cls: 'container'
        ,items: [{
            html: '<h2>'+_('studentcentre.stu')+'</h2>'
            ,border: false
            ,cls: 'modx-page-header'
        },{
            xtype: 'modx-tabs'
            ,defaults: { border: false ,autoHeight: true, bodyStyle: 'padding:10px' }
			,border: true
			//,activeTab: tabIndex
            ,items: [{
	            title: _('studentcentre.students')
                ,defaults: { autoHeight: true }
                ,items: [{
		            html: '<p>'+_('studentcentre.stu_desc')+'</p>'
		            ,border: false
		            ,bodyCssClass: 'panel-desc'
		        },{
		            xtype: 'sc-grid-students'
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
    StudentCentre.panel.StudentsHome.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.panel.StudentsHome,MODx.Panel);
Ext.reg('sc-students-panel-home',StudentCentre.panel.StudentsHome);