<?php
class scJournalUpdateProcessor extends modObjectUpdateProcessor {

    public $classKey = 'scJournal';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.journal';
    
    public function beforeSet() {
    
        $toggleActive = $this->getProperty('toggleActive');
        $testDate = $this->getProperty('test_date');
        
        if (!empty($toggleActive)) {
	        if ($this->object->get('active') == 1) {
		        $this->setProperty('active', 0);
	        } else {
		        $this->setProperty('active', 1);
	        }
        }
        
        // if test date is empty, set it as null.
        if (empty($testDate)) {
	        $this->setProperty('test_date', null);
        }
                
        return parent::beforeSet();
    }
    
    public function afterSave() {
		
		// Check to see if a comment was submitted
		$comment = $this->getProperty('comment');
		
		if (!empty($comment)) {
			
			$today = date('Y-m-d');
			
			$newComment = $this->modx->newObject('scJournalComment', array(
				'journal_id' => $this->object->get('id'),
				'comment' => $comment,
				'date_created' => $today
			));
			
			if (!$newComment->save()) {
				$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not save the new comment for journal ID: ' . $this->object->get('id'));
				return $this->modx->error->failure($this->modx->lexicon('studentcentre.att_err_saving_journal_comment'));
			}
			
		}
		
		return parent::afterSave();
		
    }

}
return 'scJournalUpdateProcessor';