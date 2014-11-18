<?php
require_once MODX_CORE_PATH.'model/modx/processors/security/user/create.class.php';
require_once (dirname(__FILE__).'/_scvalidation.php');

class scModUserCreateProcessor extends modUserCreateProcessor {
    public $classKey = 'scModUser';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.stu';
 
    /** @var modUserProfile $profile */
    public $studentProfile;
    /** @var scModUserValidation $scValidator */
    public $scValidator;
    
    public function initialize() {
        $this->setDefaultProperties(array(
            'class_key' => $this->classKey,
            'blocked' => false,
            'active' => true,
        ));

        return parent::initialize();
    }
    
    public function beforeSet() {
    	
		$date = date('Y-m-d');
		$this->setProperty('date_created',$date);
		return parent::beforeSet();
		    
    }

    /**
     * {@inheritDoc}
     * @return boolean
     */
    public function beforeSave() {
        $this->addStudentProfile();
        $this->scValidator = new scModUserValidation($this, $this->object, $this->studentProfile);
        $this->scValidator->validate();
        
        return parent::beforeSave();
    }
    
    /**
     * @return scStudentProfile
     */
    public function addStudentProfile() {
        $this->studentProfile = $this->modx->newObject('scStudentProfile');
        $this->studentProfile->fromArray($this->getProperties());
        $this->object->addOne($this->studentProfile,'StudentProfile');
        return $this->studentProfile;
    }
    
}
return 'scModUserCreateProcessor';