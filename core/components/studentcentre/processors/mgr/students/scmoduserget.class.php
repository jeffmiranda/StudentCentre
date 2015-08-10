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
        $this->formatStartDate();
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
    
    public function formatStartDate() {

    	$success = false;
    	
    	if ($this->object->get('start_date')) {
	    	$startDate = date('Y-m-d', $this->object->get('start_date'));
	    	$this->object->set('start_date', $startDate);
	    	$success = true;
    	} else {
	    	$this->object->set('start_date', '');
    	}
    	
    	return $success;
    
    }
    
    public function formatBirthDate() {

    	$success = false;
    	
    	if ($this->object->get('dob')) {
	    	$dob = date('Y-m-d', $this->object->get('dob'));
	    	$this->object->set('dob', $dob);
	    	$success = true;
    	} else {
	    	$this->object->set('dob', '');
    	}
    	
    	return $success;
    
    }
}
return 'scModUserGetProcessor';
