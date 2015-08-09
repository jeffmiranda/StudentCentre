<?php
class scJournalUpdateProcessor extends modObjectUpdateProcessor {

    public $classKey = 'scJournal';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.journal';
    
/*
    public function beforeSet() {
		
		// Properly format test date
		$testDate = $this->getProperty('test_date');
        if (!empty($testDate)) {
			$this->setProperty('test_date', date('Y-m-d', strtotime(str_replace('/','-',$testDate))));
		}
		        
        return parent::beforeSet();
        		
    }
*/

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