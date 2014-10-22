<?php
class scCertificateUpdateProcessor extends modObjectUpdateProcessor {

    public $classKey = 'scCertificate';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.certificate';
    
    public function beforeSet() {
    
        $toggleActive = $this->getProperty('toggleActive');
        if (!empty($toggleActive)) {
	        if ($this->object->get('active') == 1) {
		        $this->setProperty('active', 0);
	        } else {
		        $this->setProperty('active', 1);
	        }
        }
        
        $toggleFlag = $this->getProperty('toggleFlag');
        if (!empty($toggleFlag)) {
	        if ($this->object->get('flag') == 1) {
		        $this->setProperty('flag', 0);
	        } else {
		        $this->setProperty('flag', 1);
	        }
        }
        
        return parent::beforeSet();
    }
        
}
return 'scCertificateUpdateProcessor';