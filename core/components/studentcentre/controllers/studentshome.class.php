<?php
class StudentCentreStudentsHomeManagerController extends StudentCentreManagerController {
    public function process(array $scriptProperties = array()) {
 
    }
    public function getPageTitle() { return $this->modx->lexicon('studentcentre.stu'); }
    public function loadCustomCssJs() {

		$this->addJavascript($this->sc->config['jsUrl'].'mgr/widgets/students.grid.js');
		$this->addJavascript($this->sc->config['jsUrl'].'mgr/widgets/studentshome.panel.js');
		$this->addLastJavascript($this->sc->config['jsUrl'].'mgr/sections/studentsindex.js');
    }
    public function getTemplateFile() { return $this->sc->config['templatesPath'].'studentshome.tpl'; }
}