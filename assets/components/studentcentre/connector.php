<?php
require_once dirname(dirname(dirname(dirname(__FILE__)))).'/config.core.php';
require_once MODX_CORE_PATH.'config/'.MODX_CONFIG_KEY.'.inc.php';
require_once MODX_CONNECTORS_PATH.'index.php';

$corePath = $modx->getOption('studentcentre.core_path',null,$modx->getOption('core_path').'components/studentcentre/');
require_once $corePath.'model/studentcentre/studentcentre.class.php';
$modx->studentcentre = new StudentCentre($modx);

$modx->lexicon->load('studentcentre:default');
 
/* handle request */
$path = $modx->getOption('processorsPath',$modx->studentcentre->config,$corePath.'processors/');
$modx->request->handleRequest(array(
    'processors_path' => $path,
    'location' => '',
));