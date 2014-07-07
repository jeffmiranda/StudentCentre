<?php
class scAssignmentEnrollmentCreateProcessor extends modObjectCreateProcessor {
    public $classKey = 'scAssignmentEnrollment';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.ass';
    
    public function beforeSet() {
		$date = date('Y-m-d');
		$this->setProperty('date_created',$date);
		return parent::beforeSet();
    }
    
    public function beforeSave() {
        $studentId = $this->getProperty('student_id');
        $programId = $this->getProperty('program_id');
        $levelId = $this->getProperty('level_id');
        $errors = false;
        
        if (empty($studentId)) {
            $this->addFieldError('student_id',$this->modx->lexicon('studentcentre.ass_err_select_student'));
            $errors = true;
        }
        if (empty($programId)) {
        	$this->addFieldError('program_id',$this->modx->lexicon('studentcentre.ass_err_select_program'));
            $errors = true;
        }
        if (empty($levelId)) {
        	$this->addFieldError('level_id',$this->modx->lexicon('studentcentre.ass_err_select_level'));
            $errors = true;
        }
        if (!$errors) {
	        if ($this->doesAlreadyExist(array(
	        	'student_id' => $studentId,
	        	'program_id' => $programId,
	        	'level_id' => $levelId
	        ))) {
	            $this->addFieldError('student_id',$this->modx->lexicon('studentcentre.ass_err_program_ae'));
	        }
        }
        return parent::beforeSave();
    }
    
    public function afterSave() {
    	$studentId = $this->getProperty('student_id');
    	$programId = $this->getProperty('program_id');
    	$levelId = $this->getProperty('level_id');
    	$dateCreated = date('Y-m-d H:i:s');
    	$assignments = $this->modx->getCollection('scAssignment',array(
		   'program_id' => $programId,
		   'level_id' => $levelId
		));
		//error_log(print_r('$assignments: ' . $assignments,true));
		//$this->modx->log(1,print_r('StudentId: ' . $studentId . ' | ProgramId: ' . $programId,true));
		if ($assignments) {
			//$this->modx->log(1,print_r('$assignments is not null!',true));
			foreach ($assignments as $assignment) {
				$assignmentId = $assignment->get('id');
				$activeAssignment = $this->modx->newObject('scStudentAssignment', array(
					'student_id' => $studentId,
					'assignment_id' => $assignmentId,
					'status' => 'Available',
					'progress' => 0,
					'date_created' => $dateCreated
				));
				if (!$activeAssignment->save()) {
					$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not save the Active Assignment.');
					return $this->failure($this->modx->lexicon('studentcentre.ass_err_saving_sa'));
				}
			}
		} else {
			$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not get the collection of Assignments.');
			return $this->failure($this->modx->lexicon('studentcentre.ass_err_activate_assignments'));
		}
	    return parent::afterSave();
    }
 
}
return 'scAssignmentEnrollmentCreateProcessor';