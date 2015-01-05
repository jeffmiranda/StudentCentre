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
$nextLevelId = $modx->getOption('next_level_id',$scriptProperties,0);
//error_log(print_r($scriptProperties, true));
$studentId = $modx->getOption('student_id',$scriptProperties,0);
$test = array();

// Get all the techniques for the level
if ($nextLevelId == 0) {
	$modx->log(modX::LOG_LEVEL_ERROR, 'The Next Level ID was not submitted!');
	return $modx->error->failure($modx->lexicon('studentcentre.att_err_test_load'));
}

$c = $modx->newQuery('scLevelTechnique');
$c->innerJoin('scTechnique', 'Technique', array(
	'scLevelTechnique.technique_id = Technique.id'
));
$c->where(array(
	'scLevelTechnique.level_id' => $nextLevelId
	,'Technique.active' => 1
));
$c->select(array('
	scLevelTechnique.*,
	Technique.name AS `name`,
	Technique.description AS `description`
'));
$c->sortby('`order`','ASC');
$c->prepare();
$modx->log(1,print_r('SQL Statement: ' . $c->toSQL(),true));

$techniques = $modx->getCollection('scLevelTechnique', $c);
if (!$techniques) {
	$modx->log(modX::LOG_LEVEL_ERROR, 'Could not get a collection of techniques!');
	return $modx->error->failure($modx->lexicon('studentcentre.att_err_test_no_techniques'));
}

$test['techniques'] = $techniques;
$test['technique_count'] = count($techniques);

// Begin getting the previous tests and their techniques and comments (if any)
if ($studentId == 0) {
	$modx->log(modX::LOG_LEVEL_ERROR, 'The Student ID was not submitted!');
	return $modx->error->failure($modx->lexicon('studentcentre.att_err_test_load'));
}
// build the query to get all previous tests and their techniques and comments
$graph = '{ "StudentTestTechnique":{} }';
$q = $modx->newQuery('scStudentTest');
$q->where(array(
	'scStudentTest.student_id' => $studentId
	,'scStudentTest.level_id' => $nextLevelId
));
$q->sortby('scStudentTest.date_created', 'DESC');
//$q->limit(0,1);
//$q->prepare();
//error_log(print_r('SQL Statement: ' . $q->toSQL(),true));
// build the query obj to get the most recent comment
$prevStudentTests = $modx->getCollectionGraph('scStudentTest', $graph, $q);
if ($prevStudentTests) {
	// Get the most recent test and add it's info and techniques to the return array ($test)	
	$recentTest = reset($prevStudentTests);
	$lastTest = array('info' => $recentTest);
	$lastTestTechniques = array();
	foreach ($recentTest->getMany('StudentTestTechnique') as $t) {
		$lastTestTechniques[$t->get('technique_id')] = $t;
	}
	$lastTest['techniques'] = $lastTestTechniques;
	$test['last_test'] = $lastTest;
	
	// Loop through all the previous tests, and concatenate the comments for each technique
	// and add to the return array ($test)
	$prevTestComments = array();
	foreach ($prevStudentTests as $tst) {
		foreach ($tst->getMany('StudentTestTechnique') as $tec) {
			$tecComment = $tec->get('comment');
			if (!empty($tecComment)) {
				if (!empty($prevTestComments[$tec->get('technique_id')])) {
					$prevTestComments[$tec->get('technique_id')] = $tecComment . '<br>' . $prevTestComments[$tec->get('technique_id')];
				} else {
					$prevTestComments[$tec->get('technique_id')] = $tecComment;
				}
			}
		}
	}
    $test['prev_comments'] = $prevTestComments;
} else {
	$test['last_test'] = false;
}

return $modx->error->success('Success', $test);