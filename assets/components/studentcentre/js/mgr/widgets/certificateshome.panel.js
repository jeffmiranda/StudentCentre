StudentCentre.panel.CertificatesHome = function(config) {
    config = config || {};
    Ext.apply(config,{
        border: false
        ,baseCls: 'modx-formpanel'
        ,cls: 'container'
        ,items: [{
            html: '<h2>'+_('studentcentre.certificates')+'</h2>'
            ,border: false
            ,cls: 'modx-page-header'
        },{
            xtype: 'modx-tabs'
            ,defaults: { border: false ,autoHeight: true, bodyStyle: 'padding:10px' }
			,border: true
			//,activeTab: tabIndex
            ,items: [{
	            title: _('studentcentre.certificates')
                ,defaults: { autoHeight: true }
                ,items: [{
		            html: '<p>'+_('studentcentre.certificates_desc')+'</p>'
		            ,border: false
		            ,bodyCssClass: 'panel-desc'
		        },{
		            xtype: 'sc-grid-certificates'
		            ,cls: 'main-wrapper'
		            ,preventRender: true
		        }]
            },{
	            title: _('studentcentre.certificate_tpls')
                ,defaults: { autoHeight: true }
                ,items: [{
		            html: '<p>'+_('studentcentre.certificate_tpl_desc')+'</p>'
		            ,border: false
		            ,bodyCssClass: 'panel-desc'
		        },{
		            xtype: 'sc-grid-certificate-tpl'
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
    StudentCentre.panel.CertificatesHome.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.panel.CertificatesHome,MODx.Panel);
Ext.reg('sc-certificates-panel-home',StudentCentre.panel.CertificatesHome);