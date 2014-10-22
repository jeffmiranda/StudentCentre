<?php
$xpdo_meta_map['scCertificate']= array (
  'package' => 'studentcentre',
  'version' => '1.1',
  'table' => 'certificates',
  'extends' => 'xPDOSimpleObject',
  'fields' => 
  array (
    'student_id' => NULL,
    'certificate_tpl_id' => NULL,
    'hours' => NULL,
    'anniversary' => NULL,
    'flag' => 1,
    'date_created' => NULL,
    'last_modified' => 'CURRENT_TIMESTAMP',
  ),
  'fieldMeta' => 
  array (
    'student_id' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => false,
    ),
    'certificate_tpl_id' => 
    array (
      'dbtype' => 'tinyint',
      'precision' => '3',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => false,
    ),
    'hours' => 
    array (
      'dbtype' => 'float',
      'attributes' => 'unsigned',
      'phptype' => 'float',
      'null' => true,
    ),
    'anniversary' => 
    array (
      'dbtype' => 'tinyint',
      'precision' => '3',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => true,
    ),
    'flag' => 
    array (
      'dbtype' => 'tinyint',
      'precision' => '1',
      'phptype' => 'integer',
      'attributes' => 'unsigned',
      'null' => false,
      'default' => 1,
    ),
    'date_created' => 
    array (
      'dbtype' => 'date',
      'phptype' => 'date',
      'null' => false,
    ),
    'last_modified' => 
    array (
      'dbtype' => 'timestamp',
      'phptype' => 'timestamp',
      'null' => false,
      'default' => 'CURRENT_TIMESTAMP',
      'extra' => 'on update current_timestamp',
    ),
  ),
  'aggregates' => 
  array (
    'Student' => 
    array (
      'class' => 'scModUser',
      'local' => 'student_id',
      'foreign' => 'id',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
    'CertificateTpl' => 
    array (
      'class' => 'scCertificateTpl',
      'local' => 'certificate_tpl_id',
      'foreign' => 'id',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
  ),
);
