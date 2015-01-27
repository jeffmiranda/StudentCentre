<?php
class scCertificateCreateProcessor extends modObjectCreateProcessor {
    public $classKey = 'scCertificate';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.certificate';
 
    public function beforeSet() {
    
		$date = date('Y-m-d');
		$this->setProperty('date_created',$date);
		return parent::beforeSet();
    
    }
    
    public function beforeSave() {
        
        $studentId = $this->getProperty('student_id');
        if (empty($studentId)) {
            $this->addFieldError('student_id',$this->modx->lexicon('studentcentre.cert_err_ns_student'));
        }
        
        $certTypeId = $this->getProperty('certificate_type_id');
        if (empty($certTypeId)) {
            $this->addFieldError('certificate_type_id',$this->modx->lexicon('studentcentre.cert_err_ns_tpl_type'));
        } else {
	        switch ($certTypeId) {
			    case 1:
			        $anniversary = $this->getProperty('anniversary');
			        if (empty($anniversary)) {
			            $this->addFieldError('anniversary',$this->modx->lexicon('studentcentre.cert_err_ns_anniversary'));
			        }
			        break;
			    case 2:
			        $hours = $this->getProperty('hours');
			        if (empty($hours)) {
			            $this->addFieldError('hours',$this->modx->lexicon('studentcentre.cert_err_ns_hours'));
			        }
			        break;
			    case 3:
			        $levelId = $this->getProperty('level_id');
			        if (empty($levelId)) {
			            $this->addFieldError('level_id',$this->modx->lexicon('studentcentre.cert_err_ns_level'));
			        }
			        break;
			}
        }
        
        return parent::beforeSave();
        
    }
}
return 'scCertificateCreateProcessor';