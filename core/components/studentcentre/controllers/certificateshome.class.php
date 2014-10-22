<?php
class StudentCentreCertificatesHomeManagerController extends StudentCentreManagerController {
    public function process(array $scriptProperties = array()) {
 
    }
    public function getPageTitle() { return $this->modx->lexicon('studentcentre.cert'); }
    public function loadCustomCssJs() {

		$this->addJavascript($this->sc->config['jsUrl'].'mgr/widgets/certificates.grid.js');
		$this->addJavascript($this->sc->config['jsUrl'].'mgr/widgets/certificatetpl.grid.js');
		$this->addJavascript($this->sc->config['jsUrl'].'mgr/widgets/certificateshome.panel.js');
		$this->addLastJavascript($this->sc->config['jsUrl'].'mgr/sections/certificatesindex.js');
    }
    public function getTemplateFile() { return $this->sc->config['templatesPath'].'certificateshome.tpl'; }
}