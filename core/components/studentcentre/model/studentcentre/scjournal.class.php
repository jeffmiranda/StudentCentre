<?php
class scJournal extends xPDOSimpleObject {
	
	public $resetCriteria = array(
		'belt' => 'notreceived'
		,'certificate' => 'notreceived'
		,'written_test_progress' => 0
		,'test_fee' => 0
		,'test_date' => null
		,'pre_test_qty' => 0
		,'active' => 0
	);
	
	public function __construct(& $xpdo) {
        parent :: __construct($xpdo);
    }
    
	public function save() {
		
		if ($this->isJournalComplete()) { $this->resetJournal(); }
		
		return parent::save();
		
	}
	
	public function isJournalComplete() {
		
		$reset = true;
		
		if ($this->get('belt') != 'awarded') { $reset = false; }
		if ($this->get('certificate') != 'awarded') { $reset = false; }
		if ($this->get('written_test_progress') != 100) { $reset = false; }
		if (!$this->get('test_fee')) { $reset = false; }
		if (!$this->get('test_date')) { $reset = false; }
				
		return $reset;
		
	}
	
	public function resetJournal() {
		
		$this->fromArray($this->resetCriteria);
		
		$progress = $this->xpdo->getObject('scClassProgress', $this->get('class_progress_id'));
		$nextLvl = $progress->getNextLevel();
		if ($nextLvl) {
			$this->set('next_level_id', $nextLvl->get('id'));
		} else {
			$this->set('next_level_id', 0);
		}
		
	}
	
}