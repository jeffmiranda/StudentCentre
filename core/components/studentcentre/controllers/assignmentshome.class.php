<?php
class StudentCentreAssignmentsHomeManagerController extends StudentCentreManagerController {
    public function process(array $scriptProperties = array()) {
 
    }
    public function getPageTitle() { return $this->modx->lexicon('studentcentre.ass'); }
    public function loadCustomCssJs() {
        $this->addJavascript($this->sc->config['jsUrl'].'mgr/widgets/assignmentsactive.grid.js');
        $this->addJavascript($this->sc->config['jsUrl'].'mgr/widgets/assignmentsenrollment.grid.js');
        $this->addJavascript($this->sc->config['jsUrl'].'mgr/widgets/assignmentprograms.grid.js');
        $this->addJavascript($this->sc->config['jsUrl'].'mgr/widgets/assignmentlevels.grid.js');
        $this->addJavascript($this->sc->config['jsUrl'].'mgr/widgets/assignments.grid.js');
        $this->addJavascript($this->sc->config['jsUrl'].'mgr/widgets/assignmentshome.panel.js');
        $this->addLastJavascript($this->sc->config['jsUrl'].'mgr/sections/assignmentsindex.js');
    }
    public function getTemplateFile() { return $this->sc->config['templatesPath'].'assignmentshome.tpl'; }
}