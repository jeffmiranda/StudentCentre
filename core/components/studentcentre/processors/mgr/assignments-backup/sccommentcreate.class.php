<?php
class scCommentCreateProcessor extends modObjectCreateProcessor {
    public $classKey = 'scComment';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.ass';
 
    public function beforeSave() {
        
        $comment = $this->getProperty('comment');
        if (empty($comment)) {
            $this->addFieldError('comment',$this->modx->lexicon('studentcentre.ass_err_ns_comment'));
        }
        return parent::beforeSave();
        
    }
}
return 'scCommentCreateProcessor';