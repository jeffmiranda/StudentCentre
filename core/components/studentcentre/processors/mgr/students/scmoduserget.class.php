<?php
/**
 * @package studentcentre
 */
/**
 * Get a student
 *
 * @param integer $id The ID of the user
 *
 */
class scModUserGetProcessor extends modObjectGetProcessor {
    public $classKey = 'scModUser';
    public $languageTopics = array('user');
    public $permission = 'view_user';
    public $objectType = 'user';

    public function beforeOutput() {

        $this->getStudentProfile();
        $this->formatBirthDate();
        return parent::beforeOutput();

    }

    public function getStudentProfile() {

    	$profile = $this->object->getOne('Profile');
    	$p = $profile->toArray();
    	foreach ($p as $key => $value) {
	    	if ($key != 'id') $this->object->set($key, $value);
    	}

    	$studentProfile = $this->object->getOne('StudentProfile');
    	$sp = $studentProfile->toArray();
    	foreach ($sp as $key => $value) {
	    	if ($key != 'id') $this->object->set($key, $value);
    	}
    
    }
    
    public function formatBirthDate() {

    	$success = false;
    	
    	if ($this->object->get('dob')) {
	    	$dob = date('d-m-Y', $this->object->get('dob'));
	    	$this->object->set('dob', $dob);
	    	$success = true;
    	}
    	
    	return $success;
    
    }
}
return 'scModUserGetProcessor';
