$.fn.wysiwyg = function(options){
	// based on the example @ http://stackoverflow.com/questions/5281438/how-to-create-a-text-editor-in-jquery
	// icons from http://www.cirkuit.net/projects/tinymce/cirkuitSkin/
	var settings = $.extend({
		lng_inserturl : 'Insert URL',
		lng_insertimage : 'Insert Image',
		width : "400",
		height : "200px",
		colors : ['#cccccc', '#c3c3c3', '#dddddd'],
		fontsize : ['1','2','3','4','5','6','7'],
		fonts : ["Arial","Comic Sans MS","Courier New","Monotype Corsiva","Tahoma","Times"],
		buttons: [
			'italic', 'bold', 'underline', 'strikeThrough',
			'spacer','heading', 'fonts', 'fontSize',
			'spacer','removeFormat',
			'spacer', 'insertImage', 'createlink','unlink',
			'row', 'backColor', 'forecolor',
			'spacer', 'justifyCenter', 'justifyFull', 'justifyLeft', 'justifyRight',
			'spacer', 'insertHorizontalRule', 'insertOrderedList', 'insertUnorderedList',
			'spacer','indent', 'outdent', 'superscript', 'subscript'
		]
	}, options);

	return this.each(function(){

		if($(this).css('width')) settings.width=$(this).css('width');
		if($(this).css('height')) settings.height=$(this).css('height');

		var _id=$(this).attr('id');
		var $this = $(this).hide();

		// wrap everything in a widget container
		var _container = $("<div/>",{
			class: 'ui-wysiwyg ui-widget ui-widget-content ui-corner-top ',
			css : { width : settings.width , height : settings.height }
		}).resizable();
       $this.after(_container); 

		// write the iframe to be editable
		var editor = $("<iframe/>",{
			css : { height: '100%', width: '100%' },
			frameborder : "0",
			class: _id+'-wysiwyg-content ui-wysiwyg-content ',
		}).appendTo(_container).get(0);

		// define the editor and make it writable, add default values of the textarea
		editor.contentWindow.document.open();
		if($(this).val()) editor.contentWindow.document.write($(this).val());
		editor.contentWindow.document.close();
		editor.contentWindow.document.designMode="on";
		fnDisableCSS();

		// update original textarea when contents change
		$('.'+_id+'-wysiwyg-content').contents().bind("keyup keydown keypress focus blur", function() {
			$('#'+_id).val($('.ui-wysiwyg-content').contents().find('body').html());
		})

		// set buttons to focus/hover state when elements are selected
		$('.'+_id+'-wysiwyg-content').contents().bind('click focus blur',function(event){fnSetButtons(event)});

		// append menu container to overall container
		var wysiwyg_menu = $("<div/>",{
			"class" : "ui-widget ui-widget-content ui-widget-header ui-corner-bottom  ui-wysiwyg-menu",
			css : { width : '100%' }
		}).appendTo(_container);

		// append button container to menu container
		var _button_panel = $("<div/>",{
			"class" : "ui-wysiwyg-menu-wrap",
			css : { width : '100%' }
		}).appendTo(wysiwyg_menu);

		// create button wrappers for rows/spacers
		var _i=0;
		var _buttonwrap=$('<div/>', {class: 'ui-wysiwyg-set'+_i+' ui-wysiwyg-left'});

		// loop buttons and insert to containers
		$.each(settings.buttons,function(i,v){
			var _options=fnGetButton(v);

			if(v == 'spacer' || v == 'row'){
				_i++;
				var _class='ui-wysiwyg-set'+_i+' ui-wysiwyg-left';
				if(v == 'row') _class=_class+' ui-wysiwyg-row';
				_buttonwrap.buttonset().appendTo(_button_panel);
				_buttonwrap=$('<div/>', {class: _class});
			} else if(v == 'backColor'){
				var _fontlink=$("<a/>",{
					href : "#",
					text : _options.text,
					class : 'ui-wysiwyg-dd-fntbgcbtn  ui-wysiwyg-btn ui-wysiwyg-btn-'+v,
					id: 'ui-wysiwyg-fntbtn-'+_options.tag,
					click : function(){$(this).parent().find('.ui-wysiwyg-fontbgcdropdown').slideToggle('fast')}
				}).button(_options.icon).appendTo(_buttonwrap);

				var _fontmenu=$('<ul/>').html('');
				$.each(settings.colors,function(i,v){
					$('<li/>', {click: function(){$('.ui-wysiwyg-dd-fntbgcbtn span').css('background-color', v);fnRunCommand('backColor', v)}}).html('<div style="background:'+v+'" class="ui-wysiwyg-swatch"></div>').appendTo(_fontmenu);
				});

				$('<div/>',{
					class : 'ui-wysiwyg-dropdown ui-wysiwyg-fontbgcdropdown ui-widget ui-widget-content ui-corner-all',
					style: ' margin: 0px'
				}).append(_fontmenu).appendTo(_buttonwrap);

			} else if(v == 'forecolor'){
				var _fontlink=$("<a/>",{
					href : "#",
					text : _options.text,
					class : 'ui-wysiwyg-dd-fntclbtn  ui-wysiwyg-btn ui-wysiwyg-btn-'+v,
					id: 'ui-wysiwyg-fntbtn-'+_options.tag,
					click : function(){$(this).parent().find('.ui-wysiwyg-fontcldropdown').slideToggle('fast')}
				}).button(_options.icon).appendTo(_buttonwrap);

				var _fontmenu=$('<ul/>').html('');
				$.each(settings.colors,function(i,v){
					$('<li/>', {click: function(){$('.ui-wysiwyg-dd-fntclbtn span').css('background-color', v);fnRunCommand('forecolor', v)}}).html('<div style="background:'+v+'" class="ui-wysiwyg-swatch"></div>').appendTo(_fontmenu);
				});

				$('<div/>',{
					class : 'ui-wysiwyg-dropdown ui-wysiwyg-fontcldropdown ui-widget ui-widget-content ui-corner-all',
					style: ' margin: 0px'
				}).append(_fontmenu).appendTo(_buttonwrap);


			} else if(v == 'fontSize'){
				var _fontlink=$("<a/>",{
					href : "#",
					text : _options.text,
					class : 'ui-wysiwyg-dd-fntszbtn  ui-wysiwyg-btn ui-wysiwyg-btn-'+v,
					id: 'ui-wysiwyg-fntbtn-'+_options.tag,
					click : function(){$(this).parent().find('.ui-wysiwyg-fontszdropdown').slideToggle('fast')}
				}).button(_options.icon).appendTo(_buttonwrap);

				var _fontmenu=$('<ul/>').html('');
				$.each(settings.fontsize,function(i,v){
					$('<li/>', {click: function(){$('.ui-wysiwyg-dd-fntszbtn span').text(v);fnRunCommand('fontSize', v)}}).html('<font size="'+v+'">'+v+'</font>').appendTo(_fontmenu);
				});

				$('<div/>',{
					class : 'ui-wysiwyg-dropdown ui-wysiwyg-fontszdropdown ui-widget ui-widget-content ui-corner-all',
					style: ' margin: 0px'
				}).append(_fontmenu).appendTo(_buttonwrap);
			} else if(v == 'fonts'){
				var _fontlink=$("<a/>",{
					href : "#",
					text : _options.text,
					class : 'ui-wysiwyg-dd-fntbtn  ui-wysiwyg-btn ui-wysiwyg-btn-'+v,
					id: 'ui-wysiwyg-fntbtn-'+_options.tag,
					click : function(){$(this).parent().find('.ui-wysiwyg-fontdropdown').slideToggle('fast')}
				}).button(_options.icon).appendTo(_buttonwrap);

				var _fontmenu=$('<ul/>').html('');
				$.each(settings.fonts,function(i,v){
					$('<li/>', {click: function(){$('.ui-wysiwyg-dd-fntbtn span').text(v);fnRunCommand('FontName', v)}}).html('<font face="'+v+'">'+v+'</font>').appendTo(_fontmenu);
				});

				$('<div/>',{
					class : 'ui-wysiwyg-dropdown ui-wysiwyg-fontdropdown ui-widget ui-widget-content ui-corner-all',
					style: ' margin: 0px'
				}).append(_fontmenu).appendTo(_buttonwrap);
			} else if(v == 'heading'){
				var _headmenu=$("<a/>",{
					href : "#",
					text : _options.text,
					class : 'ui-wysiwyg-dd-btn ui-wysiwyg-btn ui-wysiwyg-btn-'+v,
					id: 'ui-wysiwyg-btn-'+_options.tag,
					click : function(){$(this).parent().find('.ui-wysiwyg-hddropdown').slideToggle('fast')}
				}).button(_options.icon).appendTo(_buttonwrap);

				var _headermenu=$('<ul/>').html('');

				//TO-DO: make from array
				$('<li/>', {click: function(){$('.ui-wysiwyg-dd-btn span').text('Paragraph');fnRunCommand('formatBlock', '<p>')}}).html('Paragraph').appendTo(_headermenu);
				$('<li/>', {click: function(){$('.ui-wysiwyg-dd-btn span').text('Address');fnRunCommand('formatBlock', '<address>')}}).html('<address>Address</address>').appendTo(_headermenu);
				$('<li/>', {click: function(){$('.ui-wysiwyg-dd-btn span').text('Heading 1');fnRunCommand('formatBlock', '<h1>')}}).html('<h1>Heading 1</h1>').appendTo(_headermenu);
				$('<li/>', {click: function(){$('.ui-wysiwyg-dd-btn span').text('Heading 2');fnRunCommand('formatBlock', '<h2>')}}).html('<h2>Heading 2</h2>').appendTo(_headermenu);
				$('<li/>', {click: function(){$('.ui-wysiwyg-dd-btn span').text('Heading 3');fnRunCommand('formatBlock', '<h3>')}}).html('<h3>Heading 3</h3>').appendTo(_headermenu);
				$('<li/>', {click: function(){$('.ui-wysiwyg-dd-btn span').text('Heading 4');fnRunCommand('formatBlock', '<h4>')}}).html('<h4>Heading 4</h4>').appendTo(_headermenu);
				$('<li/>', {click: function(){$('.ui-wysiwyg-dd-btn span').text('Heading 5');fnRunCommand('formatBlock', '<h5>')}}).html('<h5>Heading 5</h5>').appendTo(_headermenu);
				$('<li/>', {click: function(){$('.ui-wysiwyg-dd-btn span').text('Heading 6');fnRunCommand('formatBlock', '<h6>')}}).html('<h6>Heading 6</h6>').appendTo(_headermenu);

				$('<div/>',{
					class : 'ui-wysiwyg-dropdown ui-wysiwyg-hddropdown ui-widget ui-widget-content ui-corner-all',
					style: 'font-size: 60%; margin: 0px'
				}).append(_headermenu).appendTo(_buttonwrap);
			} else {
				$("<a/>",{
					href : "#",
					text : _options.text,
					class : 'ui-wysiwyg-btn ui-wysiwyg-btn-'+v+' '+_options.class,
					id: 'ui-wysiwyg-btn-'+_options.tag,
					data : {
						commandName : v,
						class : _options.class
					},
					click : fnExecCommand 
				}).button(_options.icon).appendTo(_buttonwrap);
			}
		}); 
		_buttonwrap.buttonset().appendTo(_button_panel);

		// add a clear fix to clean up floating items
		_button_panel.append($('<div/>', { class: 'ui-helper-clearfix'}));
		
		// hide any drop down when clicked
		$(document).bind('click', function (e) {
			if (!$(e.target).parents().hasClass('ui-wysiwyg-dd-btn'))$('.ui-wysiwyg-hddropdown').slideUp();
			if (!$(e.target).parents().hasClass('ui-wysiwyg-dd-fntbtn'))$('.ui-wysiwyg-fontdropdown').slideUp();
			if (!$(e.target).parents().hasClass('ui-wysiwyg-dd-fntszbtn'))$('.ui-wysiwyg-fontszdropdown').slideUp();
			if (!$(e.target).parents().hasClass('ui-wysiwyg-dd-fntclbtn'))$('.ui-wysiwyg-fontcldropdown').slideUp();
			if (!$(e.target).parents().hasClass('ui-wysiwyg-dd-fntbgcbtn'))$('.ui-wysiwyg-fontbgcdropdown').slideUp();
		});

		// disable css modes
		function fnDisableCSS(){
			try {
                Editor.execCommand("styleWithCSS", 0, false);
            } catch (e) {
                try {
                    Editor.execCommand("useCSS", 0, true);
                } catch (e) {
                    try {
                        Editor.execCommand('styleWithCSS', false, false);
                    }
                    catch (e) {
                    }
                }
            }
		}
		
		// set button states if the editor has the tag
		function fnSetButtons(event){
			// reset dropdowns
			$('.ui-wysiwyg-dd-fntbtn span').text('Font');
			$('.ui-wysiwyg-dd-fntszbtn span').text('Font Size');
			$('.ui-wysiwyg-dd-fntclbtn').button({icons: { primary: "ui-wysiwyg-icon-fontc", secondary: "ui-icon-triangle-1-s"}, text: false});
			$('.ui-wysiwyg-dd-fntbgcbtn').button({icons: { primary: "ui-wysiwyg-icon-bgc", secondary: "ui-icon-triangle-1-s"}, text: false});
			$('.ui-wysiwyg-dd-btn span').text('Paragraph');

			// loop over buttons and set their status
			$.each(settings.buttons,function(i,v){ $('.ui-wysiwyg-btn-'+v).removeClass('ui-state-hover ui-state-focus'); });
			var elm=event.target ? event.target : event.srcElement;
			do {
				if ( elm.nodeType != 1  ) break;
				var _tag=elm.tagName.toUpperCase();
				if(_tag == 'BODY' || _tag == 'HTML') break;

				//console.log(_tag);

				// some conversions
				if(_tag == 'STRONG') _tag = 'B';


				// set the heading drop down
				switch(_tag){
					case 'ADDRESS':
						$('.ui-wysiwyg-dd-btn span').text('Address');
					break;
					case 'H1':
						$('.ui-wysiwyg-dd-btn span').text('Heading 1');
					break;
					case 'H2':
						$('.ui-wysiwyg-dd-btn span').text('Heading 2');
					break;
					case 'H3':
						$('.ui-wysiwyg-dd-btn span').text('Heading 3');
					break;
					case 'H4':
						$('.ui-wysiwyg-dd-btn span').text('Heading 4');
					break;
					case 'H5':
						$('.ui-wysiwyg-dd-btn span').text('Heading 5');
					break;
					case 'H6':
						$('.ui-wysiwyg-dd-btn span').text('Heading 6');
					break;
				}

				// set the font drop downs
				if(_tag == 'FONT'){
					if(elm.face) $('.ui-wysiwyg-dd-fntbtn span').text(elm.face);
					if(elm.size) $('.ui-wysiwyg-dd-fntszbtn span').text(elm.size);
					if(elm.color) $('.ui-wysiwyg-dd-fntclbtn span').css('background-color', elm.color);
				}

				// set background color
				if($(elm).css('background-color')){
					$('.ui-wysiwyg-dd-fntbgcbtn span').css('background-color', $(elm).css('backgroundColor'));
				}

				// set the justify items
				if($(elm).css('text-align')){
					var _align=$(elm).css('text-align');
					switch(_align){
						case 'right':
							$('.ui-wysiwyg-btn-justifyRight').addClass('ui-state-hover ui-state-focus');
						break;
						case 'left':
							$('.ui-wysiwyg-btn-justifyLeft').addClass('ui-state-hover ui-state-focus');
						break;
						case 'center':
							$('.ui-wysiwyg-btn-justifyCenter').addClass('ui-state-hover ui-state-focus');
						break;
						case 'justify':
							$('.ui-wysiwyg-btn-justifyFull').addClass('ui-state-hover ui-state-focus');
						break;
					}
				}
				if( $('#ui-wysiwyg-btn-'+_tag))$('#ui-wysiwyg-btn-'+_tag).addClass('ui-state-hover ui-state-focus');
			} while ((elm = elm.parentNode));
		}

		// button settings           
		function fnGetButton(type){
			var _result = new Object;
			switch(type){

				case 'backColor':
					_result.text='Background Color';
					_result.class='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-bgc", secondary: "ui-icon-triangle-1-s"}, text: false};
					_result.tag='FONT';
				break;

				case 'forecolor':
					_result.text='Font Color';
					_result.class='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-fontc", secondary: "ui-icon-triangle-1-s"}, text: false};
					_result.tag='FONT';
				break;

				case 'fontSize':
					_result.text='Font Size';
					_result.class='';
					_result.icon={icons: { secondary: "ui-icon-triangle-1-s"}};
					_result.tag='FONT';
				break;

				case 'fonts':
					_result.text='Font';
					_result.class='';
					_result.icon={icons: { secondary: "ui-icon-triangle-1-s"}};
					_result.tag='FONT';
				break;

				case 'heading':
					_result.text='Paragraph';
					_result.class='';
					_result.icon={icons: { secondary: "ui-icon-triangle-1-s"}};
					_result.tag='H';
				break;

				case 'createlink':
					_result.text='Link';
					_result.class='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-link"}, text: false};
					_result.tag='';
				break;

				case 'unlink':
					_result.text='Remove Link';
					_result.class='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-unlink"}, text: false};
					_result.tag='A';
				break;

				case 'italic':
					_result.text='Italic';
					_result.class='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-italic"}, text: false};
					_result.tag='I';
				break;

				case 'bold':
					_result.text='Bold';
					_result.class='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-bold"}, text: false};
					_result.tag='B';
				break;

				case 'underline':
					_result.text='Underline';
					_result.class='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-underline"}, text: false};
					_result.tag='U';
				break;

				case 'strikeThrough':
					_result.text='Strike';
					_result.class='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-strike"}, text: false};
					_result.tag='STRIKE';
				break;

				case 'insertHorizontalRule':
					_result.text='Horizontal Rule';
					_result.class='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-hr"}, text: false};
					_result.tag='HR';
				break;

				case 'insertOrderedList':
					_result.text='Ordered List';
					_result.class='ui-wysiwyg-list';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-ol"}, text: false};
					_result.tag='OL';
				break;

				case 'insertUnorderedList':
					_result.text='Unordered List';
					_result.class='ui-wysiwyg-list';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-ul"}, text: false};
					_result.tag='UL';
				break;

				case 'justifyCenter':
					_result.text='Center';
					_result.class='ui-wysiwyg-justify';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-center"}, text: false};
					_result.tag='CENTER';
				break;

				case 'justifyLeft':
					_result.text='Left';
					_result.class='ui-wysiwyg-justify';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-left"}, text: false};
					_result.tag='';
				break;
				
				case 'justifyFull':
					_result.text='Full';
					_result.class='ui-wysiwyg-justify';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-full"}, text: false};
					_result.tag='';
				break;	
				
				case 'justifyRight':
					_result.text='Right';
					_result.class='ui-wysiwyg-justify';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-right"}, text: false};
					_result.tag='';
				break;

				case 'indent':
					_result.text='Indent';
					_result.class='ui-wysiwyg-dent';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-indent"}, text: false};
					_result.tag='BLOCKQUOTE';
				break;

				case 'outdent':
					_result.text='Outdent';
					_result.class='ui-wysiwyg-dent';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-outdent"}, text: false};
					_result.tag='';
				break;

				case 'superscript':
					_result.text='Superscript';
					_result.class='ui-wysiwyg-script';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-superscript"}, text: false};
					_result.tag='SUP';
				break;

				case 'subscript':
					_result.text='Subscript';
					_result.class='ui-wysiwyg-script';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-subscript"}, text: false};
					_result.tag='SUB';
				break;

				case 'insertImage':
					_result.text='Insert Image';
					_result.class='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-image"}, text: false};
					_result.tag='IMG';
				break;

				case 'removeFormat':
					_result.text='Remove Formating';
					_result.class='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-removeformat"}, text: false};
					_result.tag='';
				break;

				default:
					_result.text=type;
					_result.class='';
					_result.icon=null;
					_result.tag=null;
			}
			return _result;
		}

		// button dialogs (links/images)
		function fnRunDialog(type){
			switch(type){
				case 'createlink':
					$('<div/>', {'title': settings.lng_inserturl}).dialog({
						autoOpen: true,
						modal: true,
						buttons: {
							"Ok": function() {
								fnRunCommand(type, $(this).find('input').val());
								$(this).dialog("close");
								return false;
							},
							"Cancel": function() {
								$(this).dialog("close");
							}
						}
					}).html('<input type="text" value="http://"/>');
				break;	
				
				case 'insertImage':
					$('<div/>', {'title': settings.lng_insertimage}).dialog({
						autoOpen: true,
						modal: true,
						buttons: {
							"Ok": function() {
								fnRunCommand(type, $(this).find('input').val());
								$(this).dialog("close");
								return false;
							},
							"Cancel": function() {
								$(this).dialog("close");
							}
						}
					}).html('<input type="text" value="http://"/>');
				break;
			}
		}

		// execute a execCommand
		function fnRunCommand(cmd, val){

			var contentWindow = editor.contentWindow;
			contentWindow.focus();
			contentWindow.document.execCommand(cmd, false, val);
			contentWindow.focus();
			return false;
		}

		// execute a command, either run dialog or run command
		function fnExecCommand (e) {
			var _ignore=['createlink', 'unlink', 'insertImage', 'removeFormat'];
			
			if($(this).data('class')) $('.'+$(this).data('class')).removeClass('ui-state-active ui-state-focus');
			if(jQuery.inArray($(this).data('commandName'), _ignore) == -1) $(this).toggleClass('ui-state-active ui-state-focus');

			switch($(this).data('commandName')){
				case 'createlink':
					return fnRunDialog($(this).data('commandName'));
				break;
				case 'insertImage':
					return fnRunDialog($(this).data('commandName'));
				break;

				default:
					return fnRunCommand($(this).data('commandName'), '');
			}
		}

    });
};
$.cssHooks.backgroundColor = {
    get: function(elem) {
        if (elem.currentStyle)
            var bg = elem.currentStyle["background-color"];
        else if (window.getComputedStyle)
            var bg = document.defaultView.getComputedStyle(elem,
                null).getPropertyValue("background-color");
        if (bg.search("rgb") == -1)
            return bg;
        else {
            bg = bg.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            function hex(x) {
                return ("0" + parseInt(x).toString(16)).slice(-2);
            }
           if(!bg) return false; 
			return "#" + hex(bg[1]) + hex(bg[2]) + hex(bg[3]);
        }
    }
}