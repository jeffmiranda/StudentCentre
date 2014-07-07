<?php
class scModUser extends modUser {
    function __construct(xPDO & $xpdo) {
	    parent::__construct($xpdo);
	    $this->set('class_key','scModUser');
	}
}