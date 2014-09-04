<?php
class scClassLevelCategory extends xPDOSimpleObject {
	
	public function __construct(& $xpdo) {
        parent :: __construct($xpdo);
    }

	/**
	 * Gets the first level of the category.
	 * Returns null if no level exists.
	 */
	public function getFirstLevel() {
		
		$level = null;
		
		// build query
		$q = $this->xpdo->newQuery('scClassLevel');
		$q->where(array(
			'class_level_category_id' => $this->get('id')
			,'active' => 1
		));
		$q->sortby('`order`', 'ASC');
		$q->limit(1);
		$firstLevel = $this->xpdo->getObject('scClassLevel', $q);
		if ($firstLevel) {
			$level = $firstLevel;
		}
		
		return $level;
	}
	
	/**
	 * Gets the last level of the category.
	 * Returns null if no level exists.
	 */
	public function getLastLevel() {
		
		$level = null;
		
		// build query
		$q = $this->xpdo->newQuery('scClassLevel');
		$q->where(array(
			'class_level_category_id' => $this->get('id')
			,'active' => 1
		));
		$q->sortby('`order`', 'DESC');
		$q->limit(1);
		$lastLevel = $this->xpdo->getObject('scClassLevel', $q);
		if ($lastLevel) {
			$level = $lastLevel;
		}
		
		return $level;
	}
	
}