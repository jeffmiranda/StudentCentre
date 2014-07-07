<?php
/*
$sc = $modx->getService('studentcentre','StudentCentre',$modx->getOption('studentcentre.core_path',null,$modx->getOption('core_path').'components/studentcentre/').'model/studentcentre/',$scriptProperties);
if (!($sc instanceof StudentCentre)) return $modx->error->failure('Failed to get StudentCentre service');
*/

//if (!$modx->hasPermission('save_document')) return $modx->error->failure($modx->lexicon('access_denied'));

// ensure that DATA has been returned
if (empty($scriptProperties['data'])) {
    $modx->log(modX::LOG_LEVEL_ERROR, 'The DATA variable in scriptProperties is empty.');
    return $modx->error->failure($modx->lexicon('studentcentre.sc_err_no_data'));
}
// there's DATA, so get it
$data = $modx->getOption('data',$scriptProperties,'');
if (empty($data)) {
	$modx->log(modX::LOG_LEVEL_ERROR, 'The $data variable is empty.');
	return $modx->error->failure($modx->lexicon('studentcentre.sc_err_no_data'));
}

// the DATA is a JSON string to decode it into a PHP object
$record = json_decode($data);

// get the enrollment object, if it's NULL return an error
$enrollment = $modx->getObject('scEnrollment', $record->id);
if (!$enrollment) {
	$modx->log(modX::LOG_LEVEL_ERROR, 'The $enrollment variable is NULL.');
	return $modx->error->failure($modx->lexicon('studentcentre.sc_err_no_data'));
}

// get the active status and update it
$activeStatus = $enrollment->get('active');
$activeStatus ? $enrollment->set('active', 0) : $enrollment->set('active', 1);

// save the enrollment object
if ($enrollment->save() === false) {
	$modx->log(modX::LOG_LEVEL_ERROR, 'Could not save the enrollment object.');
	return $modx->error->failure($modx->lexicon('studentcentre.sc_err_no_save'));
}

// get the program, the related assignments, and the related student assignments
$criteria['scAssignment.program_id'] = $record->program_id;
$criteria['scAssignment.level_id'] = $record->level_id;
$criteria['StudentAssignment.student_id'] = $record->student_id;
$criteria = $modx->newQuery('scAssignment', $criteria);
$assignments = $modx->getCollectionGraph('scAssignment', '{ "StudentAssignment":{} }', $criteria);
if (empty($assignments)) {
	$modx->log(modX::LOG_LEVEL_ERROR, 'Empty array! Could not get the assignments.');
	return $modx->error->failure($modx->lexicon('studentcentre.sc_err_no_save'));
}

// loop through each student assignment and update it's status
$errors = false;
foreach ($assignments as $assignment) {
    foreach ($assignment->getMany('StudentAssignment') as $studentAssignment) {
        $studentAssignment->set('active', $enrollment->get('active'));
        if ($studentAssignment->save() === false) {
			$modx->log(modX::LOG_LEVEL_ERROR, 'Could not save the StudentAssignment object.');
			$errors = true;
		}
    }
}
if ($errors) return $modx->error->failure('Could not save the student assignments!');

return $modx->error->success();