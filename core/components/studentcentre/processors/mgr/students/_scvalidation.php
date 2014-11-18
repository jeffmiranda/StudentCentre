<?php
/**
 * Handles common validation for student processors
 *
 * @package studentcentre
 */
class scModUserValidation extends modUserValidation {

    /** @var scModUser $student */
    public $student;
    /** @var scStudentProfile $scProfile */
    public $scProfile;

    function __construct(modObjectProcessor &$processor, scModUser &$student, scStudentProfile &$scProfile) {
        $this->processor =& $processor;
        $this->modx =& $processor->modx;
        $this->student =& $student;
        $this->scProfile =& $scProfile;
    }
    
    public function validate() {
        $this->checkStartDate();
		
        return !$this->processor->hasErrors();
    }
    
	public function checkStartDate() {
        $startDate = $this->processor->getProperty('start_date');
        if (!empty($startDate)) {
            $startDate = strtotime($startDate);
            if (empty($startDate)) {
                $this->processor->addFieldError('start_date',$this->modx->lexicon('studentcentre.stu_err_invalid_start_date'));
            }
            $this->processor->setProperty('start_date', $startDate);
            $this->scProfile->set('start_date', $startDate);
        }
    }

}