<?php
$sc = $modx->getService('studentcentre','StudentCentre',$modx->getOption('studentcentre.core_path',null,$modx->getOption('core_path').'components/studentcentre/').'model/studentcentre/',$scriptProperties);
if (!($sc instanceof StudentCentre)) return '';

$output = '';

$journals = $modx->getCollection('scJournal');

if (!empty($journals)) {
	
	foreach ($journals as $journal) {
		
		$cp = $journal->getOne('ClassProgress');
		
		if ($cp) {
			
			$nextLvl = $cp->getNextLevel();
			
			if ($nextLvl) {
				
				$journal->set('next_level_id', $nextLvl->get('id'));
				$journal->set('hours_since_leveling', $cp->get('hours_since_leveling'));
				if ($journal->save()) {
					$output .= 'Successfully saved Journal (' . $journal->get('id') . ')<br>';
				} else {
					$output .= 'Could not save Journal (' . $journal->get('id') . ')<br>';
				}
				
			} else {
				$output .= 'Could not get NextLevel for ClassProgress (' . $cp->get('id') . ')<br>';
			}
			
		} else {
			$output .= 'Could not get ClassProgress for Journal (' . $journal->get('id') . ')<br>';
		}
		
	}
} else {
	$output .= '$journals is empty!';
}

return $output;