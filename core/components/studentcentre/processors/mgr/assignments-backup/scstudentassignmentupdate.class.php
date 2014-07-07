<?php
class scStudentAssignmentUpdateProcessor extends modObjectUpdateProcessor {
    
    public $classKey = 'scStudentAssignment';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.ass';
    
	public function beforeSet() {
		
		$comment = $this->getProperty('comment');
		$saId = $this->getProperty('id');
		$userId = $this->getProperty('userId');
		$processorsPath = $this->getProperty('processorsPath');
		$dateCreated = date('Y-m-d H:i:s');
		
		if (!empty($comment)) {
        	$response = $this->modx->runProcessor('mgr/assignments/sccommentcreate', array(
					'comment' => $comment,
					'student_assignment_id' => $saId,
					'user_id' => $userId,
					'date_created' => $dateCreated,
				), array(
					'processors_path' => $processorsPath,
				)
			);
			if ($response->isError()) { // if there was an error adding the comment
				return $this->failure($response->getMessage());
			} else { // 
				$studentAssignment = $this->modx->getObject('scStudentAssignment', $saId);
				if (!$studentAssignment->notifyStudent()) return $this->failure($this->modx->lexicon('studentcentre.ass_err_notify_student'));
			}
        }

		return parent::beforeSet();
	}
}

return 'scStudentAssignmentUpdateProcessor';