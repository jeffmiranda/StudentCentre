<?php
class StudentCentreAttendanceTestManagerController extends StudentCentreManagerController {
    public function process(array $scriptProperties = array()) {
 
    }
    public function getPageTitle() { return $this->modx->lexicon('studentcentre.ass'); }
    public function loadCustomCssJs() {

        $this->addJavascript($this->sc->config['jsUrl'].'mgr/widgets/attendancetest.panel.js');
        $this->addLastJavascript($this->sc->config['jsUrl'].'mgr/sections/attendancetest.js');
    }
    public function getTemplateFile() { return $this->sc->config['templatesPath'].'attendancetest.tpl'; }
}