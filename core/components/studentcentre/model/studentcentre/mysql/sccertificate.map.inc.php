<?php
$xpdo_meta_map['scCertificate']= array (
  'package' => 'studentcentre',
  'version' => '1.1',
  'table' => 'certificates',
  'extends' => 'xPDOSimpleObject',
  'fields' => 
  array (
    'student_id' => NULL,
    'level_id' => NULL,
    'certificate_type_id' => NULL,
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
    'level_id' => 
    array (
      'dbtype' => 'tinyint',
      'precision' => '3',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => true,
    ),
    'certificate_type_id' => 
    array (
      'dbtype' => 'tinyint',
      'precision' => '3',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => false,
    ),
    'hours' => 
    array (
      'dbtype' => 'decimal',
      'precision' => '8,2',
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
    'CertificateType' => 
    array (
      'class' => 'scCertificateType',
      'local' => 'certificate_type_id',
      'foreign' => 'id',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
    'ClassLevel' => 
    array (
      'class' => 'scClassLevel',
      'local' => 'level_id',
      'foreign' => 'id',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
  ),
);
