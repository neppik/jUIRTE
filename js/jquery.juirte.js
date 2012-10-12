$.fn.juirte = function(options){
	// based on the example @ http://stackoverflow.com/questions/5281438/how-to-create-a-text-editor-in-jquery
	// icons from http://www.cirkuit.net/projects/tinymce/cirkuitSkin/
	var settings = $.extend({
		lng_inserturl : 'Insert URL',
		lng_insertimage : 'Insert Image',
		width : "400",
		height : "200px",
		colors : ['#FFFFFF', '#C0C0C0', '#808080', '#000000', '#FF0000', '#800000', '#FFFF00', '#808000', '#00FF00', '#008000', '#00FFFF', '#008080', '#0000FF', '#000080', '#FF00FF', '#800080'],
		fontsize : ['1','2','3','4','5','6','7'],
		fonts : ["Arial","Comic Sans MS","Courier New","Monotype Corsiva","Tahoma","Times"],
		buttons: [
			'italic', 'bold', 'underline', 'strikeThrough',
			'spacer','heading', 'fonts', 'fontSize',
			'spacer','removeFormat',
			'spacer', 'insertImage', 'createlink','unlink',
			'row', 'backColor', 'forecolor',
			'spacer', 'justifyCenter', 'justifyFull', 'justifyLeft', 'justifyRight',
			'spacer', 'insertHorizontalRule',
			'spacer', 'insertOrderedList', 'insertUnorderedList',
			'spacer','indent', 'outdent', 'superscript', 'subscript'
		]
	}, options);

	return this.each(function(){

		if($(this).css('width')) settings.width=$(this).css('width');
		if($(this).css('height')) settings.height=$(this).css('height');

		var _id=$(this).attr('id');
		var $this = $(this).hide();
		var _wrapper = '#'+_id+'-wrapper';

		// wrap everything in a widget container
		var _container = $("<div/>",{
			class: 'ui-wysiwyg ui-widget ui-widget-content ui-corner-top ',
			css : { width : settings.width , height : settings.height },
			id: _id+'-wrapper'
		}).resizable();

       $this.before(_container); 

		// write the iframe to be editable
		var editor = $("<iframe/>",{
			css : { height: '100%', width: '100%' },
			frameborder : '0', marginwidth: '0', marginheight: '0',
			class: _id+'-wysiwyg-content ui-wysiwyg-content ',
			id: _id+'-editor'
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
					title: _options.title,
					style: _options.style,
					text : _options.text,
					class : 'ui-wysiwyg-dd-fntbgcbtn  ui-wysiwyg-btn ui-wysiwyg-btn-'+v,
					click : function(){
						$(_wrapper).find('.ui-wysiwyg-fontbgcdropdown').slideToggle('fast');
						var _pos=$(this).offset();
						_pos.top=_pos.top+23;
						$(_wrapper).find('.ui-wysiwyg-fontbgcdropdown').offset(_pos);
					}
				}).button(_options.icon).appendTo(_buttonwrap);

				var _fontmenu=$('<ul/>').html('');
				$.each(settings.colors,function(i,v){
					$('<li/>', {click: function(){$(_wrapper).find('.ui-wysiwyg-dd-fntbgcbtn span').css('background-color', v);fnRunCommand('backColor', v)}}).html('<a href="#" style="background:'+v+'" class="ui-wysiwyg-swatch" title="'+v+'"></a>').appendTo(_fontmenu);
				});

				var _colorinput=$('<input>',{
					type: 'text',
					class: 'ui-wysiwyg-colorinput',
					keypress: function(e) {if( e.keyCode == 13 ) fnRunCommand('backColor', $(this).val())}
				});

				$('<div/>',{
					class : 'ui-wysiwyg-dropdown ui-wysiwyg-fontbgcdropdown ui-widget ui-widget-content ui-corner-all',
					style: ' margin: 0px'
				}).append(_fontmenu).append(_colorinput).appendTo(_container);
				_fontmenu.column_list({ columns: 4 });


			} else if(v == 'forecolor'){
				var _fontlink=$("<a/>",{
					href : "#",
					title: _options.title,
					style: _options.style,
					text : _options.text,
					class : 'ui-wysiwyg-dd-fntclbtn  ui-wysiwyg-btn ui-wysiwyg-btn-'+v,
					click : function(){
						$(_wrapper).find('.ui-wysiwyg-fontcldropdown').slideToggle('fast');
						var _pos=$(this).offset();
						_pos.top=_pos.top+23;
						$(_wrapper).find('.ui-wysiwyg-fontcldropdown').offset(_pos);
					}
				}).button(_options.icon).appendTo(_buttonwrap);

				var _fontmenu=$('<ul/>').html('');
				$.each(settings.colors,function(i,v){
					$('<li/>', {click: function(){$(_wrapper).find('.ui-wysiwyg-dd-fntclbtn span').css('background-color', v);fnRunCommand('forecolor', v)}}).html('<a href="#" style="background:'+v+'" class="ui-wysiwyg-swatch" title="'+v+'"></a>').appendTo(_fontmenu);
				});

				var _colorinput=$('<input>',{
					type: 'text',
					class: 'ui-wysiwyg-colorinput',
					keypress: function(e) {if( e.keyCode == 13 ) fnRunCommand('forecolor', $(this).val())}
				});
				
				$('<div/>',{
					class : 'ui-wysiwyg-dropdown ui-wysiwyg-fontcldropdown ui-widget ui-widget-content ui-corner-all',
					style: ' margin: 0px'
				}).append(_fontmenu).append(_colorinput).appendTo(_container);
				_fontmenu.column_list({ columns: 4 });


			} else if(v == 'fontSize'){
				var _fontlink=$("<a/>",{
					href : "#",
					title: _options.title,
					style: _options.style,
					text : _options.text,
					class : 'ui-wysiwyg-dd-fntszbtn  ui-wysiwyg-btn ui-wysiwyg-btn-'+v,
					click : function(){
						$(_wrapper).find('.ui-wysiwyg-fontszdropdown').slideToggle('fast');
						var _pos=$(this).offset();
						_pos.top=_pos.top+23;
						$(_wrapper).find('.ui-wysiwyg-fontszdropdown').offset(_pos);

					}
				}).button(_options.icon).appendTo(_buttonwrap);

				var _fontmenu=$('<ul/>').html('');
				$.each(settings.fontsize,function(i,v){
					$('<li/>', {click: function(){$(_wrapper).find('.ui-wysiwyg-dd-fntszbtn span').text(v);fnRunCommand('fontSize', v)}}).html('<a href="#"><font size="'+v+'">'+v+'</font></a>').appendTo(_fontmenu);
				});

				$('<div/>',{
					class : 'ui-wysiwyg-dropdown ui-wysiwyg-fontszdropdown ui-widget ui-widget-content ui-corner-all',
					style: ' margin: 0px'
				}).append(_fontmenu).appendTo(_container);
			} else if(v == 'fonts'){
				var _fontlink=$("<a/>",{
					href : "#",
					title: _options.title,
					style: _options.style,
					text : _options.text,
					class : 'ui-wysiwyg-dd-fntbtn  ui-wysiwyg-btn ui-wysiwyg-btn-'+v,
					click : function(){
						$(_wrapper).find('.ui-wysiwyg-fontdropdown').slideToggle('fast');
						var _pos=$(this).offset();
						_pos.top=_pos.top+23;
						$(_wrapper).find('.ui-wysiwyg-fontdropdown').offset(_pos);
					}
				}).button(_options.icon).appendTo(_buttonwrap);

				var _fontmenu=$('<ul/>').html('');
				$.each(settings.fonts,function(i,v){
					$('<li/>', {click: function(){$(_wrapper).find('.ui-wysiwyg-dd-fntbtn span').text(v);fnRunCommand('FontName', v)}}).html('<a href="#"><font face="'+v+'">'+v+'</font></a>').appendTo(_fontmenu);
				});

				$('<div/>',{
					class : 'ui-wysiwyg-dropdown ui-wysiwyg-fontdropdown ui-widget ui-widget-content ui-corner-all',
					style: ' margin: 0px'
				}).append(_fontmenu).appendTo(_container);
			} else if(v == 'heading'){
				var _headmenu=$("<a/>",{
					href : "#",
					title: _options.title,
					style: _options.style,
					text : _options.text,
					class : 'ui-wysiwyg-dd-btn ui-wysiwyg-btn ui-wysiwyg-btn-'+v,
					click : function(){
						$(_wrapper).find('.ui-wysiwyg-hddropdown').slideToggle('fast')
						var _pos=$(this).offset();
						_pos.top=_pos.top+23;
						$(_wrapper).find('.ui-wysiwyg-hddropdown').offset(_pos);
					}
				}).button(_options.icon).appendTo(_buttonwrap);

				var _headermenu=$('<ul/>').html('');
				//TO-DO: make from array
				$('<li/>', {click: function(){$(_wrapper).find('.ui-wysiwyg-dd-btn span').text('Paragraph');fnRunCommand('formatBlock', '<p>')}}).html('<a href="#">Paragraph</a>').appendTo(_headermenu);
				$('<li/>', {click: function(){$(_wrapper).find('.ui-wysiwyg-dd-btn span').text('Address');fnRunCommand('formatBlock', '<address>')}}).html('<a href="#"><address>Address</address></a>').appendTo(_headermenu);
				$('<li/>', {click: function(){$(_wrapper).find('.ui-wysiwyg-dd-btn span').text('Heading 1');fnRunCommand('formatBlock', '<h1>')}}).html('<a href="#"><h1>Heading 1</h1></a>').appendTo(_headermenu);
				$('<li/>', {click: function(){$(_wrapper).find('.ui-wysiwyg-dd-btn span').text('Heading 2');fnRunCommand('formatBlock', '<h2>')}}).html('<a href="#"><h2>Heading 2</h2></a>').appendTo(_headermenu);
				$('<li/>', {click: function(){$(_wrapper).find('.ui-wysiwyg-dd-btn span').text('Heading 3');fnRunCommand('formatBlock', '<h3>')}}).html('<a href="#"><h3>Heading 3</h3></a>').appendTo(_headermenu);
				$('<li/>', {click: function(){$(_wrapper).find('.ui-wysiwyg-dd-btn span').text('Heading 4');fnRunCommand('formatBlock', '<h4>')}}).html('<a href="#"><h4>Heading 4</h4></a>').appendTo(_headermenu);
				$('<li/>', {click: function(){$(_wrapper).find('.ui-wysiwyg-dd-btn span').text('Heading 5');fnRunCommand('formatBlock', '<h5>')}}).html('<a href="#"><h5>Heading 5</h5></a>').appendTo(_headermenu);
				$('<li/>', {click: function(){$(_wrapper).find('.ui-wysiwyg-dd-btn span').text('Heading 6');fnRunCommand('formatBlock', '<h6>')}}).html('<a href="#"><h6>Heading 6</h6></a>').appendTo(_headermenu);

				$('<div/>',{
					class : 'ui-wysiwyg-dropdown ui-wysiwyg-hddropdown ui-widget ui-widget-content ui-corner-all',
					style: 'font-size: 60%; margin: 0px'
				}).append(_headermenu).appendTo(_container);
			} else {
				$("<a/>",{
					href : "#",
					title: _options.title,
					style: _options.style,
					html : _options.text,
					class : 'ui-wysiwyg-btn ui-wysiwyg-btn-'+v+' ui-wysiwyg-btn-'+_options.tag+' '+_options.class,
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
	
		// fix lack of height from menu so items below show properly after the editor
		$('<div/>').height(wysiwyg_menu.height()).insertAfter(_container);


		// hide any drop down when clicked
		$(document).bind('click', function (e) {
			if(!$(e.target).parents().hasClass('ui-wysiwyg-dropdown')){
				if (!$(e.target).parents().hasClass('ui-wysiwyg-dd-btn'))$('.ui-wysiwyg-hddropdown').slideUp();
				if (!$(e.target).parents().hasClass('ui-wysiwyg-dd-fntbtn'))$('.ui-wysiwyg-fontdropdown').slideUp();
				if (!$(e.target).parents().hasClass('ui-wysiwyg-dd-fntszbtn'))$('.ui-wysiwyg-fontszdropdown').slideUp();
				if (!$(e.target).parents().hasClass('ui-wysiwyg-dd-fntclbtn'))$('.ui-wysiwyg-fontcldropdown').slideUp();
				if (!$(e.target).parents().hasClass('ui-wysiwyg-dd-fntbgcbtn'))$('.ui-wysiwyg-fontbgcdropdown').slideUp();
			}
		});

		// disable css modes
		function fnDisableCSS(){
			try {
                editor.execCommand("styleWithCSS", 0, false);
            } catch (e) {
                try {
                    editor.execCommand("useCSS", 0, true);
                } catch (e) {
                    try {
                        editor.execCommand('styleWithCSS', false, false);
                    }
                    catch (e) {
                    }
                }
            }
		}
		
		// set button states if the editor has the tag
		function fnSetButtons(event){
			// reset dropdowns
			//TO-DO: make from array or find optimzation
			$(_wrapper).find('.ui-wysiwyg-dd-fntbtn span').text('Font');
			$(_wrapper).find('.ui-wysiwyg-dd-fntszbtn span').text('Font Size');
			$(_wrapper).find('.ui-wysiwyg-dd-fntclbtn').button({icons: { secondary: "ui-icon-triangle-1-s"}});
			$(_wrapper).find('.ui-wysiwyg-dd-fntbgcbtn').button({icons: { secondary: "ui-icon-triangle-1-s"}});
			$(_wrapper).find('.ui-wysiwyg-dd-btn span').text('Paragraph');
			$(_wrapper).find('.ui-wysiwyg-fontcldropdown .ui-wysiwyg-colorinput').val('');
			$(_wrapper).find('.ui-wysiwyg-fontbgcdropdown .ui-wysiwyg-colorinput').val('');


			// loop over buttons and set their status
			$.each(settings.buttons,function(i,v){ $(_wrapper).find('.ui-wysiwyg-btn-'+v).removeClass('ui-state-hover ui-state-focus'); });
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
						$(_wrapper).find('.ui-wysiwyg-dd-btn span').text('Address');
					break;
					case 'H1':
						$(_wrapper).find('.ui-wysiwyg-dd-btn span').text('Heading 1');
					break;
					case 'H2':
						$(_wrapper).find('.ui-wysiwyg-dd-btn span').text('Heading 2');
					break;
					case 'H3':
						$(_wrapper).find('.ui-wysiwyg-dd-btn span').text('Heading 3');
					break;
					case 'H4':
						$(_wrapper).find('.ui-wysiwyg-dd-btn span').text('Heading 4');
					break;
					case 'H5':
						$(_wrapper).find('.ui-wysiwyg-dd-btn span').text('Heading 5');
					break;
					case 'H6':
						$(_wrapper).find('.ui-wysiwyg-dd-btn span').text('Heading 6');
					break;
				}

				// set the font drop downs
				if(_tag == 'FONT'){
					if(elm.face) $(_wrapper).find('.ui-wysiwyg-dd-fntbtn span').text(elm.face);
					if(elm.size) $(_wrapper).find('.ui-wysiwyg-dd-fntszbtn span').text(elm.size);
					if(elm.color){
						$(_wrapper).find('.ui-wysiwyg-dd-fntclbtn span').css('background-color', elm.color);
						$(_wrapper).find('.ui-wysiwyg-fontcldropdown .ui-wysiwyg-colorinput').val(elm.color);
					}

				}

				// set background color
				if($(elm).css('background-color')){
					if($(elm).css('backgroundColor') != 'transparent'){
						$(_wrapper).find('.ui-wysiwyg-dd-fntbgcbtn span').css('background-color', $(elm).css('backgroundColor'));
						$(_wrapper).find('.ui-wysiwyg-fontbgcdropdown .ui-wysiwyg-colorinput').val($(elm).css('backgroundColor'));
					}
				}

				// set the justify items
				if($(elm).css('text-align')){
					var _align=$(elm).css('text-align');
					switch(_align){
						case 'right':
							$(_wrapper).find('.ui-wysiwyg-btn-justifyRight').addClass('ui-state-hover ui-state-focus');
						break;
						case 'left':
							$(_wrapper).find('.ui-wysiwyg-btn-justifyLeft').addClass('ui-state-hover ui-state-focus');
						break;
						case 'center':
							$(_wrapper).find('.ui-wysiwyg-btn-justifyCenter').addClass('ui-state-hover ui-state-focus');
						break;
						case 'justify':
							$(_wrapper).find('.ui-wysiwyg-btn-justifyFull').addClass('ui-state-hover ui-state-focus');
						break;
					}
				}
				if( $(_wrapper).find('.ui-wysiwyg-btn-'+_tag))$(_wrapper).find('.ui-wysiwyg-btn-'+_tag).addClass('ui-state-hover ui-state-focus');
			} while ((elm = elm.parentNode));
		}

		// button settings           
		function fnGetButton(type){
			var _result = new Object;

			_result.style=null;
			_result.class=null;
			_result.title=null;
			_result.icon=null;

			switch(type){

				case 'backColor':
					_result.title='Background Color';
					_result.text='BG';
					_result.class='';
					_result.icon={icons: {secondary: "ui-icon-triangle-1-s"}};
					_result.tag='FONT';
				break;

				case 'forecolor':
					_result.title='Font Color';
					_result.text='A';
					_result.style='text-decoration: underline';
					_result.class='';
					_result.icon={icons: { secondary: "ui-icon-triangle-1-s"}};
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
					_result.icon={icons: { primary: "ui-icon-link"}, text: false};
					_result.tag='';
				break;

				case 'unlink':
					_result.text='Remove Link';
					_result.class='';
					_result.icon={icons: { primary: "ui-icon-cancel"}, text: false};
					_result.tag='A';
				break;

				case 'italic':
					_result.title='Italic';
					_result.text='I';
					_result.style='font-style: italic';
					_result.class='';
					_result.icon=null;
					_result.tag='I';
				break;

				case 'bold':
					_result.title='Bold';
					_result.text='B';
					_result.style='font-weight: bold';
					_result.class='';
					_result.icon=null;
					_result.tag='B';
				break;

				case 'underline':
					_result.title='Underline';
					_result.text='U';
					_result.style='text-decoration: underline';
					_result.class='';
					_result.icon=null;
					_result.tag='U';
				break;

				case 'strikeThrough':
					_result.title='Strike';
					_result.text='S';
					_result.style='text-decoration: line-through';
					_result.class='';
					_result.icon=null;
					_result.tag='STRIKE';
				break;

				case 'insertHorizontalRule':
					_result.text='Horizontal Rule';
					_result.class='';
					_result.icon={icons: { primary: "ui-icon-minusthick"}, text: false};
					_result.tag='HR';
				break;

				case 'insertOrderedList':
					_result.title='Ordered List';
					_result.text='<div class="ui-wysiwyg-list-wrap">1 ---<br>2 ---<br>3 ---</div>';
					_result.class='ui-wysiwyg-list';
					_result.icon=null;
					_result.tag='OL';
				break;

				case 'insertUnorderedList':
					_result.title='Unordered List';
					_result.text='<div class="ui-wysiwyg-list-wrap">&bull; ---<br>&bull; ---<br>&bull; ---</div>';
					_result.class='ui-wysiwyg-list';
					_result.icon=null;
					_result.tag='UL';
				break;

				case 'justifyCenter':
					_result.text='<div class="ui-wysiwyg-justify-wrap ui-wysiwyg-justify-center">__<br>_<br>__<br>_<br>__<br>_<br>__<br><br></div>';
					_result.title='Center';
					_result.class='ui-wysiwyg-justify';
					_result.icon=null;
					_result.style='';
					_result.tag='CENTER';
				break;

				case 'justifyLeft':
					_result.text='<div class="ui-wysiwyg-justify-wrap">__<br>_<br>__<br>_<br>__<br>_<br>__<br><br></div>';
					_result.title='Left';
					_result.class='ui-wysiwyg-justify';
					_result.icon=null;
					_result.tag='';
				break;
				
				case 'justifyFull':
					_result.text='<div class="ui-wysiwyg-justify-wrap">__<br>__<br>__<br>__<br>__<br>__<br>__<br><br></div>';
					_result.title='Full';
					_result.class='ui-wysiwyg-justify';
					_result.icon=null;
					_result.tag='';
				break;	
				
				case 'justifyRight':
					_result.text='<div class="ui-wysiwyg-justify-wrap ui-wysiwyg-justify-right">__<br>_<br>__<br>_<br>__<br>_<br>__<br><br></div>';
					_result.title='Right';
					_result.class='ui-wysiwyg-justify';
					_result.icon=null;
					_result.tag='';
				break;

				case 'indent':
					_result.text='Indent';
					_result.class='ui-wysiwyg-dent';
					_result.icon={icons: { primary: "ui-icon-arrowthickstop-1-e"}, text: false};
					_result.tag='BLOCKQUOTE';
				break;

				case 'outdent':
					_result.text='Outdent';
					_result.class='ui-wysiwyg-dent';
					_result.icon={icons: { primary: "ui-icon-arrowthickstop-1-w"}, text: false};
					_result.tag='';
				break;

				case 'superscript':
					_result.text='x<sup>2</sup>';
					_result.title='Superscript';
					_result.class='ui-wysiwyg-script';
					_result.icon=null;
					_result.tag='SUP';
				break;

				case 'subscript':
					_result.text='x<sub>2</sub>';
					_result.title='Subscript';
					_result.class='ui-wysiwyg-script';
					_result.icon=null;
					_result.tag='SUB';
				break;

				case 'insertImage':
					_result.text='Insert Image';
					_result.class='';
					_result.icon={icons: { primary: "ui-icon-image"}, text: false};
					_result.tag='IMG';
				break;

				case 'removeFormat':
					_result.text='Remove Formating';
					_result.class='';
					_result.icon={icons: { primary: "ui-icon-pencil"}, text: false};
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
			// if command is ran lets hide the menus
			$('.ui-wysiwyg-dropdown').slideUp();
			var contentWindow = editor.contentWindow;
			contentWindow.focus();
			contentWindow.document.execCommand(cmd, false, val);
			contentWindow.focus();
			return false;
		}

		// execute a command, either run dialog or run command
		function fnExecCommand (e) {
			var _ignore=['createlink', 'unlink', 'insertImage', 'removeFormat'];
			
			if($(this).data('class')) $(_wrapper).find('.'+$(this).data('class')).removeClass('ui-state-active ui-state-focus');
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

$.extend($.ui.dialog.prototype.options, { 
    open: function() {
        var $this = $(this);
        $this.parent().find('.ui-dialog-buttonpane button:first').focus();
        $this.keypress(function(e) {
            if( e.keyCode == 13 ) {
                $this.parent().find('.ui-dialog-buttonpane button:first').click();
                return false;
            }
        });
    } 
});

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

 $.fn.column_list = function(options) {
	var settings = $.extend({
		columns : 4
	}, options);
	var obj = $(this);
	var j = 1;
			
	this.each(function() {
		
		var totalListElements = $(this).children('li').size();
		var baseColItems = Math.ceil(totalListElements / settings.columns);
		
		for (i=1;i<=settings.columns;i++){	
			if(i==1){
				$(this).addClass('listCol1').wrap('<div class="ui-list-wrapper ui-list-wrapper-'+j+'"></div>');
			} else if($(this).is('ul'))	$(this).parents('.ui-list-wrapper-'+j).append('<ul class="listCol'+i+'"></ul>');
		}
		
		var listItem = 0;
		var k = 1;
		var l = 0;	
		
		$(this).children('li').each(function(){
			listItem = listItem+1;
			if (listItem > baseColItems*(settings.columns-1) ){
				$(this).parents('.ui-list-wrapper-'+j).find('.listCol'+settings.columns).append(this);
			} else {
				if(listItem<=(baseColItems*k)){
					$(this).parents('.ui-list-wrapper-'+j).find('.listCol'+k).append(this);
				}else{
					$(this).parents('.ui-list-wrapper-'+j).find('.listCol'+(k+1)).append(this);
					k = k+1;
				}
			}
		});
		j = j+1;		
	});
};