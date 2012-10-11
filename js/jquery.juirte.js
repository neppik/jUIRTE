$.fn.wysiwyg = function(options){
	// based on the example @ http://stackoverflow.com/questions/5281438/how-to-create-a-text-editor-in-jquery
	// icons from http://www.cirkuit.net/projects/tinymce/cirkuitSkin/
	var settings = $.extend({
		lng_inserturl : 'Insert URL',
		lng_insertimage : 'Insert Image',
		width : "400",
		height : "200px",
		fonts : ["Arial","Comic Sans MS","Courier New","Monotype Corsiva","Tahoma","Times"],
		showfonts: false,
		buttons: [
			'heading',
			'spacer','removeFormat',
			'spacer', 'insertImage', 'createlink','unlink',
			'spacer', 'justifyCenter', 'justifyFull', 'justifyLeft', 'justifyRight',
			'row', 'italic', 'bold', 'underline', 'strikeThrough',
			'spacer', 'insertHorizontalRule', 'insertOrderedList', 'insertUnorderedList',
			'row','indent', 'outdent', 'superscript', 'subscript'
		]
	}, options);
/* to-do:
'selectAll', 'undo', 'redo', 'delete', 'cut', 'copy', 'paste',
removeFormat
hiliteColor
formatBlock
foreColor
fontSize
  'insertParagraph'
, 'increasefontsize', 'decreaseFontSize', 'heading' 
*/


	return this.each(function(){

		if($(this).css('width')) settings.width=$(this).css('width');
		if($(this).css('height')) settings.height=$(this).css('height');

		var _id=$(this).attr('id');
		var $this = $(this).hide();

		var containerDiv = $("<div/>",{
			class: 'ui-wysiwyg ui-widget ui-widget-content ui-corner-top ',
			css : {
				width : settings.width ,
				height : settings.height
			}
		}).resizable();
       $this.after(containerDiv); 

       var editor = $("<iframe/>",{
   			css : { height: '100%', width: '100%' },
			frameborder : "0",
		   class: _id+'-wysiwyg-content ui-wysiwyg-content ',
       }).appendTo(containerDiv).get(0);

		editor.contentWindow.document.open();
		if($(this).val()) editor.contentWindow.document.write($(this).val());
		editor.contentWindow.document.close();
		editor.contentWindow.document.designMode="on";

		// update original textarea when contents change
		$('.'+_id+'-wysiwyg-content').contents().bind("keyup keydown keypress focus blur", function() {
			$('#'+_id).val($('.ui-wysiwyg-content').contents().find('body').html());
		})

		// set buttons to focus/hover state when elements are selected
		$('.'+_id+'-wysiwyg-content').contents().bind('click focus blur',function(event){fnSetButtons(event)});



		function fnSetButtons(event){
			$.each(settings.buttons,function(i,v){ $('.ui-wysiwyg-btn-'+v).removeClass('ui-state-hover ui-state-focus'); });
			var elm=event.target ? event.target : event.srcElement;
			do {
				if ( elm.nodeType != 1  ) break;
				var _tag=elm.tagName.toUpperCase();
				if(_tag == 'BODY' || _tag == 'HTML') break;

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
					default:
						$('.ui-wysiwyg-dd-btn span').text('Paragraph');
				}

				if(_tag == 'DIV'){
					switch(elm.getAttribute('style')){
						case 'text-align: right;':
							$('.ui-wysiwyg-btn-justifyRight').addClass('ui-state-hover ui-state-focus');
						break;
						case 'text-align: left;':
							$('.ui-wysiwyg-btn-justifyLeft').addClass('ui-state-hover ui-state-focus');
						break;
						case 'text-align: center;':
							$('.ui-wysiwyg-btn-justifyCenter').addClass('ui-state-hover ui-state-focus');
						break;
						case 'text-align: justify;':
							$('.ui-wysiwyg-btn-justifyFull').addClass('ui-state-hover ui-state-focus');
						break;
					}
				}
				if( $('#ui-wysiwyg-btn-'+_tag))$('#ui-wysiwyg-btn-'+_tag).addClass('ui-state-hover ui-state-focus');
			} while ((elm = elm.parentNode));
		}
	

		// append menu container to overall container
		var wysiwyg_menu = $("<div/>",{
			"class" : "ui-widget ui-widget-content ui-widget-header ui-corner-bottom  ui-wysiwyg-menu",
			css : { width : '100%' }
		}).appendTo(containerDiv);

		// append button container to menu container
		var buttonPane = $("<div/>",{
			"class" : "ui-wysiwyg-menu-wrap",
			css : {
				width : '100%'
			}
		}).appendTo(wysiwyg_menu);

		//containerDiv.append($('<div/>', { 'class': 'ui-helper-clearfix', css: { 'height': '100px', 'border': '1px solid blue'}}));


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
				_buttonwrap.buttonset().appendTo(buttonPane);
				_buttonwrap=$('<div/>', {class: _class});
			} else if(v == 'heading'){
				$("<a/>",{
					href : "#",
					text : _options.text,
					class : 'ui-wysiwyg-dd-btn ui-wysiwyg-btn ui-wysiwyg-btn-'+v,
					id: 'ui-wysiwyg-btn-'+_options.tag,
					click : function(){$(this).parent().find('.ui-wysiwyg-dropdown').slideToggle('fast')}
				}).button(_options.icon).appendTo(_buttonwrap);

				var _headermenu=$('<ul/>').html('');

				$('<li/>', {click: function(){$('.ui-wysiwyg-dd-btn span').text('Paragraph');fnRunCommand('formatBlock', '<p>')}}).html('Paragraph').appendTo(_headermenu);
				$('<li/>', {click: function(){$('.ui-wysiwyg-dd-btn span').text('Address');fnRunCommand('formatBlock', '<address>')}}).html('<address>Address</address>').appendTo(_headermenu);
				$('<li/>', {click: function(){$('.ui-wysiwyg-dd-btn span').text('Heading 1');fnRunCommand('formatBlock', '<h1>')}}).html('<h1>Heading 1</h1>').appendTo(_headermenu);
				$('<li/>', {click: function(){$('.ui-wysiwyg-dd-btn span').text('Heading 2');fnRunCommand('formatBlock', '<h2>')}}).html('<h2>Heading 2</h2>').appendTo(_headermenu);
				$('<li/>', {click: function(){$('.ui-wysiwyg-dd-btn span').text('Heading 3');fnRunCommand('formatBlock', '<h3>')}}).html('<h3>Heading 3</h3>').appendTo(_headermenu);
				$('<li/>', {click: function(){$('.ui-wysiwyg-dd-btn span').text('Heading 4');fnRunCommand('formatBlock', '<h4>')}}).html('<h4>Heading 4</h4>').appendTo(_headermenu);
				$('<li/>', {click: function(){$('.ui-wysiwyg-dd-btn span').text('Heading 5');fnRunCommand('formatBlock', '<h5>')}}).html('<h5>Heading 5</h5>').appendTo(_headermenu);
				$('<li/>', {click: function(){$('.ui-wysiwyg-dd-btn span').text('Heading 6');fnRunCommand('formatBlock', '<h6>')}}).html('<h6>Heading 6</h6>').appendTo(_headermenu);

				$('<div/>',{
					class : 'ui-wysiwyg-dropdown ui-widget ui-widget-content ui-corner-all',
					style: 'font-size: 60%; margin: 0px'
				}).append(_headermenu).appendTo(_buttonwrap);


				$(document).bind('click', function (e) {
					// hack
					if (e.target.className != 'ui-button-text') {
						$('.ui-wysiwyg-dropdown').slideUp();
					}
				});

			} else {
				$("<a/>",{
					href : "#",
					text : _options.text,
					class : 'ui-wysiwyg-btn ui-wysiwyg-btn-'+v,
					id: 'ui-wysiwyg-btn-'+_options.tag,
					data : {
						commandName : v,
						commandValue: _options.value
					},
					click : fnExecCommand 
				}).button(_options.icon).appendTo(_buttonwrap);
			}
		}); 

		_buttonwrap.buttonset().appendTo(buttonPane);
		buttonPane.append($('<div/>', { class: 'ui-helper-clearfix'}));
		


		if(settings.showfonts == true){
			var selectFont = $("<select/>",{
				class: 'ui-wysiwyg-select',
				data : {
					commandName : "FontName"
				},
				change : fnExecCommand
			}).appendTo(buttonPane); 
			
			$.each(settings.fonts,function(i,v){
				$("<option/>",{
					value : v,
					text : v
				}).appendTo(selectFont);
			}); 
		}
            
		function fnGetButton(type){
			var _result = new Object;


			switch(type){
				case 'heading':
					_result.text='Paragraph';
					_result.value='';
					_result.icon={icons: { secondary: "ui-icon-triangle-1-s"}};
					_result.tag='H';
				break;

				case 'createlink':
					_result.text='Link';
					_result.value='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-link"}, text: false};
					_result.tag='A';
				break;

				case 'unlink':
					_result.text='Remove Link';
					_result.value='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-unlink"}, text: false};
					_result.tag='';
				break;

				case 'italic':
					_result.text='Italic';
					_result.value='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-italic"}, text: false};
					_result.tag='I';
				break;

				case 'bold':
					_result.text='Bold';
					_result.value='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-bold"}, text: false};
					_result.tag='B';
				break;

				case 'underline':
					_result.text='Underline';
					_result.value='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-underline"}, text: false};
					_result.tag='U';
				break;

				case 'strikeThrough':
					_result.text='Strike';
					_result.value='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-strike"}, text: false};
					_result.tag='STRIKE';
				break;

				case 'insertHorizontalRule':
					_result.text='Horizontal Rule';
					_result.value='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-hr"}, text: false};
					_result.tag='HR';
				break;

				case 'insertOrderedList':
					_result.text='Ordered List';
					_result.value='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-ol"}, text: false};
					_result.tag='OL';
				break;

				case 'insertUnorderedList':
					_result.text='Unordered List';
					_result.value='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-ul"}, text: false};
					_result.tag='UL';
				break;

				case 'justifyCenter':
					_result.text='Center';
					_result.value='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-center"}, text: false};
					_result.tag='CENTER';
				break;

				case 'justifyLeft':
					_result.text='Left';
					_result.value='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-left"}, text: false};
					_result.tag='';
				break;
				
				case 'justifyFull':
					_result.text='Full';
					_result.value='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-full"}, text: false};
					_result.tag='';
				break;	
				
				case 'justifyRight':
					_result.text='Right';
					_result.value='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-right"}, text: false};
					_result.tag='';
				break;

				case 'indent':
					_result.text='Indent';
					_result.value='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-indent"}, text: false};
					_result.tag='BLOCKQUOTE';
				break;

				case 'outdent':
					_result.text='Outdent';
					_result.value='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-outdent"}, text: false};
					_result.tag='';
				break;

				case 'superscript':
					_result.text='Superscript';
					_result.value='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-superscript"}, text: false};
					_result.tag='';
				break;

				case 'subscript':
					_result.text='Subscript';
					_result.value='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-subscript"}, text: false};
					_result.tag='';
				break;

				case 'insertImage':
					_result.text='Insert Image';
					_result.value='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-image"}, text: false};
					_result.tag='IMG';
				break;

				case 'removeFormat':
					_result.text='Remove Formating';
					_result.value='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-removeformat"}, text: false};
					_result.tag='';
				break;

				default:
					_result.text=type;
					_result.value='';
					_result.icon=null;
					_result.tag=null;
			}
			return _result;
		}

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

		function fnRunCommand(cmd, val){
			var contentWindow = editor.contentWindow;
			contentWindow.focus();
			contentWindow.document.execCommand(cmd, false, val);
			contentWindow.focus();
			return false;
		}

		function fnExecCommand (e) {
			// to-do: need to check if element should unset other items like, LEFT justify should untoggle all other justifies
			$(this).toggleClass('ui-state-active ui-state-focus');

			switch($(this).data('commandName')){
				case 'createlink':
					return fnRunDialog($(this).data('commandName'));
				break;
				case 'insertImage':
					return fnRunDialog($(this).data('commandName'));
				break;

				default:
					return fnRunCommand($(this).data('commandName'), $(this).data('commandValue'));
			}

		}

		
    });
};