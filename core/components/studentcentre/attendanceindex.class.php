<?php

require_once dirname(__FILE__) . '/model/studentcentre/studentcentre.class.php';
abstract class StudentCentreManagerController extends modExtraManagerController {
    /** @var StudentCentre $sc */
    public $sc;
    public function initialize() {
        $this->sc = new StudentCentre($this->modx);
 
        $this->addCss($this->sc->config['cssUrl'].'mgr.css');
        $this->addJavascript($this->sc->config['jsUrl'].'mgr/studentcentre.js');
        $this->addHtml('<script type="text/javascript">
        Ext.onReady(function() {
            StudentCentre.config = '.$this->modx->toJSON($this->sc->config).';
            StudentCentre.action = "'.(!empty($_REQUEST['a']) ? $_REQUEST['a'] : 0).'";
        });
        </script>');
        return parent::initialize();
    }
    public function getLanguageTopics() {
        return array('studentcentre:default');
    }
    public function checkPermissions() { return true;}
}
class AttendanceIndexManagerController extends StudentCentreManagerController {
    public static function getDefaultController() { return 'attendancehome'; }
}