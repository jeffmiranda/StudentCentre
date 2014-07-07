<?php
class StudentCentreStudentsCreateManagerController extends StudentCentreManagerController {
    public function process(array $scriptProperties = array()) {
 
    }
    public function getPageTitle() { return $this->modx->lexicon('studentcentre.create_student'); }
    public function loadCustomCssJs() {

        $this->addJavascript($this->sc->config['jsUrl'].'mgr/widgets/studentscreate.panel.js');
        $this->addLastJavascript($this->sc->config['jsUrl'].'mgr/sections/studentscreate.js');
    }
    public function getTemplateFile() { return $this->sc->config['templatesPath'].'studentscreate.tpl'; }
}