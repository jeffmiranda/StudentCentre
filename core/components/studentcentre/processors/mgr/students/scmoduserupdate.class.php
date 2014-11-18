<?php
require_once MODX_CORE_PATH.'model/modx/processors/security/user/update.class.php';
require_once (dirname(__FILE__).'/_scvalidation.php');
/**
 * Update a student.
 *
 * @param integer $id The ID of the user
 *
 */
class scModUserUpdateProcessor extends modUserUpdateProcessor {
    public $classKey = 'scModUser';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.stu';

    /** @var modUserProfile $profile */
    public $studentProfile;
    /** @var scModUserValidation $scValidator */
    public $scValidator;

    /**
     * {@inheritDoc}
     * @return boolean
     */
    public function beforeSave() {
        $this->setStudentProfile();
        $this->scValidator = new scModUserValidation($this, $this->object, $this->studentProfile);
        $this->scValidator->validate();
        return parent::beforeSave();
    }

    /**
     * Set the student profile data for the user
     * @return modUserProfile
     */
    public function setStudentProfile() {
        $this->studentProfile = $this->object->getOne('StudentProfile');
        if (empty($this->studentProfile)) {
            $this->studentProfile = $this->modx->newObject('scStudentProfile');
            $this->studentProfile->set('internalKey',$this->object->get('id'));
            $this->studentProfile->save();
            $this->object->addOne($this->studentProfile,'StudentProfile');
        }
        $this->studentProfile->fromArray($this->getProperties());
        return $this->studentProfile;
    }


}
return 'scModUserUpdateProcessor';