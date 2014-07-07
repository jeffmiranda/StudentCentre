<?php
class scStudentAssignment extends xPDOSimpleObject {
	
	public function __construct(& $xpdo) {
        parent :: __construct($xpdo);
    }
	
	/**
     * Notifies the student by email that a new comment has been made
     * @param none
     */
	public function notifyStudent() {
		$success = false;
		$sa = $this->xpdo->getObjectGraph('scStudentAssignment', array(
			'Student' => array(
				'Profile' => array()
			),
			'Assignment' => array()
		), array(
			'scStudentAssignment.id' => $this->get('id')
		));
		if ($sa) {
			$email = $sa->Student->Profile->get('email');
			$fullname = $sa->Student->Profile->get('fullname');
			//$this->xpdo->log(1,print_r('Email: ' . $email,true));
			$assignment_name = $sa->Assignment->get('name');
		} else {
			return $success;
		}
		
		// build the email
		$chunk = $this->_getTplChunk('notifyStudentEmail');
		$chunk->setCacheable(false);
	    $body = $chunk->process(array(
	    	'name' => $fullname,
	    	'assignment_name' => $assignment_name,
	    ));
	    
	    // get the mail service
		$this->xpdo->getService('mail', 'mail.modPHPMailer');
		$this->xpdo->mail->set(modMail::MAIL_BODY,$body);
		$this->xpdo->mail->set(modMail::MAIL_FROM,$this->xpdo->getOption('studentcentre.email_from'));
		$this->xpdo->mail->set(modMail::MAIL_FROM_NAME,'BigRock Aikikai Student Centre');
		$this->xpdo->mail->set(modMail::MAIL_SUBJECT,'A new comment has been made on your BigRock-Aikikai assignment!');
		$this->xpdo->mail->address('to',$email);
		$this->xpdo->mail->address('reply-to',$this->xpdo->getOption('studentcentre.email_from'));
		if (!$this->xpdo->mail->send()) { // send the email
		    $this->xpdo->log(modX::LOG_LEVEL_ERROR,'An error occurred while trying to send the email: '.$this->xpdo->mail->mailer->ErrorInfo);
		    return $success;
		}
		$this->xpdo->mail->reset();
		$success = true;
		return $success;
	}
	
	/**
     * Notifies the teacher by email that a new comment has been made
     * @param none
     */
	public function notifyTeacher() {
		$success = false;
		$sa = $this->xpdo->getObjectGraph('scStudentAssignment', array(
			'Student' => array(
				'Profile' => array()
			),
			'Assignment' => array()
		), array(
			'scStudentAssignment.id' => $this->get('id')
		));
		if ($sa) {
			$fullname = $sa->Student->Profile->get('fullname');
			//$this->xpdo->log(1,print_r('Email: ' . $email,true));
			$assignment_name = $sa->Assignment->get('name');
		} else {
			return $success;
		}
		
		// build the email
		$chunk = $this->_getTplChunk('notifyTeacherEmail');
		$chunk->setCacheable(false);
	    $body = $chunk->process(array(
	    	'name' => $fullname,
	    	'assignment_name' => $assignment_name,
	    ));
	    
	    // get the mail service
		$this->xpdo->getService('mail', 'mail.modPHPMailer');
		$this->xpdo->mail->set(modMail::MAIL_BODY,$body);
		$this->xpdo->mail->set(modMail::MAIL_FROM,$this->xpdo->getOption('studentcentre.email_from'));
		$this->xpdo->mail->set(modMail::MAIL_FROM_NAME,'BigRock Aikikai Student Centre');
		$this->xpdo->mail->set(modMail::MAIL_SUBJECT,'A new comment has been made on a BigRock-Aikikai assignment!');
		$this->xpdo->mail->address('to',$this->xpdo->getOption('studentcentre.email_to'));
		$this->xpdo->mail->address('reply-to',$this->xpdo->getOption('studentcentre.email_from'));
		if (!$this->xpdo->mail->send()) { // send the email
		    $this->xpdo->log(modX::LOG_LEVEL_ERROR,'An error occurred while trying to send the email: '.$this->xpdo->mail->mailer->ErrorInfo);
		    return $success;
		}
		$this->xpdo->mail->reset();
		$success = true;
		return $success;
	}
		
	private function _getTplChunk($name,$postfix = '.chunk.tpl') {
	    $chunk = false;
	    $chunksPath = dirname(XPDO_CORE_PATH) .'/components/studentcentre/elements/chunks/';
	    $f = $chunksPath.strtolower($name).$postfix;
	    if (file_exists($f)) {
	    	
	        $o = file_get_contents($f);
	        $chunk = $this->xpdo->newObject('modChunk');
	        $chunk->set('name',$name);
	        $chunk->setContent($o);
	    }
	    return $chunk;
	}

	
}