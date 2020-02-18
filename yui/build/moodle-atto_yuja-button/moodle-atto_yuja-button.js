YUI.add('moodle-atto_yuja-button', function (Y, NAME) {

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
 * YuJa Plugin for Moodle Atto button implementation
 * @package    atto_yuja
 * @subpackage yuja
 * @copyright  2016 YuJa
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @module moodle-atto_yuja-button
 */
 /**
     * Create a collapseable, stackable toast message by:
     *      1. creating a container to hold toast messages
     *      2. appending to that toast message container
     * To avoid scope leak and encourage modularity, the helper functions are localized in the definition of this function
     * Goal is to keep this toast library simple as libraries would add too much overhead
     * @param {*} title
     * @param {*} message
     */
    function showAlertMessage(title, message) {
        // ---------constants and definitions----------
        var $ = $ || jQuery;
        var ID_TOAST_CONTAINER = "toastMessageContainer";
        var ID_TOAST_STYLES = "yujaToastMessageStyles";
        var CLASS_YUJA_TOASTS = "yuja-toast-message";
        var TOAST_MESSAGE_LIFETIME_MS = 3000;
        var TOAST_FADE_OUT_DURATION_MS = 1000;
        // Reuse the class as the ID for simplicity
        var ID_YUJA_TOAST = CLASS_YUJA_TOASTS;

        /**
         * Preprocess the ID in case suffixes/prefixes need to be added
         * @param id
         */
        function helperIdToCssSelector(id) {
            return "#" + (id || "");
        }

        /**
         * JQuery helper to convert
         * @param id
         * @returns {boolean}
         */
        function helperIDExists(id) {
            return $(helperIdToCssSelector(id)).length === 1;
        }

        /**
         * Create empty toast message container
         */
        function createSingletonToastMessageContainer() {
            if (!helperIDExists(ID_TOAST_CONTAINER)) {
                var $idToastContainer = $("<div>")
                    .attr("id", ID_TOAST_CONTAINER);
                $(document.body).append($idToastContainer);
            }
        }

        /**
         * Create toast message styles
         */        
        function createSingletonToastMessageStyles() {
            if (!helperIDExists(ID_TOAST_STYLES)) {
                var styles = [];
                styles.push("" +
                    "#toastMessageContainer{\n" +
                    // Center the toast message container
                    "    position: absolute;\n" +
                    "    left: 0;\n" +
                    "    right: 0;\n" +
                    "    margin: 0 auto;\n" +
                    // Ensure it is in front of everything
                    "    z-index: 9999;\n" +
                    // Set the width to match YuJa
                    "    width: 420px;\n" +
                    // Offset the top bar
                    "    top: 50px;\n" +
                    "}\n"
                );
                styles.push("" +
                    ".yuja-toast-message {\n" +
                    // Star logo positioning
                    "    background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAARkSURBVEiJhZZNbFRVFMd/577XDwTiQg3YvuEjRYMLo6nsWAmRGJB2Os82CExbMVExUVGhdWEMLEzAamtiNLoQ6BRYNDMtI9YFiZJA3GHEGKMxpLbMTGvCwg+0rZ1597h4b0o/pniSSW7u+d///5zzv7lvhDtEarBunTqmWWAXwgYUDwAhjzImyhdF12YPxCdyy3FIpc3+Qa9eHN4GngOcOxUBWJBMYJyuZ1vGxv5XYCAdi6voALAKmAUdRsx5KQXf6UyQB5Bax8M4jdYQF9U4UA3cEmR/0s99vqzAQNp7VYVewAikDaZ7n39j9E7lnx6ONThWexRaAKtwqMPPf7hEIKo8A6iqdHU8netd0t2Q1w2QTORPLM71p70jIhwPSaWl3IkAnMnUexb5KRyLHG73c+8vJa9/RFWuAYjoo8lE4fvFmFTG6wJOALeqXNn8THNuwgBYkWPAKoF0JfIwzGvllSqHKiHa/fy7wHlgdbGoRwEkNVi3DseMAoGDeajSzAcy6+9Xgl8BN9oqCc7GpD8+uQQ76G1Shx8Bx6Ab3OieO6Dpff6N0VODG9Y6bmm36G1/lNLjIDVAJtrylVLvQMa7NIcRNCi5F5JtY9dTmVgWtNWKaXYFdgKImiyA6wbHVenQBXWFWhbbB2AwPsgehT1zEAXXDfqBThHNqtKK6k4X2BQe0qsAgXLSQCtwF/APyjkERfTnzsTENwCpofrXUdms4XXeG2GnAuVkOEB7FceA0GCAtQBV9t9JgE4/d1msPAn8DazE4Iz+kD/Ynij0zZmZKPQlE/kXBS2WyY3Vpk4/dxmghmIh6qreLDYJINmau4JoMzCFcqDh4djHS8wc8j4BOQhMKfrU/tbCV+Xc7OzdJhKwBpgAmHar6+YTtCcKXxurTSFOX+gfqr+nnDt3oe5e4HkAY7Wpwy9cmn+2WDtVF1k34QKjwIPGmseAX+YD1ejvocE6tqJU+GNgKHYYwJ3O9ZUcbxxYH2IWhsFsiZajRpQRAGuILwaqmh3hSq7NON5FVe1R1Z4Zx7uIci1MmSeWCAjNYecyYoquzQKBqMZPD8caFiCF8uFmYBvwW/TbhhCOT9kx/8jZtPeAhvgSgWbNgfhETuEUUO1Y7SkDU6k1K4Gtc1LCFcFpFJxGhCvcfii3RlhUkQB6gCpBPutoyxdCtwOOArcUWvrT3hEAVlVtAWrCWUnf9M0125P++GTSH5+cvrlmOyrla1sTYRnIeN2E4/kTzDGY/1xnYk2KDkeVvOnM1H5qV8z0InzZnsgPLZ4zQGrIS6DsrA2q35gxswcR3glJtSnpF0YWCAD0Z7yXBT4IfWKYgK5kW/56JfL5My+JvidIE2AReaU9kfuonF/yyUyl63Yj5iywGiiCnBfRbMnab1faYh5gxnVjgtOIEo8MrUL5S0T3litfVgDg5ODa+1zjvoXwEref6OXCAmcFp7vS811RoBxnMvWeFdMsVnepsBGivy2QB0YVGSHQbEdbvrAcx3+/BcsBIawLQwAAAABJRU5ErkJggg==\") !important;\n" +
                    "    background-repeat: no-repeat;\n" +
                    "    background-position: 15px center;\n" +
                    "    background-color: white;\n" +
                    "    padding: 15px;\n" +
                    // Round borders
                    "    -moz-border-radius: 3px 3px 3px 3px;\n" +
                    "    -webkit-border-radius: 3px 3px 3px 3px;\n" +
                    "    border-radius: 3px 3px 3px 3px;\n" +
                    // Add a drop/background hsadow
                    "    -moz-box-shadow: 0 0 12px #999999;\n" +
                    "    -webkit-box-shadow: 0 0 12px #999999;\n" +
                    "    box-shadow: 0 0 12px #999999;\n" +
                    "    opacity: 0.95;\n" +
                    "    -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=80);\n" +
                    "    filter: alpha(opacity=80);\n" +
                    // Ensure the progress bars align to this reference point
                    "    position: relative;\n" +
                    // Indicate it is killable with a click
                    "    cursor: pointer;\n" +
                    "}")
                styles.push("" +
                    ".message-container {\n" +
                    // Offset the star above
                    "    padding-left: 25px;\n" +
                    "}"
                );
                styles.push("" +
                    ".message-content {\n" +
                    // Space for the side bar
                    "    padding-left: 15px;\n" +
                    "}"
                );
                styles.push("" +
                    ".header {\n" +
                    "    font-weight: bold;\n" +
                    "    font-size: 15px;\n" +
                    "    color: #A2AD1C;\n" +
                    "}\n"
                );
                styles.push("" +
                    ".left-side-border{\n" +
                    // Add the vertical rainbow bar
                    "    content: url(\"data:image/png;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAAAAD/4QMxaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjU1MTM3NzE3QkE4MzExRTc5RDFBQ0QzQTA5NDIwQkI2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjU1MTM3NzE4QkE4MzExRTc5RDFBQ0QzQTA5NDIwQkI2Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTUxMzc3MTVCQTgzMTFFNzlEMUFDRDNBMDk0MjBCQjYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NTUxMzc3MTZCQTgzMTFFNzlEMUFDRDNBMDk0MjBCQjYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAAbGhopHSlBJiZBQi8vL0JHPz4+P0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHAR0pKTQmND8oKD9HPzU/R0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0f/wAARCABKAAUDASIAAhEBAxEB/8QAZwABAAMBAAAAAAAAAAAAAAAAAAMEBQIBAQEBAQAAAAAAAAAAAAAAAAQCAwUQAQACAQUBAAAAAAAAAAAAAAABYRORoQISUhQRAAECBQUBAAAAAAAAAAAAAAABEyFhAhJS8JGh4SIU/9oADAMBAAIRAxEAPwDUGbk4+o1gR8qZcdhXqsdbGZ0kXfl50F3Dm0ma+KaEmSByHq5GsSlnrcUM1CmxNqEHao3HIZAn1M//2Q==\");\n" +
                    "    width: 5px;\n" +
                    // Ensure it is the size of the parent
                    "    height: 100%;\n" +
                    // Left align it
                    "    position: absolute;\n" +
                    "    top: 0;\n" +
                    "    left: 0;" +
                    "}\n"
                );
                styles.push("" +
                    ".toast-lifetime-progress {\n" +
                    "    position: absolute;\n" +
                    "    top: 0;\n" +
                    "    left: 0;\n" +
                    "    width: 0;\n" +
                    "    transition: width 3s, background-color 3s;\n" +
                    "    height: 5px;\n" +
                    "    background-color: #73ff04;\n" +
                    "}"
                );
                styles.push("" +
                    ".toast-lifetime-progress.start-animation {\n" +
                    "    background-color: #ff0005;\n" +
                    "    width: 100%;\n" +
                    "}"
                )
                var $toastMesageStyles = $("<style>")
                    .attr("id",ID_TOAST_STYLES)
                    // Add the styles as an array, making it inline text and thus apply to the browser
                    .append(styles)
                $(document.head).append($toastMesageStyles);
            }
        }

        /**
         * Toast messages are stackable and each needs to be unique. The uniqueness can be guaranteed with the jquery instance of classes count + 1
         * @returns {*}
         */
        function getNextAvailableToastMessageUniqueID() {
            var nextUniqueId = $("." + CLASS_YUJA_TOASTS).length + 1;
            return ID_YUJA_TOAST + "-" + nextUniqueId;
        }

        /**
         * Helper to construct message
         */
        function helperConstructMessage() {
            var $leftSideBar = $("<div>")
                .attr("class", "left-side-border");
            var $progressBar = $("<div>")
                .attr("class", "toast-lifetime-progress");
            var $header = $("<div>")
                .attr("class", "message-content header")
                .append(title);
            var $body = $("<div>")
                .attr("class", "message-content body")
                .append(message);

            return $("<div>")
                .attr("class", "message-container")
                .append($progressBar)
                .append($leftSideBar)
                .append($header)
                .append($body);
        }

        /**
         * Hide the toast message
         * @param {*} $toast 
         */
        function killToastMessage($toast) {
            return function() {
                if ($toast.length === 1) {
                    // Only hide the toast messages since the other ones may reuse the ID and that
                    // will cause old-style reuse (id 1 -> gets deleted -> new toast takes id->1 progress)
                    $toast
                        .css({display: "none"});
                }
            }
        }

        /**
         * Fade out toast message before hiding it
         * @param {*} newToastId 
         */
        function fadeAndKillToastMessage(newToastId) {
            return function() {
                var $toast = $(helperIdToCssSelector(newToastId));
                if ($toast.length === 1) {
                    // Fade out the toast
                    $toast
                        .css({
                            "transition": "opacity " + TOAST_FADE_OUT_DURATION_MS + "ms",
                            opacity: "0"
                        });
                    // Delete it
                    setTimeout(killToastMessage($toast), TOAST_FADE_OUT_DURATION_MS);
                }
            }
        }

        /**
         * Create a toast message
         */
        function createToastMessage() {
            createSingletonToastMessageContainer();
            createSingletonToastMessageStyles();
            var newToastId = getNextAvailableToastMessageUniqueID();
            var $toastContainer = $(helperIdToCssSelector(ID_TOAST_CONTAINER));
            if ($toastContainer.length === 1) {
                $toastContainer
                    .append(
                        $("<div>")
                            .attr("id", newToastId)
                            // Toast class adds the progress bar above the message
                            .attr("class", CLASS_YUJA_TOASTS)
                            .on("click", function(e) {
                                killToastMessage($(helperIdToCssSelector(newToastId)))
                            })
                            .append(helperConstructMessage())
                    );
                // Start the animations on  delay
                setTimeout(function() {
                    if ($toastContainer.length === 1) {
                        $toastContainer
                            .find(helperIdToCssSelector(newToastId))
                            .find(".toast-lifetime-progress")
                            .addClass("start-animation");
                    }
                }, 25);
                // Kill the toast message in X seconds
                setTimeout(fadeAndKillToastMessage(newToastId), TOAST_MESSAGE_LIFETIME_MS);
            }
        }
        // ---------end constants and definitions----------
        createToastMessage();
    }

/**
 * Atto text editor yuja plugin.
 * @namespace M.atto_yuja
 * @class button
 * @extends M.editor_atto.EditorPlugin
 */
Y.namespace('M.atto_yuja').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {

    /** The YuJa Media Selector object */
    _mediaSelector: null,
    /** The parameters for the media selector */
    _params: {},
    /**
     * Init
     */
    initializer: function() {

        var params = this._params;
        params.videosUrl = this.get('yujaVideosUrl');
        params.jsUrl = this.get('yujaJsUrl');
        params.error = this.get('yujaError');


            /**
             * This request written without JQuery for backwards compatability with Moodle < 2.9
             */
            if (window.XMLHttpRequest) {
                params.xmlhttp = new XMLHttpRequest();  // Code for IE7+, Firefox, Chrome, Opera, Safari
            } else {
                params.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); // Code for IE6, IE5
            }

            // Delay the connection to YuJa until the button is clicked
            params.isYujaConnected = false;
            // If the button is clicked, execute a callback that is just the mce command
            params.yujaConnectedCallback = null;
            params.xmlhttp.onreadystatechange = function() {
                if (params.xmlhttp.readyState == XMLHttpRequest.DONE) {
                    if (params.xmlhttp.status == 200) {
                        try {
                            params.videos = JSON.parse(params.xmlhttp.responseText);
                        } catch (err) {
                            params.videos = {success: false};
                        }
                    } else {
                        params.videos = {success: false};
                    }
                    if (typeof params.yujaConnectedCallback === "function") {
                        // Call the mceYuja function
                        params.yujaConnectedCallback();
                        params.yujaConnectedCallback = null;
                    }
                }
            };


        // Add the YuJa button to Atto
        this.addButton({
            icon: 'icon',
            iconComponent: 'atto_yuja',
            callback: this._openMediaSelector
        });
    },

    /**
     * Opens the YuJa Media Selector
     */
    _openMediaSelector: function() {
        var params = this._params;

        var error = false;
        if (!params.isYujaConnected) {
            params.isYujaConnected = true;
            // Mount the script that will load the common yuja variables
            this._loadScript(params.jsUrl);
            // Load the videos
            params.xmlhttp.open("GET", params.videosUrl, true);
            params.xmlhttp.send();
            error = true;
            // Call this function again once complete
            params.yujaConnectedCallback = this._openMediaSelector.bind(this);

        } else if (params.error !== undefined) {
            showAlertMessage("Error", M.util.get_string('phperror', 'atto_yuja'));
            // alert(ed.getLang('yuja.phperror'));
            error = true;
        } else if (params.videos !== undefined && params.videos.success === false) {
                // alert(ed.getLang('yuja.loadingerror'));
                showAlertMessage("Loading...", M.util.get_string('loadingerror', 'atto_yuja'));
                error = true;
        } else if (params.videos === undefined || (typeof yuja === "undefined" || yuja === undefined)) {
                // alert(ed.getLang('yuja.notready'));
                showAlertMessage("Loading...", M.util.get_string('notready', 'atto_yuja'));
                error = true;
        }

        if (error) {
            return;
        }

        if (this._mediaSelector === null) {
            this._mediaSelector = yuja.createMediaSelector(params.videos.data);
        }

        this._mediaSelector.onSelect(Y.bind(this._insertContent, this));
        this._mediaSelector.open();
    },

    /**
     * Inserts the embed string returned by YuJa Media Selector into the editor
     * @param {*} embedString 
     */
    _insertContent: function(embedString) {
        this.editor.focus();
        this.get('host').insertContentAtFocusPoint(embedString);
        this.markUpdated();
    },

    /**
     * Load a script url and append to the document.body
     * @param {string} url
     */
    _loadScript: function(url) {
        var script = document.createElement('script');
        script.src = url;
        (document.body || document.head || document.documentElement).appendChild(script);
    }

}, {ATTRS: {
        yujaVideosUrl: {
            value: undefined
        },
        yujaJsUrl: {
            value: undefined
        },
        yujaError: {
            value: undefined
        }
    }
});


}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
