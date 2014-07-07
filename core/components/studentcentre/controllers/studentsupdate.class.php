<?php
class StudentCentreStudentsUpdateManagerController extends StudentCentreManagerController {
    public function process(array $scriptProperties = array()) {
 
    }
    public function getPageTitle() { return $this->modx->lexicon('studentcentre.update_student'); }
    public function loadCustomCssJs() {

        $this->addJavascript($this->sc->config['jsUrl'].'mgr/widgets/studentsupdate.panel.js');
        $this->addLastJavascript($this->sc->config['jsUrl'].'mgr/sections/studentsupdate.js');
    }
    public function getTemplateFile() { return $this->sc->config['templatesPath'].'studentsupdate.tpl'; }
}