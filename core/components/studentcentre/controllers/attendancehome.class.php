<?php
class StudentCentreAttendanceHomeManagerController extends StudentCentreManagerController {
    public function process(array $scriptProperties = array()) {
 
    }
    public function getPageTitle() { return $this->modx->lexicon('studentcentre.att'); }
    public function loadCustomCssJs() {

		$this->addJavascript($this->sc->config['jsUrl'].'mgr/widgets/attendancecreate.js');
		$this->addJavascript($this->sc->config['jsUrl'].'mgr/widgets/attendancetestready.grid.js');
		$this->addJavascript($this->sc->config['jsUrl'].'mgr/widgets/attendance.grid.js');
		$this->addJavascript($this->sc->config['jsUrl'].'mgr/widgets/attendancelevelcategories.grid.js');
		$this->addJavascript($this->sc->config['jsUrl'].'mgr/widgets/attendancelevels.grid.js');
		$this->addJavascript($this->sc->config['jsUrl'].'mgr/widgets/attendancetechniques.grid.js');
		$this->addJavascript($this->sc->config['jsUrl'].'mgr/widgets/attendancelevelstechniques.grid.js');
		$this->addJavascript($this->sc->config['jsUrl'].'mgr/widgets/attendanceclasses.grid.js');
		$this->addJavascript($this->sc->config['jsUrl'].'mgr/widgets/attendancelocations.grid.js');
		$this->addJavascript($this->sc->config['jsUrl'].'mgr/widgets/attendancescheduledclasses.grid.js');
		$this->addJavascript($this->sc->config['jsUrl'].'mgr/widgets/attendanceenrollments.grid.js');
		$this->addJavascript($this->sc->config['jsUrl'].'mgr/widgets/attendancejournal.container.js');
		$this->addJavascript($this->sc->config['jsUrl'].'mgr/widgets/attendanceprogress.grid.js');
		$this->addJavascript($this->sc->config['jsUrl'].'mgr/widgets/attendancehome.panel.js');
		$this->addLastJavascript($this->sc->config['jsUrl'].'mgr/sections/attendanceindex.js');
    }
    public function getTemplateFile() { return $this->sc->config['templatesPath'].'attendancehome.tpl'; }
}