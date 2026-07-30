/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview XML toolbox embedded into a JavaScript text string.
 */
'use strict';

/** Create a namespace for the application. */
var Ardublockly = Ardublockly || {};

Ardublockly.TOOLBOX_XML =
'<xml>' +
'  <sep></sep>' +
'  <category id="catLogic" name="Logic">' +
'    <block type="controls_if"></block>' +
'    <block type="logic_compare"></block>' +
'    <block type="logic_operation"></block>' +
'    <block type="logic_negate"></block>' +
'    <block type="logic_boolean"></block>' +
'    <block type="logic_null"></block>' +
'    <block type="logic_ternary"></block>' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catLoops" name="Loops">' +
'    <block type="controls_repeat_ext">' +
'      <value name="TIMES">' +
'        <block type="math_number">' +
'          <field name="NUM">10</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'    <block type="controls_whileUntil"></block>' +
'    <block type="controls_dowhileUntil"></block>' +
'    <block type="controls_for">' +
'      <value name="FROM">' +
'        <block type="math_number">' +
'          <field name="NUM">1</field>' +
'        </block>' +
'      </value>' +
'      <value name="TO">' +
'        <block type="math_number">' +
'          <field name="NUM">10</field>' +
'        </block>' +
'      </value>' +
'      <value name="BY">' +
'        <block type="math_number">' +
'          <field name="NUM">1</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'    <block type="controls_flow_statements"></block>' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catMath" name="Math">' +
'    <block type="math_number"></block>' +
'    <block type="math_arithmetic"></block>' +
'    <block type="math_inc_decrement_exp"></block>' +
'    <block type="math_single"></block>' +
'    <block type="math_trig"></block>' +
'    <block type="math_constant"></block>' +
'    <block type="math_number_property"></block>' +
'    <block type="math_change">' +
'      <value name="DELTA">' +
'        <block type="math_number">' +
'          <field name="NUM">1</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'    <block type="math_round"></block>' +
'    <block type="math_modulo"></block>' +
'    <block type="math_constrain">' +
'      <value name="LOW">' +
'        <block type="math_number">' +
'          <field name="NUM">0</field>' +
'        </block>' +
'      </value>' +
'      <value name="HIGH">' +
'        <block type="math_number">' +
'          <field name="NUM">255</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'    <block type="math_random_int">' +
'      <value name="FROM">' +
'        <block type="math_number">' +
'          <field name="NUM">1</field>' +
'        </block>' +
'      </value>' +
'      <value name="TO">' +
'        <block type="math_number">' +
'          <field name="NUM">100</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'    <block type="math_random_float"></block>' +
'    <block type="base_map"></block>' +
'    <block type="base_map2">' +
'      <value name="value">' +
'        <block type="math_number">' +
'             <field name="NUM">0</field> ' +
'        </block>  ' +
'      </value>  ' +
'      <value name="fromLow">  ' +
'        <block type="math_number">  ' +
'             <field name="NUM">0</field> ' +
'        </block>  ' +
'      </value>      ' +
'      <value name="fromHigh">' +
'        <block type="math_number">  ' +
'             <field name="NUM">1023</field> ' +
'        </block>     ' +
'      </value>  ' +
'      <value name="toLow">   ' +
'        <block type="math_number">  ' +
'             <field name="NUM">0</field>  ' +
'        </block>   ' +
'      </value>     ' +
'      <value name="toHigh">      ' +
'        <block type="math_number">     ' +
'             <field name="NUM">255</field>     ' +
'        </block>        ' +
'      </value>    ' +
'    </block>     ' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catText" name="Text">' +
'    <block type="text"></block>' +
'    <block type="text_char"></block>' +
'    <block type="text_join"></block>' +
'    <block type="text_append">' +
'      <value name="TEXT">' +
'        <block type="text"></block>' +
'      </value>' +
'    </block>' +
'    <block type="text_length"></block>' +
'    <block type="text_toint"></block>' +
'    <block type="text_tofloat"></block>' +
'    <block type="text_isEmpty"></block>' +
//'    <!--block type="text_trim"></block Need to update block -->' +
//'    <!--block type="text_print"></block Part of the serial comms -->' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catVariables" name="Variables">' +
'    <block type="variables_initial">' +
'      <field name="VAR_INITIAL_TYPE">NUMBER</field>' +
'    </block>' +
'    <block type="variables_const">' +
'      <field name="VAR_CONST_TYPE">NUMBER</field>' +
'      <value name="VALUE">' +
'        <block type="math_number">' +
'          <field name="NUM">1</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'    <block type="variables_get"></block>' +
'    <block type="variables_set"></block>' +
'    <block type="variables_set">' +
'      <value name="VALUE">' +
'        <block type="variables_set_type"></block>' +
'      </value>' +
'    </block>' +
'    <block type="variables_set_type"></block>' +
'    <block type="variables_auto_type"></block>' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catFunctions" name="Functions" custom="PROCEDURE"></category>' +
'  <sep></sep>' +
'  <category id="catInputOutput" name="Input/Output">' +
'    <block type="io_digitalwrite">' +
'      <value name="PIN">' +
'        <block type="io_digitalpin"></block>' +
'      </value>' +
'    </block>' +
'    <block type="io_digitalread">'+
'      <value name="PIN">' +
'        <block type="io_digitalpin"></block>' +
'      </value>' +
'    </block>' +
'    <block type="io_analogwrite">' +
'      <value name="PIN">' +
'        <block type="io_pwmpin"></block>' +
'      </value>' +
'    </block>' +
'    <block type="io_analogread">' + 
'      <value name="PIN">' +
'        <block type="io_analogpin"></block>' +
'      </value>' +
'    </block>' +
'    <block type="io_highlow"></block>' +
'    <block type="io_digitalpin"></block>' +
'    <block type="io_analogpin"></block>' +
'    <block type="io_pwmpin"></block>' +
'    <block type="io_builtin_led">' +
'      <value name="STATE">' +
'        <block type="io_highlow"></block>' +
'      </value>' +
'    </block>' +  
'    <block type="io_pulsein">' +
'      <value name="PULSETYPE">' +
'        <shadow type="io_highlow"></shadow>' +
'      </value>' +
'      <value name="PULSEPIN">' +
'        <block type="io_digitalpin"></block>' +
'      </value>' +
'    </block>' +
'    <block type="io_pulsetimeout">' +
'      <value name="PULSEPIN">' +
'        <block type="io_digitalpin"></block>' +
'      </value>' + 
'      <value name="PULSETYPE">' +
'        <shadow type="io_highlow"></shadow>' +
'      </value>' +
'      <value name="TIMEOUT">' +
'        <shadow type="math_number">' +
'          <field name="NUM">100</field>' +
'        </shadow>' +
'      </value>'+
'    </block>' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catTime" name="Time">' +
'    <block type="time_delay">' +
'      <value name="DELAY_TIME_MILI">' +
'        <block type="math_number">' +
'          <field name="NUM">1000</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'    <block type="time_delaymicros">' +
'      <value name="DELAY_TIME_MICRO">' +
'        <block type="math_number">' +
'          <field name="NUM">100</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'    <block type="time_millis"></block>' +
'    <block type="time_micros"></block>' +
'    <block type="infinite_loop"></block>' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catAudio" name="Audio">' +
'    <block type="io_tone">' +
'      <value name="TONEPIN">' +
'        <block type="io_digitalpin"></block>' +
'      </value>' +
'      <value name="FREQUENCY">' +
'        <shadow type="math_number">' +
'          <field name="NUM">220</field>' +
'        </shadow>' +
'      </value>' +
'    </block>' +
'    <block type="io_tonedure">' +
'      <value name="TONEPIN">' +
'        <block type="io_digitalpin"></block>' +
'      </value>' +
'      <value name="FREQUENCY">' +
'        <shadow type="math_number">' +
'          <field name="NUM">220</field>' +
'        </shadow>' +
'      </value>' +
'      <value name="DURATION">' +
'        <shadow type="math_number">' +
'          <field name="NUM">300</field>' +
'        </shadow>' +
'      </value>' +
'    </block>' +
'    <block type="io_notone">' +
'      <value name="TONEPIN">' +
'        <block type="io_digitalpin"></block>' +
'      </value>' +
'    </block>' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catMotors" name="Motors">' +
'    <block type="servo_write">' +
'      <value name="SERVO_ANGLE">' +
'        <block type="math_number">' +
'          <field name="NUM">90</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'    <block type="servo_read"></block>' +
'    <block type="stepper_config">' +
'      <field name="STEPPER_NUMBER_OF_PINS">2</field>' +
'      <field name="STEPPER_PIN1">1</field>' +
'      <field name="STEPPER_PIN2">2</field>' +
'      <value name="STEPPER_STEPS">' +
'        <block type="math_number">' +
'          <field name="NUM">100</field>' +
'        </block>' +
'      </value>' +
'      <value name="STEPPER_SPEED">' +
'        <block type="math_number">' +
'          <field name="NUM">10</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'    <block type="stepper_step">' +
'      <value name="STEPPER_STEPS">' +
'        <block type="math_number">' +
'          <field name="NUM">10</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catSmartCar" name="Smart Car">' +
'    <block type="smartcar_definepins">'+
'      <value name="M11">' +
'        <block type="math_number">' +
'          <field name="NUM">5</field>' +
'        </block>' +
'      </value>' +
'      <value name="M12">' +
'        <block type="math_number">' +
'          <field name="NUM">6</field>' +
'        </block>' +
'      </value>' +
'      <value name="M21">' +
'        <block type="math_number">' +
'          <field name="NUM">9</field>' +
'        </block>' +
'      </value>' +
'      <value name="M22">' +
'        <block type="math_number">' +
'          <field name="NUM">10</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'    <block type="smartcar_l298n">'+
'      <value name="IN1">' +
'        <block type="math_number">' +
'          <field name="NUM">0</field>' +
'        </block>' +
'      </value>' +
'      <value name="IN2">' +
'        <block type="math_number">' +
'          <field name="NUM">255</field>' +
'        </block>' +
'      </value>' +
'      <value name="IN3">' +
'        <block type="math_number">' +
'          <field name="NUM">255</field>' +
'        </block>' +
'      </value>' +
'      <value name="IN4">' +
'        <block type="math_number">' +
'          <field name="NUM">0</field>' +
'        </block>' +
'      </value>' +
'	   </block>' +
'    <block type="smartcar_ultrasound_definepins">'+
'	   </block>' +
'    <block type="smartcar_ultrasound">'+
'	   </block>' +
'	</category>'+
'  <sep></sep>' +
'  <category id="catComms" name="Comms">' +
'    <block type="serial_setup"></block>' +
'    <block type="serial_print">' +
'      <value name="CONTENT">' +
'        <block type="text"></block>' +
'      </value>' +
'    </block>' +
'    <block type="serial_available"></block>' +
'    <block type="readserial"></block>' +
'    <block type="parseserial"></block>' +
'    <block type="text_prompt_ext">' +
'      <value name="TEXT">' +
'        <block type="text"></block>' +
'      </value>' +
'    </block>' +
'    <block type="ss_setup">' +
'      <value name="RX">' +
'        <block type="math_number">' +
'          <field name="NUM">2</field>' +
'        </block>' +
'      </value>' +
'      <value name="TX">' +
'        <block type="math_number">' +
'          <field name="NUM">3</field>' +
'        </block>' +
'      </value>' +
'	   </block>' +
'    <block type="ss_available"></block>' +
'    <block type="readsoftwareserial"></block>' +
'    <block type="ss_print">'+
'      <value name="CONTENT">' +
'        <block type="text"></block>' +
'      </value>' +
'	 </block>' +
'    <block type="spi_setup"></block>' +
'    <block type="spi_transfer"></block>' +
'    <block type="spi_transfer_return"></block>' +
'  </category>' +
'</xml>';
