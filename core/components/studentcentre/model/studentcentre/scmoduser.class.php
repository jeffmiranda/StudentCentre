<?php
class scModUser extends modUser {
    
    function __construct(xPDO & $xpdo) {
	    parent::__construct($xpdo);
	    $this->set('class_key','scModUser');
	}
	
	/**
	 * Gets the students total hours practiced
	 * from all rank categories
	 */
/*
	public function getGrandTotalHours() {
		
		$gt = null;
		
		$rankProgressCollection = $this->xpdo->getCollection('scClassProgress', array(
			'student_id' => $this->get('id')
		));
		
		if (!empty($rankProgressCollection)) {
			$gt = 0;
			foreach ($rankProgressCollection as $rankProgress) {
				$gt = $gt + $rankProgress->get('total_hours');
			}
		}
		
		return $gt;
	}
*/

}