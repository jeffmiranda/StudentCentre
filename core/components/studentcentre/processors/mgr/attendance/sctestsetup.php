<?php
/**
 * Student Centre
 *
 * Copyright 2013 by Jeff Miranda <me@jeffmiranda.com>
 *
 * This file is part of Student Centre.
 *
 * Student Centre is NOT free software; you cannot redistribute it 
 * and/or modify it in any way.
 *
 * @package studentcentre
 */
/**
 * Receives form data and batch creates attendance records
 *
 * @package studentcentre
 */
if (!$modx->hasPermission('save_document')) return $modx->error->failure($modx->lexicon('access_denied'));

$levelId = $modx->getOption('level_id',$scriptProperties,0);
$studentId = $modx->getOption('student_id',$scriptProperties,0);
$test = array();

// Get all the techniques for the level
if ($levelId == 0) {
	$modx->log(modX::LOG_LEVEL_ERROR, 'The Level ID was not submitted!');
	return $modx->error->failure($modx->lexicon('studentcentre.att_err_test_load'));
}

$c = $modx->newQuery('scLevelTechnique');
$c->innerJoin('scTechnique', 'Technique', array(
	'scLevelTechnique.technique_id = Technique.id'
));
$c->where(array(
	'scLevelTechnique.level_id' => $levelId
	,'Technique.active' => 1
));
$c->select(array('
	scLevelTechnique.*,
	Technique.name AS `name`,
	Technique.description AS `description`
'));
$c->sortby('scLevelTechnique.order','ASC');
//$c->prepare();
//$modx->log(1,print_r('SQL Statement: ' . $c->toSQL(),true));

$techniques = $modx->getCollection('scLevelTechnique', $c);
if (!$techniques) {
	$modx->log(modX::LOG_LEVEL_ERROR, 'Could not get a collection of techniques!');
	return $modx->error->failure($modx->lexicon('studentcentre.att_err_test_load'));
}

$test['techniques'] = $techniques;
$test['technique_count'] = count($techniques);

// Get any previous technique comments from past test (if any)
if ($studentId == 0) {
	$modx->log(modX::LOG_LEVEL_ERROR, 'The Student ID was not submitted!');
	return $modx->error->failure($modx->lexicon('studentcentre.att_err_test_load'));
}

// build the query to get the last student test and any comments
$graph = '{ "StudentTestTechnique":{} }';
$q = $modx->newQuery('scStudentTest');
$q->where(array(
	'scStudentTest.student_id' => $studentId
	,'scStudentTest.level_id' => $levelId
));
$q->sortby('scStudentTest.date_created', 'ASC');
$q->limit(0,1);
// build the query obj to get the most recent comment
$lastStudentTest = $modx->getCollectionGraph('scStudentTest', $graph, $q);
if ($lastStudentTest) {
	foreach ($lastStudentTest as $lst) {
		$lastTest = array('info' => $lst);
		$arrTechniques = array();
		foreach ($lst->getMany('StudentTestTechnique') as $t) {
			$arrTechniques[$t->get('technique_id')] = $t;
		}
		$lastTest['techniques'] = $arrTechniques;
	}
    $test['last_test'] = $lastTest;
} else {
	$test['last_test'] = false;
}

return $modx->error->success('Success', $test);