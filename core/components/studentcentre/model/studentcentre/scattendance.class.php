<?php
class scAttendance extends xPDOSimpleObject {
	
	public function __construct(& $xpdo) {
        parent :: __construct($xpdo);
    }
    
	public function save() {
		
		if (!$this->xpdo->getOption('sc_allow_multiple_attendance', null, 0)) {
			if ($this->alreadyAttended()) {
				$this->xpdo->log(xPDO::LOG_LEVEL_ERROR, 
					'Attendance record for student (ID: '.$this->get('student_id').') already exists for scheduled class (ID: '.$this->get('scheduled_class_id').') on the date: '.$this->get('date')
				);
				return false;
			}
		}
		
		return parent::save();
		
	}
	
	/**
	 * Checks to see if student already attended this scheduled
	 * class on this same day. If so, returns true. If not,
	 * returns false.
	 */
	protected function alreadyAttended() {
		
		$att = $this->xpdo->getObject('scAttendance', array(
			'student_id' => $this->get('student_id')
			,'scheduled_class_id' => $this->get('scheduled_class_id')
			,'date' => $this->get('date')
		));
		
		return $att ? true : false;
		
	}
	
}