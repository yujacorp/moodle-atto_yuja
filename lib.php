<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * YuJa Plugin for Moodle Atto
 * @package    atto_yuja
 * @subpackage yuja
 * @copyright  2016 YuJa
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die('Must access from moodle');

global $CFG;
require_once($CFG->dirroot . '/local/yuja/lib.php');
require_once($CFG->dirroot . '/local/yuja/classes/local_yuja/yuja_client.class.php');

/**
 * Initialise the strings for use in this plugin
 */
function atto_yuja_strings_for_js() {

    global $PAGE;

    $PAGE->requires->strings_for_js(
        array(
            'notready',
            'phperror',
            'loadingerror'
        ), 'atto_yuja');
}

/**
 * Return the js params required for this module.
 * @return array of additional params to pass to javascript init function.
 */
function atto_yuja_params_for_js() {

    $yujaclient = new yuja_client();
    $params = $yujaclient->get_texteditor_params();

    return $params;
}
