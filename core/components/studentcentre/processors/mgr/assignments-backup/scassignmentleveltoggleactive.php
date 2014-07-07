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

// get the level object, if it's NULL return an error
$level = $modx->getObject('scAssignmentLevel', $record->id);
if (!$level) {
	$modx->log(modX::LOG_LEVEL_ERROR, 'The $level variable is NULL.');
	return $modx->error->failure($modx->lexicon('studentcentre.sc_err_no_data'));
}

// get the active status and update it
$activeStatus = $level->get('active');
$activeStatus ? $level->set('active', 0) : $level->set('active', 1);

// save the level object
if ($level->save() === false) {
	$modx->log(modX::LOG_LEVEL_ERROR, 'Could not save the level object.');
	return $modx->error->failure($modx->lexicon('studentcentre.sc_err_no_save'));
}

return $modx->error->success();