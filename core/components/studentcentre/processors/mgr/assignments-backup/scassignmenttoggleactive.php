<?php

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

// get the assignment object, if it's NULL return an error
$assignment = $modx->getObject('scAssignment', $record->id);
if (!$assignment) {
	$modx->log(modX::LOG_LEVEL_ERROR, 'The $assignment variable is NULL.');
	return $modx->error->failure($modx->lexicon('studentcentre.sc_err_no_data'));
}

// get the active status and update it
$activeStatus = $assignment->get('active');
$activeStatus ? $assignment->set('active', 0) : $assignment->set('active', 1);

// save the assignment object
if ($assignment->save() === false) {
	$modx->log(modX::LOG_LEVEL_ERROR, 'Could not save the assignment object.');
	return $modx->error->failure($modx->lexicon('studentcentre.sc_err_no_save'));
}

return $modx->error->success();