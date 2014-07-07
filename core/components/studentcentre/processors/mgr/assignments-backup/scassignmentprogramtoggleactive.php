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

// get the program object, if it's NULL return an error
$program = $modx->getObject('scAssignmentProgram', $record->id);
if (!$program) {
	$modx->log(modX::LOG_LEVEL_ERROR, 'The $program variable is NULL.');
	return $modx->error->failure($modx->lexicon('studentcentre.sc_err_no_data'));
}

// get the active status and update it
$activeStatus = $program->get('active');
$activeStatus ? $program->set('active', 0) : $program->set('active', 1);

// save the program object
if ($program->save() === false) {
	$modx->log(modX::LOG_LEVEL_ERROR, 'Could not save the program object.');
	return $modx->error->failure($modx->lexicon('studentcentre.sc_err_no_save'));
}

return $modx->error->success();